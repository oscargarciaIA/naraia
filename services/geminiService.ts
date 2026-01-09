
import { NaraResponse } from '../types';

// Valor por defecto corporativo
export const DEFAULT_PLAI_URL = 'https://plai-api-core.cencosud.ai/api/assistant'; 

export const addLog = (type: 'info' | 'error' | 'network', message: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
  
  // Procesar data para que sea legible en la terminal
  let processedData = data;
  if (data && typeof data === 'object') {
    try {
      processedData = JSON.stringify(data, null, 2);
    } catch (e) {
      processedData = String(data);
    }
  }

  const newLog = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
    data: processedData
  };
  
  localStorage.setItem('NARA_LOGS', JSON.stringify([newLog, ...logs].slice(0, 50)));
  window.dispatchEvent(new Event('nara_log_update'));
};

export const checkPlaiConnectivity = async (customUrl?: string, credentials?: {agentId: string, apiKey: string}): Promise<{ok: boolean, msg: string, details?: string}> => {
  const url = customUrl || localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL;
  addLog('network', `Iniciando prueba de enlace con: ${url}`);
  
  try {
    const start = Date.now();
    
    // Si tenemos credenciales, intentamos un POST de validación (más real que OPTIONS)
    const options: RequestInit = credentials ? {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-agent-id': credentials.agentId,
        'x-api-key': credentials.apiKey
      },
      body: JSON.stringify({ input: "ping", test: true })
    } : { method: 'OPTIONS' };

    const response = await fetch(url, options);
    const duration = Date.now() - start;
    
    let responseBody = "";
    try {
      responseBody = await response.text();
    } catch (e) {
      responseBody = "No se pudo leer el cuerpo de la respuesta.";
    }

    const statusMsg = `HTTP ${response.status} ${response.statusText} en ${duration}ms`;
    addLog(response.ok ? 'info' : 'error', `Resultado de conexión: ${statusMsg}`, responseBody);
    
    return { 
      ok: response.ok || response.status === 405, 
      msg: statusMsg,
      details: responseBody
    };
  } catch (e: any) {
    const errorDetail = `Posibles causas: CORS, VPN desconectada, o URL errónea. Error: ${e.message}`;
    addLog('error', 'Fallo crítico de red (Failed to fetch)', errorDetail);
    return { ok: false, msg: "Failed to fetch", details: errorDetail };
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
    addLog('error', 'Credenciales faltantes.');
    throw new Error("API_KEY_MISSING");
  }

  addLog('network', `POST -> ${apiUrl}`, { agentId, chatId });

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

    const responseText = await response.text();

    if (!response.ok) {
      addLog('error', `Error en consulta (${response.status})`, responseText);
      throw new Error(`Plai Error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    addLog('info', `Respuesta recibida correctamente`, data);

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
      nota_compliance: `Motor Plai Cencosud. Sesión: ${data.chatId || 'N/A'}`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    addLog('error', 'Error en el transporte de datos', error.message);
    throw error;
  }
};
