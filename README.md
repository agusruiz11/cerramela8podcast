# Cerrame la 8 – Sitio web

Landing del podcast Cerrame la 8 (React + Vite), desplegado en Vercel.

## Newsletter con Brevo

La suscripción usa **Brevo** por defecto. El backend serverless (`/api/newsletter/*`) mantiene la API key en el servidor; el frontend solo envía email.

### Variables de entorno (Vercel)

Configurarlas en **Vercel → Project → Settings → Environment Variables** (o en `.env` local con `vercel dev`).  
**No subas ni compartas la API key.**

| Variable | Descripción |
|----------|-------------|
| `NEWSLETTER_PROVIDER` | `brevo` (por defecto). Kit comentado |
| `BREVO_API_KEY` | API key de Brevo (app.brevo.com → SMTP & API) |
| `BREVO_LIST_ID` | ID de la lista de contactos en Brevo |
| `BREVO_ATTR_JOB_TITLE` | (opcional) Atributo para ocupación. Por defecto: JOB_TITLE |
| `BREVO_ATTR_COUNTRY` | (opcional) Atributo para país. Por defecto: COUNTRY |

### Cambiar de Brevo a Kit (comentado)

1. En `.env` / Vercel: `NEWSLETTER_PROVIDER=kit`
2. Definir `KIT_API_KEY` y `KIT_FORM_ID`
3. En `api/newsletter/subscribe.js` y `api/newsletter/profile.js`, descomentar Kit y comentar Brevo

### Probar en local

Las rutas `/api/newsletter/subscribe` y `/api/newsletter/profile` **no existen** con `npm run dev` (solo Vite). Para que funcione:

1. Instalá Vercel CLI: `npm i -g vercel` (o `npx vercel`)
2. En `.env` agregá `BREVO_API_KEY` y `BREVO_LIST_ID`
3. Ejecutá **`npm run dev:api`** o **`vercel dev`** en lugar de `npm run dev`

Alternativa: si ya tenés deploy en Vercel, podés usar `VITE_API_PROXY=https://tu-app.vercel.app` y `npm run dev` para que las peticiones /api vayan al deploy.

### Probar endpoints con curl

Reemplazá `https://tu-dominio.vercel.app` por la URL del preview o producción.

**Suscripción:**

```bash
curl -X POST https://tu-dominio.vercel.app/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Perfil (job, country) - Brevo usa email:**

```bash
curl -X PUT https://tu-dominio.vercel.app/api/newsletter/profile \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","job":"empresario","country":"Argentina"}'
```

### Anti-spam

- **Honeypot:** campo oculto `website`; si viene con valor, se rechaza (bots suelen completarlo)
- **Rate limit:** 3 solicitudes por minuto por IP

## Stack

- React 18, Vite 4
- Tailwind CSS, Framer Motion, Radix UI
- Backend: Vercel Serverless Functions en `/api/newsletter`
