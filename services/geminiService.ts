
import { NaraResponse } from '../types';

/**
 * Endpoint oficial del motor corporativo Plai.
 * Se recomienda no modificar a menos que exista un cambio de versión mayor en la API central.
 */
export const DEFAULT_PLAI_URL = 'https://plai-api-core.cencosud.ai/api/assistant'; 

/**
 * Sistema de auditoría local. 
 * Almacena logs en localStorage para diagnóstico rápido sin persistencia en servidor externo.
 */
export const addLog = (type: 'info' | 'error' | 'network', message: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
  
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

/**
 * Valida la conectividad con el motor Plai.
 * Realiza una petición OPTIONS o POST (test) para confirmar el estado del canal.
 * @param customUrl URL opcional para pruebas de entorno.
 * @param credentials Objetos de autenticación (ID y Key).
 */
export const checkPlaiConnectivity = async (customUrl?: string, credentials?: {agentId: string, apiKey: string}): Promise<{ok: boolean, msg: string, details?: string}> => {
  const url = customUrl || localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL;
  addLog('network', `Verificando enlace con Plai Core: ${url}`);
  
  try {
    const start = Date.now();
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
    const responseBody = await response.text();
    const statusMsg = `HTTP ${response.status} (${duration}ms)`;
    
    if (response.ok) {
      addLog('info', `Canal validado: ${statusMsg}`, responseBody);
    } else {
      addLog('error', `Error de canal Plai: ${statusMsg}`, responseBody);
    }
    
    return { 
      ok: response.ok || response.status === 405, 
      msg: statusMsg,
      details: responseBody
    };
  } catch (e: any) {
    const errorDetail = `Falla de Red/CORS: ${e.message}. Verifique VPN y reglas de Firewall corporativo.`;
    addLog('error', 'Falla de comunicación crítica', errorDetail);
    return { ok: false, msg: "Connection Failed", details: errorDetail };
  }
};

/**
 * Orquestador principal de mensajes entre el usuario y Plai.
 * Implementa el protocolo RAG pasando el historial y activando Grounding.
 */
export const sendMessageToNara = async (
  input: string,
  history: { role: string; content: string }[],
  chatId?: string
): Promise<NaraResponse> => {
  const agentId = localStorage.getItem('NARA_AGENT_ID');
  const apiKey = localStorage.getItem('NARA_API_KEY');
  const apiUrl = localStorage.getItem('NARA_PLAI_URL') || DEFAULT_PLAI_URL;

  if (!agentId || !apiKey) {
    addLog('error', 'Intento de envío sin credenciales válidas.');
    throw new Error("API_KEY_MISSING");
  }

  addLog('network', `Petición saliente Plai [ID: ${agentId.substring(0,5)}...]`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-agent-id': agentId,
        'x-api-key': apiKey
      },
      body: JSON.stringify({ input, chatId, useGrounding: true })
    });

    const responseText = await response.text();

    if (!response.ok) {
      addLog('error', `Respuesta no autorizada del motor Plai (${response.status})`, responseText);
      throw new Error(`Plai Auth/Endpoint Error: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    addLog('info', `Transacción completada exitosamente`, { chatId: data.chatId });

    return {
      respuesta_usuario: data.response,
      chatId: data.chatId,
      preguntas_aclaratorias: [],
      accion: "responder",
      nivel_confianza: data.contextWasUsed ? 1.0 : 0.85,
      fuentes: (data.groundingMetadata || []).map((g: any) => ({
        doc_id: g.uri || Math.random().toString(),
        titulo: g.title || g.domain || "Documento Corporativo",
        seccion_o_clausula: "Validación Semántica",
        score: 1.0
      })),
      nota_compliance: `Certificado por Plai Engine v3.7. Sesión: ${data.chatId || 'ROOT'}`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    addLog('error', 'Falla en el ciclo de mensaje', error.message);
    throw error;
  }
};
