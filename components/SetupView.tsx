
import React, { useState } from 'react';
import { 
  Copy, Check, Terminal, Database, Server, FileCode, Briefcase, 
  FileText, CheckCircle2, ChevronRight, HardDrive, History, 
  BookOpen, ShieldCheck, List, LayoutGrid, ArrowRight, ShieldAlert,
  Settings2, Layers, Cpu, Github, Monitor, Code2, Globe, AlertCircle, Info, KeyRound
} from 'lucide-react';

type DocCategory = 'roadmap' | 'database' | 'infrastructure' | 'maintenance';

const SetupView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocCategory>('roadmap');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const maintenanceScripts = [
    {
      name: "sync_to_github.ps1",
      console: "PowerShell (Admin)",
      desc: "Script corregido: Usa Token de Acceso (PAT) para evitar bloqueos de contraseña.",
      code: `# sync_to_github.ps1 - v1.3.7
Write-Host "--- Nara AI: Sincronización Segura ---" -ForegroundColor Cyan

# 1. Limpiar credenciales antiguas si fallan
# git config --global --unset credential.helper
# git config --global credential.helper manager

Write-Host "[1/3] Actualizando desde remoto (Rebase)..." -ForegroundColor Gray
git pull origin main --rebase

Write-Host "[2/3] Preparando cambios..." -ForegroundColor Gray
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-Sync Nara v1.3.7: $timestamp"

Write-Host "[3/3] Enviando a GitHub (Requiere TOKEN, no contraseña)..." -ForegroundColor Gray
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Use un TOKEN DE ACCESO PERSONAL (PAT) en lugar de su contraseña." -ForegroundColor Red
    Write-Host "Genere uno en: GitHub -> Settings -> Developer Settings -> Personal access tokens" -ForegroundColor Yellow
} else {
    Write-Host "✅ SINCRONIZACIÓN EXITOSA" -ForegroundColor Green
}`
    }
  ];

  return (
    <div className="flex h-full bg-[#f8fafc]">
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Administración</h3>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('roadmap')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'roadmap' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <LayoutGrid size={16} /> Roadmap
            </button>
            <button onClick={() => setActiveTab('maintenance')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Github size={16} /> Git & Auth Fix
            </button>
            <button onClick={() => setActiveTab('infrastructure')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'infrastructure' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Server size={16} /> Docker Fix (YAML)
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {activeTab === 'maintenance' && (
            <div className="space-y-6 animate-fade-in-up">
              <header>
                <h2 className="text-xl font-bold text-slate-800">Solución de Autenticación GitHub</h2>
                <p className="text-sm text-slate-500">GitHub ya no acepta contraseñas. Debe usar un <strong>Personal Access Token (PAT)</strong>.</p>
              </header>

              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <KeyRound className="text-red-600 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-red-800">¿Cómo arreglar el error de Login?</h4>
                    <p className="text-xs text-red-700 mt-1">Si le pide contraseña y falla, ejecute este comando una sola vez para inyectar su TOKEN:</p>
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl flex justify-between items-center group">
                  <code className="text-[10px] text-cyan-400">git remote set-url origin https://TU_TOKEN@github.com/oscargarciaIA/naraia.git</code>
                  <button onClick={() => copyToClipboard('git remote set-url origin https://YOUR_TOKEN@github.com/oscargarciaIA/naraia.git', 'token_cmd')} className="text-slate-500 group-hover:text-white">
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {maintenanceScripts.map((script, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-700">{script.name}</span>
                    <button onClick={() => copyToClipboard(script.code, script.name)} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">
                       <Copy size={12} /> Copiar Script
                    </button>
                  </div>
                  <div className="p-6">
                    <pre className="bg-slate-900 rounded-xl p-5 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed">{script.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="space-y-6 animate-fade-in-up">
               <header>
                 <h2 className="text-xl font-bold text-slate-800">Corrección de Archivo YAML (Docker)</h2>
                 <p className="text-sm text-slate-500">El error "mapping values are not allowed" se debe a espacios o líneas en blanco corruptas.</p>
               </header>
               <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" size={18} />
                  <p className="text-xs text-amber-800">He re-generado el archivo <strong>docker-compose.yml</strong> en el sistema. Copie el contenido de abajo y sobrescriba su archivo actual completamente.</p>
               </div>
               <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">docker-compose.yml (Limpio)</span>
                    <button onClick={() => copyToClipboard(`version: '3.8'\nservices:\n  nara-vector-db:\n    image: pgvector/pgvector:pg16\n    container_name: nara_vector_engine\n    restart: always\n    environment:\n      POSTGRES_USER: nara_admin\n      POSTGRES_PASSWORD: \${DB_PASSWORD:-nara_secure_2024}\n      POSTGRES_DB: nara_knowledge_hub\n    volumes:\n      - nara_vector_data:/var/lib/postgresql/data\n    ports:\n      - "5432:5432"\n    networks:\n      - nara_network\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U nara_admin -d nara_knowledge_hub"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n  nara-app:\n    build: .\n    container_name: nara_frontend\n    restart: always\n    ports:\n      - "3000:3000"\n    environment:\n      - API_KEY=\${API_KEY}\n    depends_on:\n      nara-vector-db:\n        condition: service_healthy\n    networks:\n      - nara_network\nnetworks:\n  nara_network:\n    driver: bridge\nvolumes:\n  nara_vector_data:`, 'docker_yml')} className="p-2 hover:bg-slate-100 rounded-lg"><Copy size={16} /></button>
                  </div>
                  <pre className="text-[10px] font-mono text-indigo-600 bg-slate-50 p-4 rounded-xl">version: '3.8'
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    ...</pre>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SetupView;
