# Cómo probar la sincronización Syscom → Tiendanube

Pasos para verificar que los productos se obtienen de Syscom y (opcional) se suben a Tiendanube.

---

## Requisitos

1. **Syscom:** `SYSCOM_CLIENT_ID` y `SYSCOM_CLIENT_SECRET` en `.env.local` (o exportados).
2. **Tiendanube (solo para subir de verdad):** `TIENDANUBE_ACCESS_TOKEN` y `TIENDANUBE_STORE_ID` (o `TIENDANUBE_USER_ID`). El token se obtiene con `POST /api/tiendanube/token` usando el `code` que te da Tiendanube al instalar/reautorizar la app.
3. **Python 3** con `requests` (y opcional `python-dotenv` para cargar `.env.local`):
   ```bash
   python3 -m pip install requests
   python3 -m pip install python-dotenv   # opcional, para cargar .env.local
   ```

---

## Paso 1: Cargar variables y probar solo Syscom (dry run)

Sin subir nada a Tiendanube, el script solo obtiene productos de Syscom y muestra qué se *enviaría*.

```bash
cd /ruta/a/SeguridadAvanzadaShop

# Cargar .env.local en la sesión (si no usas python-dotenv)
export $(grep -v '^#' .env.local | xargs)

# Probar con 3 productos (solo imprime "Preparado: SKU - $ MXN")
SYNC_LIMIT=3 python3 scripts/sync_syscom_tiendanube.py
```

**Qué ver:**  
Si Syscom responde bien, verás algo como:
```text
Categoría 22, 3 producto(s), dry_run=True
✅ [DRY RUN] Preparado: MODELO-XXX - $1234.56 MXN
✅ [DRY RUN] Preparado: ...
```

Si falla: revisa que `SYSCOM_CLIENT_ID` y `SYSCOM_CLIENT_SECRET` estén bien y que la categoría exista (22 = Videovigilancia).

---

## Paso 2: Ver el JSON que se enviaría a Tiendanube

Para revisar nombre, descripción, precio y variante del primer producto:

```bash
export $(grep -v '^#' .env.local | xargs)
python3 scripts/sync_syscom_tiendanube.py --print-payload
```

(o `-p` en lugar de `--print-payload`).

Así compruebas que el mapeo (precio en MXN, SKU, imagen, etc.) es el esperado antes de subir.

---

## Paso 3: Sincronizar de verdad (subir a Tiendanube)

Solo cuando tengas **token de Tiendanube** y quieras crear productos en la tienda:

1. **Obtener token** (una vez o al expirar):
   - Instala/reautoriza la app en Tiendanube y copia el `code` de la URL de redirect.
   - `curl -X POST http://localhost:3001/api/tiendanube/token -H 'Content-Type: application/json' -d '{"code":"TU_CODE"}'`
   - Guarda `access_token` y `user_id` en `.env.local`:
     - `TIENDANUBE_ACCESS_TOKEN=...`
     - `TIENDANUBE_STORE_ID=...` (usa el `user_id` que devolvió el token)

2. **Subir 1 producto de prueba:**
   ```bash
   export $(grep -v '^#' .env.local | xargs)
   SYNC_LIMIT=1 SYNC_DRY_RUN=0 python3 scripts/sync_syscom_tiendanube.py
   ```
   O con flag:
   ```bash
   export $(grep -v '^#' .env.local | xargs)
   SYNC_LIMIT=1 python3 scripts/sync_syscom_tiendanube.py --upload
   ```

3. **Comprobar en Tiendanube:**  
   Entra al panel de tu tienda → Productos. Deberías ver el producto recién creado (nombre, precio en MXN, SKU).

4. **Subir más productos:**  
   Aumenta el límite o quita el límite cuando estés seguro:
   ```bash
   SYNC_LIMIT=10 SYNC_DRY_RUN=0 python3 scripts/sync_syscom_tiendanube.py
   ```

---

## Resumen de variables útiles

| Variable | Uso |
|----------|-----|
| `SYSCOM_CLIENT_ID` / `SYSCOM_CLIENT_SECRET` | Obligatorias para traer productos. |
| `TIENDANUBE_ACCESS_TOKEN` / `TIENDANUBE_STORE_ID` | Solo para subir (Paso 3). |
| `SYNC_LIMIT` | Número de productos a procesar (default 5). |
| `SYNC_DRY_RUN=1` | No sube a Tiendanube (default). |
| `SYNC_DRY_RUN=0` o `--upload` | Hace POST real a Tiendanube. |
| `SYSCOM_CATEGORY_ID` | ID categoría Syscom (default 22 = Videovigilancia). |
| `--print-payload` / `-p` | Imprime el JSON del primer producto. |

---

## Probar también desde la web (mapeo sin subir)

El proyecto tiene un endpoint que **solo mapea** un producto Syscom al formato Tiendanube (no hace POST):

1. Obtén un producto:  
   `GET http://localhost:3001/api/products?category=22&limit=1`
2. Copia un objeto del array `products` del JSON.
3. Envía ese objeto en el body:  
   `POST http://localhost:3001/api/sync-to-nube`  
   con `Content-Type: application/json` y el producto en el body.

La respuesta te devuelve el payload que se enviaría a Tiendanube (igual lógica de precios que el script Python). Así puedes comparar con `--print-payload` del script.
