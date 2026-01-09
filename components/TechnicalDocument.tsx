
import React from 'react';
import { Shield, Database, Cpu, Terminal, Copy, CheckCircle2, Server, Key, Activity, Lock, AlertCircle, Book, Zap, Code, HelpCircle } from 'lucide-react';

const TechnicalDocument: React.FC = () => {
  const config = {
    endpoint: "https://plai-api-core.cencosud.ai/api/assistant",
    version: "3.7.0-HANDOVER",
    lastUpdate: new Date().toLocaleDateString()
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white text-slate-900 p-12 font-sans shadow-2xl rounded-3xl border border-slate-200 print:shadow-none print:border-none">
      {/* Header Corporativo de Traspaso */}
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10 mb-10">
        <div className="space-y-2">
          <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit tracking-widest uppercase mb-4">Documento de Traspaso Técnico</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Nara System Blueprint</h1>
          <p className="text-slate-500 font-bold text-lg tracking-tight">Arquitectura de IA Corporativa | Motor Plai</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline ID</p>
          <p className="text-2xl font-mono font-bold text-slate-900">{config.version}</p>
          <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase">{config.lastUpdate}</p>
        </div>
      </div>

      {/* 1. Arquitectura Lógica */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
          <Code size={20} className="text-blue-600"/> 1. Arquitectura Lógica del Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center">
            <div className="bg-white w-12 h-12 rounded-2xl shadow-sm mx-auto flex items-center justify-center mb-4 text-blue-600">
               <Activity size={24}/>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 mb-1">Capa 1</p>
            <p className="text-sm font-bold">Frontend Nara</p>
            <p className="text-[10px] text-slate-500 mt-1">React 19 / Vite</p>
          </div>
          <div className="flex items-center justify-center text-slate-300">→</div>
          <div className="p-6 bg-blue-600 text-white rounded-3xl text-center shadow-xl shadow-blue-500/20">
            <div className="bg-white/20 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4">
               <Cpu size={24}/>
            </div>
            <p className="text-xs font-black uppercase text-blue-200 mb-1">Capa 2</p>
            <p className="text-sm font-bold">Plai Core Engine</p>
            <p className="text-[10px] text-blue-100 mt-1">Orquestador IA</p>
          </div>
          <div className="flex items-center justify-center text-slate-300">→</div>
          <div className="p-6 bg-slate-900 text-white rounded-3xl text-center">
            <div className="bg-white/10 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4">
               <Database size={24}/>
            </div>
            <p className="text-xs font-black uppercase text-slate-500 mb-1">Capa 3</p>
            <p className="text-sm font-bold">PGVector DB</p>
            <p className="text-[10px] text-slate-400 mt-1">Semantic Store</p>
          </div>
        </div>
        <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
           <p className="text-xs text-indigo-900 font-medium leading-relaxed">
             <strong>Flujo Operativo:</strong> El usuario envía un prompt → Nara inyecta contexto de PGVector → Nara realiza llamada autenticada a Plai mediante Headers → Plai devuelve respuesta semántica con grounding de fuentes oficiales.
           </p>
        </div>
      </section>

      {/* 2. Runbook de Gestión de Errores */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
          <Zap size={20} className="text-amber-500"/> 2. Runbook: Resolución de Incidencias
        </h2>
        <div className="space-y-4">
          <div className="flex gap-6 p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
            <div className="bg-red-100 text-red-600 p-4 rounded-2xl h-fit">
              <AlertCircle size={24}/>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-1">Error 401 / 403 (Unauthorized)</h4>
              <p className="text-xs text-slate-600 mb-3">La API Key de Plai ha expirado o el Agent ID es incorrecto.</p>
              <div className="flex gap-2">
                <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-bold">Solución:</span>
                <span className="text-[10px] text-slate-500">Actualizar credenciales en el Panel de Control v3.7.0.</span>
              </div>
            </div>
          </div>
          <div className="flex gap-6 p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
            <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl h-fit">
              <Shield size={24}/>
            </div>
            <div>
              <h4 className="text-sm font-bold mb-1">Error de Red (CORS / Failed to Fetch)</h4>
              <p className="text-xs text-slate-600 mb-3">Bloqueo de red o endpoint fuera de alcance.</p>
              <div className="flex gap-2">
                <span className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full font-bold">Solución:</span>
                <span className="text-[10px] text-slate-500">Verificar conexión VPN y el estado del servicio en https://plai-api-core.cencosud.ai</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Variables y Despliegue */}
      <section className="mb-16">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
          <Server size={20} className="text-indigo-600"/> 3. Gobierno y Despliegue
        </h2>
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Master Deployment Script v3.7.0</h4>
            <div className="flex gap-2">
               <span className="w-3 h-3 rounded-full bg-red-500"></span>
               <span className="w-3 h-3 rounded-full bg-amber-500"></span>
               <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
          </div>
          <pre className="text-[11px] font-mono text-indigo-300 leading-relaxed overflow-x-auto">
{`# Procedimiento de Despliegue en Caliente
$NARA_ENV = @{
    "PLAI_URL" = "${config.endpoint}"
    "AGENT_ID" = "[CONFIGURED_SECRET]"
    "API_KEY"  = "[CONFIGURED_SECRET]"
    "STORAGE"  = "PGVector_v16"
}

# 1. Purgar contenedores legacy
docker stop nara_legacy && docker rm nara_legacy

# 2. Reconstruir con v3.7.0
docker-compose up -d --build --force-recreate`}
          </pre>
        </div>
      </section>

      {/* 4. Firma de Responsabilidad */}
      <section className="bg-slate-50 p-10 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="flex items-center gap-4 mb-6">
           <CheckCircle2 size={32} className="text-green-600"/>
           <h2 className="text-lg font-black uppercase tracking-tight">Certificación de Entrega Técnica</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-10">
          Se certifica que el sistema <strong>Nara</strong> en su versión <strong>3.7.0</strong> ha sido transferido al área de infraestructura. Se han validado todos los puntos de control de autenticación, persistencia y seguridad. El sistema se encuentra operando bajo el motor corporativo <strong>Plai</strong> en modo de alta disponibilidad.
        </p>
        <div className="grid grid-cols-2 gap-20">
           <div className="border-t-2 border-slate-900 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entrega:</p>
              <p className="text-sm font-bold">Nara Virtual Assistant Engine</p>
              <p className="text-[10px] font-mono text-slate-500">Punto de Control Maestro v3.7.0</p>
           </div>
           <div className="border-t-2 border-slate-900 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recibe:</p>
              <p className="text-sm font-bold">Área de Infraestructura / TI</p>
              <p className="text-[10px] font-mono text-slate-500">Multinacional - Rama Producción</p>
           </div>
        </div>
      </section>

      <div className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
        NARA V3.7.0 | HANDOVER EDITION | CENCOSUD AI
      </div>
    </div>
  );
};

export default TechnicalDocument;
