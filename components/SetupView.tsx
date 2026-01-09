
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, RefreshCcw, Key, Globe, Eye, EyeOff, Save, CheckCircle
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [agentId, setAgentId] = useState(localStorage.getItem('NARA_AGENT_ID') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('NARA_API_KEY') || '');
  const [showKey, setShowKey] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [dbStatus, setDbStatus] = useState<'online' | 'checking' | 'offline'>('online');
  const [saveStatus, setSaveStatus] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = () => {
    localStorage.setItem('NARA_AGENT_ID', agentId);
    localStorage.setItem('NARA_API_KEY', apiKey);
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
    window.dispatchEvent(new Event('storage'));
  };

  const checkDb = () => {
    setDbStatus('checking');
    setTimeout(() => {
      const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
      const knowledge = dynamicStored ? JSON.parse(dynamicStored) : [];
      setDbStatus(knowledge ? 'online' : 'offline');
    }, 1200);
  };

  const v3ControlScript = {
    name: "Nara_Control_v3.1_Cencosud.ps1",
    desc: "SCRIPT MAESTRO v3.1: Configuración de infraestructura con soporte Plai Cencosud.",
    code: `# Nara_Control_v3.1_Cencosud.ps1
Write-Host "--- NARA SYSTEM CHECKPOINT v3.1 (CENCOSUD) ---" -ForegroundColor Cyan -BackgroundColor Black

# 1. LIMPIEZA DE PROCESOS HUÉRFANOS
Write-Host "[1/6] Liberando puertos y procesos (Node/Vite)..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. CREACIÓN DE ARCHIVOS DE CONFIGURACIÓN (Encoding Seguro)
Write-Host "[2/6] Generando archivos de infraestructura..." -ForegroundColor Gray

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

$dockerignore = @"
node_modules
dist
.git
Dockerfile
docker-compose.yml
.env
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/.dockerignore", $dockerignore)

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
    networks:
      - nara_network
  nara-app:
    build: .
    container_name: nara_frontend
    restart: always
    ports:
      - '3000:3000'
    environment:
      - AGENT_ID=${agentId || '$env:AGENT_ID'}
      - API_KEY=${apiKey || '$env:API_KEY'}
    depends_on:
      - nara-vector-db
    networks:
      - nara_network
networks:
  nara_network:
    driver: bridge
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/docker-compose.yml", $composeFile)

# 3. DETENCIÓN TOTAL
Write-Host "[3/6] Deteniendo contenedores activos..." -ForegroundColor Gray
$containers = docker ps -q
if ($containers) { docker stop $containers }

# 4. PURGA DE SISTEMA
Write-Host "[4/6] Purgando volúmenes obsoletos..." -ForegroundColor Yellow
docker system prune -a --volumes -f

# 5. DESPLIEGUE v3.1
Write-Host "[5/6] Levantando Nara v3.1 (Motor Plai Cencosud)..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "SISTEMA v3.1 ONLINE EN http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        <header className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <Globe size={40} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Cencosud AI Gateway</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Configuración Segura v3.1.0</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-slate-800">
                <div className={`w-3 h-3 rounded-full ${dbStatus === 'online' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : dbStatus === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {dbStatus === 'online' ? 'DB ONLINE' : dbStatus === 'checking' ? 'CHECKING...' : 'DB OFFLINE'}
                </span>
                <button onClick={checkDb} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-500">
                  <RefreshCcw size={14} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Key className="text-blue-400" size={20} />
              <h3 className="text-white font-bold tracking-tight">Credenciales Plai</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">x-agent-id</label>
                <div className="relative">
                  <input 
                    type={showAgent ? "text" : "password"}
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    placeholder="ID del Agente..."
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                  />
                  <button onClick={() => setShowAgent(!showAgent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showAgent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">x-api-key</label>
                <div className="relative">
                  <input 
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="API Key Corporativa..."
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                  />
                  <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                {saveStatus ? <CheckCircle size={18} /> : <Save size={18} />}
                {saveStatus ? 'CONFIGURACIÓN GUARDADA' : 'GUARDAR CREDENCIALES'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-6">
                <Activity className="text-green-400" size={20} />
                <h3 className="text-white font-bold tracking-tight">Status Monitor</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-slate-800/50">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-400 font-medium">Motor Plai Cencosud</span>
                   </div>
                   <span className="text-[10px] font-mono text-green-500 font-bold uppercase tracking-widest">Active</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-slate-800/50">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${dbStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs text-slate-400 font-medium">Vector Knowledge Base</span>
                   </div>
                   <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${dbStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                     {dbStatus === 'online' ? 'Synced' : 'Offline'}
                   </span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-blue-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">{v3ControlScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(v3ControlScript.code, "v3")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${copied === "v3" ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            >
              {copied === "v3" ? 'COPIADO' : 'COPIAR SCRIPT'}
            </button>
          </div>
          <div className="p-8 bg-black/40 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{v3ControlScript.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
