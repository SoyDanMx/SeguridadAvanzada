import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Bolsa de Trabajo y Vacantes B2B | Seguridad Avanzada',
  description: 'Unete al equipo de Seguridad Avanzada y Nuo Networks. Vacantes en ventas B2B, ingeniería preventa, soporte y logística.',
};

export default function BolsaTrabajoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      <div className="text-base text-slate-500 mb-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">Inicio</Link> &rsaquo; <span>Bolsa de Trabajo</span>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 sm:p-12 mb-10 shadow-xl border border-blue-500/30">
        <span className="inline-block bg-sky-500/20 border border-sky-400/40 text-sky-300 text-sm font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
          🚀 Crece con Nosotros &bull; Talento B2B
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Únete al Equipo de Seguridad Avanzada
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl max-w-3xl leading-relaxed">
          Forma parte de una compañía líder en mayoreo e integración de tecnología, sistemas de seguridad electrónica, telecomunicaciones y energía en México y Estados Unidos (Nuo Networks, Inc.).
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">¿Por qué trabajar en Seguridad Avanzada?</h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          Nos caracterizamos por un ambiente de alto dinamismo profesional, capacitación continua y acceso directo a las certificaciones de los principales fabricantes del mundo (Hikvision, Dahua, Ubiquiti, Honeywell, Western Digital, Cisco y más).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">📈</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Crecimiento y Carrera</h3>
              <p className="text-slate-600 text-base leading-relaxed">Planes de desarrollo para integradores, asesores comerciales B2B y directores de proyecto.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">🎓</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Capacitación y Certificaciones</h3>
              <p className="text-slate-600 text-base leading-relaxed">Cursos técnicos oficiales patrocinados y entrenamiento en ingeniería de preventa.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">💼</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Compensación Competitiva</h3>
              <p className="text-slate-600 text-base leading-relaxed">Sueldos base competitivos, esquemas de comisiones agresivos sin tope y prestaciones de ley.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex gap-4 items-start">
            <span className="text-3xl">🌐</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Presencia Binacional</h3>
              <p className="text-slate-600 text-base leading-relaxed">Operación coordinada con 25 bodegas en México y Nuo Networks Inc. en Delaware, EE.UU.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vacantes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">Vacantes Abiertas Actualmente</h2>
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500 transition-colors">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1.5">Ejecutivo de Ventas B2B / Cuentas Clave</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">Comercial &bull; Mayoreo</span>
                <span className="bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">CDMX / Híbrido</span>
                <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">Tiempo Completo</span>
              </div>
            </div>
            <a href="https://wa.me/525636741156?text=Hola,%20deseo%20postularme%20a%20la%20vacante%20de%20Ejecutivo%20de%20Ventas%20B2B" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-3 rounded-lg text-center transition-colors">
              Postularme
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500 transition-colors">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1.5">Ingeniero de Preventa y Soporte CCTV / Redes</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">Ingeniería &bull; Soporte</span>
                <span className="bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">Corporativo Clavería, CDMX</span>
                <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">Tiempo Completo</span>
              </div>
            </div>
            <a href="https://wa.me/525636741156?text=Hola,%20deseo%20postularme%20a%20la%20vacante%20de%20Ingeniero%20de%20Preventa" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-3 rounded-lg text-center transition-colors">
              Postularme
            </a>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500 transition-colors">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1.5">Especialista en Logística y Almacén CEDIS</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">Operaciones &bull; Almacén</span>
                <span className="bg-slate-200 text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">Zona Metropolitana CDMX</span>
                <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">Tiempo Completo</span>
              </div>
            </div>
            <a href="https://wa.me/525636741156?text=Hola,%20deseo%20postularme%20a%20la%20vacante%20de%20Especialista%20en%20Log%C3%ADstica" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-6 py-3 rounded-lg text-center transition-colors">
              Postularme
            </a>
          </div>
        </div>
      </div>

      {/* Postulación Espontánea */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-extrabold mb-1.5">¿No encuentras una vacante para tu perfil?</h3>
          <p className="text-slate-300 text-base max-w-xl leading-relaxed">
            Envíanos tu Curriculum Vitae actualizado indicando tu área de especialidad. Constantemente abrimos posiciones en compras, marketing digital, administración y soporte en sitio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/525636741156?text=Hola,%20deseo%20enviar%20mi%20CV%20para%20bolsa%20de%20trabajo%20de%20Seguridad%20Avanzada"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base px-6 py-3.5 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            💬 Enviar CV por WhatsApp
          </a>
          <a
            href="mailto:proyectos@seguridad-avanzada.com?subject=Postulaci%C3%B3n%20Laboral%20-%20Seguridad%20Avanzada"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-5 py-3.5 rounded-lg transition-colors"
          >
            ✉️ Enviar por Correo
          </a>
        </div>
      </div>
    </div>
  );
}
