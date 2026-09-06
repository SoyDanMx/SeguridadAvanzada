import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Facturación en Línea CFDI 4.0 | Seguridad Avanzada',
  description: 'Emisión de facturas electrónicas CFDI 4.0 ante el SAT y Facturas Comerciales B2B en Estados Unidos mediante Nuo Networks.',
};

export default function FacturacionEnLineaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <div className="text-base text-slate-500 mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">Inicio</Link> &rsaquo; <span>Facturación en Línea</span>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-xl border border-blue-500/30">
        <span className="inline-block bg-sky-500/20 border border-sky-400/40 text-sky-300 text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          📑 Emisión Fiscal Oficial &bull; CFDI 4.0
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Facturación en Línea
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed">
          Generamos tus Comprobantes Fiscales Digitales por Internet (CFDI versión 4.0) con validez ante el SAT y Facturas Comerciales B2B internacionales en dólares (USD).
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">¿Cómo solicitar tu factura en 3 sencillos pasos?</h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          Todos los precios en Seguridad Avanzada incluyen IVA (16%) en moneda nacional (MXN). Para emitir tu factura electrónica, sigue este proceso:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">1</div>
            <h3 className="text-xl font-bold text-slate-900">Realiza tu Compra</h3>
            <p className="text-slate-600 text-base leading-relaxed">Conserva tu número de pedido de la tienda en línea o folio de cotización formal.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">2</div>
            <h3 className="text-xl font-bold text-slate-900">Envía tus Datos Fiscales</h3>
            <p className="text-slate-600 text-base leading-relaxed">Comparte tu Constancia de Situación Fiscal (CSF) actualizada, Uso de CFDI y forma de pago.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">3</div>
            <h3 className="text-xl font-bold text-slate-900">Recibe tus Archivos</h3>
            <p className="text-slate-600 text-base leading-relaxed">Te enviamos tus archivos <strong>PDF y XML</strong> timbrados directamente a tu correo en 24-48 hrs.</p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl text-base sm:text-lg text-blue-950 mb-6 leading-relaxed">
          <strong>📋 Datos obligatorios conforme al SAT (CFDI 4.0):</strong><br />
          &bull; RFC (Registro Federal de Contribuyentes).<br />
          &bull; Nombre completo o Razón Social (tal cual aparece en la Cédula Fiscal, sin régimen societario).<br />
          &bull; Código Postal del domicilio fiscal registrado.<br />
          &bull; Régimen Fiscal en el que tributas.<br />
          &bull; Uso de CFDI (ej. G01 Adquisición de mercancías, G03 Gastos en general).
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl text-base sm:text-lg text-amber-950 leading-relaxed">
          <strong>⚠️ Plazo fiscal importante:</strong><br />
          Las solicitudes de facturación deben realizarse dentro del <strong>mismo mes calendario</strong> en que se efectuó el pago. Por disposiciones fiscales del SAT, no es posible emitir facturas con fecha de meses anteriores una vez cerrado el periodo mensual.
        </div>
      </div>

      {/* Facturación USA */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-sky-400/40 rounded-2xl p-8 sm:p-10 text-white mb-10 shadow-xl">
        <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-sm font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
          🇺🇸 Estados Unidos &bull; Operación B2B
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">¿Requieres Factura Comercial en EE.UU. (USD)?</h2>
        <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mb-6">
          Si representas a una empresa en Estados Unidos o estás adquiriendo equipamiento para un proyecto transfronterizo, facturamos directamente a través de <strong>Nuo Networks, Inc.</strong> (Delaware US C-Corporation), proporcionándote facturas comerciales válidas para deducibilidad corporativa en EE.UU. y pago vía Wire Transfer / ACH sin retenciones internacionales.
        </p>
        <a
          href="https://wa.me/14243553283?text=Hello%20Nuo%20Networks,%20I'm%20interested%20in%20US%20B2B%20invoicing%20and%20purchases"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          💬 Contactar a Nuo Networks USA
        </a>
      </div>

      {/* Pie de Contacto */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-extrabold mb-1.5">¿Deseas facturar tu compra ahora mismo?</h3>
          <p className="text-slate-300 text-base max-w-xl leading-relaxed">
            Envíanos tu comprobante de pago o número de orden junto con tu constancia fiscal por WhatsApp o correo para emisión inmediata.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/525636741156?text=Hola,%20deseo%20solicitar%20la%20factura%20de%20mi%20compra"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            💬 Solicitar por WhatsApp
          </a>
          <a
            href="mailto:proyectos@seguridad-avanzada.com?subject=Solicitud%20de%20Facturaci%C3%B3n%20CFDI"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-5 py-3.5 rounded-lg transition-colors"
          >
            ✉️ facturacion@seguridad-avanzada.com
          </a>
        </div>
      </div>
    </div>
  );
}
