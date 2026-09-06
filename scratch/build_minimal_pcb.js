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
  Diseño Minimalista, Sobrio y de Cero Fricción
  Tipografía refinada (Outfit & Plus Jakarta Sans), paleta monocromática elegante,
  acceso inmediato a componentes, watímetro integrado y cotizaciones formales.
{% endcomment %}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  :root {
    --pcb-font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --pcb-font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;

    --pcb-primary: #0f172a;
    --pcb-primary-hover: #1e293b;
    --pcb-accent: #0284c7;
    --pcb-accent-hover: #0369a1;
    
    --pcb-border: #e2e8f0;
    --pcb-border-subtle: #f1f5f9;
    --pcb-border-active: #0284c7;
    
    --pcb-bg: #f8fafc;
    --pcb-card: #ffffff;
    
    --pcb-text: #0f172a;
    --pcb-text-muted: #64748b;
    --pcb-text-light: #94a3b8;
    
    --pcb-success: #10b981;
    --pcb-success-bg: #ecfdf5;
    --pcb-success-text: #065f46;
  }

  .pcb-wrapper {
    background-color: var(--pcb-bg);
    min-height: 100vh;
    padding-bottom: 110px;
    font-family: var(--pcb-font-main);
    color: var(--pcb-text);
    -webkit-font-smoothing: antialiased;
  }

  .pcb-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.75rem 1.25rem;
  }

  /* =========================================
     1. ENCABEZADO MINIMALISTA Y SOBRIO
     ========================================= */
  .pcb-clean-header {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 16px;
    padding: 2rem 2.25rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  }

  .pcb-header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .pcb-header-text {
    flex: 1;
    min-width: 320px;
  }

  .pcb-header-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    background: #f1f5f9;
    color: #334155;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.88rem;
    padding: 0.35rem 0.85rem;
    border-radius: 9999px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    margin-bottom: 0.85rem;
    border: 1px solid #e2e8f0;
  }

  .pcb-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
  }

  .pcb-clean-title {
    font-family: var(--pcb-font-display);
    font-size: 2.6rem;
    font-weight: 900;
    line-height: 1.18;
    margin: 0 0 0.6rem 0;
    color: #0f172a;
    letter-spacing: -0.025em;
  }

  .pcb-clean-desc {
    font-size: 1.1rem;
    color: var(--pcb-text-muted);
    max-width: 720px;
    line-height: 1.55;
    margin: 0 0 1.25rem 0;
  }

  .pcb-clean-trust-list {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    font-size: 0.95rem;
    color: #334155;
    font-weight: 600;
  }

  .pcb-trust-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .pcb-trust-icon {
    color: #059669;
    font-weight: 800;
  }

  .pcb-trust-sep {
    color: #cbd5e1;
  }

  .pcb-header-templates-card {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    border-radius: 14px;
    padding: 1.35rem 1.5rem;
    min-width: 340px;
  }

  .pcb-tpl-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.85rem;
  }

  .pcb-tpl-card-title {
    font-family: var(--pcb-font-display);
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
  }

  .pcb-tpl-view-all-btn {
    background: transparent;
    border: none;
    color: var(--pcb-accent);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
  }

  .pcb-tpl-view-all-btn:hover {
    color: var(--pcb-accent-hover);
    text-decoration: underline;
  }

  .pcb-tpl-pills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .pcb-tpl-quick-pill {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #1e293b;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s ease;
  }

  .pcb-tpl-quick-pill:hover {
    border-color: #94a3b8;
    background: #f1f5f9;
    color: #0f172a;
  }

  /* =========================================
     2. GRID PRINCIPAL (ACORDEÓN + RESUMEN)
     ========================================= */
  .pcb-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: start;
  }

  @media (min-width: 1080px) {
    .pcb-main-grid {
      grid-template-columns: 1.85fr 1.15fr;
    }
  }

  /* =========================================
     3. COLUMNA IZQUIERDA: ACORDEÓN DE PASOS
     ========================================= */
  .pcb-accordion-card {
    background: var(--pcb-card);
    border-radius: 16px;
    border: 1px solid var(--pcb-border);
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    overflow: hidden;
  }

  .pcb-accordion-header-top {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    background: #ffffff;
  }

  .pcb-accordion-main-title {
    font-family: var(--pcb-font-display);
    font-size: 1.75rem;
    font-weight: 900;
    color: var(--pcb-text);
    margin: 0 0 0.35rem 0;
    letter-spacing: -0.015em;
  }

  .pcb-accordion-main-desc {
    font-size: 1.05rem;
    color: var(--pcb-text-muted);
    margin: 0;
    line-height: 1.45;
  }

  .pcb-actions-dropdown-btn {
    background: #ffffff;
    color: #334155;
    border: 1px solid var(--pcb-border);
    padding: 0.6rem 1.15rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: all 0.15s ease;
  }

  .pcb-actions-dropdown-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  /* BARRA DE AVANCE DINÁMICA (STEP TRACKER) */
  .pcb-progress-bar-wrap {
    padding: 1.25rem 2rem;
    background: #f8fafc;
    border-bottom: 1px solid var(--pcb-border);
  }

  .pcb-progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.65rem;
    font-size: 1.02rem;
  }

  .pcb-progress-label {
    font-family: var(--pcb-font-display);
    font-weight: 800;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .pcb-progress-count {
    font-family: var(--pcb-font-display);
    font-weight: 800;
    color: #059669;
    background: #ffffff;
    padding: 0.25rem 0.85rem;
    border-radius: 9999px;
    border: 1px solid #bbf7d0;
    font-size: 0.92rem;
  }

  .pcb-progress-track {
    height: 8px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .pcb-progress-fill {
    height: 100%;
    width: 0%;
    background: #0284c7;
    border-radius: 9999px;
    transition: width 0.3s ease;
  }

  .pcb-essential-chips {
    display: flex;
    gap: 0.55rem;
    margin-top: 0.85rem;
    flex-wrap: wrap;
  }

  .pcb-chip {
    font-size: 0.85rem;
    font-weight: 700;
    padding: 0.3rem 0.65rem;
    border-radius: 6px;
    background: #ffffff;
    color: #475569;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }

  .pcb-chip:hover {
    border-color: #94a3b8;
    color: #0f172a;
  }

  .pcb-chip.done {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }

  /* LISTA DE PASOS (ITEMS DEL ACORDEÓN) */
  .pcb-steps-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pcb-step-item {
    border-bottom: 1px solid var(--pcb-border);
    transition: all 0.15s ease;
  }

  .pcb-step-item:last-child {
    border-bottom: none;
  }

  .pcb-step-item.active {
    background: #ffffff;
  }

  .pcb-step-header {
    padding: 1.35rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s ease;
  }

  .pcb-step-header:hover {
    background: #f8fafc;
  }

  .pcb-step-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex: 1;
    min-width: 0;
  }

  /* Iconos sobrios y neutrales */
  .pcb-step-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.45rem;
    flex-shrink: 0;
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    color: #1e293b;
  }

  .pcb-step-title-wrap {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .pcb-step-name {
    font-family: var(--pcb-font-display);
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--pcb-text);
    display: flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
  }

  .pcb-badge-compat {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
    font-size: 0.82rem;
    font-weight: 800;
    padding: 0.2rem 0.65rem;
    border-radius: 9999px;
  }

  .pcb-step-status {
    font-size: 1rem;
    font-weight: 600;
    color: var(--pcb-text-muted);
    margin-top: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcb-step-status.selected {
    color: #059669;
    font-weight: 700;
  }

  .pcb-header-edit-btn {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #1e293b;
    padding: 0.45rem 0.95rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-header-edit-btn:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
  }

  .pcb-step-arrow {
    width: 24px;
    height: 24px;
    color: #94a3b8;
    transition: transform 0.2s ease;
  }

  .pcb-step-item.active .pcb-step-arrow {
    transform: rotate(180deg);
  }

  .pcb-step-body {
    display: none;
    padding: 1.5rem 2rem;
    background: #fbfcfe;
    border-top: 1px solid var(--pcb-border-subtle);
  }

  .pcb-step-item.active .pcb-step-body {
    display: block;
  }

  /* TARJETA DE COMPONENTE SELECCIONADO */
  .pcb-selected-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 14px;
    padding: 1.35rem 1.65rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
    flex-wrap: wrap;
  }

  .pcb-selected-card-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex: 1;
    min-width: 280px;
  }

  .pcb-selected-img {
    width: 75px;
    height: 75px;
    object-fit: contain;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    padding: 6px;
    flex-shrink: 0;
  }

  .pcb-selected-title {
    font-family: var(--pcb-font-display);
    font-size: 1.2rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 0.35rem 0;
    line-height: 1.35;
  }

  .pcb-selected-meta {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    font-size: 0.92rem;
    color: #475569;
  }

  .pcb-selected-card-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .pcb-qty-picker-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .pcb-qty-label {
    font-size: 0.95rem;
    font-weight: 700;
    color: #475569;
  }

  .pcb-component-stepper {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
  }

  .pcb-comp-step-btn {
    background: #f8fafc;
    border: none;
    width: 34px;
    height: 34px;
    font-size: 1.15rem;
    font-weight: 800;
    color: #1e293b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
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
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    background: #ffffff;
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
    font-size: 1.45rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-selected-unit-price {
    font-size: 0.88rem;
    color: #64748b;
    font-weight: 600;
  }

  .pcb-selected-actions {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .pcb-btn-change {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid var(--pcb-border);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-btn-change:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  .pcb-btn-remove {
    background: #ffffff;
    color: #dc2626;
    border: 1px solid #fecaca;
    padding: 0.5rem 0.95rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-btn-remove:hover {
    background: #fee2e2;
  }

  /* SELECTOR DE PRODUCTOS (PICKER) */
  .pcb-picker-wrap {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .pcb-editing-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 0.85rem 1.25rem;
    font-size: 0.98rem;
    color: #166534;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .pcb-editing-cancel-btn {
    background: #ffffff;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 0.35rem 0.85rem;
    border-radius: 6px;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
  }

  /* PÍLDORAS DE SUBCATEGORÍA */
  .pcb-subcat-pills {
    display: flex;
    gap: 0.55rem;
    flex-wrap: wrap;
  }

  .pcb-subcat-pill {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #334155;
    padding: 0.5rem 1.15rem;
    border-radius: 9999px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-subcat-pill:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
  }

  .pcb-subcat-pill.active {
    background: #0f172a;
    color: #ffffff;
    border-color: #0f172a;
  }

  /* CONTROLES DE BÚSQUEDA Y FILTRO STOCK */
  .pcb-picker-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .pcb-search-wrap {
    flex: 1;
    min-width: 260px;
    position: relative;
  }

  .pcb-search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    font-size: 1.15rem;
    pointer-events: none;
  }

  .pcb-search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.6rem;
    border: 1px solid var(--pcb-border);
    border-radius: 10px;
    font-family: var(--pcb-font-main);
    font-size: 1rem;
    color: #0f172a;
    background: #ffffff;
    outline: none;
    transition: border-color 0.15s;
  }

  .pcb-search-input:focus {
    border-color: var(--pcb-accent);
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  }

  .pcb-stock-filter-toggle {
    display: inline-flex;
    border: 1px solid var(--pcb-border);
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
  }

  .pcb-stock-filter-btn {
    background: transparent;
    border: none;
    padding: 0.65rem 1.05rem;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    color: #475569;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-stock-filter-btn.active {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 800;
  }

  /* GRID DE PRODUCTOS */
  .pcb-products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.25rem;
    max-height: 560px;
    overflow-y: auto;
    padding-right: 0.45rem;
  }

  .pcb-product-option-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 14px;
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.15s ease;
  }

  .pcb-product-option-card:hover {
    border-color: #94a3b8;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
  }

  .pcb-opt-top {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .pcb-opt-img-wrap {
    width: 100%;
    height: 140px;
    background: #f8fafc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
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
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    margin-bottom: 0.45rem;
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
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.35;
    margin: 0 0 0.55rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pcb-opt-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-bottom: 0.85rem;
  }

  .pcb-opt-tag {
    font-size: 0.8rem;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #e2e8f0;
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    font-weight: 700;
  }

  .pcb-opt-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    padding-top: 0.85rem;
    margin-top: 0.65rem;
  }

  .pcb-opt-price-wrap {
    display: flex;
    flex-direction: column;
  }

  .pcb-opt-price {
    font-family: var(--pcb-font-display);
    font-size: 1.45rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-opt-vat {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
  }

  .pcb-opt-select-btn {
    background: #0f172a;
    color: #ffffff;
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.15s;
  }

  .pcb-opt-select-btn:hover {
    background: #1e293b;
  }

  /* =========================================
     4. COLUMNA DERECHA: RESUMEN DEL ENSAMBLE
     ========================================= */
  .pcb-summary-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 16px;
    padding: 1.75rem 2rem;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    position: sticky;
    top: 20px;
  }

  .pcb-summary-title {
    font-family: var(--pcb-font-display);
    font-size: 1.55rem;
    font-weight: 900;
    color: #0f172a;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.35rem;
    padding-bottom: 0.95rem;
    border-bottom: 1px solid var(--pcb-border);
  }

  .pcb-summary-count {
    font-size: 0.92rem;
    font-weight: 800;
    color: #334155;
    background: #f1f5f9;
    padding: 0.25rem 0.85rem;
    border-radius: 9999px;
  }

  /* WATÍMETRO SOBRIO Y LIMPIO */
  .pcb-watt-meter-card {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin-bottom: 1.25rem;
  }

  .pcb-watt-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .pcb-watt-label {
    font-family: var(--pcb-font-display);
    font-size: 0.95rem;
    font-weight: 800;
    color: #334155;
  }

  .pcb-watt-number {
    font-family: var(--pcb-font-display);
    font-size: 1.25rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-watt-bar-bg {
    height: 7px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .pcb-watt-bar-fill {
    height: 100%;
    width: 20%;
    background: #0284c7;
    border-radius: 9999px;
    transition: width 0.3s ease;
  }

  .pcb-watt-rec {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.88rem;
    color: #475569;
    font-weight: 600;
  }

  .pcb-watt-status-tag {
    font-weight: 800;
    font-size: 0.85rem;
  }

  .pcb-compat-alert {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    color: #166534;
    margin-bottom: 1.25rem;
    font-weight: 600;
  }

  .pcb-summary-list {
    max-height: 280px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-bottom: 1.25rem;
    padding-right: 0.35rem;
  }

  .pcb-summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 0.85rem;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    font-size: 0.92rem;
  }

  .pcb-summary-item-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .pcb-summary-item-img {
    width: 38px;
    height: 38px;
    object-fit: contain;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 3px;
    flex-shrink: 0;
  }

  .pcb-summary-item-title {
    font-weight: 700;
    color: #0f172a;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcb-summary-item-qty {
    color: #64748b;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .pcb-summary-item-price {
    font-family: var(--pcb-font-display);
    font-weight: 800;
    color: #0f172a;
    font-size: 1.1rem;
    margin-left: 0.75rem;
    white-space: nowrap;
  }

  /* OPCIÓN DE SERVICIO DE ENSAMBLE */
  .pcb-assembly-option-card {
    background: #f8fafc;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    margin-bottom: 1.35rem;
  }

  .pcb-assembly-check-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
  }

  .pcb-assembly-title {
    font-family: var(--pcb-font-display);
    font-size: 1.02rem;
    font-weight: 800;
    color: #0f172a;
    display: block;
    margin-bottom: 0.25rem;
  }

  .pcb-assembly-desc {
    font-size: 0.88rem;
    color: #475569;
    display: block;
    line-height: 1.45;
  }

  .pcb-summary-totals {
    border-top: 1px solid var(--pcb-border);
    padding-top: 1.15rem;
    margin-bottom: 1.35rem;
  }

  .pcb-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.02rem;
    color: #475569;
    margin-bottom: 0.55rem;
    font-weight: 500;
  }

  .pcb-grand-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 0.85rem;
    padding-top: 0.85rem;
    border-top: 1px solid #f1f5f9;
  }

  .pcb-grand-total-label {
    font-family: var(--pcb-font-display);
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
  }

  .pcb-grand-total-val {
    font-family: var(--pcb-font-display);
    font-size: 2.1rem;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .pcb-vat-hint {
    font-size: 0.82rem;
    color: #64748b;
    text-align: right;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  .pcb-summary-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .pcb-btn-cart-main {
    background: #0f172a;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 1.1rem;
    font-family: var(--pcb-font-display);
    font-size: 1.15rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    transition: all 0.15s ease;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.15);
  }

  .pcb-btn-cart-main:hover {
    background: #1e293b;
    transform: translateY(-1px);
  }

  .pcb-btn-quote-main {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1rem;
    font-family: var(--pcb-font-display);
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.55rem;
    transition: all 0.15s ease;
  }

  .pcb-btn-quote-main:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }

  /* =========================================
     5. BARRA FLOTANTE INFERIOR
     ========================================= */
  .pcb-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid var(--pcb-border);
    box-shadow: 0 -4px 16px rgba(15, 23, 42, 0.06);
    padding: 1rem 1.75rem;
    z-index: 990;
  }

  .pcb-sticky-inner {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    padding-right: 85px; /* Espacio para no chocar con widget flotante de WhatsApp */
  }

  .pcb-sticky-left {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .pcb-delivery-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #334155;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.98rem;
    background: #f1f5f9;
    padding: 0.45rem 0.95rem;
    border-radius: 8px;
  }

  .pcb-qty-stepper {
    display: flex;
    align-items: center;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    overflow: hidden;
    background: #ffffff;
  }

  .pcb-qty-btn {
    background: #f8fafc;
    border: none;
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pcb-qty-btn:hover {
    background: #e2e8f0;
  }

  .pcb-qty-val {
    width: 42px;
    text-align: center;
    font-family: var(--pcb-font-display);
    font-weight: 800;
    font-size: 1.1rem;
  }

  .pcb-sticky-total {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }

  .pcb-sticky-total-label {
    font-size: 0.95rem;
    color: #64748b;
    font-weight: 600;
  }

  .pcb-sticky-total-amount {
    font-family: var(--pcb-font-display);
    font-size: 1.85rem;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .pcb-sticky-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .pcb-btn-cart {
    background: #0f172a;
    color: #ffffff;
    border: none;
    padding: 0.85rem 1.6rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-size: 1.08rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pcb-btn-cart:hover {
    background: #1e293b;
  }

  .pcb-btn-quote {
    background: #ffffff;
    color: #1e293b;
    border: 1px solid var(--pcb-border);
    padding: 0.85rem 1.35rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-size: 1.02rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pcb-btn-quote:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }

  /* MODAL DE PLANTILLAS */
  .pcb-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .pcb-modal-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .pcb-modal-dialog {
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 1040px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
    overflow: hidden;
  }

  .pcb-modal-header {
    padding: 1.25rem 1.75rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pcb-modal-title {
    font-family: var(--pcb-font-display);
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
  }

  .pcb-modal-close-btn {
    background: #f1f5f9;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #475569;
    font-size: 1.1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pcb-modal-close-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
  }

  .pcb-modal-tabs {
    display: flex;
    gap: 0.5rem;
    padding: 0.85rem 1.75rem;
    background: #f8fafc;
    border-bottom: 1px solid var(--pcb-border);
    overflow-x: auto;
  }

  .pcb-modal-tab-btn {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    color: #475569;
    padding: 0.4rem 0.85rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .pcb-modal-tab-btn.active {
    background: #0f172a;
    color: #ffffff;
    border-color: #0f172a;
  }

  .pcb-modal-body {
    padding: 1.5rem 1.75rem;
    overflow-y: auto;
    flex: 1;
  }

  .pcb-templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .pcb-template-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.15s;
  }

  .pcb-template-card:hover {
    border-color: #94a3b8;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
  }

  .pcb-tpl-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
    background: #f1f5f9;
    color: #475569;
    margin-bottom: 0.5rem;
  }

  .pcb-tpl-title {
    font-family: var(--pcb-font-display);
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 0.35rem 0;
  }

  .pcb-tpl-desc {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .pcb-tpl-specs-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem 0;
    font-size: 0.8rem;
    color: #334155;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .pcb-tpl-specs-list li {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .pcb-tpl-price-box {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
    padding-top: 0.85rem;
    border-top: 1px solid #f1f5f9;
  }

  .pcb-tpl-price {
    font-family: var(--pcb-font-display);
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-tpl-actions {
    display: flex;
    gap: 0.5rem;
  }

  .pcb-tpl-btn-load {
    flex: 1;
    background: #0f172a;
    color: #ffffff;
    border: none;
    padding: 0.65rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
  }

  .pcb-tpl-btn-load:hover {
    background: #1e293b;
  }

  .pcb-modal-footer {
    padding: 1rem 1.75rem;
    background: #f8fafc;
    border-top: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: #64748b;
  }
</style>

<div class="pcb-wrapper">
  <div class="pcb-container">

    <!-- 1. ENCABEZADO MINIMALISTA Y SOBRIO -->
    <header class="pcb-clean-header">
      <div class="pcb-header-content">
        <div class="pcb-header-text">
          <div class="pcb-header-badge">
            <span class="pcb-pulse-dot"></span>
            <span>Configurador de Equipos B2B & Gamer</span>
          </div>
          <h1 class="pcb-clean-title">Arma tu Computadora a la Medida</h1>
          <p class="pcb-clean-desc">
            Selecciona componentes compatibles en tiempo real con ensamble certificado, pruebas térmicas y factura fiscal CFDI 4.0.
          </p>
          <div class="pcb-clean-trust-list">
            <span class="pcb-trust-item"><span class="pcb-trust-icon">✓</span> Componentes 100% Nuevos</span>
            <span class="pcb-trust-sep">•</span>
            <span class="pcb-trust-item"><span class="pcb-trust-icon">✓</span> Ensamble y BIOS Actualizado</span>
            <span class="pcb-trust-sep">•</span>
            <span class="pcb-trust-item"><span class="pcb-trust-icon">✓</span> Factura CFDI 4.0 SAT</span>
          </div>
        </div>
        
        <div class="pcb-header-templates-card">
          <div class="pcb-tpl-card-top">
            <span class="pcb-tpl-card-title">⚡ Ensambles Recomendados</span>
            <button type="button" class="pcb-tpl-view-all-btn" onclick="pcbApp.openTemplatesModal('all')">Ver los 6 →</button>
          </div>
          <div class="pcb-tpl-pills-grid">
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.openTemplatesModal('office')">🏢 Oficina & PyME</button>
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.openTemplatesModal('cctv')">📹 CCTV Monitoreo</button>
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.openTemplatesModal('gaming')">🎮 Gamer E-Sports</button>
            <button type="button" class="pcb-tpl-quick-pill" onclick="pcbApp.openTemplatesModal('workstation')">🏗️ Workstation 3D</button>
          </div>
        </div>
      </div>
    </header>

    <!-- 2. GRID PRINCIPAL (ACORDEÓN + RESUMEN) -->
    <div class="pcb-main-grid">

      <!-- COLUMNA IZQUIERDA: ACORDEÓN DE COMPONENTES -->
      <div class="pcb-accordion-card">
        <div class="pcb-accordion-header-top">
          <div>
            <h2 class="pcb-accordion-main-title">Componentes del Equipo</h2>
            <p class="pcb-accordion-main-desc">Selecciona cada pieza. Nuestro sistema valida compatibilidad de socket y memoria automáticamente.</p>
          </div>
          <button type="button" class="pcb-actions-dropdown-btn" onclick="pcbApp.resetConfig()">
            🔄 Reiniciar
          </button>
        </div>

        <!-- BARRA DE AVANCE DINÁMICA DEL ENSAMBLE (TRACKER) -->
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

        <ul class="pcb-steps-list" id="pcbStepsList">
          <!-- Renderizado dinámico vía JavaScript -->
        </ul>
      </div>

      <!-- COLUMNA DERECHA: RESUMEN STICKY -->
      <div class="pcb-summary-card">
        <div class="pcb-summary-title">
          <span>Resumen de Ensamble</span>
          <span class="pcb-summary-count" id="pcbSummaryCount">0 piezas</span>
        </div>

        <!-- WATÍMETRO / ESTIMACIÓN ENERGÉTICA EN TIEMPO REAL -->
        <div class="pcb-watt-meter-card" id="pcbWattMeterCard">
          <div class="pcb-watt-top">
            <span class="pcb-watt-label">⚡ Consumo Estimado:</span>
            <span class="pcb-watt-number" id="pcbWattVal">~120 Watts</span>
          </div>
          <div class="pcb-watt-bar-bg">
            <div class="pcb-watt-bar-fill" id="pcbWattBarFill" style="width: 20%;"></div>
          </div>
          <div class="pcb-watt-rec">
            <span>Fuente sugerida: <strong id="pcbWattRecVal">500W+</strong></span>
            <span class="pcb-watt-status-tag" id="pcbWattStatusTag" style="color: #059669;">🟢 En rango</span>
          </div>
        </div>

        <div class="pcb-compat-alert" id="pcbCompatAlert">
          <span>✓ Compatibilidad verificada: Todo listo para ensamble.</span>
        </div>

        <div class="pcb-summary-list" id="pcbSummaryList">
          <div style="text-align: center; color: #94a3b8; padding: 2rem 1rem; font-size: 0.88rem;">
            Aún no has agregado componentes. Haz clic en las categorías de la izquierda para comenzar.
          </div>
        </div>

        <!-- Opción de Servicio de Ensamble Profesional -->
        <div class="pcb-assembly-option-card">
          <label class="pcb-assembly-check-label">
            <input type="checkbox" id="pcbAssemblyCheck" checked onchange="pcbApp.toggleAssembly(this.checked)">
            <div>
              <span class="pcb-assembly-title">🛠️ Ensamble Profesional y Pruebas (+$499 MXN)</span>
              <span class="pcb-assembly-desc">Montaje antiestático certificado, ordenamiento de cableado (cable management), actualización de BIOS y prueba de estrés térmico de 2h.</span>
            </div>
          </label>
        </div>

        <!-- Desglose de Totales -->
        <div class="pcb-summary-totals">
          <div class="pcb-total-row">
            <span>Subtotal Componentes:</span>
            <strong id="pcbSubtotalText">$0.00</strong>
          </div>
          <div class="pcb-total-row" id="pcbAssemblyCostRow">
            <span>Servicio de Ensamble y Pruebas:</span>
            <strong id="pcbAssemblyCostText">$499.00</strong>
          </div>
          <div class="pcb-grand-total-row">
            <span class="pcb-grand-total-label">Total a Pagar:</span>
            <span class="pcb-grand-total-val" id="pcbGrandTotalText">$499.00</span>
          </div>
          <div class="pcb-vat-hint">Precios en MXN • Incluye 16% de IVA y Factura CFDI 4.0</div>
        </div>

        <!-- Botones de Acción Directa -->
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

<!-- MODAL DE PLANTILLAS Y ENSAMBLES RECOMENDADOS -->
<div class="pcb-modal-overlay" id="pcbTemplatesModal" onclick="pcbApp.closeTemplatesModal(event)">
  <div class="pcb-modal-dialog" onclick="event.stopPropagation()">
    <div class="pcb-modal-header">
      <div>
        <h3 class="pcb-modal-title">⚡ Plantillas Rápidas & Ensambles Sugeridos</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin: 0.25rem 0 0 0;">Carga una configuración probada y optimizada en 1 solo clic.</p>
      </div>
      <button type="button" class="pcb-modal-close-btn" onclick="pcbApp.closeTemplatesModal()">✕</button>
    </div>

    <div class="pcb-modal-tabs">
      <button type="button" class="pcb-modal-tab-btn active" data-cat="all" onclick="pcbApp.filterTemplatesModal('all')">🔘 Todas (6)</button>
      <button type="button" class="pcb-modal-tab-btn" data-cat="office" onclick="pcbApp.filterTemplatesModal('office')">🏢 Oficina & PyME</button>
      <button type="button" class="pcb-modal-tab-btn" data-cat="cctv" onclick="pcbApp.filterTemplatesModal('cctv')">📹 CCTV Monitoreo</button>
      <button type="button" class="pcb-modal-tab-btn" data-cat="gaming" onclick="pcbApp.filterTemplatesModal('gaming')">🎮 Gamer E-Sports</button>
      <button type="button" class="pcb-modal-tab-btn" data-cat="workstation" onclick="pcbApp.filterTemplatesModal('workstation')">🏗️ Workstation 3D</button>
    </div>

    <div class="pcb-modal-body">
      <div class="pcb-templates-grid" id="pcbTemplatesGrid">
        <!-- Renderizado dinámico vía JS -->
      </div>
    </div>

    <div class="pcb-modal-footer">
      <span>🛡️ <strong>Garantía Total:</strong> 1 año de garantía oficial &bull; Pruebas antiestáticas de 2h &bull; BIOS actualizado &bull; Factura fiscal CFDI 4.0</span>
      <button type="button" class="pcb-actions-dropdown-btn" onclick="pcbApp.closeTemplatesModal()">Cerrar</button>
    </div>
  </div>
</div>

<!-- BARRA FLOTANTE STICKY DE COMPRA Y COTIZACIÓN -->
<div class="pcb-sticky-bar">
  <div class="pcb-sticky-inner">
    <div class="pcb-sticky-left">
      <div class="pcb-delivery-badge">
        📅 <span id="pcbDeliveryDateText">Recíbelo en 1 a 3 días hábiles</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.55rem;">
        <span style="font-family: var(--pcb-font-display); font-weight: 600; color: #475569; font-size: 0.88rem;">Cantidad:</span>
        <div class="pcb-qty-stepper">
          <button type="button" class="pcb-qty-btn" onclick="pcbApp.setQty(-1)">-</button>
          <span class="pcb-qty-val" id="pcbGlobalQty">1</span>
          <button type="button" class="pcb-qty-btn" onclick="pcbApp.setQty(1)">+</button>
        </div>
      </div>
    </div>

    <div class="pcb-sticky-total">
      <span class="pcb-sticky-total-label">Total:</span>
      <span class="pcb-sticky-total-amount" id="pcbStickyTotalAmount">$0.00</span>
    </div>

    <div class="pcb-sticky-actions">
      <button type="button" class="pcb-btn-cart" id="pcbAddToCartBtn" onclick="pcbApp.addToCart()">
        🛒 Agregar al carrito
      </button>
      <button type="button" class="pcb-btn-quote" onclick="pcbApp.createQuoteWhatsApp()">
        💬 Cotizar por WhatsApp
      </button>
    </div>
  </div>
</div>

<script id="pcb-catalog-data" type="application/json">
${catalogJson}
</script>

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
      activeStep: 'cpu',
      editingStep: null,
      searchFilters: {},
      subFilters: {},
      onlyInStockFilter: {},
      fallbackImg: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='4' y='4' width='16' height='16' rx='2'/%3E%3Cpath d='M9 9h6v6H9z'/%3E%3Cpath d='M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3'/%3E%3C/svg%3E",

      init: function() {
        this.renderAccordion();
        this.updateSummary();
        this.calcDeliveryDate();
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

      setQty: function(delta) {
        let n = this.systemQty + delta;
        if (n < 1) n = 1;
        if (n > 50) n = 50;
        this.systemQty = n;
        document.getElementById('pcbGlobalQty').textContent = n;
        this.updateSummary();
      },

      setItemQty: function(catKey, delta) {
        if (!this.selected[catKey]) return;
        let cur = this.selected[catKey].qty || 1;
        let n = cur + delta;
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
      },

      selectItem: function(catKey, item) {
        const prevQty = this.selected[catKey] ? this.selected[catKey].qty : 1;
        this.selected[catKey] = { ...item, qty: prevQty || 1 };
        this.editingStep = null;

        // Auto-advance logic
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
        } else {
          this.activeStep = null;
        }

        this.renderAccordion();
        this.updateSummary();
        this.calcDeliveryDate();
      },

      removeItem: function(catKey) {
        delete this.selected[catKey];
        if (this.editingStep === catKey) this.editingStep = null;
        this.renderAccordion();
        this.updateSummary();
        this.calcDeliveryDate();
      },

      editStep: function(catKey) {
        this.editingStep = catKey;
        this.activeStep = catKey;
        this.renderAccordion();
      },

      cancelEdit: function() {
        this.editingStep = null;
        this.renderAccordion();
      },

      handleSearch: function(catKey, query) {
        this.searchFilters[catKey] = query;
        this.renderGridOnly(catKey);
      },

      renderGridOnly: function(catKey) {
        const gridEl = document.getElementById('pcbProductsGrid_' + catKey);
        if (!gridEl) return;
        const availableItems = this.getAvailableProducts(catKey);

        if (availableItems.length === 0) {
          gridEl.innerHTML = \`
            <div style="grid-column: 1 / -1; padding: 2rem 1rem; text-align: center; color: #64748b; font-size: 0.88rem;">
              🔍 No se encontraron piezas que coincidan con <strong>"\${this.searchFilters[catKey] || ''}"</strong>. Prueba con otra palabra clave o marca.
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
            <li class="pcb-step-item \${isActive ? 'active' : ''}">
              <div class="pcb-step-header" onclick="pcbApp.toggleStep('\${step.key}')">
                <div class="pcb-step-left">
                  <div class="pcb-step-icon \${step.iconClass}">\${step.icon}</div>
                  <div class="pcb-step-title-wrap">
                    <span class="pcb-step-name">
                      \${step.name}
                      \${isSelected ? '<span class="pcb-badge-compat">✓ Seleccionado</span>' : ''}
                    </span>
                    <span class="pcb-step-status \${isSelected ? 'selected' : ''}">
                      \${isSelected ? selectedItem.title + ((selectedItem.qty || 1) > 1 ? ' (' + selectedItem.qty + ' pzas)' : '') + ' — $' + (selectedItem.price * (selectedItem.qty || 1)).toLocaleString('es-MX') + ' MXN' : step.placeholder}
                    </span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.55rem;">
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
                      ✏️ <strong>Modo Edición:</strong> Elige otra opción para reemplazar <strong>\${selectedItem.title}</strong> (\${selectedItem.qty || 1} pza\${(selectedItem.qty || 1) > 1 ? 's' : ''}).
                    </div>
                    <button type="button" class="pcb-editing-cancel-btn" onclick="pcbApp.cancelEdit()">✕ Conservar pieza actual</button>
                  </div>
                \` : ''}

                \${step.key === 'peripherals' ? \`
                  <div class="pcb-subcat-pills" id="pcbSubFilterWrap_peripherals">
                    <button type="button" class="pcb-subcat-pill \${!this.subFilters['peripherals'] ? 'active' : ''}" data-filter="" onclick="pcbApp.setSubFilter('peripherals', '')">🔘 Todos los Periféricos (12)</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['peripherals'] === 'kit' ? 'active' : ''}" data-filter="kit" onclick="pcbApp.setSubFilter('peripherals', 'kit')">📦 Kits Teclado + Mouse</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['peripherals'] === 'teclado' ? 'active' : ''}" data-filter="teclado" onclick="pcbApp.setSubFilter('peripherals', 'teclado')">⌨️ Teclados Individuales</button>
                    <button type="button" class="pcb-subcat-pill \${this.subFilters['peripherals'] === 'mouse' ? 'active' : ''}" data-filter="mouse" onclick="pcbApp.setSubFilter('peripherals', 'mouse')">🖱️ Mouses Ópticos & Ergonómicos</button>
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

                <div class="pcb-products-grid" id="pcbProductsGrid_\${step.key}">
            \`;

            if (availableItems.length === 0) {
              html += \`
                <div style="grid-column: 1 / -1; padding: 2rem 1rem; text-align: center; color: #64748b; font-size: 0.88rem;">
                  No se encontraron piezas compatibles con los filtros actuales.
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
        if (!countEl || !fillEl) return;

        let completedCount = 0;
        ESSENTIAL_KEYS.forEach(k => {
          const chip = document.getElementById('pcbChip_' + k);
          if (this.selected[k]) {
            completedCount++;
            if (chip) chip.classList.add('done');
          } else {
            if (chip) chip.classList.remove('done');
          }
        });

        const pct = Math.round((completedCount / ESSENTIAL_KEYS.length) * 100);
        countEl.textContent = completedCount + ' de ' + ESSENTIAL_KEYS.length + ' esenciales listos';
        fillEl.style.width = pct + '%';
      },

      updateWattMeter: function() {
        const valEl = document.getElementById('pcbWattVal');
        const fillEl = document.getElementById('pcbWattBarFill');
        const recEl = document.getElementById('pcbWattRecVal');
        const statusTag = document.getElementById('pcbWattStatusTag');

        let estimatedWatts = 80; // Base: motherboard, fans, ram, ssd
        const cpu = this.selected['cpu'];
        const gpu = this.selected['gpu'];
        const psu = this.selected['psu'];

        if (cpu) {
          const t = cpu.title.toLowerCase();
          if (t.includes('i9') || t.includes('9950x') || t.includes('9900x') || t.includes('7900')) {
            estimatedWatts += 180;
          } else if (t.includes('i7') || t.includes('9700x') || t.includes('5700x') || t.includes('5900xt')) {
            estimatedWatts += 125;
          } else if (t.includes('i5') || t.includes('7600x') || t.includes('8700g') || t.includes('5600')) {
            estimatedWatts += 85;
          } else {
            estimatedWatts += 65;
          }
        }

        if (gpu) {
          const t = gpu.title.toLowerCase();
          if (t.includes('rtx5070') || t.includes('5070')) {
            estimatedWatts += 250;
          } else if (t.includes('rx9060xt') || t.includes('5060teagle')) {
            estimatedWatts += 190;
          } else {
            estimatedWatts += 150;
          }
        }

        const suggestedPsuWatts = Math.max(500, Math.ceil((estimatedWatts * 1.35) / 50) * 50);

        if (valEl) valEl.textContent = '~' + estimatedWatts + ' Watts';
        if (recEl) recEl.textContent = suggestedPsuWatts + 'W+';
        if (fillEl) {
          const barPct = Math.min(100, Math.round((estimatedWatts / 700) * 100));
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

      updateSummary: function() {
        const listEl = document.getElementById('pcbSummaryList');
        const countEl = document.getElementById('pcbSummaryCount');
        const subtotalEl = document.getElementById('pcbSubtotalText');
        const totalEl = document.getElementById('pcbGrandTotalText');
        const stickyTotalEl = document.getElementById('pcbStickyTotalAmount');
        const alertEl = document.getElementById('pcbCompatAlert');

        const keys = Object.keys(this.selected);
        let totalSingle = 0;

        this.updateProgressBar();
        this.updateWattMeter();

        if (keys.length === 0) {
          if (listEl) {
            listEl.innerHTML = \`
              <div style="text-align: center; color: #94a3b8; padding: 2rem 1rem; font-size: 0.88rem;">
                Aún no has agregado componentes. Haz clic en las categorías de la izquierda para comenzar.
              </div>
            \`;
          }
          if (countEl) countEl.textContent = '0 piezas';
          if (alertEl) {
            alertEl.innerHTML = '<span>💡 Comienza seleccionando el procesador para validar compatibilidad.</span>';
            alertEl.style.background = '#f8fafc';
            alertEl.style.borderColor = '#e2e8f0';
            alertEl.style.color = '#64748b';
          }
        } else {
          let count = 0;
          let itemsHtml = '';
          keys.forEach(k => {
            const item = this.selected[k];
            const qty = item.qty || 1;
            count += qty;
            const lineTotal = item.price * qty;
            totalSingle += lineTotal;

            itemsHtml += \`
              <div class="pcb-summary-item">
                <div class="pcb-summary-item-left">
                  <img src="\${item.img}" alt="\${item.title}" class="pcb-summary-item-img" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
                  <div style="min-width: 0;">
                    <div class="pcb-summary-item-title" title="\${item.title}">\${item.title}</div>
                    <div class="pcb-summary-item-qty">\${qty > 1 ? qty + ' piezas &bull; $' + item.price.toLocaleString('es-MX') + ' c/u' : '1 pieza'}</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.45rem;">
                  <span class="pcb-summary-item-price">$\${lineTotal.toLocaleString('es-MX')}</span>
                  <button type="button" onclick="pcbApp.removeItem('\${k}')" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:0.85rem; padding:2px;" title="Quitar pieza">✕</button>
                </div>
              </div>
            \`;
          });

          if (listEl) listEl.innerHTML = itemsHtml;
          if (countEl) countEl.textContent = count + (count === 1 ? ' pieza' : ' piezas');

          if (alertEl) {
            const missing = ESSENTIAL_KEYS.filter(k => !this.selected[k]);
            if (missing.length === 0) {
              alertEl.innerHTML = '<span>✓ Compatibilidad verificada: Todo listo para ensamble.</span>';
              alertEl.style.background = '#f0fdf4';
              alertEl.style.borderColor = '#bbf7d0';
              alertEl.style.color = '#166534';
            } else {
              const names = missing.map(m => {
                const s = STEP_CONFIG.find(x => x.key === m);
                return s ? s.name.split(' ')[1] : m;
              }).join(', ');
              alertEl.innerHTML = '<span>⚠️ Pendientes para ensamble completo: <strong>' + names + '</strong></span>';
              alertEl.style.background = '#fffbeb';
              alertEl.style.borderColor = '#fef3c7';
              alertEl.style.color = '#92400e';
            }
          }
        }

        const assemblyCost = (this.includeAssembly && keys.length > 0) ? 499 : 0;
        const grandTotalSingle = totalSingle + assemblyCost;
        const grandTotalAll = grandTotalSingle * this.systemQty;

        const assemblyRow = document.getElementById('pcbAssemblyCostRow');
        if (assemblyRow) {
          assemblyRow.style.display = this.includeAssembly ? 'flex' : 'none';
        }

        if (subtotalEl) subtotalEl.textContent = '$' + (totalSingle * this.systemQty).toLocaleString('es-MX') + ' MXN';
        if (totalEl) totalEl.textContent = '$' + grandTotalAll.toLocaleString('es-MX') + ' MXN';
        if (stickyTotalEl) stickyTotalEl.textContent = '$' + grandTotalAll.toLocaleString('es-MX');

        const btnCart = document.getElementById('pcbAddToCartBtn');
        const btnCartMain = document.getElementById('pcbAddToCartBtnMain');
        if (keys.length === 0) {
          if (btnCart) { btnCart.disabled = true; btnCart.style.opacity = '0.5'; btnCart.style.cursor = 'not-allowed'; }
          if (btnCartMain) { btnCartMain.disabled = true; btnCartMain.style.opacity = '0.5'; btnCartMain.style.cursor = 'not-allowed'; }
        } else {
          if (btnCart) { btnCart.disabled = false; btnCart.style.opacity = '1'; btnCart.style.cursor = 'pointer'; }
          if (btnCartMain) { btnCartMain.disabled = false; btnCartMain.style.opacity = '1'; btnCartMain.style.cursor = 'pointer'; }
        }
      },

      resetConfig: function() {
        if (Object.keys(this.selected).length > 0) {
          if (!confirm('¿Deseas reiniciar la configuración de tu ensamble?')) return;
        }
        this.selected = {};
        this.activeStep = 'cpu';
        this.editingStep = null;
        this.systemQty = 1;
        document.getElementById('pcbGlobalQty').textContent = 1;
        this.renderAccordion();
        this.updateSummary();
        this.calcDeliveryDate();
      },

      // PLANTILLAS PRECONFIGURADAS
      TEMPLATES: [
        {
          id: 'office-basic',
          category: 'office',
          badge: '🏢 Oficina & PyME',
          title: 'Equipo Corporativo Essential 2026',
          desc: 'Excelente fluidez para paquetería Office 365, facturación, ERP y multitarea administrativa con gráfica integrada y bajo consumo.',
          specs: [
            'Procesador Intel Core i3-12100 (4 núcleos / 8 hilos)',
            'Tarjeta Madre ASUS PRIME H610M-K (LGA1700 / DDR4)',
            '16GB RAM DDR4 Kingston HyperX Fury 3200MHz',
            '512GB SSD M.2 NVMe ADATA Legend 900 PCIe 4.0',
            'Gabinete Slim / Micro-ATX Acteck con fuente certificada',
            'Kit de Teclado y Mouse Inalámbrico ACTECK MK470 incluido'
          ],
          items: {
            cpu: 'procesador-intel-core-i3-12100-lga1700',
            mobo: 'asus-prime-h610m-k-mbdass6240',
            ram: 'adata-ad4u266616g19-sgn-memdat6090',
            ssd: 'adata-asu630ss-480gq-r-ddudat1300',
            case: 'acteck-atom-gabact010',
            psu: 'acteck-es-05001e-gabact380',
            peripherals: 'kit-teclado-mouse-inalambrico-acteck-mk470'
          }
        },
        {
          id: 'cctv-pro',
          category: 'cctv',
          badge: '📹 Monitoreo CCTV & Seguridad',
          title: 'Estación de Monitoreo NVR / VMS 24/7',
          desc: 'Diseñada específicamente para gestión de cámaras IP, analítica de video, software Milestone, SmartPSS, HikCentral y visualización continua.',
          specs: [
            'Procesador AMD Ryzen 7 5700G (8 núcleos / 16 hilos)',
            'Tarjeta Madre ASUS TUF Gaming A520M-PLUS WIFI',
            '32GB RAM DDR4 Kingston Fury Beast (Multiview)',
            '1TB SSD M.2 ADATA Legend 860 Alta Durabilidad',
            'Gabinete Acteck GM450 con flujo de aire optimizado',
            'Fuente Balam Rush 550W 80 Plus Bronce',
            'Monitor y Kit Periféricos Ergonómicos opcionales'
          ],
          items: {
            cpu: 'amd-ryzen-7-5700g-cpuamd2290',
            mobo: 'asus-tuf-gaming-a520m-plus-wifi-mbdass5480',
            ram: 'adata-ad4u320032g22-sgn-memdat6130',
            ssd: 'adata-sd620-ddudat1930',
            case: 'acteck-gm450-gabact260',
            psu: 'balam-rush-gr550b-gabblr510',
            peripherals: 'kit-teclado-mouse-alambrico-acer-eak030'
          }
        },
        {
          id: 'gamer-esports',
          category: 'gaming',
          badge: '🎮 Gaming & E-Sports',
          title: 'Gamer Fighter RTX 5070 / AM5 Next-Gen',
          desc: 'Potencia extrema para 1440p / 4K competitivo a 144Hz+ en Warzone, Cyberpunk, Valorant y streaming fluido en Twitch.',
          specs: [
            'Procesador AMD Ryzen 5 7600X (Arquitectura Zen 4 AM5)',
            'Tarjeta Madre Gigabyte B650M AORUS Elite AX WiFi',
            '32GB RAM DDR5 ADATA Hunter 5600MHz Dual Channel',
            '1TB SSD M.2 NVMe Gen4 ADATA Legend 900 Ultra Fast',
            'Tarjeta de Video ASUS GeForce RTX 5070 12GB OC',
            'Gabinete Gamer Acteck KIOTO GC460 RGB Vidrio Templado',
            'Fuente Modular Balam Rush GR750G 750W 80+ Gold'
          ],
          items: {
            cpu: 'amd-7600x-cpuamd2420',
            mobo: 'gigabyte-b650m-aorus-elite-ax-mbdgig5320',
            ram: 'adata-hunter-ddr5-memdat7420',
            ssd: 'adata-legend-900-ddudat2090',
            case: 'acteck-gi656-gabact500',
            psu: 'balam-rush-gr750g-gabblr480',
            gpu: 'asus-90yv0m17-m0aa00-tviass3910',
            furniture: 'silla-gaming-balam-rush-power-rush-v2'
          }
        },
        {
          id: 'workstation-3d',
          category: 'workstation',
          badge: '🏗️ Arquitectura & Render 3D',
          title: 'Workstation Master Core i7 / 64GB DDR5',
          desc: 'Configuración pensada para AutoCAD, Revit, SolidWorks, Blender, After Effects y renderizado de alto impacto profesional.',
          specs: [
            'Procesador Intel Core i7-14700K (20 núcleos / 28 hilos)',
            'Tarjeta Madre Gigabyte X870 A Elite WiFi 7',
            '32GB RAM DDR5 ADATA Hunter Alta Velocidad',
            '2TB SSD NVMe Gen4 ADATA Legend 900 de lectura ultra-rápida',
            'Gabinete espacioso con filtrado antipolvo Acteck ONEX',
            'Fuente de Poder Balam Rush 850W 80+ Gold',
            'Silla Ejecutiva Ergonómica Naceb NA-0930 recomendada'
          ],
          items: {
            cpu: 'procesador-intel-core-i7-14700k-lga1700',
            mobo: 'gigabyte-x870-a-elite-wf7-ice-mbdgig5340',
            ram: 'adata-hunter-ddr5-memdat7420',
            ssd: 'adata-legend-900-ddudat2100',
            case: 'acteck-onex-gs455-gabact610',
            psu: 'balam-rush-gr850g-gabblr470',
            gpu: 'gigabyte-gv-r9060xtgaming-oc-16gd-tvigig3470',
            furniture: 'silla-ejecutiva-naceb-negro-na-0930n'
          }
        },
        {
          id: 'office-pro',
          category: 'office',
          badge: '💼 Oficina Avanzada & Análisis',
          title: 'Estación Ejecutiva Core i5 Multitarea',
          desc: 'Rendimiento robusto para análisis de bases de datos, suites contables, videollamadas en alta definición y doble monitor.',
          specs: [
            'Procesador Intel Core i5-12400F (6 núcleos / 12 hilos)',
            'Tarjeta Madre Gigabyte B760M D3HP DDR4',
            '16GB RAM DDR4 Kingston Fury 3200MHz',
            '1TB SSD M.2 ADATA Legend 860',
            'Gabinete Slim Acteck GI215 con ventilación frontal',
            'Fuente Acteck 600W certificada',
            'Kit Inalámbrico Silencioso Acteck Creator MK440'
          ],
          items: {
            cpu: 'procesador-intel-core-i5-12400f-lga1700',
            mobo: 'gigabyte-mb-gigabyte-b760m-d3hp-mbdgig5180',
            ram: 'kingston-technology-fury-impact-memkgn3150',
            ssd: 'adata-legend-860-ddudat2190',
            case: 'acteck-gi215-gabact320',
            psu: 'acteck-ft600ew-gabact510',
            peripherals: 'kit-inalambrico-silencioso-acteck-creator-mk440'
          }
        },
        {
          id: 'gaming-entry',
          category: 'gaming',
          badge: '🎮 Gaming Esports Calidad / Precio',
          title: 'BattleStation Ryzen 5 & RX 9060 XT',
          desc: 'El balance perfecto entre precio y desempeño en 1080p competitivo a altos cuadros por segundo en shooters y battle royales.',
          specs: [
            'Procesador AMD Ryzen 5 5500 (6 núcleos / 12 hilos)',
            'Tarjeta Madre ASUS PRIME B550M-A AC con WiFi',
            '16GB RAM DDR4 Kingston FURY Beast 3200MHz',
            '1TB SSD ADATA Legend 860 PCIe 4.0',
            'Tarjeta Gráfica ASUS Dual Radeon RX 9060 XT 16GB',
            'Gabinete Acteck GM767 Gaming con iluminación frontal',
            'Fuente Balam Rush 650W 80 Plus Bronce'
          ],
          items: {
            cpu: 'amd-5500-cpuamd2520',
            mobo: 'asus-prime-b550m-a-ac-mbdass5490',
            ram: 'kingston-technology-fury-beast-memkgn2870',
            ssd: 'adata-legend-860-ddudat2190',
            case: 'acteck-gm767-gabact600',
            psu: 'balam-rush-gr650b-gabblr500',
            gpu: 'asus-dual-rx9060xt-16g-tviass3930',
            furniture: 'silla-gaming-necnon-nsg-rgb-1'
          }
        }
      ],

      calculateTemplatePrice: function(tpl) {
        let total = 0;
        for (const [cat, idOrKey] of Object.entries(tpl.items)) {
          const list = CATALOG[cat] || [];
          const found = list.find(x => x.id === idOrKey || (x.title && x.title.toLowerCase().includes(idOrKey)));
          if (found) total += found.price;
        }
        return total;
      },

      openTemplatesModal: function(cat) {
        const modal = document.getElementById('pcbTemplatesModal');
        if (!modal) return;
        modal.classList.add('open');
        this.filterTemplatesModal(cat || 'all');
      },

      closeTemplatesModal: function(e) {
        if (e && e.target && e.target.closest('.pcb-modal-dialog')) return;
        const modal = document.getElementById('pcbTemplatesModal');
        if (!modal) return;
        modal.classList.remove('open');
      },

      filterTemplatesModal: function(cat) {
        const tabs = document.querySelectorAll('.pcb-modal-tab-btn');
        tabs.forEach(btn => {
          if (btn.getAttribute('data-cat') === cat) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        const grid = document.getElementById('pcbTemplatesGrid');
        if (!grid) return;

        let filtered = this.TEMPLATES;
        if (cat !== 'all') {
          filtered = this.TEMPLATES.filter(t => t.category === cat);
        }

        let html = '';
        filtered.forEach(tpl => {
          const price = this.calculateTemplatePrice(tpl);
          html += \`
            <div class="pcb-template-card">
              <div>
                <span class="pcb-tpl-badge">\${tpl.badge}</span>
                <h4 class="pcb-tpl-title">\${tpl.title}</h4>
                <p class="pcb-tpl-desc">\${tpl.desc}</p>
                <ul class="pcb-tpl-specs-list">
                  \${tpl.specs.map(s => '<li><span>⚡</span> <span>' + s + '</span></li>').join('')}
                </ul>
              </div>
              <div>
                <div class="pcb-tpl-price-box">
                  <span style="font-size: 0.8rem; color: #64748b;">Precio estimado:</span>
                  <span class="pcb-tpl-price">$\${price.toLocaleString('es-MX')} MXN</span>
                </div>
                <div class="pcb-tpl-actions">
                  <button type="button" class="pcb-tpl-btn-load" onclick="pcbApp.loadTemplate('\${tpl.id}')">
                    Cargar esta configuración
                  </button>
                </div>
              </div>
            </div>
          \`;
        });

        grid.innerHTML = html;
      },

      loadTemplate: function(tplId) {
        const tpl = this.TEMPLATES.find(t => t.id === tplId);
        if (!tpl) return;

        this.selected = {};

        for (const [cat, idOrKey] of Object.entries(tpl.items)) {
          const list = CATALOG[cat] || [];
          let found = list.find(x => x.id === idOrKey);
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

        alert('✅ ¡Plantilla "' + tpl.title + '" cargada con éxito! Revisa cada componente y personalízalo si lo deseas.');
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
          // Servicio de Ensamble y Pruebas
          itemsToAdd.push({
            id: 52774577897796,
            quantity: this.systemQty,
            properties: {
              '_Servicio': 'Ensamble Profesional y Pruebas Térmicas',
              '_Garantia': '1 año soporte oficial'
            }
          });
        }

        const btn = document.getElementById('pcbAddToCartBtn');
        const btnMain = document.getElementById('pcbAddToCartBtnMain');
        const oldText = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Agregando al carrito...'; }
        if (btnMain) { btnMain.disabled = true; btnMain.innerHTML = '⏳ Agregando al carrito...'; }

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
          alert('Hubo un inconveniente al agregar las piezas al carrito. Por favor intenta de nuevo o solicita tu cotización por WhatsApp.');
          if (btn) { btn.disabled = false; btn.innerHTML = oldText; }
          if (btnMain) { btnMain.disabled = false; btnMain.innerHTML = '🛒 Agregar al Carrito'; }
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

        const assemblyCost = (this.includeAssembly) ? 499 : 0;
        if (this.includeAssembly) {
          msg += '• Servicio de Ensamble y Pruebas Térmicas: $499.00 MXN\\n';
        }

        const grandTotalSingle = totalSingle + assemblyCost;
        const grandTotalAll = grandTotalSingle * this.systemQty;

        msg += '\\nCantidad de Equipos: ' + this.systemQty + ' unidad(es)';
        msg += '\\nTotal Estimado: $' + grandTotalAll.toLocaleString('es-MX') + ' MXN (IVA incluido 16% CFDI 4.0)';
        msg += '\\n\\n¿Me podrían confirmar disponibilidad y tiempo de entrega por favor?';

        const url = 'https://wa.me/523318257008?text=' + encodeURIComponent(msg);
        window.open(url, '_blank');
      },

      calcDeliveryDate: function() {
        const keys = Object.keys(this.selected);
        const hasOnOrder = keys.some(k => this.selected[k].inStock === false);
        const el = document.getElementById('pcbDeliveryDateText');
        if (!el) return;

        if (hasOnOrder) {
          el.textContent = 'Recíbelo en 3 a 5 días hábiles (Incluye piezas sobre pedido)';
        } else {
          el.textContent = 'Recíbelo en 1 a 3 días hábiles (Entrega Inmediata)';
        }
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
console.log('Successfully written minimalist, sober, zero-friction configurator to sections/page-configurador-pc.liquid!');
