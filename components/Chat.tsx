
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, AlertTriangle, RefreshCw, Key } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChatMessage, NaraResponse } from '../types';
import { sendMessageToNara } from '../services/geminiService';

const SUGGESTIONS = [
  "¿Cuál es el tiempo de respuesta para un incidente P1?",
  "¿Dónde puedo ver el inventario de laptops?",
  "¿Cómo configuro el acceso VPN?",
  "Necesito ayuda humana (Escalamiento)"
];

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 'welcome', role: 'assistant', timestamp: new Date(),
      content: { 
        respuesta_usuario: "Bienvenido al Canal Oficial de Nara v3.0. Sistema integrado con el motor Plai corporativo. Estoy lista para asistirte con manuales reales y soporte técnico. ¿En qué puedo ayudarte?", 
        fuentes: [],
        nota_compliance: "Sesión monitoreada bajo estándares corporativos de seguridad TI.",
        accion: "responder",
        nivel_confianza: 1,
        escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null },
        preguntas_aclaratorias: []
      } as NaraResponse
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{title: string, msg: string} | null>(null);
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
      const history = messages.slice(-10).map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        content: m.role === 'user' ? (m.content as string) : (m.content as NaraResponse).respuesta_usuario 
      }));
      
      const response = await sendMessageToNara(messageText, history, currentChatId);
      
      // Actualizar el chatId para mantener el hilo de la conversación
      if (response.chatId) {
        setCurrentChatId(response.chatId);
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      }]);
    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_MISSING") {
        setError({
          title: "Credenciales no detectadas",
          msg: "El sistema no recibió AGENT_ID o API_KEY. Por favor, usa el script v3.0 en Setup para configurar Plai."
        });
      } else {
        setError({
          title: "Error de Motor Corporativo",
          msg: `Falla de comunicación con Plai: ${err.message}. Revisa el estado del servicio.`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(m => <MessageBubble key={m.id} message={m} />)}
            
            {isLoading && (
              <div className="flex items-center gap-3 text-indigo-500 animate-pulse ml-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                   <Sparkles size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Nara consultando motor corporativo Plai...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-4 text-red-700 animate-fade-in-up shadow-sm">
                <div className="bg-red-100 p-2 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                   <p className="text-xs font-black uppercase tracking-widest mb-1">{error.title}</p>
                   <p className="text-[11px] font-medium leading-relaxed opacity-80">{error.msg}</p>
                </div>
                <button onClick={() => handleSend(messages[messages.length-1].content as string)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 p-6 shadow-2xl z-20">
        <div className="max-w-4xl mx-auto">
            {messages.length < 3 && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-4 animate-fade-in-up">
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i} onClick={() => handleSend(s)}
                    className="text-[10px] font-bold bg-slate-50 text-slate-500 px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-white transition-all shadow-sm uppercase tracking-tighter"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative">
                <input 
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                    placeholder="Escribe tu consulta oficial para TI (Motor Plai)..."
                    className="w-full bg-slate-100 border-none rounded-2xl px-6 py-5 pr-16 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition-all text-sm font-medium"
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-30 shadow-lg transition-all active:scale-95"
                >
                    <Send size={20} />
                </button>
            </div>
            
            <div className="flex justify-between items-center px-2 mt-4 opacity-40">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Key size={8} /> Plai Engine Active | {currentChatId || 'Nueva Sesión'}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Nara v3.0 Corporate</span>
            </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
