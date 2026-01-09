
import React from 'react';
import { FileText, Shield, Globe, Database, Cpu, Terminal, Copy, CheckCircle2, Server, Key, Activity, Lock } from 'lucide-react';

const TechnicalDocument: React.FC = () => {
  const config = {
    endpoint: "https://plai-api-core.cencosud.ai/api/assistant",
    version: "3.5.1-MASTER",
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
          <h3 className="text-xs font-black text-slate-500 uppercase mb-2">Motor Primario</h3>
          <p className="text-sm font-bold">Plai Core Neural Engine</p>
          <p className="text-[11px] text-slate-400">Propietario Cencosud AI</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <Database className="text-indigo-600 mb-3" size={24} />
          <h3 className="text-xs font-black text-slate-500 uppercase mb-2">Vector Engine</h3>
          <p className="text-sm font-bold">PGVector / PostgreSQL 16</p>
          <p className="text-[11px] text-slate-400">Indexación Semántica Local</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <Shield className="text-green-600 mb-3" size={24} />
          <h3 className="text-xs font-black text-slate-500 uppercase mb-2">Compliance TI</h3>
          <p className="text-sm font-bold">Protocolo x-agent-id / x-api-key</p>
          <p className="text-[11px] text-slate-400">Autenticación Segura (Cifrada)</p>
        </div>
      </div>

      {/* Parámetros de Configuración */}
      <section className="mb-12">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Key size={16} className="text-blue-600"/> 1. Variables de Entorno del Sistema Plai
        </h2>
        <div className="overflow-hidden border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Variable Operativa</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Valor Configurado</th>
                <th className="px-6 py-4 font-black text-slate-500 text-[10px] uppercase">Seguridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 font-mono text-xs text-blue-600">PLAI_URL</td>
                <td className="px-6 py-4 font-mono text-xs truncate max-w-xs">{config.endpoint}</td>
                <td className="px-6 py-4 font-bold text-green-600 text-xs">PÚBLICO</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-mono text-xs text-blue-600">AGENT_ID</td>
                <td className="px-6 py-4 font-bold text-slate-400 italic flex items-center gap-2">
                  <Lock size={12}/> [ACCESO RESTRINGIDO]
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600 text-xs text-center">CIFRADO</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-mono text-xs text-blue-600">API_KEY</td>
                <td className="px-6 py-4 font-bold text-slate-400 italic flex items-center gap-2">
                  <Lock size={12}/> [ACCESO RESTRINGIDO]
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600 text-xs text-center">CIFRADO</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[10px] text-slate-400 italic">Nota: Los valores de las credenciales se almacenan de forma segura en el almacenamiento local cifrado o variables de entorno del contenedor y no se exponen en este reporte.</p>
      </section>

      {/* Docker Compose v3.5 */}
      <section className="mb-12">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Server size={16} className="text-indigo-600"/> 2. Orquestación de Microservicios (Línea Base)
        </h2>
        <div className="bg-slate-900 rounded-2xl p-6 relative group">
          <button onClick={() => copyToClipboard(`services:\n  nara-app:\n    environment:\n      - PLAI_URL=${config.endpoint}\n      - AGENT_ID=\${AGENT_ID}\n      - API_KEY=\${API_KEY}`)} className="absolute right-4 top-4 text-slate-500 hover:text-white transition-colors">
            <Copy size={18} />
          </button>
          <pre className="text-[11px] font-mono text-indigo-300 leading-relaxed overflow-x-auto">
{`# Nara Control Point v3.5.1 - Docker Stack
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
      - AGENT_ID=\${AGENT_ID}   # Inyectado desde Bóveda de TI
      - API_KEY=\${API_KEY}     # Inyectado desde Bóveda de TI
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
          <CheckCircle2 size={16} className="text-green-600"/> 3. Certificación de Traspaso
        </h2>
        <div className="text-sm text-slate-600 leading-relaxed">
          <p>El sistema Nara ha sido validado contra el motor corporativo <strong>Plai</strong>. Se certifica que la identidad del agente y las llaves de acceso están configuradas correctamente en el Punto de Control 3.5.1, garantizando la soberanía de datos y el cumplimiento de las políticas de seguridad del área de TI.</p>
        </div>
      </section>

      <div className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
        NARA V3.5.1 | PUNTO DE CONTROL TI | CONFIDENCIAL
      </div>
    </div>
  );
};

export default TechnicalDocument;
