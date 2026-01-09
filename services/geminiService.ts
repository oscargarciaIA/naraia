
import { NaraResponse } from '../types';

// Endpoint oficial Plai Cencosud
const PLAI_API_ENDPOINT = 'https://plai-api-core.cencosud.ai/api/assistant'; 

export const sendMessageToNara = async (
  input: string,
  history: { role: string; content: string }[],
  chatId?: string
): Promise<NaraResponse> => {
  const agentId = process.env.AGENT_ID;
  const apiKey = process.env.API_KEY;

  if (!agentId || !apiKey || agentId === "undefined" || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING");
  }

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
        chatId: chatId, // Se envía si existe para mantener el hilo de la conversación
        useGrounding: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status} en motor corporativo`);
    }

    const data = await response.json();

    // Mapeo de la respuesta del motor corporativo al esquema visual de Nara
    return {
      respuesta_usuario: data.response,
      chatId: data.chatId,
      preguntas_aclaratorias: [],
      accion: "responder",
      nivel_confianza: data.contextWasUsed ? 1.0 : 0.85,
      fuentes: (data.groundingMetadata || []).map((g: any) => ({
        doc_id: g.uri || Math.random().toString(),
        titulo: g.title || g.domain || "Fuente Corporativa",
        seccion_o_clausula: g.texts?.[0]?.substring(0, 60) + "..." || "Fragmento de conocimiento",
        score: 1.0,
        tipo_archivo: 'pdf'
      })),
      nota_compliance: `Sesión ID: ${data.chatId || 'N/A'}. Verificado por Plai Cencosud AI Engine.`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    console.error("Plai Corporate Engine Error:", error);
    throw error;
  }
};
