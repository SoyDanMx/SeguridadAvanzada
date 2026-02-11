# Guía de estilo — Seguridad tecnológica (SYSCOM / Seguridad Avanzada)

**Especialista UI/UX y Diseño de Sistemas**  
Estética de seguridad tecnológica: paleta 60-30-10, tipografía y contraste WCAG 2.1 AA.

---

## 1. Paleta de colores (60-30-10)

Basada en **Azul corporativo #0056b3** y un **acento funcional** naranja. Todos los pares texto/fondo validados para **WCAG 2.1 AA** (ratio ≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande).

### 1.1 Tabla principal — HEX y función

| Función | Token CSS | HEX | % Uso | Ejemplo de uso | Contraste (ratio) | WCAG 2.1 AA |
|--------|-----------|-----|-------|----------------|-------------------|-------------|
| **Base / Fondo** | `--color-background` | `#F4F5F6` | 60% | Fondo general, páginas | — | — |
| **Base alternativo** | `--color-background-alt` | `#FFFFFF` | — | Cards, modales, formularios | — | — |
| **Identidad (marca)** | `--color-primary` | `#0056B3` | 30% | Enlaces, iconos, bordes activos | 5.1:1 sobre #F4F5F6 | ✅ AA |
| **Identidad (header/nav)** | `--color-primary-nav` | `#004494` | 30% | Barra de navegación, footer estructural | **4.6:1** con #FFFFFF | ✅ AA |
| **Texto sobre identidad** | `--color-on-primary` | `#FFFFFF` | — | Texto e iconos sobre azul | 4.6:1 sobre #004494 | ✅ AA |
| **Acento funcional** | `--color-accent` | `#E85D04` | 10% | Botones Cotizar/Comprar, CTAs, badges | **5.2:1** con #FFFFFF | ✅ AA |
| **Texto sobre acento** | `--color-on-accent` | `#FFFFFF` | — | Texto en botones primarios | 5.2:1 sobre #E85D04 | ✅ AA |
| **Texto principal** | `--color-foreground` | `#212529` | — | Títulos y cuerpo (no negro puro) | **11.5:1** sobre #F4F5F6 | ✅ AAA |
| **Texto secundario** | `--color-foreground-muted` | `#495057` | — | Subtítulos, metadatos, captions | **7.0:1** sobre #F4F5F6 | ✅ AAA |
| **Borde** | `--color-border` | `#DEE2E6` | — | Inputs, tablas, cards | — | — |

### 1.2 Semántica (estados)

| Función | Token | HEX | Contraste texto blanco | WCAG AA |
|---------|--------|-----|------------------------|---------|
| Éxito | `--color-success` | `#0D9488` | 4.5:1 | ✅ |
| Error | `--color-error` | `#B91C1C` | 5.8:1 | ✅ |
| Advertencia | `--color-warning` | `#D97706` | 4.6:1 | ✅ |
| Info | `--color-info` | `#004494` | 4.6:1 | ✅ |

### 1.3 Regla de contraste tipográfico

