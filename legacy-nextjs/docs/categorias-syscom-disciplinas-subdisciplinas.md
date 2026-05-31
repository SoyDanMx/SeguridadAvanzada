# Categorías Syscom: disciplinas y subdisciplinas

Estructura extraída de syscom.mx para usar en navegación (mega-menú, barra de categorías, filtros y rutas).

---

## Disciplinas principales (columna izquierda del mega-menú)

Estas son las categorías de primer nivel que deben aparecer en:

- Enlace "Productos" (dropdown o mega-menú)
- Barra "Categorías principales" bajo el hero
- Menú lateral / sidebar de categorías

| Orden | Disciplina |
|-------|------------|
| 1 | Audio y Video |
| 2 | Automatización e Intrusión |
| 3 | Cableado Estructurado |
| 4 | Control de Acceso |
| 5 | Detección de Fuego |
| 6 | Energía / Herramientas |
| 7 | IoT / GPS / Telemática y Señalización Audiovisual |
| 8 | Radiocomunicación |
| 9 | Redes e IT |
| 10 | Robots e Industrial |
| 11 | Videovigilancia |
| 12 | Cobertura Celular |

---

## Subdisciplinas por disciplina

Cada disciplina tiene subsecciones (subdisciplinas) que deben mostrarse en la columna derecha del mega-menú al seleccionar la disciplina, y como filtros/rutas en listados de productos.

### Audio y Video
- Audio IP
- Audio Profesional
- Audio residencial/Comercial
- Audioevacuación
- Conferencia
- Microfonía
- Pantallas/Monitores
- ProAV
- Reuniones Interactivas
- Streaming & Gaming
- Videowalls

### Automatización e Intrusión
- Accesorios
- Automatización - Casa Inteligente
- Cables
- Centrales de Monitoreo
- Cercas Eléctricas
- Contactos Magnéticos
- Control de Acceso
- Controladores
- Detección Honeywell
- Detectores / Sensores
- Energía

### Cableado Estructurado
- Cable - Bobinas
- Cableado de Cobre
- Canalización
- Charola
- Conectores
- Fibra Óptica
- PDU (Power Distribution Unit)
- Racks y Gabinetes

### Control de Acceso
- Acceso SIN CONTACTO (Contactless Access)
- Acceso vehicular
- Accesorios
- Administración de Hoteles
- Biométricos
- Cerraduras
- Control de Rondas Para Vigilantes
- Detectores de Metal
- Equipo Blindado
- Fuentes de Alimentación
- Herramientas

### Detección de Fuego
*(Subdisciplinas por confirmar en syscom.mx si se necesitan)*

### Energía / Herramientas
*(Subdisciplinas por confirmar en syscom.mx si se necesitan)*

### IoT / GPS / Telemática y Señalización Audiovisual
*(Subdisciplinas por confirmar en syscom.mx si se necesitan)*

### Radiocomunicación
*(Subdisciplinas por confirmar en syscom.mx si se necesitan)*

### Redes e IT
- Almacenamiento
- Antenas
- Cobertura para Celular 4G LTE, 3G y Voz
- Conectividad y Cables
- Enlaces de Backhaul
- Enlaces PtP y PtMP
- Equipo de Cómputo
- Herramientas
- Networking
- Protección Contra Descargas
- Racks y Gabinetes

### Robots e Industrial
*(Subdisciplinas por confirmar en syscom.mx si se necesitan)*

### Videovigilancia
- Accesorios Generales
- Cámaras IP y NVRs
- Cámaras y DVRs HD TurboHD / AHD / HD-TVI
- Cables y Conectores
- Drones, Robots e Industrial
- Energía
- Kits - Sistemas Completos
- Monitores Pantallas y Mobiliario
- Protección Contra Descargas
- Servidores / Almacenamiento
- Software VMS y Analíticas

### Cobertura Celular
*(Subdisciplinas por confirmar en syscom.mx si se necesitan)*

---

## Uso en la app

- **Header / Nav:** En "Productos" mostrar las **disciplinas** (lista principal). Opcional: mega-menú con columna izquierda = disciplinas, columna derecha = subdisciplinas de la seleccionada.
- **Barra "Categorías principales":** Misma lista de disciplinas, con enlaces a `/productos?category=...` o `/categorias/<slug>`.
- **Filtros en `/productos`:** Incluir filtro por disciplina y por subdisciplina (según categorías que devuelva la API Syscom).
- **Rutas:** Definir slugs por disciplina (ej. `videovigilancia`, `redes-e-it`, `control-de-acceso`) y, si aplica, por subdisciplina para URLs amigables.

Las subdisciplinas marcadas como "por confirmar" se pueden completar revisando syscom.mx o cuando la API de categorías esté definida.
