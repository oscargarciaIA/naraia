
import React from 'react';
import { Shield, Database, Activity, Cpu, Server, Settings, Github, GitBranch, CheckCircle } from 'lucide-react';
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
            <h2 className="text-lg font-bold text-white tracking-tight">Nara System</h2>
            <p className="text-[10px] text-indigo-400 font-mono uppercase font-bold">Version 2.0.0 Stable</p>
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
              <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <Github size={14} className="text-slate-400" /> GitHub Sync
                  </div>
                  <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                </div>
                <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                  <GitBranch size={10} /> main (stable/v2)
                </div>
              </div>

              <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Database</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-green-400 font-bold">ONLINE</span>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Database size={10} /> pgvector-v16.2
                </div>
              </div>

              <div className="bg-indigo-900/10 p-3 rounded-xl border border-indigo-500/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-indigo-300 font-bold italic">Status</span>
                  <CheckCircle size={10} className="text-indigo-400" />
                </div>
                <p className="text-[9px] text-slate-500 font-medium">Sistema en Punto de Control Alfa Verificado.</p>
              </div>
            </div>
          </section>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
            TI
          </div>
          <div>
            <div className="text-xs font-bold text-white">Admin Global</div>
            <div className="text-[10px] text-slate-500">Región: Multinacional</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
