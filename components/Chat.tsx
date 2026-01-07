import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, AlertCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { ChatMessage, NaraResponse, AgentConfig } from '../types';
import { sendMessageToNara } from '../services/geminiService';

interface ChatProps { isConfigured: boolean; agentConfig: AgentConfig; }

const Chat: React.FC<ChatProps> = ({ isConfigured, agentConfig }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 'welcome', role: 'assistant', timestamp: new Date(),
      content: { respuesta_usuario: "👋 Hola. Soy Nara. ¿En qué puedo ayudarte hoy?", fuentes: [] } as NaraResponse
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const handleSend = async () => {
    if (!input.trim() || !isConfigured || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.role === 'user' ? (m.content as string) : (m.content as NaraResponse).respuesta_usuario }));
      const response = await sendMessageToNara(userMsg.content as string, history, agentConfig);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response, timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
            {messages.map(m => <MessageBubble key={m.id} message={m} />)}
            {isLoading && <div className="text-slate-400 text-xs ml-4">Nara está escribiendo...</div>}
            <div ref={bottomRef} />
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto flex gap-2">
            <input 
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={!isConfigured}
                placeholder={isConfigured ? "Escribe tu pregunta..." : "Configura tu API Key primero"}
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A884]"
            />
            <button onClick={handleSend} disabled={!isConfigured} className="bg-[#00A884] text-white p-2 rounded-full hover:bg-[#008f6f]">
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;