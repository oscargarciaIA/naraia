
import React, { useState } from 'react';
import { 
  Check, Server, Github, KeyRound, Info, Zap, RefreshCw, FileCode, Shield
} from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const stableScript = {
    name: "Estabilizador_Nara_v1.2.4.ps1",
    desc: "Este script restaura los archivos base a su estado original de la v1.2.4 y reinicia Docker limpiamente.",
    code: `# estabilizador_v124.ps1
Write-Host "--- RESTAURANDO NARA v1.2.4 ---" -ForegroundColor Blue

$utf8 = New-Object System.Text.UTF8Encoding($false)

$df = @"
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
"@

$dc = @"
version: '3.8'
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    restart: always
    environment:
      - POSTGRES_USER=nara_admin
      - POSTGRES_PASSWORD=\${env:DB_PASSWORD:-nara_secure_2024}
      - POSTGRES_DB=nara_knowledge_hub
    ports:
      - '5432:5432'
    networks:
      - nara_network
  nara-app:
    build: .
    container_name: nara_frontend
    restart: always
    ports:
      - '3000:3000'
    environment:
      - API_KEY=\${env:API_KEY}
    depends_on:
      - nara-vector-db
    networks:
      - nara_network
networks:
  nara_network:
    driver: bridge
"@

Write-Host "Escribiendo archivos base..." -ForegroundColor Gray
[System.IO.File]::WriteAllText("Dockerfile", $df, $utf8)
[System.IO.File]::WriteAllText("docker-compose.yml", $dc, $utf8)

Write-Host "Reiniciando Docker (Modo Estable)..." -ForegroundColor Cyan
docker-compose down
docker-compose up -d --build

Write-Host "✅ SISTEMA v1.2.4 RESTAURADO" -ForegroundColor Green`
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        <header className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Modo de Recuperación v1.2.4</h2>
              <p className="text-sm text-slate-500">Volviendo a la última configuración estable conocida.</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Estable</div>
        </header>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Zap className="text-blue-500" size={18} />
              <span className="font-bold text-slate-700 text-sm">{stableScript.name}</span>
            </div>
            <button 
              onClick={() => copyToClipboard(stableScript.code, "stable")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copied === "stable" ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              {copied === "stable" ? <Check size={14}/> : <RefreshCw size={14}/>}
              {copied === "stable" ? 'Copiado' : 'Ejecutar Restauración'}
            </button>
          </div>
          <div className="p-6 bg-slate-50">
            <p className="text-xs text-slate-600 mb-4">{stableScript.desc}</p>
            <pre className="bg-slate-900 p-5 rounded-xl font-mono text-[10px] text-blue-300 overflow-x-auto border border-slate-800 leading-relaxed">
              {stableScript.code}
            </pre>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
              <Github size={16} /> Paso 1: Git Reset
            </h4>
            <p className="text-xs text-blue-800 mb-3">
              Antes de usar el script, asegúrate de estar en la rama correcta:
            </p>
            <code className="block bg-blue-100 p-2 rounded text-[10px] font-mono text-blue-900">
              git fetch --all<br/>
              git reset --hard origin/main
            </code>
          </div>

          <div className="p-6 bg-slate-800 rounded-2xl text-white">
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
              <Server size={16} className="text-blue-400" /> Paso 2: Limpieza Docker
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Si el contenedor sigue dando error, borra las imágenes viejas:
            </p>
            <code className="block bg-slate-900/50 p-2 rounded text-[10px] font-mono text-blue-300">
              docker system prune -a --volumes
            </code>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SetupView;
