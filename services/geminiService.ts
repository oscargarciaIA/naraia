
import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
IDENTIDAD: Eres Nara, el Asistente Virtual Oficial de TI.
MISIÓN: Responder basándote estrictamente en el "CONTEXTO DE DOCUMENTOS" proporcionado.

PROTOCOLO v2.0:
1. Siempre cita la fuente de la información.
2. Si el dato no está en el contexto, indica amablemente que no tienes registro oficial pero puedes escalar el caso.
3. Mantén un tono técnico y profesional.
`;

async function searchKnowledgeHub(query: string): Promise<MockContextItem[]> {
  const q = query.toLowerCase().trim();
  const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
  const fullKnowledge: MockContextItem[] = dynamicStored ? JSON.parse(dynamicStored) : [];

  if (fullKnowledge.length === 0) return [];

  // Modo Sincronizado v2.0: Inyectar todo si es < 100k caracteres
  const totalTextLength = fullKnowledge.reduce((acc, curr) => acc + curr.texto.length, 0);
  if (totalTextLength < 100000) {
    return fullKnowledge.map(k => ({ ...k, score: 1.0 }));
  }

  return fullKnowledge.map(item => {
    let score = 0;
    const tokens = q.split(/\s+/).filter(t => t.length > 2);
    tokens.forEach(token => {
      if (item.titulo.toLowerCase().includes(token)) score += 10;
      if (item.texto.toLowerCase().includes(token)) score += 2;
    });
    return { ...item, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
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
          score: { type: Type.NUMBER },
          tipo_archivo: { type: Type.STRING }
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
  const retrievedContext = await searchKnowledgeHub(userQuestion);
  const catalog = retrievedContext.map(c => c.titulo).join(' | ');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
      { 
        role: 'user', 
        parts: [{ 
          text: `
          CONTEXTO v2.0: ${catalog || 'SIN DOCUMENTOS'}
          DATOS: ${JSON.stringify(retrievedContext)}
          PREGUNTA: ${userQuestion}
          ` 
        }] 
      }
    ],
    config: {
      systemInstruction: NARA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: NARA_SCHEMA,
      temperature: 0.1,
    },
  });
  
  return JSON.parse(response.text) as NaraResponse;
};
