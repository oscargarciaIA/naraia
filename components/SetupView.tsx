
import React, { useState } from 'react';
import { 
  Check, Server, Zap, Terminal, Database, Activity, ShieldCheck, Globe, Zap as Flash, HardDrive
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const productionScript = {
    name: "Nara_Prod_Deploy_v3.ps1",
    desc: "SCRIPT DE PRODUCCIÓN v3.0: Despliegue sincronizado para el piloto real. Incluye reconstrucción de contenedores y mapeo de variables de entorno de alto rendimiento.",
    code: `# Nara_Prod_Deploy_v3.ps1
Write-Host ">>> NARA PRODUCTION PILOT v3.0 <<<" -ForegroundColor Green

# 1. SINCRONIZACIÓN DE ENTORNO
Write-Host "[1/4] Validando Docker Engine..." -ForegroundColor Cyan
if (!(docker ps)) { Write-Error "Docker no está corriendo!"; exit }

# 2. LIMPIEZA TOTAL
Write-Host "[2/4] Purgando versiones previas..." -ForegroundColor Yellow
docker-compose down --remove-orphans
docker system prune -f

# 3. BUILD Y DESPLIEGUE SINCRONIZADO
Write-Host "[3/4] Construyendo Nara Core v3.0..." -ForegroundColor Cyan
docker-compose up -d --build

# 4. VERIFICACIÓN DE SALUD
Write-Host "[4/4] Verificando túneles de API..." -ForegroundColor Gray
Start-Sleep -Seconds 5
Write-Host "-------------------------------------------"
Write-Host "✅ PILOTO ONLINE: http://localhost:3000" -ForegroundColor Green
Write-Host "Base de Datos: Online (pgvector)" -ForegroundColor Gray
Write-Host "-------------------------------------------"`
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        <header className="bg-gradient-to-r from-indigo-900 to-slate-900 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="flex items-center gap-8">
            <div className="p-5 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
              <ShieldCheck size={48} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Nara Production</h2>
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs mt-2 flex items-center gap-2">
                <Activity size={14} /> Sincronización de Piloto v3.0.0
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl">
             <Flash size={24} className="text-amber-400 mb-4" />
             <h4 className="text-xs font-black text-slate-500 uppercase mb-1">Engine</h4>
             <p className="text-lg font-bold text-white">Gemini 3 Pro</p>
          </div>
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl">
             <Database size={24} className="text-blue-400 mb-4" />
             <h4 className="text-xs font-black text-slate-500 uppercase mb-1">Vector DB</h4>
             <p className="text-lg font-bold text-white">pgvector v16</p>
          </div>
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl">
             <Server size={24} className="text-green-400 mb-4" />
             <h4 className="text-xs font-black text-slate-500 uppercase mb-1">Network</h4>
             <p className="text-lg font-bold text-white">Docker Hub</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
               <Terminal className="text-indigo-400" />
               <h3 className="text-xl font-bold text-white">Consola de Despliegue</h3>
            </div>
            <button 
              onClick={() => copyToClipboard(productionScript.code, "v3")}
              className={`px-8 py-4 rounded-2xl text-xs font-black tracking-widest transition-all ${copied === "v3" ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'}`}
            >
              {copied === "v3" ? 'COPIADO' : 'COPIAR SCRIPT PROD v3.0'}
            </button>
          </div>
          <div className="p-10 bg-black/40 font-mono text-xs text-indigo-300/80 leading-relaxed overflow-x-auto">
            <pre>{productionScript.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
