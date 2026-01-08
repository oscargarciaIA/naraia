
import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
IDENTIDAD: Eres Nara, el Asistente Virtual de TI v2.0 (Production Core).
ESTADO: Sistema estable y verificado.

REGLAS DE RESPUESTA:
1. PRIORIDAD: Usa el Knowledge Hub corporativo (PostgreSQL + pgvector).
2. SEGURIDAD: Aplica protocolos de la multinacional.
3. TONO: Profesional, eficiente y servicial.
4. VERSIONAMIENTO: Si te preguntan, confirma que estás operando bajo el núcleo v2.0 Estable.
`;

const LOCAL_MOCK_CONTEXT: MockContextItem[] = [
  {
    doc_id: "MAN-IT-001",
    titulo: "Manual de Configuración VPN Corporativa",
    seccion_o_clausula: "Capítulo 2: Acceso Remoto",
    fecha_version: "2024-02-10",
    texto: "Para acceder a la red interna, el usuario debe tener activo el MFA via Microsoft Authenticator. El servidor de entrada es vpn.multinacional.com.",
    score: 0.95
  },
  {
    doc_id: "CONT-HW-2024",
    titulo: "Contrato Suministro Dell Technologies",
    seccion_o_clausula: "Anexo A: Tiempos de Entrega",
    fecha_version: "2024-01-01",
    texto: "La entrega de nuevos equipos portátiles (Latitude 5440) tiene un plazo máximo de 15 días hábiles tras la aprobación del ticket de compra.",
    score: 0.92
  }
];

async function searchCorporateKnowledgeBase(query: string): Promise<MockContextItem[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const q = query.toLowerCase();
  return LOCAL_MOCK_CONTEXT.filter(item => 
    q.includes("vpn") || q.includes("manual") || q.includes("entrega") || q.includes("equipo") || q.includes("laptop")
  );
}

const NARA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    respuesta_usuario: { type: Type.STRING },
    preguntas_aclaratorias: { type: Type.ARRAY, items: { type: Type.STRING } },
    accion: { type: Type.STRING, enum: ["responder", "buscar_vector", "escalar_mesa"] },
    nivel_confianza: { type: Type.NUMBER },
    fuentes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          doc_id: { type: Type.STRING },
          titulo: { type: Type.STRING },
          seccion_o_clausula: { type: Type.STRING },
          score: { type: Type.NUMBER }
        }
      }
    },
    nota_compliance: { type: Type.STRING },
    escalamiento: {
      type: Type.OBJECT,
      properties: {
        metodo: { type: Type.STRING, nullable: true },
        ticket_id: { type: Type.STRING, nullable: true },
        severidad: { type: Type.STRING, nullable: true }
      }
    }
  },
  required: ["respuesta_usuario", "accion", "nivel_confianza", "fuentes", "nota_compliance", "escalamiento"]
};

export const sendMessageToNara = async (
  userQuestion: string,
  history: { role: string; content: string }[]
): Promise<NaraResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const retrievedContext = await searchCorporateKnowledgeBase(userQuestion);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: `CONTEXTO CORPORATIVO:\n${JSON.stringify(retrievedContext)}\n\nPREGUNTA: ${userQuestion}` }] }
      ],
      config: {
        systemInstruction: NARA_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: NARA_SCHEMA,
        temperature: 0,
      },
    });
    return JSON.parse(response.text) as NaraResponse;
  } catch (error) {
    console.error("Critical Error:", error);
    throw error;
  }
};
