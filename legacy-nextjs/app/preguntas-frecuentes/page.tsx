import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Preguntas Frecuentes (FAQ) | Seguridad Avanzada',
  description: 'Respuestas a dudas frecuentes sobre envíos, garantías, facturación CFDI 4.0, bodegas y compras internacionales en Seguridad Avanzada.',
};

export default function PreguntasFrecuentesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <div className="text-base text-slate-500 mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">Inicio</Link> &rsaquo; <span>Preguntas Frecuentes</span>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-xl border border-blue-500/30">
        <span className="inline-block bg-sky-500/20 border border-sky-400/40 text-sky-300 text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          ❓ Centro de Respuestas &bull; FAQ
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Preguntas Frecuentes
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed">
          Encuentra respuestas rápidas y detalladas sobre envíos, garantías, facturación, recolección en bodegas y operaciones internacionales con Nuo Networks.
        </p>
      </div>

      {/* Categoría 1 */}
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-3 border-b-2 border-slate-200 mb-6 flex items-center gap-2">
          🚚 Envíos y Recolección en Bodegas
        </h2>

        <div className="space-y-4">
          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors" open>
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Cuáles son los tiempos de entrega a todo México?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              Los envíos terrestres estándar tardan de <strong>2 a 5 días hábiles</strong> en zonas metropolitanas (CDMX, Guadalajara, Monterrey, Puebla, Querétaro, etc.). Para pedidos exprés, la entrega se realiza en <strong>24 a 48 horas hábiles</strong>. Los pedidos pagados antes de las 14:00 horas se despachan el mismo día hábil.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Puedo recoger mi mercancía personalmente en sus bodegas?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              <strong>Sí, totalmente.</strong> Contamos con <strong>25 bodegas y centros de distribución</strong> en las principales ciudades de México y nuestro Corporativo México en <strong>Av. Clavería 237, Azcapotzalco, CDMX</strong>. Te recomendamos generar tu cotización o pedido previamente con tu asesor para asegurar existencias antes de acudir.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Con qué paqueterías trabajan y cómo rastreo mi envío?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              Trabajamos con <strong>FedEx, DHL, Estafeta, Paquetexpress, Castores y Tres Guerras</strong>. En cuanto el paquete es recolectado, enviamos automáticamente el número de guía y el enlace de rastreo a tu correo electrónico registrado.
            </p>
          </details>
        </div>
      </div>

      {/* Categoría 2 */}
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-3 border-b-2 border-slate-200 mb-6 flex items-center gap-2">
          💳 Facturación y Métodos de Pago
        </h2>

        <div className="space-y-4">
          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Emiten factura fiscal mexicana (CFDI 4.0)?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              <strong>Sí, todos nuestros precios ya incluyen IVA (16%).</strong> Emitimos facturas CFDI versión 4.0 con validez ante el SAT. Solo envíanos tu Constancia de Situación Fiscal (CSF) actualizada y el Uso de CFDI al momento de tu compra o dentro del mismo mes calendario.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Puedo pagar en efectivo o en mostrador?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              Sí, aceptamos pagos en efectivo mediante <strong>OXXO Pay</strong> en toda la república y pagos directos en nuestra caja de mostrador en <strong>Corporativo México (Av. Clavería 237, Azcapotzalco, CDMX)</strong> donde puedes pagar en efectivo o con tarjetas bancarias.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Puedo obtener una factura comercial en Estados Unidos (USD)?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              Sí. A través de <strong>Nuo Networks, Inc.</strong> (Delaware US C-Corporation), emitimos facturas comerciales en dólares sin retenciones mexicanas y aceptamos pagos vía Wire Transfer / ACH doméstico en EE.UU.
            </p>
          </details>
        </div>
      </div>

      {/* Categoría 3 */}
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 pb-3 border-b-2 border-slate-200 mb-6 flex items-center gap-2">
          🛡️ Garantías y Soporte Técnico
        </h2>

        <div className="space-y-4">
          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Qué garantía tienen los equipos?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              Todos nuestros productos son 100% nuevos, originales y cuentan con <strong>garantía de fábrica de 1 a 5 años</strong> (dependiendo de la marca y tipo de producto) contra defectos de fabricación. Gestionamos el trámite de RMA directamente con los centros de servicio autorizados.
            </p>
          </details>

          <details className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm group hover:border-blue-500 transition-colors">
            <summary className="font-bold text-xl text-slate-900 cursor-pointer list-none flex justify-between items-center">
              <span>¿Ofrecen servicio de instalación y soporte en sitio?</span>
              <span className="text-2xl text-blue-600 font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-4 text-slate-700 text-lg leading-relaxed pt-3 border-t border-slate-100">
              Sí. Coordinamos servicios de instalación, cableado estructurado, configuración y mantenimiento en sitio a través de <strong>Tulbox Servicios Técnicos</strong>, nuestra red oficial de técnicos e instaladores certificados en todo México.
            </p>
          </details>
        </div>
      </div>

      {/* Pie de Asistencia */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-extrabold mb-1.5">¿Tienes alguna pregunta no listada?</h3>
          <p className="text-slate-300 text-base max-w-xl leading-relaxed">
            Nuestro equipo de ingeniería y atención a clientes está disponible de lunes a viernes de 9:00 a 18:00 hrs para resolver cualquier duda técnica o comercial.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/525636741156?text=Hola,%20tengo%20una%20pregunta%20sobre%20Seguridad%20Avanzada"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            💬 Preguntar por WhatsApp
          </a>
          <a
            href="mailto:proyectos@seguridad-avanzada.com"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-5 py-3.5 rounded-lg transition-colors"
          >
            ✉️ Enviar Correo
          </a>
        </div>
      </div>
    </div>
  );
}
