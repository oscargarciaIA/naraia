
import React from 'react';
import { ChatMessage, NaraResponse } from '../types';
import { ShieldCheck, FileText, Info, Bookmark, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';

interface MessageBubbleProps { message: ChatMessage; }

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex justify-end mb-6 animate-fade-in-up">
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-md max-w-[80%] border border-slate-600">
          <p className="text-sm font-medium leading-relaxed">{message.content as string}</p>
        </div>
      </div>
    );
  }

  const response = message.content as NaraResponse;
  const highConfidence = response.nivel_confianza > 0.8;
  
  return (
    <div className="flex justify-start mb-6 animate-fade-in-up">
      <div className="w-full max-w-[90%] space-y-3">
        <div className="bg-white border border-slate-200 px-6 py-5 rounded-2xl rounded-tl-none shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${highConfidence ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {highConfidence ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {highConfidence ? 'Validación de Fuente Exitosa' : 'Revisión Manual Sugerida'}
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
              Confianza: {(response.nivel_confianza * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap prose prose-slate max-w-none font-medium">
            {response.respuesta_usuario}
          </div>

          {response.nota_compliance && (
            <div className="mt-5 flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <Info size={14} className="text-slate-400 mt-0.5" />
              <p className="text-[11px] text-slate-500 italic leading-relaxed">{response.nota_compliance}</p>
            </div>
          )}
        </div>

        {response.fuentes?.length > 0 && (
          <div className="flex flex-wrap gap-2 ml-4">
             {response.fuentes.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm hover:bg-indigo-100 transition-colors">
                   {f.tipo_archivo === 'xlsx' ? (
                     <FileSpreadsheet size={12} className="text-green-600" />
                   ) : (
                     <FileText size={12} className="text-indigo-600" />
                   )}
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-indigo-900 truncate max-w-[150px]">{f.titulo}</span>
                      <span className="text-[8px] text-indigo-500 font-medium uppercase tracking-tighter">{f.seccion_o_clausula}</span>
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
