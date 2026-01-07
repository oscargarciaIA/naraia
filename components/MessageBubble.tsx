
import React from 'react';
import { ChatMessage, NaraResponse } from '../types';
import { ShieldCheck, FileText, Info, AlertCircle, Bookmark } from 'lucide-react';

interface MessageBubbleProps { message: ChatMessage; }

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex justify-end mb-6 animate-fade-in-up">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%]">
          <p className="text-sm font-medium leading-relaxed">{message.content as string}</p>
        </div>
      </div>
    );
  }

  const response = message.content as NaraResponse;
  return (
    <div className="flex justify-start mb-6 animate-fade-in-up">
      <div className="w-full max-w-[90%] space-y-3">
        <div className="bg-white border border-slate-200 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
              <ShieldCheck size={16} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Respuesta Nara AI</span>
          </div>
          
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {response.respuesta_usuario}
          </p>

          {response.nota_compliance && (
            <div className="mt-4 flex items-start gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
              <Info size={14} className="text-amber-600 mt-0.5" />
              <p className="text-[11px] text-amber-800 italic">{response.nota_compliance}</p>
            </div>
          )}
        </div>

        {response.fuentes?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-4">
             {response.fuentes.map((f, i) => (
                <div key={i} className="flex flex-col p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                   <div className="flex items-center gap-2 mb-1">
                     <Bookmark size={12} className="text-indigo-400" />
                     <span className="text-[10px] font-bold text-slate-800 truncate">{f.titulo}</span>
                   </div>
                   <div className="flex justify-between items-center text-[9px] text-slate-500">
                     <span>{f.doc_id} • Sec. {f.seccion_o_clausula}</span>
                     <span className="bg-green-100 text-green-700 px-1 rounded font-mono">{(f.score * 100).toFixed(0)}% match</span>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageBubble;
