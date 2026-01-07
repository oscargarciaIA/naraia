# Nara - Asistente Virtual TI Corporativo

Este proyecto implementa un asistente virtual seguro utilizando React para el frontend y una base de datos PostgreSQL vectorizada (pgvector) contenerizada para el cumplimiento de auditoría y RAG.

## Requisitos Previos

1.  **Docker Desktop** instalado y corriendo (WSL2 configurado en Windows).
2.  **Node.js** (v18 o superior).
3.  Una **API Key de Google Gemini**.

## Guía de Inicio Paso a Paso

### 1. Levantar la Infraestructura (Base de Datos)

La base de datos se encarga de almacenar los logs de auditoría (cumplimiento ISO 27001) y los vectores de conocimiento.

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
docker-compose up -d
```

*Verificación:* Ejecuta `docker ps`. Deberías ver dos contenedores activos: `nara_enterprise_db` y `nara_log_auditor`.

### 2. Iniciar la Aplicación Web (Frontend)

En una **nueva** terminal, instala las dependencias y arranca el servidor de desarrollo:

```bash
npm install
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

### 3. Configuración Inicial

1.  Al abrir la app, verás un indicador de "API Key requerida".
2.  Haz clic en el icono de **Engranaje** (Configuración).
3.  Ingresa tu **Gemini API Key**.
    *   *Nota: En un entorno de producción real, esta clave se inyectaría mediante variables de entorno del servidor (CI/CD) y no se pediría al usuario, cumpliendo con las políticas de seguridad.*
4.  (Opcional) Ingresa un ID de Agente ficticio para simular la conexión "Corporativa".

## Arquitectura de Seguridad

*   **Auditoría**: Cada interacción se registra en la tabla `audit.interaction_logs` dentro de Postgres.
*   **RBAC**: Se crean roles de base de datos separados (`auditor_sec`, `nara_app_user`) automáticamente al iniciar el contenedor.
*   **RAG**: Utiliza `pgvector` para búsquedas semánticas sobre documentos corporativos.
