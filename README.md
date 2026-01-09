
# Nara IT Management System - Guía de Toma de Control (v3.7.0)

Este documento certifica la entrega técnica del asistente virtual Nara.

## 1. Quick Start para Administradores
1.  **Validación de Red**: Asegurar acceso a `https://plai-api-core.cencosud.ai`.
2.  **Configuración de Bóveda**: Inyectar `AGENT_ID` y `API_KEY` en el entorno.
3.  **Despliegue**: Ejecutar `Nara_Master_v3.7.0.ps1` en PowerShell con permisos de administrador.

## 2. Puntos Críticos de Control
- **Autenticación**: Protocolo basado en Custom Headers (Plai Standard).
- **Base de Datos**: PGVector para almacenamiento de embeddings semánticos.
- **Seguridad**: Los tokens nunca deben persistirse en texto plano en el código fuente.

## 3. Contacto y Soporte
- **Área**: Cencosud AI / Arquitectura TI.
- **Versión**: 3.7.0 Stable Handover.

---
*Certificado de Traspaso Técnico v3.7.0 - 2024*
