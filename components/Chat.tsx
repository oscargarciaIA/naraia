
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, AlertTriangle, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChatMessage, NaraResponse } from '../types';
import { sendMessageToNara } from '../services/geminiService';

const SUGGESTIONS = [
  "¿Cuál es el tiempo de respuesta para un incidente P1?",
  "¿Cómo configuro el acceso VPN?",
  "¿Dónde está la documentación de Plai?",
  "Escalar consulta a Mesa de Ayuda"
];

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 'welcome', role: 'assistant', timestamp: new Date(),
      content: { 
        respuesta_usuario: "Bienvenido al Punto de Control v3.5 de Nara. Sistema sincronizado con el motor corporativo Plai. Estoy lista para asistirte con la documentación oficial de TI y soporte técnico de nivel 1. ¿Cuál es tu consulta?", 
        fuentes: [],
        nota_compliance: "Sesión certificada bajo el motor de inteligencia Plai Cencosud AI.",
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
          title: "Credenciales de Plai Faltantes",
          msg: "El sistema no detectó las llaves de acceso en el Punto de Control. Configúralas en el panel maestro."
        });
      } else {
        setError({
          title: "Error de Motor Plai",
          msg: `Falla de comunicación con el servicio central: ${err.message}.`
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
              <div className="flex items-center gap-3 text-blue-600 animate-pulse ml-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                   <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Nara procesando con motor Plai...</span>
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
                    className="text-[10px] font-black bg-slate-50 text-slate-500 px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-white transition-all shadow-sm uppercase tracking-tighter"
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
                    placeholder="Escribe tu consulta oficial (Canal Plai Certificado)..."
                    className="w-full bg-slate-100 border-none rounded-2xl px-6 py-5 pr-16 focus:ring-4 focus:ring-blue-600/10 focus:bg-white transition-all text-sm font-medium"
                />
                <button 
                  onClick={() => handleSend()} 
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-30 shadow-lg transition-all active:scale-95"
                >
                    <Send size={20} />
                </button>
            </div>
            
            <div className="flex justify-between items-center px-2 mt-4 opacity-40">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={10} /> Plai Engine Active | {currentChatId || 'Master Session'}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest">Nara v3.5 Punto Control</span>
            </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
