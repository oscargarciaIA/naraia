import React from 'react';
import { ChatMessage, NaraResponse } from '../types';
import { CheckCheck, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

interface MessageBubbleProps { message: ChatMessage; }

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-in-up">
        <div className="bg-[#d9fdd3] text-slate-900 px-4 py-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%]">
          <p className="text-sm">{message.content as string}</p>
          <div className="flex justify-end mt-1"><CheckCheck size={12} className="text-[#53bdeb]" /></div>
        </div>
      </div>
    );
  }

  const response = message.content as NaraResponse;
  return (
    <div className="flex justify-start mb-4 animate-fade-in-up">
      <div className="bg-white text-slate-800 px-4 py-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%] border border-gray-100">
        <p className="whitespace-pre-line text-sm mb-2">{response.respuesta_usuario}</p>
        
        {response.fuentes?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Fuentes Verificadas</span>
             {response.fuentes.map((f, i) => (
                <div key={i} className="flex items-center mt-1 text-xs text-indigo-600 bg-indigo-50 p-1 rounded">
                   <FileText size={10} className="mr-1"/> {f.doc_id}: {f.seccion_o_clausula}
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageBubble;