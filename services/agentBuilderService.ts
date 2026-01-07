import { AgentFile } from '../types';

// NOTA: Reemplazar con la URL base real de la API corporativa
const BASE_URL = process.env.REACT_APP_AGENT_API_URL || 'https://api.agentbuilder.com/v1'; // Placeholder URL

export const agentBuilderService = {
  
  /**
   * Obtener archivos de un agente (GET /agents/{agentId}/files)
   */
  getFiles: async (agentId: string, apiKey: string): Promise<AgentFile[]> => {
    try {
      const response = await fetch(`${BASE_URL}/agents/${agentId}/files`, {
        method: 'GET',
        headers: {
          'x-agent-id': agentId,
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error fetching files');
      
      const json = await response.json();
      // La documentación indica { status: "success", data: [...] }
      return json.data || [];
    } catch (error) {
      console.error("Agent Builder Service Error (List):", error);
      // Retornar array vacío para no romper UI si falla la conexión
      return [];
    }
  },

  /**
   * Cargar archivo (PATCH /agents/files/:id)
   * Nota: La documentación dice /agents/files/:id pero el param es :id (ID del agente)
   */
  uploadFile: async (agentId: string, apiKey: string, file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch(`${BASE_URL}/agents/files/${agentId}`, {
        method: 'PATCH',
        headers: {
          'x-agent-id': agentId,
          'x-api-key': apiKey,
          // No setear Content-Type manualmente con FormData, el navegador lo hace (boundary)
        },
        body: formData
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Upload failed", err);
        throw new Error('Upload failed');
      }
      return true;
    } catch (error) {
      console.error("Agent Builder Service Error (Upload):", error);
      return false;
    }
  },

  /**
   * Eliminar archivos (DELETE /agents/{agentId}/files)
   */
  deleteFiles: async (agentId: string, apiKey: string, uuids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/agents/${agentId}/files`, {
        method: 'DELETE',
        headers: {
          'x-agent-id': agentId,
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uuids })
      });

      if (!response.ok) throw new Error('Delete failed');
      return true;
    } catch (error) {
      console.error("Agent Builder Service Error (Delete):", error);
      return false;
    }
  }
};
