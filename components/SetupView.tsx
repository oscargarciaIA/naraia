
import React, { useState } from 'react';
import { 
  Check, Server, Github, KeyRound, Info, Zap, RefreshCw, FileCode, Shield, AlertCircle, XCircle, Terminal, Database, Cpu, LifeBuoy, Wrench
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const pipeFixCommand = `docker context use default; wsl --shutdown`;

  const stableScript = {
    name: "Nara_Deep_Repair_v1.2.5.ps1",
    desc: "REPARACIÓN PROFUNDA: Reinicia el subsistema WSL, resetea contextos de Docker y limpia puertos bloqueados.",
    code: `# Nara_Deep_Repair_v125.ps1
Write-Host "--- NARA EMERGENCY RECOVERY v1.2.5 ---" -ForegroundColor Red

# 1. RESETEAR CONTEXTO (Arregla el error del Pipe)
Write-Host "[1/4] Reseteando túneles de comunicación Docker..." -ForegroundColor Gray
docker context use default

# 2. REINICIAR WSL (Si el motor está bloqueado)
Write-Host "[2/4] ¿Reiniciar subsistema WSL? (Sugerido para error ENOENT)" -ForegroundColor Yellow
Write-Host "Si Docker Desktop sigue en rojo, ejecuta 'wsl --shutdown' manualmente." -ForegroundColor Gray

# 3. LIMPIEZA DE PUERTO 3000
$portProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portProcess) {
    Write-Host "[3/4] Liberando puerto 3000..." -ForegroundColor Yellow
    Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction SilentlyContinue
}

# 4. REGENERAR Y SUBIR
Write-Host "[4/4] Limpiando y relanzando contenedores..." -ForegroundColor Gray
docker-compose down --remove-orphans
docker-compose up -d --build

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "✅ INTENTO DE REPARACIÓN v1.2.5 FINALIZADO" -ForegroundColor Green
Write-Host "Si el error persiste: REINICIA DOCKER DESKTOP DESDE EL ICONO DE LA BARRA DE TAREAS." -ForegroundColor Cyan`
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto font-sans">
      <div className="max-w-4xl mx-auto w-full space-y-8 pb-12">
        
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg shadow-red-200">
              <Wrench size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Recuperación de Sistema v1.2.5</h2>
              <p className="text-sm text-slate-500">Diagnóstico y reparación de Docker Pipe Errors.</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase mb-1">Emergency Mode</span>
            <span className="text-[10px] text-slate-400 font-mono">ID: NARA-DEEP-FIX</span>
          </div>
        </header>

        {/* ALERTA CRÍTICA: ERROR DE PIPE */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <AlertCircle size={160} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <LifeBuoy className="animate-bounce" />
              <h3 className="text-lg font-bold">Error Crítico: "Pipe Not Found" detectado</h3>
            </div>
            <p className="text-sm text-red-100 mb-6 max-w-2xl leading-relaxed">
              Tus capturas indican que el motor de Docker ha perdido el control de su túnel de datos. 
              Esto suele pasar cuando Docker Desktop intenta usar un motor Linux que no ha terminado de arrancar en Windows.
            </p>
            
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs font-bold mb-2 uppercase text-red-200">Solución Rápida (PowerShell):</p>
                <div className="flex items-center gap-3">
                  <code className="bg-black/40 px-3 py-2 rounded text-xs font-mono flex-1">{pipeFixCommand}</code>
                  <button 
                    onClick={() => copyToClipboard(pipeFixCommand, "pipe")}
                    className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {copied === "pipe" ? <Check size={18}/> : <RefreshCw size={18}/>}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 bg-white/10 p-4 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-1">1. Reinicio Manual</h4>
                  <p className="text-[10px] text-red-100">Click derecho en icono de Docker -> Restart Docker Desktop.</p>
                </div>
                <div className="flex-1 bg-white/10 p-4 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold mb-1">2. Validar WSL</h4>
                  <p className="text-[10px] text-red-100">Asegúrate de que 'WSL 2 based engine' esté activo en Settings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <Terminal className="text-slate-400" size={18} />
              <span className="font-bold text-slate-700 text-sm tracking-tight">{stableScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(stableScript.code, "stable")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 ${copied === "stable" ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              {copied === "stable" ? <Check size={14}/> : <RefreshCw size={14}/>}
              {copied === "stable" ? 'Copiar Script de Rescate' : 'Copiar Script de Rescate'}
            </button>
          </div>
          <div className="p-8">
            <pre className="bg-slate-900 p-6 rounded-2xl font-mono text-[11px] text-blue-300 overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
              {stableScript.code}
            </pre>
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
