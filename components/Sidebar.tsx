
import React from 'react';
import { Shield, Database, Activity, Cpu, Server, Settings } from 'lucide-react';
import { AgentConfig } from '../types';

interface SidebarProps { 
  agentConfig: AgentConfig;
  activeView: 'chat' | 'setup';
  setActiveView: (view: 'chat' | 'setup') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ agentConfig, activeView, setActiveView }) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Nara Console</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase">Internal AI Agent</p>
          </div>
        </div>

        <nav className="space-y-6">
          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
              Navegación
            </h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveView('chat')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeView === 'chat' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <Activity size={16} /> Centro de Ayuda
              </button>
              <button 
                onClick={() => setActiveView('setup')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeView === 'setup' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
              >
                <Settings size={16} /> Configuración de IT
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
              <Server size={12} className="mr-2"/> Infraestructura
            </h3>
            <div className="space-y-3">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Database</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Database size={10} /> pgvector-v16.2
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">AI Engine</span>
                  <span className="text-[10px] text-indigo-400 font-bold">READY</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Cpu size={10} /> Gemini 3 Flash
                </div>
              </div>
            </div>
          </section>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
            AD
          </div>
          <div>
            <div className="text-xs font-bold text-white">Admin Global</div>
            <div className="text-[10px] text-slate-500">Región: LATAM</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
