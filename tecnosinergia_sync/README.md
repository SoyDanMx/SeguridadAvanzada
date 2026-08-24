# Pipeline de Sincronización Diaria Tecnosinergia → Shopify

Este módulo automatiza la sincronización diaria del catálogo de **Tecnosinergia** (precios, existencias, estado) con la tienda Shopify **seguridad-avanzada.com**, convirtiendo precios de USD a MXN con el tipo de cambio oficial de **Banxico SIE** y aplicando reglas de exclusión para no duplicar ni sobrescribir productos cargados previamente de **Syscom**.

---

## 🏗 Arquitectura del Pipeline

```
tecnosinergia_sync/
├── __init__.py           # Identificador de paquete Python
├── config.py             # Carga de .env y constantes de reglas de negocio
├── logger.py             # Configuración de logs dual (consola + archivo diario)
├── banxico.py            # API Banxico SIE (Serie SF43718 - FIX) con cache local
├── tecnosinergia.py      # Healthcheck V3, descarga con paginación, fallback a V2 y normalización
├── shopify_sync.py       # GraphQL Admin API (escaneo de Syscom, throttling y upserts)
├── main.py               # Orquestador principal y reporte de ejecución
├── requirements.txt      # Dependencias Python
├── .env.example          # Plantilla de variables de entorno
└── README.md             # Instrucciones de uso y despliegue
```

---

## ⚡ Reglas de Negocio Implementadas

1. **Prioridad Syscom (No Duplicar)**:
   - Antes de crear o actualizar un producto de Tecnosinergia, se escanea la tienda Shopify buscando SKUs etiquetados con `proveedor:syscom` o Vendor `Syscom`.
   - Si el SKU ya existe procedente de Syscom, **se omite completamente del catálogo de Tecnosinergia**.

2. **Tipo de Cambio USD → MXN (Banxico SIE)**:
   - Consulta la serie `SF43718` (tipo de cambio FIX) diariamente.
   - En fines de semana o días festivos (sin valor nuevo en Banxico), se usa automáticamente el último valor conocido guardado en `data/fx_rate_cache.json`.
   - **Regla SAT DOF vs FIX**: Documentado en el código. Puede configurarse `USE_SAT_DOF_PREVIOUS_DAY_FX=true` para utilizar la tasa del día hábil anterior (cumplimiento de facturación SAT DOF).

3. **Manejo Resiliente de Precios Invalidos**:
   - Si un producto contiene un precio no numérico (ej. `*`, vacío o texto), **no se interrumpe la ejecución**. Se registra el SKU en el reporte final y se omite ese producto específico, continuando el proceso con los demás.

4. **Publicación y Existencias (Stock)**:
   - `total_stock = 0` setea `inventoryPolicy: DENY` en Shopify.
   - Productos con estado `DE LINEA` y `ULTIMAS PIEZAS` se publican como `ACTIVE`.
   - Productos con estado `TEMPORALMENTE AGOTADO` o tiempos de sobre pedido mayores a 60 días (`MAX_LEAD_TIME_DAYS`) se asignan a estado `DRAFT`.

---

## 🚀 Guía de Instalación y Uso Local

### 1. Requisitos Previos
- Python 3.10 o superior.
- Claves API:
  - **Banxico SIE Token**: Obtener gratis en [Banxico Portal](https://www.banxico.org.mx/SieAPIRest/service/v1/).
  - **Tecnosinergia API Token (V3 / V2)**: Solicitar a soporte/ejecutivo de Tecnosinergia.
  - **Shopify Admin Access Token**: Crear una Custom App en Shopify Admin con permisos `read_products`, `write_products`, `read_inventory`, `write_inventory`.

### 2. Configurar Variables de Entorno
Copia la plantilla `.env.example` al archivo `.env` en la raíz del proyecto:
```bash
cp tecnosinergia_sync/.env.example .env
```
Edita `.env` con tus tokens reales:
```env
BANXICO_SIE_TOKEN="tu_token_banxico"
TECNOSINERGIA_API_TOKEN="tu_token_v3"
TECNOSINERGIA_V2_TOKEN="tu_token_v2"
SHOPIFY_STORE_DOMAIN="seguridad-avanzada.myshopify.com"
SHOPIFY_ADMIN_ACCESS_TOKEN="shpat_xxxxxxxxxxxxxxxx"
```

### 3. Instalar Dependencias
```bash
pip install -r tecnosinergia_sync/requirements.txt
```

### 4. Modo Prueba / Simulador (`--dry-run`)
Prueba la descarga, tipo de cambio, validación de precios y escaneo de Syscom sin modificar datos en Shopify:
```bash
python -m tecnosinergia_sync.main --dry-run
```

### 5. Ejecución Real en Producción
```bash
python -m tecnosinergia_sync.main
```

### Opciones CLI Disponibles:
- `--dry-run`: Ejecuta todo el flujo sin realizar escrituras en Shopify.
- `--force-v2`: Omite la API V3 y fuerza el uso del endpoint V2 (JSON/CSV fallback).
- `--verbose`: Muestra mensajes detallados en consola (DEBUG level).

---

## ⏰ Programación Diaria (Cron Job / GCP)

Banxico publica el tipo de cambio FIX a las **12:30 PM (Hora CDMX)** de cada día hábil. Se recomienda programar la ejecución diariamente entre la **1:00 PM y 2:00 PM CDMX**.

### Opción A: Server Propio / VPS (Cron Job Linux)
Añade la siguiente entrada en `crontab -e`:
```cron
# Ejecutar diariamente a las 1:15 PM Hora CDMX (19:15 UTC)
15 19 * * * cd /ruta/a/SeguridadAvanzadaShop && /usr/bin/python3 -m tecnosinergia_sync.main >> /ruta/a/SeguridadAvanzadaShop/logs/cron.log 2>&1
```

### Opción B: Google Cloud Platform (Cloud Scheduler + Cloud Run / Functions)
1. Empaquetar `tecnosinergia_sync` en un contenedor Docker utilizando `python:3.11-slim`.
2. Desplegar como un Job en **Cloud Run Jobs**.
3. Configurar **Cloud Scheduler** con la expresión cron `15 13 * * *` (zona horaria `America/Mexico_City`) para invocar el Cloud Run Job.

---

## 📊 Archivos de Registro y Cache

- **Logs Diarios**: Se almacenan en `logs/tecnosinergia_sync_YYYYMMDD.log` con detalle completo de la corrida.
- **Cache Tipo de Cambio**: Se guarda en `data/fx_rate_cache.json` manteniendo el último tipo de cambio válido obtenido de Banxico.
