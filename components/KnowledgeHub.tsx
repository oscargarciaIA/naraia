
import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Trash2, Database, FileSpreadsheet, Zap, Loader2, Eye, X, BookOpen, Target
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

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8 pb-12">
        
        <header className="flex items-center justify-between bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white">
              <Database size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Knowledge Hub v2.0</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Sincronización de Vectores TI</p>
            </div>
          </div>
          <div className="flex gap-10">
             <div className="text-right">
               <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Vectores</p>
               <p className="text-xl font-mono text-indigo-400">{dbStatus.vectors}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <div className="relative border-2 border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 bg-slate-900/20 group hover:border-indigo-500/50 transition-all cursor-pointer">
              <div className={`p-5 rounded-full bg-slate-800 ${isUploading ? 'animate-spin' : ''}`}>
                <Upload size={28} className="text-slate-400" />
              </div>
              <h4 className="text-white font-bold text-sm">Cargar Documento TI</h4>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => e.target.files && uploadFile(e.target.files[0])} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <BookOpen size={14} /> Índice de Conocimiento v2.0
              </h3>
              
              {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>
              ) : files.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-slate-500 text-sm italic">No hay documentos indexados para este piloto.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file) => (
                    <div key={file.uuid} className="bg-black/20 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <FileText className="text-indigo-400" size={18} />
                        <span className="text-sm font-medium text-slate-300 truncate max-w-[180px]">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => viewContent(file.uuid)} className="p-2 text-slate-500 hover:text-white transition-colors"><Eye size={16} /></button>
                        <button onClick={async () => { await agentBuilderService.deleteFiles('', '', [file.uuid]); loadFiles(); }} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{selectedContent.titulo}</h3>
                <button onClick={() => setSelectedContent(null)} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="p-8">
                <div className="bg-black/40 p-6 rounded-2xl border border-slate-800 max-h-[400px] overflow-y-auto">
                  <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedContent.texto}</pre>
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
