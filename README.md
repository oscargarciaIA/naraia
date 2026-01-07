
# Nara - Knowledge Hub de Contratos (v1.3.1)

Nara ha sido evolucionada para servir como el punto central de consulta de **Contratos y Base de Conocimiento de Negocio**.

## Infraestructura Vectorial (pgvector)
A diferencia de una base de datos tradicional, pgvector permite realizar **búsquedas semánticas**. Esto significa que Nara entiende el *sentido* de una cláusula contractual, no solo palabras clave.

### Capacidades de Negocio
- **Ingesta de Contratos**: Almacenamiento indexado de PDFs y documentos legales procesados.
- **Consultas de SLA**: Respuesta inmediata sobre niveles de servicio acordados con proveedores.
- **Cumplimiento ISO 27001**: Los datos están aislados en una red Docker privada, sin exposición a la red pública.

## Despliegue del Esquema Contractual
1. Ejecuta el script `sync_v1.3.1.ps1`.
2. Se generará `db/init/01_init_contracts.sql` con la tabla `nara_contracts_knowledge`.
3. Al iniciar Docker (`docker-compose up -d`), PostgreSQL creará automáticamente esta estructura preparada para IA.

---
*Área de TI / Auditoría de Negocios - Entorno Seguro Multinacional*
