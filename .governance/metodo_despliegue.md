# Método de Despliegue Activo

> **Fecha de decisión:** 2026-03-17  
> **Versión:** 1.0  
> **Estado:** ✅ Activo

---

## Decisión

Este proyecto usa **despliegue directo con Wrangler desde terminal** como método principal de despliegue.

---

## Agente Responsable

| Campo | Valor |
|-------|-------|
| **Agente de despliegue** | `cloudflare-wrangler-deploy` |
| **Ubicación** | `.agents/ejecutores/cloudflare-wrangler-deploy.md` |
| **Método** | Despliegue directo desde terminal, shell o GitHub Codespaces |
| **Comando principal** | `wrangler deploy` |
| **Autenticación** | `wrangler login` (interactivo) |

---

## Método No Utilizado

| Campo | Valor |
|-------|-------|
| **CI/CD con GitHub Actions** | Documentado para referencia futura |
| **Agente correspondiente** | `cloudflare-wrangler-actions` |
| **Ubicación** | `.agents/ejecutores/cloudflare-wrangler-actions.md` |
| **Estado** | ✅ Disponible (no activo en este proyecto) |

---

## Flujo de Despliegue Activo

```bash
# 1. Verificar autenticación
npx wrangler whoami

# 2. Autenticar (si es necesario)
npx wrangler login

# 3. Desplegar
npx wrangler deploy

# 4. Desplegar a entorno específico
npx wrangler deploy --env dev
npx wrangler deploy --env production

# 5. Verificar despliegue
npx wrangler tail
npx wrangler status
```

---

## Gestión de Secrets

| Entorno | Método | Comando |
|---------|--------|---------|
| **Producción** | `wrangler secret put` | `wrangler secret put SECRET_NAME` |
| **Desarrollo (Codespaces)** | GitHub Codespaces Secrets | Se inyectan automáticamente |
| **Desarrollo (local)** | `.dev.vars` (no versionado) | Manual |

---

## Referencias de Gobernanza

| Documento | Propósito |
|-----------|-----------|
| [`inventario_recursos.md`](inventario_recursos.md) | Sección 5 — Wrangler y Despliegue |
| [`reglas_proyecto.md`](reglas_proyecto.md) | R8 — Configuración de despliegue |
| [`AUTENTICACION.md`](AUTENTICACION.md) | Flujo de autenticación con Cloudflare |
| [`cloudflare-wrangler-deploy.md`](../.agents/ejecutores/cloudflare-wrangler-deploy.md) | Agente de despliegue directo |
| [`cloudflare-wrangler-actions.md`](../.agents/ejecutores/cloudflare-wrangler-actions.md) | Agente de CI/CD (referencia) |

---

## Historial de Cambios

| Fecha | Cambio | Responsable | Aprobado Por |
|-------|--------|-------------|--------------|
| 2026-03-17 | Creación del documento: separación de agentes wrangler-actions y wrangler-deploy | Orquestador | Usuario |

---

> **Nota:** Este documento debe actualizarse si el método de despliegue cambia en el futuro.
