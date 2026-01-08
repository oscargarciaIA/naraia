
import React, { useState } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, Server
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const v2ControlScript = {
    name: "Nara_Control_v2.0.ps1",
    desc: "SCRIPT DE CONTROL v2.0: Utiliza este script para sincronizar el Docker sin errores de infraestructura.",
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
Write-Host "? SISTEMA v2.0 ONLINE EN http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        <header className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-2xl">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">System Checkpoint v2.0</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Infraestructura Verificada | Lógica de Datos v3.0</p>
            </div>
          </div>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-indigo-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">{v2ControlScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(v2ControlScript.code, "v2")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${copied === "v2" ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
            >
              {copied === "v2" ? 'COPIADO' : 'COPIAR SCRIPT v2.0'}
            </button>
          </div>
          <div className="p-8 bg-black/40 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
            <pre>{v2ControlScript.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
