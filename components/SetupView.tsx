
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, RefreshCcw, Key, Globe, Eye, EyeOff, Save, CheckCircle, List, Trash2, Wifi, WifiOff, Settings
} from 'lucide-react';
import { checkPlaiConnectivity, addLog } from '../services/geminiService';

const SetupView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [agentId, setAgentId] = useState(localStorage.getItem('NARA_AGENT_ID') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('NARA_API_KEY') || '');
  const [showKey, setShowKey] = useState(false);
  const [plaiStatus, setPlaiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [dbStatus, setDbStatus] = useState<'online' | 'offline'>('online');
  const [saveStatus, setSaveStatus] = useState(false);

  useEffect(() => {
    const fetchLogs = () => {
      const stored = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
      setLogs(stored);
    };
    
    const runChecks = async () => {
      const isPlaiUp = await checkPlaiConnectivity();
      setPlaiStatus(isPlaiUp ? 'online' : 'offline');
      fetchLogs();
    };

    runChecks();
    window.addEventListener('nara_log_update', fetchLogs);
    return () => window.removeEventListener('nara_log_update', fetchLogs);
  }, []);

  const handleSave = () => {
    localStorage.setItem('NARA_AGENT_ID', agentId);
    localStorage.setItem('NARA_API_KEY', apiKey);
    setSaveStatus(true);
    addLog('info', 'Configuración de credenciales actualizada manualmente.');
    setTimeout(() => setSaveStatus(false), 2000);
    window.dispatchEvent(new Event('storage'));
  };

  const clearLogs = () => {
    localStorage.setItem('NARA_LOGS', '[]');
    setLogs([]);
  };

  const v3ControlScript = {
    name: "Nara_Master_v3.2.ps1",
    code: `# Nara_Master_v3.2.ps1
Write-Host "--- NARA DEPLOYMENT v3.2 ---" -ForegroundColor Cyan -BackgroundColor Black

# 1. CLEANUP
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. DOCKER CONFIG (Safe Encoding)
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
        
        {/* Panel de Status Crítico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-3xl border ${plaiStatus === 'online' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-center justify-between`}>
             <div className="flex items-center gap-3">
               {plaiStatus === 'online' ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Motor Plai</p>
                 <p className={`text-sm font-bold ${plaiStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>{plaiStatus.toUpperCase()}</p>
               </div>
             </div>
             <button onClick={() => setPlaiStatus('checking')} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><RefreshCcw size={16}/></button>
          </div>
          
          <div className="p-6 rounded-3xl border bg-blue-500/10 border-blue-500/20 flex items-center gap-3">
             <Database className="text-blue-500" />
             <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base de Datos</p>
               <p className="text-sm font-bold text-blue-500">CONECTADO (PG16)</p>
             </div>
          </div>

          <div className="p-6 rounded-3xl border bg-slate-800 border-slate-700 flex items-center gap-3">
             <Key className="text-indigo-400" />
             <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seguridad</p>
               <p className="text-sm font-bold text-white">X-API-KEY ENABLED</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuración */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={20} className="text-blue-400"/> Parámetros Plai</h3>
            <div className="space-y-4">
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
               <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  {saveStatus ? <CheckCircle size={18}/> : <Save size={18}/>} {saveStatus ? 'GUARDADO' : 'ACTUALIZAR CONEXIÓN'}
               </button>
            </div>
          </div>

          {/* Consola de Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-slate-800">
               <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                 <Terminal size={14} className="text-green-400" /> Nara Debug Console
               </div>
               <button onClick={clearLogs} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] space-y-2 max-h-[250px] overflow-y-auto bg-black/40">
               {logs.length === 0 && <p className="text-slate-600 italic">Esperando eventos del sistema...</p>}
               {logs.map(log => (
                 <div key={log.id} className="flex gap-3 animate-fade-in-up">
                    <span className="text-slate-600">[{log.timestamp}]</span>
                    <span className={`font-black ${log.type === 'error' ? 'text-red-500' : log.type === 'network' ? 'text-blue-400' : 'text-green-500'}`}>
                      {log.type.toUpperCase()}
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Script Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
           <div className="p-4 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
              <span className="text-xs font-black text-white uppercase tracking-widest">Despliegue Maestro v3.2</span>
              <button onClick={() => { navigator.clipboard.writeText(v3ControlScript.code); addLog('info', 'Script copiado al portapapeles.'); }} className="px-4 py-2 bg-blue-600 text-[10px] font-bold text-white rounded-lg">COPIAR SCRIPT</button>
           </div>
           <pre className="p-6 text-[10px] text-slate-400 bg-black/60 overflow-x-auto">
             {v3ControlScript.code}
           </pre>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
