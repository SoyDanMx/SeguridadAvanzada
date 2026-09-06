import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Políticas de Entrega y Envíos | Seguridad Avanzada',
  description: 'Cobertura nacional, tiempos de entrega y protocolos de recepción de Seguridad Avanzada y Nuo Networks.',
};

export default function PoliticaEntregaYEnvioPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <div className="text-base text-slate-500 mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">Inicio</Link> &rsaquo; <span>Políticas de Entrega y Envíos</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <span className="inline-block bg-blue-50 text-blue-700 text-sm font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
          📦 Términos y Logística Oficial
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
          Políticas de Entrega y Envíos
        </h1>
        <p className="text-base sm:text-lg text-slate-500 pb-6 mb-8 border-b border-slate-200">
          Vigente a partir de 2024 &bull; Última actualización: Septiembre 2026 &bull; <strong>Seguridad Avanzada &bull; Nuo Networks, Inc.</strong>
        </p>

        <p className="text-lg sm:text-xl leading-relaxed text-slate-700 mb-8">
          En <strong>Seguridad Avanzada</strong> (operada en territorio nacional por <strong>Nuo Integraciones y Servicios</strong> y a nivel corporativo transfronterizo por <strong>Nuo Networks, Inc.</strong> Delaware US C-Corp), garantizamos que su equipamiento tecnológico, sistemas de videovigilancia CCTV, control de acceso, redes y energía lleguen con total integridad, rapidez y trazabilidad en todo México y Estados Unidos.
        </p>

        {/* 1. Cobertura */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0">1</span>
          Cobertura Geográfica de Envíos
        </h2>
        <p className="text-lg text-slate-700 mb-4 leading-relaxed">
          Realizamos envíos a toda la República Mexicana cubriendo los 32 estados y sus municipios mediante alianzas con las principales empresas de mensajería y carga:
        </p>
        <ul className="list-disc list-inside space-y-3 text-lg text-slate-700 ml-4 mb-8 leading-relaxed">
          <li><strong>Envíos Nacionales (México):</strong> Cobertura integral en zonas metropolitanas, ciudades intermedias y poblaciones con cobertura regular de paquetería.</li>
          <li><strong>Zonas Extendidas:</strong> En poblados o zonas rurales con frecuencia de entrega programada, el tiempo de tránsito puede extenderse según el calendario de la transportadora.</li>
          <li><strong>Operaciones en Estados Unidos (B2B):</strong> Para proyectos empresariales e integración en EE.UU., operamos mediante Nuo Networks, Inc. con logística y facturación local estadounidense sin trámites aduanales para el cliente final.</li>
        </ul>

        {/* 2. Procesamiento */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0">2</span>
          Tiempos de Procesamiento y Preparación
        </h2>
        <div className="bg-slate-50 border-l-4 border-blue-600 p-5 rounded-r-lg text-base sm:text-lg text-slate-800 my-6 leading-relaxed">
          <strong>⏰ Horario de corte para envíos:</strong><br />
          Los pedidos con pago acreditado antes de las <strong>14:00 horas (Tiempo del Centro de México / CDMX)</strong> de lunes a viernes se procesan y empaquetan el mismo día hábil. Pagos validados después de este horario o durante fines de semana y días festivos se programan para el siguiente día hábil inmediato.
        </div>

        {/* 3. Tiempos de Entrega */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0">3</span>
          Tiempos Estimados de Tránsito
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-1.5">🚚 Envío Estándar Terrestre</h4>
            <p className="text-base text-slate-600 leading-relaxed"><strong>2 a 5 días hábiles</strong> en zonas metropolitanas (CDMX, Guadalajara, Monterrey, Puebla, Querétaro, etc.).</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-1.5">⚡ Envío Exprés Prioritario</h4>
            <p className="text-base text-slate-600 leading-relaxed"><strong>24 a 48 horas hábiles</strong> en ciudades principales (sujeto a disponibilidad).</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-1.5">📦 Carga Consolidada y Tarimas</h4>
            <p className="text-base text-slate-600 leading-relaxed"><strong>3 a 7 días hábiles</strong> para alto volumen (racks, bobinas de cable, gabinetes o postes).</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="text-lg font-bold text-slate-900 mb-1.5">🏢 Recolección en Almacén (Pick-Up)</h4>
            <p className="text-base text-slate-600 leading-relaxed"><strong>Mismo día o 24 hrs</strong> previa cita en Av. Clavería 237, Azcapotzalco, CDMX.</p>
          </div>
        </div>

        {/* 4. Operadores Logísticos */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0">4</span>
          Operadores Logísticos y Rastreo
        </h2>
        <ul className="list-disc list-inside space-y-3 text-lg text-slate-700 ml-4 mb-6 leading-relaxed">
          <li><strong>FedEx Express</strong> y <strong>DHL Express</strong> para paquetería de alta prioridad.</li>
          <li><strong>Estafeta</strong> y <strong>Paquetexpress</strong> para cobertura nacional y zonas intermedias.</li>
          <li><strong>Castores</strong> y <strong>Tres Guerras</strong> para equipo pesado, cableado y carga consolidada LTL.</li>
        </ul>
        <p className="text-lg text-slate-700 mb-8 leading-relaxed">
          Una vez despachado el paquete, recibirá por correo electrónico su <strong>número de guía y enlace directo de rastreo</strong>.
        </p>

        {/* 5. Seguro de Carga y Protocolo */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-extrabold flex items-center justify-center flex-shrink-0">5</span>
          Seguro de Transporte y Protocolo de Recepción
        </h2>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg text-base sm:text-lg text-amber-900 my-6 leading-relaxed">
          <strong>⚠️ PROTOCOLO OBLIGATORIO AL RECIBIR EL PAQUETE:</strong><br />
          1. <strong>Inspección visual:</strong> Antes de firmar de recibido, verifique que la caja no presente roturas, cintas desprendidas o humedad.<br />
          2. <strong>Si la caja está dañada:</strong> Anote por escrito ante el repartidor: <em>&quot;Paquete recibido con caja golpeada / cinta alterada&quot;</em>, o rechácelo.<br />
          3. <strong>Registro fotográfico:</strong> Tome fotografías claras del empaque antes de abrirlo.<br />
          4. <strong>Plazo de reporte:</strong> Cualquier anomalía debe reportarse dentro de las <strong>primeras 48 horas naturales</strong> a <a href="mailto:proyectos@seguridad-avanzada.com" className="underline font-semibold">proyectos@seguridad-avanzada.com</a> o al WhatsApp <a href="https://wa.me/525636741156" className="underline font-semibold">+52 56 3674 1156</a>.
        </div>

        {/* Contacto */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <strong className="block text-slate-900 text-lg sm:text-xl mb-1">¿Dudas sobre el estatus de tu envío?</strong>
            <span className="text-base text-slate-500">Contáctanos con tu número de pedido o cotización.</span>
          </div>
          <div className="flex gap-3.5 flex-wrap justify-center">
            <a
              href="https://wa.me/525636741156?text=Hola,%20deseo%20rastrear%20mi%20pedido%20de%20Seguridad%20Avanzada"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors"
            >
              💬 WhatsApp Soporte
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors"
            >
              ✉️ Contacto
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
