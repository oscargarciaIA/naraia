
import React, { useState } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, Server, RefreshCcw, Key
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const v3ControlScript = {
    name: "Nara_Plai_Setup_v3.0.ps1",
    desc: "SCRIPT MAESTRO v3.0: Despliegue con integración de Plai Assistant API.",
    code: `# Nara_Plai_Setup_v3.0.ps1
Write-Host "--- NARA SYSTEM BASELINE v3.0 (PLAI EDITION) ---" -ForegroundColor Cyan -BackgroundColor Black

# 0. VALIDACIÓN DE CREDENCIALES PLAI
if (-not $env:AGENT_ID) {
    Write-Host "[!] REQUERIDO: Ingrese el ID del Agente Plai." -ForegroundColor Yellow
    $userInputAgent = Read-Host "x-agent-id"
    if (-not $userInputAgent) { exit }
    $env:AGENT_ID = $userInputAgent
}

if (-not $env:API_KEY) {
    Write-Host "[!] REQUERIDO: Ingrese la API Key de Plai." -ForegroundColor Yellow
    $userInputKey = Read-Host "x-api-key"
    if (-not $userInputKey) { exit }
    $env:API_KEY = $userInputKey
}

# 1. LIMPIEZA
Write-Host "[1/6] Liberando recursos..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. GENERACIÓN DE DOCKER-COMPOSE DINÁMICO
Write-Host "[2/6] Configurando variables de entorno Plai..." -ForegroundColor Gray

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
      - AGENT_ID=$($env:AGENT_ID)
      - API_KEY=$($env:API_KEY)
    depends_on:
      - nara-vector-db
    networks:
      - nara_network
networks:
  nara_network:
    driver: bridge
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/docker-compose.yml", $composeFile)

# 3. REINICIO DE CONTENEDORES
Write-Host "[3/6] Deteniendo infraestructura previa..." -ForegroundColor Gray
docker-compose down --remove-orphans

# 4. DESPLIEGUE FINAL
Write-Host "[5/6] Levantando entorno Nara v3.0.0 (Powered by Plai)..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "SISTEMA v3.0 ONLINE EN http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        <header className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Setup Plai Assistant v3.0</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Configuración del Motor Corporativo Multinacional</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
             <Activity className="text-green-400" />
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status: <span className="text-white">DOCKER READY</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
             <Key className="text-indigo-400" />
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auth: <span className="text-white">PLAI Assistant</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
             <Zap className="text-amber-400" />
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core: <span className="text-white">Corporate Engine</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-indigo-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">{v3ControlScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(v3ControlScript.code, "v3")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${copied === "v3" ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {copied === "v3" ? 'COPIADO' : 'COPIAR SCRIPT'}
            </button>
          </div>
          <div className="p-8 bg-black/40 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{v3ControlScript.code}</pre>
          </div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
           <h4 className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
             <Database size={14} /> Integración Plai
           </h4>
           <p className="text-slate-400 text-xs leading-relaxed">
             Nara ahora utiliza el endpoint /assistant de Plai. Asegúrate de obtener el <span className="text-blue-400 font-bold">x-agent-id</span> y <span className="text-blue-400 font-bold">x-api-key</span> desde el panel de "Publicar" en la plataforma Plai.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
