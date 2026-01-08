
import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Trash2, CheckCircle2, 
  Database, FileSpreadsheet, Zap, Loader2, Activity, Eye, X, BookOpen, Target
} from 'lucide-react';
import { AgentFile, MockContextItem } from '../types';
import { agentBuilderService } from '../services/agentBuilderService';

const KnowledgeHub: React.FC = () => {
  const [files, setFiles] = useState<AgentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<MockContextItem | null>(null);
  const [dbStatus, setDbStatus] = useState({ vectors: 0, synced: false });

  useEffect(() => {
    loadFiles();
    window.addEventListener('storage', loadFiles);
    return () => window.removeEventListener('storage', loadFiles);
  }, []);

  const loadFiles = async () => {
    const data = await agentBuilderService.getFiles();
    setFiles(data);
    const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
    const knowledge = dynamicStored ? JSON.parse(dynamicStored) : [];
    setDbStatus({ vectors: knowledge.length, synced: true });
    setIsLoading(false);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    await agentBuilderService.uploadFile('NARA-CORE-01', 'MASTER_KEY', file);
    await loadFiles();
    setIsUploading(false);
  };

  const viewContent = (uuid: string) => {
    const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
    const knowledge: MockContextItem[] = dynamicStored ? JSON.parse(dynamicStored) : [];
    const item = knowledge.find(k => k.doc_id === uuid);
    if (item) setSelectedContent(item);
  };

  const pilotScenarios = [
    { title: "SLA y Soporte", file: "Contrato_SLA.docx", query: "¿Cuál es el tiempo de respuesta para un P1?" },
    { title: "Inventario", file: "Stock_Hardware.xlsx", query: "¿Cuántas laptops MacBook tenemos?" },
    { title: "Acceso Remoto", file: "Manual_VPN.pdf", query: "¿Cómo configuro mi VPN?" }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
        
        <header className="flex items-center justify-between bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <Database size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">Vector Hub</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Pilot Mode Active v2.8</p>
            </div>
          </div>
          <div className="flex gap-6">
             <div className="text-right px-6 border-r border-slate-800">
               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Status</p>
               <p className="text-xl font-mono text-green-400">READY</p>
             </div>
             <div className="text-right">
               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Vectores</p>
               <p className="text-xl font-mono text-blue-400">{dbStatus.vectors}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel Izquierdo: Acciones */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative border-2 border-dashed border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-900/20 group hover:border-blue-500/50 transition-all cursor-pointer">
              <div className={`p-5 rounded-full bg-slate-800 ${isUploading ? 'animate-spin' : ''}`}>
                <Upload size={28} className="text-slate-400" />
              </div>
              <h4 className="text-white font-bold">Añadir Documento</h4>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && uploadFile(e.target.files[0])} />
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-[2rem]">
               <div className="flex items-center gap-3 mb-4 text-indigo-400">
                 <Target size={20} />
                 <h4 className="text-xs font-black uppercase tracking-widest">Guía de Piloto</h4>
               </div>
               <div className="space-y-4">
                 {pilotScenarios.map((s, i) => (
                   <div key={i} className="space-y-1">
                     <p className="text-[10px] text-indigo-300 font-bold uppercase">{s.title}</p>
                     <p className="text-[11px] text-slate-400 leading-tight">Usa un archivo con "{s.file}" en el nombre y pregunta: <span className="text-indigo-200 italic">"{s.query}"</span></p>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Panel Derecho: Lista e Información */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <BookOpen size={16} /> Base de Conocimiento Actual
              </h3>
              
              {isLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" /></div>
              ) : files.length === 0 ? (
                <div className="py-20 text-center space-y-2">
                  <p className="text-slate-500 text-sm">No hay vectores activos.</p>
                  <p className="text-[10px] text-slate-700 uppercase">Sube un archivo para iniciar la prueba piloto.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file) => (
                    <div key={file.uuid} className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                      <div className="p-3 rounded-2xl bg-slate-900 group-hover:bg-blue-500/10 transition-colors">
                        {file.name.includes('xlsx') ? <FileSpreadsheet className="text-green-500" size={20} /> : <FileText className="text-blue-500" size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{file.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">Vector ID: {file.uuid}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => viewContent(file.uuid)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl"><Eye size={18} /></button>
                        <button onClick={async () => { await agentBuilderService.deleteFiles('', '', [file.uuid]); loadFiles(); }} className="p-2 text-slate-600 hover:text-red-400 rounded-xl"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Inspector */}
        {selectedContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in-up">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedContent.titulo}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[9px] font-black rounded uppercase">Inspector RAG</span>
                    <span className="text-[10px] text-slate-500 font-mono">Última indexación: {selectedContent.fecha_version}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedContent(null)} className="p-3 hover:bg-white/10 rounded-full text-slate-400 transition-colors"><X size={28} /></button>
              </div>
              <div className="p-10 space-y-6">
                <div className="bg-black/40 p-8 rounded-[2rem] border border-slate-800 max-h-[400px] overflow-y-auto custom-scrollbar">
                  <pre className="text-sm font-mono text-green-400/90 leading-relaxed whitespace-pre-wrap">
                    {selectedContent.texto}
                  </pre>
                </div>
                <div className="flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                   <div className="p-2 bg-blue-500 rounded-lg text-white"><Zap size={16} /></div>
                   <p className="text-[11px] text-blue-200 leading-snug">
                     <span className="font-bold uppercase block mb-0.5 tracking-wider">Validación de Datos:</span>
                     Cualquier pregunta que hagas en el chat consultará este texto exacto. Si el dato que necesitas no está aquí, Nara no podrá responderlo.
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeHub;
