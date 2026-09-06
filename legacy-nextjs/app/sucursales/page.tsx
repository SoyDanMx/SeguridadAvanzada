'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const BRANCHES = [
  { name: 'Aguascalientes', state: 'Aguascalientes', tag: 'Recolección' },
  { name: 'Cancún', state: 'Quintana Roo', tag: 'Recolección' },
  { name: 'Cd. Juarez', state: 'Chihuahua', tag: 'Recolección' },
  { name: 'Matriz Chihuahua', state: 'Chihuahua', tag: 'Almacén Central' },
  { name: 'Chihuahua Norte', state: 'Chihuahua', tag: 'Recolección' },
  { name: 'Culiacan', state: 'Sinaloa', tag: 'Recolección' },
  { name: 'Guadalajara', state: 'Jalisco', tag: 'CEDIS Regional' },
  { name: 'Hermosillo', state: 'Sonora', tag: 'Recolección' },
  { name: 'La Paz BCS', state: 'Baja California Sur', tag: 'Recolección' },
  { name: 'Leon', state: 'Guanajuato', tag: 'Recolección' },
  { name: 'Mérida', state: 'Yucatán', tag: 'Recolección' },
  { name: 'México Norte', state: 'CDMX / EdoMex', tag: 'CEDIS Central' },
  { name: 'México Sureste', state: 'CDMX', tag: 'Recolección' },
  { name: 'Monterrey', state: 'Nuevo León', tag: 'CEDIS Norte' },
  { name: 'Monterrey Centro', state: 'Nuevo León', tag: 'Recolección' },
  { name: 'Oaxaca', state: 'Oaxaca', tag: 'Recolección' },
  { name: 'Puebla', state: 'Puebla', tag: 'Recolección' },
  { name: 'Queretaro', state: 'Querétaro', tag: 'CEDIS Bajío' },
  { name: 'San Luis Potosi', state: 'San Luis Potosí', tag: 'Recolección' },
  { name: 'Tepotzotlan', state: 'Estado de México', tag: 'CEDIS Mega Almacén' },
  { name: 'Tijuana', state: 'Baja California', tag: 'Frontera / Recolección' },
  { name: 'Toluca', state: 'Estado de México', tag: 'Recolección' },
  { name: 'Torreon', state: 'Coahuila', tag: 'Recolección' },
  { name: 'Veracruz', state: 'Veracruz', tag: 'Recolección' },
  { name: 'Villahermosa', state: 'Tabasco', tag: 'Recolección' },
];

export default function SucursalesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBranches = BRANCHES.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-slate-800">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shadow-sm">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sucursales y Bodegas
          </h1>
          <p className="text-slate-500 font-medium text-base mt-1">
            Red Nacional de Centros de Distribución con Recolección Personal (Pick-Up)
          </p>
        </div>
      </div>

      {/* Tarjeta de Recolección Personal */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 mb-8 flex items-start gap-4 shadow-sm">
        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-5 h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="text-sm text-emerald-900 leading-relaxed">
          <strong className="text-emerald-950 font-bold block text-base mb-1">
            📦 Modalidad de Recolección Personal (Pick-Up):
          </strong>
          Contamos con <strong>25 bodegas y centros de distribución</strong> estratégicos en todo México para retiro inmediato de mercancía. Para asegurar existencias y agilizar tu entrega, te recomendamos <strong>generar tu cotización o pedido previamente</strong>. Tu asesor asignado te compartirá el folio de recolección y la dirección exacta de la bodega en tu localidad.
        </div>
      </div>

      {/* Buscador */}
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por ciudad o estado (ej. Guadalajara, Monterrey, CDMX, Puebla...)"
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm text-base"
        />
      </div>

      {/* Grid de 25 Sucursales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredBranches.map((b) => (
          <a
            key={b.name}
            href={`https://wa.me/525636741156?text=Hola,%20deseo%20coordinar%20recolecci%C3%B3n%20en%20bodega%20de%20${encodeURIComponent(
              b.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 flex items-center justify-between transition-all hover:-translate-y-0.5 hover:shadow-md group"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-emerald-500 flex-shrink-0 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="font-bold text-slate-900 text-base">{b.name}</span>
            </div>
            <span className="bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-colors">
              {b.tag}
            </span>
          </a>
        ))}
      </div>

      {/* Pie de Asistencia */}
      <div className="mt-12 bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-extrabold mb-1">
            ¿Deseas recolectar en alguna de nuestras bodegas?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl">
            Comunícate con nuestro equipo B2B por WhatsApp indicando el SKU o modelo de tu interés y la ciudad donde deseas recoger. Validaremos existencias al instante y prepararemos tu folio de entrega.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/525636741156?text=Hola,%20deseo%20consultar%20disponibilidad%20para%20recolecci%C3%B3n%20en%20sucursal"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            💬 Contactar por WhatsApp
          </a>
          <Link
            href="/politica-de-entrega-y-envio"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm px-4 py-3 rounded-lg transition-colors"
          >
            📦 Políticas de Envío
          </Link>
        </div>
      </div>
    </div>
  );
}
