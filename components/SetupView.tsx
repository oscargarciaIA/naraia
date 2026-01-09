
import React, { useState } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, Server, RefreshCcw, Key, Globe
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const v3ControlScript = {
    name: "Nara_Plai_Cencosud_v3.1.ps1",
    desc: "SCRIPT MAESTRO v3.1: Conectividad certificada con plai-api-core.cencosud.ai.",
    code: `# Nara_Plai_Cencosud_v3.1.ps1
Write-Host "--- NARA SYSTEM BASELINE v3.1 (CENCOSUD EDITION) ---" -ForegroundColor Cyan -BackgroundColor Black

# 0. VALIDACIÓN DE CREDENCIALES PLAI CORPORATIVO
if (-not $env:AGENT_ID) {
    Write-Host "[!] REQUERIDO: Ingrese el x-agent-id (ej. 6960455c458bc6df36d7407f)" -ForegroundColor Yellow
    $userInputAgent = Read-Host "AGENT ID"
    if (-not $userInputAgent) { exit }
    $env:AGENT_ID = $userInputAgent
}

if (-not $env:API_KEY) {
    Write-Host "[!] REQUERIDO: Ingrese el x-api-key corporativo" -ForegroundColor Yellow
    $userInputKey = Read-Host "API KEY"
    if (-not $userInputKey) { exit }
    $env:API_KEY = $userInputKey
}

# 1. LIMPIEZA
Write-Host "[1/6] Liberando recursos del host..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. GENERACIÓN DE INFRAESTRUCTURA DOCKER
Write-Host "[2/6] Configurando entorno Docker Cencosud..." -ForegroundColor Gray

$composeFile = @"
services:
  nara-app:
    build: .
    container_name: nara_frontend
    restart: always
    ports:
      - '3000:3000'
    environment:
      - AGENT_ID=$($env:AGENT_ID)
      - API_KEY=$($env:API_KEY)
    networks:
      - nara_network
networks:
  nara_network:
    driver: bridge
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/docker-compose.yml", $composeFile)

# 3. REINICIO DE CONTENEDORES
Write-Host "[3/6] Deteniendo contenedores previos..." -ForegroundColor Gray
docker-compose down --remove-orphans

# 4. DESPLIEGUE FINAL
Write-Host "[4/6] Levantando Nara v3.1 (Motor Plai Cencosud)..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "SISTEMA v3.1 ONLINE: http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        <header className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Globe size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Plai Cencosud Gateway</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Línea Base v3.1 | Conexión con plai-api-core.cencosud.ai</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
             <Activity className="text-green-400" />
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network: <span className="text-white">Cencosud AI Cloud</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
             <Key className="text-blue-400" />
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auth: <span className="text-white">x-api-key Required</span></div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
             <Zap className="text-amber-400" />
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency: <span className="text-white">Optimized</span></div>
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
              {copied === "v3" ? 'COPIADO' : 'COPIAR SCRIPT CENCOSUD'}
            </button>
          </div>
          <div className="p-8 bg-black/40 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{v3ControlScript.code}</pre>
          </div>
        </div>
        
        <div className="bg-green-900/10 border border-green-500/20 p-6 rounded-2xl">
           <h4 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
             <ShieldCheck size={14} /> Certificación Corporativa
           </h4>
           <p className="text-slate-400 text-xs leading-relaxed">
             La comunicación está configurada según los estándares de seguridad de Cencosud. El x-agent-id <span className="text-white">6960455c458bc6df36d7407f</span> y tu x-api-key se inyectan automáticamente en el contenedor Docker.
           </p>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
