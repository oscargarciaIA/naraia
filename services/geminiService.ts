import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MockContextItem, NaraResponse, AgentConfig } from '../types';

// Datos simulados para RAG (Retrieval Augmented Generation)
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

// Simula la búsqueda en una base de datos vectorial (pgvector)
async function searchCorporateKnowledgeBase(query: string, agentConfig?: AgentConfig): Promise<MockContextItem[]> {
  await new Promise(resolve => setTimeout(resolve, 600)); // Latencia de red simulada
  return LOCAL_MOCK_CONTEXT;
}

const SYSTEM_INSTRUCTION = `
Eres Nara, un asistente virtual de TI de nivel empresarial.
OBJETIVO: Responder consultas sobre contratos, licencias y políticas de TI.

REGLAS DE ORO:
1. BASATE SOLO EN EL CONTEXTO_VECTORIAL PROPORCIONADO. No inventes información.
2. Si la información no está en el contexto, indica explícitamente que no tienes datos sobre ese tema específico.
3. Mantén un tono profesional, conciso y servicial.
4. La salida debe ser estrictamente JSON válido según el esquema solicitado.

ESQUEMA DE RESPUESTA (JSON):
{
  "respuesta_usuario": "string (Tu respuesta en lenguaje natural y amigable)",
  "preguntas_aclaratorias": ["string"] (Opcional: preguntas para desambiguar),
  "accion": "responder" | "escalar_mesa",
  "nivel_confianza": number (0.0 a 1.0),
  "fuentes": [{"doc_id": "string", "titulo": "string", "seccion_o_clausula": "string", "fecha_version": "string", "score": number}],
  "nota_compliance": "string" (Breve nota si hay implicaciones de seguridad/compliance),
  "escalamiento": {"metodo": null, "ticket_id": null, "mail_id": null, "resumen": null, "severidad": null}
}
`;

export const sendMessageToNara = async (
  userQuestion: string,
  history: { role: string; content: string }[],
  agentConfig?: AgentConfig
): Promise<NaraResponse> => {
  // Inicialización segura del cliente GenAI
  // NOTA: La API Key se inyecta desde docker-compose.yml -> process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Recuperación de contexto (RAG)
  const retrievedContext = await searchCorporateKnowledgeBase(userQuestion, agentConfig);

  // 2. Construcción del Prompt con Grounding
  const promptPayload = `
    PREGUNTA DEL USUARIO: ${userQuestion}
    
    CONTEXTO_VECTORIAL RECUPERADO (Base de Conocimiento Corporativa):
    ${JSON.stringify(retrievedContext, null, 2)}
  `;

  try {
    // 3. Configuración del Chat
    const chat: Chat = ai.chats.create({
      model: 'gemini-3-flash-preview', // Modelo optimizado para latencia y tareas de texto
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json", // Forzamos salida JSON estructurada
        temperature: 0.2, // Baja temperatura para respuestas más deterministas y factuales
      },
    });

    // 4. Generación de respuesta
    const result: GenerateContentResponse = await chat.sendMessage({ message: promptPayload });

    // 5. Procesamiento de respuesta
    if (result.text) {
      return JSON.parse(result.text) as NaraResponse;
    } else {
      throw new Error("Respuesta vacía del modelo");
    }

  } catch (error) {
    console.error("Error en servicio Nara AI:", error);
    
    // Fallback seguro en caso de error
    return {
      respuesta_usuario: "Lo siento, estoy experimentando dificultades técnicas para consultar la base de conocimiento en este momento. Por favor, intenta de nuevo en unos segundos.",
      preguntas_aclaratorias: [],
      accion: "escalar_mesa",
      nivel_confianza: 0,
      fuentes: [],
      nota_compliance: "Error de Sistema - Interrupción de Servicio",
      escalamiento: { 
        metodo: "mesa", 
        ticket_id: null, 
        mail_id: null, 
        resumen: "Fallo en conexión API GenAI", 
        severidad: "P3" 
      }
    };
  }
};