
import React, { useState, useEffect } from 'react';
import { Shield, Database, Activity, Server, Settings, BookOpen, RefreshCw } from 'lucide-react';
import { AgentConfig } from '../types';

interface SidebarProps { 
  agentConfig: AgentConfig;
  activeView: 'chat' | 'setup' | 'knowledge';
  setActiveView: (view: 'chat' | 'setup' | 'knowledge') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ agentConfig, activeView, setActiveView }) => {
  const [vectorCount, setVectorCount] = useState(0);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('online');

  useEffect(() => {
    const updateStats = () => {
      const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
      const knowledge = dynamicStored ? JSON.parse(dynamicStored) : [];
      setVectorCount(knowledge.length);
      setDbStatus(knowledge ? 'online' : 'offline');
    };

    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter">Nara System</h2>
            <p className="text-[10px] text-blue-400 font-mono uppercase font-black tracking-[0.2em]">Cencosud v3.1</p>
          </div>
        </div>

        <nav className="space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Módulos de Soporte</h3>
            <div className="space-y-1.5">
              <button 
                onClick={() => setActiveView('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === 'chat' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                <Activity size={18} /> Consola de Chat
              </button>
              <button 
                onClick={() => setActiveView('knowledge')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === 'knowledge' ? 'bg-blue-600/40 text-white border border-blue-500/20' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                <BookOpen size={18} /> Centro de Conocimiento
              </button>
              <button 
                onClick={() => setActiveView('setup')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === 'setup' ? 'bg-slate-800 text-white border border-slate-700 shadow-inner' : 'hover:bg-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                <Settings size={18} /> Panel de Control
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center px-2">
              <Server size={14} className="mr-2"/> Infraestructura AI
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                    <Database size={16} className="text-blue-500" /> Vector Database
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 font-black">{vectorCount}</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${dbStatus === 'online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{dbStatus === 'online' ? 'Operativo' : 'Sin Datos'}</span>
                   </div>
                </div>
              </div>
            </div>
          </section>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-black/20">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">ADM</div>
          <div>
            <div className="text-xs font-black text-white uppercase tracking-tighter">TI Global Service</div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Master Node v3.1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
