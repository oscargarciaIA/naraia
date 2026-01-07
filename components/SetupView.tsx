
import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode, Box } from 'lucide-react';

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

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="text-indigo-600" /> Panel de Despliegue Nara
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Si el entorno bloquea la creación automática de archivos, copia estos contenidos manualmente en la raíz del proyecto.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dockerfile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 flex justify-between items-center text-slate-300">
              <div className="flex items-center gap-2 text-xs font-mono">
                <FileCode size={14} /> Dockerfile
              </div>
              <button 
                onClick={() => copyToClipboard(DOCKERFILE_CONTENT, 'df')}
                className="hover:text-white transition-colors"
              >
                {copied === 'df' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-4 text-[13px] font-mono text-slate-600 overflow-x-auto leading-relaxed">
              {DOCKERFILE_CONTENT}
            </pre>
          </div>

          {/* Docker Compose Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 px-4 py-2 flex justify-between items-center text-slate-300">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Box size={14} /> docker-compose.yml
              </div>
              <button 
                onClick={() => copyToClipboard(DOCKER_COMPOSE_CONTENT, 'dc')}
                className="hover:text-white transition-colors"
              >
                {copied === 'dc' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-4 text-[13px] font-mono text-slate-600 overflow-x-auto leading-relaxed">
              {DOCKER_COMPOSE_CONTENT}
            </pre>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
             Instrucciones de Nara
          </h3>
          <ol className="text-sm text-indigo-800 space-y-2 list-decimal ml-5">
            <li>Crea un archivo llamado <code>Dockerfile</code> en tu carpeta raíz.</li>
            <li>Crea un archivo llamado <code>docker-compose.yml</code>.</li>
            <li>Asegúrate de tener un archivo <code>.env</code> con tu <code>API_KEY</code>.</li>
            <li>Ejecuta <code>docker-compose up --build</code> en tu terminal corporativa.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
