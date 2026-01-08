
# Nara - IT Virtual Assistant (v2.0.0 Stable)

Este es el **Punto de Control Maestro v2.0**. Se han eliminado todas las configuraciones de emergencia previas para establecer una base limpia y escalable.

## Especificaciones de Infraestructura
- **Motor de IA**: Gemini 3 Pro (Core v2.0).
- **Base de Datos**: PostgreSQL 16 con extensión pgvector para memoria semántica.
- **Red**: `nara_network` (aislada y segura).
- **Despliegue**: Docker Compose con persistencia de volúmenes.

## Protocolo de Control
El script `Nara_Control_v2.0.ps1` ubicado en el SetupView es el único procedimiento autorizado para la reconstrucción del entorno, garantizando la liberación de puertos y la limpieza de procesos huérfanos.

---
*Área de TI - Confidencial - Versión de Producción*
