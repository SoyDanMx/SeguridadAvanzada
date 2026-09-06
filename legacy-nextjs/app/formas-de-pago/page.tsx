import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Formas de Pago Aceptadas | Seguridad Avanzada',
  description: 'Conoce los métodos de pago seguros de Seguridad Avanzada: SPEI, tarjetas de crédito/débito, OXXO Pay, pagos en sitio y USD internacional.',
};

export default function FormasDePagoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <div className="text-base text-slate-500 mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">Inicio</Link> &rsaquo; <span>Formas de Pago</span>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-xl border border-blue-500/30">
        <span className="inline-block bg-sky-500/20 border border-sky-400/40 text-sky-300 text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          🔒 Pagos Seguros y Cifrados &bull; 100% Garantizados
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Formas de Pago
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed">
          Ofrecemos diversas alternativas de pago seguras, transparentes y convenientes para compras individuales y adquisiciones empresariales B2B.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">⚡</div>
            <h2 className="text-2xl font-bold text-slate-900">Transferencia SPEI</h2>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            Transferencias interbancarias directas sin comisiones adicionales a nuestras cuentas corporativas en <strong>Citibanamex</strong> y <strong>BBVA</strong>.
          </p>
          <ul className="space-y-2 text-slate-600 text-base">
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Acreditación inmediata (minutos)</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Ideal para mayoreo y licitaciones</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Emisión directa de factura CFDI 4.0</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">💳</div>
            <h2 className="text-2xl font-bold text-slate-900">Tarjetas Bancarias</h2>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            Aceptamos <strong>Visa, Mastercard y American Express</strong> procesadas mediante pasarelas con cifrado de nivel bancario SSL/TLS de 256 bits.
          </p>
          <ul className="space-y-2 text-slate-600 text-base">
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Validación instantánea en línea</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Meses sin intereses aplicables</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Protección 3D Secure contra fraudes</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">🏪</div>
            <h2 className="text-2xl font-bold text-slate-900">OXXO Pay (Efectivo)</h2>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            Paga en efectivo en cualquiera de las más de 20,000 tiendas OXXO en México generando un código de barras de 14 dígitos.
          </p>
          <ul className="space-y-2 text-slate-600 text-base">
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Notificación automática de pago</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Sin necesidad de tarjeta bancaria</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Plazo de pago de 24 horas</li>
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:border-blue-500 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">🌐</div>
            <h2 className="text-2xl font-bold text-slate-900">Wire / ACH (USD)</h2>
          </div>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            Para compras transfronterizas desde Estados Unidos mediante <strong>Nuo Networks, Inc.</strong> Delaware US C-Corp.
          </p>
          <ul className="space-y-2 text-slate-600 text-base">
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Transferencias domésticas en EE.UU.</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Facturas en dólares sin retención</li>
            <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Logística y soporte local en EE.UU.</li>
          </ul>
        </div>
      </div>

      {/* Pagos en Sitio Corporativo México */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-sky-400/40 rounded-2xl p-8 sm:p-10 text-white mb-10 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">🏢 Pago Directo en Sitio: Corporativo México</h2>
        <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mb-6">
          Puedes acudir directamente a nuestra sede central en <strong>Av. Clavería 237, Col. Claveria, Azcapotzalco, 02080 CDMX</strong> para pagar y recolectar tu pedido personalmente. Contamos con caja de cobro en sitio donde aceptamos efectivo, terminales bancarias y SPEI en mostrador.
        </p>
        <a
          href="https://wa.me/525636741156?text=Hola,%20deseo%20coordinar%20mi%20visita%20para%20pagar%20en%20Corporativo%20Claver%C3%ADa"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          💬 Agendar Visita en Corporativo
        </a>
      </div>

      {/* Pie de Asistencia */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-extrabold mb-1.5">¿Tienes dudas sobre las formas de pago?</h3>
          <p className="text-slate-300 text-base max-w-xl leading-relaxed">
            Comunícate con un asesor de ventas para solicitar cuentas bancarias oficiales CLABE o coordinar pagos combinados para proyectos.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/525636741156?text=Hola,%20deseo%20informaci%C3%B3n%20sobre%20cuentas%20bancarias%20para%20pago"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            💬 WhatsApp de Cobranza
          </a>
          <a
            href="mailto:proyectos@seguridad-avanzada.com"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-5 py-3.5 rounded-lg transition-colors"
          >
            ✉️ Contactar Finanzas
          </a>
        </div>
      </div>
    </div>
  );
}
