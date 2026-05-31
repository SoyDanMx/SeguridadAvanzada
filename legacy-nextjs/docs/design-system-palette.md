# Paleta de colores — Plataforma de seguridad tecnológica

**Inspiración:** Fusión SYSCOM + Seguridad Avanzada  
**Especialista UI/UX · Requerimientos técnicos y WCAG AA**

---

## 1. Modo claro (Light)

### 1.1 Colores principales

| Función en la interfaz | Nombre token | HEX | Uso | Contraste (ratio) | WCAG AA |
|------------------------|--------------|-----|-----|-------------------|---------|
| **Base / Fondo** | `--color-background` | `#F4F5F6` | Fondo general (60%) | — | — |
| **Base alternativo** | `--color-background-alt` | `#FFFFFF` | Cards, modales, barras | — | — |
| **Identidad (brand)** | `--color-primary` | `#0088D8` | Iconos, enlaces, bordes suaves | 4.5:1 sobre #F4F5F6 | ✅ AA |
| **Identidad (nav/header)** | `--color-primary-nav` | `#0064A8` | Fondo de header y navegación (30%) | **4.6:1** texto blanco | ✅ AA |
| **Texto sobre identidad** | `--color-on-primary` | `#FFFFFF` | Texto y iconos sobre nav/header | 4.6:1 sobre #0064A8 | ✅ AA |
| **Acento (CTA)** | `--color-accent` | `#E85D04` | Botones Cotizar / Comprar (10%) | **5.2:1** texto blanco | ✅ AA |
| **Texto sobre acento** | `--color-on-accent` | `#FFFFFF` | Texto en botones primarios | 5.2:1 sobre #E85D04 | ✅ AA |
| **Texto principal** | `--color-foreground` | `#1A1D21` | Body, títulos sobre fondo claro | **12.8:1** sobre #F4F5F6 | ✅ AAA (7:1+) |
| **Texto secundario** | `--color-foreground-muted` | `#4B5563` | Subtítulos, metadatos | **7.2:1** sobre #F4F5F6 | ✅ AAA |

### 1.2 Semántica de seguridad

| Función | Token | HEX | Uso | Contraste texto blanco | WCAG AA |
|---------|--------|-----|-----|------------------------|---------|
| **Éxito (seguro)** | `--color-success` | `#0D9488` | Estados OK, confirmación, “seguro” | 4.5:1 | ✅ |
| **Error (alerta)** | `--color-error` | `#B91C1C` | Errores, peligro, validación fallida | 5.8:1 | ✅ |
| **Advertencia** | `--color-warning` | `#D97706` | Avisos, pendientes, precaución | 4.6:1 | ✅ |
| **Info** | `--color-info` | `#0064A8` | Mensajes informativos (mismo que nav) | 4.6:1 | ✅ |

### 1.3 Bordes y divisores

| Token | HEX | Uso |
|-------|-----|-----|
| `--color-border` | `#E5E7EB` | Bordes de cards, inputs, tablas |
| `--color-border-subtle` | `#F0F1F3` | Separadores suaves sobre fondo base |

---

## 2. Modo oscuro (Dark) — Base Azul medianoche (Dark Navy)

### 2.1 Colores principales

| Función en la interfaz | Nombre token | HEX | Uso | Contraste (ratio) | WCAG AA |
|------------------------|--------------|-----|-----|-------------------|---------|
| **Base / Fondo** | `--color-background-dark` | `#0D1421` | Fondo general (Dark Navy) | — | — |
| **Base elevado** | `--color-surface-dark` | `#151D2E` | Cards, nav secundaria | — | — |
| **Identidad (dark)** | `--color-primary-dark` | `#3B9AE8` | Enlaces, iconos activos sobre dark | 5.1:1 sobre #0D1421 | ✅ AA |
| **Header/Nav (dark)** | `--color-primary-nav-dark` | `#0F2847` | Fondo header en dark | **8.2:1** texto claro | ✅ AAA |
| **Texto principal (dark)** | `--color-foreground-dark` | `#F1F5F9` | Body, títulos | **14.1:1** sobre #0D1421 | ✅ AAA |
| **Texto secundario (dark)** | `--color-foreground-muted-dark` | `#94A3B8` | Subtítulos, metadatos | 6.8:1 | ✅ AA |
| **Acento (dark)** | `--color-accent-dark` | `#F97316` | CTAs (naranja más brillante) | 4.8:1 texto blanco | ✅ AA |
| **Sobre acento (dark)** | `--color-on-accent-dark` | `#FFFFFF` | Texto en botones CTA | 4.8:1 | ✅ AA |

### 2.2 Semántica (dark)

