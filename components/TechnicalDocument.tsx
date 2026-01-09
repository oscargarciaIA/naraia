
import React from 'react';
import { Shield, Database, Cpu, Terminal, Copy, CheckCircle2, Server, Key, Activity, Lock, AlertCircle, Book, Zap, Code, HelpCircle } from 'lucide-react';

const TechnicalDocument: React.FC = () => {
  const config = {
    endpoint: "https://plai-api-core.cencosud.ai/api/assistant",
    version: "3.7.2-HANDOVER",
    lastUpdate: new Date().toLocaleDateString()
  };

  return (
    <div className="bg-white text-slate-900 p-12 font-sans shadow-2xl rounded-3xl border border-slate-200 print:shadow-none print:border-none">
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-10">
        <div className="space-y-2">
          <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit tracking-widest uppercase mb-4">Documento de Traspaso Técnico</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nara System Blueprint</h1>
          <p className="text-slate-500 font-bold text-lg tracking-tight">Arquitectura IA Corporativa | Baseline v3.7.2</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline ID</p>
          <p className="text-2xl font-mono font-bold text-slate-900">{config.version}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">{config.lastUpdate}</p>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
          <Code size={20} className="text-blue-600"/> 1. Arquitectura de Despliegue (Script v2.0)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Módulo de Limpieza</h4>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-600"/> Purgado de procesos Node/Vite huérfanos.</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-600"/> Liberación de puertos productivos (3000).</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-600"/> Eliminación de volúmenes Docker obsoletos.</li>
            </ul>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-4">Orquestación de Contenedores</h4>
            <ul className="text-xs space-y-2 text-slate-600 font-medium">
               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Nara Frontend (Node 20 Alpine).</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> PGVector Hub (Postgres 16).</li>
               <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-600"/> Red bridge dedicada (nara_network).</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
          <Server size={20} className="text-indigo-600"/> 2. Gobierno y Script de Control v2.0
        </h2>
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl relative">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Nara_Control_v2.0.ps1 (Restored)</h4>
          </div>
          <pre className="text-[10px] font-mono text-indigo-300 leading-relaxed overflow-x-auto">
{`# 1. Liberar procesos
Get-Process | Where-Object { $_.ProcessName -match "node|vite" } | Stop-Process -Force

# 2. Generar Infraestructura
[System.IO.File]::WriteAllLines("$(Get-Location)/Dockerfile", $dockerfile)

# 3. Despliegue Purgado
docker system prune -a --volumes -f
docker-compose up -d --build`}
          </pre>
        </div>
      </section>

      <section className="bg-slate-50 p-10 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="flex items-center gap-4 mb-6">
           <CheckCircle2 size={32} className="text-green-600"/>
           <h2 className="text-lg font-black uppercase tracking-tight">Certificación v3.7.2</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-10">
          Esta versión certifica la restauración exitosa del <strong>Script Maestro de Control v2.0</strong>, asegurando que el área de infraestructura reciba una herramienta de despliegue robusta, limpia y totalmente compatible con el motor Plai.
        </p>
        <div className="grid grid-cols-2 gap-20">
           <div className="border-t-2 border-slate-900 pt-4">
              <p className="text-sm font-bold">Nara Virtual Engine</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Baseline v3.7.2</p>
           </div>
           <div className="border-t-2 border-slate-900 pt-4">
              <p className="text-sm font-bold">Infraestructura TI</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase">Entrega Certificada</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicalDocument;
