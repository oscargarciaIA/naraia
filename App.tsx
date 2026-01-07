import React, { useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import { AgentConfig } from './types';

const App: React.FC = () => {
  const [agentConfig] = useState<AgentConfig>({ agentId: 'N/A', apiKey: '' });

  return (
    <div className="flex h-screen bg-[#EFEAE2] overflow-hidden">
        <div className="hidden lg:block w-64 bg-white border-r"><Sidebar agentConfig={agentConfig} /></div>
        <div className="flex-1 flex flex-col relative">
            <header className="h-16 bg-[#00A884] flex items-center justify-between px-4 text-white shadow-sm">
                <h1 className="font-bold text-lg">Nara | Asistente TI</h1>
            </header>
            <main className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')]"></div>
                {/* Assuming API configuration is handled externally via process.env.API_KEY */}
                <Chat isConfigured={true} agentConfig={agentConfig} />
            </main>
        </div>
    </div>
  );
};
export default App;