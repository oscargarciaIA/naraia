
import React, { useState } from 'react';
import { Copy, Check, Terminal, RefreshCw, Download, Box, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  // Contenido de los archivos clave
  const pkgJson = `{
  "name": "nara-virtual-assistant",
  "version": "1.2.6",
  "type": "module",
  "scripts": {
    "start": "vite --host 0.0.0.0 --port 3000",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.475.0",
    "@google/genai": "^1.34.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^20.11.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}`;

  const dockerfile = `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`;

  const dockerCompose = `version: '3.8'
services:
  nara-web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - API_KEY=\${API_KEY}
    restart: always`;

  // Script PowerShell Blindado (Usa .NET para evitar BOM)
  const PS_SAFE_SCRIPT = `$UTF8NoBOM = New-Object System.Text.UTF8Encoding $False;
[System.IO.File]::WriteAllText("$PSScriptRoot\\package.json", '${pkgJson}', $UTF8NoBOM);
[System.IO.File]::WriteAllText("$PSScriptRoot\\Dockerfile", '${dockerfile}', $UTF8NoBOM);
[System.IO.File]::WriteAllText("$PSScriptRoot\\docker-compose.yml", '${dockerCompose}', $UTF8NoBOM);
Write-Host "✅ Archivos sincronizados SIN BOM. Listo para Docker." -ForegroundColor Cyan;`;

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
            <div className="p-2 bg-cyan-600 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Reparación de Codificación v1.2.6</h2>
          </div>
          <p className="text-slate-500 text-sm">Solución al error "Unexpected token in JSON". Este script garantiza compatibilidad Linux/Windows.</p>
        </header>

        <section className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="px-5 py-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-cyan-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest text-cyan-400">Script de Sincronización Seguro</span>
            </div>
            <button 
              onClick={() => copyToClipboard(PS_SAFE_SCRIPT, 'safe')}
              className="flex items-center gap-2 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all"
            >
              {copied === 'safe' ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar Script</>}
            </button>
          </div>
          <div className="p-6 font-mono text-[11px] leading-relaxed max-h-[300px] overflow-y-auto">
            <pre className="text-slate-400 whitespace-pre-wrap">{PS_SAFE_SCRIPT}</pre>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
            <AlertTriangle className="text-amber-600 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-amber-800 text-sm mb-1">¿Qué pasó?</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                Windows añade caracteres invisibles (BOM) al inicio de los archivos JSON. Docker no puede leerlos. El nuevo script usa <code className="bg-white px-1">UTF8Encoding $False</code> para eliminarlos.
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex gap-4">
            <CheckCircle2 className="text-green-600 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-green-800 text-sm mb-1">Próximo Paso</h4>
              <p className="text-xs text-green-700 leading-relaxed">
                Tras ejecutar el script en PowerShell, corre este comando para limpiar caché de Docker y reintentar:<br/>
                <code className="font-bold mt-2 inline-block">docker-compose build --no-cache && docker-compose up</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
