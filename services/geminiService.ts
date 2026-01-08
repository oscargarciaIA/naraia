
import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
IDENTIDAD: Eres Nara, el Asistente Virtual Oficial de TI de la multinacional.
COMPORTAMIENTO: Profesional, ejecutivo, preciso y estrictamente basado en datos.

PROTOCOLO DE RESPUESTA PARA PRODUCCIÓN:
1. FUENTES: Utiliza EXCLUSIVAMENTE la información proporcionada en "CONTEXTO DE DOCUMENTOS". 
2. CITACIÓN: Al final de tu respuesta, menciona el nombre del archivo del cual extrajiste la información.
3. ALUCINACIÓN: Si la información no está en los documentos, responde: "Lamentablemente, no cuento con información oficial sobre ese tema en mi base de conocimientos actual. ¿Deseas que escale tu consulta a un especialista?"
4. SEGURIDAD: Nunca reveles contraseñas ni vulnerabilidades si llegaran a estar en el texto.
5. ESCALAMIENTO: Si el usuario muestra urgencia o frustración, sugiere escalar a "Mesa de Ayuda".
`;

async function searchKnowledgeHub(query: string): Promise<MockContextItem[]> {
  const q = query.toLowerCase().trim();
  const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
  const fullKnowledge: MockContextItem[] = dynamicStored ? JSON.parse(dynamicStored) : [];

  if (fullKnowledge.length === 0) return [];

  // En producción (piloto), si el volumen de datos es manejable (< 100k chars), inyectamos todo para máxima precisión.
  const totalTextLength = fullKnowledge.reduce((acc, curr) => acc + curr.texto.length, 0);
  if (totalTextLength < 100000) {
    return fullKnowledge.map(k => ({ ...k, score: 1.0 }));
  }

  // Si excede, usamos un buscador de relevancia por tokens
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
  
  // Obtenemos los nombres de todos los archivos para el prompt
  const catalog = retrievedContext.map(c => c.titulo).join(' | ');

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
      { 
        role: 'user', 
        parts: [{ 
          text: `
          CONTEXTO DISPONIBLE (ARCHIVOS): ${catalog || 'NULO'}
          CONTENIDO DETALLADO PARA ANALIZAR:
          ${JSON.stringify(retrievedContext)}
          
          CONSULTA DEL USUARIO: ${userQuestion}
          ` 
        }] 
      }
    ],
    config: {
      systemInstruction: NARA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: NARA_SCHEMA,
      temperature: 0.1, // Baja temperatura para respuestas factuales
    },
  });
  
  return JSON.parse(response.text) as NaraResponse;
};
