
import React, { useState } from 'react';
import { 
  Copy, Check, Terminal, Database, Server, FileCode, Briefcase, 
  FileText, CheckCircle2, ChevronRight, HardDrive, History, 
  BookOpen, ShieldCheck, List, LayoutGrid, ArrowRight, ShieldAlert,
  Settings2, Layers, Cpu, Github, Monitor, Code2, Globe
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
      title: "Capa de Aislamiento (Docker)",
      console: "Terminal de Sistema (Bash/CMD)",
      icon: <Server size={20} />,
      status: "Configurado",
      desc: "Despliegue de contenedores aislados para Base de Datos y Frontend.",
      file: "docker-compose.yml"
    },
    {
      step: 2,
      title: "Extensión Semántica (pgvector)",
      console: "Consola de Admin SQL (pgAdmin/psql)",
      icon: <Database size={20} />,
      status: "Configurado",
      desc: "Activación del motor de búsqueda vectorial en PostgreSQL 16.",
      file: "init_knowledge_repository.sql"
    },
    {
      step: 3,
      title: "Sincronización de Repositorio",
      console: "PowerShell (Modo Administrador)",
      icon: <Github size={20} />,
      status: "Validado",
      desc: "Script de respaldo y sincronización con el repositorio central corporativo.",
      file: "sync_to_github.ps1"
    },
    {
      step: 4,
      title: "Capa de Inteligencia (AI Engine)",
      console: "Consola de App Service / Node.js",
      icon: <Cpu size={20} />,
      status: "Activo",
      desc: "Configuración de la conexión con Gemini 3 y validación de API Key.",
      file: "services/geminiService.ts"
    }
  ];

  const maintenanceScripts = [
    {
      name: "sync_to_github.ps1",
      console: "PowerShell",
      desc: "Automatiza el commit y push de los esquemas SQL y configuraciones al repositorio corporativo.",
      code: `# sync_to_github.ps1 - v1.3.5
Write-Host "Iniciando sincronización con GitHub Corporativo..." -ForegroundColor Cyan
git add .
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Nara AI Auto-Sync: $timestamp - Actualización de Esquemas Vectoriales"
git push origin main
Write-Host "Sincronización completada con éxito." -ForegroundColor Green`
    }
  ];

  const dbScripts = [
    {
      version: "v1.3.2",
      name: "init_knowledge_repository.sql",
      console: "Consola SQL",
      desc: "Esquema unificado para contratos y manuales con soporte vectorial.",
      code: `-- v1.3.2: Unified Repository
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS nara_knowledge_repository (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id VARCHAR(50) NOT NULL,
    tipo_doc VARCHAR(20) NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    metadata JSONB,
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
    }
  ];

  const infrastructureFiles = [
    {
      name: "docker-compose.yml",
      console: "Terminal Bash/CMD",
      desc: "Configuración del stack completo optimizado.",
      code: `version: '3.8'
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    # ... resto de la configuración`
    }
  ];

  return (
    <div className="flex h-full bg-[#f8fafc]">
      {/* Sidebar de Navegación */}
      <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-6">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Módulos de Control</h3>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'roadmap' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={16} /> Setup Roadmap
            </button>
            <button 
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'database' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Database size={16} /> Scripts SQL
            </button>
            <button 
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'maintenance' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Settings2 size={16} /> Mantenimiento
            </button>
            <button 
              onClick={() => setActiveTab('infrastructure')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === 'infrastructure' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Server size={16} /> Infraestructura
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-4 bg-slate-50 border-t border-slate-200">
           <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
             <ShieldCheck size={14} className="text-green-500" />
             Continuidad Operativa
           </div>
        </div>
      </div>

      {/* Área de Visualización */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* ROADMAP CON ETIQUETAS DE CONSOLA */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fade-in-up">
              <header>
                <h2 className="text-2xl font-bold text-slate-800">Master Setup Roadmap</h2>
                <p className="text-sm text-slate-500 italic">Siga la secuencia exacta según el entorno de ejecución indicado.</p>
              </header>

              <div className="relative space-y-4">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 -z-0"></div>
                
                {setupSequence.map((step, idx) => (
                  <div key={idx} className="relative z-10 flex gap-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-[#f8fafc] bg-indigo-600 text-white shadow-sm">
                      {step.icon}
                    </div>
                    <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Paso {step.step}: {step.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Monitor size={12} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                              {step.console}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MANTENIMIENTO: RESTAURACIÓN DE GITHUB SYNC */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6 animate-fade-in-up">
              <header>
                <h2 className="text-xl font-bold text-slate-800">Scripts de Mantenimiento y Sincronización</h2>
                <p className="text-sm text-slate-500">Herramientas restauradas para la persistencia del proyecto.</p>
              </header>

              {maintenanceScripts.map((script, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={16} className="text-indigo-600" />
                      <span className="text-sm font-bold text-slate-700">{script.name}</span>
                      <span className="text-[9px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-bold">{script.console}</span>
                    </div>
                    <button onClick={() => copyToClipboard(script.code, script.name)} className="text-slate-400 hover:text-indigo-600">
                      {copied === script.name ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-500 mb-4">{script.desc}</p>
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-cyan-300 overflow-x-auto">
                      <pre>{script.code}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DATABASE (MANTENER HISTORIAL) */}
          {activeTab === 'database' && (
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-800">Scripts SQL de Producción</h2>
              {dbScripts.map((script, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-slate-800 text-white flex justify-between items-center">
                    <span className="text-xs font-bold">{script.name}</span>
                    <button onClick={() => copyToClipboard(script.code, script.name)}><Copy size={14} /></button>
                  </div>
                  <div className="p-5 bg-slate-900 text-[10px] text-indigo-300 font-mono overflow-x-auto">
                    <pre>{script.code}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SetupView;
