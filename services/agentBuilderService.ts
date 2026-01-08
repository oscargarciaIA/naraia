
import { AgentFile, MockContextItem } from '../types';

const STORAGE_FILES_KEY = 'NARA_MOCK_FILES';
const STORAGE_CONTENT_KEY = 'NARA_DYNAMIC_KNOWLEDGE';

const simulateFileContent = (file: File): string => {
  const name = file.name.toLowerCase();
  const date = new Date().toLocaleDateString();
  
  // Generamos un bloque de texto muy rico en palabras clave para asegurar el match
  if (name.includes('contrato') || name.includes('sla') || name.includes('acuerdo')) {
    return `DOCUMENTO OFICIAL: ACUERDOS DE NIVEL DE SERVICIO (SLA) TI.
    Este documento regula los tiempos de respuesta y resolución para la multinacional.
    Términos clave: SLA, Incidencias, Soporte, Tiempos.
    
    DETALLE DE NIVELES:
    - P1 Crítico: Respuesta 15 minutos. Resolución 2 horas. (Ej: Caída total de red).
    - P2 Alto: Respuesta 1 hora. Resolución 8 horas. (Ej: Falla de servidor departamental).
    - P3 Medio: Respuesta 4 horas. Resolución 24 horas. (Ej: Problemas de software local).
    - P4 Bajo: Respuesta 8 horas. Resolución 48 horas.
    
    Canal oficial: Mesa de Ayuda (Ext 999).
    Vigencia: ${date}.`;
  }
  
  if (name.includes('inventario') || name.includes('stock') || name.includes('hardware') || name.includes('equipo')) {
    return `REPORTE TÉCNICO: INVENTARIO DE HARDWARE Y ACTIVOS TI.
    Última actualización de almacén realizada el ${date}.
    
    DISPONIBILIDAD DE EQUIPOS:
    - Laptop MacBook Pro M3 Chip: 15 unidades (Nuevas en caja).
    - Laptop Dell Latitude 7440: 22 unidades (Reacondicionadas).
    - Monitores Curvos 27": 30 unidades.
    - Kits de Teclado y Mouse: 50 unidades.
    
    UBICACIÓN: Bodega Central - Piso 4, Oficina de Activos.
    RESPONSABLE: Gestión de Inventarios TI.`;
  }
  
  if (name.includes('vpn') || name.includes('acceso') || name.includes('remoto') || name.includes('seguridad')) {
    return `MANUAL DE USUARIO: CONEXIÓN REMOTA VPN SEGURA.
    Protocolo de ciberseguridad para trabajo remoto y viajes.
    
    PASOS DE CONFIGURACIÓN:
    1. Abrir cliente Cisco AnyConnect o GlobalProtect.
    2. Ingresar portal: vpn.multinacional.com
    3. Autenticación: Usar credenciales AD + Microsoft Authenticator (MFA).
    
    POLÍTICAS:
    - Solo equipos corporativos pueden conectar.
    - Tiempo de inactividad máximo: 2 horas.
    - Bloqueo automático ante 3 intentos fallidos.`;
  }

  return `CONTENIDO INDEXADO PARA EL ARCHIVO: ${file.name}.
  Fecha de carga: ${date}.
  Este documento contiene información técnico-administrativa relevante para el área de TI.
  Para consultas específicas sobre este documento, refiérase al título completo en su pregunta.`;
};

export const agentBuilderService = {
  getFiles: async (): Promise<AgentFile[]> => {
    const stored = localStorage.getItem(STORAGE_FILES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  uploadFile: async (agentId: string, apiKey: string, file: File): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
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
      seccion_o_clausula: "Ingesta Reforzada v2.9",
      fecha_version: newFile.uploadDate,
      texto: simulateFileContent(file),
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
