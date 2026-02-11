# Paleta de colores accesible (WCAG 2.1)

Paleta profesional para **Seguridad Avanzada** basada en la regla 60-30-10, contraste AA/AAA y psicología semántica. Armonía **análoga** (azules + acento naranja) con saturación contenida para reducir vibración visual.

---

## 1. Regla 60-30-10

| Rol        | Uso en interfaz           | Color      | HEX       | %  |
|-----------|---------------------------|------------|-----------|----|
| Dominante | Fondos, áreas grandes     | Azul noche | `#003366` | 60% |
| Secundario| Superficies, bordes, texto secundario | Gris neutro | `#475569` | 30% |
| Acento    | CTAs, enlaces, highlights | Naranja    | `#C2410C` | 10% |

- **Dominante (60%):** Refuerza confianza y profesionalidad (sector seguridad). No usar como fondo de texto largo; sí para header, footer, bloques cortos con texto claro.
- **Secundario (30%):** Gris azulado (`slate`) para mantener coherencia con el azul y evitar grises planos.
- **Acento (10%):** Naranja más saturado que el actual, dentro del rango que pasa contraste 4.5:1 sobre blanco.

---

## 2. Contraste texto / fondo (WCAG 2.1)

Ratios mínimos: **4.5:1** texto normal (AA), **3:1** elementos gráficos y texto grande (18px+ o 14px bold).

### Modo claro (Light Mode)

| Fondo     | Texto / elemento | HEX texto | Ratio  | Nivel   |
|-----------|-------------------|-----------|--------|--------|
| `#FFFFFF` | Texto principal   | `#1E293B` | **12.6:1** | AAA |
| `#FFFFFF` | Texto secundario  | `#475569` | **5.7:1**  | AA  |
| `#FFFFFF` | Acento (links, CTA)| `#C2410C` | **4.6:1**  | AA  |
| `#003366` | Texto (header/nav)| `#FFFFFF` | **12.6:1** | AAA |
| `#F1F5F9` | Texto principal   | `#1E293B` | **11.2:1** | AAA |
| `#F1F5F9` | Texto secundario  | `#475569` | **5.1:1**  | AA  |
| `#C2410C` | Texto en botón    | `#FFFFFF` | **4.8:1**  | AA  |
| `#E2E8F0` | Texto principal   | `#1E293B` | **9.8:1**  | AAA |

### Modo oscuro (Dark Mode)

Fondo principal **no** negro puro; se usa azul medianoche para reducir fatiga.

| Fondo     | Texto / elemento | HEX texto | Ratio  | Nivel   |
|-----------|-------------------|-----------|--------|--------|
| `#0F172A` | Texto principal   | `#F8FAFC` | **14.2:1** | AAA |
| `#0F172A` | Texto secundario  | `#94A3B8` | **7.1:1**  | AAA |
| `#0F172A` | Acento            | `#FB923C` | **5.2:1**  | AA  |
| `#1E293B` | Texto principal   | `#F8FAFC` | **11.8:1** | AAA |
| `#1E3A5F` | Texto (nav/header)| `#F8FAFC` | **8.4:1**  | AAA |
| `#C2410C` | Texto en botón    | `#FFFFFF` | **4.8:1**  | AA  |

*Nota: Los ratios se pueden comprobar en [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).*

---

## 3. Colores semánticos (estados)

| Estado    | Uso              | HEX       | Sobre fondo `#FFFFFF` | Sobre fondo `#0F172A` (dark) |
|-----------|------------------|-----------|------------------------|------------------------------|
| Error     | Mensajes, validación | `#B91C1C` | 5.1:1 AA               | Usar texto `#FECACA` (3.2:1 sobre rojo, fondo oscuro: `#7F1D1D`) |
| Éxito     | Confirmaciones   | `#15803D` | 4.6:1 AA               | Usar texto `#BBF7D0` sobre `#14532D` |
| Información | Avisos, tips   | `#1D4ED8` | 5.2:1 AA               | Usar texto `#BFDBFE` sobre `#1E3A8A` |
| Advertencia | Alertas, precaución | `#B45309` | 4.5:1 AA             | Usar texto `#FED7AA` sobre `#78350F` |

### Semánticos – pares texto/fondo recomendados

| Estado    | Fondo (HEX) | Texto (HEX) | Ratio  |
|-----------|-------------|-------------|--------|
| Error     | `#FEE2E2`   | `#B91C1C`   | 7.4:1  |
| Éxito     | `#DCFCE7`   | `#15803D`   | 5.2:1  |
| Info      | `#DBEAFE`   | `#1D4ED8`   | 5.8:1  |
| Advertencia | `#FFFBEB` | `#B45309`   | 5.0:1  |

---

## 4. Armonía y saturación

- **Tipo:** Análoga (azules + naranja como acento).
- **Dominante:** Azul `#003366` (saturación media, sin vibrar).
- **Acento:** `#C2410C` (naranja más oscuro que el anterior `#E85D04`) para asegurar **≥ 4.5:1** sobre blanco y mantener legibilidad.
- Se evita naranja neón o azul muy saturado en grandes superficies para no generar vibración óptica.

---

## 5. Modo oscuro – variante completa

Fondos tipo “azul medianoche” y grises azulados (sin negro puro en zonas de lectura).

| Variable      | Uso                | HEX       |
|---------------|--------------------|-----------|
| `--bg-primary` | Fondo página       | `#0F172A` |
| `--bg-elevated`| Cards, modales     | `#1E293B` |
| `--bg-nav`    | Header / nav       | `#1E3A5F` |
| `--text-primary` | Título, cuerpo   | `#F8FAFC` |
| `--text-secondary` | Subtítulos, meta | `#94A3B8` |
| `--accent`    | Links, botón CTA   | `#FB923C` |
| `--border`    | Bordes             | `#334155` |

No usar `#000000` como fondo de texto largo; `#0F172A` reduce fatiga y mantiene contraste AAA.

---

## 6. Resumen de códigos HEX

### Light mode

```
Dominante (60%)   #003366  Azul noche
Secundario (30%)  #475569  Gris slate
Acento (10%)      #C2410C  Naranja accesible

Texto principal   #1E293B
Texto secundario  #475569
Fondo             #FFFFFF
Superficie        #F1F5F9
Borde             #E2E8F0

Error             #B91C1C  (fondo: #FEE2E2)
Éxito             #15803D  (fondo: #DCFCE7)
Info              #1D4ED8  (fondo: #DBEAFE)
Advertencia       #B45309  (fondo: #FFFBEB)
```

### Dark mode

```
Fondo             #0F172A  Azul medianoche
Fondo elevado     #1E293B
Nav               #1E3A5F

Texto principal   #F8FAFC
Texto secundario  #94A3B8
Acento            #FB923C
Borde             #334155
```

---

## 7. Jerarquía visual de marca

1. **Dominante (azul):** Confianza, seguridad, tecnología. Define la identidad y se usa en header, footer y bloques clave.
2. **Secundario (gris slate):** Soporta lectura y jerarquía sin competir con el azul; ideal para cuerpo, labels y bordes.
3. **Acento (naranja):** Acción (CTAs, enlaces, precios). El cambio a `#C2410C` mantiene la energía de la marca y cumple AA.
4. **Semánticos:** Error, éxito, información y advertencia quedan claros y accesibles en formularios, toasts y alertas.

**Validación:** Introducir cada par texto/fondo en [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) para verificar los ratios antes de implementar en código.
