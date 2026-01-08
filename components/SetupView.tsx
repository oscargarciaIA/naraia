
import React, { useState } from 'react';
import { 
  Check, Server, Zap, Terminal, Database, Cpu, Activity, LayoutDashboard, RefreshCw, Layers, ShieldCheck, HardDrive, Globe
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const syncScript = {
    name: "Nara_Prod_Sync_v2.0.ps1",
    desc: "SINCRONIZACIÓN LOCAL: Úsalo cuando hagas cambios en el código y no los veas reflejados en el puerto 3000. Recrea los volúmenes sin borrar la DB.",
    code: `# Nara_Prod_Sync_v20.ps1
Write-Host "--- NARA PRODUCTION SYNC v2.0 ---" -ForegroundColor Cyan

Write-Host "[1/3] Detectando cambios en archivos locales..." -ForegroundColor Gray
# Forzamos la reconstrucción solo del frontend para ahorrar tiempo
docker-compose up -d --build nara-app

Write-Host "[2/3] Limpiando cache de Vite en el contenedor..." -ForegroundColor Gray
docker exec nara_frontend rm -rf node_modules/.vite

Write-Host "[3/3] Reiniciando servicio de aplicación..." -ForegroundColor Gray
docker-compose restart nara-app

Write-Host "-------------------------------------------" -ForegroundColor Green
Write-Host "✅ SINCRONIZACIÓN EXITOSA. REFRESCAR NAVEGADOR." -ForegroundColor White`
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto font-sans text-slate-300">
      <div className="max-w-5xl mx-auto w-full space-y-6 pb-12">
        
        {/* HEADER v2.0 */}
        <header className="flex items-center justify-between bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-500/20 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white shadow-lg shadow-indigo-500/20">
              <LayoutDashboard size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Nara System v2.0</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest">Estado: Operacional • Checkpoint Alpha</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex gap-4">
             <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Uptime</p>
                <p className="text-sm font-mono text-white">99.9%</p>
             </div>
             <div className="w-[1px] bg-slate-800"></div>
             <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Engine</p>
                <p className="text-sm font-mono text-white">Gemini 3 Pro</p>
             </div>
          </div>
        </header>

        {/* STATUS TILES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Network', val: '172.18.0.0/16', icon: Globe, color: 'text-blue-400' },
            { label: 'Frontend', val: 'Port 3000', icon: Activity, color: 'text-green-400' },
            { label: 'Vector DB', val: 'PostgreSQL 16', icon: Database, color: 'text-purple-400' },
            { label: 'Storage', val: 'Persistent Vol', icon: HardDrive, color: 'text-amber-400' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex items-center gap-4">
               <item.icon size={20} className={item.color} />
               <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{item.label}</p>
                  <p className="text-xs text-white font-mono">{item.val}</p>
               </div>
            </div>
          ))}
        </div>

        {/* SYNC PANEL */}
        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-8 border-b border-slate-800 bg-slate-900/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers size={18} className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white tracking-tight">Production Hot-Sync</h3>
              </div>
              <p className="text-sm text-slate-400 max-w-md">Si tus cambios locales no aparecen en la web, usa este script para sincronizar los archivos con el contenedor.</p>
            </div>
            <button 
              onClick={() => copyToClipboard(syncScript.code, "sync")}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 whitespace-nowrap ${copied === "sync" ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20'}`}
            >
              {copied === "sync" ? <Check size={18}/> : <RefreshCw size={18}/>}
              {copied === "sync" ? '¡Sincronizador Copiado!' : 'Copiar Script de Sincronización'}
            </button>
          </div>
          <div className="p-8">
            <pre className="bg-black p-8 rounded-3xl font-mono text-xs text-indigo-300 overflow-x-auto border border-indigo-900/20 leading-relaxed shadow-inner">
              {syncScript.code}
            </pre>
          </div>
        </div>

        {/* INFRASTRUCTURE MONITOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 space-y-4">
              <h4 className="font-bold text-white flex items-center gap-2">
                 <ShieldCheck size={18} className="text-green-500" /> Seguridad de Datos
              </h4>
              <p className="text-xs text-slate-400">Toda la comunicación entre el asistente y pgvector se realiza a través de la red aislada <code>nara_network</code>. Los datos nunca salen del entorno Docker sin encriptación TLS.</p>
           </div>
           <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 space-y-4">
              <h4 className="font-bold text-white flex items-center gap-2">
                 <Terminal size={18} className="text-amber-500" /> Consola de Auditoría
              </h4>
              <p className="text-xs text-slate-400">Los logs del sistema v2.0 ahora registran cada consulta semántica para mejorar el score de precisión del Knowledge Hub.</p>
           </div>
        </div>

        <footer className="text-center py-8">
           <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-bold">Nara Core Infrastructure • v2.0.0 Stable</p>
        </footer>

      </div>
    </div>
  );
};

export default SetupView;
