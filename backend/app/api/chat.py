from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict
from app.rag.rag_pipeline import rag_pipeline
from app.services.ai_service import ask_chat_assistant

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    destination: str
    history: List[ChatMessage]

@router.post("")
def chat_with_assistant(request: ChatRequest):
    try:
        # 1. Search RAG context
        search_query = f"{request.query} {request.destination}"
        rag_context = rag_pipeline.search(search_query, destination=request.destination, top_k=3)
        
        # 2. Format history for service
        history_list = [{"role": m.role, "content": m.content} for m in request.history]
        
        # 3. Call AI assistant
        answer = ask_chat_assistant(
            query=request.query,
            chat_history=history_list,
            destination=request.destination,
            rag_context=rag_context
        )
        
        return {
            "answer": answer,
            "citations": [doc["metadata"].get("source") for doc in rag_context]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat execution failed: {str(e)}"
        )
