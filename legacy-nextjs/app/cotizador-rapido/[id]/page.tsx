import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    select: { folio: true }
  });
  return {
    title: quote ? `Cotizacion ${quote.folio}` : 'Cotización'
  };
}

interface QuoteItem {
  concept: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export default async function CotizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id }
  });

  if (!quote) {
    notFound();
  }

  const quoteData = quote.items as any;
  const products = Array.isArray(quoteData) ? quoteData : quoteData.products || [];
  const profName = !Array.isArray(quoteData) && quoteData.professionalName ? quoteData.professionalName : "Daniel Nuño";
  const profPhone = !Array.isArray(quoteData) && quoteData.professionalPhone ? quoteData.professionalPhone : "+52 56 3674 1156";

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        
        {/* Encabezado Corporativo estilo Minimalista (Facturama / Clean) */}
        <div className="bg-white p-4 sm:p-6 md:p-10 print:p-10 flex flex-col md:flex-row print:flex-row items-center md:items-start justify-between border-b border-gray-200 gap-4 md:gap-0">
          <div className="w-full flex justify-center md:justify-start print:justify-start">
            <img src="/logo.png" alt="Seguridad Avanzada" className="h-20 sm:h-24 md:h-28 print:h-28 w-auto object-contain" />
          </div>
          <div className="text-center md:text-right print:text-right w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Cotización de Servicio</h1>
            <p className="text-xs sm:text-sm text-gray-800 font-semibold mb-1">Cotizacion - NUO INTEGRACIONES Y SERVICIOS | RFC: NIS230310Q9A</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Atenas 1-1, Col. San Alvaro, Alcaldía Azcapotzalco, Ciudad de México, C.P. 02090</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 break-words">Contacto: proyectos@seguridad-avanzada.com | WhatsApp MX: +525636741156 | www.seguridad-avanzada.com</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-10 print:p-10 pt-6">
          
          <div className="flex justify-start md:justify-end print:justify-end mb-6 md:mb-8 text-xs sm:text-sm text-gray-700 w-full">
            <div className="text-left md:text-right print:text-right bg-gray-50 p-4 rounded border border-gray-100 w-full md:w-auto">
              <p><span className="font-bold text-gray-900">Folio:</span> {quote.folio}</p>
              <p><span className="font-bold text-gray-900">Fecha:</span> {new Date(quote.createdAt).toLocaleDateString('es-MX')}</p>
              <p><span className="font-bold text-gray-900">Validez:</span> {new Date(quote.expiresAt).toLocaleDateString('es-MX')} (7 días)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 sm:gap-8 mb-6 md:mb-8 text-sm">
            <div>
              <p className="font-bold text-gray-900 mb-2 border-b pb-1">Profesional</p>
              <p className="text-gray-800">{profName}</p>
              <p className="text-gray-800">{profPhone}</p>
              {quote.serviceName && <p className="mt-2"><span className="font-semibold">Servicio:</span> {quote.serviceName}</p>}
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2 border-b pb-1">Cliente</p>
              <p className="text-gray-800">{quote.customerName}</p>
              {quote.customerPhone && <p className="text-gray-800">{quote.customerPhone}</p>}
            </div>
          </div>
          
          <div className="text-sm mb-8 md:mb-10">
             <p className="text-gray-800"><span className="font-medium">Direccion:</span> Por definir con el cliente</p>
          </div>

          {/* Tabla de Productos estilo Minimalista */}
          <div className="border border-gray-200 rounded-lg overflow-x-auto mb-8">
            <table className="w-full min-w-[600px] text-sm text-left text-gray-800">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="py-4 px-4 font-bold text-gray-900 w-32">SKU</th>
                  <th scope="col" className="py-4 px-4 font-bold text-gray-900">Concepto</th>
                  <th scope="col" className="py-4 px-4 font-bold text-gray-900 text-center w-20">Cant.</th>
                  <th scope="col" className="py-4 px-4 font-bold text-gray-900 text-right w-32">P. Unitario</th>
                  <th scope="col" className="py-4 px-4 font-bold text-gray-900 text-right w-32">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((item: any, index: number) => (
                  <tr key={index} className="bg-white">
                    <td className="py-4 px-4 text-xs font-mono text-gray-500">{item.sku || '-'}</td>
                    <td className="py-4 px-4 text-gray-700">{item.concept}</td>
                    <td className="py-4 px-4 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-700">${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="py-4 px-4 text-right text-gray-900 font-medium">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex justify-end mb-12">
            <div className="w-full sm:w-72 text-sm bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between mb-3 text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">${quote.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between mb-3 text-gray-600">
                <span>IVA (16%):</span>
                <span className="font-semibold text-gray-900">${quote.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>${quote.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Banner Promocional eliminado */}

          {/* Reseñas de Google */}
          <div className="mb-12">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Reseñas de clientes en Google (4.9 / 5.0)
            </h3>
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Alvaro+Jimenez&background=2563eb&color=fff&size=120&font-size=0.4&bold=true" alt="Alvaro Jimenez" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-gray-900">Alvaro Jimenez</p>
                    <span className="text-xs text-gray-500 flex items-center">
                      <svg className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      Local Guide
                    </span>
                  </div>
                  <p className="text-yellow-500 text-xs tracking-widest mb-2">★★★★★ <span className="text-gray-400 tracking-normal ml-1">Hace un año</span></p>
                  <p className="text-xs text-gray-700 italic">&quot;Hace una semana necesite de sus servicios de circuito cerrado para mi hogar. Cabe resaltar qué desde la planeación estratégica de la ubicación del equipo, y lo presupuestado. fue una grata experiencia de adquisición. la instalación de primera . el equipo en general digno de recomendar.&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Datos Bancarios y Footer */}
          <div className="border-t border-gray-200 pt-6 mt-12">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Datos para Transferencia Bancaria</h4>
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-md text-sm text-gray-800 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-y-2 mb-6">
              <p><span className="font-bold text-gray-900">Beneficiario:</span> NUO INTEGRACIONES Y SERVICIOS</p>
              <p><span className="font-bold text-gray-900">Banco:</span> BBVA</p>
              <p><span className="font-bold text-gray-900">Cuenta:</span> 0120314730</p>
              <p><span className="font-bold text-gray-900">CLABE:</span> 012180001203147305</p>
            </div>
            
            <p className="text-[11px] text-gray-600 text-center">
              Seguridad Avanzada | seguridad-avanzada.com | Atenas 1-1, Col. San Alvaro, Alcaldía Azcapotzalco, Ciudad de México, C.P. 02090
            </p>
          </div>
        </div>
      </div>
      
      {/* Script y Botón para imprimir/PDF que no sale en la impresión */}
      <div className="max-w-4xl mx-auto mt-6 text-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
