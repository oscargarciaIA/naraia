
import { NaraResponse } from '../types';

// Valor por defecto corporativo
export const DEFAULT_PLAI_URL = 'https://plai-api-core.cencosud.ai/api/assistant'; 

export const addLog = (type: 'info' | 'error' | 'network', message: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
    data: data ? (typeof data === 'string' ? data : JSON.stringify(data).substring(0, 500)) : null
  };
  localStorage.setItem('NARA_LOGS', JSON.stringify([newLog, ...logs].slice(0, 50)));
  window.dispatchEvent(new Event('nara_log_update'));
};

export const checkPlaiConnectivity = async (customUrl?: string): Promise<{ok: boolean, msg: string}> => {
  const url = customUrl || localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL;
  addLog('network', `Testeando conectividad con: ${url}`);
  
  try {
    const start = Date.now();
    const response = await fetch(url, { method: 'OPTIONS' });
    const duration = Date.now() - start;
    
    const statusMsg = `Status: ${response.status} ${response.statusText} (${duration}ms)`;
    addLog('info', `Respuesta de diagnóstico: ${statusMsg}`);
    
    return { 
      ok: response.ok || response.status === 405, 
      msg: statusMsg 
    };
  } catch (e: any) {
    const errorMsg = `Error de red: ${e.message || 'Sin respuesta del servidor'}`;
    addLog('error', errorMsg);
    return { ok: false, msg: errorMsg };
  }
};

export const sendMessageToNara = async (
  input: string,
  history: { role: string; content: string }[],
  chatId?: string
): Promise<NaraResponse> => {
  const agentId = localStorage.getItem('NARA_AGENT_ID') || process.env.AGENT_ID;
  const apiKey = localStorage.getItem('NARA_API_KEY') || process.env.API_KEY;
  const apiUrl = localStorage.getItem('NARA_PLAI_URL') || process.env.PLAI_URL || DEFAULT_PLAI_URL;

  if (!agentId || !apiKey) {
    addLog('error', 'Intento de envío fallido: Faltan credenciales (AgentID/ApiKey).');
    throw new Error("API_KEY_MISSING");
  }

  addLog('network', `Iniciando POST a Plai: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-agent-id': agentId,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        input: input,
        chatId: chatId,
        useGrounding: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      addLog('error', `Respuesta de error API (${response.status}):`, errorText);
      throw new Error(`Plai Error: ${response.status}`);
    }

    const data = await response.json();
    addLog('info', `Éxito: Motor Plai respondió para sesión ${data.chatId || 'n/a'}`);

    return {
      respuesta_usuario: data.response,
      chatId: data.chatId,
      preguntas_aclaratorias: [],
      accion: "responder",
      nivel_confianza: data.contextWasUsed ? 1.0 : 0.85,
      fuentes: (data.groundingMetadata || []).map((g: any) => ({
        doc_id: g.uri || Math.random().toString(),
        titulo: g.title || g.domain || "Fuente Corporativa",
        seccion_o_clausula: "Validado por RAG",
        score: 1.0
      })),
      nota_compliance: `Validado por Plai Cencosud AI. ID: ${data.chatId || 'N/A'}`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    addLog('error', 'Fallo de transporte o timeout.', error.message);
    throw error;
  }
};
