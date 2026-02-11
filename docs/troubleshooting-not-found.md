# Guía: NOT_FOUND (404) en Vercel

Referencia: [Vercel NOT_FOUND](https://vercel.com/docs/errors/NOT_FOUND)

---

## 1. Sugerencias de corrección

### A. Verificar configuración del proyecto en Vercel

En **Project → Settings → General**:

| Configuración | Valor esperado |
|---------------|----------------|
| **Framework Preset** | Next.js |
| **Root Directory** | `.` (vacío si el repo es la raíz) |
| **Build Command** | `next build` o vacío (auto) |
| **Output Directory** | vacío (Next.js usa `.next`) |
| **Install Command** | `npm install` o vacío |

**Nota**: Si Vercel detecta el proyecto como "Other" en lugar de Next.js, servirá archivos estáticos y la raíz `/` devolverá 404. Para evitarlo, el repo incluye `vercel.json` con `"framework": "nextjs"` y `"buildCommand": "next build"` para forzar la detección correcta.

### B. Si el 404 es en la página principal (`/`)

1. **Revisar el último deployment**: Deployments → el más reciente debe estar **Ready**.
2. **Comprobar el dominio**: Asegúrate de usar la URL correcta:
   - Producción: `https://seguridad-avanzada.vercel.app`
   - Preview: `https://seguridad-avanzada-xxx.vercel.app`
3. **Redeploy**: Si el build falló antes, haz un nuevo deploy tras subir los cambios.

### C. Si el 404 es en una ruta específica

- **Rutas dinámicas** (`/productos/[sku]`, `/productos/categoria/[slug]`): Si el slug no existe, `notFound()` devuelve 404 (esperado).
- **Assets** (`/favicon.ico`, `/images/...`): Deben estar en `public/` para servirse estáticamente.

### D. Archivos que ya tienes para evitar 404s

- `public/favicon.ico` — favicon
- `app/icon.png` — icono para App Router
- `app/not-found.tsx` — página 404 personalizada
- `metadata.icons` en `app/layout.tsx`

---

## 2. Causa raíz

### ¿Qué hace el código vs. qué debería hacer?

- **Next.js** genera rutas desde `app/` y sirve archivos estáticos desde `public/`.
- **Vercel** ejecuta el build y expone el output en su CDN.
- El 404 indica que Vercel no encuentra el recurso solicitado.

### ¿Qué condiciones disparan el error?

1. **URL incorrecta**: Ruta que no existe o typo.
2. **Deployment fallido**: Build con error o output incompleto.
3. **Dominio equivocado**: Uso de preview en lugar de producción o viceversa.
4. **Ruta dinámica sin coincidencia**: Ej. `/productos/categoria/xyz` cuando `xyz` no está en `generateStaticParams` y no hay fallback dinámico.

### Posibles malentendidos

- Confundir **Preview** con **Production** en Vercel.
- Asumir que el deployment está listo cuando aún está en **Building**.
- Creer que rutas dinámicas sin `generateStaticParams` se generan automáticamente (en SSG sí hace falta definirlas).

---

## 3. Concepto: ¿por qué existe el 404?

### Propósito

- El 404 indica que el recurso no existe.
- Evita exponer rutas internas o datos sensibles.
- Es convención HTTP estándar (RFC 7231).

### Modelo mental

```
Request → Vercel CDN → ¿Existe ruta/archivo? → 200 OK o 404 NOT_FOUND
```

En Next.js:

- **Rutas en `app/`** → páginas (y API routes en `app/api/`).
- **Archivos en `public/`** → servidos en `/`.
- **Rutas dinámicas** → `/productos/[sku]` coincide con `/productos/ABC123`, etc.

### Contexto en el framework

- Next.js usa el sistema de archivos para definir rutas.
- Vercel usa el output de `next build` para servir la app.
- Si el build no genera una ruta o hay un error de configuración, Vercel devuelve 404.

---

## 4. Señales de alerta

### Qué vigilar

- **Build incompleto**: Mensajes de error en Vercel durante el build.
- **Root Directory mal configurado**: Si el proyecto está en un subfolder.
- **Output Directory custom**: Puede chocar con Next.js.
- **Dominio no configurado**: DNS o alias incorrectos.

### Errores similares

- **500 INTERNAL_SERVER_ERROR**: Fallo en el servidor (p. ej. middleware).
- **403 FORBIDDEN**: Sin permisos.
- **502 BAD_GATEWAY**: Timeout o fallo en la función.

### Patrones sospechosos

- Cambios recientes en `next.config.ts` o `vercel.json`.
- Nuevas rutas dinámicas sin `generateStaticParams` o `dynamicParams`.
- Assets referenciados con rutas incorrectas (ej. `/images/x` cuando el archivo está en otro sitio).

---

## 5. Alternativas y trade-offs

### Opción A: Usar solo Production

- **Ventaja**: Una sola URL estable.
- **Desventaja**: No pruebas antes de producción.

### Opción B: Preview + Production

- **Ventaja**: Probar cada PR antes de merge.
- **Desventaja**: Varias URLs (preview vs producción).

### Opción C: `output: 'export'` (static export)

- **Ventaja**: Despliegue muy simple, solo archivos estáticos.
- **Desventaja**: No hay SSR, API routes ni middleware.

### Opción D: Fallback en rutas dinámicas

```ts
// app/productos/categoria/[slug]/page.tsx
export const dynamicParams = true; // Permite slugs no pre-generados
```

- **Ventaja**: Rutas no pre-generadas se pueden servir en runtime.
- **Desventaja**: Más carga en el servidor y posible tardanza en la primera visita.

---

## Checklist rápido

- [ ] Último deployment en estado **Ready**
- [ ] URL correcta (production o preview)
- [ ] Framework Preset = Next.js
- [ ] Root Directory correcto
- [ ] Build sin errores en los logs
- [ ] `public/favicon.ico` y `app/icon.png` presentes
- [ ] `app/not-found.tsx` para 404s personalizados
