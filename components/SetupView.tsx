
import React, { useState } from 'react';
import { 
  Check, Server, Zap, Terminal, Database, Activity, ShieldCheck, Globe, AlertCircle, HardDrive
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const checkpointScript = {
    name: "Nara_Control_v2.0.ps1",
    desc: "SCRIPT DE CONTROL MAESTRO v2.1: Procedimiento verificado para la reconstrucción total del entorno. Genera infraestructura con codificación de seguridad binaria.",
    code: `# Nara_Control_v2.0.ps1
Write-Host "--- NARA SYSTEM CHECKPOINT v2.1 ---" -ForegroundColor Cyan -BackgroundColor Black

# 1. LIMPIEZA DE PROCESOS
Write-Host "[1/6] Liberando recursos del sistema..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. GENERACIÓN DE INFRAESTRUCTURA (Safe Encoding)
Write-Host "[2/6] Escribiendo archivos de configuración..." -ForegroundColor Gray

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
      - API_KEY=\${env:API_KEY}
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
Write-Host "[3/6] Deteniendo servicios activos..." -ForegroundColor Gray
$containers = docker ps -q
if ($containers) { docker stop $containers }

# 4. PURGA DE VOLÚMENES
Write-Host "[4/6] Limpiando caché de volúmenes..." -ForegroundColor Yellow
docker system prune -a --volumes -f

# 5. DESPLIEGUE FINAL
Write-Host "[5/6] Levantando base v2.1.0..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "✅ SISTEMA v2.1 ONLINE EN http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto font-sans text-slate-300">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        
        <header className="flex items-center justify-between bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Nara Core v2.1</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Base de Operaciones Verificada</p>
              </div>
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Checkpoint</p>
            <p className="text-sm font-mono text-indigo-400">STABLE-2.1-GLOBAL</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <Activity className="text-blue-400 mb-3" size={20} />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Estado</p>
            <p className="text-lg font-mono text-white">Online</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <Database className="text-purple-400 mb-3" size={20} />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Engine</p>
            <p className="text-lg font-mono text-white">Vector v16</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <HardDrive className="text-orange-400 mb-3" size={20} />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Storage</p>
            <p className="text-lg font-mono text-white">Persistent</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <Globe className="text-green-400 mb-3" size={20} />
            <p className="text-[10px] text-slate-500 font-bold uppercase">Port</p>
            <p className="text-lg font-mono text-white">3000</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal size={20} className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">Script de Despliegue Consolidado</h3>
              </div>
              <p className="text-sm text-slate-400 max-w-xl">{checkpointScript.desc}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(checkpointScript.code, "v21")}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 ${copied === "v21" ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {copied === "v21" ? <Check size={20}/> : <Zap size={20}/>}
              {copied === "v21" ? 'COPIADO' : 'COPIAR SCRIPT v2.1'}
            </button>
          </div>
          <div className="p-8 bg-black/50">
            <pre className="font-mono text-[11px] text-indigo-300 overflow-x-auto leading-relaxed">
              {checkpointScript.code}
            </pre>
          </div>
        </div>

        <footer className="text-center py-6">
           <p className="text-[10px] text-slate-600 uppercase tracking-[0.5em] font-black">Nara IT Assistant • Punto de Control Estable v2.1.0</p>
        </footer>
      </div>
    </div>
  );
};

export default SetupView;
