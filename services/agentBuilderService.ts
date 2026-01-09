
import { AgentFile, MockContextItem } from '../types';
import { addLog } from './geminiService';

const STORAGE_FILES_KEY = 'NARA_MOCK_FILES';
const STORAGE_CONTENT_KEY = 'NARA_DYNAMIC_KNOWLEDGE';

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content || "");
    };
    reader.onerror = () => resolve("");
    reader.readAsText(file.slice(0, 1000000));
  });
};

export const agentBuilderService = {
  getFiles: async (): Promise<AgentFile[]> => {
    const stored = localStorage.getItem(STORAGE_FILES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  uploadFile: async (agentId: string, apiKey: string, file: File): Promise<boolean> => {
    addLog('info', `Iniciando proceso de ingesta: ${file.name}`);
    
    let extractedText = await readFileAsText(file);
    
    if (!extractedText || extractedText.trim().length < 5) {
      addLog('error', `El archivo ${file.name} parece estar vacío o ser binario.`);
      extractedText = `Contenido no legible para ${file.name}`;
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
      seccion_o_clausula: "Local Vector Sync",
      fecha_version: newFile.uploadDate,
      texto: extractedText,
      score: 1.0,
      tipo_archivo: 'pdf'
    };

    localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify([newKnowledge, ...knowledge]));
    
    addLog('info', `Archivo indexado correctamente. Fragmentos generados: ${Math.ceil(extractedText.length / 500)}`);
    
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('nara_log_update'));
    return true;
  },

  deleteFiles: async (agentId: string, apiKey: string, uuids: string[]): Promise<boolean> => {
    addLog('info', `Eliminando ${uuids.length} documentos de la base de datos.`);
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
    window.dispatchEvent(new Event('nara_log_update'));
    return true;
  }
};
