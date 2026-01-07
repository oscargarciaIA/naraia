
import React, { useState } from 'react';
import { Copy, Check, Terminal, ShieldCheck, AlertTriangle, CheckCircle2, Github, GitMerge, FileCode, ExternalLink } from 'lucide-react';

const SetupView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const REPO_URL = "https://github.com/oscargarciaIA/naraia.git";

  // Archivos de Configuración Git/GitHub
  const gitIgnore = `node_modules
dist
.env
.DS_Store
*.local
docker-compose.override.yml`;

  const githubAction = `name: Nara CI/CD
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: docker build -t nara-assistant:latest .`;

  // Archivos Base (v1.2.9)
  const pkgJson = `{
  "name": "nara-virtual-assistant",
  "version": "1.2.9",
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

  // SCRIPT POWERSHELL v1.2.9 - AUTOMATIZADO PARA EL REPO ESPECÍFICO
  const PS_DEVOPS_SCRIPT = `$utf8NoBom = New-Object System.Text.UTF8Encoding $false;
$contentPkg = @'
${pkgJson}
'@;
$contentDf = @'
${dockerfile}
'@;
$contentIgnore = @'
${gitIgnore}
'@;
$contentAction = @'
${githubAction}
'@;

Write-Host "--- Iniciando Sincronización Nara v1.2.9 ---" -ForegroundColor Magenta;

# Crear archivos base
[System.IO.File]::WriteAllText("./package.json", $contentPkg, $utf8NoBom);
[System.IO.File]::WriteAllText("./Dockerfile", $contentDf, $utf8NoBom);
[System.IO.File]::WriteAllText("./.gitignore", $contentIgnore, $utf8NoBom);

# Crear carpeta de GitHub Actions
$ghPath = "./.github/workflows";
if (!(Test-Path $ghPath)) { New-Item -ItemType Directory -Path $ghPath -Force };
[System.IO.File]::WriteAllText("$ghPath/main.yml", $contentAction, $utf8NoBom);

Write-Host "✅ Archivos de configuración creados con éxito." -ForegroundColor Cyan;

# Comandos Git sugeridos para el repo oscargarciaIA/naraia
Write-Host "🚀 Pasos para vincular con GitHub:" -ForegroundColor Yellow;
Write-Host "1. git init" -ForegroundColor Gray;
Write-Host "2. git remote add origin ${REPO_URL}" -ForegroundColor Gray;
Write-Host "3. git add ." -ForegroundColor Gray;
Write-Host "4. git commit -m 'feat: sync with local Nara console v1.2.9'" -ForegroundColor Gray;
Write-Host "5. git push -u origin main" -ForegroundColor Gray;`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="border-b border-slate-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <GitMerge size={20} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Sincronización DevOps v1.2.9</h2>
            </div>
            <p className="text-slate-500 text-sm">Vinculación automática con el repositorio <span className="font-mono text-indigo-600 font-bold">oscargarciaIA/naraia</span>.</p>
          </div>
          <a 
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Github size={14} /> Ver en GitHub <ExternalLink size={12} />
          </a>
        </header>

        <section className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="px-5 py-4 bg-slate-800 flex justify-between items-center border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-magenta-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Script de Vinculación (PowerShell)</span>
            </div>
            <button 
              onClick={() => copyToClipboard(PS_DEVOPS_SCRIPT, 'devops')}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-900/20"
            >
              {copied === 'devops' ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar Script v1.2.9</>}
            </button>
          </div>
          <div className="p-6 font-mono text-[11px] leading-relaxed max-h-[400px] overflow-y-auto">
            <pre className="text-indigo-300/80 whitespace-pre-wrap">{PS_DEVOPS_SCRIPT}</pre>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-200 rounded-lg"><FileCode size={18} className="text-slate-600" /></div>
              <h4 className="font-bold text-slate-800 text-sm">Configuración de Repositorio</h4>
            </div>
            <div className="space-y-3">
              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-lg border border-slate-100">
                <p className="font-bold text-slate-700 mb-1 tracking-tight">REMOTE ORIGIN:</p>
                <code className="text-indigo-600 select-all">{REPO_URL}</code>
              </div>
              <ul className="space-y-2 text-[11px] font-mono text-slate-600 pl-2">
                <li className="flex items-center gap-2"><Check size={12} className="text-green-500"/> .gitignore configurado</li>
                <li className="flex items-center gap-2"><Check size={12} className="text-green-500"/> GitHub Workflow v1.2.9</li>
              </ul>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg"><Github size={18} className="text-indigo-600" /></div>
              <h4 className="font-bold text-indigo-800 text-sm">Comandos de Primer Envío</h4>
            </div>
            <div className="bg-indigo-900/5 p-3 rounded-xl space-y-2 font-mono">
              <code className="block text-[10px] text-indigo-900 font-bold">git init</code>
              <code className="block text-[10px] text-indigo-900 font-bold">git remote add origin {REPO_URL}</code>
              <code className="block text-[10px] text-indigo-900 font-bold">git add .</code>
              <code className="block text-[10px] text-indigo-900 font-bold">git commit -m "initial sync v1.2.9"</code>
              <code className="block text-[10px] text-indigo-900 font-bold">git push -u origin main</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
