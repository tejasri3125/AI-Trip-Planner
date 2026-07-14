import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot, AlertCircle, Mic, MicOff, HelpCircle } from "lucide-react";
import { chatService } from "../services/api";

export default function ChatWindow({ destination }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your travel assistant for **${destination || "your destination"}**. Ask me anything about local customs, safety guidelines, hidden gems, or packing recommendations!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Setup Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };
      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    setError("");
    const userMsg = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Send chat context and history to API
      const historyToSend = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatService.sendMessage(queryText, destination || "Paris", historyToSend);
      
      let answer = res.answer;
      if (res.citations && res.citations.length > 0) {
        const cleanCitations = [...new Set(res.citations.filter(Boolean))];
        if (cleanCitations.length > 0) {
          answer += `\n\n*Retrieved from: ${cleanCitations.join(", ")}*`;
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch answer. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    { text: "What is the tipping culture here?", icon: "💰" },
    { text: "Suggest some packing tips for this season", icon: "🎒" },
    { text: "Give me some important safety guidelines", icon: "🛡️" },
    { text: "What are some famous local dishes to try?", icon: "🍲" }
  ];

  return (
    <div className="glass-card rounded-2xl flex flex-col h-[500px] md:h-[600px] overflow-hidden border border-slate-200/50 dark:border-slate-800">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-800 dark:text-white">AI Travel Assistant</h3>
          <p className="text-xs text-slate-400">Grounded in local guides & documents</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-primary-50 text-primary-600 dark:bg-primary-950/20 dark:text-primary-400 rounded-full">
          {destination || "Paris"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
              msg.role === "user"
                ? "bg-primary-100 border-primary-200 dark:bg-primary-950/20 dark:border-primary-800 text-primary-600 dark:text-primary-400"
                : "bg-emerald-100 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
            }`}>
              {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[75%] ${
              msg.role === "user"
                ? "bg-primary-600 text-white rounded-tr-none"
                : "bg-slate-100 text-slate-850 dark:bg-slate-850 dark:text-slate-200 rounded-tl-none"
            }`}>
              <div className="whitespace-pre-line select-text">
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3 flex-row">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center animate-pulse">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-850 p-4 rounded-2xl rounded-tl-none max-w-[75%] flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Suggested Questions Grid */}
      {messages.length === 1 && (
        <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Suggested Questions:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="text-left text-xs p-2.5 bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800 border border-slate-150/40 dark:border-slate-800/80 rounded-xl transition-all duration-200 text-slate-650 hover:text-slate-850 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span className="text-sm">{q.icon}</span>
                <span className="truncate">{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800">
        {error && (
          <div className="mb-2 p-2 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex gap-2 items-center">
          {/* Voice Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-xl border transition-all ${
              isListening
                ? "bg-red-500 border-red-500 text-white animate-pulse"
                : "bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-500 dark:text-slate-350 dark:border-slate-700/80"
            }`}
            title={isListening ? "Listening... click to stop" : "Record voice input"}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isListening ? "Listening to speech..." : "Type your travel question here..."}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-850 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700/80 dark:text-white"
            disabled={loading}
          />

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            className="p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-all shadow-md shadow-primary-500/25 disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
