
# Nara - IT Virtual Management System (Punto de Control v3.6.0)

Este es el **Punto de Control Maestro v3.6.0**. Representa la versión estable certificada para despliegue productivo y entrega oficial al área de infraestructura.

## Arquitectura de Referencia
- **Motor de IA**: Plai Core Neural Engine (Cencosud AI).
- **Protocolo de Seguridad**: Autenticación por Headers dinámicos (`x-agent-id`, `x-api-key`).
- **Persistencia Vectorial**: PGVector v16 sobre PostgreSQL.
- **Frontend**: React 19 + Tailwind CSS (High-End Enterprise UI).

## Notas de Autenticación
Esta versión implementa el protocolo de enlace estricto con el endpoint central de Plai. Cualquier error de autenticación debe ser validado contra la política de CORS y la vigencia de los tokens en la bóveda de seguridad corporativa.

---
*Área de TI - Multinacional - Rama de Producción v3.6.0 - 2024*
