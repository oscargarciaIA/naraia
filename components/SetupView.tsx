
import React, { useState } from 'react';
import { 
  Copy, Check, Terminal, Database, Server, FileCode, Briefcase, 
  FileText, CheckCircle2, ChevronRight, HardDrive, History, 
  BookOpen, ShieldCheck, List, LayoutGrid, ArrowRight, ShieldAlert,
  Settings2, Layers, Cpu, Github, Monitor, Code2, Globe, AlertCircle, Info
} from 'lucide-react';

type DocCategory = 'roadmap' | 'database' | 'infrastructure' | 'maintenance' | 'manuals';

const SetupView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DocCategory>('roadmap');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const setupSequence = [
    {
      step: 1,
      title: "Infraestructura Docker",
      console: "Terminal (Bash/PowerShell)",
      icon: <Server size={20} />,
      status: "Configurado",
      desc: "Levantamiento del stack PostgreSQL 16 y red interna 'nara_internal'.",
      file: "docker-compose.yml"
    },
    {
      step: 2,
      title: "Base de Datos Vectorial",
      console: "Consola SQL (pgAdmin)",
      icon: <Database size={20} />,
      status: "Configurado",
      desc: "Ejecución del esquema v1.3.2 para búsqueda semántica de contratos.",
      file: "init_knowledge_repository.sql"
    },
    {
      step: 3,
      title: "Respaldo y Sincronización",
      console: "PowerShell (Admin)",
      icon: <Github size={20} />,
      status: "Crítico",
      desc: "Sincronización bidireccional con GitHub para asegurar la persistencia del código.",
      file: "sync_to_github.ps1"
    },
    {
      step: 4,
      title: "Motor Nara AI",
      console: "Consola App Service",
      icon: <Cpu size={20} />,
      status: "Activo",
      desc: "Validación de conectividad con Gemini 3 Pro y carga de contexto corporativo.",
      file: "services/geminiService.ts"
    }
  ];

  const maintenanceScripts = [
    {
      name: "sync_to_github.ps1",
      console: "PowerShell (Windows)",
      desc: "Script de sincronización empresarial. Incluye pull preventivo para evitar conflictos de rama.",
      code: `# sync_to_github.ps1 - v1.3.6 (Fixed & Optimized)
Write-Host "--- Nara AI: Iniciando Ciclo de Sincronización ---" -ForegroundColor Cyan

# 1. Asegurar rama correcta y descargar cambios remotos
Write-Host "[1/3] Validando estado remoto..." -ForegroundColor Gray
git pull origin main --rebase

# 2. Indexar cambios locales
Write-Host "[2/3] Preparando commit de infraestructura..." -ForegroundColor Gray
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Nara System Update [$timestamp] - Sync Infrastructure & SQL Schemas"

# 3. Empujar al repositorio central
Write-Host "[3/3] Subiendo cambios a GitHub..." -ForegroundColor Gray
git push origin main

Write-Host "✅ SISTEMA ACTUALIZADO Y PROTEGIDO" -ForegroundColor Green`
    }
  ];

  return (
    <div className="flex h-full bg-[#f8fafc]">
      {/* Sidebar de Navegación Profesional */}
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Módulos de Configuración</h3>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'roadmap' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={16} /> Master Roadmap
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Settings2 size={16} /> Mantenimiento (Git)
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'database' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Database size={16} /> Scripts SQL
            </button>
            <button 
              onClick={() => setActiveTab('infrastructure')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'infrastructure' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Server size={16} /> Docker Config
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200">
           <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
             <ShieldCheck size={14} className="text-green-500" />
             Protección de Datos Activa
           </div>
        </div>
      </div>

      {/* Área de Visualización */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* VISTA 1: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fade-in-up">
              <header className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Secuencia de Implementación</h2>
                  <p className="text-sm text-slate-500">Siga este orden para garantizar la integridad del ecosistema Nara.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                   <AlertCircle size={14} /> Requiere Permisos de Admin
                </div>
              </header>

              <div className="relative space-y-4">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 -z-0"></div>
                
                {setupSequence.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex gap-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-[#f8fafc] bg-indigo-600 text-white shadow-md">
                      {step.icon}
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Paso {step.step}: {step.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <Monitor size={12} className="text-slate-400" />
                             <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{step.console}</span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase ${step.status === 'Crítico' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.desc}</p>
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                         <FileCode size={12} /> {step.file}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA 2: MANTENIMIENTO (GITHUB) - AJUSTADO Y CORREGIDO */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 animate-fade-in-up">
              <header>
                <h2 className="text-xl font-bold text-slate-800">Gestión de Repositorio Corporativo</h2>
                <p className="text-sm text-slate-500">Este script es vital para no perder los esquemas de IA tras un reinicio de Docker.</p>
              </header>

              {maintenanceScripts.map((script, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-lg text-white">
                        <Github size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-700">{script.name}</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{script.console}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(script.code, script.name)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      {copied === script.name ? <Check size={14} /> : <Copy size={14} />}
                      {copied === script.name ? 'Copiado' : 'Copiar Script'}
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mb-4 flex gap-3 items-start">
                       <Info size={16} className="text-amber-600 mt-0.5 shrink-0" />
                       <p className="text-[11px] text-amber-800 leading-relaxed">
                         <strong>Importante:</strong> Antes de ejecutar, asegúrese de que el origen esté configurado: <br/>
                         <code className="bg-amber-100 px-1 rounded">git remote add origin https://github.com/tu-organizacion/nara-hub.git</code>
                       </p>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-5 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed border border-slate-800">
                      <pre>{script.code}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTAS DE SOPORTE */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-fade-in-up">
               <h2 className="text-xl font-bold text-slate-800">Scripts SQL Permanentes</h2>
               <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                  <div className="flex justify-between items-center mb-4 text-xs font-mono text-slate-500">
                    <span>init_knowledge_repository.sql</span>
                    <button onClick={() => copyToClipboard('...', 'sql')}><Copy size={14}/></button>
                  </div>
                  <pre className="text-[10px] text-indigo-300">-- Script v1.3.2 ya configurado en el Roadmap</pre>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SetupView;
