
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
      name: "1. Reparar_Infraestructura_Manual_v143.ps1",
      icon: <Hammer size={18} className="text-orange-500" />,
      desc: "FUERZA la creación manual de Dockerfile y Compose usando $PWD para evitar errores de 'Ruta Nula' y caracteres §!!.",
      code: `# nara_robust_repair_v143.ps1
Write-Host "--- Nara AI v1.4.3: Reparación Manual de Infraestructura ---" -ForegroundColor Cyan

# 1. Definición de Rutas usando el directorio actual ($PWD)
$currentDir = $PWD.Path
$dfPath = [System.IO.Path]::Combine($currentDir, "Dockerfile")
$dcPath = [System.IO.Path]::Combine($currentDir, "docker-compose.yml")

Write-Host "Directorio de trabajo: $currentDir" -ForegroundColor Gray

# 2. Contenidos del Dockerfile (Generación Manual)
$dfLines = @(
    'FROM node:20-alpine',
    'WORKDIR /app',
    'COPY package.json package-lock.json* ./',
    'RUN npm install',
    'COPY . .',
    'EXPOSE 3000',
    'CMD ["npm", "run", "start"]'
)

# 3. Contenidos del docker-compose.yml (Generación Manual)
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

# 4. Escritura Segura UTF-8 sin BOM (Elimina error §!!)
Write-Host "[1/2] Generando archivos de infraestructura..." -ForegroundColor Yellow
$utf8NoBOM = New-Object System.Text.UTF8Encoding($false)

# Verificación de nulidad antes de escribir
if (-not $dfPath -or -not $dcPath) {
    Write-Error "Error: Las rutas de destino no se pudieron determinar."
    return
}

if (Test-Path $dfPath) { Remove-Item $dfPath -Force -ErrorAction SilentlyContinue }
if (Test-Path $dcPath) { Remove-Item $dcPath -Force -ErrorAction SilentlyContinue }

[System.IO.File]::WriteAllLines($dfPath, $dfLines, $utf8NoBOM)
[System.IO.File]::WriteAllLines($dcPath, $dcLines, $utf8NoBOM)

Write-Host "✅ Archivos creados correctamente en: $currentDir" -ForegroundColor Green

# 5. Ejecución Docker
Write-Host "[2/2] Reiniciando servicios..." -ForegroundColor Cyan
docker-compose down
docker-compose up -d --build

Write-Host "--- PROCESO FINALIZADO ---" -ForegroundColor Green`
    },
    {
      name: "2. Reset_Git_y_Limpieza.ps1",
      icon: <RefreshCw size={18} className="text-blue-500" />,
      desc: "Limpia conflictos de Git y archivos temporales antes de la reparación.",
      code: `Write-Host "Limpiando repositorio..." -ForegroundColor Yellow
git fetch origin
git reset --hard origin/main
git clean -fd
Write-Host "✅ Repositorio sincronizado y limpio." -ForegroundColor Green`
    }
  ];

  return (
    <div className="flex h-full bg-[#f8fafc]">
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mantenimiento v1.4.3</h3>
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
              <header className="bg-orange-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border-b-4 border-orange-500">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="text-orange-400" size={24} />
                    <h2 className="text-2xl font-bold">Reparación Forzada Manual</h2>
                  </div>
                  <p className="text-orange-200 text-sm italic">Solución definitiva para errores de 'Ruta Nula' y caracteres extraños en Docker.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {syncScripts.map((script, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-l-4 border-l-orange-500">
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
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${copied === script.name ? 'bg-orange-600 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                      >
                        {copied === script.name ? <Check size={16}/> : 'Copiar Script'}
                      </button>
                    </div>
                    <div className="px-6 pb-6">
                      <pre className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-orange-300 overflow-x-auto border border-slate-800">
                        {script.code}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex gap-4">
                <AlertCircle className="text-orange-600 shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-orange-900">¿Por qué fallaba?</h4>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    PowerShell no detecta la ruta del script si lo copias y pegas directamente en la ventana. La <strong>v1.4.3</strong> ahora usa <code>$currentDir = $PWD.Path</code>, lo cual detecta automáticamente la carpeta donde tienes abierta la terminal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                 <FileCode className="text-indigo-600" size={24} />
                 <h2 className="text-xl font-bold text-slate-800">Referencia de Dockerfile (Generado)</h2>
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
