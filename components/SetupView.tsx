
import React, { useState } from 'react';
// Added missing icons Info and AlertCircle to the import list
import { Copy, Check, Terminal, FileCode, Box, Code2, Command, Cpu, Laptop, Monitor, Info, AlertCircle } from 'lucide-react';

const DOCKERFILE_CONTENT = `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`;

const DOCKER_COMPOSE_CONTENT = `version: '3.8'
services:
  nara-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=\${API_KEY}
    restart: always`;

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

Write-Host "✅ Archivos creados con codificación UTF-8 compatible con Docker." -ForegroundColor Green`;

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
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Terminal size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Solución de Errores de Despliegue</h2>
          </div>
          <p className="text-slate-500 text-sm">El error <code className="bg-red-50 text-red-600 px-1 rounded font-mono">unknown instruction: §!!</code> es un problema de codificación de Windows. Usa el comando de abajo para repararlo.</p>
        </header>

        {/* Selector de SO */}
        <div className="flex p-1 bg-slate-200 w-fit rounded-xl">
          <button 
            onClick={() => setOs('win')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${os === 'win' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Laptop size={14} /> Windows (PowerShell)
          </button>
          <button 
            onClick={() => setOs('unix')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${os === 'unix' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Monitor size={14} /> Linux / Mac (Bash)
          </button>
        </div>

        {/* Consola de Comando */}
        <section className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800">
          <div className="px-5 py-3 bg-slate-800 flex justify-between items-center border-b border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Script de Reparación Automática</span>
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
              {/* Fix: Info icon used after import */}
              <Info size={16} className="text-blue-500" /> ¿Por qué falló?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              PowerShell por defecto usa UTF-16 al redireccionar texto. Docker solo entiende UTF-8. Mi nuevo script usa <code className="bg-slate-100 p-0.5 rounded">Out-File -Encoding utf8</code> para sobreescribir los archivos corruptos con el formato correcto.
            </p>
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
            <h4 className="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
              {/* Fix: AlertCircle icon used after import */}
              <AlertCircle size={16} /> Próximo Paso
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Tras copiar y pegar el comando en tu terminal, vuelve a ejecutar:<br/>
              <code className="font-bold">docker-compose up --build</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
