
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
  addLog('network', `Probando conexión con el endpoint: ${url}`);
  
  try {
    const start = Date.now();
    
    // Si tenemos credenciales, hacemos un POST real de validación
    const options: RequestInit = credentials ? {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-agent-id': credentials.agentId,
        'x-api-key': credentials.apiKey
      },
      body: JSON.stringify({ input: "System Connectivity Test", test: true })
    } : { method: 'OPTIONS' };

    const response = await fetch(url, options);
    const duration = Date.now() - start;
    
    let responseBody = "";
    try {
      responseBody = await response.text();
    } catch (e) {
      responseBody = "No se pudo leer el contenido de la respuesta del servidor.";
    }

    const statusMsg = `HTTP ${response.status} ${response.statusText} (${duration}ms)`;
    
    if (response.ok) {
      addLog('info', `Conexión exitosa: ${statusMsg}`, responseBody);
    } else {
      addLog('error', `El servidor respondió con error: ${statusMsg}`, responseBody);
    }
    
    return { 
      ok: response.ok || response.status === 405, 
      msg: statusMsg,
      details: responseBody
    };
  } catch (e: any) {
    const errorDetail = `Error de Red Crítico: ${e.message}. Esto suele ocurrir por bloqueos de CORS, VPN no activa o URL incorrecta.`;
    addLog('error', 'Fallo en la petición (Failed to fetch)', errorDetail);
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
    addLog('error', 'No se puede enviar el mensaje: Faltan credenciales configuradas.');
    throw new Error("API_KEY_MISSING");
  }

  addLog('network', `Enviando consulta a Plai: ${apiUrl}`, { agentId, chatId });

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
      addLog('error', `Error en la API de Plai (${response.status})`, responseText);
      throw new Error(`Plai Error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    addLog('info', `Respuesta recibida del motor Plai`, data);

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
      nota_compliance: `Validado por Motor Plai Cencosud AI. Sesión: ${data.chatId || 'N/A'}`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    addLog('error', 'Error de comunicación durante la sesión', error.message);
    throw error;
  }
};
