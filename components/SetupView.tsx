
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, RefreshCcw, Key, Globe, Eye, EyeOff, Save, CheckCircle, List, Trash2, Wifi, WifiOff, Settings, Link
} from 'lucide-react';
import { checkPlaiConnectivity, addLog, DEFAULT_PLAI_URL } from '../services/geminiService';

const SetupView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL);
  const [agentId, setAgentId] = useState(localStorage.getItem('NARA_AGENT_ID') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('NARA_API_KEY') || '');
  const [showKey, setShowKey] = useState(false);
  const [plaiStatus, setPlaiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    const fetchLogs = () => {
      const stored = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
      setLogs(stored);
    };
    
    runChecks();
    window.addEventListener('nara_log_update', fetchLogs);
    return () => window.removeEventListener('nara_log_update', fetchLogs);
  }, []);

  const runChecks = async () => {
    setPlaiStatus('checking');
    const result = await checkPlaiConnectivity(apiUrl);
    setPlaiStatus(result.ok ? 'online' : 'offline');
  };

  const handleSave = () => {
    localStorage.setItem('NARA_PLAI_URL', apiUrl);
    localStorage.setItem('NARA_AGENT_ID', agentId);
    localStorage.setItem('NARA_API_KEY', apiKey);
    setSaveStatus(true);
    addLog('info', 'Configuración de red y credenciales actualizada.');
    runChecks();
    setTimeout(() => setSaveStatus(false), 2000);
    window.dispatchEvent(new Event('storage'));
  };

  const clearLogs = () => {
    localStorage.setItem('NARA_LOGS', '[]');
    setLogs([]);
  };

  const v3ControlScript = {
    name: "Nara_Master_v3.3.ps1",
    code: `# Nara_Master_v3.3.ps1
Write-Host "--- NARA DEPLOYMENT v3.3 ---" -ForegroundColor Cyan -BackgroundColor Black

# 1. CLEANUP
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. DOCKER CONFIG
$dockerfile = @"
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/Dockerfile", $dockerfile)

$composeFile = @"
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    restart: always
    environment:
      - POSTGRES_USER=nara_admin
      - POSTGRES_PASSWORD=nara_secure_2024
      - POSTGRES_DB=nara_knowledge_hub
    ports:
      - '5432:5432'
  nara-app:
    build: .
    container_name: nara_frontend
    environment:
      - PLAI_URL=${apiUrl}
      - AGENT_ID=${agentId}
      - API_KEY=${apiKey}
    ports:
      - '3000:3000'
    depends_on:
      - nara-vector-db
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/docker-compose.yml", $composeFile)

docker-compose down; docker-compose up -d --build
Write-Host "SISTEMA ONLINE: http://localhost:3000" -ForegroundColor Green`
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-6 pb-12">
        
        {/* Status Monitor Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-3xl border ${plaiStatus === 'online' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-center justify-between transition-all`}>
             <div className="flex items-center gap-3">
               {plaiStatus === 'online' ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Motor Plai</p>
                 <p className={`text-sm font-bold ${plaiStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>{plaiStatus.toUpperCase()}</p>
               </div>
             </div>
             <button onClick={runChecks} className={`p-2 hover:bg-white/5 rounded-xl text-slate-400 ${plaiStatus === 'checking' ? 'animate-spin' : ''}`}><RefreshCcw size={16}/></button>
          </div>
          
          <div className="p-6 rounded-3xl border bg-blue-500/10 border-blue-500/20 flex items-center gap-3">
             <Database className="text-blue-500" />
             <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base de Datos</p>
               <p className="text-sm font-bold text-blue-500">OPERATIVA (PGVector)</p>
             </div>
          </div>

          <div className="p-6 rounded-3xl border bg-indigo-500/10 border-indigo-500/20 flex items-center gap-3">
             <ShieldCheck className="text-indigo-500" />
             <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entorno</p>
               <p className="text-sm font-bold text-indigo-400">CENCOSUD CLOUD</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parámetros de Configuración */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={20} className="text-blue-400"/> Parámetros de Red y API</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1"><Link size={10}/> URL del Endpoint</label>
                  <input 
                    type="text" 
                    value={apiUrl} 
                    onChange={(e) => setApiUrl(e.target.value)} 
                    placeholder="https://..."
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500/40 outline-none" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">x-agent-id</label>
                    <input type="password" value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">x-api-key</label>
                    <div className="relative">
                      <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm" />
                      <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showKey ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                    </div>
                  </div>
               </div>
               <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                  {saveStatus ? <CheckCircle size={18}/> : <Save size={18}/>} {saveStatus ? 'GUARDADO' : 'VINCULAR MOTOR PLAI'}
               </button>
            </div>
          </div>

          {/* Terminal de Logs en tiempo real */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-slate-800">
               <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                 <Terminal size={14} className="text-green-400" /> Nara Debug Terminal
               </div>
               <button onClick={clearLogs} className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 text-[10px] font-bold">
                 <Trash2 size={12}/> LIMPIAR
               </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] space-y-3 max-h-[300px] overflow-y-auto bg-black/40 scrollbar-thin">
               {logs.length === 0 && <p className="text-slate-600 italic">No se han registrado eventos...</p>}
               {logs.map(log => (
                 <div key={log.id} className="border-l-2 border-slate-800 pl-3 py-1 animate-fade-in-up">
                    <div className="flex gap-2 items-center mb-1">
                      <span className="text-slate-500 font-bold">[{log.timestamp}]</span>
                      <span className={`px-1.5 rounded text-[8px] font-black ${log.type === 'error' ? 'bg-red-900/40 text-red-400' : log.type === 'network' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'}`}>
                        {log.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 font-semibold">{log.message}</p>
                    {log.data && (
                      <pre className="mt-1 text-[9px] text-slate-500 bg-black/20 p-2 rounded border border-slate-800/50 overflow-x-auto">
                        {log.data}
                      </pre>
                    )}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* PowerShell Deployment Script */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
           <div className="p-4 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
              <div className="flex items-center gap-2 text-blue-400">
                <Terminal size={16}/>
                <span className="text-xs font-black text-white uppercase tracking-widest">Despliegue Maestro v3.3</span>
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(v3ControlScript.code); addLog('info', 'Script v3.3 copiado.'); }} 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                COPIAR SCRIPT
              </button>
           </div>
           <pre className="p-8 text-[10px] text-slate-400 bg-black/60 overflow-x-auto leading-relaxed">
             {v3ControlScript.code}
           </pre>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
