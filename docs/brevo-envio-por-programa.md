# Cómo mandar cada newsletter a su programa desde Brevo

Guía para el equipo de Cerrame la Ocho. Contexto: el sitio guarda **una sola lista** de
contactos y, sobre cada contacto, **tres atributos de tipo Sí/No** — uno por programa.
Los segmentos que ya están creados leen esos atributos.

| Programa | Atributo en Brevo | Segmento |
|---|---|---|
| Cerrame la Ocho | `PROG_CERRAME_LA_8` | Cerrame la Ocho (#2) |
| Late Check Out | `PROG_LATE_CHECK_OUT` | Late Check Out (#1) |
| No Compres Humo | `PROG_NO_COMPRES_HUMO` | No Compres Humo (#3) |

---

## Antes de empezar: revisar que los segmentos filtren bien

Contactos → Segmentos → clic en el nombre del segmento → ver el filtro.

Cada uno tiene que decir exactamente: **`PROG_XXX` es igual a `Sí` (true)**.

Si un segmento está filtrando por otra cosa (o por la lista entera), corregirlo acá.
Es el paso que hace que todo lo demás funcione.

---

## Opción A — Envío puntual (lo normal, para cada edición del newsletter)

Es lo que van a usar el 95% de las veces.

1. **Marketing → Campañas de email → Crear una campaña**
2. Cargar asunto, remitente y diseño como siempre.
3. En el paso **Destinatarios**, no elegir una Lista. Cambiar a la pestaña /
   desplegable **Segmentos** y seleccionar el segmento del programa (ej. *Late Check Out*).
4. Brevo muestra abajo cuántos contactos van a recibirlo. Ese número tiene que
   coincidir con lo que espera el segmento.
5. Enviar o programar.

Repetir para cada programa con su segmento y su contenido.

> Si una persona eligió dos programas, aparece en los dos segmentos y va a recibir
> los dos newsletters. Es el comportamiento buscado.

---

## Opción B — Envío automático (que salga solo cuando alguien se anota)

Sirve para un email de bienvenida por programa, o para una secuencia.

1. **Automatizaciones → Crear una automatización → Empezar desde cero**
2. **Punto de entrada: "Un contacto actualiza un atributo"**, apuntando al atributo
   del programa (ej. `PROG_LATE_CHECK_OUT`).

   ⚠️ **No usar "El contacto se suscribe a una lista".** Cuando alguien deja el mail
   en el sitio, la suscripción entra primero y la elección de programas llega
   *después*, cuando completa el formulario del modal. Si el disparador es la
   suscripción, el email sale antes de que Brevo sepa qué programas eligió.

   *Alternativa si el punto de entrada por atributo no aparece en el plan:* usar
   "Se suscribe a la lista" + un paso de **Esperar 1 hora** + la condición del punto 3.

3. Agregar un paso **Condición**: *si `PROG_LATE_CHECK_OUT` es igual a `Sí`*.
4. En la rama del "sí", paso **Enviar un email**.
5. Activar.

Son **tres automatizaciones**, una por programa. (O una sola con tres ramas
condicionales, si prefieren tenerlo todo junto.)

---

## ⚠️ Lo primero: el tope de 300 mails por día

La cuenta está en **plan gratuito: 300 emails por día**. Los tres segmentos tienen
hoy ~285 contactos cada uno, así que **una sola campaña ya consume casi todo el cupo
diario**, y mandar los tres newsletters en la misma jornada es imposible.

Opciones:

- **Escalonar:** un programa por día (lunes Cerrame la Ocho, martes Late Check Out,
  miércoles No Compres Humo).
- **Pasar a un plan pago** si quieren mandar los tres el mismo día.

Conviene decidir esto antes de armar la primera campaña, porque si el envío pasa
el tope Brevo lo corta a la mitad y quedan contactos sin recibirlo.

---

## Por qué hoy los tres segmentos tienen casi la misma gente

Los números (285 / 284 / 286) no son un error de los segmentos. Vienen de una
migración hecha a mano el 18/08/2026: se tomó la lista histórica de Cerrame la Ocho
y se marcó a **todos** los contactos existentes en los **tres** programas, para que
la gente que ya venía suscrita no se perdiera los newsletters nuevos.

**Esos contactos se quedan como están.** Fue la decisión tomada: nadie que ya estaba
pierde nada.

**Lo que cambia es de acá en adelante.** El sitio ya no marca ningún programa al
momento del alta: quien deja su email entra a la lista *sin* programas, y elige en
el formulario que aparece después. El formulario ahora arranca con las tres casillas
**vacías** y no deja enviar sin marcar al menos una.

Consecuencia a tener en cuenta: **quien cierre ese formulario sin completarlo queda
suscrito a la lista pero en ningún segmento, y por lo tanto no recibe nada.** Es el
precio de que la elección sea real. Si con el tiempo se ve que mucha gente cierra el
formulario, hay dos salidas: mandarles un email pidiéndoles que elijan, o volver a
marcar los tres por defecto (es un cambio de una línea).

Por eso los segmentos no van a achicarse — van a dejar de crecer indiscriminadamente.

---

## Chequeo rápido si algo no sale

- **El segmento da 0 contactos** → los atributos no existen o se llaman distinto.
  Verificar en Contactos → Configuración → Atributos que estén los tres
  `PROG_*` como tipo **Booleano (Sí/No)**.
- **Llega a gente que no eligió ese programa** → son contactos de la migración del
  18/08/2026, que quedaron marcados en los tres a propósito.
- **La campaña se cortó por la mitad** → se pasó el tope de 300 mails diarios.
  Esperar al día siguiente y escalonar los envíos.
- **La automatización no dispara** → revisar que esté **activada** (no en borrador)
  y que el punto de entrada sea el atributo, no la suscripción.
