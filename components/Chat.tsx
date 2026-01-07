
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, BookOpen, ShieldAlert, Clock } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChatMessage, NaraResponse } from '../types';
import { sendMessageToNara } from '../services/geminiService';

const SUGGESTIONS = [
  "¿Cuál es la política de trabajo remoto?",
  "¿Necesito licencia para Copilot?",
  "Requisitos para cambiar mi contraseña",
  "¿Puedo pedir un monitor extra?"
];

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 'welcome', role: 'assistant', timestamp: new Date(),
      content: { 
        respuesta_usuario: "Bienvenido al portal de asistencia Nara. Estoy sincronizada con las políticas de TI 2024. ¿En qué puedo asistirte?", 
        fuentes: [],
        nota_compliance: "Consultas monitoreadas bajo norma ISO 27001",
        accion: "responder",
        nivel_confianza: 1,
        escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null },
        preguntas_aclaratorias: []
      } as NaraResponse
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        content: m.role === 'user' ? (m.content as string) : (m.content as NaraResponse).respuesta_usuario 
      }));
      const response = await sendMessageToNara(messageText, history);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(m => <MessageBubble key={m.id} message={m} />)}
            {isLoading && (
              <div className="flex items-center gap-2 text-indigo-500 animate-pulse ml-4">
                <Sparkles size={16} />
                <span className="text-xs font-medium uppercase tracking-wider">Nara procesando políticas...</span>
              </div>
            )}
            <div ref={bottomRef} />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
            {messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i} onClick={() => handleSend(s)}
                    className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex items-center">
                <input 
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Consulta sobre licenciamiento, contratos o seguridad..."
                    className="w-full bg-slate-100 border-none rounded-2xl px-5 py-4 pr-16 focus:ring-2 focus:ring-indigo-500 transition-all text-sm shadow-inner"
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={isLoading}
                  className="absolute right-2 bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-transform active:scale-95"
                >
                    <Send size={18} />
                </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              IA Asistencial Nara v1.2 | Datos protegidos por DLP Corporativo
            </p>
        </div>
      </div>
    </div>
  );
};
export default Chat;
