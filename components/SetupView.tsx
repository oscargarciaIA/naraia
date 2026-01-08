
import React, { useState } from 'react';
import { 
  Check, Server, Github, KeyRound, Info, Zap, RefreshCw, FileCode, Shield, AlertCircle, XCircle, Terminal, Database, Cpu, LifeBuoy, Wrench, Trash2, Power, AlertOctagon, Activity
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const finalScript = {
    name: "Nara_Total_Prune_v1.4.0.ps1",
    desc: "PURGA TOTAL: Detiene TODO en Docker, limpia cache de imágenes, mata procesos de Node huérfanos y reinicia la red.",
    code: `# Nara_Total_Prune_v140.ps1
Write-Host "!!! INICIANDO PURGA TOTAL DE SISTEMA v1.4.0 !!!" -ForegroundColor White -BackgroundColor Red

# 1. MATAR PROCESOS DE WINDOWS (Vite/Node)
Write-Host "[1/6] Buscando procesos de Node/Vite colgados en Windows..." -ForegroundColor Gray
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. DETENER TODOS LOS CONTENEDORES (SIN EXCEPCIÓN)
Write-Host "[2/6] Deteniendo TODOS los contenedores activos en Docker..." -ForegroundColor Gray
$allContainers = docker ps -q
if ($allContainers) { docker stop $allContainers }

# 3. PURGA NUCLEAR DE DOCKER
Write-Host "[3/6] Ejecutando purga de sistema (Imágenes, Redes y Volúmenes)..." -ForegroundColor Yellow
docker system prune -a --volumes -f

# 4. RESET DE CONTEXTO
Write-Host "[4/6] Reseteando socket de comunicación..." -ForegroundColor Gray
docker context use default

# 5. LIMPIEZA DE ARCHIVOS TEMPORALES
if (Test-Path "docker-compose.yml") { Remove-Item "docker-compose.yml" }

# 6. RE-DESPLIEGUE LIMPIO
$dc = @"
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
Set-Content -Path "docker-compose.yml" -Value $dc

Write-Host "[6/6] Levantando entorno Nara v1.4.0..." -ForegroundColor Gray
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Red
Write-Host "✅ PURGA COMPLETADA. VERIFICA http://localhost:3000" -ForegroundColor Green`
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] p-8 overflow-y-auto font-sans text-slate-300">
      <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
        
        <header className="flex items-center justify-between bg-slate-900/50 p-6 rounded-3xl border border-red-500/30 shadow-2xl shadow-red-900/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl text-white animate-pulse">
              <AlertOctagon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Emergency Fix v1.4.0</h2>
              <p className="text-xs text-red-400 font-bold">SOLUCIÓN DE ÚLTIMA INSTANCIA PARA ERRORES DE SOCKET</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">SYSLOG: CRITICAL_PIPE_FAILURE</span>
            <span className="text-[10px] font-mono text-red-500 font-bold">HARDWARE RESET REQUIRED</span>
          </div>
        </header>

        {/* DIAGNÓSTICO DE HARDWARE/WSL */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="bg-red-950/30 p-4 border-b border-red-900/50 flex items-center gap-2">
            <Activity size={16} className="text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-200">Panel de Diagnóstico WSL2</span>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Wrench size={16} className="text-indigo-400" /> 1. Configuración de Docker
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                El error <code className="text-red-400 bg-red-400/10 px-1">npipe:////./pipe/docker_engine</code> indica que Windows no puede hablar con el motor Linux. Haz esto:
              </p>
              <ul className="text-xs space-y-2 list-disc ml-4 text-slate-300">
                <li>Ve a <strong>Settings (Tuerca)</strong> -> <strong>Resources</strong> -> <strong>WSL Integration</strong>.</li>
                <li>Asegúrate de que tu distribución (Ubuntu/Debian) esté <strong>ACTIVADA</strong>.</li>
                <li>En <strong>General</strong>, verifica que <strong>"Use the WSL 2 based engine"</strong> esté marcado.</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Power size={16} className="text-green-400" /> 2. Limpieza de Procesos
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tu captura muestra que el puerto 3000 está "allocated". Esto significa que una versión anterior no murió correctamente.
              </p>
              <div className="bg-black p-4 rounded-xl border border-slate-800">
                 <p className="text-[10px] text-green-400 font-mono italic"># El script de abajo matará:</p>
                 <p className="text-[10px] text-slate-500 font-mono">/node_modules/vite/bin/vite.js</p>
                 <p className="text-[10px] text-slate-500 font-mono">/docker-container/nara-web</p>
              </div>
            </div>
          </div>
        </div>

        {/* SCRIPT NUCLEAR */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
            <div className="flex items-center gap-3">
              <Terminal className="text-red-500" size={18} />
              <span className="font-bold text-white text-sm tracking-tight">{finalScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(finalScript.code, "final")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 ${copied === "final" ? 'bg-green-600 text-white' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/20'}`}
            >
              {copied === "final" ? <Check size={14}/> : <Zap size={14}/>}
              {copied === "final" ? '¡LISTO PARA EJECUTAR!' : 'COPIAR SCRIPT DE PURGA TOTAL'}
            </button>
          </div>
          <div className="p-8">
            <div className="relative group">
              <pre className="bg-black p-8 rounded-2xl font-mono text-[11px] text-red-400 overflow-x-auto border border-red-900/20 leading-relaxed shadow-inner h-96">
                {finalScript.code}
              </pre>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none opacity-50"></div>
            </div>
          </div>
        </div>

        <footer className="text-center p-8">
           <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Nara Security Core v1.4.0 • Multinational IT Infrastructure</p>
        </footer>

      </div>
    </div>
  );
};

export default SetupView;
