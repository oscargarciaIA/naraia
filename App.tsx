
import React, { useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import { AgentConfig } from './types';
import { Bell, Search, Settings, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [agentConfig] = useState<AgentConfig>({ agentId: 'NARA-CORE-01', apiKey: '' });

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans selection:bg-indigo-100">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <Sidebar agentConfig={agentConfig} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <h1 className="font-bold text-slate-800 tracking-tight">Dashboard de Cumplimiento TI</h1>
                  <span className="hidden md:inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase">Entorno Seguro</span>
                </div>
                
                <div className="flex items-center gap-4 text-slate-400">
                  <Search size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                  <div className="relative">
                    <Bell size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                  <Settings size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                  <HelpCircle size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 relative overflow-hidden">
                <Chat />
            </main>
        </div>
    </div>
  );
};
export default App;
