'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuoteItem {
  sku: string;
  concept: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  loading?: boolean;
  error?: string;
}

export default function CotizadorManual() {
  const router = useRouter();
  const [professionalName, setProfessionalName] = useState('');
  const [professionalPhone, setProfessionalPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([
    { sku: '', concept: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProductBySku = async (sku: string, index: number) => {
    if (!sku.trim()) return;
    
    // Set loading state
    const newItems = [...items];
    newItems[index].loading = true;
    newItems[index].error = undefined;
    setItems(newItems);

    try {
      const res = await fetch(`/api/products/search?sku=${encodeURIComponent(sku)}`);
      const data = await res.json();

      const updatedItems = [...items];
      updatedItems[index].loading = false;

      if (res.ok) {
        // El precio de la BD (Shopify) ya incluye IVA, lo desglosamos para la cotización
        const priceWithoutIva = data.price_mxn / 1.16;
        
        updatedItems[index].concept = data.name;
        updatedItems[index].unitPrice = priceWithoutIva;
        updatedItems[index].amount = priceWithoutIva * updatedItems[index].quantity;
        updatedItems[index].error = undefined;
      } else {
        updatedItems[index].error = "No encontrado";
      }
      setItems(updatedItems);
    } catch (err) {
      const updatedItems = [...items];
      updatedItems[index].loading = false;
      updatedItems[index].error = "Error red";
      setItems(updatedItems);
    }
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate amount if quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const addRow = () => {
    setItems([...items, { sku: '', concept: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || items.length === 0 || subtotal === 0 || !professionalName) {
      alert("Por favor llena el nombre del asesor, del cliente y al menos un producto válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        serviceName,
        items: {
          products: items.map(item => ({
            sku: item.sku,
            concept: item.concept,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount
          })),
          professionalName,
          professionalPhone
        },
        subtotal,
        tax,
        total
      };

      const res = await fetch('/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.url) {
        // Redirigir a la vista de la cotización generada
        router.push(new URL(data.url).pathname);
      } else {
        alert("Error: " + (data.error || "Fallo al generar cotización"));
        setIsSubmitting(false);
      }
    } catch (error) {
      alert("Error de red al generar cotización");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        
        {/* Encabezado WYSIWYG estilo Seguridad Avanzada */}
        <div className="bg-[#111827] text-white p-6 flex items-center gap-6 border-b-4 border-red-600">
          <img src="/logo-white.png" alt="Seguridad Avanzada" className="h-16 w-auto object-contain drop-shadow-lg" />
          <div className="flex-1">
            <p className="text-sm text-gray-300 mb-1">Cotización con respaldo de NUO Integraciones y Servicios</p>
            <p className="text-xs text-gray-400"><span className="font-semibold text-gray-300">NUO INTEGRACIONES Y SERVICIOS | RFC: NIS230310Q9A</span></p>
            <p className="text-xs text-gray-400">Atenas 1-1, Col. San Alvaro, Alcaldía Azcapotzalco, Ciudad de México, C.P. 02090</p>
            <p className="text-xs text-gray-400">Contacto: proyectos@seguridad-avanzada.com | WhatsApp MX: +525636741156 | www.seguridad-avanzada.com</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10">
          
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crear Cotización de Servicio</h2>
            <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded">Folio y Fecha se autogeneran</div>
          </div>

          {/* Datos del Cliente y Profesional */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <p className="font-bold text-gray-900 mb-2 border-b pb-1">Profesional (Asesor) *</p>
              <input 
                required
                type="text" 
                className="w-full border-b border-gray-300 focus:border-red-500 focus:outline-none py-1 mb-2 bg-transparent transition-colors hover:bg-gray-50"
                value={professionalName}
                onChange={e => setProfessionalName(e.target.value)}
                placeholder="Nombre del Asesor"
              />
              <input 
                type="text" 
                className="w-full border-b border-gray-300 focus:border-red-500 focus:outline-none py-1 bg-transparent transition-colors hover:bg-gray-50"
                value={professionalPhone}
                onChange={e => setProfessionalPhone(e.target.value)}
                placeholder="Teléfono del Asesor (Opcional)"
              />
            </div>
            <div>
              <p className="font-bold text-gray-900 mb-2 border-b pb-1">Datos del Cliente *</p>
              <input 
                required
                type="text" 
                className="w-full border-b border-gray-300 focus:border-red-500 focus:outline-none py-1 mb-2 bg-transparent transition-colors hover:bg-gray-50"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre del Cliente o Empresa"
              />
              <input 
                type="text" 
                className="w-full border-b border-gray-300 focus:border-red-500 focus:outline-none py-1 bg-transparent transition-colors hover:bg-gray-50"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="Teléfono del Cliente (Opcional)"
              />
            </div>
          </div>
          
          <div className="text-sm mb-10">
             <p className="font-bold text-gray-900 mb-2 border-b pb-1 inline-block">Servicio a Cotizar</p>
             <input 
                type="text" 
                className="w-full border-b border-gray-300 focus:border-red-500 focus:outline-none py-1 bg-transparent transition-colors hover:bg-gray-50 text-gray-800"
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                placeholder="Ej. Suministro de Equipo e Instalación de CCTV"
              />
          </div>

          {/* Tabla de Productos estilo Minimalista WYSIWYG */}
          <div className="mb-2">
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1 inline-block">Partidas</h3>
          </div>
          <table className="w-full text-sm text-left text-gray-800 mb-4">
            <thead className="border-b-2 border-gray-900">
              <tr>
                <th scope="col" className="py-2 font-bold w-32">SKU (Auto)</th>
                <th scope="col" className="py-2 font-bold">Concepto</th>
                <th scope="col" className="py-2 font-bold text-center w-20">Cant.</th>
                <th scope="col" className="py-2 font-bold text-right w-32">P. Unitario</th>
                <th scope="col" className="py-2 font-bold text-right w-32">Importe</th>
                <th scope="col" className="py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 group">
                  <td className="py-2 relative pr-2">
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded p-2 text-xs uppercase focus:border-red-500 focus:outline-none"
                      value={item.sku}
                      placeholder="SKU"
                      onChange={e => handleItemChange(index, 'sku', e.target.value.toUpperCase())}
                      onBlur={() => fetchProductBySku(item.sku, index)}
                    />
                    {item.loading && <span className="absolute right-4 top-4 w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>}
                  </td>
                  <td className="py-2 pr-2">
                    <input 
                      type="text" 
                      className="w-full border border-gray-200 rounded p-2 text-sm focus:border-red-500 focus:outline-none"
                      value={item.concept}
                      placeholder="Descripción del concepto"
                      onChange={e => handleItemChange(index, 'concept', e.target.value)}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full border border-gray-200 rounded p-2 text-sm text-center focus:border-red-500 focus:outline-none"
                      value={item.quantity}
                      onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full border border-gray-200 rounded p-2 text-sm text-right focus:border-red-500 focus:outline-none"
                      value={item.unitPrice}
                      onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="py-2 text-right font-bold text-gray-900 pr-2">
                    ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 text-center">
                    <button 
                      type="button" 
                      onClick={() => removeRow(index)}
                      className="text-gray-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button 
            type="button" 
            onClick={addRow}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider"
          >
            + Añadir otra partida
          </button>

          {/* Totales */}
          <div className="flex justify-end mt-8 mb-12">
            <div className="w-64 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 font-medium">Subtotal:</span>
                <span className="font-bold">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 font-medium">IVA (16%):</span>
                <span className="font-bold">${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 text-base font-extrabold text-gray-900">
                <span>Total:</span>
                <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Datos Bancarios WYSIWYG */}
          <div className="border-t border-gray-200 pt-6 mb-12">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Datos para Transferencia Bancaria (Aparecerán en el PDF)</h4>
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-md text-sm text-gray-800 grid grid-cols-2 gap-y-2">
              <p><span className="font-bold text-gray-900">Beneficiario:</span> NUO INTEGRACIONES Y SERVICIOS</p>
              <p><span className="font-bold text-gray-900">Banco:</span> BBVA</p>
              <p><span className="font-bold text-gray-900">Cuenta:</span> 0120314730</p>
              <p><span className="font-bold text-gray-900">CLABE:</span> 012180001203147305</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex justify-center">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`bg-[#111827] hover:bg-black text-white font-bold py-4 px-12 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Generando y guardando...' : '📄 Generar y Ver PDF Oficial'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
