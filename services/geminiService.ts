
import { GoogleGenAI, Type } from "@google/genai";
import { MockContextItem, NaraResponse } from '../types';

const NARA_SYSTEM_INSTRUCTION = `
IDENTIDAD: Eres Nara, el Asistente Virtual de TI.
TU MISIÓN: Responder preguntas basadas EXCLUSIVAMENTE en los documentos cargados en el sistema.

MODO PILOTO ACTIVADO:
1. Recibirás un "CATÁLOGO DE ARCHIVOS" (lista de nombres) y un "CONTEXTO DETALLADO" (contenido de los archivos).
2. Si el "CONTEXTO DETALLADO" tiene información, úsala para responder con precisión técnica.
3. Si el "CONTEXTO DETALLADO" está vacío pero ves archivos en el "CATÁLOGO" que parecen relevantes, explica al usuario que los archivos existen pero el motor de búsqueda requiere una pregunta más específica.
4. NUNCA digas "no hay documentos cargados" si ves que el catálogo tiene elementos.
`;

// Recupera los nombres de todos los archivos para que Nara sepa qué existe globalmente
function getFullCatalog(): string[] {
  const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
  const fullKnowledge: MockContextItem[] = dynamicStored ? JSON.parse(dynamicStored) : [];
  return fullKnowledge.map(k => k.titulo);
}

async function searchKnowledgeHub(query: string): Promise<MockContextItem[]> {
  const q = query.toLowerCase().trim();
  const dynamicStored = localStorage.getItem('NARA_DYNAMIC_KNOWLEDGE');
  const fullKnowledge: MockContextItem[] = dynamicStored ? JSON.parse(dynamicStored) : [];

  if (fullKnowledge.length === 0) return [];

  // FUERZA BRUTA PARA PILOTO: Si hay menos de 10 archivos, mandamos TODOS.
  // Esto elimina errores de "embedding" o "retrieval" durante las pruebas iniciales.
  if (fullKnowledge.length <= 10) {
    return fullKnowledge.map(k => ({ ...k, score: 1.0 }));
  }

  // Si hay muchos archivos, filtramos por relevancia
  const results = fullKnowledge.map(item => {
    let score = 0;
    const title = item.titulo.toLowerCase();
    const body = item.texto.toLowerCase();
    const qWords = q.split(/\s+/).filter(w => w.length > 2);
    
    qWords.forEach(word => {
      if (title.includes(word)) score += 3.0;
      if (body.includes(word)) score += 1.0;
    });

    return { ...item, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score);

  return results.slice(0, 5);
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
  
  // Recuperamos el contexto (ahora enviará todo si son pocos archivos)
  const retrievedContext = await searchKnowledgeHub(userQuestion);
  const catalog = getFullCatalog();

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
      { 
        role: 'user', 
        parts: [{ 
          text: `
          ESTADO DEL SISTEMA (CATÁLOGO DE ARCHIVOS): ${catalog.length > 0 ? catalog.join(', ') : 'VACÍO'}
          
          CONTEXTO DETALLADO (CONTENIDO DE LOS DOCUMENTOS):
          ${retrievedContext.length > 0 ? JSON.stringify(retrievedContext) : 'SIN RESULTADOS RELEVANTES EN BÚSQUEDA SEMÁNTICA'}
          
          PREGUNTA DEL USUARIO: ${userQuestion}
          ` 
        }] 
      }
    ],
    config: {
      systemInstruction: NARA_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: NARA_SCHEMA,
      temperature: 0,
    },
  });
  
  return JSON.parse(response.text) as NaraResponse;
};
