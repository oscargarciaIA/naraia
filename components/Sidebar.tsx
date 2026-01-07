import React from 'react';
import { Shield, Database, Activity } from 'lucide-react';
import { AgentConfig } from '../types';

interface SidebarProps { agentConfig: AgentConfig; }

const Sidebar: React.FC<SidebarProps> = ({ agentConfig }) => {
  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-bold text-slate-800 flex items-center mb-6">
        <Shield className="mr-2 text-[#00A884]" size={20} /> Nara Panel
      </h2>
      <div className="space-y-4">
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-2"><Database size={12} className="mr-1"/> Estado DB</h3>
            <div className="flex items-center text-xs text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Conectado</div>
        </div>
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center mb-2"><Activity size={12} className="mr-1"/> Sesión</h3>
            <div className="text-xs text-slate-600">User: Admin<br/>Canal: Web</div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;