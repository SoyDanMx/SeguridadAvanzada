const https = require('https');
const fs = require('fs');

const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';

const furnitureList = [
  {
    title: 'Silla Gaming Naceb Gaming NA-0928',
    vendor: 'Naceb Gaming',
    product_type: 'Mobiliario y Ergonomia',
    price: '3384.00',
    sku: 'NA-0928',
    img: 'https://static.ctonline.mx/imagenes/ACCNCB810/ACCNCB810_full.jpg',
    category: 'Silla Gamer',
    inStock: true
  },
  {
    title: 'Silla Gaming NECNON NSG-RGB-1 Luces RGB',
    vendor: 'NECNON',
    product_type: 'Mobiliario y Ergonomia',
    price: '2632.00',
    sku: 'NBSGR122RG',
    img: 'https://static.ctonline.mx/imagenes/SILNEC040/SILNEC040_full.jpg',
    category: 'Silla Gamer',
    inStock: true
  },
  {
    title: 'Silla Balam Rush BR-934534 Nova Series',
    vendor: 'Balam Rush',
    product_type: 'Mobiliario y Ergonomia',
    price: '1774.00',
    sku: 'BR-934534',
    img: 'https://static.ctonline.mx/imagenes/SILBLR160/SILBLR160_full.jpg',
    category: 'Silla Gamer',
    inStock: true
  },
  {
    title: 'Silla Gaming Naceb Technology NA-2772',
    vendor: 'Naceb Technology',
    product_type: 'Mobiliario y Ergonomia',
    price: '2237.00',
    sku: 'NA-2772',
    img: 'https://static.ctonline.mx/imagenes/SILNCB040/SILNCB040_full.jpg',
    category: 'Silla Gamer',
    inStock: false
  },
  {
    title: 'Silla de Oficina Ergonómica ACTECK FLUX CORE EC303',
    vendor: 'ACTECK',
    product_type: 'Mobiliario y Ergonomia',
    price: '1360.00',
    sku: 'AC-944175',
    img: 'https://static.ctonline.mx/imagenes/SILACT200/SILACT200_full.jpg',
    category: 'Silla Ejecutiva',
    inStock: true
  },
  {
    title: 'Silla Ejecutiva Ergonómica Naceb Negro NA-0930N',
    vendor: 'Naceb Technology',
    product_type: 'Mobiliario y Ergonomia',
    price: '3218.00',
    sku: 'NA-0930N',
    img: 'https://static.ctonline.mx/imagenes/SILNCB020/SILNCB020_full.jpg',
    category: 'Silla Ejecutiva',
    inStock: true
  },
  {
    title: 'Silla Ejecutiva Ergonómica Naceb Café NA-0930C',
    vendor: 'Naceb Technology',
    product_type: 'Mobiliario y Ergonomia',
    price: '3218.00',
    sku: 'NA-0930C',
    img: 'https://static.ctonline.mx/imagenes/SILNCB030/SILNCB030_full.jpg',
    category: 'Silla Ejecutiva',
    inStock: true
  },
  {
    title: 'Escritorio Ergonómico Doble ACTECK ED727',
    vendor: 'ACTECK',
    product_type: 'Mobiliario y Ergonomia',
    price: '4971.00',
    sku: 'AC-937276',
    img: 'https://static.ctonline.mx/imagenes/ESCACT040/ESCACT040_full.jpg',
    category: 'Escritorio',
    inStock: true
  },
  {
    title: 'Escritorio Gaming Balam Rush MRX4000',
    vendor: 'Balam Rush',
    product_type: 'Mobiliario y Ergonomia',
    price: '1700.00',
    sku: 'BR-941426',
    img: 'https://static.ctonline.mx/imagenes/ESCBLR030/ESCBLR030_full.jpg',
    category: 'Escritorio',
    inStock: true
  },
  {
    title: 'Escritorio Gaming Pro Balam Rush MRX8000',
    vendor: 'Balam Rush',
    product_type: 'Mobiliario y Ergonomia',
    price: '3179.00',
    sku: 'BR-941372',
    img: 'https://static.ctonline.mx/imagenes/ESCBLR040/ESCBLR040_full.jpg',
    category: 'Escritorio',
    inStock: false
  }
];

