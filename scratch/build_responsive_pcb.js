const fs = require('fs');

// 1. Read existing liquid to extract base catalog data
const existingContent = fs.readFileSync('sections/page-configurador-pc.liquid', 'utf8');
const catalogMatch = existingContent.match(/<script id="pcb-catalog-data" type="application\/json">([\s\S]*?)<\/script>/);

if (!catalogMatch) {
  console.error('Error: Could not find pcb-catalog-data in existing liquid file.');
  process.exit(1);
}

const catalog = JSON.parse(catalogMatch[1].trim());

// 2. Load created furniture & peripherals
const createdFurniture = JSON.parse(fs.readFileSync('scratch/shopify_created_furniture.json', 'utf8'));
const createdPeripherals = JSON.parse(fs.readFileSync('scratch/shopify_created_peripherals.json', 'utf8'));

catalog.furniture = createdFurniture.map(item => ({
  id: item.id,
  title: item.title,
  vendor: item.vendor,
  price: item.price,
  img: item.img,
  sku: item.sku,
  socket: '',
  brand: item.vendor,
  ramType: '',
  capacity: '',
  watts: '',
  coolerType: '',
  hz: '',
  category: item.category,
  isGamer: item.category.toLowerCase().includes('gamer'),
  variantId: String(item.variantId),
  inStock: item.inStock !== false
}));

catalog.peripherals = createdPeripherals.map(item => ({
  id: item.id,
  title: item.title,
  vendor: item.vendor,
  price: item.price,
  img: item.img,
  sku: item.sku,
  socket: '',
  brand: item.vendor,
  ramType: '',
  capacity: '',
  watts: '',
  coolerType: '',
  hz: '',
  category: item.category,
  isGamer: item.category.toLowerCase().includes('gamer'),
  variantId: String(item.variantId),
  inStock: item.inStock !== false
}));

const catalogJson = JSON.stringify(catalog);

