#!/bin/bash
# Prueba credenciales de Syscom fuera de Next.js.
# Uso: ./scripts/test-syscom-credentials.sh
# O con credenciales explícitas: CLIENT_ID="xxx" CLIENT_SECRET="yyy" ./scripts/test-syscom-credentials.sh

set -e
cd "$(dirname "$0")/.."

# Cargar .env.local si existe
if [ -f .env.local ]; then
  echo "📂 Cargando .env.local..."
  set -a
  source .env.local 2>/dev/null || true
  set +a
fi

CLIENT_ID="${SYSCOM_CLIENT_ID:-$CLIENT_ID}"
CLIENT_SECRET="${SYSCOM_CLIENT_SECRET:-$CLIENT_SECRET}"

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
  echo "❌ Faltan SYSCOM_CLIENT_ID o SYSCOM_CLIENT_SECRET."
  echo "   Configúralos en .env.local o pásalos: CLIENT_ID=xxx CLIENT_SECRET=yyy $0"
  exit 1
fi

# Quitar comillas y espacios extra
CLIENT_ID=$(echo "$CLIENT_ID" | tr -d '"' | tr -d "'" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
CLIENT_SECRET=$(echo "$CLIENT_SECRET" | tr -d '"' | tr -d "'" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

echo "🔑 Probando token en https://developers.syscom.mx/oauth/token"
echo "   Client ID (primeros 4 chars): ${CLIENT_ID:0:4}..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -k -X POST "https://developers.syscom.mx/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials")

# head -n -1 no funciona en macOS; usar sed para quitar la última línea
HTTP_BODY=$(echo "$RESPONSE" | sed '$d')
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Éxito (HTTP 200). Token obtenido correctamente."
  echo "$HTTP_BODY" | head -c 200
  echo "..."
  echo ""
  echo "👉 Las credenciales son correctas. Si el catálogo sigue fallando, el problema puede ser:"
  echo "   - Next.js no está leyendo .env.local (reinicia: npm run dev)"
  echo "   - Variables con nombres distintos o en otro archivo"
  exit 0
else
  echo "❌ Fallo (HTTP $HTTP_CODE)"
  echo "$HTTP_BODY"
  echo ""
  if [ "$HTTP_CODE" = "401" ]; then
    echo "👉 HTTP 401 = Syscom rechaza las credenciales. Revisa:"
    echo "   1. Client ID y Secret en https://developers.syscom.mx (OAuth2 / API)"
    echo "   2. Sin espacios ni caracteres extra al copiar en .env.local"
    echo "   3. Prueba con otras credenciales si tienes otro cliente creado"
  fi
  exit 1
fi
