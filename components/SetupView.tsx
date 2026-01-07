
import React, { useState } from 'react';
import { 
  Copy, Check, Terminal, Database, Server, FileCode, Briefcase, 
  FileText, CheckCircle2, ChevronRight, HardDrive, History, 
  BookOpen, ShieldCheck, List, LayoutGrid, ArrowRight, ShieldAlert,
  Settings2, Layers, Cpu, Github, Monitor, Code2, Globe, AlertCircle, Info, KeyRound, Hammer, Zap, Download, Upload
} from 'lucide-react';

type DocCategory = 'roadmap' | 'git_sync' | 'infrastructure';

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
      name: "1. descargar_actualizaciones_github.ps1",
      icon: <Download size={18} className="text-blue-500" />,
      desc: "Limpia conflictos locales y descarga la versión de GitHub. Usa esto si el 'push' o 'pull' falla.",
      code: `# sync_from_github.ps1 - v1.3.9
Write-Host "--- Nara AI: Sincronizando con la VERDAD de GitHub ---" -ForegroundColor Cyan

Write-Host "[1/2] Limpiando caché y obteniendo cambios remotos..." -ForegroundColor Gray
git fetch origin

Write-Host "[2/2] Forzando estado local al de GitHub (Reset)..." -ForegroundColor Yellow
# Esto descarta cualquier cambio local que cause conflictos 'non-fast-forward'
git reset --hard origin/main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SINCRONIZACIÓN EXITOSA. Tu local ahora es idéntico a GitHub." -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: No se pudo conectar con GitHub." -ForegroundColor Red
}`
    },
    {
      name: "2. configurar_token_silencioso.ps1",
      icon: <KeyRound size={18} className="text-purple-500" />,
      desc: "Inyecta el Token directamente para que Git NO saque la pantalla de inicio de sesión.",
      code: `# Reemplaza TU_TOKEN por el Token de Acceso Personal (PAT)
$token = "TU_TOKEN_AQUI"
git remote set-url origin "https://$($token)@github.com/oscargarciaIA/naraia.git"
Write-Host "✅ Token configurado. Ya no se pedirán credenciales por ventana emergente." -ForegroundColor Green`
    },
    {
      name: "3. enviar_cambios_emergencia.ps1",
      icon: <Upload size={18} className="text-red-500" />,
      desc: "Usa esto SOLO si quieres que GitHub tome tus cambios locales a la fuerza.",
      code: `git add .
git commit -m "Manual Sync: Update from Local"
git push origin main --force
Write-Host "✅ GitHub actualizado a la fuerza." -ForegroundColor Green`
    }
  ];

  return (
    <div className="flex h-full bg-[#f8fafc]">
      {/* Sidebar de Gestión */}
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Consola de Mantenimiento</h3>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('git_sync')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'git_sync' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Github size={16} /> Sincronización Git
            </button>
            <button onClick={() => setActiveTab('infrastructure')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'infrastructure' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Server size={16} /> Fix Docker YAML
            </button>
            <button onClick={() => setActiveTab('roadmap')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'roadmap' ? 'bg-slate-50 text-slate-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <LayoutGrid size={16} /> Roadmap General
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* TAB: SINCRONIZACION GIT */}
          {activeTab === 'git_sync' && (
            <div className="space-y-6 animate-fade-in-up">
              <header className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl">
                    <Github size={32} className="text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Gestión de Sincronización</h2>
                    <p className="text-slate-400 text-sm">GitHub es la fuente oficial. Sincroniza tu entorno local de forma segura.</p>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {syncScripts.map((script, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-indigo-300 transition-all">
                    <div className="px-6 py-5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                          {script.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">{script.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{script.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(script.code, script.name)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${copied === script.name ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-black active:scale-95'}`}
                      >
                        {copied === script.name ? <Check size={16} className="mx-auto" /> : 'Copiar Script'}
                      </button>
                    </div>
                    <div className="px-6 pb-6">
                      <pre className="bg-slate-950 rounded-xl p-5 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
                        {script.code}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-amber-900">¿Por qué falló el push anterior?</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    El error <strong>non-fast-forward</strong> indica que alguien más (o tú mismo desde otra sesión) actualizó GitHub. 
                    Usa el script #1 para que tu Docker local se actualice con lo que hay en la nube.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INFRASTRUCTURE (DOCKER) */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-6 animate-fade-in-up">
               <div className="flex items-center gap-3">
                 <Server size={24} className="text-slate-800" />
                 <h2 className="text-xl font-bold text-slate-800">Corrección Docker YAML</h2>
               </div>
               <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Si el comando <code>docker-compose up</code> te da un error en la <strong>Línea 3</strong>, 
                      es por un problema de indentación. El botón de abajo copia una versión 100% limpia sin espacios extra.
                    </p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`version: '3.8'\nservices:\n  nara-vector-db:\n    image: pgvector/pgvector:pg16\n    container_name: nara_vector_engine\n    restart: always\n    environment:\n      POSTGRES_USER: nara_admin\n      POSTGRES_PASSWORD: \${DB_PASSWORD:-nara_secure_2024}\n      POSTGRES_DB: nara_knowledge_hub\n    volumes:\n      - nara_vector_data:/var/lib/postgresql/data\n    ports:\n      - "5432:5432"\n    networks:\n      - nara_network\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U nara_admin -d nara_knowledge_hub"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n  nara-app:\n    build: .\n    container_name: nara_frontend\n    restart: always\n    ports:\n      - "3000:3000"\n    environment:\n      - API_KEY=\${API_KEY}\n    depends_on:\n      nara-vector-db:\n        condition: service_healthy\n    networks:\n      - nara_network\nnetworks:\n  nara_network:\n    driver: bridge\nvolumes:\n  nara_vector_data:`, 'docker')}
                    className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
                  >
                    <Copy size={20} /> Copiar Contenido para docker-compose.yml
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SetupView;
