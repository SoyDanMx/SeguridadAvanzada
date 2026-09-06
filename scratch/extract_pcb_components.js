const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('data/shopify_import_ct_catalog.csv');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const categories = {
    cpu: [],
    mobo: [],
    ram: [],
    ssd: [],
    case: [],
    psu: [],
    gpu: [],
    cooler: [],
    monitor: []
  };

  let header = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        parts.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    parts.push(cur);

    if (!header) {
      header = parts;
      continue;
    }

    const handle = parts[0] || '';
    const title = parts[1] || '';
    const vendor = parts[3] || '';
    const type = parts[4] || '';
    const subtype = parts[5] || '';
    const tags = parts[6] || '';
    const sku = parts[10] || '';
    const qty = parseInt(parts[13]) || 0;
    const price = parseFloat(parts[16]) || 0;
    const img = parts[22] || '';

    if (!title || price <= 0) continue;

    const lowerTitle = title.toLowerCase();
    const item = { handle, title, vendor, price, img, sku, qty, type, subtype };

    // CPU classification
    const isCpu = subtype === 'Microprocesadores' || 
      lowerTitle.startsWith('procesador') ||
      lowerTitle.includes('core i3') || lowerTitle.includes('core i5') || lowerTitle.includes('core i7') || lowerTitle.includes('core i9') || 
      lowerTitle.includes('ryzen 3') || lowerTitle.includes('ryzen 5') || lowerTitle.includes('ryzen 7') || lowerTitle.includes('ryzen 9');

    if (isCpu && !lowerTitle.includes('servidor') && !lowerTitle.includes('xeon') && !lowerTitle.includes('epyc')) {
      const isAmd = lowerTitle.includes('amd') || lowerTitle.includes('ryzen') || vendor.toLowerCase().includes('amd');
      item.brand = isAmd ? 'AMD' : 'Intel';
      
      let socket = 'LGA1700';
      if (isAmd) {
        if (lowerTitle.includes('7600') || lowerTitle.includes('7700') || lowerTitle.includes('7800') || lowerTitle.includes('7900') || lowerTitle.includes('7950') || lowerTitle.includes('8500') || lowerTitle.includes('8600') || lowerTitle.includes('8700') || lowerTitle.includes('9600') || lowerTitle.includes('9700') || lowerTitle.includes('9800') || lowerTitle.includes('9900') || lowerTitle.includes('9950') || lowerTitle.includes('am5')) {
          socket = 'AM5';
        } else {
          socket = 'AM4';
        }
      } else {
        if (lowerTitle.includes('ultra') || lowerTitle.includes('lga1851') || lowerTitle.includes('1851')) {
          socket = 'LGA1851';
        } else if (lowerTitle.includes('10100') || lowerTitle.includes('10400') || lowerTitle.includes('10700') || lowerTitle.includes('11400') || lowerTitle.includes('11700') || lowerTitle.includes('lga1200')) {
          socket = 'LGA1200';
        } else {
          socket = 'LGA1700';
        }
      }
      item.socket = socket;
      categories.cpu.push(item);
    } 
    // Motherboards
    else if (subtype.includes('Motherboard') || type.includes('Motherboard') || lowerTitle.includes('motherboard') || lowerTitle.includes('tarjeta madre')) {
      if (lowerTitle.includes('servidor') || lowerTitle.includes('server')) continue;
      
      let socket = 'LGA1700';
      if (lowerTitle.includes('am4') || lowerTitle.includes('a520') || lowerTitle.includes('b550') || lowerTitle.includes('x570')) socket = 'AM4';
      else if (lowerTitle.includes('am5') || lowerTitle.includes('a620') || lowerTitle.includes('b650') || lowerTitle.includes('b850') || lowerTitle.includes('x670') || lowerTitle.includes('x870')) socket = 'AM5';
      else if (lowerTitle.includes('z890') || lowerTitle.includes('b860') || lowerTitle.includes('b840') || lowerTitle.includes('lga1851')) socket = 'LGA1851';
      else if (lowerTitle.includes('h610') || lowerTitle.includes('b760') || lowerTitle.includes('z790') || lowerTitle.includes('b660') || lowerTitle.includes('z690') || lowerTitle.includes('lga1700')) socket = 'LGA1700';
      else if (lowerTitle.includes('h510') || lowerTitle.includes('b560') || lowerTitle.includes('h410')) socket = 'LGA1200';

      let ramType = lowerTitle.includes('ddr5') ? 'DDR5' : (lowerTitle.includes('ddr4') ? 'DDR4' : (socket === 'AM5' || socket === 'LGA1851' ? 'DDR5' : 'DDR4'));
      item.socket = socket;
      item.ramType = ramType;
      categories.mobo.push(item);
    }
    // RAM
    else if (subtype.includes('Memorias RAM') || lowerTitle.includes('memoria ram') || lowerTitle.includes('ddr4') || lowerTitle.includes('ddr5') || tags.includes('Memorias RAM')) {
      if (lowerTitle.includes('laptop') || lowerTitle.includes('sodimm') || lowerTitle.includes('servidor') || lowerTitle.includes('ecc')) continue;
      let ramType = lowerTitle.includes('ddr5') ? 'DDR5' : 'DDR4';
      let capacity = '16GB';
      if (lowerTitle.includes('32gb') || lowerTitle.includes('32 gb') || lowerTitle.includes('2x16gb')) capacity = '32GB';
      else if (lowerTitle.includes('64gb') || lowerTitle.includes('2x32gb')) capacity = '64GB';
      else if (lowerTitle.includes('8gb') || lowerTitle.includes('8 gb')) capacity = '8GB';
      item.ramType = ramType;
      item.capacity = capacity;
      categories.ram.push(item);
    }
    // Storage SSD
    else if (subtype === 'SSD' || (lowerTitle.includes('ssd ') && !lowerTitle.includes('enclosure') && !lowerTitle.includes('adaptador'))) {
      let cap = '1TB';
      if (lowerTitle.includes('2tb') || lowerTitle.includes('2 tb')) cap = '2TB';
      else if (lowerTitle.includes('500gb') || lowerTitle.includes('512gb')) cap = '512GB';
      else if (lowerTitle.includes('240gb') || lowerTitle.includes('250gb') || lowerTitle.includes('256gb')) cap = '250GB';
      else if (lowerTitle.includes('4tb')) cap = '4TB';
      item.capacity = cap;
      categories.ssd.push(item);
    }
    // Case
    else if (subtype.includes('Gabinetes') || type.includes('Gabinetes') || lowerTitle.includes('gabinete')) {
      if (lowerTitle.includes('rack') || lowerTitle.includes('servidor')) continue;
      let isRgb = lowerTitle.includes('rgb') || lowerTitle.includes('cristal') || lowerTitle.includes('gamer') || lowerTitle.includes('gaming');
      item.isGamer = isRgb;
      categories.case.push(item);
    }
    // Power Supply
    else if (lowerTitle.includes('fuente de poder') || lowerTitle.includes('power supply') || tags.includes('Fuentes de Poder')) {
      if (lowerTitle.includes('cargador') || lowerTitle.includes('eliminador') || lowerTitle.includes('adaptador')) continue;
      let watts = '600W';
      if (lowerTitle.includes('500w') || lowerTitle.includes('500 w')) watts = '500W';
      else if (lowerTitle.includes('550w')) watts = '550W';
      else if (lowerTitle.includes('650w')) watts = '650W';
      else if (lowerTitle.includes('750w')) watts = '750W';
      else if (lowerTitle.includes('850w')) watts = '850W';
      else if (lowerTitle.includes('1000w')) watts = '1000W';
      item.watts = watts;
      categories.psu.push(item);
    }
    // Coolers
    else if (subtype.includes('Enfriamiento') || lowerTitle.includes('disipador') || lowerTitle.includes('enfriamiento liquido') || lowerTitle.includes('cooler')) {
      let isLiquid = lowerTitle.includes('liquido') || lowerTitle.includes('liquida') || lowerTitle.includes('aio');
      item.coolerType = isLiquid ? 'Líquido AIO' : 'Aire';
      categories.cooler.push(item);
    }
    // Monitors
    else if (subtype.includes('Monitores') || type.includes('Monitores') || (lowerTitle.includes('monitor') && !lowerTitle.includes('soporte') && !lowerTitle.includes('brazo'))) {
      let hz = '75Hz';
      if (lowerTitle.includes('144hz') || lowerTitle.includes('144 hz')) hz = '144Hz';
      else if (lowerTitle.includes('165hz') || lowerTitle.includes('165 hz')) hz = '165Hz';
      else if (lowerTitle.includes('180hz')) hz = '180Hz';
      else if (lowerTitle.includes('240hz')) hz = '240Hz';
      item.hz = hz;
      categories.monitor.push(item);
    }
    // GPU
    else if (lowerTitle.includes('geforce') || lowerTitle.includes('radeon') || lowerTitle.includes('rtx ') || lowerTitle.includes('tarjeta de video')) {
      if (lowerTitle.includes('capturadora') || lowerTitle.includes('soporte')) continue;
      categories.gpu.push(item);
    }
  }

  for (const k of Object.keys(categories)) {
    console.log(`[${k}] Found: ${categories[k].length} items`);
  }

  fs.writeFileSync('scratch/pcb_components.json', JSON.stringify(categories, null, 2));
  console.log('Saved scratch/pcb_components.json');
}

extract();
