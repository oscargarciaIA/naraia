
import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
Eres Nara, el asistente virtual oficial del área de TI de una multinacional líder. 

PROTOCOLO DE RESPUESTA:
1. IDENTIDAD: Profesional, técnica y experta en DEVOPS y SOPORTE IT.
2. REPOSITORIO: El hogar oficial de este proyecto es https://github.com/oscargarciaIA/naraia.git. 
3. SOPORTE GITHUB: Si el usuario pregunta por el código o cómo colaborar, guíalo hacia el repositorio oficial y menciónale que los scripts de sincronización v1.2.9 ya están configurados para ese destino.
4. FUENTES: Responde basándote exclusivamente en el CONTEXTO proporcionado.
5. CUMPLIMIENTO: Cada respuesta debe finalizar con una breve nota sobre cumplimiento normativo (ISO 27001).
`;

const LOCAL_MOCK_CONTEXT: MockContextItem[] = [
  {
    doc_id: "POL-RW-2024",
    titulo: "Política Global de Trabajo Remoto",
    seccion_o_clausula: "3.2 Equipamiento IT",
    fecha_version: "2024-01-15",
    texto: "La compañía proporciona laptops corporativas. Monitores requieren aprobación.",
    score: 0.95
  },
  {
    doc_id: "DEV-REPO-001",
    titulo: "Repositorio Oficial Nara",
    seccion_o_clausula: "1.0 GitHub",
    fecha_version: "2024-04-10",
    texto: "La URL oficial del proyecto es https://github.com/oscargarciaIA/naraia.git. Todo commit debe pasar por la GitHub Action de CI/CD configurada en .github/workflows/main.yml.",
    score: 1.0
  }
];

async function searchCorporateKnowledgeBase(query: string): Promise<MockContextItem[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const q = query.toLowerCase();
  return LOCAL_MOCK_CONTEXT.filter(item => 
    q.includes("remoto") || q.includes("monitor") || q.includes("github") || q.includes("sync") || q.includes("repo") || q.includes("naraia")
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
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: `CONTEXTO CORPORATIVO:\n${JSON.stringify(retrievedContext)}\n\nPREGUNTA: ${userQuestion}` }] }
      ],
      config: {
        systemInstruction: NARA_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: NARA_SCHEMA,
        temperature: 0.1,
      },
    });
    return JSON.parse(response.text) as NaraResponse;
  } catch (error) {
    console.error("Nara AI Core Critical Error:", error);
    throw error;
  }
};
