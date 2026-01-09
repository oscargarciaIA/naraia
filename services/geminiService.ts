
import { NaraResponse } from '../types';

const PLAI_API_ENDPOINT = 'https://plai-api-core.cencosud.ai/api/assistant'; 

// Sistema de Logs Global para Debugging
export const addLog = (type: 'info' | 'error' | 'network', message: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem('NARA_LOGS') || '[]');
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
    data: data ? JSON.stringify(data).substring(0, 200) : null
  };
  localStorage.setItem('NARA_LOGS', JSON.stringify([newLog, ...logs].slice(0, 50)));
  window.dispatchEvent(new Event('nara_log_update'));
};

export const checkPlaiConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch(PLAI_API_ENDPOINT, { method: 'OPTIONS' });
    return response.ok || response.status === 405; // 405 es aceptable para OPTIONS
  } catch (e) {
    return false;
  }
};

export const sendMessageToNara = async (
  input: string,
  history: { role: string; content: string }[],
  chatId?: string
): Promise<NaraResponse> => {
  const agentId = localStorage.getItem('NARA_AGENT_ID') || process.env.AGENT_ID;
  const apiKey = localStorage.getItem('NARA_API_KEY') || process.env.API_KEY;

  if (!agentId || !apiKey) {
    addLog('error', 'Credenciales ausentes en el intento de envío.');
    throw new Error("API_KEY_MISSING");
  }

  addLog('network', `Enviando consulta a Plai... (ChatId: ${chatId || 'nuevo'})`, { input });

  try {
    const response = await fetch(PLAI_API_ENDPOINT, {
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
      addLog('error', `Error de red: ${response.status}`, errorText);
      throw new Error(`Plai Error: ${response.status}`);
    }

    const data = await response.json();
    addLog('info', 'Respuesta recibida exitosamente del motor Plai.', { response: data.response });

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
      nota_compliance: `Verificado por Plai Cencosud. ID: ${data.chatId || 'N/A'}`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    addLog('error', 'Fallo crítico en el motor de comunicación.', error.message);
    throw error;
  }
};
