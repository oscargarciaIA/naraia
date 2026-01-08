
import React, { useState, useEffect } from 'react';
import { Shield, Database, Activity, Server, Settings, CheckCircle, BookOpen } from 'lucide-react';
import { AgentConfig } from '../types';

interface SidebarProps { 
  agentConfig: AgentConfig;
  activeView: 'chat' | 'setup' | 'knowledge';
  setActiveView: (view: 'chat' | 'setup' | 'knowledge') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ agentConfig, activeView, setActiveView }) => {
  const [vectorCount, setVectorCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
      const knowledge = dynamicStored ? JSON.parse(dynamicStored) : [];
      setVectorCount(knowledge.length);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    return () => window.removeEventListener('storage', updateCount);
  }, []);

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Nara System</h2>
            <p className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Checkpoint v2.0</p>
          </div>
        </div>

        <nav className="space-y-6">
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Gestión</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveView('chat')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeView === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <Activity size={16} /> Soporte TI
              </button>
              <button 
                onClick={() => setActiveView('knowledge')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeView === 'knowledge' ? 'bg-indigo-600/40 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <BookOpen size={16} /> Knowledge Hub
              </button>
              <button 
                onClick={() => setActiveView('setup')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${activeView === 'setup' ? 'bg-slate-800 text-white border border-slate-700' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <Settings size={16} /> Control v2.0
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center px-2">
              <Server size={12} className="mr-2"/> Infraestructura
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Database size={14} className="text-blue-400" /> Vectores
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold">{vectorCount}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-mono text-slate-500 uppercase">Synced</span>
                </div>
              </div>
            </div>
          </section>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">Admin</div>
          <div>
            <div className="text-xs font-bold text-white">IT Department</div>
            <div className="text-[9px] text-slate-500 uppercase">Master Node</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
