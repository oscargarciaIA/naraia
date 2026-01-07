import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
Eres Nara, el asistente oficial de cumplimiento y TI.
Tu arquitectura está diseñada para responder basándote ÚNICAMENTE en fuentes oficiales.
REGLAS CRÍTICAS:
1. Si la información no está en el CONTEXTO, debes informar que no tienes registros oficiales y sugerir escalamiento.
2. Mantén un tono técnico, preciso y profesional.
3. Siempre incluye una nota de cumplimiento legal/normativo.
4. Si el nivel de confianza en la respuesta es bajo (< 0.7), sugiere escalar a la mesa de ayuda.
`;

const LOCAL_MOCK_CONTEXT: MockContextItem[] = [
  {
    doc_id: "POL-RW-2024",
    titulo: "Política Global de Trabajo Remoto",
    seccion_o_clausula: "3.2 Equipamiento IT",
    fecha_version: "2024-01-15",
    texto: "La compañía proporcionará una (1) computadora portátil estándar corporativa. Los monitores externos no están incluidos por defecto y requieren aprobación de un gerente de línea.",
    score: 0.95
  },
  {
    doc_id: "LIC-MS-365",
    titulo: "Acuerdo Licenciamiento Microsoft",
    seccion_o_clausula: "Anexo B - Copilot",
    fecha_version: "2023-11-30",
    texto: "Empleados administrativos tienen licencia E3. El uso de Microsoft 365 Copilot requiere una licencia 'Add-on' específica y aprobación del Director de TI debido a costos adicionales.",
    score: 0.92
  }
];

async function searchCorporateKnowledgeBase(query: string): Promise<MockContextItem[]> {
  // Simulación de búsqueda semántica (En producción, esto consultaría la tabla knowledge.documents en Postgres)
  await new Promise(resolve => setTimeout(resolve, 300));
  const q = query.toLowerCase();
  return LOCAL_MOCK_CONTEXT.filter(item => 
    q.includes("remoto") || q.includes("monitor") || q.includes("copilot") || q.includes("licencia")
  );
}

const NARA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    respuesta_usuario: { type: Type.STRING },
    preguntas_aclaratorias: { type: Type.ARRAY, items: { type: Type.STRING } },
    accion: { type: Type.STRING, enum: ["responder", "escalar_mesa", "escalar_mail"] },
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
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `CONTEXTO:\n${JSON.stringify(retrievedContext)}\n\nPREGUNTA: ${userQuestion}` }] }],
      config: {
        systemInstruction: NARA_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: NARA_SCHEMA,
        temperature: 0, // Máxima precisión técnica
      },
    });

    return JSON.parse(response.text || '{}') as NaraResponse;
  } catch (error) {
    console.error("Nara AI Core Error:", error);
    throw error;
  }
};