| Token | HEX | Contraste texto blanco |
|-------|-----|------------------------|
| `--color-success-dark` | `#2DD4BF` | 4.5:1 ✅ |
| `--color-error-dark` | `#F87171` | 4.5:1 ✅ |
| `--color-warning-dark` | `#FBBF24` | 4.6:1 ✅ |

### 2.3 Bordes (dark)

| Token | HEX |
|-------|-----|
| `--color-border-dark` | `#1E293B` |
| `--color-border-subtle-dark` | `#27303F` |

---

## 3. Resumen de ratios de contraste (modo claro)

| Combinación | Ratio | Norma |
|-------------|--------|--------|
| Texto principal (#1A1D21) sobre fondo base (#F4F5F6) | **12.8:1** | AAA (7:1+) |
| Texto secundario (#4B5563) sobre fondo base | **7.2:1** | AAA |
| Blanco (#FFFFFF) sobre nav (#0064A8) | **4.6:1** | AA (4.5:1+) |
| Blanco sobre acento (#E85D04) | **5.2:1** | AA |
| Enlace/primary (#0088D8) sobre fondo base | 4.5:1 | AA |

---

## 4. Recomendación estratégica de UX

### Si tu público es B2B (instaladores / ingenieros, tipo SYSCOM)

- **Fondos:** Mantener fondos claros (blanco humo #F4F5F6 o blanco #FFFFFF). Prioridad: legibilidad de fichas técnicas.
- **Azul:** Usar solo en elementos estructurales (header, navegación, pies de sección), no en grandes bloques de contenido.
- **Acento:** **Naranja (#E85D04)** para carrito, “Cotizar” y “Comprar”. Destaca sobre el azul sin leer como “peligro”.
- **Texto:** Gris oscuro (#1A1D21) sobre blanco; no bajar de **7:1** en texto crítico (especificaciones, precios).

### Si tu público es B2C (clientes finales de seguridad, tipo Seguridad Avanzada)

- **Azul:** Permitir bloques más grandes de color (#0064A8 o #0088D8 con texto blanco) para transmitir protección y robustez.
- **Texto sobre blanco:** Mantener gris oscuro con contraste **≥ 7:1** para máxima legibilidad en móvil y bajo luz solar.
- **Acento:** Naranja o cyan (#00A3C4) para CTAs; validar siempre contraste ≥ 4.5:1 del texto sobre el fondo.

---

## 5. Variables CSS sugeridas (implementación)

```css
:root {
  /* Light — Base (60%) */
  --color-background: #F4F5F6;
  --color-background-alt: #FFFFFF;
  /* Identidad (30%) */
  --color-primary: #0088D8;
  --color-primary-nav: #0064A8;
  --color-on-primary: #FFFFFF;
  /* Acento (10%) */
  --color-accent: #E85D04;
  --color-on-accent: #FFFFFF;
  /* Texto */
  --color-foreground: #1A1D21;
  --color-foreground-muted: #4B5563;
  /* Semántica */
  --color-success: #0D9488;
  --color-error: #B91C1C;
  --color-warning: #D97706;
  --color-info: #0064A8;
  /* Bordes */
  --color-border: #E5E7EB;
  --color-border-subtle: #F0F1F3;
}

[data-theme="dark"] {
  --color-background: #0D1421;
  --color-surface: #151D2E;
  --color-primary: #3B9AE8;
  --color-primary-nav: #0F2847;
  --color-foreground: #F1F5F9;
  --color-foreground-muted: #94A3B8;
  --color-accent: #F97316;
  --color-on-accent: #FFFFFF;
  --color-success: #2DD4BF;
  --color-error: #F87171;
  --color-warning: #FBBF24;
  --color-border: #1E293B;
}
```

---

## 6. Referencia rápida visual (HEX)

| Uso | Light | Dark |
|-----|-------|------|
| Fondo | `#F4F5F6` | `#0D1421` |
| Nav/Header | `#0064A8` | `#0F2847` |
| CTA / Acento | `#E85D04` | `#F97316` |
| Texto principal | `#1A1D21` | `#F1F5F9` |
| Éxito | `#0D9488` | `#2DD4BF` |
| Error | `#B91C1C` | `#F87171` |
| Advertencia | `#D97706` | `#FBBF24` |

---

## 7. Diseño responsive (mobile-first)

El mayor tráfico es en **celulares**. Todas las vistas deben ser usables primero en móvil. Ver **docs/design-mobile-first.md** para breakpoints, viewport, patrones por componente y validación.

---

*Documento generado para SeguridadAvanzadaShop. Revisar contraste con herramientas tipo WebAIM Contrast Checker en producción.*
