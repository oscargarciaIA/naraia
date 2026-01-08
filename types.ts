
export interface Fuente {
  doc_id: string;
  titulo: string;
  seccion_o_clausula: string;
  fecha_version: string;
  score: number;
  tipo_archivo?: 'pdf' | 'docx' | 'xlsx' | 'csv';
}

export interface Escalamiento {
  metodo: 'mesa' | 'mail' | null;
  ticket_id: string | null;
  mail_id: string | null;
  resumen: string | null;
  severidad: 'P1' | 'P2' | 'P3' | 'P4' | null;
}

export interface NaraResponse {
  respuesta_usuario: string;
  preguntas_aclaratorias: string[];
  accion: 'responder' | 'buscar_vector' | 'consultar_motor' | 'escalar_mesa' | 'escalar_mail';
  nivel_confianza: number;
  fuentes: Fuente[];
  nota_compliance: string;
  escalamiento: Escalamiento;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | NaraResponse;
  timestamp: Date;
}

export interface AgentConfig {
  agentId: string;
  apiKey: string;
}

export interface MockContextItem {
  doc_id: string;
  titulo: string;
  seccion_o_clausula: string;
  fecha_version: string;
  texto: string;
  score: number;
  tipo_archivo: 'pdf' | 'docx' | 'xlsx' | 'csv';
}

export interface AgentFile {
  uuid: string;
  name: string;
  type: string;
  size: number;
  status: 'indexing' | 'ready' | 'error';
  uploadDate: string;
}
