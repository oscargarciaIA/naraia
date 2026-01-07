
import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Box, Code2, Command, Cpu, Laptop, Monitor, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

// Comando específico para corregir codificación en Windows PowerShell
const PS_FIX_COMMAND = `@'
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
'@ | Out-File -FilePath Dockerfile -Encoding utf8;

@'
version: '3.8'
services:
  nara-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=\${API_KEY}
    restart: always
'@ | Out-File -FilePath docker-compose.yml -Encoding utf8;

Write-Host "✅ Archivos de infraestructura reparados." -ForegroundColor Green`;

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [os, setOs] = useState<'win' | 'unix'>('win');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-green-600 rounded-lg text-white">
              <CheckCircle2 size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Infraestructura v1.2.4</h2>
          </div>
          <p className="text-slate-500 text-sm">Has superado el error de codificación. Ahora hemos actualizado las dependencias para evitar errores de red en Docker.</p>
        </header>

        <section className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
          <div className="px-5 py-3 bg-slate-800 flex justify-between items-center border-b border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Script de Reparación Final</span>
            <button 
              onClick={() => copyToClipboard(os === 'win' ? PS_FIX_COMMAND : 'cat <<EOF > Dockerfile...', 'script')}
              className="flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied === 'script' ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar comando</>}
            </button>
          </div>
          <div className="p-6 font-mono text-[13px] leading-relaxed">
            <div className="flex gap-4">
              <span className="text-indigo-500 select-none">{os === 'win' ? 'PS >' : '$'}</span>
              <pre className="text-slate-300 whitespace-pre-wrap break-all">
                {os === 'win' ? PS_FIX_COMMAND : 'cat <<EOF > Dockerfile\n...\nEOF'}
              </pre>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <Info size={16} className="text-blue-500" /> Resolución de ETARGET
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              El error de "No matching version" se debía a un desfase en el registro de NPM. Hemos forzado la versión <code className="bg-slate-100 p-0.5 rounded">1.34.0</code> en el archivo <code className="font-bold">package.json</code> que acabas de actualizar.
            </p>
          </div>
          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            <h4 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
              <AlertCircle size={16} /> Acción Requerida
            </h4>
            <p className="text-xs text-green-800 leading-relaxed">
              Vuelve a tu terminal y ejecuta el comando de construcción habitual:<br/>
              <code className="font-bold p-1 bg-green-100 rounded mt-2 inline-block">docker-compose up --build</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
