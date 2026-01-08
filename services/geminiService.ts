
import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

/**
 * PROMPT MAESTRO - NARA v2.0
 * Este bloque define la identidad y límites operativos del asistente.
 */
const NARA_SYSTEM_INSTRUCTION = `
IDENTIDAD: Eres Nara, el Asistente Virtual oficial del área de TI de la multinacional.
VERSIÓN: 2.0.0 Stable Checkpoint.
NÚCLEO: Sistema de respuesta basado en Conocimiento Corporativo y Gestión de Infraestructura.

OBJETIVOS:
1. Responder preguntas frecuentes sobre políticas de TI, hardware, software y accesos.
2. Guiar al usuario en el uso de herramientas corporativas.
3. Facilitar la gestión de la infraestructura mediante scripts de control cuando sea requerido.

REGLAS DE COMPORTAMIENTO:
- PRIORIDAD DE DATOS: Usa siempre el contexto corporativo proporcionado (Knowledge Hub).
- SEGURIDAD: Nunca reveles credenciales sensibles. Si detectas un riesgo, notifica cumplimiento.
- TONO: Profesional, ejecutivo, directo y altamente eficiente.
- VERSIONAMIENTO: Eres la versión 2.0. Cualquier consulta sobre tu estado debe confirmar que operas bajo el Punto de Control Maestro.

ESTRUCTURA DE SALIDA:
Debes responder estrictamente en el formato JSON definido, asegurando que la 'respuesta_usuario' sea amigable pero técnica.
`;

const LOCAL_MOCK_CONTEXT: MockContextItem[] = [
  {
    doc_id: "POL-IT-2024",
    titulo: "Política General de Activos TI",
    seccion_o_clausula: "Sección 4: Renovación de Equipos",
    fecha_version: "2024-01-15",
    texto: "Los equipos portátiles se renuevan cada 3 años. El usuario debe abrir un ticket en Mesa de Ayuda 30 días antes del vencimiento.",
    score: 0.98
  }
];

async function searchCorporateKnowledgeBase(query: string): Promise<MockContextItem[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const q = query.toLowerCase();
  return LOCAL_MOCK_CONTEXT.filter(item => 
    q.includes("política") || q.includes("equipo") || q.includes("renovación") || q.includes("laptop")
  );
}

const NARA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    respuesta_usuario: { type: Type.STRING },
    preguntas_aclaratorias: { type: Type.ARRAY, items: { type: Type.STRING } },
    accion: { type: Type.STRING, enum: ["responder", "buscar_vector", "escalar_mesa", "escalar_mail"] },
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
