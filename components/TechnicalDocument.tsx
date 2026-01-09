
import React from 'react';
import { FileText, Shield, Globe, Database, Cpu, Terminal, Copy, CheckCircle2, Server, Key, Activity, Lock, AlertCircle } from 'lucide-react';

const TechnicalDocument: React.FC = () => {
  const config = {
    endpoint: "https://plai-api-core.cencosud.ai/api/assistant",
    version: "3.6.0-STABLE",
    lastUpdate: new Date().toLocaleDateString()
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white text-slate-900 p-10 font-sans shadow-2xl rounded-3xl border border-slate-200 print:shadow-none print:border-none">
      {/* Header Corporativo */}
      <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Dossier Técnico de Producción</h1>
          <p className="text-blue-600 font-bold text-sm tracking-widest mt-1">SISTEMA NARA | MOTOR CORPORATIVO PLAI</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase">Control de Versión</p>
          <p className="text-lg font-mono font-bold text-slate-800">{config.version}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <Activity className="text-blue-600 mb-3" size={24} />
          <h3 className="text-xs font-black text-slate-500 uppercase mb-2">Motor de Inferencia</h3>
          <p className="text-sm font-bold">Plai Core Engine</p>
          <p className="text-[11px] text-slate-400">Despliegue Cencosud AI</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <Database className="text-indigo-600 mb-3" size={24} />
          <h3 className="text-xs font-black text-slate-500 uppercase mb-2">Motor de Datos</h3>
          <p className="text-sm font-bold">PGVector 16 (RAG Optimized)</p>
          <p className="text-[11px] text-slate-400">Persistencia de Contexto TI</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <Shield className="text-green-600 mb-3" size={24} />
          <h3 className="text-xs font-black text-slate-500 uppercase mb-2">Protocolo de Red</h3>
          <p className="text-sm font-bold">TLS 1.3 + Auth Headers</p>
          <p className="text-[11px] text-slate-400">Certificación de Canal Seguro</p>
        </div>
      </div>

      {/* Diagnóstico de Autenticación */}
      <section className="mb-12 bg-amber-50 border border-amber-100 p-8 rounded-3xl">
        <h2 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertCircle size={16} className="text-amber-600"/> Apéndice A: Diagnóstico de Autenticación Plai
        </h2>
        <p className="text-xs text-amber-800 mb-4 leading-relaxed">
          Para validar errores de autenticación (401/403), el área de infraestructura debe verificar que los headers se envíen con el siguiente formato exacto:
        </p>
        <div className="bg-slate-900 p-4 rounded-xl">
          <pre className="text-[10px] text-amber-200 font-mono">
{`curl -X POST "${config.endpoint}" \\
  -H "Content-Type: application/json" \\
  -H "x-agent-id: [VALOR_LOCAL]" \\
  -H "x-api-key: [VALOR_LOCAL]" \\
  -d '{"input": "test", "useGrounding": true}'`}
          </pre>
        </div>
      </section>

      {/* Parámetros de Configuración */}
      <section className="mb-12">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Key size={16} className="text-blue-600"/> 1. Variables de Entorno y Control de Acceso
        </h2>
        <div className="overflow-hidden border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Variable Operativa</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Estado Configuración</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Políticas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 font-mono text-xs text-blue-600">PLAI_URL</td>
                <td className="px-6 py-4 font-mono text-xs truncate max-w-xs">{config.endpoint}</td>
                <td className="px-6 py-4 font-bold text-green-600 text-xs text-center">CERTIFICADO</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-mono text-xs text-blue-600">AGENT_ID</td>
                <td className="px-6 py-4 font-bold text-slate-400 italic flex items-center gap-2">
                  <Lock size={12}/> [VALOR RESTRINGIDO]
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600 text-xs text-center">ENCRIPTADO</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-mono text-xs text-blue-600">API_KEY</td>
                <td className="px-6 py-4 font-bold text-slate-400 italic flex items-center gap-2">
                  <Lock size={12}/> [VALOR RESTRINGIDO]
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600 text-xs text-center">ENCRIPTADO</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Docker Compose v3.6.0 */}
      <section className="mb-12">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Server size={16} className="text-indigo-600"/> 2. Orquestación de Microservicios v3.6.0
        </h2>
        <div className="bg-slate-900 rounded-2xl p-6 relative group">
          <button onClick={() => copyToClipboard(`services:\n  nara-app:\n    environment:\n      - PLAI_URL=${config.endpoint}`)} className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors">
            <Copy size={18} />
          </button>
          <pre className="text-[11px] font-mono text-indigo-300 leading-relaxed overflow-x-auto">
{`# Nara Maestro v3.6.0 - Docker Stack
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    environment:
      - POSTGRES_DB=nara_knowledge_hub
    ports:
      - '5432:5432'

  nara-app:
    build: .
    container_name: nara_frontend
    environment:
      - PLAI_URL=${config.endpoint}
      - AGENT_ID=\${AGENT_ID}   # Consultar Bóveda de TI
      - API_KEY=\${API_KEY}     # Consultar Bóveda de TI
    ports:
      - '3000:3000'
    depends_on:
      - nara-vector-db`}
          </pre>
        </div>
      </section>

      {/* Procedimiento de Mantenimiento */}
      <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-600"/> 3. Certificación de Traspaso v3.6.0
        </h2>
        <div className="text-sm text-slate-600 leading-relaxed">
          <p>Esta documentación certifica que el sistema Nara se encuentra en su <strong>Punto de Control Maestro v3.6.0</strong>. Se ha verificado la compatibilidad total con el motor Plai y el almacenamiento PGVector. Cualquier ajuste de red o autenticación posterior debe ser registrado en los logs de auditoría integrados.</p>
        </div>
      </section>

      <div className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
        NARA V3.6.0 | LÍNEA BASE TI | DOCUMENTO CONFIDENCIAL
      </div>
    </div>
  );
};

export default TechnicalDocument;
