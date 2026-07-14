import os
import glob
import re
from typing import List, Dict, Any

# We'll try to import langchain and chromadb, but fall back to a custom keyword search if imports or execution fails.
USE_CHROMA = True
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_google_genai import GoogleGenerativeAIEmbeddings
    # If no key, we can try using HuggingFaceEmbeddings or mock embeddings
    import chromadb
except ImportError:
    USE_CHROMA = False

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "chroma_db")

class RAGPipeline:
    def __init__(self):
        self.use_chroma = USE_CHROMA
        self.chroma_client = None
        self.collection = None
        self.chunks: List[Dict[str, Any]] = []  # Fallback chunks storage
        
        # Load local guides to build our fallback or to seed Chroma
        self._load_local_documents()
        
        # Try to initialize Chroma
        if self.use_chroma:
            try:
                # Initialize chromadb persistent client
                self.chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
                # Check for Gemini API key for embeddings
                api_key = os.getenv("GEMINI_API_KEY")
                
                if api_key:
                    # We can use Chroma with a custom embedding function or we can let Chroma use its default sentence-transformers
                    # For simplicity and reliability across platforms, we will store documents in Chroma 
                    # with its default or Gemini embeddings if we build custom embeddings, or just pass text and let Chroma handle it.
                    # Chroma's default is sentence-transformers/all-MiniLM-L6-v2 which runs locally.
                    self.collection = self.chroma_client.get_or_create_collection("travel_knowledge")
                    self._seed_chroma()
                else:
                    # No API key, Chroma can run with default embeddings or we fall back
                    print("RAG: GEMINI_API_KEY not found. Operating Chroma with default local embeddings.")
                    self.collection = self.chroma_client.get_or_create_collection("travel_knowledge")
                    self._seed_chroma()
            except Exception as e:
                print(f"RAG: ChromaDB initialization failed: {e}. Falling back to keyword search.")
                self.use_chroma = False

    def _load_local_documents(self):
        """Loads markdown guides from data/ folder."""
        self.chunks = []
        md_files = glob.glob(os.path.join(DATA_DIR, "*.md"))
        
        # Simple text splitter logic
        for filepath in md_files:
            filename = os.path.basename(filepath)
            dest_name = os.path.splitext(filename)[0].capitalize()
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                # Split document by headers or double newlines to make chunks
                paragraphs = re.split(r'\n(?=#+ )', content)
                for idx, para in enumerate(paragraphs):
                    para_stripped = para.strip()
                    if not para_stripped:
                        continue
                    
                    self.chunks.append({
                        "id": f"{filename}_{idx}",
                        "text": para_stripped,
                        "metadata": {
                            "source": filename,
                            "destination": dest_name
                        }
                    })
            except Exception as e:
                print(f"RAG: Error reading {filepath}: {e}")

    def _seed_chroma(self):
        """Seeds ChromaDB collection with the loaded document chunks if collection is empty."""
        if not self.collection:
            return
        
        # Check current document count
        count = self.collection.count()
        if count == 0 and self.chunks:
            ids = [c["id"] for c in self.chunks]
            documents = [c["text"] for c in self.chunks]
            metadatas = [c["metadata"] for c in self.chunks]
            
            # Add to Chroma
            # Note: Chroma will automatically embed them using its built-in sentence-transformers if no custom embedding is specified.
            self.collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids
            )
            print(f"RAG: Seeded {len(self.chunks)} chunks into ChromaDB.")

    def search(self, query: str, destination: str = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """Searches vector DB or keyword index for matching chunks."""
        # Clean query
        query_clean = query.lower().strip()
        
        # If destination is specified, try to filter results or prioritize destination
        dest_clean = destination.lower().strip() if destination else None
        
        # Use ChromaDB if available
        if self.use_chroma and self.collection:
            try:
                # Query Chroma
                where_clause = {}
                if dest_clean:
                    # Normalize destination search (e.g. Paris, Tokyo)
                    # We look for partial or exact match
                    where_clause = {"destination": destination.capitalize()}
                
                results = self.collection.query(
                    query_texts=[query],
                    n_results=top_k,
                    where=where_clause if dest_clean else None
                )
                
                hits = []
                if results and 'documents' in results and results['documents']:
                    docs = results['documents'][0]
                    metas = results['metadatas'][0] if 'metadatas' in results else [{}] * len(docs)
                    ids = results['ids'][0] if 'ids' in results else [f"chroma_{i}" for i in range(len(docs))]
                    
                    for i in range(len(docs)):
                        hits.append({
                            "id": ids[i],
                            "text": docs[i],
                            "metadata": metas[i]
                        })
                if hits:
                    return hits
            except Exception as e:
                print(f"RAG: Chroma search failed: {e}. Trying fallback keyword search.")
        
        # Fallback Keyword Search Engine
        return self._keyword_search(query_clean, dest_clean, top_k)

    def _keyword_search(self, query: str, destination: str = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """Simple keyword matching system for fallback search."""
        query_words = set(re.findall(r'\w+', query.lower()))
        
        scored_chunks = []
        for chunk in self.chunks:
            chunk_text = chunk["text"].lower()
            chunk_dest = chunk["metadata"]["destination"].lower()
            
            # Destination filter
            if destination and destination not in chunk_dest and chunk_dest not in destination:
                continue
                
            # Score based on keyword overlap
            score = 0
            for word in query_words:
                if word in chunk_text:
                    # Give higher weight to matches in headers
                    if f"# {word}" in chunk_text or f"## {word}" in chunk_text:
                        score += 5
                    else:
                        score += 1
                        
            # Boost score if destination is mentioned in chunk metadata
            if destination and destination in chunk_dest:
                score += 2
                
            if score > 0:
                scored_chunks.append((score, chunk))
                
        # Sort by score descending
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in scored_chunks[:top_k]]

# Global pipeline instance
rag_pipeline = RAGPipeline()