const newLiquidContent = `{% comment %}
  CONFIGURADOR DE PC - SEGURIDAD AVANZADA
  Diseño Sobrio, Minimalista, de Alta Gama y 100% Adaptable a Celulares (Responsive)
  - Paso 1 activo por defecto con componentes visibles
  - Slots visuales interactivos de ensamble
  - Interfaz táctil ergonómica para celulares y tablets
  - Eliminación de conflicto con el botón flotante de WhatsApp
  - Factura fiscal CFDI 4.0 SAT y ensamble profesional con pruebas térmicas
{% endcomment %}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --pcb-font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --pcb-font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;

    --pcb-primary: #0f172a;
    --pcb-primary-hover: #1e293b;
    --pcb-accent: #2563eb;
    --pcb-accent-hover: #1d4ed8;
    --pcb-accent-subtle: #eff6ff;
    
    --pcb-border: #e2e8f0;
    --pcb-border-subtle: #f1f5f9;
    --pcb-border-focus: #2563eb;
    
    --pcb-bg: #f8fafc;
    --pcb-card: #ffffff;
    
    --pcb-text: #0f172a;
    --pcb-text-muted: #64748b;
    --pcb-text-light: #94a3b8;
    
    --pcb-success: #059669;
    --pcb-success-bg: #ecfdf5;
    --pcb-success-text: #065f46;

    --pcb-shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
    --pcb-shadow-md: 0 4px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04);
    --pcb-shadow-lg: 0 12px 28px -4px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.05);
  }

  * {
    box-sizing: border-box;
  }

  .pcb-wrapper {
    background-color: var(--pcb-bg);
    min-height: 100vh;
    padding-bottom: 90px;
    font-family: var(--pcb-font-main);
    color: var(--pcb-text);
    -webkit-font-smoothing: antialiased;
  }

  @media (min-width: 1080px) {
    .pcb-wrapper {
      padding-bottom: 40px; /* Sin barra sticky fija en desktop */
    }
  }

  .pcb-container {
    max-width: 1380px;
    margin: 0 auto;
    padding: 1.25rem 1rem;
  }

  @media (min-width: 768px) {
    .pcb-container {
      padding: 1.75rem 1.5rem;
    }
  }

  /* =========================================
     1. ENCABEZADO Y PRESETS RÁPIDOS
     ========================================= */
  .pcb-clean-header {
    background: var(--pcb-card);
    border: 1px solid var(--pcb-border);
    border-radius: 16px;
    padding: 1.35rem 1.25rem;
    margin-bottom: 1.5rem;
    box-shadow: var(--pcb-shadow-sm);
  }

  @media (min-width: 768px) {
    .pcb-clean-header {
      padding: 1.85rem 2rem;
      border-radius: 20px;
      margin-bottom: 2rem;
    }
  }

  .pcb-header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .pcb-header-text {
    flex: 1;
    min-width: 280px;
  }

  .pcb-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #f1f5f9;
    color: #334155;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.8rem;
    padding: 0.3rem 0.75rem;
    border-radius: 9999px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 0.65rem;
    border: 1px solid var(--pcb-border);
  }

  .pcb-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--pcb-success);
    animation: pcbPulse 2s infinite;
  }

  @keyframes pcbPulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(5, 150, 105, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
  }

  .pcb-clean-title {
    font-family: var(--pcb-font-display);
    font-size: 1.85rem;
    font-weight: 900;
    line-height: 1.15;
    margin: 0 0 0.5rem 0;
    color: #0f172a;
    letter-spacing: -0.025em;
  }

  @media (min-width: 768px) {
    .pcb-clean-title {
      font-size: 2.5rem;
    }
  }

  .pcb-clean-desc {
    font-size: 0.95rem;
    color: var(--pcb-text-muted);
    max-width: 700px;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }

  @media (min-width: 768px) {
    .pcb-clean-desc {
      font-size: 1.05rem;
    }
  }

  .pcb-clean-trust-list {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
    font-size: 0.85rem;
    color: #475569;
    font-weight: 600;
  }

  .pcb-trust-item {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .pcb-trust-icon {
    color: var(--pcb-success);
    font-weight: 800;
  }

  .pcb-trust-sep {
    color: #cbd5e1;
    display: none;
  }

  @media (min-width: 640px) {
    .pcb-trust-sep {
      display: inline;
    }
  }

  /* BARRA DE PRESETS RÁPIDOS */
  .pcb-header-templates-card {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    border-radius: 14px;
    padding: 1rem 1.15rem;
    width: 100%;
  }

  @media (min-width: 900px) {
    .pcb-header-templates-card {
      width: auto;
      min-width: 380px;
      max-width: 440px;
    }
  }

  .pcb-tpl-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .pcb-tpl-card-title {
    font-family: var(--pcb-font-display);
    font-weight: 800;
    font-size: 0.92rem;
    color: #0f172a;
  }

  .pcb-tpl-view-all-btn {
    background: none;
    border: none;
    color: var(--pcb-accent);
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0;
  }

  .pcb-tpl-pills-grid {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .pcb-tpl-pills-grid::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    .pcb-tpl-pills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      overflow-x: visible;
    }
  }

  .pcb-tpl-quick-pill {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    padding: 0.55rem 0.75rem;
    font-family: var(--pcb-font-display);
    font-size: 0.85rem;
    font-weight: 700;
    color: #334155;
    cursor: pointer;
    text-align: left;
    white-space: nowrap;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .pcb-tpl-quick-pill:hover {
    border-color: var(--pcb-accent);
    color: var(--pcb-accent);
    background: var(--pcb-accent-subtle);
    transform: translateY(-1px);
  }

  /* =========================================
     2. GRID PRINCIPAL (ACORDEÓN + RESUMEN)
     ========================================= */
  .pcb-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (min-width: 1080px) {
    .pcb-main-grid {
      grid-template-columns: 1.8fr 1.2fr;
      gap: 2rem;
    }
  }

  /* =========================================
     3. COLUMNA IZQUIERDA: ACORDEÓN DE PASOS
     ========================================= */
  .pcb-accordion-card {
    background: var(--pcb-card);
    border-radius: 16px;
    border: 1px solid var(--pcb-border);
    box-shadow: var(--pcb-shadow-sm);
    overflow: hidden;
  }

  .pcb-accordion-header-top {
    padding: 1.25rem 1.25rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    background: #ffffff;
  }

  @media (min-width: 768px) {
    .pcb-accordion-header-top {
      padding: 1.5rem 1.75rem;
    }
  }

  .pcb-accordion-main-title {
    font-family: var(--pcb-font-display);
    font-size: 1.45rem;
    font-weight: 900;
    color: var(--pcb-text);
    margin: 0 0 0.25rem 0;
    letter-spacing: -0.015em;
  }

  @media (min-width: 768px) {
    .pcb-accordion-main-title {
      font-size: 1.75rem;
    }
  }

  .pcb-accordion-main-desc {
    font-size: 0.92rem;
    color: var(--pcb-text-muted);
    margin: 0;
    line-height: 1.4;
  }

  .pcb-actions-dropdown-btn {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    color: #475569;
    font-family: var(--pcb-font-display);
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 38px;
  }

  .pcb-actions-dropdown-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #cbd5e1;
  }

  /* BARRA DE PROGRESO DE LOS 6 PASOS ESENCIALES */
  .pcb-progress-bar-wrap {
    padding: 0.85rem 1.25rem;
    background: #f8fafc;
    border-bottom: 1px solid var(--pcb-border);
  }

  @media (min-width: 768px) {
    .pcb-progress-bar-wrap {
      padding: 1rem 1.75rem;
    }
  }

  .pcb-progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.88rem;
  }

  .pcb-progress-label {
    font-weight: 700;
    color: #334155;
    font-family: var(--pcb-font-display);
  }

  .pcb-progress-count {
    color: #0f172a;
    font-weight: 800;
    font-family: var(--pcb-font-display);
  }

  .pcb-progress-track {
    width: 100%;
    height: 7px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.65rem;
  }

  .pcb-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #059669);
    border-radius: 9999px;
    transition: width 0.35s ease;
  }

  .pcb-essential-chips {
    display: flex;
    gap: 0.4rem;
    overflow-x: auto;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .pcb-essential-chips::-webkit-scrollbar {
    display: none;
  }

  .pcb-chip {
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #64748b;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s ease;
    flex-shrink: 0;
  }

  .pcb-chip:hover {
    border-color: #94a3b8;
    color: #0f172a;
  }

  .pcb-chip.completed {
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  }

  .pcb-chip.active {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1d4ed8;
  }

  /* LISTADO DE PASOS DEL ACORDEÓN */
  .pcb-steps-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .pcb-step-item {
    border-bottom: 1px solid var(--pcb-border-subtle);
    transition: background-color 0.15s ease, border-color 0.15s ease;
  }

  .pcb-step-item:last-child {
    border-bottom: none;
  }

  .pcb-step-item.active {
    background: #ffffff;
    box-shadow: inset 3px 0 0 0 var(--pcb-accent);
  }

  .pcb-step-header {
    padding: 1rem 1.15rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    gap: 0.75rem;
    background: #ffffff;
    min-height: 60px;
    transition: background-color 0.15s;
  }

  @media (min-width: 768px) {
    .pcb-step-header {
      padding: 1.25rem 1.75rem;
    }
  }

  .pcb-step-header:hover {
    background-color: #f8fafc;
  }

  .pcb-step-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-width: 0;
    flex: 1;
  }

  .pcb-step-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    background: #f1f5f9;
    border: 1px solid var(--pcb-border);
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .pcb-step-item.active .pcb-step-icon {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  .pcb-step-item.has-selection .pcb-step-icon {
    background: #ecfdf5;
    border-color: #a7f3d0;
  }

  .pcb-step-title-wrap {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 0.15rem;
  }

  .pcb-step-name {
    font-family: var(--pcb-font-display);
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--pcb-text);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    line-height: 1.25;
  }

  @media (min-width: 768px) {
    .pcb-step-name {
      font-size: 1.25rem;
    }
  }

  .pcb-badge-compat {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--pcb-success-text);
    background: var(--pcb-success-bg);
    border: 1px solid #a7f3d0;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
  }

  .pcb-step-status {
    font-size: 0.88rem;
    color: var(--pcb-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.35;
  }

  .pcb-step-status.selected {
    color: #047857;
    font-weight: 700;
  }

  .pcb-header-edit-btn {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #1e293b;
    font-family: var(--pcb-font-display);
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.35rem 0.65rem;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    min-height: 32px;
  }

  .pcb-header-edit-btn:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  .pcb-step-arrow {
    width: 20px;
    height: 20px;
    color: #94a3b8;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .pcb-step-item.active .pcb-step-arrow {
    transform: rotate(180deg);
    color: var(--pcb-accent);
  }

  .pcb-step-body {
    display: none;
    padding: 1.15rem 1rem;
    background: #fbfcfe;
    border-top: 1px solid var(--pcb-border-subtle);
  }

  @media (min-width: 768px) {
    .pcb-step-body {
      padding: 1.5rem 1.75rem;
    }
  }

  .pcb-step-item.active .pcb-step-body {
    display: block;
  }

  /* TARJETA DE COMPONENTE SELECCIONADO */
  .pcb-selected-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 14px;
    padding: 1.15rem 1.25rem;
    box-shadow: var(--pcb-shadow-sm);
    flex-wrap: wrap;
  }

  .pcb-selected-card-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 240px;
    flex: 1;
  }

  .pcb-selected-img {
    width: 70px;
    height: 70px;
    object-fit: contain;
    background: #f8fafc;
    border-radius: 10px;
    padding: 6px;
    border: 1px solid var(--pcb-border);
    flex-shrink: 0;
  }

  .pcb-selected-title {
    font-family: var(--pcb-font-display);
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 0.35rem 0;
    line-height: 1.3;
  }

  .pcb-selected-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #64748b;
  }

  .pcb-selected-card-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    border-top: 1px solid var(--pcb-border-subtle);
    padding-top: 0.85rem;
  }

  @media (min-width: 640px) {
    .pcb-selected-card-right {
      width: auto;
      border-top: none;
      padding-top: 0;
      justify-content: flex-end;
    }
  }

  .pcb-qty-picker-row {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .pcb-qty-label {
    font-size: 0.82rem;
    color: #64748b;
    font-weight: 600;
  }

  .pcb-component-stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
  }

  .pcb-comp-step-btn {
    background: #f8fafc;
    border: none;
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f172a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s;
  }

  .pcb-comp-step-btn:hover {
    background: #e2e8f0;
  }

  .pcb-comp-qty-input {
    width: 38px;
    height: 34px;
    border: none;
    border-left: 1px solid var(--pcb-border);
    border-right: 1px solid var(--pcb-border);
    text-align: center;
    font-family: var(--pcb-font-display);
    font-weight: 800;
    font-size: 1.05rem;
    color: #0f172a;
    -moz-appearance: textfield;
  }

  .pcb-comp-qty-input::-webkit-outer-spin-button,
  .pcb-comp-qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .pcb-selected-price-box {
    text-align: right;
  }

  .pcb-selected-price {
    font-family: var(--pcb-font-display);
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-selected-unit-price {
    font-size: 0.82rem;
    color: #64748b;
    font-weight: 600;
  }

  .pcb-selected-actions {
    display: flex;
    gap: 0.5rem;
  }

  .pcb-btn-change {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #0f172a;
    font-family: var(--pcb-font-display);
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 36px;
  }

  .pcb-btn-change:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  .pcb-btn-remove {
    background: #ffffff;
    border: 1px solid #fecaca;
    color: #dc2626;
    font-family: var(--pcb-font-display);
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 36px;
  }

  .pcb-btn-remove:hover {
    background: #fef2f2;
    border-color: #ef4444;
  }

  /* BARRA DE BÚSQUEDA Y FILTROS */
  .pcb-picker-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .pcb-search-wrap {
    flex: 1;
    min-width: 220px;
    position: relative;
  }

  .pcb-search-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
    font-size: 0.95rem;
  }

  .pcb-search-input {
    width: 100%;
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 10px;
    padding: 0.65rem 0.85rem 0.65rem 2.35rem;
    font-family: var(--pcb-font-main);
    font-size: 0.92rem;
    color: var(--pcb-text);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    min-height: 42px;
  }

  .pcb-search-input:focus {
    border-color: var(--pcb-accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }

  .pcb-stock-filter-toggle {
    display: inline-flex;
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    padding: 2px;
  }

  .pcb-stock-filter-btn {
    background: none;
    border: none;
    padding: 0.45rem 0.75rem;
    border-radius: 6px;
    font-family: var(--pcb-font-display);
    font-size: 0.85rem;
    font-weight: 700;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    min-height: 36px;
  }

  .pcb-stock-filter-btn.active {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 800;
  }

  /* PÍLDORAS DE SUBCATEGORÍA (PERIFÉRICOS, MUEBLES, ETC.) */
  .pcb-subcat-pills {
    display: flex;
    gap: 0.4rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 0.85rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .pcb-subcat-pills::-webkit-scrollbar {
    display: none;
  }

  .pcb-subcat-pill {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    padding: 0.4rem 0.75rem;
    font-size: 0.82rem;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    color: #475569;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .pcb-subcat-pill:hover {
    border-color: #94a3b8;
    color: #0f172a;
  }

  .pcb-subcat-pill.active {
    background: var(--pcb-accent-subtle);
    border-color: #bfdbfe;
    color: var(--pcb-accent);
    font-weight: 800;
  }

  /* GRID DE PRODUCTOS RESPONSIVE */
  .pcb-products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;
    max-height: 520px;
    overflow-y: auto;
    padding-right: 0.35rem;
    -webkit-overflow-scrolling: touch;
  }

  @media (min-width: 540px) {
    .pcb-products-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (min-width: 1200px) {
    .pcb-products-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.15rem;
    }
  }

  .pcb-product-option-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.15s ease;
    box-shadow: var(--pcb-shadow-sm);
  }

  .pcb-product-option-card:hover {
    border-color: #94a3b8;
    box-shadow: var(--pcb-shadow-md);
    transform: translateY(-2px);
  }

  .pcb-opt-top {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .pcb-opt-img-wrap {
    width: 100%;
    height: 125px;
    background: #f8fafc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #f1f5f9;
  }

  .pcb-opt-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .pcb-opt-info {
    display: flex;
    flex-direction: column;
  }

  .pcb-opt-stock-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.15rem 0.55rem;
    border-radius: 4px;
    margin-bottom: 0.35rem;
    width: fit-content;
  }

  .pcb-opt-stock-badge.in-stock {
    background: #ecfdf5;
    color: #065f46;
  }

  .pcb-opt-stock-badge.on-order {
    background: #fefce8;
    color: #854d0e;
  }

  .pcb-opt-title {
    font-family: var(--pcb-font-display);
    font-size: 0.98rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
    margin: 0 0 0.45rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6em;
  }

  .pcb-opt-tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    margin-bottom: 0.65rem;
  }

  .pcb-opt-tag {
    font-size: 0.74rem;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #e2e8f0;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    font-weight: 700;
  }

  .pcb-opt-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    gap: 0.5rem;
  }

  .pcb-opt-price-wrap {
    display: flex;
    flex-direction: column;
  }

  .pcb-opt-price {
    font-family: var(--pcb-font-display);
    font-size: 1.3rem;
    font-weight: 900;
    color: #0f172a;
    line-height: 1.1;
  }

  .pcb-opt-vat {
    font-size: 0.74rem;
    color: #64748b;
    font-weight: 500;
  }

  .pcb-opt-select-btn {
    background: #0f172a;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.88rem;
    font-weight: 800;
    padding: 0.55rem 0.95rem;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    min-height: 38px;
  }

  .pcb-opt-select-btn:hover {
    background: var(--pcb-accent);
    transform: translateY(-1px);
  }

  /* MODO EDICIÓN BANNER */
  .pcb-editing-banner {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .pcb-editing-text {
    font-size: 0.88rem;
    color: #1e40af;
  }

  .pcb-editing-cancel-btn {
    background: #ffffff;
    border: 1px solid #bfdbfe;
    color: #1e40af;
    font-family: var(--pcb-font-display);
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    min-height: 32px;
  }

  /* =========================================
     4. COLUMNA DERECHA: RESUMEN DE ENSAMBLE
     ========================================= */
  .pcb-summary-card {
    background: var(--pcb-card);
    border-radius: 16px;
    border: 1px solid var(--pcb-border);
    padding: 1.35rem 1.25rem;
    box-shadow: var(--pcb-shadow-sm);
  }

  @media (min-width: 1080px) {
    .pcb-summary-card {
      position: sticky;
      top: 24px;
      padding: 1.65rem 1.75rem;
    }
  }

  .pcb-summary-title {
    font-family: var(--pcb-font-display);
    font-size: 1.45rem;
    font-weight: 900;
    color: #0f172a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.15rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--pcb-border);
  }

  .pcb-summary-count {
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
    background: #f1f5f9;
    padding: 0.25rem 0.65rem;
    border-radius: 9999px;
  }

  /* WATÍMETRO */
  .pcb-watt-meter-card {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 0.95rem 1.1rem;
    margin-bottom: 1.15rem;
  }

  .pcb-watt-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.55rem;
  }

  .pcb-watt-label {
    font-family: var(--pcb-font-display);
    font-weight: 800;
    font-size: 0.92rem;
    color: #334155;
  }

  .pcb-watt-number {
    font-family: var(--pcb-font-display);
    font-weight: 900;
    font-size: 1.15rem;
    color: #0f172a;
  }

  .pcb-watt-bar-bg {
    width: 100%;
    height: 7px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.55rem;
  }

  .pcb-watt-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #0284c7);
    border-radius: 9999px;
    transition: width 0.35s ease;
  }

  .pcb-watt-rec {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #64748b;
  }

  .pcb-compat-alert {
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    color: #475569;
  }

  /* SLOTS VISUALES DE ENSAMBLE ("TU PC EN CONSTRUCCIÓN") */
  .pcb-slots-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.15rem;
    max-height: 380px;
    overflow-y: auto;
    padding-right: 2px;
  }

  .pcb-slot-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    border: 1px dashed var(--pcb-border);
    background: #ffffff;
    transition: all 0.15s ease;
    cursor: pointer;
  }

  .pcb-slot-row:hover {
    border-color: #94a3b8;
    background: #f8fafc;
  }

  .pcb-slot-row.filled {
    border: 1px solid var(--pcb-border);
    border-left: 3px solid var(--pcb-success);
    background: #ffffff;
  }

  .pcb-slot-left {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
    flex: 1;
  }

  .pcb-slot-icon {
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .pcb-slot-img {
    width: 38px;
    height: 38px;
    object-fit: contain;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    flex-shrink: 0;
  }

  .pcb-slot-info {
    min-width: 0;
  }

  .pcb-slot-cat {
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .pcb-slot-title {
    font-family: var(--pcb-font-display);
    font-size: 0.88rem;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcb-slot-pending {
    font-size: 0.82rem;
    color: #94a3b8;
    font-weight: 600;
  }

  .pcb-slot-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .pcb-slot-price {
    font-family: var(--pcb-font-display);
    font-size: 0.95rem;
    font-weight: 800;
    color: #0f172a;
  }

  .pcb-slot-add-hint {
    font-size: 0.78rem;
    color: var(--pcb-accent);
    font-weight: 700;
  }

  .pcb-slot-remove-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 2px 4px;
  }

  .pcb-slot-remove-btn:hover {
    color: #ef4444;
  }

  /* OPCIÓN DE ENSAMBLE PROFESIONAL */
  .pcb-assembly-option-card {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    margin-bottom: 1.15rem;
  }

  .pcb-assembly-check-label {
    display: flex;
    gap: 0.75rem;
    cursor: pointer;
    align-items: flex-start;
  }

  .pcb-assembly-check-label input {
    margin-top: 0.25rem;
    width: 18px;
    height: 18px;
    accent-color: var(--pcb-accent);
    cursor: pointer;
    flex-shrink: 0;
  }

  .pcb-assembly-title {
    font-family: var(--pcb-font-display);
    font-size: 0.95rem;
    font-weight: 800;
    color: #0f172a;
    display: block;
    margin-bottom: 0.2rem;
  }

  .pcb-assembly-desc {
    font-size: 0.82rem;
    color: #475569;
    display: block;
    line-height: 1.4;
  }

  /* TOTALES */
  .pcb-summary-totals {
    border-top: 1px solid var(--pcb-border);
    padding-top: 1rem;
    margin-bottom: 1.15rem;
  }

  .pcb-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: #475569;
    margin-bottom: 0.45rem;
    font-weight: 500;
  }

  .pcb-grand-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;
  }

  .pcb-grand-total-label {
    font-family: var(--pcb-font-display);
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
  }

  .pcb-grand-total-val {
    font-family: var(--pcb-font-display);
    font-size: 1.95rem;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .pcb-vat-hint {
    font-size: 0.78rem;
    color: #64748b;
    text-align: right;
    margin-top: 0.25rem;
  }

  /* BOTONES DE ACCIÓN */
  .pcb-summary-actions {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .pcb-btn-cart-main {
    width: 100%;
    background: #0f172a;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 0.95rem;
    font-family: var(--pcb-font-display);
    font-size: 1.05rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 48px;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
  }

  .pcb-btn-cart-main:hover {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.18);
  }

  .pcb-btn-quote-main {
    width: 100%;
    background: #ffffff;
    color: #1e293b;
    border: 1px solid var(--pcb-border);
    border-radius: 10px;
    padding: 0.85rem;
    font-family: var(--pcb-font-display);
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 44px;
  }

  .pcb-btn-quote-main:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }

  /* =========================================
     5. BARRA INFERIOR FLOTANTE (SÓLO MÓVIL)
     ========================================= */
  /* En computadoras de escritorio (min-width: 1080px), la barra fija se OCULTA COMPLETAMENTE
     porque la columna derecha ya es sticky y visible. Esto evita el choque con el botón de WhatsApp. */
  @media (min-width: 1080px) {
    .pcb-sticky-bar {
      display: none !important;
    }
  }

  /* En celulares y tablets, se muestra una barra compacta inferior */
  @media (max-width: 1079px) {
    .pcb-sticky-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-top: 1px solid var(--pcb-border);
      box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.08);
      padding: 0.65rem 1rem;
      padding-right: 80px; /* Área de despeje para el botón flotante de WhatsApp */
      z-index: 990;
    }

    .pcb-sticky-inner {
      max-width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .pcb-sticky-left {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .pcb-sticky-total-row {
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
    }

    .pcb-sticky-total-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }

    .pcb-sticky-total-amount {
      font-family: var(--pcb-font-display);
      font-size: 1.35rem;
      font-weight: 900;
      color: #0f172a;
      line-height: 1;
    }

    .pcb-sticky-pieces-link {
      background: none;
      border: none;
      color: var(--pcb-accent);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      text-align: left;
      text-decoration: underline;
    }

    .pcb-sticky-actions {
      display: flex;
      gap: 0.4rem;
      align-items: center;
    }

    .pcb-sticky-cart-btn {
      background: #0f172a;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 0.6rem 0.95rem;
      font-family: var(--pcb-font-display);
      font-size: 0.88rem;
      font-weight: 800;
      cursor: pointer;
      min-height: 40px;
      white-space: nowrap;
    }

    .pcb-sticky-quote-btn {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid var(--pcb-border);
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      font-family: var(--pcb-font-display);
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      min-height: 40px;
      display: none;
    }

    @media (min-width: 480px) {
      .pcb-sticky-quote-btn {
        display: inline-flex;
      }
    }
  }

  /* =========================================
     6. MODAL DE PLANTILLAS Y ENSAMBLES
     ========================================= */
  .pcb-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 1rem;
  }

  .pcb-modal-overlay.open {
    display: flex;
  }

  .pcb-modal-dialog {
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 840px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--pcb-shadow-lg);
  }

  .pcb-modal-header {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pcb-modal-title {
    font-family: var(--pcb-font-display);
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
    margin: 0;
  }

  .pcb-modal-close-btn {
    background: #f1f5f9;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    font-size: 1rem;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }

  .pcb-modal-close-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .pcb-modal-body {
    padding: 1.25rem 1.5rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .pcb-tpl-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.15rem;
  }

  @media (min-width: 640px) {
    .pcb-tpl-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .pcb-tpl-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.15s;
  }

  .pcb-tpl-card:hover {
    border-color: #94a3b8;
    box-shadow: var(--pcb-shadow-md);
  }

  .pcb-tpl-badge {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.15rem 0.55rem;
    border-radius: 4px;
    margin-bottom: 0.45rem;
    display: inline-block;
  }

  .pcb-tpl-title {
    font-family: var(--pcb-font-display);
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 0.35rem 0;
  }

  .pcb-tpl-desc {
    font-size: 0.85rem;
    color: #64748b;
    margin: 0 0 0.75rem 0;
    line-height: 1.4;
  }

  .pcb-tpl-specs-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    font-size: 0.8rem;
    color: #475569;
    line-height: 1.5;
  }

  .pcb-tpl-specs-list li {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
  }

  .pcb-tpl-price-box {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-top: 1px solid #f1f5f9;
    padding-top: 0.75rem;
    margin-top: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .pcb-tpl-price {
    font-family: var(--pcb-font-display);
    font-size: 1.25rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-tpl-btn-load {
    width: 100%;
    background: #0f172a;
    color: #ffffff;
    border: none;
    padding: 0.7rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.15s;
    min-height: 40px;
  }

  .pcb-tpl-btn-load:hover {
    background: var(--pcb-accent);
  }
</style>

<div class="pcb-wrapper">
  <div class="pcb-container">

    <!-- 1. ENCABEZADO MINIMALISTA, SOBRIO Y PRESETS RÁPIDOS -->
    <header class="pcb-clean-header">
      <div class="pcb-header-content">
        <div class="pcb-header-text">
          <div class="pcb-header-badge">
            <span class="pcb-pulse-dot"></span>
            <span>Configurador B2B & Gamer</span>
          </div>
          <h1 class="pcb-clean-title">Arma tu Computadora a la Medida</h1>
          <p class="pcb-clean-desc">
            Selecciona componentes con validación de compatibilidad en tiempo real. Incluye ensamble profesional, pruebas térmicas y factura fiscal CFDI 4.0.
          </p>
          <div class="pcb-clean-trust-list">
            <span class="pcb-trust-item"><span class="pcb-trust-icon">✓</span> 100% Nuevos</span>
            <span class="pcb-trust-sep">•</span>
            <span class="pcb-trust-item"><span class="pcb-trust-icon">✓</span> Ensamble & BIOS Actualizado</span>
            <span class="pcb-trust-sep">•</span>
            <span class="pcb-trust-item"><span class="pcb-trust-icon">✓</span> Factura CFDI 4.0 SAT</span>
          </div>
        </div>
        
        <!-- PRESETS RÁPIDOS ACCESIBLES EN 1 CLIC -->
        <div class="pcb-header-templates-card">
          <div class="pcb-tpl-card-top">
            <span class="pcb-tpl-card-title">⚡ Ensambles Sugeridos (1 Clic)</span>
            <button type="button" class="pcb-tpl-view-all-btn" onclick="pcbApp.openTemplatesModal('all')">Ver los 6 →</button>
          </div>
          <div class="pcb-tpl-pills-grid">
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.loadTemplateDirect('office_basic')">🏢 Oficina & PyME</button>
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.loadTemplateDirect('cctv_pro')">📹 CCTV 24/7</button>
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.loadTemplateDirect('gaming_esports')">🎮 Gamer E-Sports</button>
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.loadTemplateDirect('workstation_pro')">🏗️ Workstation 3D</button>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. GRID PRINCIPAL (ACORDEÓN INTERACTIVO + RESUMEN DE ENSAMBLE) -->
    <div class="pcb-main-grid">

      <!-- COLUMNA IZQUIERDA: PASOS DEL ENSAMBLE -->
      <div class="pcb-accordion-card">
        <div class="pcb-accordion-header-top">
          <div>
            <h2 class="pcb-accordion-main-title">Componentes del Equipo</h2>
            <p class="pcb-accordion-main-desc">Paso a paso con verificación automática de socket, RAM y requerimiento de energía.</p>
          </div>
          <button type="button" class="pcb-actions-dropdown-btn" onclick="pcbApp.resetConfig()" title="Limpiar y reiniciar ensamble">
            🔄 Reiniciar
          </button>
        </div>

        <!-- TRACKER DE PROGRESO DE LOS 6 PASOS ESENCIALES -->
        <div class="pcb-progress-bar-wrap">
          <div class="pcb-progress-meta">
            <span class="pcb-progress-label">🎯 Progreso del Ensamble:</span>
            <span class="pcb-progress-count" id="pcbProgressCount">0 de 6 esenciales listos</span>
          </div>
          <div class="pcb-progress-track">
            <div class="pcb-progress-fill" id="pcbProgressFill" style="width: 0%;"></div>
          </div>
          <div class="pcb-essential-chips">
            <span class="pcb-chip" id="pcbChip_cpu" onclick="pcbApp.toggleStep('cpu')">1. CPU</span>
            <span class="pcb-chip" id="pcbChip_mobo" onclick="pcbApp.toggleStep('mobo')">2. Placa Madre</span>
            <span class="pcb-chip" id="pcbChip_ram" onclick="pcbApp.toggleStep('ram')">3. RAM</span>
            <span class="pcb-chip" id="pcbChip_ssd" onclick="pcbApp.toggleStep('ssd')">4. SSD</span>
            <span class="pcb-chip" id="pcbChip_case" onclick="pcbApp.toggleStep('case')">5. Gabinete</span>
            <span class="pcb-chip" id="pcbChip_psu" onclick="pcbApp.toggleStep('psu')">6. Fuente</span>
          </div>
        </div>

        <!-- LISTA DINÁMICA DE PASOS -->
        <ul class="pcb-steps-list" id="pcbStepsList">
          <!-- Renderizado dinámico vía JavaScript -->
        </ul>
      </div>

      <!-- COLUMNA DERECHA: RESUMEN DEL ENSAMBLE Y SLOTS VISUALES -->
      <div class="pcb-summary-card" id="pcbSummaryCard">
        <div class="pcb-summary-title">
          <span>Tu Ensamble</span>
          <span class="pcb-summary-count" id="pcbSummaryCount">0 piezas</span>
        </div>

        <!-- ESTIMACIÓN ENERGÉTICA (WATÍMETRO) -->
        <div class="pcb-watt-meter-card" id="pcbWattMeterCard">
          <div class="pcb-watt-top">
            <span class="pcb-watt-label">⚡ Consumo Estimado:</span>
            <span class="pcb-watt-number" id="pcbWattVal">~65 Watts</span>
          </div>
          <div class="pcb-watt-bar-bg">
            <div class="pcb-watt-bar-fill" id="pcbWattBarFill" style="width: 15%;"></div>
          </div>
          <div class="pcb-watt-rec">
            <span>Fuente sugerida: <strong id="pcbWattRecVal">500W+</strong></span>
            <span class="pcb-watt-status-tag" id="pcbWattStatusTag" style="color: #d97706; font-weight:700;">🟡 Falta fuente</span>
          </div>
        </div>

        <!-- ALERTA DE COMPATIBILIDAD DINÁMICA -->
        <div class="pcb-compat-alert" id="pcbCompatAlert">
          <span>💡 Comienza seleccionando el procesador para validar compatibilidad.</span>
        </div>

        <!-- SLOTS VISUALES DE LA COMPUTADORA ("TU PC EN CONSTRUCCIÓN") -->
        <div class="pcb-slots-container" id="pcbSlotsContainer">
          <!-- Renderizado interactivo vía JavaScript -->
        </div>

        <!-- SERVICIO DE ENSAMBLE PROFESIONAL -->
        <div class="pcb-assembly-option-card">
          <label class="pcb-assembly-check-label">
            <input type="checkbox" id="pcbAssemblyCheck" checked onchange="pcbApp.toggleAssembly(this.checked)">
            <div>
              <span class="pcb-assembly-title">🛠️ Ensamble Profesional y Pruebas (+$999 MXN)</span>
              <span class="pcb-assembly-desc">Montaje antiestático certificado, cable management, actualización de BIOS y prueba de estrés térmico de 2h (+ $999 MXN).</span>
            </div>
          </label>
        </div>

        <!-- DESGLOSE DE TOTALES -->
        <div class="pcb-summary-totals">
          <div class="pcb-total-row">
            <span>Subtotal Componentes:</span>
            <strong id="pcbSubtotalText">$0.00</strong>
          </div>
          <div class="pcb-total-row" id="pcbAssemblyCostRow">
            <span>Servicio de Ensamble y Pruebas:</span>
            <strong id="pcbAssemblyCostText">$999.00</strong>
          </div>
          <div class="pcb-grand-total-row">
            <span class="pcb-grand-total-label">Total a Pagar:</span>
            <span class="pcb-grand-total-val" id="pcbGrandTotalText">$0.00</span>
          </div>
          <div class="pcb-vat-hint">Precios en MXN • Incluye 16% de IVA y Factura CFDI 4.0</div>
        </div>

        <!-- BOTONES DE COMPRA Y COTIZACIÓN -->
        <div class="pcb-summary-actions">
          <button type="button" class="pcb-btn-cart-main" id="pcbAddToCartBtnMain" onclick="pcbApp.addToCart()">
            🛒 Agregar al Carrito
          </button>
          <button type="button" class="pcb-btn-quote-main" onclick="pcbApp.createQuoteWhatsApp()">
            💬 Solicitar Cotización por WhatsApp
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- BARRA FIJA INFERIOR (SÓLO CELULARES / PANTALLAS < 1080px) -->
<div class="pcb-sticky-bar" id="pcbStickyMobileBar">
  <div class="pcb-sticky-inner">
    <div class="pcb-sticky-left">
      <div class="pcb-sticky-total-row">
        <span class="pcb-sticky-total-label">Total:</span>
        <span class="pcb-sticky-total-amount" id="pcbStickyTotalAmount">$0</span>
      </div>
      <button type="button" class="pcb-sticky-pieces-link" onclick="pcbApp.scrollToSummary()">
        <span id="pcbStickyPiecesText">0 de 6 piezas</span> • Ver desglose ▾
      </button>
    </div>
    <div class="pcb-sticky-actions">
      <button type="button" class="pcb-sticky-quote-btn" onclick="pcbApp.createQuoteWhatsApp()" title="Cotizar por WhatsApp">
        💬 Cotizar
      </button>
      <button type="button" class="pcb-sticky-cart-btn" id="pcbAddToCartBtnSticky" onclick="pcbApp.addToCart()">
        🛒 Comprar
      </button>
    </div>
  </div>
</div>

<!-- MODAL DE PLANTILLAS Y ENSAMBLES SUGERIDOS -->
<div class="pcb-modal-overlay" id="pcbTemplatesModal" onclick="pcbApp.closeTemplatesModal(event)">
  <div class="pcb-modal-dialog" onclick="event.stopPropagation()">
    <div class="pcb-modal-header">
      <div>
        <h3 class="pcb-modal-title">⚡ Ensambles Sugeridos & Plantillas</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin: 0.25rem 0 0 0;">Carga una configuración probada y optimizada en 1 solo clic.</p>
      </div>
      <button type="button" class="pcb-modal-close-btn" onclick="pcbApp.closeTemplatesModal()">✕</button>
    </div>
    <div class="pcb-modal-body">
      <div class="pcb-tpl-grid" id="pcbTemplatesGrid">
        <!-- Renderizado dinámico -->
      </div>
    </div>
  </div>
</div>

<!-- DATOS DEL CATÁLOGO EN JSON -->
<script id="pcb-catalog-data" type="application/json">
${catalogJson}
</script>

<!-- JAVASCRIPT DEL CONFIGURADOR -->
<script>
  (function() {
    const rawData = document.getElementById('pcb-catalog-data');
    if (!rawData) return;
    const CATALOG = JSON.parse(rawData.textContent);

    const STEP_CONFIG = [
      { key: 'cpu', name: '1. Procesador (CPU)', icon: '🧠', iconClass: 'pcb-icon-cpu', placeholder: 'Paso 1 • Seleccionar procesador' },
      { key: 'mobo', name: '2. Tarjeta Madre', icon: '🔌', iconClass: 'pcb-icon-mobo', placeholder: 'Paso 2 • Seleccionar tarjeta madre' },
      { key: 'ram', name: '3. Memoria RAM', icon: '⚡', iconClass: 'pcb-icon-ram', placeholder: 'Paso 3 • Seleccionar memoria RAM' },
      { key: 'ssd', name: '4. Almacenamiento SSD', icon: '💾', iconClass: 'pcb-icon-ssd', placeholder: 'Paso 4 • Seleccionar unidad SSD' },
      { key: 'case', name: '5. Gabinete (Chasis)', icon: '📦', iconClass: 'pcb-icon-case', placeholder: 'Paso 5 • Seleccionar gabinete' },
      { key: 'psu', name: '6. Fuente de Poder', icon: '🔋', iconClass: 'pcb-icon-psu', placeholder: 'Paso 6 • Seleccionar fuente de poder' },
      { key: 'gpu', name: '7. Tarjeta de Video (GPU)', icon: '🎮', iconClass: 'pcb-icon-gpu', placeholder: 'Opcional • Seleccionar tarjeta gráfica' },
      { key: 'cooler', name: '8. Enfriamiento y Disipador', icon: '❄️', iconClass: 'pcb-icon-cooler', placeholder: 'Opcional • Seleccionar disipador de calor' },
      { key: 'monitor', name: '9. Monitor y Pantalla', icon: '🖥️', iconClass: 'pcb-icon-monitor', placeholder: 'Opcional • Seleccionar monitor' },
      { key: 'peripherals', name: '10. Teclado y Mouse (Periféricos)', icon: '⌨️', iconClass: 'pcb-icon-peripherals', placeholder: 'Opcional • Seleccionar kit de teclado y mouse' },
      { key: 'furniture', name: '11. Sillas y Escritorios', icon: '💺', iconClass: 'pcb-icon-furniture', placeholder: 'Opcional • Seleccionar silla gamer, ejecutiva o escritorio' }
    ];

    const ESSENTIAL_KEYS = ['cpu', 'mobo', 'ram', 'ssd', 'case', 'psu'];

    window.pcbApp = {
      selected: {},
      systemQty: 1,
      includeAssembly: true,
      activeStep: 'cpu', // PASO 1 SIEMPRE ABIERTO POR DEFECTO PARA VER PRODUCTOS DE INMEDIATO
      editingStep: null,
      searchFilters: {},
      subFilters: {},
      onlyInStockFilter: {},
      fallbackImg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='4' width='16' height='16' rx='2'/%3E%3Cpath d='M9 9h6v6H9z'/%3E%3Cpath d='M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3'/%3E%3C/svg%3E",

      init: function() {
        this.renderAccordion();
        this.updateSummary();
        this.renderTemplates();
      },

      toggleAssembly: function(checked) {
        this.includeAssembly = checked;
        this.updateSummary();
      },

      toggleStockFilter: function(catKey, onlyStock) {
        this.onlyInStockFilter[catKey] = onlyStock;
        this.renderGridOnly(catKey);
        const btnAll = document.getElementById('pcbStockFilterAll_' + catKey);
        const btnStock = document.getElementById('pcbStockFilterStock_' + catKey);
        if (btnAll && btnStock) {
          if (onlyStock) {
            btnAll.classList.remove('active');
            btnStock.classList.add('active');
          } else {
            btnAll.classList.add('active');
            btnStock.classList.remove('active');
          }
        }
      },

      setSubFilter: function(catKey, filterVal) {
        this.subFilters[catKey] = filterVal;
        this.renderGridOnly(catKey);
        const container = document.getElementById('pcbSubFilterWrap_' + catKey);
        if (container) {
          const pills = container.querySelectorAll('.pcb-subcat-pill');
          pills.forEach(p => {
            if (p.getAttribute('data-filter') === filterVal) {
              p.classList.add('active');
            } else {
              p.classList.remove('active');
            }
          });
        }
      },

      handleSearch: function(catKey, val) {
        this.searchFilters[catKey] = val;
        this.renderGridOnly(catKey);
      },

      setItemQty: function(catKey, delta) {
        if (!this.selected[catKey]) return;
        let n = (this.selected[catKey].qty || 1) + delta;
        if (n < 1) n = 1;
        if (n > 8) n = 8;
        this.selected[catKey].qty = n;
        this.renderAccordion();
        this.updateSummary();
      },

      setItemQtyDirect: function(catKey, val) {
        if (!this.selected[catKey]) return;
        let n = parseInt(val, 10);
        if (isNaN(n) || n < 1) n = 1;
        if (n > 8) n = 8;
        this.selected[catKey].qty = n;
        this.renderAccordion();
        this.updateSummary();
      },

      toggleStep: function(key) {
        if (this.activeStep === key) {
          this.activeStep = null;
        } else {
          this.activeStep = key;
        }
        this.renderAccordion();
        
        // Auto scroll suave si es en celular
        if (this.activeStep && window.innerWidth < 768) {
          setTimeout(() => {
            const el = document.getElementById('pcbStepHeader_' + key);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      },

      editStep: function(key) {
        this.editingStep = key;
        this.activeStep = key;
        this.renderAccordion();
      },

      cancelEdit: function() {
        this.editingStep = null;
        this.renderAccordion();
      },

      removeItem: function(key) {
        delete this.selected[key];
        this.editingStep = null;
        this.renderAccordion();
        this.updateSummary();
      },

      resetConfig: function() {
        if (Object.keys(this.selected).length > 0) {
          if (!confirm('¿Deseas reiniciar la configuración de tu PC? Se quitarán las piezas seleccionadas.')) return;
        }
        this.selected = {};
        this.activeStep = 'cpu';
        this.editingStep = null;
        this.renderAccordion();
        this.updateSummary();
      },

      scrollToSummary: function() {
        const el = document.getElementById('pcbSummaryCard');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },

      selectItem: function(catKey, item) {
        const prevQty = this.selected[catKey] ? this.selected[catKey].qty : 1;
        this.selected[catKey] = { ...item, qty: prevQty || 1 };
        this.editingStep = null;

        // Validaciones automáticas de compatibilidad y avance al siguiente paso
        if (catKey === 'cpu') {
          if (this.selected['mobo']) {
            const currentMobo = this.selected['mobo'];
            if (currentMobo.socket && item.socket && currentMobo.socket !== item.socket) {
              delete this.selected['mobo'];
            }
          }
          this.activeStep = 'mobo';
        } else if (catKey === 'mobo') {
          if (this.selected['ram']) {
            const currentRam = this.selected['ram'];
            if (currentRam.ramType && item.ramType && currentRam.ramType !== item.ramType) {
              delete this.selected['ram'];
            }
          }
          this.activeStep = 'ram';
        } else if (catKey === 'ram') {
          this.activeStep = 'ssd';
        } else if (catKey === 'ssd') {
          this.activeStep = 'case';
        } else if (catKey === 'case') {
          this.activeStep = 'psu';
        } else if (catKey === 'psu') {
          this.activeStep = 'gpu';
        }

        this.renderAccordion();
        this.updateSummary();

        // En pantallas móviles, centrar suavemente el siguiente paso abierto
        if (this.activeStep && window.innerWidth < 768) {
          setTimeout(() => {
            const nextEl = document.getElementById('pcbStepHeader_' + this.activeStep);
            if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      },

      renderGridOnly: function(catKey) {
        const gridEl = document.getElementById('pcbGrid_' + catKey);
        if (!gridEl) return;

        const availableItems = this.getAvailableProducts(catKey);
        if (availableItems.length === 0) {
          gridEl.innerHTML = \`
            <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: #64748b; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">
              <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🔍</div>
              <p style="font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">No se encontraron componentes con los filtros actuales.</p>
              <p style="font-size: 0.85rem; margin: 0;">Prueba borrando el texto de búsqueda o cambiando el filtro de existencia.</p>
            </div>
          \`;
          return;
        }

        let html = '';
        availableItems.forEach(item => {
          const inStock = item.inStock !== false;
          html += \`
            <div class="pcb-product-option-card">
              <div class="pcb-opt-top">
                <div class="pcb-opt-img-wrap">
                  <img src="\${item.img}" alt="\${item.title}" class="pcb-opt-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
                </div>
                <div class="pcb-opt-info">
                  <span class="pcb-opt-stock-badge \${inStock ? 'in-stock' : 'on-order'}">
                    \${inStock ? '🟢 En Stock (24-48h)' : '🟡 Sobre Pedido (3-5 días)'}
                  </span>
                  <h4 class="pcb-opt-title" title="\${item.title}">\${item.title}</h4>
                  <div class="pcb-opt-tags">
                    \${item.category ? '<span class="pcb-opt-tag" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe;">' + item.category + '</span>' : ''}
                    \${item.socket ? '<span class="pcb-opt-tag">' + item.socket + '</span>' : ''}
                    \${item.ramType ? '<span class="pcb-opt-tag">' + item.ramType + '</span>' : ''}
                    \${item.capacity ? '<span class="pcb-opt-tag">' + item.capacity + '</span>' : ''}
                    \${item.watts ? '<span class="pcb-opt-tag">' + item.watts + '</span>' : ''}
                    \${item.hz ? '<span class="pcb-opt-tag">' + item.hz + '</span>' : ''}
                    \${item.coolerType ? '<span class="pcb-opt-tag">' + item.coolerType + '</span>' : ''}
                    \${item.vendor ? '<span class="pcb-opt-tag">' + item.vendor + '</span>' : ''}
                  </div>
                </div>
              </div>
              <div class="pcb-opt-bottom">
                <div class="pcb-opt-price-wrap">
                  <span class="pcb-opt-price">$\${item.price.toLocaleString('es-MX')}</span>
                  <span class="pcb-opt-vat">IVA incluido</span>
                </div>
                <button type="button" class="pcb-opt-select-btn" onclick='pcbApp.selectItem("\${catKey}", \${JSON.stringify(item)})'>
                  + Seleccionar
                </button>
              </div>
            </div>
          \`;
        });
        gridEl.innerHTML = html;
      },

      getAvailableProducts: function(catKey) {
        let items = CATALOG[catKey] || [];
        const selectedCpu = this.selected['cpu'];
        const selectedMobo = this.selected['mobo'];

        if (catKey === 'mobo' && selectedCpu && selectedCpu.socket) {
          items = items.filter(x => !x.socket || x.socket.toUpperCase() === selectedCpu.socket.toUpperCase());
        }

        if (catKey === 'ram' && selectedMobo && selectedMobo.ramType) {
          items = items.filter(x => !x.ramType || x.ramType.toUpperCase() === selectedMobo.ramType.toUpperCase());
        }

        if (this.onlyInStockFilter[catKey]) {
          items = items.filter(x => x.inStock !== false);
        }

        // Subcategory pill filtering
        const sub = (this.subFilters[catKey] || '').toLowerCase();
        if (sub) {
          items = items.filter(x => {
            const cat = (x.category || '').toLowerCase();
            const tit = (x.title || '').toLowerCase();
            return cat.includes(sub) || tit.includes(sub);
          });
        }

        // Search text filtering
        const query = (this.searchFilters[catKey] || '').toLowerCase().trim();
        if (query) {
          const terms = query.split(/\\s+/).filter(Boolean);
          items = items.filter(x => {
            const haystack = [
              x.title || '',
              x.vendor || '',
              x.sku || '',
              x.socket || '',
              x.ramType || '',
              x.capacity || '',
              x.watts || '',
              x.coolerType || '',
              x.hz || '',
              x.brand || '',
              x.category || '',
              x.isGamer ? 'gamer gaming rgb' : ''
            ].join(' ').toLowerCase();

            return terms.every(t => haystack.includes(t));
          });
        }

        return items;
      },

      renderAccordion: function() {
        const container = document.getElementById('pcbStepsList');
        if (!container) return;

        let html = '';

        STEP_CONFIG.forEach(step => {
          const isSelected = !!this.selected[step.key];
          const selectedItem = this.selected[step.key];
          const isActive = this.activeStep === step.key;
          const isEditing = this.editingStep === step.key;

          html += \`
            <li class="pcb-step-item \${isActive ? 'active' : ''} \${isSelected ? 'has-selection' : ''}">
              <div class="pcb-step-header" id="pcbStepHeader_\${step.key}" onclick="pcbApp.toggleStep('\${step.key}')">
                <div class="pcb-step-left">
                  <div class="pcb-step-icon \${step.iconClass}">\${step.icon}</div>
                  <div class="pcb-step-title-wrap">
                    <span class="pcb-step-name">
                      \${step.name}
                      \${isSelected ? '<span class="pcb-badge-compat">✓ Listo</span>' : ''}
                    </span>
                    <span class="pcb-step-status \${isSelected ? 'selected' : ''}">
                      \${isSelected ? selectedItem.title + ((selectedItem.qty || 1) > 1 ? ' (' + selectedItem.qty + ' pzas)' : '') + ' — $' + (selectedItem.price * (selectedItem.qty || 1)).toLocaleString('es-MX') + ' MXN' : step.placeholder}
                    </span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  \${isSelected ? \`
                    <button type="button" class="pcb-header-edit-btn" onclick="event.stopPropagation(); pcbApp.editStep('\${step.key}')" title="Editar este componente">
                      ✏️ Cambiar
                    </button>
                  \` : ''}
                  <svg class="pcb-step-arrow" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div class="pcb-step-body">
          \`;

          if (isSelected && !isEditing) {
            html += \`
              <div class="pcb-selected-card">
                <div class="pcb-selected-card-left">
                  <img src="\${selectedItem.img}" alt="\${selectedItem.title}" class="pcb-selected-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
                  <div>
                    <h4 class="pcb-selected-title">\${selectedItem.title}</h4>
                    <div style="margin: 0.25rem 0;">
                      <span class="pcb-opt-stock-badge \${selectedItem.inStock !== false ? 'in-stock' : 'on-order'}">
                        \${selectedItem.inStock !== false ? '🟢 En Stock (24-48h)' : '🟡 Sobre Pedido (3-5 días)'}
                      </span>
                      \${selectedItem.category ? '<span class="pcb-opt-tag" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; margin-left: 0.35rem;">' + selectedItem.category + '</span>' : ''}
                    </div>
                    <div class="pcb-selected-meta">
                      <span>Marca: <strong>\${selectedItem.vendor}</strong></span>
                      \${selectedItem.socket ? '<span>Socket: <strong>' + selectedItem.socket + '</strong></span>' : ''}
                      \${selectedItem.ramType ? '<span>Tipo: <strong>' + selectedItem.ramType + '</strong></span>' : ''}
                      \${selectedItem.sku ? '<span>SKU: ' + selectedItem.sku + '</span>' : ''}
                    </div>
                  </div>
                </div>
                <div class="pcb-selected-card-right">
                  <div class="pcb-qty-picker-row" title="Modificar cantidad de piezas">
                    <span class="pcb-qty-label">Cantidad:</span>
                    <div class="pcb-component-stepper">
                      <button type="button" class="pcb-comp-step-btn" onclick="pcbApp.setItemQty('\${step.key}', -1)" title="Disminuir cantidad">−</button>
                      <input type="number" min="1" max="8" value="\${selectedItem.qty || 1}" class="pcb-comp-qty-input" onchange="pcbApp.setItemQtyDirect('\${step.key}', this.value)">
                      <button type="button" class="pcb-comp-step-btn" onclick="pcbApp.setItemQty('\${step.key}', 1)" title="Aumentar cantidad">+</button>
                    </div>
                  </div>

                  <div class="pcb-selected-price-box">
                    <div class="pcb-selected-price">$\${(selectedItem.price * (selectedItem.qty || 1)).toLocaleString('es-MX')} MXN</div>
                    \${(selectedItem.qty || 1) > 1 ? '<div class="pcb-selected-unit-price">($' + selectedItem.price.toLocaleString('es-MX') + ' c/u)</div>' : ''}
                  </div>

                  <div class="pcb-selected-actions">
                    <button type="button" class="pcb-btn-change" onclick="pcbApp.editStep('\${step.key}')">✏️ Cambiar</button>
                    <button type="button" class="pcb-btn-remove" onclick="pcbApp.removeItem('\${step.key}')">Quitar</button>
                  </div>
                </div>
              </div>
            \`;
          } else {
            const availableItems = this.getAvailableProducts(step.key);
            html += \`
              <div class="pcb-picker-wrap">
                \${isEditing ? \`
                  <div class="pcb-editing-banner">
                    <div class="pcb-editing-text">
                      ✏️ <strong>Modo Edición:</strong> Elige otra opción para reemplazar <strong>\${selectedItem.title}</strong>.
                    </div>
                    <button type="button" class="pcb-editing-cancel-btn" onclick="pcbApp.cancelEdit()">✕ Conservar pieza actual</button>
                  </div>
                \` : ''}

                \${step.key === 'peripherals' ? \`
                  <div class="pcb-subcat-pills" id="pcbSubFilterWrap_peripherals">
                    <button type="button" class="pcb-subcat-pill \${!this.subFilters['peripherals'] ? 'active' : ''}" data-filter="" onclick="pcbApp.setSubFilter('peripherals', '')">🔘 Todos (12)</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['peripherals'] === 'kit' ? 'active' : ''}" data-filter="kit" onclick="pcbApp.setSubFilter('peripherals', 'kit')">📦 Kits Teclado + Mouse</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['peripherals'] === 'teclado' ? 'active' : ''}" data-filter="teclado" onclick="pcbApp.setSubFilter('peripherals', 'teclado')">⌨️ Teclados</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['peripherals'] === 'mouse' ? 'active' : ''}" data-filter="mouse" onclick="pcbApp.setSubFilter('peripherals', 'mouse')">🖱️ Mouses</button>
                  </div>
                \` : ''}

                \${step.key === 'furniture' ? \`
                  <div class="pcb-subcat-pills" id="pcbSubFilterWrap_furniture">
                    <button type="button" class="pcb-subcat-pill \${!this.subFilters['furniture'] ? 'active' : ''}" data-filter="" onclick="pcbApp.setSubFilter('furniture', '')">🔘 Todo el Mobiliario (11)</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['furniture'] === 'silla gamer' ? 'active' : ''}" data-filter="silla gamer" onclick="pcbApp.setSubFilter('furniture', 'silla gamer')">🎮 Sillas Gamer</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['furniture'] === 'silla ejecutiva' ? 'active' : ''}" data-filter="silla ejecutiva" onclick="pcbApp.setSubFilter('furniture', 'silla ejecutiva')">💼 Sillas Ejecutivas</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['furniture'] === 'escritorio' ? 'active' : ''}" data-filter="escritorio" onclick="pcbApp.setSubFilter('furniture', 'escritorio')">🖥️ Escritorios</button>
                  </div>
                \` : ''}

                <div class="pcb-picker-controls">
                  <div class="pcb-search-wrap">
                    <span class="pcb-search-icon">🔍</span>
                    <input type="text" class="pcb-search-input" id="pcbSearch_\${step.key}" placeholder="Buscar por modelo, marca o especificación..." 
                      value="\${this.searchFilters[step.key] || ''}" 
                      oninput="pcbApp.handleSearch('\${step.key}', this.value)">
                  </div>
                  <div class="pcb-stock-filter-toggle">
                    <button type="button" id="pcbStockFilterAll_\${step.key}" class="pcb-stock-filter-btn \${this.onlyInStockFilter[step.key] ? '' : 'active'}" onclick="pcbApp.toggleStockFilter('\${step.key}', false)">
                      📦 Todos
                    </button>
                    <button type="button" id="pcbStockFilterStock_\${step.key}" class="pcb-stock-filter-btn \${this.onlyInStockFilter[step.key] ? 'active' : ''}" onclick="pcbApp.toggleStockFilter('\${step.key}', true)">
                      🟢 En Stock
                    </button>
                  </div>
                </div>

                <div class="pcb-products-grid" id="pcbGrid_\${step.key}">
            \`;

            if (availableItems.length === 0) {
              html += \`
                <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem 1rem; color: #64748b; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">
                  <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🔍</div>
                  <p style="font-weight: 700; color: #0f172a; margin: 0 0 0.35rem 0;">No hay componentes disponibles con este criterio.</p>
                  <p style="font-size: 0.85rem; margin: 0;">Prueba limpiando la búsqueda o quitando el filtro de existencia.</p>
                </div>
              \`;
            } else {
              availableItems.forEach(item => {
                const inStock = item.inStock !== false;
                html += \`
                  <div class="pcb-product-option-card">
                    <div class="pcb-opt-top">
                      <div class="pcb-opt-img-wrap">
                        <img src="\${item.img}" alt="\${item.title}" class="pcb-opt-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
                      </div>
                      <div class="pcb-opt-info">
                        <span class="pcb-opt-stock-badge \${inStock ? 'in-stock' : 'on-order'}">
                          \${inStock ? '🟢 En Stock (24-48h)' : '🟡 Sobre Pedido (3-5 días)'}
                        </span>
                        <h4 class="pcb-opt-title" title="\${item.title}">\${item.title}</h4>
                        <div class="pcb-opt-tags">
                          \${item.category ? '<span class="pcb-opt-tag" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe;">' + item.category + '</span>' : ''}
                          \${item.socket ? '<span class="pcb-opt-tag">' + item.socket + '</span>' : ''}
                          \${item.ramType ? '<span class="pcb-opt-tag">' + item.ramType + '</span>' : ''}
                          \${item.capacity ? '<span class="pcb-opt-tag">' + item.capacity + '</span>' : ''}
                          \${item.watts ? '<span class="pcb-opt-tag">' + item.watts + '</span>' : ''}
                          \${item.hz ? '<span class="pcb-opt-tag">' + item.hz + '</span>' : ''}
                          \${item.coolerType ? '<span class="pcb-opt-tag">' + item.coolerType + '</span>' : ''}
                          \${item.vendor ? '<span class="pcb-opt-tag">' + item.vendor + '</span>' : ''}
                        </div>
                      </div>
                    </div>
                    <div class="pcb-opt-bottom">
                      <div class="pcb-opt-price-wrap">
                        <span class="pcb-opt-price">$\${item.price.toLocaleString('es-MX')}</span>
                        <span class="pcb-opt-vat">IVA incluido</span>
                      </div>
                      <button type="button" class="pcb-opt-select-btn" onclick='pcbApp.selectItem("\${step.key}", \${JSON.stringify(item)})'>
                        + Seleccionar
                      </button>
                    </div>
                  </div>
                \`;
              });
            }

            html += \`
                </div>
              </div>
            \`;
          }

          html += \`
              </div>
            </li>
          \`;
        });

        container.innerHTML = html;
      },

      updateProgressBar: function() {
        const countEl = document.getElementById('pcbProgressCount');
        const fillEl = document.getElementById('pcbProgressFill');

        let readyCount = 0;
        ESSENTIAL_KEYS.forEach(k => {
          const chip = document.getElementById('pcbChip_' + k);
          if (this.selected[k]) {
            readyCount++;
            if (chip) chip.classList.add('completed');
          } else {
            if (chip) chip.classList.remove('completed');
          }
          if (chip) {
            if (this.activeStep === k) {
              chip.classList.add('active');
            } else {
              chip.classList.remove('active');
            }
          }
        });

        const pct = Math.round((readyCount / ESSENTIAL_KEYS.length) * 100);
        if (countEl) countEl.textContent = readyCount + ' de ' + ESSENTIAL_KEYS.length + ' esenciales listos';
        if (fillEl) fillEl.style.width = pct + '%';

        const stickyPieces = document.getElementById('pcbStickyPiecesText');
        if (stickyPieces) {
          const totalPieces = Object.keys(this.selected).reduce((acc, k) => acc + (this.selected[k].qty || 1), 0);
          stickyPieces.textContent = totalPieces + (totalPieces === 1 ? ' pieza seleccionada' : ' piezas seleccionadas');
        }
      },

      updateWattMeter: function() {
        const valEl = document.getElementById('pcbWattVal');
        const recEl = document.getElementById('pcbWattRecVal');
        const fillEl = document.getElementById('pcbWattBarFill');
        const statusTag = document.getElementById('pcbWattStatusTag');

        let estimatedWatts = 50; // Placa madre y ventiladores base

        const cpu = this.selected['cpu'];
        const gpu = this.selected['gpu'];
        const psu = this.selected['psu'];

        if (cpu) {
          const t = cpu.title.toLowerCase();
          if (t.includes('i9') || t.includes('ryzen 9') || t.includes('14900') || t.includes('7900')) {
            estimatedWatts += 170;
          } else if (t.includes('i7') || t.includes('ryzen 7') || t.includes('14700') || t.includes('7700') || t.includes('5700')) {
            estimatedWatts += 115;
          } else if (t.includes('i5') || t.includes('ryzen 5') || t.includes('14400') || t.includes('5600') || t.includes('5500')) {
            estimatedWatts += 85;
          } else {
            estimatedWatts += 65;
          }
        }

        if (gpu) {
          const t = gpu.title.toLowerCase();
          if (t.includes('rtx5070') || t.includes('5070') || t.includes('4070')) {
            estimatedWatts += 250;
          } else if (t.includes('rx9060xt') || t.includes('4060') || t.includes('5060teagle')) {
            estimatedWatts += 175;
          } else {
            estimatedWatts += 140;
          }
        }

        const suggestedPsuWatts = Math.max(500, Math.ceil((estimatedWatts * 1.35) / 50) * 50);

        if (valEl) valEl.textContent = '~' + estimatedWatts + ' Watts';
        if (recEl) recEl.textContent = suggestedPsuWatts + 'W+';
        if (fillEl) {
          const barPct = Math.min(100, Math.round((estimatedWatts / 650) * 100));
          fillEl.style.width = Math.max(15, barPct) + '%';
        }

        if (statusTag) {
          if (psu) {
            statusTag.textContent = '🟢 Fuente asignada';
            statusTag.style.color = '#059669';
          } else {
            statusTag.textContent = '🟡 Falta fuente';
            statusTag.style.color = '#d97706';
          }
        }
      },

      renderVisualSlots: function() {
        const container = document.getElementById('pcbSlotsContainer');
        if (!container) return;

        const slotsToShow = [
          { key: 'cpu', label: 'Procesador', icon: '🧠' },
          { key: 'mobo', label: 'Tarjeta Madre', icon: '🔌' },
          { key: 'ram', label: 'Memoria RAM', icon: '⚡' },
          { key: 'ssd', label: 'Almacenamiento SSD', icon: '💾' },
          { key: 'case', label: 'Gabinete', icon: '📦' },
          { key: 'psu', label: 'Fuente de Poder', icon: '🔋' }
        ];

        if (this.selected['gpu']) {
          slotsToShow.push({ key: 'gpu', label: 'Tarjeta de Video', icon: '🎮' });
        }
        if (this.selected['cooler']) {
          slotsToShow.push({ key: 'cooler', label: 'Enfriamiento', icon: '❄️' });
        }
        if (this.selected['monitor']) {
          slotsToShow.push({ key: 'monitor', label: 'Monitor', icon: '🖥️' });
        }
        if (this.selected['peripherals']) {
          slotsToShow.push({ key: 'peripherals', label: 'Periféricos', icon: '⌨️' });
        }
        if (this.selected['furniture']) {
          slotsToShow.push({ key: 'furniture', label: 'Mobiliario', icon: '💺' });
        }

        let html = '';
        slotsToShow.forEach(slot => {
          const item = this.selected[slot.key];
          if (item) {
            const lineTotal = item.price * (item.qty || 1);
            html += \`
              <div class="pcb-slot-row filled" onclick="pcbApp.editStep('\${slot.key}')" title="Clic para modificar \${slot.label}">
                <div class="pcb-slot-left">
                  <img src="\${item.img}" alt="\${item.title}" class="pcb-slot-img" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
                  <div class="pcb-slot-info">
                    <div class="pcb-slot-cat">\${slot.label}</div>
                    <div class="pcb-slot-title">\${item.title}</div>
                  </div>
                </div>
                <div class="pcb-slot-right">
                  <span class="pcb-slot-price">$\${lineTotal.toLocaleString('es-MX')}</span>
                  <button type="button" class="pcb-slot-remove-btn" onclick="event.stopPropagation(); pcbApp.removeItem('\${slot.key}')" title="Quitar">✕</button>
                </div>
              </div>
            \`;
          } else {
            html += \`
              <div class="pcb-slot-row" onclick="pcbApp.toggleStep('\${slot.key}')" title="Clic para elegir \${slot.label}">
                <div class="pcb-slot-left">
                  <span class="pcb-slot-icon">\${slot.icon}</span>
                  <div class="pcb-slot-info">
                    <div class="pcb-slot-cat">\${slot.label}</div>
                    <div class="pcb-slot-pending">Pendiente de elegir</div>
                  </div>
                </div>
                <div class="pcb-slot-right">
                  <span class="pcb-slot-add-hint">+ Elegir</span>
                </div>
              </div>
            \`;
          }
        });

        container.innerHTML = html;
      },

      updateSummary: function() {
        const countEl = document.getElementById('pcbSummaryCount');
        const subtotalEl = document.getElementById('pcbSubtotalText');
        const totalEl = document.getElementById('pcbGrandTotalText');
        const stickyTotalEl = document.getElementById('pcbStickyTotalAmount');
        const alertEl = document.getElementById('pcbCompatAlert');
        const assemblyCostEl = document.getElementById('pcbAssemblyCostText');

        const keys = Object.keys(this.selected);
        let totalSingle = 0;
        let totalCount = 0;

        this.updateProgressBar();
        this.updateWattMeter();
        this.renderVisualSlots();

        if (keys.length === 0) {
          if (countEl) countEl.textContent = '0 piezas';
          if (subtotalEl) subtotalEl.textContent = '$0.00';
          if (assemblyCostEl) assemblyCostEl.textContent = this.includeAssembly ? '$999.00' : '$0.00';
          if (totalEl) totalEl.textContent = '$0.00';
          if (stickyTotalEl) stickyTotalEl.textContent = '$0';
          if (alertEl) {
            alertEl.innerHTML = '<span>💡 Comienza seleccionando el procesador para validar compatibilidad.</span>';
            alertEl.style.background = '#f8fafc';
            alertEl.style.borderColor = '#e2e8f0';
            alertEl.style.color = '#475569';
          }
          return;
        }

        keys.forEach(k => {
          const item = this.selected[k];
          const qty = item.qty || 1;
          totalCount += qty;
          totalSingle += item.price * qty;
        });

        const assemblyCost = this.includeAssembly ? (999 * this.systemQty) : 0;
        const assemblyRow = document.getElementById('pcbAssemblyCostRow');
        if (assemblyRow) {
          assemblyRow.style.display = this.includeAssembly ? 'flex' : 'none';
        }
        if (assemblyCostEl) {
          assemblyCostEl.textContent = '$' + assemblyCost.toLocaleString('es-MX') + '.00';
        }

        const grandTotal = (totalSingle * this.systemQty) + assemblyCost;

        if (countEl) countEl.textContent = totalCount + (totalCount === 1 ? ' pieza' : ' piezas');
        if (subtotalEl) subtotalEl.textContent = '$' + (totalSingle * this.systemQty).toLocaleString('es-MX') + '.00';
        if (totalEl) totalEl.textContent = '$' + grandTotal.toLocaleString('es-MX') + '.00';
        if (stickyTotalEl) stickyTotalEl.textContent = '$' + grandTotal.toLocaleString('es-MX');

        if (alertEl) {
          const missing = ESSENTIAL_KEYS.filter(k => !this.selected[k]);
          if (keys.length === 0) {
            alertEl.innerHTML = '<span>💡 Comienza seleccionando el procesador para validar compatibilidad.</span>';
            alertEl.style.background = '#f8fafc';
            alertEl.style.borderColor = '#e2e8f0';
            alertEl.style.color = '#475569';
          } else if (missing.length === 0) {
            alertEl.innerHTML = '<span>✓ Compatibilidad verificada: Todo listo para ensamble.</span>';
            alertEl.style.background = '#ecfdf5';
            alertEl.style.borderColor = '#a7f3d0';
            alertEl.style.color = '#065f46';
          } else {
            const nextMissing = STEP_CONFIG.find(x => x.key === missing[0]);
            const missingName = nextMissing ? nextMissing.name.replace(/^\\d+\\.\\s*/, '') : missing[0];
            alertEl.innerHTML = '<span>⚙️ Siguiente paso sugerido: <strong>' + missingName + '</strong>.</span>';
            alertEl.style.background = '#eff6ff';
            alertEl.style.borderColor = '#bfdbfe';
            alertEl.style.color = '#1e40af';
          }
        }
      },

      TEMPLATES: [
        {
          id: 'office_basic',
          tag: 'Oficina / Home Office',
          tagColor: '#eff6ff',
          tagTextColor: '#1d4ed8',
          title: 'Oficina & PyME Productiva',
          desc: 'Excelente rendimiento para administración, navegación multitarea, contabilidad y videoconferencias fluidas.',
          specs: [
            'Procesador Intel Core i3-12100 / 4 Cores 8 Hilos',
            'Placa Madre ASUS Prime H610M-K DDR4',
            'Memoria Kingston Fury Beast DDR4',
            'Almacenamiento SSD 500GB NVMe Alta Velocidad',
            'Gabinete ACTECK Bern con Fuente 500W'
          ],
          components: {
            cpu: 'procesador-intel-core-i3-12100-lga1700',
            mobo: 'asus-prime-h610m-k-mbdass6240',
            ram: 'kingston-technology-fury-beast-memkgn2870',
            ssd: 'adata-legend-860-ddudat2210',
            case: 'acteck-bern-gabgen125',
            psu: 'acteck-es-05001e-gabact380'
          }
        },
        {
          id: 'cctv_pro',
          tag: 'Seguridad 24/7',
          tagColor: '#fef3c7',
          tagTextColor: '#92400e',
          title: 'CCTV Monitoreo & NVR Station',
          desc: 'Optimizado para grabación continua, visualización multipantalla de cámaras IP y alta durabilidad térmica.',
          specs: [
            'Procesador Intel Core i5-12400F 4.4GHz',
            'Placa Madre GIGABYTE H610M-K',
            'Memoria 32GB RAM ADATA DDR4',
            'Almacenamiento SSD 1TB NVMe M.2',
            'Tarjeta Gráfica MSI GeForce GT 1030 2GB',
            'Gabinete Ventilado con Fuente Certificada 500W'
          ],
          components: {
            cpu: 'procesador-intel-core-i5-12400f-lga1700',
            mobo: 'gigabyte-mb-gigabyte-h610m-k-ddr4-mbdgig5040',
            ram: 'adata-ad4u320032g22-sgn-memdat6130',
            ssd: 'adata-legend-860-ddudat2190',
            case: 'acteck-kioto-gc460-rgb-essential-gabact170',
            psu: 'acteck-es-05003e-gabact370',
            gpu: 'tarjeta-de-video-msi-geforce-gt-1030-2gb'
          }
        },
        {
          id: 'gaming_esports',
          tag: 'Gamer E-Sports',
          tagColor: '#ecfdf5',
          tagTextColor: '#065f46',
          title: 'Gamer E-Sports RTX',
          desc: 'Máxima tasa de FPS en 1080p y 1440p para Fortnite, Warzone, Valorant, GTA V y streaming simultáneo.',
          specs: [
            'Procesador AMD Ryzen 5 5500 / 6 Cores 12 Hilos',
            'Tarjeta Madre ASUS PRIME B550M-K',
            'Memoria 16GB RAM ADATA GAMMIX D35 DDR4',
            'Almacenamiento SSD 1TB NVMe M.2',
            'Tarjeta de Video GIGABYTE RTX 5060 Ti 8GB',
            'Gabinete Gamer ACTECK GM767 + Fuente 650W'
          ],
          components: {
            cpu: 'amd-5500-cpuamd2520',
            mobo: 'asus-prime-b550m-k-mbdass4950',
            ram: 'adata-gammix-d35-memdat6870',
            ssd: 'adata-legend-860-ddudat2190',
            case: 'acteck-gm767-gabact600',
            psu: 'balam-rush-650pr-gabblr530',
            gpu: 'tarjeta-de-video-gigabyte-rtx-5060-ti-windforce-8gb'
          }
        },
        {
          id: 'workstation_pro',
          tag: 'Creadores & 3D',
          tagColor: '#f3e8ff',
          tagTextColor: '#6b21a8',
          title: 'Workstation Pro 3D & Render',
          desc: 'Estación de trabajo para AutoCAD, Revit, Adobe Premiere 4K, SolidWorks y renderizado intensivo.',
          specs: [
            'Procesador AMD Ryzen 7 9700X / 8 Núcleos 16 Hilos AM5',
            'Placa Madre GIGABYTE B650 EAGLE AX WiFi DDR5',
            'Memoria 16GB/32GB RAM ADATA HUNTER DDR5',
            'Almacenamiento SSD 2TB NVMe Gen4 Ultra',
            'Tarjeta de Video ASUS Dual RTX 5070 12GB',
            'Gabinete Mesh + Fuente 750W 80 Plus Gold'
          ],
          components: {
            cpu: 'amd-7-9700x-cpuamd2740',
            mobo: 'gigabyte-b650-eagle-ax-mbdgig5110',
            ram: 'adata-hunter-ddr5-memdat7420',
            ssd: 'adata-legend-900-ddudat2100',
            case: 'acteck-onex-gs455-gabact610',
            psu: 'balam-rush-gr750g-gabblr480',
            gpu: 'asus-90yv0m17-m0aa00-tviass3910'
          }
        },
        {
          id: 'gamer_intel_extreme',
          tag: 'Gamer Extremo',
          tagColor: '#fee2e2',
          tagTextColor: '#991b1b',
          title: 'Gamer Extremo Core i7 + RTX',
          desc: 'Potencia pura para juegos en resolución 4K y renderizado gráfico sin límites con arquitectura Intel de 14a Generación.',
          specs: [
            'Procesador Intel Core i7-14700K (14a Gen) / 20 Núcleos',
            'Placa Madre GIGABYTE B760M D3HP DDR4',
            'Memoria 32GB RAM Kingston Fury Beast',
            'Almacenamiento SSD 2TB NVMe M.2',
            'Tarjeta de Video ASUS Dual RTX 5070 12GB',
            'Gabinete Gaming GM767 + Fuente 750W Gold'
          ],
          components: {
            cpu: 'procesador-intel-core-i7-14700k-lga1700',
            mobo: 'gigabyte-mb-gigabyte-b760m-d3hp-mbdgig5180',
            ram: 'kingston-technology-fury-beast-memkgn3250',
            ssd: 'adata-legend-900-ddudat2100',
            case: 'acteck-gm767-gabact600',
            psu: 'balam-rush-gr750g-gabblr480',
            gpu: 'asus-90yv0m17-m0aa00-tviass3910'
          }
        },
        {
          id: 'streaming_creator',
          tag: 'Streaming & Video',
          tagColor: '#e0e7ff',
          tagTextColor: '#3730a3',
          title: 'Creator Studio & Streaming',
          desc: 'Configuración ideal para creadores de contenido, streamers de Twitch/YouTube y edición fotográfica.',
          specs: [
            'Procesador AMD Ryzen 7 5700X / 8 Núcleos 16 Hilos',
            'Tarjeta Madre ASUS PRIME B550M-K',
            'Memoria 32GB RAM Kingston Fury Beast',
            'Almacenamiento SSD 1TB NVMe M.2',
            'Tarjeta de Video GIGABYTE RTX 5060 Ti 8GB',
            'Gabinete KIOTO GC460 RGB + Fuente 650W'
          ],
          components: {
            cpu: 'amd-5700x-cpuamd2500',
            mobo: 'asus-prime-b550m-k-mbdass4950',
            ram: 'kingston-technology-fury-beast-memkgn3250',
            ssd: 'adata-legend-860-ddudat2190',
            case: 'acteck-kioto-gc460-rgb-essential-gabact170',
            psu: 'balam-rush-650pr-gabblr530',
            gpu: 'tarjeta-de-video-gigabyte-rtx-5060-ti-windforce-8gb'
          }
        }
      ],

      renderTemplates: function() {
        const container = document.getElementById('pcbTemplatesGrid');
        if (!container) return;

        let html = '';
        this.TEMPLATES.forEach(tpl => {
          let price = 0;
          Object.keys(tpl.components).forEach(cat => {
            const idOrKey = tpl.components[cat];
            const list = CATALOG[cat] || [];
            let item = list.find(x => x.id === idOrKey || (x.sku && x.sku.toLowerCase().includes(idOrKey.toLowerCase())));
            if (!item) {
              item = list.find(x => x.title.toLowerCase().includes(idOrKey.toLowerCase()));
            }
            if (item) price += item.price;
          });

          if (price === 0) price = 8999;

          html += \`
            <div class="pcb-tpl-card">
              <div>
                <span class="pcb-tpl-badge" style="background:\${tpl.tagColor}; color:\${tpl.tagTextColor};">\${tpl.tag}</span>
                <h4 class="pcb-tpl-title">\${tpl.title}</h4>
                <p class="pcb-tpl-desc">\${tpl.desc}</p>
                <ul class="pcb-tpl-specs-list">
                  \${tpl.specs.map(s => '<li><span>•</span> <span>' + s + '</span></li>').join('')}
                </ul>
              </div>
              <div>
                <div class="pcb-tpl-price-box">
                  <span style="font-size:0.82rem; color:#64748b; font-weight:600;">Total componentes:</span>
                  <span class="pcb-tpl-price">$\${price.toLocaleString('es-MX')} MXN</span>
                </div>
                <button type="button" class="pcb-tpl-btn-load" onclick="pcbApp.loadTemplateDirect('\${tpl.id}')">
                  ⚡ Cargar esta Configuración
                </button>
              </div>
            </div>
          \`;
        });

        container.innerHTML = html;
      },

      openTemplatesModal: function(category) {
        const m = document.getElementById('pcbTemplatesModal');
        if (m) m.classList.add('open');
      },

      closeTemplatesModal: function() {
        const m = document.getElementById('pcbTemplatesModal');
        if (m) m.classList.remove('open');
      },

      loadTemplateDirect: function(templateId) {
        const tpl = this.TEMPLATES.find(x => x.id === templateId);
        if (!tpl) return;

        this.selected = {};

        for (const cat in tpl.components) {
          const idOrKey = tpl.components[cat];
          const list = CATALOG[cat] || [];
          let found = list.find(x => x.id === idOrKey || (x.sku && x.sku.toLowerCase().includes(idOrKey.toLowerCase())));
          if (!found) {
            found = list.find(x => x.title.toLowerCase().includes(idOrKey.toLowerCase()));
          }
          if (found) {
            this.selected[cat] = { ...found, qty: 1 };
          }
        }

        this.activeStep = null;
        this.renderAccordion();
        this.updateSummary();
        this.closeTemplatesModal();

        if (window.innerWidth < 768) {
          setTimeout(() => {
            const el = document.getElementById('pcbSummaryCard');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      },

      addToCart: function() {
        const keys = Object.keys(this.selected);
        if (keys.length === 0) {
          alert('Por favor selecciona al menos un componente para continuar.');
          return;
        }

        const itemsToAdd = [];

        keys.forEach(k => {
          const item = this.selected[k];
          if (item.variantId) {
            itemsToAdd.push({
              id: parseInt(item.variantId, 10),
              quantity: (item.qty || 1) * this.systemQty,
              properties: {
                '_Componente': k.toUpperCase(),
                '_Configuracion_PC': 'Equipo a Medida Seguridad Avanzada'
              }
            });
          }
        });

        if (this.includeAssembly) {
          // Servicio de Ensamble Profesional y Pruebas
          itemsToAdd.push({
            id: 52774689276036,
            quantity: this.systemQty,
            properties: {
              '_Servicio': 'Ensamble Profesional y Pruebas Térmicas',
              '_Garantia': '1 año soporte oficial'
            }
          });
        }

        const btn = document.getElementById('pcbAddToCartBtnMain');
        const btnSticky = document.getElementById('pcbAddToCartBtnSticky');
        if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Agregando al carrito...'; }
        if (btnSticky) { btnSticky.disabled = true; btnSticky.innerHTML = '⏳ Agregando...'; }

        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsToAdd })
        })
        .then(res => {
          if (!res.ok) throw new Error('Error al agregar al carrito de compras');
          return res.json();
        })
        .then(() => {
          window.location.href = '/cart';
        })
        .catch(err => {
          console.error(err);
          if (btn) { btn.disabled = false; btn.innerHTML = '🛒 Agregar al Carrito'; }
          if (btnSticky) { btnSticky.disabled = false; btnSticky.innerHTML = '🛒 Comprar'; }
          alert('No fue posible agregar todos los componentes al carrito en este momento. Puedes solicitar tu cotización formal por WhatsApp con 1 clic.');
        });
      },

      createQuoteWhatsApp: function() {
        const keys = Object.keys(this.selected);
        if (keys.length === 0) {
          alert('Selecciona al menos un componente para generar tu cotización.');
          return;
        }

        let totalSingle = 0;
        let msg = 'Hola Seguridad Avanzada, deseo cotizar el siguiente ensamble de PC personalizado:\\n\\n';

        keys.forEach(k => {
          const item = this.selected[k];
          const qty = item.qty || 1;
          const lineTotal = item.price * qty;
          totalSingle += lineTotal;
          const stepObj = STEP_CONFIG.find(x => x.key === k);
          const catName = stepObj ? stepObj.name : k;
          msg += '• ' + catName + ': ' + item.title + (qty > 1 ? ' (' + qty + ' pzas)' : '') + ' - $' + lineTotal.toLocaleString('es-MX') + ' MXN\\n';
        });

        const assemblyCost = this.includeAssembly ? (999 * this.systemQty) : 0;
        if (this.includeAssembly) {
          msg += '• Servicio de Ensamble y Pruebas Térmicas: $' + assemblyCost.toLocaleString('es-MX') + '.00 MXN\\n';
        }

        const grandTotal = (totalSingle * this.systemQty) + assemblyCost;

        msg += '\\nTotal Estimado: $' + grandTotal.toLocaleString('es-MX') + ' MXN (IVA incluido 16% CFDI 4.0)';
        msg += '\\n\\n¿Me podrían confirmar disponibilidad y tiempo de entrega por favor?';

        const url = 'https://wa.me/523318257008?text=' + encodeURIComponent(msg);
        window.open(url, '_blank');
      }
    };

    document.addEventListener('DOMContentLoaded', function() {
      pcbApp.init();
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      pcbApp.init();
    }
  })();
</script>

{% schema %}
{
  "name": "Configurador de PC",
  "settings": [],
  "presets": [
    {
      "name": "Configurador de PC"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync('sections/page-configurador-pc.liquid', newLiquidContent, 'utf8');
console.log('Successfully written responsive, mobile-first, high-UX configurator to sections/page-configurador-pc.liquid!');
