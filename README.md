# Cerrame la 8 – Sitio web

Landing del podcast Cerrame la 8 (React + Vite), desplegado en Vercel.

## Newsletter con Brevo (Sendinblue)

La suscripción y el perfil post-suscripción se gestionan con **Brevo**. Si no se configuran las variables de entorno, el backend responde `{ ok: true }` sin llamar a Brevo (modo mock, útil para previews).

### Variables de entorno (Vercel)

Configurarlas en **Vercel → Project → Settings → Environment Variables** (o en `.env` local si usás `vercel dev`).  
**No subas ni compartas la API key**: no ponerla en el repo, en el frontend ni en chats.

| Variable        | Descripción                                      |
|----------------|---------------------------------------------------|
| `BREVO_API_KEY` | API key de Brevo (Settings → API Keys).          |
| `BREVO_LIST_ID` | ID numérico de la lista de suscriptores en Brevo. |

### Anti-spam (suscripción)

El endpoint `/api/subscribe` incluye:

- **Honeypot:** campo oculto `website`; si viene con valor, se rechaza la petición (bots suelen completarlo).
- **Rate limit:** 3 solicitudes por minuto por IP (in-memory en serverless; best-effort por instancia).
- **reCAPTCHA v3 (opcional):** si configurás las claves, se exige y se verifica el token antes de suscribir.

Para activar reCAPTCHA v3 (invisible):

1. Creá un sitio reCAPTCHA v3 en [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin).
2. En **Vercel** (backend): `RECAPTCHA_SECRET_KEY` = clave secreta.
3. En **Vite** (frontend): en `.env` o `.env.local` definí `VITE_RECAPTCHA_SITE_KEY` = clave del sitio (pública).  
   Si no definís `VITE_RECAPTCHA_SITE_KEY`, el front no envía token y el backend no verifica; si solo definís `RECAPTCHA_SECRET_KEY`, el backend rechazará por falta de token. Conviene usar ambas o ninguna.

- En el modal “Queremos conocerte más” se guardan **ocupación** y **país** como atributos del contacto. Por defecto el backend usa los nombres de Brevo **JOB_TITLE** y **COUNTRY** (crear esos atributos en Contacts → Settings → Contact attributes si no existen).
- Si en tu cuenta usás otros nombres, podés definir env vars: `BREVO_ATTR_JOB_TITLE` y `BREVO_ATTR_COUNTRY`.

### Pruebas rápidas con curl

Reemplazá `https://tu-dominio.vercel.app` por la URL del preview o producción.

**Suscripción (solo email):**

```bash
curl -X POST https://tu-dominio.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Opcional: `source` (ej. `"cta"` o `"hablemos"`).

**Perfil (atributos del contacto):**

```bash
curl -X POST https://tu-dominio.vercel.app/api/profile \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","ocupacion":"estudiante","pais":"Argentina"}'
```

**Verificación en Brevo:**

- El contacto debe aparecer en la lista configurada con `BREVO_LIST_ID`.
- Después de llamar a `/api/profile`, en el contacto deben verse **JOB_TITLE** (ocupación) y **COUNTRY** (país).

## Desarrollo

- **Probar suscripción en local:** las rutas `/api/subscribe` y `/api/profile` solo existen en Vercel. Con `npm run dev` (Vite) obtendrás **404** al enviar el formulario. Para que funcione en local:
  1. Instalá Vercel CLI: `npm i -g vercel` (o usá `npx vercel`).
  2. En la raíz del proyecto creá `.env` con `BREVO_API_KEY` y `BREVO_LIST_ID`.
  3. Ejecutá **`vercel dev`** en lugar de `npm run dev`. Así se sirven el front y las funciones `/api` y se cargan las variables de `.env`.
- `npm run dev` – solo front (Vite); las APIs no están disponibles.
- `npm run build` – build de producción.
- `npm run preview` – vista previa del build (Vite); las APIs no están disponibles.

## Stack

- React 18, Vite 4
- Tailwind CSS, Framer Motion, Radix UI
- Backend: Vercel Serverless Functions en `/api` (subscribe, profile)
