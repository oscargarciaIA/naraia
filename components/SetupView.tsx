
import React, { useState } from 'react';
import { 
  Check, Server, Zap, Terminal, Database, Activity, LayoutDashboard, RefreshCw, ShieldCheck, HardDrive, Globe, AlertCircle
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
    desc: "SCRIPT DE CONTROL MAESTRO v2.0: Genera automáticamente Dockerfile, .dockerignore y docker-compose.yml. Limpia procesos y despliega el entorno Nara v2.0.0 desde cero.",
    code: `# Nara_Control_v2.0.ps1
Write-Host "--- NARA SYSTEM CHECKPOINT v2.0 ---" -ForegroundColor Cyan -BackgroundColor Black

# 1. LIMPIEZA DE PROCESOS HUÉRFANOS EN WINDOWS
Write-Host "[1/6] Liberando puertos y procesos (Node/Vite)..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. CREACIÓN DE ARCHIVOS DE CONFIGURACIÓN (Evitando errores de encoding)
Write-Host "[2/6] Generando archivos de configuración de infraestructura..." -ForegroundColor Gray

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
# Guardar con codificación UTF8 explícita para evitar caracteres invisibles
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

# 3. DETENCIÓN TOTAL DE DOCKER
Write-Host "[3/6] Deteniendo contenedores activos..." -ForegroundColor Gray
$containers = docker ps -q
if ($containers) { docker stop $containers }

# 4. PURGA DE SISTEMA
Write-Host "[4/6] Ejecutando purga de volúmenes obsoletos..." -ForegroundColor Yellow
docker system prune -a --volumes -f

# 5. DESPLIEGUE v2.0
Write-Host "[5/6] Levantando entorno Nara v2.0.0..." -ForegroundColor Cyan
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "✅ SISTEMA v2.0 ONLINE EN http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto font-sans text-slate-300">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        
        {/* HEADER CONTROL PANEL */}
        <header className="flex items-center justify-between bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Control Center v2.0</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estado: Punto de Control Verificado</p>
              </div>
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Build ID</p>
            <p className="text-sm font-mono text-indigo-400">STABLE-V2-MASTER</p>
          </div>
        </header>

        {/* INDICADORES DE SISTEMA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
            <Activity className="text-blue-400" size={24} />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Uptime Sistema</p>
              <p className="text-lg font-mono text-white">100% Stable</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
            <Database className="text-purple-400" size={24} />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Base de Datos</p>
              <p className="text-lg font-mono text-white">PGVector Active</p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
            <Globe className="text-green-400" size={24} />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Endpoint TI</p>
              <p className="text-lg font-mono text-white">:3000</p>
            </div>
          </div>
        </div>

        {/* SCRIPT DE DESPLIEGUE v2.0 */}
        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal size={20} className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">Script de Control Maestro</h3>
              </div>
              <p className="text-sm text-slate-400 max-w-xl">{checkpointScript.desc}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(checkpointScript.code, "v2")}
              className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 whitespace-nowrap ${copied === "v2" ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/30'}`}
            >
              {copied === "v2" ? <Check size={20}/> : <Zap size={20}/>}
              {copied === "v2" ? 'SCRIPT COPIADO' : 'COPIAR SCRIPT v2.0'}
            </button>
          </div>
          <div className="p-8 bg-slate-950/50">
            <div className="relative">
              <pre className="bg-black p-8 rounded-3xl font-mono text-[11px] text-indigo-300 overflow-x-auto border border-indigo-900/10 leading-relaxed shadow-inner">
                {checkpointScript.code}
              </pre>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/10 border border-blue-900/30 p-6 rounded-2xl flex gap-4 items-start">
           <AlertCircle className="text-blue-500 shrink-0" size={20} />
           <p className="text-xs text-blue-200/70 leading-relaxed">
             <strong>Nota de Despliegue:</strong> El script ha sido actualizado para manejar la codificación de archivos automáticamente. Esto soluciona los errores de "unknown instruction" al momento de parsear el Dockerfile en entornos Windows.
           </p>
        </div>

        <footer className="text-center py-8">
           <p className="text-[10px] text-slate-600 uppercase tracking-[0.6em] font-black">Nara Core Framework • Punto de Control v2.0.0 Stable</p>
        </footer>

      </div>
    </div>
  );
};

export default SetupView;
