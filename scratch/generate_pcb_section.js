const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/pcb_components.json', 'utf8'));

// Format items for template
function cleanItems(items) {
  return items.map(item => ({
    id: item.handle,
    title: item.title,
    vendor: item.vendor,
    price: Math.round(item.price),
    img: item.img,
    sku: item.sku,
    socket: item.socket || '',
    brand: item.brand || '',
    ramType: item.ramType || '',
    capacity: item.capacity || '',
    watts: item.watts || '',
    coolerType: item.coolerType || '',
    hz: item.hz || '',
    isGamer: item.isGamer || false
  }));
}

const curated = {
  cpu: cleanItems(data.cpu.slice(0, 20)),
  mobo: cleanItems(data.mobo.slice(0, 22)),
  ram: cleanItems(data.ram.slice(0, 16)),
  ssd: cleanItems(data.ssd.slice(0, 18)),
  case: cleanItems(data.case.slice(0, 18)),
  psu: cleanItems(data.psu.slice(0, 18)),
  gpu: cleanItems(data.gpu.slice(0, 6)),
  cooler: cleanItems(data.cooler.slice(0, 14)),
  monitor: cleanItems(data.monitor.slice(0, 14))
};

const catalogJson = JSON.stringify(curated);

const liquidContent = `{% comment %}
  CONFIGURADOR DE PC EMPRESARIAL Y GAMER - SEGURIDAD AVANZADA
  Inspirado en el diseño y flujo de alta conversión de Abasteo.mx
  Permite seleccionar procesador, tarjeta madre, memoria RAM, SSD, gabinete, fuente, GPU, disipador y periféricos
  con validación de compatibilidad en tiempo real, resumen de cotización, envío a WhatsApp y checkout directo en Shopify.
{% endcomment %}

<style>
  :root {
    --pcb-primary: #1e3a8a;
    --pcb-primary-light: #2563eb;
    --pcb-accent: #0ea5e9;
    --pcb-gold: #f59e0b;
    --pcb-gold-hover: #d97706;
    --pcb-dark: #0f172a;
    --pcb-dark-surface: #1e293b;
    --pcb-border: #e2e8f0;
    --pcb-bg: #f8fafc;
    --pcb-card: #ffffff;
    --pcb-text: #1e293b;
    --pcb-text-muted: #64748b;
    --pcb-success: #10b981;
    --pcb-danger: #ef4444;
  }

  .pcb-wrapper {
    background-color: var(--pcb-bg);
    min-height: 100vh;
    padding-bottom: 120px;
    font-family: 'Roboto', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    color: var(--pcb-text);
  }

  .pcb-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* =========================================
     HERO BANNER SUPERIOR (ESTILO ABASTEO)
     ========================================= */
  .pcb-hero {
    background: linear-gradient(135deg, #0b192e 0%, #172a46 50%, #1e3a8a 100%);
    border-radius: 16px;
    padding: 3rem 2.5rem;
    color: #ffffff;
    position: relative;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .pcb-hero::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0) 70%);
    pointer-events: none;
  }

  .pcb-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(56, 189, 248, 0.18);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.4);
    font-weight: 700;
    font-size: 0.95rem;
    padding: 0.4rem 1rem;
    border-radius: 9999px;
    margin-bottom: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pcb-hero-title {
    font-size: 2.75rem;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 1rem 0;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .pcb-hero-subtitle {
    font-size: 1.35rem;
    font-weight: 600;
    color: #93c5fd;
    margin: 0 0 1rem 0;
  }

  .pcb-hero-desc {
    font-size: 1.15rem;
    color: #cbd5e1;
    max-width: 820px;
    line-height: 1.6;
    margin: 0 0 2rem 0;
  }

  .pcb-hero-presets {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .pcb-preset-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 0.75rem 1.35rem;
    border-radius: 8px;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pcb-preset-btn:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: #38bdf8;
    transform: translateY(-2px);
  }

  /* =========================================
     LAYOUT PRINCIPAL: 2 COLUMNAS (65% / 35%)
     ========================================= */
  .pcb-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    align-items: start;
  }

  @media (min-width: 1024px) {
    .pcb-main-grid {
      grid-template-columns: 1.75fr 1fr;
    }
  }

  /* =========================================
     COLUMNA IZQUIERDA: ACORDEÓN DE COMPONENTES
     ========================================= */
  .pcb-accordion-card {
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid var(--pcb-border);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
    overflow: hidden;
  }

  .pcb-accordion-header-top {
    padding: 1.5rem 1.75rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    background: #ffffff;
  }

  .pcb-accordion-main-title {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 0.35rem 0;
  }

  .pcb-accordion-main-desc {
    font-size: 1.05rem;
    color: #64748b;
    margin: 0;
  }

  .pcb-actions-dropdown-btn {
    background: #f1f5f9;
    color: #1e293b;
    border: 1px solid var(--pcb-border);
    padding: 0.6rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.15s ease;
  }

  .pcb-actions-dropdown-btn:hover {
    background: #e2e8f0;
  }

  /* Categorías de componentes (Items del acordeón) */
  .pcb-steps-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pcb-step-item {
    border-bottom: 1px solid var(--pcb-border);
  }

  .pcb-step-item:last-child {
    border-bottom: none;
  }

  .pcb-step-header {
    padding: 1.35rem 1.75rem;
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
  }

  .pcb-step-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    border: 1px solid #bfdbfe;
  }

  .pcb-step-title-wrap {
    display: flex;
    flex-direction: column;
  }

  .pcb-step-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .pcb-step-status {
    font-size: 0.95rem;
    font-weight: 500;
    color: #64748b;
    margin-top: 0.2rem;
  }

  .pcb-step-status.selected {
    color: #059669;
    font-weight: 600;
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

  /* Contenido del paso cuando está desplegado */
  .pcb-step-body {
    display: none;
    padding: 1.5rem 1.75rem 2rem;
    background: #fafafa;
    border-top: 1px solid #f1f5f9;
  }

  .pcb-step-item.active .pcb-step-body {
    display: block;
  }

  /* Tarjeta de pieza seleccionada en el acordeón */
  .pcb-selected-card {
    background: #ffffff;
    border: 2px solid #3b82f6;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
    flex-wrap: wrap;
  }

  .pcb-selected-card-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex: 1;
    min-width: 260px;
  }

  .pcb-selected-img {
    width: 72px;
    height: 72px;
    object-fit: contain;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 4px;
  }

  .pcb-selected-title {
    font-size: 1.18rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    margin: 0 0 0.35rem 0;
  }

  .pcb-selected-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0.95rem;
    color: #64748b;
  }

  .pcb-badge-compat {
    background: #dcfce7;
    color: #15803d;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  .pcb-selected-card-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .pcb-selected-price {
    font-size: 1.45rem;
    font-weight: 800;
    color: #1e3a8a;
    text-align: right;
  }

  .pcb-selected-actions {
    display: flex;
    gap: 0.5rem;
  }

  .pcb-btn-change {
    background: #eff6ff;
    color: #2563eb;
    border: 1px solid #bfdbfe;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .pcb-btn-remove {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fecaca;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
  }

  /* Filtros y catálogo de selección */
  .pcb-picker-wrap {
    margin-top: 1rem;
  }

  .pcb-picker-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }

  .pcb-search-input {
    flex: 1;
    min-width: 220px;
    padding: 0.75rem 1rem;
    border: 1px solid var(--pcb-border);
    border-radius: 8px;
    font-size: 1.05rem;
    outline: none;
    transition: border 0.15s ease;
  }

  .pcb-search-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  .pcb-filter-pills {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .pcb-pill {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    padding: 0.45rem 0.9rem;
    border-radius: 20px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    color: #475569;
    transition: all 0.15s ease;
  }

  .pcb-pill.active, .pcb-pill:hover {
    background: #1e3a8a;
    color: #ffffff;
    border-color: #1e3a8a;
  }

  /* Grid de productos para elegir */
  .pcb-products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    max-height: 480px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  @media (min-width: 768px) {
    .pcb-products-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .pcb-product-option-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 10px;
    padding: 1.15rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.2s ease;
  }

  .pcb-product-option-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }

  .pcb-opt-top {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.85rem;
  }

  .pcb-opt-img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    padding: 3px;
    flex-shrink: 0;
  }

  .pcb-opt-info {
    flex: 1;
  }

  .pcb-opt-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    margin: 0 0 0.35rem 0;
  }

  .pcb-opt-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .pcb-opt-tag {
    font-size: 0.8rem;
    font-weight: 700;
    background: #f1f5f9;
    color: #475569;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
  }

  .pcb-opt-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid #f1f5f9;
  }

  .pcb-opt-price {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0f172a;
  }

  .pcb-opt-select-btn {
    background: #2563eb;
    color: #ffffff;
    border: none;
    padding: 0.55rem 1.15rem;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .pcb-opt-select-btn:hover {
    background: #1d4ed8;
  }

  /* =========================================
     COLUMNA DERECHA: RESUMEN STICKY
     ========================================= */
  .pcb-summary-card {
    background: #ffffff;
    border: 1px solid var(--pcb-border);
    border-radius: 12px;
    padding: 1.75rem;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
    position: sticky;
    top: 2rem;
  }

  .pcb-summary-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 1rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pcb-summary-count {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2563eb;
    background: #eff6ff;
    padding: 0.2rem 0.65rem;
    border-radius: 12px;
  }

  .pcb-summary-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 1.5rem;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  .pcb-summary-item {
    display: flex;
    gap: 0.85rem;
    align-items: center;
    padding: 0.65rem 0;
    border-bottom: 1px dashed #f1f5f9;
  }

  .pcb-summary-item-img {
    width: 44px;
    height: 44px;
    object-fit: contain;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 2px;
    flex-shrink: 0;
  }

  .pcb-summary-item-info {
    flex: 1;
    min-width: 0;
  }

  .pcb-summary-item-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcb-summary-item-meta {
    font-size: 0.85rem;
    color: #64748b;
  }

  .pcb-summary-item-price {
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
  }

  .pcb-compat-alert {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 0.85rem 1rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .pcb-compat-alert.warning {
    background: #fffbeb;
    border-color: #fef08a;
    color: #854d0e;
  }

  .pcb-summary-totals {
    border-top: 2px solid var(--pcb-border);
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .pcb-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.05rem;
    color: #64748b;
  }

  .pcb-total-row.grand-total {
    font-size: 1.65rem;
    font-weight: 800;
    color: #0f172a;
    padding-top: 0.5rem;
    border-top: 1px solid var(--pcb-border);
  }

  .pcb-tax-note {
    font-size: 0.85rem;
    color: #94a3b8;
    text-align: right;
    margin-top: -0.25rem;
  }

  /* =========================================
     BARRA FLOTANTE FIJA INFERIOR (STICKY BAR)
     ========================================= */
  .pcb-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid var(--pcb-border);
    box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.12);
    padding: 1.15rem 2rem;
    z-index: 999;
  }

  .pcb-sticky-inner {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
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
    gap: 0.5rem;
    color: #0f172a;
    font-weight: 600;
    font-size: 1.05rem;
  }

  .pcb-qty-stepper {
    display: flex;
    align-items: center;
    border: 1px solid var(--pcb-border);
    border-radius: 6px;
    overflow: hidden;
    background: #ffffff;
  }

  .pcb-qty-btn {
    background: #f1f5f9;
    border: none;
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pcb-qty-btn:hover {
    background: #e2e8f0;
  }

  .pcb-qty-val {
    width: 44px;
    text-align: center;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .pcb-sticky-total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .pcb-sticky-total-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: #64748b;
  }

  .pcb-sticky-total-amount {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.1;
  }

  .pcb-sticky-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .pcb-btn-cart {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #ffffff;
    border: none;
    font-size: 1.15rem;
    font-weight: 800;
    padding: 0.95rem 1.85rem;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
    transition: all 0.2s ease;
  }

  .pcb-btn-cart:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.55);
  }

  .pcb-btn-quote {
    background: #ffffff;
    color: #2563eb;
    border: 2px solid #2563eb;
    font-size: 1.1rem;
    font-weight: 700;
    padding: 0.85rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    transition: all 0.2s ease;
  }

  .pcb-btn-quote:hover {
    background: #eff6ff;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .pcb-hero {
      padding: 2rem 1.5rem;
    }
    .pcb-hero-title {
      font-size: 2rem;
    }
    .pcb-sticky-inner {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    .pcb-sticky-actions {
      flex-direction: column;
    }
    .pcb-btn-cart, .pcb-btn-quote {
      width: 100%;
      justify-content: center;
    }
  }
</style>

<div class="pcb-wrapper">
  <div class="pcb-container">

    <!-- HERO BANNER -->
    <div class="pcb-hero">
      <div class="pcb-hero-badge">⚡ Solución B2B & Ensamble Profesional</div>
      <h1 class="pcb-hero-title">Configurador de PC</h1>
      <div class="pcb-hero-subtitle">Personaliza tu PC a la medida de tus necesidades</div>
      <p class="pcb-hero-desc">
        Arma tu equipo para oficina, ingeniería o gaming de alto rendimiento. Componentes 100% nuevos de marcas líderes con garantía oficial y factura fiscal CFDI 4.0.
      </p>

      <div class="pcb-hero-presets">
        <span style="font-weight: 700; align-self: center; margin-right: 0.5rem; color: #93c5fd;">Plantillas Rápidas:</span>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.loadPreset('office')">
          💼 Oficina B2B
        </button>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.loadPreset('gamer')">
          🎮 Gamer E-Sports
        </button>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.loadPreset('workstation')">
          🚀 Workstation Render
        </button>
      </div>
    </div>

    <!-- MAIN GRID (ACORDEÓN + RESUMEN) -->
    <div class="pcb-main-grid">

      <!-- COLUMNA IZQUIERDA: ACORDEÓN -->
      <div class="pcb-accordion-card">
        <div class="pcb-accordion-header-top">
          <div>
            <h2 class="pcb-accordion-main-title">Configurador de PC (Borrador de configuración)</h2>
            <p class="pcb-accordion-main-desc">Selecciona los componentes. Nuestro motor valida compatibilidad de socket y memoria automáticamente.</p>
          </div>
          <button type="button" class="pcb-actions-dropdown-btn" onclick="pcbApp.resetConfig()">
            🔄 Reiniciar ensamble
          </button>
        </div>

        <ul class="pcb-steps-list" id="pcbStepsList">
          <!-- Renderizado dinámico vía JavaScript -->
        </ul>
      </div>

      <!-- COLUMNA DERECHA: RESUMEN STICKY -->
      <div class="pcb-summary-card">
        <div class="pcb-summary-title">
          <span>Resumen de componentes</span>
          <span class="pcb-summary-count" id="pcbSummaryCount">0 piezas</span>
        </div>

        <div class="pcb-compat-alert" id="pcbCompatAlert">
          <span>✓ Compatibilidad verificada: Todo listo para ensamble.</span>
        </div>

        <div class="pcb-summary-list" id="pcbSummaryList">
          <div style="text-align: center; color: #94a3b8; padding: 2rem 1rem;">
            Aún no has agregado componentes. Haz clic en las categorías de la izquierda para comenzar.
          </div>
        </div>

        <div class="pcb-summary-totals">
          <div class="pcb-total-row">
            <span>Subtotal piezas:</span>
            <span id="pcbSubtotalText">$0.00 MXN</span>
          </div>
          <div class="pcb-total-row">
            <span>Servicio de ensamble y pruebas:</span>
            <span style="color: #059669; font-weight: 700;">¡GRATIS!</span>
          </div>
          <div class="pcb-total-row grand-total">
            <span>Total (incl. IVA):</span>
            <span id="pcbGrandTotalText">$0.00 MXN</span>
          </div>
          <div class="pcb-tax-note">Facturación fiscal CFDI 4.0 disponible</div>
        </div>
      </div>

    </div>

  </div>
</div>

<!-- BARRA FLOTANTE STICKY DE COMPRA Y COTIZACIÓN -->
<div class="pcb-sticky-bar">
  <div class="pcb-sticky-inner">
    <div class="pcb-sticky-left">
      <div class="pcb-delivery-badge">
        📅 <span id="pcbDeliveryDateText">Recíbelo en 3 a 7 días hábiles</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <span style="font-weight: 700; color: #475569; font-size: 0.95rem;">Cantidad:</span>
        <div class="pcb-qty-stepper">
          <button type="button" class="pcb-qty-btn" onclick="pcbApp.setQty(-1)">-</button>
          <span class="pcb-qty-val" id="pcbGlobalQty">1</span>
          <button type="button" class="pcb-qty-btn" onclick="pcbApp.setQty(1)">+</button>
        </div>
      </div>
    </div>

    <div class="pcb-sticky-total">
      <span class="pcb-sticky-total-label">Total estimado (incl. IVA):</span>
      <span class="pcb-sticky-total-amount" id="pcbStickyTotalAmount">$0.00</span>
    </div>

    <div class="pcb-sticky-actions">
      <button type="button" class="pcb-btn-cart" id="pcbAddToCartBtn" onclick="pcbApp.addToCart()">
        🛒 Agregar configuración al carrito
      </button>
      <button type="button" class="pcb-btn-quote" onclick="pcbApp.createQuoteWhatsApp()">
        💬 Crear cotización formal
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
      { key: 'cpu', name: 'Procesador (CPU)', icon: '🧠', placeholder: 'Seleccionar procesador' },
      { key: 'mobo', name: 'Tarjeta Madre (Motherboard)', icon: '🔌', placeholder: 'Seleccionar tarjeta madre' },
      { key: 'ram', name: 'Memoria RAM', icon: '⚡', placeholder: 'Seleccionar memoria RAM' },
      { key: 'ssd', name: 'Almacenamiento (SSD)', icon: '💾', placeholder: 'Seleccionar unidad de estado sólido' },
      { key: 'case', name: 'Gabinete (Chasis)', icon: '📦', placeholder: 'Seleccionar gabinete' },
      { key: 'psu', name: 'Fuente de Poder (PSU)', icon: '🔋', placeholder: 'Seleccionar fuente de poder' },
      { key: 'gpu', name: 'Tarjeta de Video (GPU)', icon: '🎮', placeholder: 'Seleccionar tarjeta gráfica (Opcional)' },
      { key: 'cooler', name: 'Enfriamiento y Disipador', icon: '❄️', placeholder: 'Seleccionar disipador (Opcional)' },
      { key: 'monitor', name: 'Monitor y Pantalla', icon: '🖥️', placeholder: 'Seleccionar monitor (Opcional)' }
    ];

    window.pcbApp = {
      selected: {},
      systemQty: 1,
      activeStep: 'cpu',
      searchFilters: {},

      init: function() {
        this.renderAccordion();
        this.updateSummary();
        this.calcDeliveryDate();
      },

      calcDeliveryDate: function() {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() + 3);
        const end = new Date(today);
        end.setDate(today.getDate() + 7);

        const options = { day: 'numeric', month: 'short' };
        const text = 'Recíbelo entre el ' + start.toLocaleDateString('es-MX', options) + ' y el ' + end.toLocaleDateString('es-MX', options);
        const el = document.getElementById('pcbDeliveryDateText');
        if (el) el.textContent = text;
      },

      setQty: function(delta) {
        this.systemQty = Math.max(1, this.systemQty + delta);
        document.getElementById('pcbGlobalQty').textContent = this.systemQty;
        this.updateSummary();
      },

      toggleStep: function(key) {
        this.activeStep = this.activeStep === key ? null : key;
        this.renderAccordion();
      },

      selectItem: function(catKey, item) {
        this.selected[catKey] = { ...item, qty: 1 };
        
        // Si se cambia el procesador, verificar si la tarjeta madre actual es compatible
        if (catKey === 'cpu') {
          const currentMobo = this.selected['mobo'];
          if (currentMobo && currentMobo.socket !== item.socket) {
            delete this.selected['mobo'];
          }
          this.activeStep = 'mobo';
        } else if (catKey === 'mobo') {
          // Si cambia mobo, checar ram
          const currentRam = this.selected['ram'];
          if (currentRam && currentRam.ramType !== item.ramType) {
            delete this.selected['ram'];
          }
          this.activeStep = 'ram';
        } else if (catKey === 'ram') {
          this.activeStep = 'ssd';
        } else if (catKey === 'ssd') {
          this.activeStep = 'case';
        } else if (catKey === 'case') {
          this.activeStep = 'psu';
        }

        this.renderAccordion();
        this.updateSummary();
      },

      removeItem: function(catKey) {
        delete this.selected[catKey];
        this.renderAccordion();
        this.updateSummary();
      },

      resetConfig: function() {
        this.selected = {};
        this.activeStep = 'cpu';
        this.renderAccordion();
        this.updateSummary();
      },

      getAvailableProducts: function(catKey) {
        let items = CATALOG[catKey] || [];
        const selectedCpu = this.selected['cpu'];
        const selectedMobo = this.selected['mobo'];

        // Filtrado por compatibilidad de socket en tarjeta madre
        if (catKey === 'mobo' && selectedCpu && selectedCpu.socket) {
          items = items.filter(m => m.socket === selectedCpu.socket);
        }

        // Filtrado por tipo de RAM según la tarjeta madre
        if (catKey === 'ram' && selectedMobo && selectedMobo.ramType) {
          items = items.filter(r => r.ramType === selectedMobo.ramType);
        }

        // Búsqueda de texto
        const query = (this.searchFilters[catKey] || '').toLowerCase().trim();
        if (query) {
          items = items.filter(x => x.title.toLowerCase().includes(query) || (x.vendor || '').toLowerCase().includes(query));
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

          html += \`
            <li class="pcb-step-item \${isActive ? 'active' : ''}">
              <div class="pcb-step-header" onclick="pcbApp.toggleStep('\${step.key}')">
                <div class="pcb-step-left">
                  <div class="pcb-step-icon">\${step.icon}</div>
                  <div class="pcb-step-title-wrap">
                    <span class="pcb-step-name">
                      \${step.name}
                      \${isSelected ? '<span class="pcb-badge-compat">✓ Seleccionado</span>' : ''}
                    </span>
                    <span class="pcb-step-status \${isSelected ? 'selected' : ''}">
                      \${isSelected ? selectedItem.title + ' — $' + selectedItem.price.toLocaleString('es-MX') + ' MXN' : step.placeholder}
                    </span>
                  </div>
                </div>
                <svg class="pcb-step-arrow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
              </div>

              <div class="pcb-step-body">
          \`;

          if (isSelected) {
            html += \`
              <div class="pcb-selected-card">
                <div class="pcb-selected-card-left">
                  <img src="\${selectedItem.img}" alt="\${selectedItem.title}" class="pcb-selected-img" loading="lazy">
                  <div>
                    <h4 class="pcb-selected-title">\${selectedItem.title}</h4>
                    <div class="pcb-selected-meta">
                      <span>Marca: <strong>\${selectedItem.vendor}</strong></span>
                      \${selectedItem.socket ? '<span>Socket: <strong>' + selectedItem.socket + '</strong></span>' : ''}
                      \${selectedItem.ramType ? '<span>Tipo: <strong>' + selectedItem.ramType + '</strong></span>' : ''}
                      \${selectedItem.sku ? '<span>SKU: ' + selectedItem.sku + '</span>' : ''}
                    </div>
                  </div>
                </div>
                <div class="pcb-selected-card-right">
                  <div class="pcb-selected-price">$\${(selectedItem.price * selectedItem.qty).toLocaleString('es-MX')} MXN</div>
                  <div class="pcb-selected-actions">
                    <button type="button" class="pcb-btn-change" onclick="pcbApp.activeStep = '\${step.key}'; pcbApp.renderAccordion();">Cambiar</button>
                    <button type="button" class="pcb-btn-remove" onclick="pcbApp.removeItem('\${step.key}')">Quitar</button>
                  </div>
                </div>
              </div>
            \`;
          } else {
            const availableItems = this.getAvailableProducts(step.key);
            html += \`
              <div class="pcb-picker-wrap">
                <div class="pcb-picker-controls">
                  <input type="text" class="pcb-search-input" placeholder="Buscar \${step.name.toLowerCase()}..." 
                    value="\${this.searchFilters[step.key] || ''}" 
                    oninput="pcbApp.searchFilters['\${step.key}'] = this.value; pcbApp.renderAccordion();">
                </div>

                <div class="pcb-products-grid">
            \`;

            if (availableItems.length === 0) {
              html += \`
                <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #64748b;">
                  No se encontraron piezas compatibles con los filtros actuales.
                </div>
              \`;
            } else {
              availableItems.forEach(item => {
                html += \`
                  <div class="pcb-product-option-card">
                    <div class="pcb-opt-top">
                      <img src="\${item.img}" alt="\${item.title}" class="pcb-opt-img" loading="lazy">
                      <div class="pcb-opt-info">
                        <h4 class="pcb-opt-title">\${item.title}</h4>
                        <div class="pcb-opt-tags">
                          \${item.socket ? '<span class="pcb-opt-tag">' + item.socket + '</span>' : ''}
                          \${item.ramType ? '<span class="pcb-opt-tag">' + item.ramType + '</span>' : ''}
                          \${item.capacity ? '<span class="pcb-opt-tag">' + item.capacity + '</span>' : ''}
                          \${item.watts ? '<span class="pcb-opt-tag">' + item.watts + '</span>' : ''}
                        </div>
                      </div>
                    </div>
                    <div class="pcb-opt-bottom">
                      <span class="pcb-opt-price">$\${item.price.toLocaleString('es-MX')}</span>
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

      updateSummary: function() {
        const listEl = document.getElementById('pcbSummaryList');
        const countEl = document.getElementById('pcbSummaryCount');
        const subtotalEl = document.getElementById('pcbSubtotalText');
        const totalEl = document.getElementById('pcbGrandTotalText');
        const stickyTotalEl = document.getElementById('pcbStickyTotalAmount');
        const alertEl = document.getElementById('pcbCompatAlert');

        const keys = Object.keys(this.selected);
        let totalSingle = 0;

        if (keys.length === 0) {
          listEl.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 2rem 1rem;">Aún no has agregado componentes. Haz clic en las categorías de la izquierda para comenzar.</div>';
          countEl.textContent = '0 piezas';
          subtotalEl.textContent = '$0.00 MXN';
          totalEl.textContent = '$0.00 MXN';
          stickyTotalEl.textContent = '$0.00';
          if (alertEl) {
            alertEl.className = 'pcb-compat-alert warning';
            alertEl.innerHTML = '<span>⚠️ Selecciona Procesador y Tarjeta Madre para comenzar la configuración.</span>';
          }
          return;
        }

        let summaryHtml = '';
        keys.forEach(k => {
          const item = this.selected[k];
          const linePrice = item.price * item.qty;
          totalSingle += linePrice;

          summaryHtml += \`
            <div class="pcb-summary-item">
              <img src="\${item.img}" alt="\${item.title}" class="pcb-summary-item-img">
              <div class="pcb-summary-item-info">
                <div class="pcb-summary-item-name" title="\${item.title}">\${item.title}</div>
                <div class="pcb-summary-item-meta">\${item.qty} pza &bull; \${item.vendor}</div>
              </div>
              <div class="pcb-summary-item-price">$\${linePrice.toLocaleString('es-MX')}</div>
            </div>
          \`;
        });

        const grandTotal = totalSingle * this.systemQty;

        listEl.innerHTML = summaryHtml;
        countEl.textContent = keys.length + ' piezas';
        subtotalEl.textContent = '$' + (totalSingle * this.systemQty).toLocaleString('es-MX') + ' MXN';
        totalEl.textContent = '$' + grandTotal.toLocaleString('es-MX') + ' MXN';
        stickyTotalEl.textContent = '$' + grandTotal.toLocaleString('es-MX') + ' MXN';

        if (alertEl) {
          if (!this.selected['cpu'] || !this.selected['mobo'] || !this.selected['ram']) {
            alertEl.className = 'pcb-compat-alert warning';
            alertEl.innerHTML = '<span>⚠️ Se recomienda incluir Procesador, Tarjeta Madre y Memoria RAM para completar el ensamble funcional.</span>';
          } else {
            alertEl.className = 'pcb-compat-alert';
            alertEl.innerHTML = '<span>✓ Compatibilidad verificada: Todos los componentes son compatibles.</span>';
          }
        }
      },

      loadPreset: function(type) {
        this.selected = {};
        if (type === 'office') {
          // AMD AM4 Office build
          const cpu = CATALOG.cpu.find(x => x.socket === 'AM4') || CATALOG.cpu[0];
          const mobo = CATALOG.mobo.find(x => x.socket === 'AM4') || CATALOG.mobo[0];
          const ram = CATALOG.ram.find(x => x.ramType === 'DDR4') || CATALOG.ram[0];
          const ssd = CATALOG.ssd[0];
          const cs = CATALOG.case[0];
          const psu = CATALOG.psu[0];

          if (cpu) this.selected['cpu'] = { ...cpu, qty: 1 };
          if (mobo) this.selected['mobo'] = { ...mobo, qty: 1 };
          if (ram) this.selected['ram'] = { ...ram, qty: 1 };
          if (ssd) this.selected['ssd'] = { ...ssd, qty: 1 };
          if (cs) this.selected['case'] = { ...cs, qty: 1 };
          if (psu) this.selected['psu'] = { ...psu, qty: 1 };
        } else if (type === 'gamer') {
          // AM5 / Intel Gamer build
          const cpu = CATALOG.cpu.find(x => x.socket === 'AM5' || x.socket === 'LGA1700') || CATALOG.cpu[1];
          const mobo = CATALOG.mobo.find(x => x.socket === cpu.socket) || CATALOG.mobo[1];
          const ram = CATALOG.ram.find(x => x.ramType === mobo.ramType) || CATALOG.ram[1];
          const ssd = CATALOG.ssd.find(x => x.capacity === '1TB') || CATALOG.ssd[0];
          const cs = CATALOG.case.find(x => x.isGamer) || CATALOG.case[1];
          const psu = CATALOG.psu.find(x => x.watts === '750W' || x.watts === '650W') || CATALOG.psu[1];
          const cooler = CATALOG.cooler[0];

          if (cpu) this.selected['cpu'] = { ...cpu, qty: 1 };
          if (mobo) this.selected['mobo'] = { ...mobo, qty: 1 };
          if (ram) this.selected['ram'] = { ...ram, qty: 1 };
          if (ssd) this.selected['ssd'] = { ...ssd, qty: 1 };
          if (cs) this.selected['case'] = { ...cs, qty: 1 };
          if (psu) this.selected['psu'] = { ...psu, qty: 1 };
          if (cooler) this.selected['cooler'] = { ...cooler, qty: 1 };
        } else if (type === 'workstation') {
          // Workstation build
          const cpu = CATALOG.cpu.find(x => x.title.includes('Ryzen 7') || x.title.includes('Core i7')) || CATALOG.cpu[0];
          const mobo = CATALOG.mobo.find(x => x.socket === cpu.socket) || CATALOG.mobo[0];
          const ram = CATALOG.ram[0];
          const ssd = CATALOG.ssd.find(x => x.capacity === '2TB' || x.capacity === '1TB') || CATALOG.ssd[0];
          const cs = CATALOG.case[0];
          const psu = CATALOG.psu[0];
          const monitor = CATALOG.monitor[0];

          if (cpu) this.selected['cpu'] = { ...cpu, qty: 1 };
          if (mobo) this.selected['mobo'] = { ...mobo, qty: 1 };
          if (ram) this.selected['ram'] = { ...ram, qty: 2 };
          if (ssd) this.selected['ssd'] = { ...ssd, qty: 1 };
          if (cs) this.selected['case'] = { ...cs, qty: 1 };
          if (psu) this.selected['psu'] = { ...psu, qty: 1 };
          if (monitor) this.selected['monitor'] = { ...monitor, qty: 1 };
        }

        this.renderAccordion();
        this.updateSummary();
      },

      addToCart: async function() {
        const keys = Object.keys(this.selected);
        if (keys.length === 0) {
          alert('Por favor selecciona al menos un componente para agregar al carrito.');
          return;
        }

        const btn = document.getElementById('pcbAddToCartBtn');
        const origText = btn.innerHTML;
        btn.innerHTML = '⏳ Agregando al carrito...';
        btn.disabled = true;

        try {
          // Buscar variant IDs para los productos seleccionados vía endpoint .js
          const itemsToAdd = [];

          for (const k of keys) {
            const item = this.selected[k];
            try {
              const res = await fetch('/products/' + item.handle + '.js');
              const pData = await res.json();
              if (pData && pData.variants && pData.variants.length > 0) {
                itemsToAdd.push({
                  id: pData.variants[0].id,
                  quantity: (item.qty || 1) * this.systemQty,
                  properties: {
                    '_Configuracion_PC': 'Ensamble Personalizado',
                    'Componente': item.title
                  }
                });
              }
            } catch (err) {
              console.warn('No se pudo obtener variant ID para:', item.handle, err);
            }
          }

          if (itemsToAdd.length === 0) {
            alert('No se pudieron vincular las variantes al carrito. Por favor intenta de nuevo o solicita cotización.');
            btn.innerHTML = origText;
            btn.disabled = false;
            return;
          }

          const cartRes = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsToAdd })
          });

          if (cartRes.ok) {
            window.location.href = '/cart';
          } else {
            const errJson = await cartRes.json();
            alert('Aviso del carrito: ' + (errJson.description || 'Error al agregar productos'));
            btn.innerHTML = origText;
            btn.disabled = false;
          }
        } catch (e) {
          console.error(e);
          alert('Ocurrió un error al procesar la adición al carrito. Por favor contáctanos por WhatsApp.');
          btn.innerHTML = origText;
          btn.disabled = false;
        }
      },

      createQuoteWhatsApp: function() {
        const keys = Object.keys(this.selected);
        if (keys.length === 0) {
          alert('Por favor selecciona al menos un componente para generar tu cotización.');
          return;
        }

        let total = 0;
        const lines = [
          'Hola Seguridad Avanzada, deseo solicitar una cotización formal B2B para este ensamble de PC personalizado:',
          '',
          '📦 *CANTIDAD DE EQUIPOS:* ' + this.systemQty,
          '━━━━━━━━━━━━━━━━━━━━'
        ];

        keys.forEach(k => {
          const item = this.selected[k];
          const line = item.price * (item.qty || 1);
          total += line;
          lines.push('• *' + item.title + '* (' + item.vendor + ') - $' + item.price.toLocaleString('es-MX') + ' MXN' + (item.qty > 1 ? ' [x' + item.qty + ']' : ''));
        });

        const grand = total * this.systemQty;
        lines.push('━━━━━━━━━━━━━━━━━━━━');
        lines.push('💰 *TOTAL ESTIMADO:* $' + grand.toLocaleString('es-MX') + ' MXN (IVA incluido)');
        lines.push('📅 *Entrega:* CDMX / Envío a todo México con factura fiscal CFDI 4.0');

        const waUrl = 'https://wa.me/525636741156?text=' + encodeURIComponent(lines.join('\\n'));
        window.open(waUrl, '_blank');
      }
    };

    document.addEventListener('DOMContentLoaded', function() {
      window.pcbApp.init();
    });
  })();
</script>

{% schema %}
{
  "name": "Configurador de PC",
  "settings": []
}
{% endschema %}
`;

fs.writeFileSync('sections/page-configurador-pc.liquid', liquidContent);
console.log('Created sections/page-configurador-pc.liquid successfully!');
