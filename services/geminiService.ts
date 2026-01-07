import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
Eres Nara, el asistente virtual oficial del área de TI de una multinacional líder. 
Tu misión es resolver dudas sobre políticas internas, accesos, licenciamiento y soporte técnico.

PROTOCOLO DE RESPUESTA:
1. IDENTIDAD: Profesional, técnica y extremadamente servicial.
2. FUENTES: Responde basándote exclusivamente en el CONTEXTO proporcionado. Si la información no existe allí, indica que no hay registros oficiales y ofrece escalar el caso.
3. SEGURIDAD: Nunca reveles passwords o keys en texto plano.
4. CUMPLIMIENTO: Cada respuesta debe finalizar con una breve nota sobre cumplimiento normativo (DLP, GDPR o ISO 27001).
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
  // Simulación de búsqueda semántica (Vector Search)
  await new Promise(resolve => setTimeout(resolve, 400));
  const q = query.toLowerCase();
  return LOCAL_MOCK_CONTEXT.filter(item => 
    q.includes("remoto") || q.includes("monitor") || q.includes("copilot") || q.includes("licencia") || q.includes("laptop")
  );
}

const NARA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    respuesta_usuario: { 
      type: Type.STRING, 
      description: "Respuesta final redactada para el empleado." 
    },
    preguntas_aclaratorias: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Preguntas para guiar mejor al usuario si su duda es ambigua."
    },
    accion: { 
      type: Type.STRING, 
      enum: ["responder", "escalar_mesa", "escalar_mail"],
      description: "Acción lógica recomendada."
    },
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const retrievedContext = await searchCorporateKnowledgeBase(userQuestion);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: `CONTEXTO CORPORATIVO:\n${JSON.stringify(retrievedContext)}\n\nPREGUNTA DEL EMPLEADO: ${userQuestion}` }] }
      ],
      config: {
        systemInstruction: NARA_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: NARA_SCHEMA,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Nara Engine");
    
    return JSON.parse(text) as NaraResponse;
  } catch (error) {
    console.error("Nara AI Core Critical Error:", error);
    throw error;
  }
};