const peripheralsList = [
  {
    title: 'Kit Teclado y Mouse Inalámbrico ACTECK MK470',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '555.00',
    sku: 'AC-935197',
    img: 'https://static.ctonline.mx/imagenes/KITACT1100/KITACT1100_full.jpg',
    category: 'Kit Inalámbrico',
    inStock: true
  },
  {
    title: 'Kit Inalámbrico Silencioso ACTECK CREATOR MK440',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '236.00',
    sku: 'AC-931755',
    img: 'https://static.ctonline.mx/imagenes/KITACT1050/KITACT1050_full.jpg',
    category: 'Kit Inalámbrico',
    inStock: true
  },
  {
    title: 'Kit Teclado y Mouse ACER EKW111 Inalámbrico',
    vendor: 'ACER',
    product_type: 'Teclados y Mouses',
    price: '383.00',
    sku: 'EKW111',
    img: 'https://static.ctonline.mx/imagenes/KITACC020/KITACC020_full.jpg',
    category: 'Kit Inalámbrico',
    inStock: true
  },
  {
    title: 'Kit Teclado y Mouse Alámbrico ACER EAK030',
    vendor: 'ACER',
    product_type: 'Teclados y Mouses',
    price: '263.00',
    sku: 'EAK030',
    img: 'https://static.ctonline.mx/imagenes/KITACC010/KITACC010_full.jpg',
    category: 'Kit Alámbrico',
    inStock: true
  },
  {
    title: 'Kit Teclado y Mouse Estándar ACTECK AC-928984',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '170.00',
    sku: 'AC-928984',
    img: 'https://static.ctonline.mx/imagenes/KITACT630/KITACT630_full.jpg',
    category: 'Kit Alámbrico',
    inStock: true
  },
  {
    title: 'Teclado Gamer Alámbrico LED ACTECK TA477G',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '237.00',
    sku: 'AC-936743',
    img: 'https://static.ctonline.mx/imagenes/TECACT180/TECACT180_full.jpg',
    category: 'Teclado Gamer',
    inStock: true
  },
  {
    title: 'Teclado Clásico Alámbrico USB ACTECK TE-200',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '102.00',
    sku: 'AC-928946',
    img: 'https://static.ctonline.mx/imagenes/TECACT010/TECACT010_full.jpg',
    category: 'Teclado Oficina',
    inStock: true
  },
  {
    title: 'Teclado Inalámbrico Compacto ACTECK AC-913973',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '147.00',
    sku: 'AC-913973',
    img: 'https://static.ctonline.mx/imagenes/TECACT080/TECACT080_full.jpg',
    category: 'Teclado Oficina',
    inStock: false
  },
  {
    title: 'Mouse Óptico Inalámbrico ACER EMW211',
    vendor: 'ACER',
    product_type: 'Teclados y Mouses',
    price: '263.00',
    sku: 'EMW211',
    img: 'https://static.ctonline.mx/imagenes/MOUACC010/MOUACC010_full.jpg',
    category: 'Mouse Inalámbrico',
    inStock: true
  },
  {
    title: 'Mouse Ergonómico Inalámbrico ACER EMR213-BK',
    vendor: 'ACER',
    product_type: 'Teclados y Mouses',
    price: '354.00',
    sku: 'EMR213',
    img: 'https://static.ctonline.mx/imagenes/MOUACC020/MOUACC020_full.jpg',
    category: 'Mouse Ergonómico',
    inStock: true
  },
  {
    title: 'Mouse Óptico USB ACTECK MI240',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '88.00',
    sku: 'AC-928885',
    img: 'https://static.ctonline.mx/imagenes/MOUACT280/MOUACT280_full.jpg',
    category: 'Mouse Oficina',
    inStock: true
  },
  {
    title: 'Mouse Óptico Alámbrico ACTECK ENTRY',
    vendor: 'ACTECK',
    product_type: 'Teclados y Mouses',
    price: '49.00',
    sku: 'AC-928830',
    img: 'https://static.ctonline.mx/imagenes/MOUACT030/MOUACT030_full.jpg',
    category: 'Mouse Oficina',
    inStock: true
  }
];

async function createProductRest(item) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      product: {
        title: item.title,
        vendor: item.vendor,
        product_type: item.product_type,
        status: 'active',
        tags: ['Configurador PC', item.category, item.vendor, item.sku].join(', '),
        images: item.img ? [{ src: item.img }] : [],
        variants: [
          {
            price: item.price,
            sku: item.sku,
            inventory_policy: 'continue'
          }
        ]
      }
    });

    const req = https.request('https://q5akvk-19.myshopify.com/admin/api/2024-01/products.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.product) {
            console.log(' -> OK! ' + item.title + ' -> ID: ' + json.product.id + ', Variant: ' + json.product.variants[0].id);
            resolve({
              id: json.product.handle,
              title: item.title,
              vendor: item.vendor,
              price: Math.round(parseFloat(item.price)),
              img: item.img,
              sku: item.sku,
              category: item.category,
              inStock: item.inStock,
              variantId: json.product.variants[0].id
            });
          } else {
            console.error('Failed to create ' + item.title + ':', data);
            resolve(null);
          }
        } catch(e) {
          console.error('JSON parse error:', e.message);
          resolve(null);
        }
      });
    });
    req.on('error', err => {
      console.error('Request error:', err);
      resolve(null);
    });
    req.write(payload);
    req.end();
  });
}

async function run() {
  const createdFurniture = [
    {
      id: 'sillas-gaming-balam-rush-power-rush-v2',
      title: 'Sillas Gaming Balam Rush POWER RUSH V2',
      vendor: 'Balam Rush',
      price: 1774,
      img: 'https://static.ctonline.mx/imagenes/GABBLR430/GABBLR430_full.jpg',
      sku: 'BR-944489',
      category: 'Silla Gamer',
      inStock: true,
      variantId: 52774726172804
    }
  ];

  console.log('--- Creating Furniture Items ---');
  for (const item of furnitureList) {
    const res = await createProductRest(item);
    if (res) createdFurniture.push(res);
  }

  const createdPeripherals = [];
  console.log('\n--- Creating Peripherals Items ---');
  for (const item of peripheralsList) {
    const res = await createProductRest(item);
    if (res) createdPeripherals.push(res);
  }

  fs.writeFileSync('scratch/shopify_created_furniture.json', JSON.stringify(createdFurniture, null, 2));
  fs.writeFileSync('scratch/shopify_created_peripherals.json', JSON.stringify(createdPeripherals, null, 2));
  console.log('\nSUCCESS! Created ' + createdFurniture.length + ' furniture items and ' + createdPeripherals.length + ' peripheral items in Shopify.');
}

run();
