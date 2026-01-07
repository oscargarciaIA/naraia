
import React, { useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import SetupView from './components/SetupView';
import { AgentConfig } from './types';
import { Bell, Search, Settings, HelpCircle, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [agentConfig] = useState<AgentConfig>({ agentId: 'NARA-CORE-01', apiKey: '' });
  const [activeView, setActiveView] = useState<'chat' | 'setup'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-sans selection:bg-indigo-100">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-72 flex-shrink-0 transition-all duration-300`}>
          <Sidebar 
            agentConfig={agentConfig} 
            activeView={activeView} 
            setActiveView={setActiveView} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <Menu size={20} />
                  </button>
                  <h1 className="font-bold text-slate-800 tracking-tight">
                    {activeView === 'chat' ? 'Dashboard de Soporte TI' : 'Configuración de Despliegue'}
                  </h1>
                  <span className="hidden md:inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded uppercase tracking-tighter">Entorno Seguro</span>
                </div>
                
                <div className="flex items-center gap-4 text-slate-400">
                  <Search size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                  <div className="relative">
                    <Bell size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
                  <Settings 
                    onClick={() => setActiveView('setup')}
                    size={18} 
                    className={`cursor-pointer transition-colors ${activeView === 'setup' ? 'text-indigo-600' : 'hover:text-slate-600'}`} 
                  />
                  <HelpCircle size={18} className="hover:text-slate-600 cursor-pointer transition-colors" />
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {activeView === 'chat' ? <Chat /> : <SetupView />}
            </main>
        </div>
    </div>
  );
};
export default App;
