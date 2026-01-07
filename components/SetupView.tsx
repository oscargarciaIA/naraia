
import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Box, Code2, Command, Cpu } from 'lucide-react';

const SETUP_SCRIPT = `cat <<EOF > Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOF

cat <<EOF > docker-compose.yml
version: '3.8'
services:
  nara-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=\${API_KEY}
    restart: always
EOF

echo "✅ Archivos de infraestructura generados por Nara con éxito."`;

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header con estilo Dashboard de TI */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded">TI-ADMIN</span>
              <h2 className="text-2xl font-bold text-slate-800">Despliegue de Infraestructura</h2>
            </div>
            <p className="text-slate-500 text-sm">Ejecuta comandos de terminal para inicializar el contenedor Nara en tu servidor local.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-slate-600">Status: Provisioning Ready</span>
            </div>
          </div>
        </header>

        {/* Bloque de Script de Terminal (Solución al error de archivos) */}
        <section className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="px-5 py-3 bg-slate-800 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-indigo-400" />
              <span className="text-xs font-mono text-slate-300">nara-init-script.sh</span>
            </div>
            <button 
              onClick={() => copyToClipboard(SETUP_SCRIPT, 'script')}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              {copied === 'script' ? (
                <><Check size={14} className="text-green-400" /> Copiado</>
              ) : (
                <><Copy size={14} /> Copiar comando</>
              )}
            </button>
          </div>
          <div className="p-6 font-mono text-sm">
            <div className="flex gap-4">
              <span className="text-slate-600 select-none">$</span>
              <code className="text-indigo-300 break-all leading-relaxed whitespace-pre-wrap">
                {SETUP_SCRIPT}
              </code>
            </div>
          </div>
          <div className="px-5 py-2 bg-slate-900/50 text-[10px] text-slate-500 flex items-center gap-2 italic">
            <Command size={10} /> Copia este bloque y pégalo en tu terminal (CMD, Bash o PowerShell) para crear los archivos automáticamente.
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Cpu size={18} className="text-indigo-600" /> Requisitos de Nodo
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="mt-1"><Box size={16} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Docker Engine v20.10+</p>
                    <p className="text-xs text-slate-500">Asegúrate de tener Docker Desktop iniciado.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="mt-1"><Code2 size={16} className="text-slate-400" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Variable de Entorno API_KEY</p>
                    <p className="text-xs text-slate-500">Nara requiere acceso al API de Gemini para procesar lenguaje natural.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-2">Soporte Express Nara</h3>
              <p className="text-indigo-100 text-xs leading-relaxed opacity-90">
                Si encuentras errores de permisos 403 o archivos bloqueados por la política de seguridad corporativa, contacta al administrador de infra o utiliza el comando manual proporcionado.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-indigo-500/30">
              <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-200">System Version</p>
              <p className="text-sm font-bold">NARA-ENTERPRISE-v1.2.2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