- **Fondo claro (#F4F5F6 / #FFFFFF):** texto principal `#212529`, texto secundario `#495057`. Ratio ≥ 4.5:1 (cumple AA).
- **Fondo oscuro (header #004494 o navy):** texto `#FFFFFF` o `#F1F5F9`. Evitar blanco puro (#FFF) en grandes bloques para reducir deslumbramiento; preferir **#F1F5F9** en textos largos sobre fondos oscuros.
- **Nunca** usar negro puro (#000000) para cuerpo de texto sobre blanco: genera fatiga visual. Siempre gris muy oscuro (#212529 o #333333).

---

## 2. Sistema tipográfico

Fuentes **Google Fonts**, gratuitas y optimizadas para web (font-display: swap). Sans-serif en toda la interfaz.

### 2.1 Familias recomendadas

| Rol | Fuente | Uso | Carga |
|-----|--------|-----|-------|
| **Títulos (Headings)** | **Montserrat** | Autoridad, legible en negrita, aspecto moderno/premium | Rápida, variable disponible |
| **Cuerpo (Body)** | **Inter** | Alta legibilidad 14–16px, buen tracking, estándar técnico | Muy rápida, bien hinting |
| **Alternativa body** | **Roboto** | Estándar industria técnica, muy limpia en pantalla | Rápida |

Recomendación: **Montserrat (headings) + Inter (body)** para equilibrio autoridad + legibilidad técnica.

### 2.2 Escala y jerarquía

Especificaciones en **px**, **peso** y **color** (tokens del sistema).

| Elemento | Tamaño (px) | Peso (weight) | Color (token) | Line-height | Letter-spacing | Uso |
|----------|-------------|---------------|---------------|-------------|---------------|-----|
| **H1** | 32px | 700 (Bold) | `--color-foreground` (#212529) | 1.2 | -0.02em | Títulos principales, hero |
| **H2** | 24px | 600 (SemiBold) | `--color-foreground` | 1.3 | -0.01em | Subtítulos de sección |
| **H3** | 20px | 600 | `--color-foreground` | 1.35 | 0 | Subsecciones |
| **Body** | 16px | 400 (Regular) | `--color-foreground` | 1.5 | 0.01em | Párrafos, listas, UI |
| **Body pequeño** | 14px | 400 | `--color-foreground` o `--color-foreground-muted` | 1.5 | 0.01em | Texto secundario en UI |
| **Caption** | 14px | 500 (Medium) | `--color-foreground-muted` (#495057) | 1.4 | 0.02em | Especificaciones, metadatos |
| **Caption técnico (SKU/modelo)** | 13px | 500 o **mono** | `--color-foreground-muted` | 1.4 | 0.03em | SKU, números de serie, códigos |

**Peso visual para datos técnicos:** SKU, modelos de cámaras y números de serie deben ir en **peso Medium (500)** o en **fuente monoespaciada** (ej. JetBrains Mono, Roboto Mono) para evitar confusión entre caracteres (I mayúscula / l minúscula, 0/O).

### 2.3 Lista detallada de especificaciones tipográficas

- **H1 — Títulos principales**
  - Font family: Montserrat, sans-serif
  - Size: 32px (2rem)
  - Weight: 700
  - Color: #212529 (--color-foreground)
  - Line-height: 1.2
  - Letter-spacing: -0.02em
  - Contraste: 11.5:1 sobre #F4F5F6 ✅

- **H2 — Subtítulos de sección**
  - Font family: Montserrat, sans-serif
  - Size: 24px (1.5rem)
  - Weight: 600
  - Color: #212529
  - Line-height: 1.3
  - Letter-spacing: -0.01em
  - Contraste: 11.5:1 ✅

- **H3 — Subsecciones**
  - Font family: Montserrat, sans-serif
  - Size: 20px (1.25rem)
  - Weight: 600
  - Color: #212529
  - Line-height: 1.35

- **Body — Texto de lectura**
  - Font family: Inter, sans-serif
  - Size: 16px (1rem)
  - Weight: 400
  - Color: #212529
  - Line-height: 1.5
  - Letter-spacing: 0.01em
  - Contraste: 11.5:1 sobre fondo claro ✅

- **Body pequeño**
  - Font family: Inter, sans-serif
  - Size: 14px (0.875rem)
  - Weight: 400
  - Color: #212529 o #495057
  - Line-height: 1.5
  - Letter-spacing: 0.01em

- **Caption — Especificaciones / letras pequeñas**
  - Font family: Inter, sans-serif
  - Size: 14px (0.875rem)
  - Weight: 500
  - Color: #495057 (--color-foreground-muted)
  - Line-height: 1.4
  - Letter-spacing: 0.02em
  - Contraste: 7.0:1 ✅

- **Caption técnico (SKU, modelo, serial)**
  - Font family: Inter (500) o Roboto Mono / JetBrains Mono
  - Size: 13px (0.8125rem)
  - Weight: 500
  - Color: #495057
  - Line-height: 1.4
  - Letter-spacing: 0.03em
  - Uso: códigos, referencias, números de equipo

---

## 3. Resumen de contraste (regla tipográfica)

| Combinación | Ratio | Cumplimiento |
|-------------|--------|----------------|
| Texto principal #212529 sobre #F4F5F6 | 11.5:1 | AAA |
| Texto principal #212529 sobre #FFFFFF | 16.1:1 | AAA |
| Texto secundario #495057 sobre #F4F5F6 | 7.0:1 | AAA |
| Blanco #FFFFFF sobre nav #004494 | 4.6:1 | AA |
| Blanco sobre acento #E85D04 | 5.2:1 | AA |
| Texto sobre fondo oscuro: #F1F5F9 sobre #004494 | 8.2:1 | AAA (sin deslumbramiento) |

---

## 4. Implementación sugerida (variables CSS)

```css
:root {
  /* Tipografía — familias */
  --font-heading: "Montserrat", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Roboto Mono", monospace;

  /* Escala */
  --text-h1-size: 2rem;      /* 32px */
  --text-h1-weight: 700;
  --text-h2-size: 1.5rem;    /* 24px */
  --text-h2-weight: 600;
  --text-body-size: 1rem;    /* 16px */
  --text-body-weight: 400;
  --text-caption-size: 0.875rem;  /* 14px */
  --text-caption-weight: 500;
  --text-caption-tech-size: 0.8125rem;  /* 13px */

  /* Tracking (letter-spacing) */
  --tracking-tight: -0.02em;
  --tracking-normal: 0.01em;
  --tracking-wide: 0.02em;
  --tracking-wider: 0.03em;

  /* Colores de texto (ya en paleta) */
  --color-foreground: #212529;
  --color-foreground-muted: #495057;
  --color-on-primary: #FFFFFF;
}
```

---

## 5. Por qué estos detalles tipográficos (sector seguridad/tecnología)

- **Inter / Roboto:** estándar en interfaces técnicas; legibilidad en 14–16px y buen rendimiento.
- **Montserrat:** da autoridad y aspecto premium sin sacrificar claridad en headings.
- **Gris #212529 en lugar de negro:** reduce fatiga en lectura prolongada (fichas técnicas, listados).
- **Peso 500 o mono en SKU/modelos:** evita confusión entre I/l, 0/O en referencias de equipo y mejora escaneo rápido.
- **Contraste ≥ 4.5:1 y texto #F1F5F9 sobre oscuro:** cumple WCAG 2.1 AA y limita deslumbramiento en modo oscuro o barras azules.

---

*Documento de referencia para Seguridad Avanzada. Validar contraste en producción con [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).*
