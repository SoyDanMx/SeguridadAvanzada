const fs = require('fs');

// 1. Read existing liquid to extract catalog data safely
const existingContent = fs.readFileSync('sections/page-configurador-pc.liquid', 'utf8');
const catalogMatch = existingContent.match(/<script id="pcb-catalog-data" type="application\/json">([\s\S]*?)<\/script>/);

if (!catalogMatch) {
  console.error('Error: Could not find pcb-catalog-data in existing liquid file.');
  process.exit(1);
}

const catalogJson = catalogMatch[1].trim();

const newLiquidContent = `{% comment %}
  CONFIGURADOR DE PC EMPRESARIAL Y GAMER - SEGURIDAD AVANZADA
  Diseño y UX/UI de vanguardia (World-Class PC Builder Experience)
  Tipografía moderna (Outfit & Plus Jakarta Sans), micro-interacciones,
  progreso dinámico del ensamble, watímetro de consumo, modal de plantillas
  y cotización en 1 clic.
{% endcomment %}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  :root {
    --pcb-font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --pcb-font-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;

    --pcb-primary: #1d4ed8;
    --pcb-primary-hover: #1e40af;
    --pcb-accent: #0284c7;
    --pcb-cyan: #06b6d4;
    --pcb-emerald: #10b981;
    --pcb-emerald-dark: #047857;
    --pcb-gold: #f59e0b;
    --pcb-gold-hover: #d97706;
    
    --pcb-dark: #070d18;
    --pcb-dark-surface: #0f1a2e;
    --pcb-dark-card: #16243d;
    
    --pcb-border: #e2e8f0;
    --pcb-border-subtle: #f1f5f9;
    --pcb-border-active: #3b82f6;
    
    --pcb-bg: #f8fafc;
    --pcb-card: #ffffff;
    
    --pcb-text: #0f172a;
    --pcb-text-muted: #64748b;
    --pcb-text-light: #94a3b8;
    
    --pcb-shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.04);
    --pcb-shadow-md: 0 6px 18px -2px rgba(15, 23, 42, 0.08);
    --pcb-shadow-lg: 0 14px 32px -4px rgba(15, 23, 42, 0.12);
    --pcb-shadow-glow: 0 0 24px rgba(37, 99, 235, 0.25);
  }

  .pcb-wrapper {
    background: radial-gradient(circle at 50% -10%, #edf4ff 0%, #f8fafc 60%, #f1f5f9 100%);
    min-height: 100vh;
    padding-bottom: 140px;
    font-family: var(--pcb-font-main);
    color: var(--pcb-text);
    -webkit-font-smoothing: antialiased;
  }

  .pcb-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  /* =========================================
     1. HERO BANNER DE ALTO IMPACTO (CYBER/TECH)
     ========================================= */
  .pcb-hero {
    background: radial-gradient(circle at 85% 15%, rgba(56, 189, 248, 0.2) 0%, transparent 55%),
                radial-gradient(circle at 10% 90%, rgba(37, 99, 235, 0.28) 0%, transparent 60%),
                linear-gradient(135deg, #070e1a 0%, #0d1a2f 45%, #152747 100%);
    border-radius: 24px;
    padding: 3.5rem 3rem;
    color: #ffffff;
    position: relative;
    overflow: hidden;
    margin-bottom: 2.5rem;
    box-shadow: 0 24px 50px -15px rgba(7, 14, 26, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  /* Textura de malla cibernética sutil */
  .pcb-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
    background-size: 24px 24px;
    opacity: 0.6;
    pointer-events: none;
  }

  .pcb-hero-badge-wrap {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 2;
  }

  .pcb-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    background: rgba(14, 165, 233, 0.16);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.35);
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.88rem;
    padding: 0.45rem 1.15rem;
    border-radius: 9999px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }

  .pcb-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 10px #10b981;
    animation: pcbDotPulse 1.8s infinite;
  }

  @keyframes pcbDotPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.5; }
  }

  .pcb-hero-title {
    font-family: var(--pcb-font-display);
    font-size: 3.25rem;
    font-weight: 900;
    line-height: 1.12;
    margin: 0 0 1.1rem 0;
    color: #ffffff;
    letter-spacing: -0.03em;
    position: relative;
    z-index: 2;
  }

  .pcb-hero-title span {
    background: linear-gradient(135deg, #60a5fa 0%, #38bdf8 50%, #a7f3d0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pcb-hero-subtitle {
    font-size: 1.28rem;
    font-weight: 600;
    color: #cbd5e1;
    margin: 0 0 1rem 0;
    position: relative;
    z-index: 2;
  }

  .pcb-hero-desc {
    font-size: 1.12rem;
    color: #94a3b8;
    max-width: 860px;
    line-height: 1.65;
    margin: 0 0 2rem 0;
    position: relative;
    z-index: 2;
  }

  /* 3 Tarjetas de Beneficios & Confianza en el Hero */
  .pcb-hero-features-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2.25rem;
    position: relative;
    z-index: 2;
  }

  .pcb-hero-feat-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    padding: 1.15rem 1.35rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    backdrop-filter: blur(12px);
    transition: all 0.25s ease;
  }

  .pcb-hero-feat-card:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(56, 189, 248, 0.4);
    transform: translateY(-2px);
  }

  .pcb-hero-feat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  .pcb-hero-feat-title {
    font-family: var(--pcb-font-display);
    font-size: 1rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.15rem;
  }

  .pcb-hero-feat-sub {
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.35;
  }

  /* Disparador de Plantillas y Accesos Rápidos */
  .pcb-hero-presets {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  .pcb-preset-modal-trigger-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0284c7 100%);
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.25);
    font-family: var(--pcb-font-display);
    font-size: 1.12rem;
    font-weight: 800;
    padding: 0.95rem 1.85rem;
    border-radius: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
    transition: all 0.25s ease;
  }

  .pcb-preset-modal-trigger-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(37, 99, 235, 0.65);
    border-color: #38bdf8;
  }

  .pcb-preset-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #e2e8f0;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-size: 0.98rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    backdrop-filter: blur(8px);
  }

  .pcb-preset-btn:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: #38bdf8;
    color: #ffffff;
    transform: translateY(-2px);
  }

  /* =========================================
     2. GRID PRINCIPAL (ACORDEÓN + RESUMEN)
     ========================================= */
  .pcb-main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2.25rem;
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
    border-radius: 20px;
    border: 1px solid var(--pcb-border);
    box-shadow: var(--pcb-shadow-md);
    overflow: hidden;
  }

  .pcb-accordion-header-top {
    padding: 1.75rem 2rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    background: linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%);
  }

  .pcb-accordion-main-title {
    font-family: var(--pcb-font-display);
    font-size: 1.75rem;
    font-weight: 800;
    color: var(--pcb-text);
    margin: 0 0 0.35rem 0;
    letter-spacing: -0.02em;
  }

  .pcb-accordion-main-desc {
    font-size: 1rem;
    color: var(--pcb-text-muted);
    margin: 0;
  }

  .pcb-actions-dropdown-btn {
    background: #f8fafc;
    color: #334155;
    border: 1px solid var(--pcb-border);
    padding: 0.65rem 1.25rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .pcb-actions-dropdown-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #0f172a;
  }

  /* BARRA DE AVANCE DINÁMICA (STEP TRACKER) */
  .pcb-progress-bar-wrap {
    padding: 1.35rem 2rem;
    background: linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%);
    border-bottom: 1px solid var(--pcb-border);
  }

  .pcb-progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.65rem;
    font-size: 0.95rem;
  }

  .pcb-progress-label {
    font-family: var(--pcb-font-display);
    font-weight: 700;
    color: #1e3a8a;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .pcb-progress-count {
    font-family: var(--pcb-font-display);
    font-weight: 800;
    color: #059669;
    background: #ffffff;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid #bbf7d0;
  }

  .pcb-progress-track {
    height: 10px;
    background: #e2e8f0;
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }

  .pcb-progress-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
    border-radius: 9999px;
    transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .pcb-essential-chips {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.85rem;
    flex-wrap: wrap;
  }

  .pcb-chip {
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.25rem 0.65rem;
    border-radius: 6px;
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.15s;
    user-select: none;
  }

  .pcb-chip:hover {
    border-color: #93c5fd;
    color: #1d4ed8;
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
    transition: all 0.2s ease;
  }

  .pcb-step-item:last-child {
    border-bottom: none;
  }

  .pcb-step-item.active {
    background: #ffffff;
    box-shadow: inset 4px 0 0 #2563eb;
  }

  .pcb-step-header {
    padding: 1.45rem 2rem;
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
    gap: 1.35rem;
    flex: 1;
    min-width: 0;
  }

  /* Iconos circulares temáticos por categoría */
  .pcb-step-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.65rem;
    flex-shrink: 0;
    box-shadow: var(--pcb-shadow-sm);
    color: #ffffff;
  }

  .pcb-icon-cpu { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); }
  .pcb-icon-mobo { background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); }
  .pcb-icon-ram { background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); }
  .pcb-icon-ssd { background: linear-gradient(135deg, #06b6d4 0%, #0e7490 100%); }
  .pcb-icon-case { background: linear-gradient(135deg, #475569 0%, #1e293b 100%); }
  .pcb-icon-psu { background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%); }
  .pcb-icon-gpu { background: linear-gradient(135deg, #10b981 0%, #047857 100%); }
  .pcb-icon-cooler { background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); }
  .pcb-icon-monitor { background: linear-gradient(135deg, #ec4899 0%, #be185d 100%); }

  .pcb-step-title-wrap {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .pcb-step-name {
    font-family: var(--pcb-font-display);
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--pcb-text);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .pcb-step-status {
    font-size: 0.98rem;
    font-weight: 500;
    color: var(--pcb-text-muted);
    margin-top: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcb-step-status.selected {
    color: #059669;
    font-weight: 600;
  }

  .pcb-step-arrow {
    width: 26px;
    height: 26px;
    color: #94a3b8;
    transition: transform 0.25s ease;
  }

  .pcb-step-item.active .pcb-step-arrow {
    transform: rotate(180deg);
    color: #2563eb;
  }

  .pcb-badge-compat {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    font-family: var(--pcb-font-display);
    font-weight: 800;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
  }

  .pcb-header-edit-btn {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    padding: 0.45rem 0.95rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .pcb-header-edit-btn:hover {
    background: #dbeafe;
    border-color: #93c5fd;
    color: #1e40af;
  }

  /* CUERPO DEL PASO DESPLEGADO */
  .pcb-step-body {
    display: none;
    padding: 1.75rem 2rem 2.25rem;
    background: #fafcff;
    border-top: 1px solid var(--pcb-border);
  }

  .pcb-step-item.active .pcb-step-body {
    display: block;
    animation: pcbFadeSlide 0.25s ease-out;
  }

  @keyframes pcbFadeSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* TARJETA DE PIEZA YA SELECCIONADA DENTRO DEL PASO */
  .pcb-selected-card {
    background: #ffffff;
    border: 2px solid #3b82f6;
    border-radius: 16px;
    padding: 1.45rem 1.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.12);
    flex-wrap: wrap;
  }

  .pcb-selected-card-left {
    display: flex;
    align-items: center;
    gap: 1.35rem;
    flex: 1;
    min-width: 280px;
  }

  .pcb-selected-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 6px;
  }

  .pcb-selected-title {
    font-family: var(--pcb-font-display);
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--pcb-text);
    line-height: 1.35;
    margin: 0 0 0.4rem 0;
  }

  .pcb-selected-meta {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    font-size: 0.92rem;
    color: var(--pcb-text-muted);
  }

  .pcb-selected-card-right {
    display: flex;
    align-items: center;
    gap: 1.35rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .pcb-qty-picker-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    background: #f8fafc;
    padding: 0.45rem 0.75rem;
    border-radius: 10px;
    border: 1px solid var(--pcb-border);
  }

  .pcb-qty-label {
    font-size: 0.88rem;
    font-weight: 700;
    color: #475569;
  }

  .pcb-component-stepper {
    display: inline-flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
  }

  .pcb-comp-step-btn {
    width: 34px;
    height: 34px;
    background: #f8fafc;
    border: none;
    font-size: 1.2rem;
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
    color: #0f172a;
  }

  .pcb-comp-qty-input {
    width: 46px;
    height: 34px;
    border: none;
    border-left: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    text-align: center;
    font-family: var(--pcb-font-display);
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
  }

  .pcb-selected-price-box {
    text-align: right;
  }

  .pcb-selected-price {
    font-family: var(--pcb-font-display);
    font-size: 1.6rem;
    font-weight: 900;
    color: #1e3a8a;
    line-height: 1.1;
  }

  .pcb-selected-unit-price {
    font-size: 0.85rem;
    color: var(--pcb-text-muted);
    font-weight: 500;
    margin-top: 0.2rem;
  }

  .pcb-selected-actions {
    display: flex;
    gap: 0.55rem;
  }

  .pcb-btn-change {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    padding: 0.55rem 1.15rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .pcb-btn-change:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }

  .pcb-btn-remove {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    padding: 0.55rem 1.15rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-btn-remove:hover {
    background: #fee2e2;
  }

  /* BANNER DE EDICIÓN */
  .pcb-editing-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid #93c5fd;
    border-radius: 12px;
    padding: 1rem 1.35rem;
    margin-bottom: 1.5rem;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .pcb-editing-text {
    font-size: 0.98rem;
    color: #1e40af;
  }

  .pcb-editing-cancel-btn {
    background: #ffffff;
    color: #475569;
    border: 1px solid #cbd5e1;
    padding: 0.5rem 1.1rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-editing-cancel-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  /* CONTROLES DE FILTRADO Y BÚSQUEDA */
  .pcb-picker-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .pcb-search-wrap {
    flex: 1;
    min-width: 260px;
    position: relative;
  }

  .pcb-search-icon {
    position: absolute;
    left: 1.1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    color: #94a3b8;
    pointer-events: none;
  }

  .pcb-search-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 2.85rem;
    border: 1.5px solid var(--pcb-border);
    border-radius: 12px;
    font-family: var(--pcb-font-main);
    font-size: 1rem;
    outline: none;
    transition: all 0.2s ease;
    background: #ffffff;
  }

  .pcb-search-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }

  .pcb-stock-filter-toggle {
    display: inline-flex;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 10px;
    border: 1px solid var(--pcb-border);
  }

  .pcb-stock-filter-btn {
    background: transparent;
    border: none;
    color: #475569;
    padding: 0.55rem 1.15rem;
    border-radius: 8px;
    font-family: var(--pcb-font-display);
    font-size: 0.92rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }

  .pcb-stock-filter-btn.active {
    background: #ffffff;
    color: #0f172a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  /* GRID DE PRODUCTOS EN EL CATÁLOGO */
  .pcb-products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    max-height: 520px;
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
    border: 1.5px solid var(--pcb-border);
    border-radius: 14px;
    padding: 1.35rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
  }

  .pcb-product-option-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 10px 25px -4px rgba(37, 99, 235, 0.12);
    transform: translateY(-3px);
  }

  .pcb-opt-top {
    display: flex;
    gap: 1.15rem;
    margin-bottom: 1rem;
  }

  .pcb-opt-img-wrap {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .pcb-opt-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.25s ease;
  }

  .pcb-product-option-card:hover .pcb-opt-img {
    transform: scale(1.08);
  }

  .pcb-opt-info {
    flex: 1;
    min-width: 0;
  }

  .pcb-opt-title {
    font-family: var(--pcb-font-display);
    font-size: 1.08rem;
    font-weight: 700;
    color: var(--pcb-text);
    line-height: 1.35;
    margin: 0 0 0.45rem 0;
  }

  .pcb-opt-tags {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .pcb-opt-tag {
    font-size: 0.78rem;
    font-weight: 700;
    background: #f1f5f9;
    color: #475569;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  .pcb-opt-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.85rem;
    border-top: 1px solid var(--pcb-border-subtle);
  }

  .pcb-opt-price-wrap {
    display: flex;
    flex-direction: column;
  }

  .pcb-opt-price {
    font-family: var(--pcb-font-display);
    font-size: 1.45rem;
    font-weight: 900;
    color: var(--pcb-text);
    line-height: 1.1;
  }

  .pcb-opt-vat {
    font-size: 0.75rem;
    color: var(--pcb-text-light);
    margin-top: 0.15rem;
  }

  .pcb-opt-select-btn {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    border: none;
    padding: 0.65rem 1.35rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }

  .pcb-opt-select-btn:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  }

  /* BADGES DE DISPONIBILIDAD */
  .pcb-opt-stock-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    margin-bottom: 0.4rem;
    width: fit-content;
  }

  .pcb-opt-stock-badge.in-stock {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }

  .pcb-opt-stock-badge.on-order {
    background: #fffbeb;
    color: #92400e;
    border: 1px solid #fde68a;
  }

  /* =========================================
     4. COLUMNA DERECHA: RESUMEN STICKY
     ========================================= */
  .pcb-summary-card {
    background: var(--pcb-card);
    border: 1px solid var(--pcb-border);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: var(--pcb-shadow-md);
    position: sticky;
    top: 2rem;
  }

  .pcb-summary-title {
    font-family: var(--pcb-font-display);
    font-size: 1.65rem;
    font-weight: 800;
    color: var(--pcb-text);
    margin: 0 0 1.25rem 0;
    padding-bottom: 0.85rem;
    border-bottom: 1px solid var(--pcb-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pcb-summary-count {
    font-family: var(--pcb-font-display);
    font-size: 0.95rem;
    font-weight: 800;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 0.3rem 0.85rem;
    border-radius: 9999px;
    border: 1px solid #bfdbfe;
  }

  /* WATÍMETRO / CALCULADOR ENERGÉTICO */
  .pcb-watt-meter-card {
    background: linear-gradient(135deg, #0b1528 0%, #172a4c 100%);
    color: #ffffff;
    border-radius: 14px;
    padding: 1.15rem 1.35rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .pcb-watt-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
  }

  .pcb-watt-label {
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.92rem;
    color: #93c5fd;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .pcb-watt-number {
    font-family: var(--pcb-font-display);
    font-size: 1.25rem;
    font-weight: 900;
    color: #38bdf8;
  }

  .pcb-watt-bar-bg {
    height: 8px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.6rem;
  }

  .pcb-watt-bar-fill {
    height: 100%;
    width: 25%;
    background: linear-gradient(90deg, #38bdf8 0%, #f59e0b 80%, #ef4444 100%);
    border-radius: 9999px;
    transition: width 0.4s ease;
  }

  .pcb-watt-rec {
    font-size: 0.82rem;
    color: #cbd5e1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pcb-watt-status-tag {
    color: #34d399;
    font-weight: 700;
  }

  /* LISTA DE COMPONENTES DEL RESUMEN */
  .pcb-summary-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 1.5rem;
    max-height: 380px;
    overflow-y: auto;
    padding-right: 0.35rem;
  }

  .pcb-summary-item {
    display: flex;
    gap: 0.95rem;
    align-items: center;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid var(--pcb-border-subtle);
    transition: all 0.15s;
  }

  .pcb-summary-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .pcb-summary-item-img {
    width: 46px;
    height: 46px;
    object-fit: contain;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    padding: 3px;
    flex-shrink: 0;
  }

  .pcb-summary-item-info {
    flex: 1;
    min-width: 0;
  }

  .pcb-summary-item-name {
    font-family: var(--pcb-font-display);
    font-size: 0.96rem;
    font-weight: 700;
    color: var(--pcb-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcb-summary-item-meta {
    font-size: 0.82rem;
    color: var(--pcb-text-muted);
    margin-top: 0.15rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .pcb-summary-item-price {
    font-family: var(--pcb-font-display);
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--pcb-text);
    white-space: nowrap;
  }

  .pcb-compat-alert {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
    padding: 0.95rem 1.15rem;
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .pcb-compat-alert.warning {
    background: #fffbeb;
    border-color: #fef08a;
    color: #854d0e;
  }

  /* CARD DEL SERVICIO DE ENSAMBLE */
  .pcb-assembly-option-card {
    background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
    border: 1.5px solid #bfdbfe;
    border-radius: 14px;
    padding: 1.1rem 1.25rem;
    margin: 1.25rem 0;
    transition: all 0.2s ease;
  }

  .pcb-assembly-option-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.1);
  }

  .pcb-assembly-check-label {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    cursor: pointer;
  }

  .pcb-assembly-check-label input[type="checkbox"] {
    width: 22px;
    height: 22px;
    margin-top: 2px;
    accent-color: #2563eb;
    cursor: pointer;
    flex-shrink: 0;
  }

  .pcb-assembly-check-content {
    flex: 1;
  }

  .pcb-assembly-check-title {
    font-family: var(--pcb-font-display);
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .pcb-assembly-badge {
    background: #2563eb;
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 9999px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pcb-assembly-check-desc {
    font-size: 0.85rem;
    color: var(--pcb-text-muted);
    margin-top: 0.35rem;
    line-height: 1.45;
  }

  .pcb-assembly-check-price {
    font-family: var(--pcb-font-display);
    font-size: 1.15rem;
    font-weight: 900;
    color: #1e3a8a;
    white-space: nowrap;
  }

  /* TOTALES DEL RESUMEN */
  .pcb-summary-totals {
    border-top: 2px solid var(--pcb-border);
    padding-top: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .pcb-total-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.05rem;
    color: var(--pcb-text-muted);
  }

  .pcb-total-row.grand-total {
    font-family: var(--pcb-font-display);
    font-size: 2rem;
    font-weight: 900;
    color: var(--pcb-text);
    padding-top: 0.75rem;
    border-top: 1px solid var(--pcb-border);
  }

  .pcb-tax-note {
    font-size: 0.85rem;
    color: var(--pcb-text-light);
    text-align: right;
    margin-top: -0.25rem;
  }

  /* SELLOS DE CONFIANZA EN SIDEBAR */
  .pcb-sidebar-trust-badges {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    margin-top: 1.5rem;
    padding-top: 1.25rem;
    border-top: 1px dashed var(--pcb-border);
  }

  .pcb-trust-pill {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 0.65rem;
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: #475569;
  }

  /* =========================================
     5. BARRA FLOTANTE INFERIOR (FROSTED GLASS)
     ========================================= */
  .pcb-sticky-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(226, 232, 240, 0.85);
    box-shadow: 0 -12px 32px rgba(15, 23, 42, 0.12);
    padding: 1.15rem 2.25rem;
    z-index: 999;
  }

  .pcb-sticky-inner {
    max-width: 1440px;
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
    gap: 0.55rem;
    color: var(--pcb-text);
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 1.05rem;
    background: #f1f5f9;
    padding: 0.45rem 1rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
  }

  .pcb-qty-stepper {
    display: flex;
    align-items: center;
    border: 1.5px solid var(--pcb-border);
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
  }

  .pcb-qty-btn {
    background: #f8fafc;
    border: none;
    width: 38px;
    height: 38px;
    font-size: 1.25rem;
    font-weight: 800;
    color: #1e293b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .pcb-qty-btn:hover {
    background: #e2e8f0;
  }

  .pcb-qty-val {
    width: 48px;
    text-align: center;
    font-family: var(--pcb-font-display);
    font-weight: 800;
    font-size: 1.15rem;
    color: #0f172a;
  }

  .pcb-sticky-total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .pcb-sticky-total-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--pcb-text-muted);
  }

  .pcb-sticky-total-amount {
    font-family: var(--pcb-font-display);
    font-size: 2.25rem;
    font-weight: 900;
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
    font-family: var(--pcb-font-display);
    font-size: 1.18rem;
    font-weight: 800;
    padding: 1rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.45);
    transition: all 0.25s ease;
  }

  .pcb-btn-cart:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(245, 158, 11, 0.6);
  }

  .pcb-btn-quote {
    background: #ffffff;
    color: #2563eb;
    border: 2px solid #2563eb;
    font-family: var(--pcb-font-display);
    font-size: 1.12rem;
    font-weight: 800;
    padding: 0.9rem 1.65rem;
    border-radius: 12px;
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
      padding: 2.25rem 1.5rem;
    }
    .pcb-hero-title {
      font-size: 2.25rem;
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

  /* =========================================
     6. MODAL DE PLANTILLAS RÁPIDAS (SHOWCASE)
     ========================================= */
  .pcb-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 13, 24, 0.88);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.25s ease-in-out;
  }

  .pcb-modal-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  .pcb-modal-dialog {
    background: #ffffff;
    border-radius: 24px;
    width: 100%;
    max-width: 1220px;
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    transform: scale(0.96);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .pcb-modal-overlay.open .pcb-modal-dialog {
    transform: scale(1);
  }

  .pcb-modal-header {
    padding: 1.75rem 2.25rem;
    background: linear-gradient(135deg, #070e1a 0%, #0f1d35 100%);
    color: #ffffff;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .pcb-modal-badge {
    display: inline-block;
    background: rgba(14, 165, 233, 0.2);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.4);
    padding: 0.3rem 0.85rem;
    border-radius: 9999px;
    font-family: var(--pcb-font-display);
    font-size: 0.82rem;
    font-weight: 800;
    margin-bottom: 0.45rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pcb-modal-title {
    font-family: var(--pcb-font-display);
    font-size: 1.85rem;
    font-weight: 900;
    margin: 0 0 0.45rem 0;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .pcb-modal-desc {
    font-size: 1rem;
    color: #94a3b8;
    margin: 0;
    max-width: 800px;
    line-height: 1.5;
  }

  .pcb-modal-close-btn {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    border: none;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    font-size: 1.35rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .pcb-modal-close-btn:hover {
    background: rgba(239, 68, 68, 0.9);
    transform: rotate(90deg);
  }

  .pcb-modal-tabs {
    display: flex;
    gap: 0.65rem;
    padding: 1.15rem 2.25rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    overflow-x: auto;
  }

  .pcb-modal-tab {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #475569;
    padding: 0.6rem 1.25rem;
    border-radius: 9999px;
    font-family: var(--pcb-font-display);
    font-size: 0.94rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
  }

  .pcb-modal-tab.active, .pcb-modal-tab:hover {
    background: #1d4ed8;
    color: #ffffff;
    border-color: #1d4ed8;
    box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
  }

  .pcb-modal-body {
    padding: 2rem 2.25rem;
    overflow-y: auto;
    flex: 1;
    background: #f8fafc;
  }

  .pcb-modal-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  @media (min-width: 768px) {
    .pcb-modal-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1080px) {
    .pcb-modal-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .pcb-template-card {
    background: #ffffff;
    border: 1.5px solid #e2e8f0;
    border-radius: 18px;
    padding: 1.65rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: var(--pcb-shadow-sm);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
  }

  .pcb-template-card:hover {
    border-color: #2563eb;
    box-shadow: 0 14px 34px -5px rgba(37, 99, 235, 0.2);
    transform: translateY(-4px);
  }

  .pcb-tpl-top {
    display: flex;
    gap: 1.15rem;
    margin-bottom: 1rem;
  }

  .pcb-tpl-img {
    width: 86px;
    height: 86px;
    object-fit: contain;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 6px;
    flex-shrink: 0;
  }

  .pcb-tpl-info {
    flex: 1;
    min-width: 0;
  }

  .pcb-tpl-cat-badge {
    font-family: var(--pcb-font-display);
    font-size: 0.78rem;
    font-weight: 800;
    color: #1d4ed8;
    background: #eff6ff;
    padding: 0.25rem 0.65rem;
    border-radius: 6px;
    display: inline-block;
  }

  .pcb-tpl-title {
    font-family: var(--pcb-font-display);
    font-size: 1.22rem;
    font-weight: 800;
    color: var(--pcb-text);
    margin: 0.4rem 0 0.3rem 0;
    line-height: 1.3;
  }

  .pcb-tpl-perf {
    background: #f1f5f9;
    border-left: 3px solid #0284c7;
    padding: 0.55rem 0.75rem;
    border-radius: 6px;
    font-size: 0.84rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.85rem;
  }

  .pcb-tpl-specs-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .pcb-tpl-spec-item {
    font-size: 0.85rem;
    color: #475569;
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    line-height: 1.35;
  }

  .pcb-tpl-spec-item::before {
    content: '✓';
    color: #10b981;
    font-weight: 900;
    flex-shrink: 0;
  }

  .pcb-tpl-bottom {
    padding-top: 1.15rem;
    border-top: 1px solid var(--pcb-border);
  }

  .pcb-tpl-price-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .pcb-tpl-price-label {
    font-size: 0.84rem;
    color: var(--pcb-text-muted);
  }

  .pcb-tpl-price-val {
    font-family: var(--pcb-font-display);
    font-size: 1.55rem;
    font-weight: 900;
    color: #0f172a;
  }

  .pcb-tpl-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
  }

  .pcb-tpl-btn-load {
    background: #f8fafc;
    color: #1e3a8a;
    border: 1.5px solid #cbd5e1;
    padding: 0.75rem 0.5rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }

  .pcb-tpl-btn-load:hover {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #1d4ed8;
  }

  .pcb-tpl-btn-buy {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #ffffff;
    border: none;
    padding: 0.75rem 0.5rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
  }

  .pcb-tpl-btn-buy:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(245, 158, 11, 0.5);
  }

  .pcb-modal-footer {
    padding: 1.25rem 2.25rem;
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .pcb-modal-guarantee {
    font-size: 0.9rem;
    color: #475569;
  }

  .pcb-modal-btn-secondary {
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
    padding: 0.65rem 1.25rem;
    border-radius: 10px;
    font-family: var(--pcb-font-display);
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pcb-modal-btn-secondary:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
</style>

<div class="pcb-wrapper">
  <div class="pcb-container">

    <!-- 1. HERO BANNER DE ALTO IMPACTO -->
    <div class="pcb-hero">
      <div class="pcb-hero-badge-wrap">
        <div class="pcb-hero-badge">
          <span class="pcb-pulse-dot"></span>
          <span>Configurador de Equipos B2B & Gamer</span>
        </div>
      </div>
      
      <h1 class="pcb-hero-title">Configurador de PC <span>Inteligente</span></h1>
      <div class="pcb-hero-subtitle">Personaliza tu PC a la medida exacta de tus requerimientos técnicos</div>
      <p class="pcb-hero-desc">
        Arma tu estación de trabajo para oficina, ingeniería, monitoreo CCTV o gaming de alto rendimiento. Nuestro motor verifica la compatibilidad de socket y memorias en tiempo real con componentes 100% nuevos de marcas líderes y factura fiscal CFDI 4.0.
      </p>

      <!-- 3 Tarjetas flotantes de confianza y especificaciones -->
      <div class="pcb-hero-features-bar">
        <div class="pcb-hero-feat-card">
          <div class="pcb-hero-feat-icon">🛡️</div>
          <div>
            <div class="pcb-hero-feat-title">100% Componentes Nuevos</div>
            <div class="pcb-hero-feat-sub">Garantía oficial directa y soporte Tulbox</div>
          </div>
        </div>
        <div class="pcb-hero-feat-card">
          <div class="pcb-hero-feat-icon">⚡</div>
          <div>
            <div class="pcb-hero-feat-title">Ensamble Certificado</div>
            <div class="pcb-hero-feat-sub">Pruebas antiestáticas & BIOS actualizado</div>
          </div>
        </div>
        <div class="pcb-hero-feat-card">
          <div class="pcb-hero-feat-icon">🚚</div>
          <div>
            <div class="pcb-hero-feat-title">Envío Asegurado a México</div>
            <div class="pcb-hero-feat-sub">Desglose de IVA y facturación SAT CFDI 4.0</div>
          </div>
        </div>
      </div>

      <!-- Lanzador del Modal de Plantillas Rápidas -->
      <div class="pcb-hero-presets">
        <button type="button" class="pcb-preset-modal-trigger-btn" onclick="pcbApp.openTemplatesModal('all')">
          ✨ Explorar Plantillas Rápidas & Ensambles Recomendados (6 opciones)
        </button>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.openTemplatesModal('office')">
          🏢 Oficina & PyME
        </button>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.openTemplatesModal('cctv')">
          📹 Estación CCTV Pro
        </button>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.openTemplatesModal('gaming')">
          🎮 Gamer E-Sports
        </button>
        <button type="button" class="pcb-preset-btn" onclick="pcbApp.openTemplatesModal('workstation')">
          🏗️ Workstation 3D
        </button>
      </div>
    </div>

    <!-- 2. GRID PRINCIPAL (ACORDEÓN + RESUMEN) -->
    <div class="pcb-main-grid">

      <!-- COLUMNA IZQUIERDA: ACORDEÓN DE COMPONENTES -->
      <div class="pcb-accordion-card">
        <div class="pcb-accordion-header-top">
          <div>
            <h2 class="pcb-accordion-main-title">Configuración de Componentes</h2>
            <p class="pcb-accordion-main-desc">Selecciona los componentes. Nuestro motor valida socket y memorias automáticamente.</p>
          </div>
          <button type="button" class="pcb-actions-dropdown-btn" onclick="pcbApp.resetConfig()">
            🔄 Reiniciar ensamble
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
            <span class="pcb-chip" id="pcbChip_cpu" onclick="pcbApp.toggleStep('cpu')">🧠 1. CPU</span>
            <span class="pcb-chip" id="pcbChip_mobo" onclick="pcbApp.toggleStep('mobo')">🔌 2. Placa Madre</span>
            <span class="pcb-chip" id="pcbChip_ram" onclick="pcbApp.toggleStep('ram')">⚡ 3. RAM</span>
            <span class="pcb-chip" id="pcbChip_ssd" onclick="pcbApp.toggleStep('ssd')">💾 4. SSD</span>
            <span class="pcb-chip" id="pcbChip_case" onclick="pcbApp.toggleStep('case')">📦 5. Gabinete</span>
            <span class="pcb-chip" id="pcbChip_psu" onclick="pcbApp.toggleStep('psu')">🔋 6. Fuente</span>
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
            <span>Fuente recomendada: <strong id="pcbWattRecVal">500W+</strong></span>
            <span class="pcb-watt-status-tag" id="pcbWattStatusTag">🟢 En rango</span>
          </div>
        </div>

        <div class="pcb-compat-alert" id="pcbCompatAlert">
          <span>✓ Compatibilidad verificada: Todo listo para ensamble.</span>
        </div>

        <div class="pcb-summary-list" id="pcbSummaryList">
          <div style="text-align: center; color: #94a3b8; padding: 2.5rem 1rem;">
            Aún no has agregado componentes. Haz clic en las categorías de la izquierda para comenzar.
          </div>
        </div>

        <!-- Opción de Servicio de Ensamble Profesional -->
        <div class="pcb-assembly-option-card">
          <label class="pcb-assembly-check-label">
            <input type="checkbox" id="pcbAssemblyCheck" checked onchange="pcbApp.toggleAssembly(this.checked)">
            <div class="pcb-assembly-check-content">
              <div class="pcb-assembly-check-title">
                🛠️ Incluir Servicio de Ensamble Profesional
                <span class="pcb-assembly-badge">Recomendado</span>
              </div>
              <div class="pcb-assembly-check-desc">
                Montaje antiestático en taller certificado, cable management profesional, BIOS actualizado y 2h de pruebas térmicas (+ $999 MXN por equipo).
              </div>
            </div>
            <div class="pcb-assembly-check-price">+$999 MXN</div>
          </label>
        </div>

        <div id="pcbOnOrderNotice" class="pcb-on-order-alert" style="display: none; background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 0.85rem 1.15rem; border-radius: 12px; font-size: 0.9rem; line-height: 1.45; margin: 1.25rem 0; gap: 0.65rem;">
          📦 <span>Esta configuración incluye <strong>piezas sobre pedido</strong>. Tu equipo será probado y despachado en <strong>3 a 5 días hábiles</strong>.</span>
        </div>

        <div class="pcb-summary-totals">
          <div class="pcb-total-row">
            <span>Subtotal componentes:</span>
            <span id="pcbSubtotalText">$0.00 MXN</span>
          </div>
          <div class="pcb-total-row">
            <span>Servicio de armado y pruebas:</span>
            <span id="pcbAssemblyPriceRow" style="font-weight: 800; color: #1d4ed8;">$999.00 MXN</span>
          </div>
          <div class="pcb-total-row grand-total">
            <span>Total (incl. IVA):</span>
            <span id="pcbGrandTotalText">$0.00 MXN</span>
          </div>
          <div class="pcb-tax-note">Facturación fiscal SAT CFDI 4.0 disponible</div>
        </div>

        <!-- Sellos de confianza oficiales en el sidebar -->
        <div class="pcb-sidebar-trust-badges">
          <div class="pcb-trust-pill">📄 Factura CFDI 4.0</div>
          <div class="pcb-trust-pill">🛡️ Garantía 1 Año</div>
          <div class="pcb-trust-pill">🚚 Envío Asegurado</div>
          <div class="pcb-trust-pill">💬 Soporte WhatsApp</div>
        </div>
      </div>

    </div>

  </div>
</div>

<!-- MODAL DE PLANTILLAS RÁPIDAS (SHOWCASE) -->
<div class="pcb-modal-overlay" id="pcbTemplatesModal" style="display: none;" onclick="if(event.target === this) pcbApp.closeTemplatesModal()">
  <div class="pcb-modal-dialog">
    <div class="pcb-modal-header">
      <div>
        <div class="pcb-modal-badge">⚡ Ensambles Curados por Ingenieros</div>
        <h2 class="pcb-modal-title">Plantillas Rápidas & Ensambles Recomendados</h2>
        <p class="pcb-modal-desc">
          Elige una configuración base lista para usar y con ensamble garantizado. Puedes cargarla al configurador para ajustarla a tu gusto o comprarla directamente con un solo clic.
        </p>
      </div>
      <button type="button" class="pcb-modal-close-btn" onclick="pcbApp.closeTemplatesModal()" aria-label="Cerrar modal">✕</button>
    </div>

    <!-- PESTAÑAS DE FILTRO DENTRO DEL MODAL -->
    <div class="pcb-modal-tabs">
      <button type="button" class="pcb-modal-tab active" id="pcbTab_all" onclick="pcbApp.filterTemplates('all')">
        🔘 Todas las Plantillas (6)
      </button>
      <button type="button" class="pcb-modal-tab" id="pcbTab_office" onclick="pcbApp.filterTemplates('office')">
        🏢 Oficina & Facturación (2)
      </button>
      <button type="button" class="pcb-modal-tab" id="pcbTab_cctv" onclick="pcbApp.filterTemplates('cctv')">
        📹 Monitoreo CCTV Pro (1)
      </button>
      <button type="button" class="pcb-modal-tab" id="pcbTab_gaming" onclick="pcbApp.filterTemplates('gaming')">
        🎮 Gaming E-Sports (2)
      </button>
      <button type="button" class="pcb-modal-tab" id="pcbTab_workstation" onclick="pcbApp.filterTemplates('workstation')">
        🏗️ Workstation 3D (1)
      </button>
    </div>

    <!-- CUERPO CON GRID DE PLANTILLAS -->
    <div class="pcb-modal-body">
      <div class="pcb-modal-grid" id="pcbTemplatesGrid">
        <!-- Renderizado dinámicamente vía JavaScript -->
      </div>
    </div>

    <div class="pcb-modal-footer">
      <div class="pcb-modal-guarantee">
        <span>🛡️ <strong>Garantía Total:</strong> 1 año de garantía oficial &bull; Pruebas antiestáticas de 2h &bull; BIOS actualizado &bull; Factura fiscal CFDI 4.0</span>
      </div>
      <button type="button" class="pcb-modal-btn-secondary" onclick="pcbApp.closeTemplatesModal()">
        Cerrar y volver al configurador
      </button>
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
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <span style="font-family: var(--pcb-font-display); font-weight: 700; color: #475569; font-size: 0.95rem;">Cantidad:</span>
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
      { key: 'cpu', name: 'Procesador (CPU)', icon: '🧠', iconClass: 'pcb-icon-cpu', placeholder: 'Paso 1 • Seleccionar procesador' },
      { key: 'mobo', name: 'Tarjeta Madre (Motherboard)', icon: '🔌', iconClass: 'pcb-icon-mobo', placeholder: 'Paso 2 • Seleccionar tarjeta madre' },
      { key: 'ram', name: 'Memoria RAM', icon: '⚡', iconClass: 'pcb-icon-ram', placeholder: 'Paso 3 • Seleccionar memoria RAM' },
      { key: 'ssd', name: 'Almacenamiento (SSD)', icon: '💾', iconClass: 'pcb-icon-ssd', placeholder: 'Paso 4 • Seleccionar unidad de almacenamiento' },
      { key: 'case', name: 'Gabinete (Chasis)', icon: '📦', iconClass: 'pcb-icon-case', placeholder: 'Paso 5 • Seleccionar gabinete' },
      { key: 'psu', name: 'Fuente de Poder (PSU)', icon: '🔋', iconClass: 'pcb-icon-psu', placeholder: 'Paso 6 • Seleccionar fuente de poder' },
      { key: 'gpu', name: 'Tarjeta de Video (GPU)', icon: '🎮', iconClass: 'pcb-icon-gpu', placeholder: 'Opcional • Seleccionar tarjeta gráfica' },
      { key: 'cooler', name: 'Enfriamiento y Disipador', icon: '❄️', iconClass: 'pcb-icon-cooler', placeholder: 'Opcional • Seleccionar disipador de calor' },
      { key: 'monitor', name: 'Monitor y Pantalla', icon: '🖥️', iconClass: 'pcb-icon-monitor', placeholder: 'Opcional • Seleccionar monitor o pantalla' }
    ];

    const ESSENTIAL_KEYS = ['cpu', 'mobo', 'ram', 'ssd', 'case', 'psu'];

    window.pcbApp = {
      selected: {},
      systemQty: 1,
      includeAssembly: true,
      activeStep: 'cpu',
      editingStep: null,
      searchFilters: {},
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
        this.activeStep = this.activeStep === key ? null : key;
        this.renderAccordion();
      },

      selectItem: function(catKey, item) {
        const prevQty = this.selected[catKey] ? this.selected[catKey].qty : 1;
        this.selected[catKey] = { ...item, qty: prevQty || 1 };
        this.editingStep = null;
        
        // Reglas de compatibilidad automática y avance al siguiente paso
        if (catKey === 'cpu') {
          const currentMobo = this.selected['mobo'];
          if (currentMobo && currentMobo.socket !== item.socket) {
            delete this.selected['mobo'];
          }
          this.activeStep = 'mobo';
        } else if (catKey === 'mobo') {
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
        if (this.editingStep === catKey) this.editingStep = null;
        this.renderAccordion();
        this.updateSummary();
      },

      resetConfig: function() {
        this.selected = {};
        this.activeStep = 'cpu';
        this.editingStep = null;
        this.renderAccordion();
        this.updateSummary();
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
            <div style="grid-column: 1 / -1; padding: 2.5rem 1rem; text-align: center; color: #64748b;">
              🔍 No se encontraron piezas que coincidan con <strong>"\${this.searchFilters[catKey] || ''}"</strong>. Prueba con otra característica, modelo o marca.
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
                  <div style="margin-bottom: 0.35rem;">
                    <span class="pcb-opt-stock-badge \${inStock ? 'in-stock' : 'on-order'}">
                      \${inStock ? '🟢 En Stock (24-48h)' : '🟡 Sobre Pedido (3-5 días)'}
                    </span>
                  </div>
                  <h4 class="pcb-opt-title">\${item.title}</h4>
                  <div class="pcb-opt-tags">
                    \${item.socket ? '<span class="pcb-opt-tag">' + item.socket + '</span>' : ''}
                    \${item.ramType ? '<span class="pcb-opt-tag">' + item.ramType + '</span>' : ''}
                    \${item.capacity ? '<span class="pcb-opt-tag">' + item.capacity + '</span>' : ''}
                    \${item.watts ? '<span class="pcb-opt-tag">' + item.watts + '</span>' : ''}
                    \${item.hz ? '<span class="pcb-opt-tag">' + item.hz + '</span>' : ''}
                    \${item.coolerType ? '<span class="pcb-opt-tag">' + item.coolerType + '</span>' : ''}
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

      editStep: function(key) {
        this.editingStep = key;
        this.activeStep = key;
        this.renderAccordion();
      },

      cancelEdit: function() {
        this.editingStep = null;
        this.renderAccordion();
      },

      getAvailableProducts: function(catKey) {
        let items = CATALOG[catKey] || [];
        const selectedCpu = this.selected['cpu'];
        const selectedMobo = this.selected['mobo'];

        if (catKey === 'mobo' && selectedCpu && selectedCpu.socket) {
          items = items.filter(m => m.socket === selectedCpu.socket);
        }

        if (catKey === 'ram' && selectedMobo && selectedMobo.ramType) {
          items = items.filter(r => r.ramType === selectedMobo.ramType);
        }

        if (this.onlyInStockFilter[catKey]) {
          items = items.filter(x => x.inStock !== false);
        }

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
                <div style="display: flex; align-items: center; gap: 0.65rem;">
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
                    <div style="margin: 0.35rem 0;">
                      <span class="pcb-opt-stock-badge \${selectedItem.inStock !== false ? 'in-stock' : 'on-order'}">
                        \${selectedItem.inStock !== false ? '🟢 Entrega Inmediata (24-48h)' : '🟡 Sobre Pedido (3 a 5 días)'}
                      </span>
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
                  <div class="pcb-qty-picker-row" title="Modificar cantidad de piezas de este componente">
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

                <div class="pcb-picker-controls">
                  <div class="pcb-search-wrap">
                    <span class="pcb-search-icon">🔍</span>
                    <input type="text" class="pcb-search-input" id="pcbSearch_\${step.key}" placeholder="Buscar por modelo, marca o características (ej. Core i5, DDR5, NVMe, 750W)..." 
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
                <div style="grid-column: 1 / -1; padding: 2.5rem 1rem; text-align: center; color: #64748b;">
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
                        <div style="margin-bottom: 0.35rem;">
                          <span class="pcb-opt-stock-badge \${inStock ? 'in-stock' : 'on-order'}">
                            \${inStock ? '🟢 En Stock (24-48h)' : '🟡 Sobre Pedido (3-5 días)'}
                          </span>
                        </div>
                        <h4 class="pcb-opt-title">\${item.title}</h4>
                        <div class="pcb-opt-tags">
                          \${item.socket ? '<span class="pcb-opt-tag">' + item.socket + '</span>' : ''}
                          \${item.ramType ? '<span class="pcb-opt-tag">' + item.ramType + '</span>' : ''}
                          \${item.capacity ? '<span class="pcb-opt-tag">' + item.capacity + '</span>' : ''}
                          \${item.watts ? '<span class="pcb-opt-tag">' + item.watts + '</span>' : ''}
                          \${item.hz ? '<span class="pcb-opt-tag">' + item.hz + '</span>' : ''}
                          \${item.coolerType ? '<span class="pcb-opt-tag">' + item.coolerType + '</span>' : ''}
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
        this.updateProgressBar();
      },

      updateProgressBar: function() {
        let completedEssential = 0;
        ESSENTIAL_KEYS.forEach(k => {
          const isSelected = !!this.selected[k];
          const chipEl = document.getElementById('pcbChip_' + k);
          if (chipEl) {
            if (isSelected) {
              chipEl.classList.add('done');
              chipEl.innerHTML = '✓ ' + chipEl.textContent.replace(/^✓\s*/, '');
            } else {
              chipEl.classList.remove('done');
              chipEl.innerHTML = chipEl.textContent.replace(/^✓\s*/, '');
            }
          }
          if (isSelected) completedEssential++;
        });

        const pct = Math.round((completedEssential / ESSENTIAL_KEYS.length) * 100);
        const fillEl = document.getElementById('pcbProgressFill');
        const countEl = document.getElementById('pcbProgressCount');

        if (fillEl) fillEl.style.width = pct + '%';
        if (countEl) countEl.textContent = completedEssential + ' de ' + ESSENTIAL_KEYS.length + ' esenciales listos (' + pct + '%)';
      },

      updateWattMeter: function() {
        let estimatedWatts = 120; // Base: motherboard, fans, storage, RAM
        const cpu = this.selected['cpu'];
        const gpu = this.selected['gpu'];
        const psu = this.selected['psu'];

        if (cpu) {
          const t = cpu.title.toLowerCase();
          if (t.includes('i9') || t.includes('7900') || t.includes('9900') || t.includes('9950')) estimatedWatts += 180;
          else if (t.includes('i7') || t.includes('7700') || t.includes('9700') || t.includes('5700') || t.includes('7600')) estimatedWatts += 105;
          else estimatedWatts += 65;
        }

        if (gpu) {
          const t = gpu.title.toLowerCase();
          if (t.includes('9070') || t.includes('5070')) estimatedWatts += 250;
          else if (t.includes('5060') || t.includes('9060')) estimatedWatts += 160;
          else if (t.includes('1030')) estimatedWatts += 30;
          else estimatedWatts += 150;
        }

        const suggestedPsuWatts = Math.ceil((estimatedWatts * 1.5) / 50) * 50;

        const valEl = document.getElementById('pcbWattVal');
        const fillEl = document.getElementById('pcbWattBarFill');
        const recEl = document.getElementById('pcbWattRecVal');
        const statusTag = document.getElementById('pcbWattStatusTag');

        if (valEl) valEl.textContent = '~' + estimatedWatts + ' Watts';
        if (recEl) recEl.textContent = suggestedPsuWatts + 'W+';
        if (fillEl) {
          const barPct = Math.min(100, Math.round((estimatedWatts / 700) * 100));
          fillEl.style.width = Math.max(15, barPct) + '%';
        }

        if (statusTag) {
          if (psu) {
            statusTag.textContent = '🟢 Fuente asignada';
            statusTag.style.color = '#34d399';
          } else {
            statusTag.textContent = '🟡 Falta fuente';
            statusTag.style.color = '#fbbf24';
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
          listEl.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 2.5rem 1rem;">Aún no has agregado componentes. Haz clic en las categorías de la izquierda para comenzar.</div>';
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
        let totalPiecesCount = 0;

        keys.forEach(k => {
          const item = this.selected[k];
          const qty = item.qty || 1;
          const linePrice = item.price * qty;
          const inStock = item.inStock !== false;
          totalSingle += linePrice;
          totalPiecesCount += qty;

          summaryHtml += \`
            <div class="pcb-summary-item">
              <img src="\${item.img}" alt="\${item.title}" class="pcb-summary-item-img" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
              <div class="pcb-summary-item-info">
                <div class="pcb-summary-item-name" title="\${item.title}">\${item.title}</div>
                <div class="pcb-summary-item-meta">
                  <span>\${qty} pza\${qty > 1 ? 's' : ''} &bull; \${item.vendor}</span>
                  <span class="pcb-opt-stock-badge \${inStock ? 'in-stock' : 'on-order'}" style="font-size: 0.7rem; padding: 0.1rem 0.45rem; margin: 0;">
                    \${inStock ? '🟢 Stock' : '🟡 Sobre Pedido'}
                  </span>
                </div>
              </div>
              <div class="pcb-summary-item-price">$\${linePrice.toLocaleString('es-MX')}</div>
            </div>
          \`;
        });

        const assemblyCost = this.includeAssembly ? (999 * this.systemQty) : 0;
        const grandTotal = (totalSingle * this.systemQty) + assemblyCost;

        listEl.innerHTML = summaryHtml;
        countEl.textContent = totalPiecesCount + ' pieza' + (totalPiecesCount !== 1 ? 's' : '');
        subtotalEl.textContent = '$' + (totalSingle * this.systemQty).toLocaleString('es-MX') + ' MXN';

        const assemblyRow = document.getElementById('pcbAssemblyPriceRow');
        if (assemblyRow) {
          if (this.includeAssembly) {
            assemblyRow.style.color = '#1d4ed8';
            assemblyRow.textContent = '$' + assemblyCost.toLocaleString('es-MX') + ' MXN';
          } else {
            assemblyRow.style.color = '#94a3b8';
            assemblyRow.textContent = 'No incluido (en cajas)';
          }
        }

        const hasOnOrder = keys.some(k => this.selected[k].inStock === false);
        const onOrderNoticeEl = document.getElementById('pcbOnOrderNotice');
        if (onOrderNoticeEl) {
          onOrderNoticeEl.style.display = hasOnOrder ? 'flex' : 'none';
        }

        this.calcDeliveryDate();

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

      templates: [
        {
          id: 'pyme-pos',
          category: 'office',
          catLabel: '🏪 Punto de Venta & Facturación',
          title: 'PC PyME Facturación CFDI 4.0',
          subtitle: 'Para facturación continua, Aspel, Contpaqi, punto de venta y administración.',
          perfBadge: '⚡ 100% Fluida para Aspel, CONTPAQi y CFDI SAT',
          img: 'https://static.ctonline.mx/imagenes/GABACT140/GABACT140_7_full.jpg',
          inStock: true,
          highlights: [
            'Procesador AMD Ryzen 5 5600GE con gráficos Radeon Vega',
            'Tarjeta Madre ASUS PRIME B550M-K (Socket AM4)',
            'Memoria RAM 16GB ADATA Premier DDR4',
            'SSD ADATA SU630 480GB Ultrarrápido',
            'Gabinete compacto ACTECK GI240 con Fuente 500W incluida'
          ],
          components: {
            cpu: 'amd-ryzen-5-5600ge-cpuamd3020',
            mobo: 'asus-prime-b550m-k-mbdass4950',
            ram: 'adata-ad4s320016g22-sgn-memdat5890',
            ssd: 'adata-asu630ss-480gq-r-ddudat1300',
            case: 'acteck-gi240-a-gc240-gabact140',
            psu: 'acteck-ft500ew-gabact520'
          }
        },
        {
          id: 'cctv-station',
          category: 'cctv',
          catLabel: '📹 Monitoreo CCTV Pro',
          title: 'Estación de Monitoreo CCTV Pro',
          subtitle: 'Diseñada específicamente para VMS (Hikvision iVMS-4200, Dahua SmartPSS y Milestone).',
          perfBadge: '📹 Hasta 32 cámaras H.265 simultáneas en vivo sin lag',
          img: 'https://static.ctonline.mx/imagenes/GABACT330/GABACT330_full.jpg',
          inStock: true,
          highlights: [
            'Procesador Intel Core i3-12100 Quad-Core a 4.3 GHz',
            'Tarjeta Madre ASUS PRIME H610M-K',
            'Memoria RAM 16GB Kingston FURY Beast DDR4',
            'SSD ADATA LEGEND 860 1TB M.2 NVMe (Escritura continua)',
            'Tarjeta de Video MSI GeForce GT 1030 2GB (Doble monitor HDMI)',
            'Gabinete con flujo de aire ACTECK GC470 + Fuente 600W'
          ],
          components: {
            cpu: 'procesador-intel-core-i3-12100-lga1700',
            mobo: 'asus-prime-h610m-k-mbdass6240',
            ram: 'kingston-technology-fury-beast-memkgn2870',
            ssd: 'adata-legend-860-ddudat2190',
            gpu: 'tarjeta-de-video-msi-geforce-gt-1030-2gb',
            case: 'acteck-gc470-gabact330',
            psu: 'acteck-ft600ew-gabact510'
          }
        },
        {
          id: 'corp-exec',
          category: 'office',
          catLabel: '💼 Corporativa & PyME',
          title: 'PC Ejecutiva Multitarea Pro',
          subtitle: 'Para directores, contadores y gerentes con Excel masivo y múltiples pantallas.',
          perfBadge: '📊 Multitarea pesada, ERPs y análisis financiero',
          img: 'https://static.ctonline.mx/imagenes/GABACT260/GABACT260_full.jpg',
          inStock: true,
          highlights: [
            'Procesador Intel Core i5-12400F LGA1700',
            'Tarjeta Madre GIGABYTE MB H610M K DDR4',
            'Memoria RAM 16GB ADATA Hunter DDR4',
            'SSD ADATA LEGEND 860 1TB M.2 NVMe',
            'Gabinete silencioso ACTECK GM450 + Fuente 600W',
            'Monitor ACTECK SP270 27" Full HD incluido'
          ],
          components: {
            cpu: 'procesador-intel-core-i5-12400f-lga1700',
            mobo: 'gigabyte-mb-gigabyte-h610m-k-ddr4-mbdgig5040',
            ram: 'adata-hunter-memdat7220',
            ssd: 'adata-legend-860-ddudat2190',
            case: 'acteck-gm450-gabact260',
            psu: 'acteck-es-05004e-gabact360',
            monitor: 'acteck-sp270-monact030'
          }
        },
        {
          id: 'gaming-esports',
          category: 'gaming',
          catLabel: '🎮 Gaming E-Sports',
          title: 'PC Gamer Delta RTX 5060',
          subtitle: 'Rendimiento competitivo fluido en 1080p Ultra con Ray Tracing y DLSS 4.0.',
          perfBadge: '🎯 144+ FPS en Warzone, Valorant, Fortnite y CS2',
          img: 'https://static.ctonline.mx/imagenes/GABACT170/GABACT170_5_full.jpg',
          inStock: true,
          highlights: [
            'Procesador AMD Ryzen 5 7600X (Socket AM5, DDR5)',
            'Tarjeta Madre GIGABYTE B650M D3HP (AM5)',
            'Memoria RAM 16GB ADATA Hunter DDR5',
            'SSD ADATA LEGEND 900 1TB Gen4 NVMe (Hasta 7000 MB/s)',
            'GPU GIGABYTE RTX 5060 EAGLE OC 8GB',
            'Disipador Balam Rush EX50',
            'Gabinete ACTECK KIOTO GC460 RGB Cristal Templado + Fuente 650W'
          ],
          components: {
            cpu: 'amd-7600x-cpuamd2420',
            mobo: 'gigabyte-b650m-d3hp-mbdgig5140',
            ram: 'adata-hunter-ddr5-memdat7410',
            ssd: 'adata-legend-900-ddudat2090',
            gpu: 'gigabyte-gv-n506teagle-oc-8gd-tvigig3510',
            cooler: 'balam-rush-ex50-venblr130',
            case: 'acteck-kioto-gc460-rgb-essential-gabact170',
            psu: 'balam-rush-gr650b-gabblr500'
          }
        },
        {
          id: 'workstation-render',
          category: 'workstation',
          catLabel: '🏗️ Arquitectura & 3D',
          title: 'Apex Workstation Render & BIM',
          subtitle: 'Certificada para flujos intensivos en AutoCAD, Revit, SolidWorks y Premiere Pro.',
          perfBadge: '🏗️ Render 3D acelerado por hardware & BIM masivo',
          img: 'https://static.ctonline.mx/imagenes/GABACT610/GABACT610_full.jpg',
          inStock: true,
          highlights: [
            'Procesador Intel Core i7-14700K (20 núcleos / 28 hilos hasta 5.6 GHz)',
            'Tarjeta Madre GIGABYTE B760M D3HP',
            'Memoria RAM 32GB (2x16GB) ADATA Hunter',
            'SSD ADATA LEGEND 900 2TB Gen4 (7400 MB/s)',
            'GPU ASUS PRIME RX 9070 XT 16GB GDDR6',
            'Disipador Balam Rush EX70K',
            'Gabinete ACTECK ONEX GS455 + Fuente Balam Rush 750W 80+ Gold'
          ],
          components: {
            cpu: 'procesador-intel-core-i7-14700k-lga1700',
            mobo: 'gigabyte-mb-gigabyte-b760m-d3hp-mbdgig5180',
            ram: 'adata-hunter-memdat7220',
            ramQty: 2,
            ssd: 'adata-legend-900-ddudat2100',
            gpu: 'tarjeta-de-video-asus-prime-rx-9070-xt-16gb',
            cooler: 'balam-rush-ex70k-venblr190',
            case: 'acteck-onex-gs455-gabact610',
            psu: 'balam-rush-gr750g-gabblr480'
          }
        },
        {
          id: 'gaming-extreme',
          category: 'gaming',
          catLabel: '🚀 Gaming 4K & Streamer',
          title: 'Titan Gaming 4K Ultra & Creator',
          subtitle: 'Tope de línea para jugar en 4K Ultra con Ray Tracing y streamear sin límites.',
          perfBadge: '🏆 4K Ultra 120 FPS con Ray Tracing + Streamer OBS',
          img: 'https://static.ctonline.mx/imagenes/GABACT600/GABACT600_full.jpg',
          inStock: false,
          highlights: [
            'Procesador Intel Core i9-14900K (24 núcleos / 32 hilos hasta 6.0 GHz)',
            'Tarjeta Madre GIGABYTE B760M D3HP',
            'Memoria RAM 32GB (2x16GB) Kingston FURY Beast',
            'SSD ADATA LEGEND 900 2TB NVMe Gen4',
            'GPU ASUS PRIME RX 9070 XT 16GB (o RTX 5060 Ti)',
            'Disipador Balam Rush EX90KW',
            'Gabinete Gamer ACTECK GM767 + Fuente Balam Rush 850W Gold'
          ],
          components: {
            cpu: 'procesador-intel-core-i9-14900k-lga1700',
            mobo: 'gigabyte-mb-gigabyte-b760m-d3hp-mbdgig5180',
            ram: 'kingston-technology-fury-beast-memkgn2870',
            ramQty: 2,
            ssd: 'adata-legend-900-ddudat2100',
            gpu: 'tarjeta-de-video-asus-prime-rx-9070-xt-16gb',
            cooler: 'balam-rush-ex90kw-venblr240',
            case: 'acteck-gm767-gabact600',
            psu: 'balam-rush-gr850g-gabblr470'
          }
        }
      ],

      getTemplatePrice: function(tpl) {
        let total = 0;
        for (const cat in tpl.components) {
          const compId = tpl.components[cat];
          const item = (CATALOG[cat] || []).find(x => x.id === compId);
          if (item) {
            const qty = (cat === 'ram' && tpl.ramQty) ? tpl.ramQty : 1;
            total += item.price * qty;
          }
        }
        return total;
      },

      openTemplatesModal: function(category) {
        const modal = document.getElementById('pcbTemplatesModal');
        if (!modal) return;
        this.currentModalCategory = category || 'all';
        this.filterTemplates(this.currentModalCategory);
        modal.classList.add('open');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      },

      closeTemplatesModal: function() {
        const modal = document.getElementById('pcbTemplatesModal');
        if (!modal) return;
        modal.classList.remove('open');
        setTimeout(() => {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }, 200);
      },

      filterTemplates: function(category) {
        this.currentModalCategory = category;
        const tabs = document.querySelectorAll('.pcb-modal-tab');
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = document.getElementById('pcbTab_' + category);
        if (activeTab) activeTab.classList.add('active');

        this.renderTemplatesGrid(category);
      },

      renderTemplatesGrid: function(category) {
        const grid = document.getElementById('pcbTemplatesGrid');
        if (!grid) return;

        let filtered = this.templates;
        if (category && category !== 'all') {
          filtered = this.templates.filter(t => t.category === category);
        }

        let html = '';
        filtered.forEach(tpl => {
          const price = this.getTemplatePrice(tpl);
          const inStock = tpl.inStock !== false;

          html += \`
            <div class="pcb-template-card">
              <div>
                <div class="pcb-tpl-top">
                  <img src="\${tpl.img}" alt="\${tpl.title}" class="pcb-tpl-img" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=pcbApp.fallbackImg;">
                  <div class="pcb-tpl-info">
                    <span class="pcb-tpl-cat-badge">\${tpl.catLabel}</span>
                    <h3 class="pcb-tpl-title">\${tpl.title}</h3>
                    <div style="margin-top: 0.25rem;">
                      <span class="pcb-opt-stock-badge \${inStock ? 'in-stock' : 'on-order'}">
                        \${inStock ? '🟢 Entrega Inmediata' : '🟡 Sobre Pedido (3-5d)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="pcb-tpl-perf">
                  <span>\${tpl.perfBadge}</span>
                </div>

                <p style="font-size: 0.88rem; color: #64748b; margin: 0 0 0.85rem 0; line-height: 1.45;">
                  \${tpl.subtitle}
                </p>

                <ul class="pcb-tpl-specs-list">
                  \${tpl.highlights.map(h => \`<li class="pcb-tpl-spec-item">\${h}</li>\`).join('')}
                </ul>
              </div>

              <div class="pcb-tpl-bottom">
                <div class="pcb-tpl-price-row">
                  <span class="pcb-tpl-price-label">Total piezas (IVA incl.):</span>
                  <span class="pcb-tpl-price-val">$\${price.toLocaleString('es-MX')} MXN</span>
                </div>
                <div class="pcb-tpl-actions">
                  <button type="button" class="pcb-tpl-btn-load" onclick="pcbApp.loadTemplateIntoConfig('\${tpl.id}')" title="Carga estos componentes al configurador para personalizarlos">
                    🛠️ Cargar al Configurador
                  </button>
                  <button type="button" class="pcb-tpl-btn-buy" onclick="pcbApp.buyTemplateDirect('\${tpl.id}')" title="Comprar este ensamble de inmediato con servicio de armado">
                    🛒 Comprar Directo
                  </button>
                </div>
              </div>
            </div>
          \`;
        });

        grid.innerHTML = html;
      },

      loadTemplateIntoConfig: function(templateId) {
        const tpl = this.templates.find(t => t.id === templateId);
        if (!tpl) return;

        this.selected = {};
        for (const cat in tpl.components) {
          const compId = tpl.components[cat];
          const item = (CATALOG[cat] || []).find(x => x.id === compId);
          if (item) {
            const qty = (cat === 'ram' && tpl.ramQty) ? tpl.ramQty : 1;
            this.selected[cat] = { ...item, qty };
          }
        }

        this.closeTemplatesModal();
        this.renderAccordion();
        this.updateSummary();

        const gridEl = document.querySelector('.pcb-main-grid');
        if (gridEl) {
          gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },

      buyTemplateDirect: async function(templateId) {
        this.loadTemplateIntoConfig(templateId);
        this.includeAssembly = true;
        await this.addToCart();
      },

      loadPreset: function(type) {
        this.openTemplatesModal(type === 'office' ? 'office' : (type === 'gamer' ? 'gaming' : 'workstation'));
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
          const itemsToAdd = [];

          for (const k of keys) {
            const item = this.selected[k];
            let vId = item.variantId;
            if (!vId) {
              const handle = item.handle || item.id;
              try {
                const res = await fetch('/products/' + handle + '.js');
                const pData = await res.json();
                if (pData && pData.variants && pData.variants.length > 0) {
                  vId = pData.variants[0].id;
                }
              } catch (err) {
                console.warn('No se pudo obtener variant ID para:', handle, err);
              }
            }

            if (vId) {
              itemsToAdd.push({
                id: Number(vId),
                quantity: (item.qty || 1) * this.systemQty,
                properties: {
                  '_Configuracion_PC': 'Ensamble Personalizado',
                  'Componente': item.title,
                  'Disponibilidad': item.inStock !== false ? 'Entrega Inmediata (24-48h)' : 'Sobre Pedido (3 a 5 días hábiles)'
                }
              });
            }
          }

          if (this.includeAssembly) {
            itemsToAdd.push({
              id: 52774689276036,
              quantity: this.systemQty,
              properties: {
                '_Configuracion_PC': 'Ensamble Personalizado',
                'Servicio': 'Ensamble Profesional de Equipo de Cómputo y Pruebas de Rendimiento'
              }
            });
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
          alert('Selecciona al menos un componente para generar tu cotización formal.');
          return;
        }

        let msg = 'Hola Seguridad Avanzada, deseo cotizar formalmente la siguiente configuración de PC:\\n\\n';
        let subtotal = 0;

        keys.forEach(k => {
          const item = this.selected[k];
          const qty = item.qty || 1;
          const lineTotal = item.price * qty;
          subtotal += lineTotal;
          const stockLabel = item.inStock !== false ? 'En Stock' : 'Sobre Pedido';
          msg += '• ' + item.title + (qty > 1 ? ' (x' + qty + ')' : '') + ' [' + stockLabel + '] - $' + lineTotal.toLocaleString('es-MX') + ' MXN\\n';
        });

        if (this.includeAssembly) {
          msg += '• Servicio de Ensamble y Pruebas de Estrés - $' + (999 * this.systemQty).toLocaleString('es-MX') + ' MXN\\n';
        }

        const grandTotal = (subtotal * this.systemQty) + (this.includeAssembly ? (999 * this.systemQty) : 0);
        msg += '\\nCantidad de Equipos: ' + this.systemQty + '\\n';
        msg += 'Total Estimado con IVA: $' + grandTotal.toLocaleString('es-MX') + ' MXN\\n\\n';
        msg += '¿Me pueden enviar la cotización en PDF y datos para pago por transferencia SPEI?';

        const url = 'https://wa.me/525540447386?text=' + encodeURIComponent(msg);
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
console.log('Successfully updated sections/page-configurador-pc.liquid with enhanced UI/UX!');
