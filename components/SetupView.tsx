
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, RefreshCcw, Key, Globe, Eye, EyeOff, Save, CheckCircle, List, Trash2, Wifi, WifiOff, Settings, Link, ChevronDown, ChevronUp, Copy, FileText, Server, HardDrive, Cpu, Printer, AlertTriangle, CheckSquare
} from 'lucide-react';
import { checkPlaiConnectivity, addLog, DEFAULT_PLAI_URL } from '../services/geminiService';
import TechnicalDocument from './TechnicalDocument';

const SetupView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL);
  const [agentId, setAgentId] = useState(localStorage.getItem('NARA_AGENT_ID') || '6960455c458bc6df36d7407f');
  const [apiKey, setApiKey] = useState(localStorage.getItem('NARA_API_KEY') || 'x8qVBo0s5Y3OPZMhuPMYMbSjAhqMEWJM9lNOImsCQggTLU1j8TtBuDws7RZTWyw5');
  const [showKey, setShowKey] = useState(false);
  const [plaiStatus, setPlaiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [saveStatus, setSaveStatus] = useState(false);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'config' | 'dossier'>('config');

  useEffect(() => {
    const fetchLogs = () => {
      const stored = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
      setLogs(stored);
    };
    
    runChecks();
    window.addEventListener('nara_log_update', fetchLogs);
    return () => window.removeEventListener('nara_log_update', fetchLogs);
  }, []);

  const runChecks = async () => {
    setPlaiStatus('checking');
    const result = await checkPlaiConnectivity(apiUrl);
    setPlaiStatus(result.ok ? 'online' : 'offline');
  };

  const handleSaveAndTest = async () => {
    localStorage.setItem('NARA_PLAI_URL', apiUrl);
    localStorage.setItem('NARA_AGENT_ID', agentId);
    localStorage.setItem('NARA_API_KEY', apiKey);
    setSaveStatus(true);
    
    addLog('info', 'Guardando configuración oficial v3.7.1 para Handover...');
    
    setPlaiStatus('checking');
    const result = await checkPlaiConnectivity(apiUrl, { agentId, apiKey });
    setPlaiStatus(result.ok ? 'online' : 'offline');

    setTimeout(() => setSaveStatus(false), 2000);
    window.dispatchEvent(new Event('storage'));
  };

  const clearLogs = () => {
    localStorage.setItem('NARA_LOGS', '[]');
    setLogs([]);
  };

  const masterDeploymentScript = {
    name: "Nara_Master_v3.7.1.ps1",
    code: `# Nara_Master_v3.7.1.ps1 (Production Handover Stable)
Write-Host "--- NARA DEPLOYMENT v3.7.1 [HANDOVER STABLE] ---" -ForegroundColor Cyan -BackgroundColor Black

# 1. AMBIENTE DE VARIABLES (SECRETOS)
$ENV_AGENT_ID = "${agentId}"
$ENV_API_KEY  = "${apiKey}"
$ENV_PLAI_URL = "${apiUrl}"

# 2. LIMPIEZA DE CONTENEDORES PREVIOS
Write-Host "[1/4] Purgando instancias obsoletas..." -ForegroundColor Yellow
docker-compose down --volumes --remove-orphans

# 3. GENERACIÓN DINÁMICA DE DOCKER-COMPOSE
$composeContent = @"
services:
  nara-vector-db:
    image: pgvector/pgvector:pg16
    container_name: nara_vector_engine
    restart: always
    environment:
      - POSTGRES_USER=nara_admin
      - POSTGRES_PASSWORD=nara_secure_2024
      - POSTGRES_DB=nara_knowledge_hub
    ports:
      - '5432:5432'
  nara-app:
    build: .
    container_name: nara_frontend
    environment:
      - PLAI_URL=$ENV_PLAI_URL
      - AGENT_ID=$ENV_AGENT_ID
      - API_KEY=$ENV_API_KEY
    ports:
      - '3000:3000'
    depends_on:
      - nara-vector-db
"@
[System.IO.File]::WriteAllLines("$(Get-Location)/docker-compose.yml", $composeContent)

# 4. LANZAMIENTO Y VALIDACIÓN
Write-Host "[2/4] Iniciando orquestación de servicios..." -ForegroundColor Yellow
docker-compose up -d --build

Write-Host "[3/4] Validando Healthcheck..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
$Health = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
if ($Health.StatusCode -eq 200) {
    Write-Host "[SUCCESS] PUNTO DE CONTROL v3.7.1 ONLINE EN PUERTO 3000" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Falla en el despliegue. Revise logs de Docker." -ForegroundColor Red
}`
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full space-y-8 pb-20">
        
        {/* Header de Panel de Control */}
        <div className="flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-black text-white flex items-center gap-3">
               <ShieldCheck className="text-blue-500" /> PUNTO DE CONTROL V3.7.1
             </h2>
             <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Línea Base Maestra | Edición de Traspaso</p>
           </div>
           <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
             <button 
               onClick={() => setViewMode('config')}
               className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'config' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               GESTIÓN
             </button>
             <button 
               onClick={() => setViewMode('dossier')}
               className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === 'dossier' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               BLUEPRINT MAESTRO
             </button>
           </div>
        </div>

        {viewMode === 'dossier' ? (
          <div className="animate-fade-in-up">
            <div className="flex justify-end mb-4">
               <button 
                 onClick={() => window.print()} 
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
               >
                 <Printer size={16}/> GENERAR ACTA DE TRASPASO (PDF)
               </button>
            </div>
            <TechnicalDocument />
          </div>
        ) : (
          <>
            {/* Handover Checklist Section */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-8 items-center">
               <div className="bg-indigo-600 p-4 rounded-2xl text-white">
                 <CheckSquare size={32} />
               </div>
               <div className="flex-1">
                 <h3 className="text-white font-bold text-lg">Checklist de Toma de Control v3.7.1</h3>
                 <p className="text-slate-400 text-xs mt-1">Siga el procedimiento certificado antes del cierre del ticket de traspaso.</p>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                 <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">VPN TI</p>
                    <div className="w-2 h-2 rounded-full bg-green-500 mx-auto"></div>
                 </div>
                 <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Auth Plai</p>
                    <div className="w-2 h-2 rounded-full bg-green-500 mx-auto"></div>
                 </div>
                 <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">PGVector</p>
                    <div className="w-2 h-2 rounded-full bg-green-500 mx-auto"></div>
                 </div>
                 <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Script 3.7.1</p>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mx-auto animate-pulse"></div>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Parámetros de Configuración */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={20} className="text-blue-400"/> Parámetros de Inferencia</h3>
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1"><Link size={10}/> Endpoint Corporativo Plai</label>
                      <input 
                        type="text" 
                        value={apiUrl} 
                        onChange={(e) => setApiUrl(e.target.value)} 
                        className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">x-agent-id</label>
                        <input type="password" value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">x-api-key</label>
                        <div className="relative">
                          <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-sm" />
                          <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showKey ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                        </div>
                      </div>
                   </div>
                   <button onClick={handleSaveAndTest} disabled={plaiStatus === 'checking'} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                      {saveStatus ? <RefreshCcw className="animate-spin" size={18}/> : <Save size={18}/>} 
                      ACTUALIZAR baseline V3.7.1
                   </button>
                </div>
              </div>

              {/* Terminal de Auditoría v3.7.1 */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl min-h-[400px]">
                <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-slate-800">
                   <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                     <Terminal size={14} className="text-green-400" /> Plai Debug Terminal v3.7.1
                   </div>
                   <button onClick={clearLogs} className="text-slate-500 hover:text-red-400 transition-colors text-[10px] font-bold flex items-center gap-1">
                     <Trash2 size={12}/> LIMPIAR HISTORIAL
                   </button>
                </div>
                <div className="flex-1 p-4 font-mono text-[10px] space-y-4 overflow-y-auto bg-black/40 scrollbar-thin">
                   {logs.length === 0 && <p className="text-slate-600 italic">Esperando tráfico para auditoría...</p>}
                   {logs.map((log, idx) => (
                     <div key={log.id} className="border-l-2 border-slate-800 pl-4 py-1 animate-fade-in-up">
                        <div className="flex gap-2 items-center mb-1">
                          <span className="text-slate-500 font-bold">[{log.timestamp}]</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.type === 'error' ? 'bg-red-900/40 text-red-400' : 'bg-blue-900/40 text-blue-400'}`}>
                            {log.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-200 font-semibold leading-relaxed">{log.message}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Script Maestro de Implementación v3.7.1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
               <div className="p-5 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Terminal size={18} className="text-blue-400"/>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">Deployment Master v3.7.1 [HANDOVER]</h4>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Script Certificado para Implementación en Caliente</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(masterDeploymentScript.code); addLog('info', 'Script Maestro v3.7.1 copiado al portapapeles.'); }} 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-[10px] font-black text-white rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-95"
                  >
                    <Copy size={14}/> COPIAR SCRIPT MAESTRO
                  </button>
               </div>
               <div className="relative">
                  <pre className="p-8 text-[11px] text-slate-400 bg-black/60 overflow-x-auto leading-relaxed font-mono">
                    {masterDeploymentScript.code}
                  </pre>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SetupView;
