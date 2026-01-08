
import { AgentFile, MockContextItem } from '../types';

const STORAGE_FILES_KEY = 'NARA_MOCK_FILES';
const STORAGE_CONTENT_KEY = 'NARA_DYNAMIC_KNOWLEDGE';

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content || content.includes('\u0000')) {
        resolve("");
      } else {
        resolve(content);
      }
    };
    reader.onerror = () => resolve("");
    // Aumentamos el límite de lectura a 1MB para manuales reales
    reader.readAsText(file.slice(0, 1000000));
  });
};

export const agentBuilderService = {
  getFiles: async (): Promise<AgentFile[]> => {
    const stored = localStorage.getItem(STORAGE_FILES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  uploadFile: async (agentId: string, apiKey: string, file: File): Promise<boolean> => {
    let extractedText = await readFileAsText(file);
    
    // Fallback: Si no es texto plano, informamos que requiere OCR o parseador específico
    if (!extractedText || extractedText.trim().length < 5) {
      extractedText = `ARCHIVO BINARIO DETECTADO: ${file.name}\n\nNota: Este archivo no es texto plano (posible PDF, Excel binario o imagen). Para el piloto, por favor sube versiones en .TXT o .CSV para garantizar que Nara pueda leer el contenido exacto.`;
    }

    const stored = localStorage.getItem(STORAGE_FILES_KEY);
    const files: AgentFile[] = stored ? JSON.parse(stored) : [];
    
    const newFile: AgentFile = {
      uuid: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      status: 'ready',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem(STORAGE_FILES_KEY, JSON.stringify([newFile, ...files]));

    const knowledgeStored = localStorage.getItem(STORAGE_CONTENT_KEY);
    const knowledge: MockContextItem[] = knowledgeStored ? JSON.parse(knowledgeStored) : [];
    
    const newKnowledge: MockContextItem = {
      doc_id: newFile.uuid,
      titulo: newFile.name,
      seccion_o_clausula: "Ingesta Real Producción",
      fecha_version: newFile.uploadDate,
      texto: extractedText,
      score: 0,
      tipo_archivo: file.name.endsWith('.xlsx') ? 'xlsx' : (file.name.endsWith('.pdf') ? 'pdf' : 'docx')
    };

    localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify([newKnowledge, ...knowledge]));
    window.dispatchEvent(new Event('storage'));
    return true;
  },

  deleteFiles: async (agentId: string, apiKey: string, uuids: string[]): Promise<boolean> => {
    const stored = localStorage.getItem(STORAGE_FILES_KEY);
    if (stored) {
      const files: AgentFile[] = JSON.parse(stored);
      localStorage.setItem(STORAGE_FILES_KEY, JSON.stringify(files.filter(f => !uuids.includes(f.uuid))));
    }
    const knowledgeStored = localStorage.getItem(STORAGE_CONTENT_KEY);
    if (knowledgeStored) {
      const knowledge: MockContextItem[] = JSON.parse(knowledgeStored);
      localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(knowledge.filter(k => !uuids.includes(k.doc_id))));
    }
    window.dispatchEvent(new Event('storage'));
    return true;
  }
};
