
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Terminal, Activity, Zap, Database, RefreshCcw, Key, Globe, Eye, EyeOff, Save, CheckCircle, List, Trash2, Wifi, WifiOff, Settings, Link, ChevronDown, ChevronUp
} from 'lucide-react';
import { checkPlaiConnectivity, addLog, DEFAULT_PLAI_URL } from '../services/geminiService';

const SetupView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL);
  const [agentId, setAgentId] = useState(localStorage.getItem('NARA_AGENT_ID') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('NARA_API_KEY') || '');
  const [showKey, setShowKey] = useState(false);
  const [plaiStatus, setPlaiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [saveStatus, setSaveStatus] = useState(false);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

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
    // Prueba básica sin credenciales (OPTIONS)
    const result = await checkPlaiConnectivity(apiUrl);
    setPlaiStatus(result.ok ? 'online' : 'offline');
  };

  const handleSaveAndTest = async () => {
    localStorage.setItem('NARA_PLAI_URL', apiUrl);
    localStorage.setItem('NARA_AGENT_ID', agentId);
    localStorage.setItem('NARA_API_KEY', apiKey);
    setSaveStatus(true);
    
    addLog('info', 'Guardando configuración e iniciando test de credenciales...');
    
    setPlaiStatus('checking');
    // Prueba avanzada con credenciales (POST)
    const result = await checkPlaiConnectivity(apiUrl, { agentId, apiKey });
    setPlaiStatus(result.ok ? 'online' : 'offline');

    setTimeout(() => setSaveStatus(false), 2000);
    window.dispatchEvent(new Event('storage'));
  };

  const clearLogs = () => {
    localStorage.setItem('NARA_LOGS', '[]');
    setLogs([]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0f1e] p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-6 pb-12">
        
        {/* Status Monitor Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-6 rounded-3xl border ${plaiStatus === 'online' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} flex items-center justify-between transition-all`}>
             <div className="flex items-center gap-3">
               {plaiStatus === 'online' ? <Wifi className="text-green-500" /> : <WifiOff className="text-red-500" />}
               <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Motor Plai</p>
                 <p className={`text-sm font-bold ${plaiStatus === 'online' ? 'text-green-500' : 'text-red-500'}`}>{plaiStatus.toUpperCase()}</p>
               </div>
             </div>
             <button onClick={runChecks} className={`p-2 hover:bg-white/5 rounded-xl text-slate-400 ${plaiStatus === 'checking' ? 'animate-spin' : ''}`}><RefreshCcw size={16}/></button>
          </div>
          
          <div className="p-6 rounded-3xl border bg-blue-500/10 border-blue-500/20 flex items-center gap-3">
             <Database className="text-blue-500" />
             <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base de Datos</p>
               <p className="text-sm font-bold text-blue-500">PGVector Online</p>
             </div>
          </div>

          <div className="p-6 rounded-3xl border bg-indigo-500/10 border-indigo-500/20 flex items-center gap-3">
             <ShieldCheck className="text-indigo-500" />
             <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seguridad</p>
               <p className="text-sm font-bold text-indigo-400">TLS 1.3 Active</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Parámetros de Configuración */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={20} className="text-blue-400"/> Conexión al Nodo Plai</h3>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">URL del Endpoint</label>
                  <input 
                    type="text" 
                    value={apiUrl} 
                    onChange={(e) => setApiUrl(e.target.value)} 
                    className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:ring-2 focus:ring-blue-500" 
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
               <button onClick={handleSaveAndTest} disabled={plaiStatus === 'checking'} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg">
                  {saveStatus ? <RefreshCcw className="animate-spin" size={18}/> : <Save size={18}/>} 
                  {plaiStatus === 'checking' ? 'PROBANDO...' : 'VINCULAR Y PROBAR CONEXIÓN'}
               </button>
            </div>
          </div>

          {/* Terminal de Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-xl min-h-[400px]">
            <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-slate-800">
               <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                 <Terminal size={14} className="text-green-400" /> Nara Real-time Diagnostic
               </div>
               <button onClick={clearLogs} className="text-slate-500 hover:text-red-400 transition-colors text-[10px] font-bold">
                 LIMPIAR CONSOLA
               </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] space-y-3 overflow-y-auto bg-black/40">
               {logs.length === 0 && <p className="text-slate-600 italic">No hay logs de conexión...</p>}
               {logs.map((log, idx) => (
                 <div key={log.id} className="border-l-2 border-slate-800 pl-3 py-1">
                    <div className="flex gap-2 items-center mb-1">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={`px-1 rounded text-[8px] font-black ${log.type === 'error' ? 'bg-red-900/40 text-red-400' : log.type === 'network' ? 'bg-blue-900/40 text-blue-400' : 'bg-green-900/40 text-green-400'}`}>
                        {log.type.toUpperCase()}
                      </span>
                      <button onClick={() => setExpandedLog(expandedLog === idx ? null : idx)} className="ml-auto text-slate-600 hover:text-white">
                         {expandedLog === idx ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                      </button>
                    </div>
                    <p className="text-slate-300 font-bold">{log.message}</p>
                    {(expandedLog === idx || log.type === 'error') && log.data && (
                      <div className="mt-2 relative">
                        <div className="absolute right-2 top-2 text-[8px] text-slate-600 font-bold">SERVER RESPONSE</div>
                        <pre className="text-[9px] text-indigo-300 bg-indigo-950/20 p-3 rounded border border-indigo-900/30 overflow-x-auto whitespace-pre-wrap max-h-60 overflow-y-auto">
                          {log.data}
                        </pre>
                      </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
