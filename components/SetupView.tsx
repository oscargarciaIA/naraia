
import React, { useState } from 'react';
// Import Database and Cpu icons to fix "Cannot find name" errors
import { 
  Check, Server, Github, KeyRound, Info, Zap, RefreshCw, FileCode, Shield, AlertCircle, XCircle, Terminal, Database, Cpu
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const stableScript = {
    name: "Nara_Super_Repair_v1.2.4.ps1",
    desc: "Script avanzado de reparación: Verifica Docker, libera el puerto 3000, elimina versiones obsoletas y restaura el sistema.",
    code: `# Nara_Super_Repair_v124.ps1
Write-Host "--- INICIANDO SUPER REPARACIÓN NARA v1.2.4 ---" -ForegroundColor Cyan

# 1. VERIFICAR DOCKER
Write-Host "[1/5] Verificando comunicación con Docker Engine..." -ForegroundColor Gray
try {
    $dockerCheck = docker version --format '{{.Server.Version}}' -ErrorAction Stop
    Write-Host "✅ Docker está activo (Versión: $dockerCheck)" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Docker Desktop no está respondiendo." -ForegroundColor Red
    Write-Host "POR FAVOR: Abre Docker Desktop, espera a que el icono esté en verde y vuelve a ejecutar este script." -ForegroundColor Yellow
    exit
}

# 2. LIBERAR PUERTO 3000
Write-Host "[2/5] Buscando conflictos en puerto 3000..." -ForegroundColor Gray
$portProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portProcess) {
    Write-Host "⚠️ Puerto 3000 ocupado. Liberando..." -ForegroundColor Yellow
    Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Puerto liberado." -ForegroundColor Green
} else {
    Write-Host "✅ Puerto 3000 disponible." -ForegroundColor Green
}

# 3. GENERAR ARCHIVOS LIMPIOS (SIN BOM)
Write-Host "[3/5] Regenerando manifiestos de despliegue..." -ForegroundColor Gray
$utf8 = New-Object System.Text.UTF8Encoding($false)

$df = @"
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
"@

$dc = @"
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    restart: always
    environment:
      - POSTGRES_USER=nara_admin
      - POSTGRES_PASSWORD=\${env:DB_PASSWORD:-nara_secure_2024}
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

[System.IO.File]::WriteAllText("Dockerfile", $df, $utf8)
[System.IO.File]::WriteAllText("docker-compose.yml", $dc, $utf8)

# 4. LIMPIEZA PROFUNDA DE CONTENEDORES
Write-Host "[4/5] Eliminando contenedores huérfanos y redes viejas..." -ForegroundColor Gray
docker-compose down --remove-orphans

# 5. DESPLIEGE FINAL
Write-Host "[5/5] Reconstruyendo Nara Environment..." -ForegroundColor Gray
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Cyan
Write-Host "✅ NARA v1.2.4 DESPLEGADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "Accede en: http://localhost:3000" -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Centro de Reparación Nara v1.2.4</h2>
              <p className="text-sm text-slate-500">Ajuste automático de Docker, Puertos y Redes.</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase">Master Engine</div>
        </header>

        {/* Alerta de Error de Conexión Docker */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-red-100 rounded-full text-red-600">
            <Terminal size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-red-900 font-bold text-sm mb-1">Error de Comunicación detectado</h3>
            <p className="text-red-800 text-xs mb-3">
              Si ves el error <code className="bg-red-100 px-1 font-bold">//./pipe/dockerDesktopLinuxEngine</code>, es porque Docker Desktop no está corriendo o está bloqueado.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-white border border-red-200 rounded text-[10px] font-bold text-red-700">1. Abre Docker Desktop</span>
              <span className="px-2 py-1 bg-white border border-red-200 rounded text-[10px] font-bold text-red-700">2. Espera luz Verde</span>
              <span className="px-2 py-1 bg-white border border-red-200 rounded text-[10px] font-bold text-red-700">3. Ejecuta el script de abajo</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-bold text-slate-700 text-sm tracking-tight">{stableScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(stableScript.code, "stable")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${copied === "stable" ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              {copied === "stable" ? <Check size={14}/> : <RefreshCw size={14}/>}
              {copied === "stable" ? '¡Copiado!' : 'Copiado para PowerShell'}
            </button>
          </div>
          <div className="p-8">
            <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <Info className="text-blue-500 shrink-0" size={18} />
              <p className="text-xs text-blue-700 leading-relaxed">
                {stableScript.desc} <strong>Este script soluciona automáticamente el error de puerto ocupado y limpia la configuración de Docker.</strong>
              </p>
            </div>
            <div className="relative group">
              <pre className="bg-slate-900 p-6 rounded-2xl font-mono text-[11px] text-blue-300 overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                {stableScript.code}
              </pre>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <FileCode size={20} className="text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Red de Datos</h4>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Database size={16} className="text-indigo-500" /> pgvector/pg16
            </div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Puerto App</h4>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Server size={16} className="text-green-500" /> localhost:3000
            </div>
          </div>
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Versión Engine</h4>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Cpu size={16} className="text-amber-500" /> Gemini 3 Pro
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SetupView;
