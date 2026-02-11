# Features recomendadas basadas en los repos de Urian Viera

> Análisis de:
> - [Crea-Tu-Carrito-de-Compras (PHP/MySQL)](https://github.com/urian121/Crea-Tu-Carrito-de-Compras-Tienda-Online-con-la-Magia-de-PHP-JavaScript-MySQL)
> - [Tienda Online con Svelte - Carrito en tiempo real](https://github.com/urian121/tienda-online-con-svelte-carrito-de-compras-en-tiempo-real)
>
> Para implementar en SeguridadAvanzadaShop.

---

## Resumen del repo PHP

| Aspecto | Implementación |
|---------|----------------|
| **Stack** | PHP, MySQL, JavaScript, TCPDF |
| **Productos** | Tabla `products` local (id, nameProd, precio, description_Prod) |
| **Carrito** | Tabla `pedidostemporales` con `tokenCliente` (guest cart, sin usuarios) |
| **Pedidos** | PDF generado con TCPDF al "Solicitar Pedido" |
| **Auth** | No hay tabla `users`; el header muestra "Mi Cuenta" (posible mock) |

---

## Resumen del repo Svelte (carrito en tiempo real)

| Aspecto | Implementación |
|---------|----------------|
| **Stack** | Svelte, Vite, Bootstrap, Svelte Store |
| **Productos** | JSON local (Api.svelte) |
| **Carrito** | Store `writable([])` en memoria; **100% cliente** |
| **Subtotal** | Store `derived` que se recalcula automáticamente al cambiar el carrito |
| **Pedidos** | Botón "Enviar pedido por WhatsApp" → `wa.me/{phone}?text={message}` |
| **UX** | Offcanvas lateral (como drawer) para ver el carrito sin salir de la página |

**Ideas replicables en React/Next.js:**

1. **Carrito en tiempo real:** Estado global (Context/Zustand) que reacciona al instante a add/remove.
2. **Subtotal derivado:** `useMemo` o selector de Zustand que calcula el total cuando cambia el carrito.
3. **Offcanvas/Drawer del carrito:** Panel lateral que se abre al hacer clic en el ícono del carrito, sin navegar a `/carrito`.
4. **Mensaje WhatsApp lista:** Formato `Producto - cantidad x $precio` por línea + subtotal al final.
5. **Disminuir = quitar 1 unidad:** Si cantidad > 1, reduce; si = 1, elimina el producto (línea 38–49 de `cartStore.js`).

---

## Features a implementar en SeguridadAvanzadaShop

### 1. Registro de cuentas de usuarios

**Estado actual:** Existe `/cuenta/login` (simulado con `sessionStorage`) pero **no existe** `/cuenta/registro`.

**Del repo PHP:** No hay registro real; el carrito es guest-only con `tokenCliente`.

**Recomendación para SeguridadAvanzadaShop:**

| Feature | Prioridad | Comentario |
|---------|-----------|------------|
| **Página de registro** (`/cuenta/registro`) | Alta | El login ya enlaza a ella; sin ella el flujo queda roto. |
| **Campos típicos** | — | Email, contraseña, nombre, teléfono (opcional), aceptar términos. |
| **Backend de auth** | Alta | Sin DB ni API real, el login es mock. Opciones: Supabase Auth, NextAuth, Clerk. |
| **Verificación de email** | Media | Opcional en v1; mejora confianza. |
| **Recuperar contraseña** | Media | El login enlaza a `/cuenta/recuperar`; crear página + flujo (email, token). |

**Implementación sugerida (v1):**
- Crear `app/cuenta/registro/page.tsx` con formulario (email, password, nombre).
- Añadir API `/api/auth/register` y `/api/auth/login` (o integrar Supabase/NextAuth).
- Guardar sesión en cookies o `sessionStorage` hasta tener backend real.

---

### 2. Carrito de compras

**Estado actual:** Header enlaza a `/carrito` y muestra badge "0"; **no existe página ni lógica de carrito**.

**Del repo PHP:**
- Carrito identificado por `tokenCliente` (UUID en sesión).
- Acciones: agregar, aumentar/disminuir cantidad, eliminar, limpiar.
- Modal de confirmación antes de eliminar producto.
- Tabla `pedidostemporales` con `producto_id`, `cantidad`, `tokenCliente`, `fecha`.

**Recomendación para SeguridadAvanzadaShop:**

| Feature | Prioridad | Comentario |
|---------|-----------|------------|
| **Página carrito** (`/carrito`) | Alta | Resumen de pedido, productos, cantidades, precios, total. |
| **Agregar al carrito** | Alta | Botón en detalle de producto; selector de cantidad. |
| **Aumentar/disminuir cantidad** | Alta | En la página del carrito, sin recargar. |
| **Eliminar producto** | Alta | Con modal de confirmación (como en el repo PHP). |
| **Persistencia** | Alta | `localStorage` + opcional DB si hay usuario logueado. |
| **Badge en header** | Alta | Mostrar total de ítems en tiempo real. |
| **Carrito vacío** | Media | Mensaje amigable + CTA "Continuar comprando". |
| **Offcanvas/Drawer lateral** | Media | Ver carrito sin ir a `/carrito`; al agregar producto se abre el panel (como en repo Svelte). |
| **Subtotal en tiempo real** | Alta | Valor derivado que se actualiza al cambiar cantidades (derived store / useMemo). |

**Datos del producto en carrito:** En SeguridadAvanzadaShop los productos vienen de Syscom (SKU, descripción, precioConMargenMxn). Guardar `sku`, `cantidad`, `precio` al agregar.

**Implementación sugerida (v1):**
- Context o Zustand para estado global del carrito.
- `localStorage` para persistir entre sesiones (guest).
- API opcional `/api/cart` si se usa DB para usuarios.
- Página `/carrito` con tabla/lista, controles +/- y botón "Eliminar" con modal.

---

### 3. Pedidos

**Estado actual:** No hay flujo de pedidos.

**Del repo PHP:**
- "Solicitar Pedido" genera PDF con TCPDF.
- PDF incluye: código, fecha, hora, tabla (producto, cantidad, subtotal), total.
- Usa `pedidostemporales` + `products` para el contenido.

**Recomendación para SeguridadAvanzadaShop:**

| Feature | Prioridad | Comentario |
|---------|-----------|------------|
| **Botón "Solicitar pedido"** | Alta | En la página del carrito; dispara el flujo de checkout. |
| **Resumen de pedido** | Alta | Confirmar productos, cantidades, total antes de enviar. |
| **Datos de contacto** | Alta | Nombre, email, teléfono, dirección (si se requiere). |
| **PDF del pedido** | Media | Generar PDF en servidor (ej. `@react-pdf/renderer`, `jspdf`, o lib similar). |
| **Envío por email** | Media | Opcional: enviar PDF o enlace al correo del cliente. |
| **Historial de pedidos** | Baja | Para usuarios registrados; tabla `orders` + `order_items`. |
| **WhatsApp como canal** | Alta | Ya tienes integración; "Enviar pedido por WhatsApp" con resumen. |

**Flujo sugerido (v1):**
1. Usuario en `/carrito` → "Solicitar pedido".
2. Modal o página de checkout: datos de contacto + resumen.
3. Opción A: generar PDF y descargar.
4. Opción B: abrir WhatsApp con mensaje prellenado (productos, cantidades, total) → el usuario confirma y envía.

**Implementación WhatsApp (formato del repo Svelte):**
```
¡Hola! Quiero hacer el siguiente pedido:

Producto 1 - 2 x $1,500
Producto 2 - 1 x $3,200

Subtotal: $6,200

¡Gracias!
```
- Reutilizar `buildWhatsAppMessage` del detalle de producto para el caso de un solo producto.
- Para carrito: mapear cada item a `"descripcion - cantidad x $precio"`, unir con `\n`, añadir subtotal.

---

## Esquema de datos sugerido (cuando haya DB)

```
users
  id, email, password_hash, nombre, telefono, created_at

carts (opcional si se usa localStorage para guest)
  id, user_id (nullable), token_guest, created_at, updated_at

cart_items
  id, cart_id, sku, cantidad, precio_mxn, created_at

orders
  id, user_id (nullable), email, nombre, telefono, total_mxn, estado, created_at

order_items
  id, order_id, sku, descripcion, cantidad, precio_unitario, subtotal
```

---

## Priorización de implementación

| Fase | Features |
|------|----------|
| **Fase 1** | Carrito (localStorage), página `/carrito`, agregar al carrito desde detalle, badge en header, eliminar con modal |
| **Fase 2** | Página registro, integración auth (Supabase/NextAuth), recuperar contraseña |
| **Fase 3** | Checkout (datos contacto), "Solicitar pedido" con WhatsApp y/o PDF |
| **Fase 4** | Historial de pedidos, carrito persistido en DB para usuarios |

---

## Referencias

**Repo PHP:**
- [Crea-Tu-Carrito-de-Compras (PHP/MySQL)](https://github.com/urian121/Crea-Tu-Carrito-de-Compras-Tienda-Online-con-la-Magia-de-PHP-JavaScript-MySQL)
- Tablas: `products`, `pedidostemporales`, `fotoproducts`
- Funciones clave: `addCar`, `disminuirCantidad`, `aumentarCantidad`, `borrarproductoModal`, `limpiarTodoElCarrito`
- PDF: `pdfPedido.php` con TCPDF

**Repo Svelte:**
- [Tienda Online con Svelte - Carrito en tiempo real](https://github.com/urian121/tienda-online-con-svelte-carrito-de-compras-en-tiempo-real)
- Demo: [tienda-online-con-svelte-carrito-de-compras-en-tiempo-real.vercel.app](https://tienda-online-con-svelte-carrito-de-compras-en-tiempo-real.vercel.app)
- Stores: `cartStore.js` (addToCart, removeFromCart, derived subtotal), `offcanvasStore.js`
- Componentes: `Cart.svelte`, `ListProductsCart.svelte`, `SubTotalCart.svelte`, `ApiWhatApp.svelte`
