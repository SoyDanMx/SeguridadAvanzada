const fs = require('fs');
const path = require('path');
const https = require('https');

// Ruta al archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');

// 1. Función para parsear .env.local sin librerías externas
function loadEnv() {
  if (!fs.existsSync(envPath)) {
    throw new Error("No se encontró el archivo .env.local en la raíz del proyecto.");
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const CLIENT_ID = env.SYSCOM_CLIENT_ID;
const CLIENT_SECRET = env.SYSCOM_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ Faltan las credenciales SYSCOM_CLIENT_ID o SYSCOM_CLIENT_SECRET en tu .env.local");
  process.exit(1);
}

// 2. Helper para realizar peticiones HTTPS nativas
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SeguridadAvanzadaScraper/1.0',
        ...options.headers
      }
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// 3. Autenticación OAuth2 de Syscom
async function getAuthToken() {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  }).toString();

  const res = await httpsRequest('https://developers.syscom.mx/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body)
    },
    body
  });

  return res.access_token;
}

// 4. Proceso principal
async function main() {
  console.log("🚀 Autenticando con la API Oficial de Syscom...");
  let token;
  try {
    token = await getAuthToken();
    console.log("🔑 Autenticación exitosa. Obteniendo categorías principales (Nivel 1)...");
  } catch (error) {
    console.error("❌ Error de autenticación en Syscom:", error.message);
    process.exit(1);
  }

  try {
    // Obtener las categorías de nivel 1
    const mainCategories = await httpsRequest('https://developers.syscom.mx/api/v1/categorias', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const mainCategoriesArray = Array.isArray(mainCategories) ? mainCategories : mainCategories.data || [];
    console.log(`📦 Se encontraron ${mainCategoriesArray.length} categorías principales.`);
    console.log("⏳ Descargando subcategorías de nivel 2 para cada categoría en paralelo...\n");

    const fullTree = [];

    // Descargar las subcategorías para cada categoría principal
    const fetchPromises = mainCategoriesArray.map(async (cat) => {
      try {
        const detail = await httpsRequest(`https://developers.syscom.mx/api/v1/categorias/${cat.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const subcategorias = detail.subcategorias || [];
        fullTree.push({
          id: cat.id,
          nombre: cat.nombre,
          nivel: 1,
          subcategorias: subcategorias.map(sub => ({
            id: sub.id,
            nombre: sub.nombre,
            nivel: 2
          }))
        });
        
        console.log(`   ✅ Sincronizada: "${cat.nombre}" (${subcategorias.length} subcategorías encontradas)`);
      } catch (err) {
        console.error(`   ❌ Falló descargar subcategorías para "${cat.nombre}" (ID: ${cat.id}):`, err.message);
        fullTree.push({
          id: cat.id,
          nombre: cat.nombre,
          nivel: 1,
          subcategorias: []
        });
      }
    });

    // Esperar a que terminen todas las peticiones
    await Promise.all(fetchPromises);

    // Ordenar alfabéticamente por nombre de categoría principal para presentación limpia
    fullTree.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Guardar los resultados en la carpeta data
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const outputPath = path.join(dataDir, 'syscom-categories-tree.json');
    fs.writeFileSync(outputPath, JSON.stringify(fullTree, null, 2), 'utf8');
    console.log(`\n💾 ¡Excelente! Árbol de categorías completo guardado en: data/syscom-categories-tree.json\n`);

    // Mostrar un resumen hermoso en la consola
    console.log("🌳 ESTRUCTURA DE CATEGORÍAS Y SUBCATEGORÍAS DE SYSCOM EN TIEMPO REAL:\n");
    fullTree.forEach(parent => {
      console.log(`🔹 \x1b[1m${parent.nombre.toUpperCase()}\x1b[0m (ID: ${parent.id})`);
      if (parent.subcategorias.length > 0) {
        parent.subcategorias.forEach((sub, idx) => {
          const char = idx === parent.subcategorias.length - 1 ? '└──' : '├──';
          console.log(`   ${char} ${sub.nombre} (ID: ${sub.id})`);
        });
      } else {
        console.log(`   └── (Sin subcategorías registradas)`);
      }
      console.log("");
    });

  } catch (error) {
    console.error("❌ Error al obtener las categorías:", error.message);
  }
}

main();
