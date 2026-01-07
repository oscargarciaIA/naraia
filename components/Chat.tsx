import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChatMessage, NaraResponse } from '../types';
import { sendMessageToNara } from '../services/geminiService';

const SUGGESTIONS = [
  "¿Cuál es la política de trabajo remoto?",
  "¿Necesito licencia para Copilot?",
  "¿Cómo solicito un monitor adicional?",
  "¿Qué laptops están disponibles?"
];

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 'welcome', role: 'assistant', timestamp: new Date(),
      content: { 
        respuesta_usuario: "Hola, soy Nara. Estoy aquí para asistirte con normativas de TI, licenciamiento y acceso a recursos corporativos. ¿En qué puedo ayudarte hoy?", 
        fuentes: [],
        nota_compliance: "Toda interacción está sujeta a la Política de Uso Aceptable de Activos.",
        accion: "responder",
        nivel_confianza: 1,
        escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null },
        preguntas_aclaratorias: []
      } as NaraResponse
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: messageText, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        content: m.role === 'user' ? (m.content as string) : (m.content as NaraResponse).respuesta_usuario 
      }));
      
      const response = await sendMessageToNara(messageText, history);
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      }]);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el núcleo de Nara. Verifique la API Key o la conexión corporativa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(m => <MessageBubble key={m.id} message={m} />)}
            
            {isLoading && (
              <div className="flex items-center gap-3 text-indigo-500 animate-pulse ml-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                   <Sparkles size={18} className="animate-spin-slow" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest">Nara está consultando el Knowledge Hub...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in-up">
                <AlertTriangle size={20} />
                <div className="flex-1">
                   <p className="text-sm font-medium">{error}</p>
                </div>
                <button onClick={() => handleSend(messages[messages.length-1].content as string)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input y Sugerencias */}
      <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto">
            {messages.length < 3 && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i} onClick={() => handleSend(s)}
                    className="text-[11px] font-medium bg-white text-slate-600 px-4 py-2 rounded-full border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative group">
                <input 
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                    placeholder="Escribe tu consulta sobre políticas, accesos o hardware..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 pr-16 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-sm shadow-inner placeholder:text-slate-400"
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center"
                >
                    <Send size={20} />
                </button>
            </div>
            
            <div className="flex justify-between items-center px-2 mt-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                AES-256 encrypted session
              </span>
              <span className="text-[10px] text-slate-400">
                Nara AI v1.2.0 • Multinational IT Support
              </span>
            </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
