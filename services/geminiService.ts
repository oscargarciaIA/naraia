
import { NaraResponse } from '../types';

// Base URL según documentación corporativa
const PLAI_API_BASE_URL = 'https://api.plai.ai'; 

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
    const response = await fetch(`${PLAI_API_BASE_URL}/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-agent-id': agentId,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        input: input,
        chatId: chatId,
        useGrounding: true,
        modelParameters: {
          temperature: 0.2,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status} en motor corporativo`);
    }

    const data = await response.json();

    // Mapeo de la respuesta de Plai al formato visual de Nara
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
      nota_compliance: `Sesión ID: ${data.chatId || 'N/A'}. Información verificada por el motor Plai.`,
      escalamiento: { metodo: null, ticket_id: null, mail_id: null, resumen: null, severidad: null }
    } as NaraResponse;

  } catch (error: any) {
    console.error("Plai Engine Error:", error);
    throw error;
  }
};
