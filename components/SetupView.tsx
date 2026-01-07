
import React, { useState } from 'react';
import { 
  Copy, Check, Database, Server, Github, Download, KeyRound, AlertCircle, Info, Hammer, Zap, RefreshCw, FileCode, ShieldAlert
} from 'lucide-react';

type DocCategory = 'git_sync' | 'infrastructure' | 'roadmap';

const SetupView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocCategory>('git_sync');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const syncScripts = [
    {
      name: "1. sincronizar_y_reparar_UTF8_NO_BOM.ps1",
      icon: <RefreshCw size={18} className="text-emerald-500" />,
      desc: "CORRECCIÓN CRÍTICA: Genera Dockerfile en UTF-8 puro (sin BOM) para eliminar el error 'unknown instruction §!!'.",
      // CRITICAL FIX: Escaped ${ sequences using \${ to prevent JavaScript from attempting to interpolate
      // PowerShell environment variable syntax as JS expressions.
      code: `# repair_encoding_v142.ps1
Write-Host "--- Nara AI v1.4.2: Reparación de Codificación Docker ---" -ForegroundColor Cyan

# 1. Rutas
$dfPath = Join-Path $PSScriptRoot "Dockerfile"
$dcPath = Join-Path $PSScriptRoot "docker-compose.yml"

# 2. Contenidos como Arreglos (Evita errores de comillas)
$dfLines = @(
    'FROM node:20-alpine',
    'WORKDIR /app',
    'COPY package.json package-lock.json* ./',
    'RUN npm install',
    'COPY . .',
    'EXPOSE 3000',
    'CMD ["npm", "run", "start"]'
)

$dcLines = @(
    "version: '3.8'",
    "services:",
    "  nara-vector-db:",
    "    image: pgvector/pgvector:pg16",
    "    container_name: nara_vector_engine",
    "    restart: always",
    "    environment:",
    "      - POSTGRES_USER=nara_admin",
    "      - POSTGRES_PASSWORD=\${env:DB_PASSWORD:-nara_secure_2024}",
    "      - POSTGRES_DB=nara_knowledge_hub",
    "    ports:",
    "      - '5432:5432'",
    "    networks:",
    "      - nara_network",
    "  nara-app:",
    "    build: .",
    "    container_name: nara_frontend",
    "    restart: always",
    "    ports:",
    "      - '3000:3000'",
    "    environment:",
    "      - API_KEY=\${env:API_KEY}",
    "    depends_on:",
    "      - nara-vector-db",
    "    networks:",
    "      - nara_network",
    "networks:",
    "  nara_network:",
    "    driver: bridge"
)

# 3. Escritura Forzada UTF-8 sin BOM (La clave del éxito)
Write-Host "[1/2] Recreando archivos con codificación pura..." -ForegroundColor Yellow
$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

if (Test-Path $dfPath) { Remove-Item $dfPath -Force }
if (Test-Path $dcPath) { Remove-Item $dcPath -Force }

[System.IO.File]::WriteAllLines($dfPath, $dfLines, $utf8NoBOM)
[System.IO.File]::WriteAllLines($dcPath, $dcLines, $utf8NoBOM)

Write-Host "✅ Dockerfile y Compose reparados (UTF-8 No-BOM)." -ForegroundColor Green

# 4. Despliegue Limpio
Write-Host "[2/2] Reconstruyendo entorno..." -ForegroundColor Cyan
docker-compose down
docker-compose up -d --build

Write-Host "--- SISTEMA RESTABLECIDO ---" -ForegroundColor Green`
    },
    {
      name: "2. configurar_auth_pat.ps1",
      icon: <KeyRound size={18} className="text-purple-500" />,
      desc: "Vincula tu token de GitHub si necesitas descargar cambios de código.",
      code: `$token = "TU_TOKEN_AQUI"
git remote set-url origin "https://$($token)@github.com/oscargarciaIA/naraia.git"
Write-Host "✅ Token vinculado." -ForegroundColor Green`
    }
  ];

  return (
    <div className="flex h-full bg-[#f8fafc]">
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mantenimiento v1.4.2</h3>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('git_sync')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'git_sync' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Github size={16} /> Sync & Auto-Repair
            </button>
            <button onClick={() => setActiveTab('infrastructure')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'infrastructure' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Server size={16} /> Auditoría Docker
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {activeTab === 'git_sync' && (
            <div className="space-y-6 animate-fade-in-up">
              <header className="bg-emerald-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-emerald-400" size={24} />
                    <h2 className="text-2xl font-bold">Fix de Codificación Docker</h2>
                  </div>
                  <p className="text-emerald-300 text-sm">Este script elimina los caracteres invisibles (BOM) que causan errores de 'unknown instruction' en Windows.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {syncScripts.map((script, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
                    <div className="px-6 py-5 flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="mt-1">{script.icon}</div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{script.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 max-w-md">{script.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(script.code, script.name)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${copied === script.name ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                      >
                        {copied === script.name ? <Check size={16}/> : 'Copiar Script'}
                      </button>
                    </div>
                    <div className="px-6 pb-6">
                      <pre className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-emerald-300 overflow-x-auto border border-slate-800">
                        {script.code}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4">
                <Info className="text-blue-600 shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-blue-900">Solución al error §!!</h4>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    El error que viste ocurre porque Windows agrega caracteres invisibles al inicio de los archivos. El nuevo script utiliza <strong>System.Text.UTF8Encoding($false)</strong> para asegurar que el Dockerfile sea 100% texto plano, como lo requiere Linux.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <FileCode className="text-indigo-600" size={24} />
                 <h2 className="text-xl font-bold text-slate-800">Referencia de Dockerfile Puro</h2>
               </div>
               <pre className="bg-slate-50 p-6 rounded-2xl font-mono text-xs text-slate-600 border border-slate-100">
{`FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]`}
               </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetupView;
