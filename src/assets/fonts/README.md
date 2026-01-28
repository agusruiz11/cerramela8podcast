# Fuentes locales

Poné acá los archivos de fuentes (`.woff2`, `.woff`, `.ttf`, `.otf`).

**Estructura recomendada:** una subcarpeta por familia, por ejemplo:

```
fonts/
  Thunder/
    Thunder-Bold.woff2
    Thunder-ExtraBold.woff2
  OtraFuente/
    OtraFuente-Regular.woff2
```

O todo en `fonts/` si tenés pocos archivos.

Las declaraciones `@font-face` van en **`src/index.css`** (arriba, antes de `@tailwind`).
