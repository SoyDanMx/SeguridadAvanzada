import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '¿Quieres ser Distribuidor? | Seguridad Avanzada',
  description: 'Programa oficial de canales, integradores y distribuidores de Seguridad Avanzada y Nuo Networks. Precios de mayoreo, inventario en 25 bodegas y crédito.',
};

export default function DistribuidoresPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <div className="text-base text-slate-500 mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">Inicio</Link> &rsaquo; <span>¿Quieres ser distribuidor?</span>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-xl border border-blue-500/30">
        <span className="inline-block bg-sky-500/20 border border-sky-400/40 text-sky-300 text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          🤝 Programa de Canales e Integradores B2B
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          ¿Quieres ser Distribuidor de Seguridad Avanzada?
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed">
          Accede a las mejores condiciones comerciales, inventario garantizado en 25 bodegas nacionales y respaldo directo de las marcas más importantes de seguridad electrónica del mundo.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Ventajas Exclusivas para Integradores y Mayoristas</h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          En <strong>Seguridad Avanzada</strong> y <strong>Nuo Networks</strong> impulsamos el crecimiento de instaladores, empresas de tecnología y contratistas con herramientas diseñadas para maximizar tus márgenes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">🏷️</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Precios Mayoristas Preferenciales</h3>
              <p className="text-slate-600 text-base leading-relaxed">Descuentos escalonados por volumen sobre precio de lista para que ganes más en cada proyecto.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Cotizador Rápido Pro B2B</h3>
              <p className="text-slate-600 text-base leading-relaxed">Genera cotizaciones PDF membretadas con tu logotipo y precios al instante en nuestra plataforma.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">🏬</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Recolección en 25 Bodegas</h3>
              <p className="text-slate-600 text-base leading-relaxed">Retira material el mismo día en cualquiera de nuestros 25 centros de distribución en México.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">🛠️</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Soporte Técnico Especializado</h3>
              <p className="text-slate-600 text-base leading-relaxed">Ingeniería preventa para dimensionar enlaces inalámbricos, CCTV IP, control de acceso y cableado estructurado.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requisitos */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Requisitos para Darse de Alta</h2>
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4 text-emerald-950 text-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">✓</div>
            <div><strong>Constancia de Situación Fiscal (CSF) actualizada:</strong> Con actividad económica en tecnología, seguridad, telecomunicaciones o construcción.</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4 text-emerald-950 text-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">✓</div>
            <div><strong>Identificación oficial vigente:</strong> INE o Pasaporte del representante legal o titular.</div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4 text-emerald-950 text-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">✓</div>
            <div><strong>Comprobante de domicilio fiscal:</strong> No mayor a 3 meses de antigüedad.</div>
          </div>
        </div>
      </div>

      {/* Pie de Contacto */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-extrabold mb-1.5">¿Listo para comenzar a distribuir?</h3>
          <p className="text-slate-300 text-base max-w-xl leading-relaxed">
            Contacta a nuestro Gerente de Canales de Distribución por WhatsApp o correo para activar tu cuenta mayorista en menos de 2 horas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/525636741156?text=Hola,%20deseo%20darme%20de%20alta%20como%20distribuidor%20mayorista"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            💬 Alta vía WhatsApp
          </a>
          <a
            href="mailto:proyectos@seguridad-avanzada.com?subject=Alta%20de%20Distribuidor%20Mayorista"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-5 py-3.5 rounded-lg transition-colors"
          >
            ✉️ Solicitar por Correo
          </a>
        </div>
      </div>
    </div>
  );
}
