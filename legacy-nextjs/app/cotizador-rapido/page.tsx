'use client';

import { useState, useMemo } from 'react';
import { Download, PlusCircle, Trash2, Send, CheckCircle2, Phone, User, Briefcase, Hash, Building, Calculator } from 'lucide-react';

interface QuoteItem {
  sku: string;
  concept: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  loading?: boolean;
  error?: string;
}

export default function CotizadorRapidoClient() {
  const [professionalName, setProfessionalName] = useState('');
  const [professionalPhone, setProfessionalPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([
    { sku: '', concept: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedFolio, setGeneratedFolio] = useState('');

  const fetchProductBySku = async (sku: string, index: number) => {
    if (!sku.trim()) return;
    
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

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.amount, 0), [items]);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  const loadImageInfo = (src: string): Promise<{ dataUrl: string, width: number, height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/png");
          resolve({ dataUrl, width: img.width, height: img.height });
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = src;
    });
  };

  const generatePDF = async (folio: string) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    const primaryColor = [220, 38, 38]; // Red 600
    const darkColor = [17, 24, 39]; // Gray 900
    const lightColor = [243, 244, 246]; // Gray 100
    const textColor = [55, 65, 81]; // Gray 700

    let y = 40;
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header
    try {
      const logoInfo = await loadImageInfo("/logo.png");
      const logoWidth = 140;
      const logoHeight = (logoInfo.height * logoWidth) / logoInfo.width;
      doc.addImage(logoInfo.dataUrl, "PNG", margin, y, logoWidth, logoHeight);
    } catch (e) {
      doc.setFontSize(20);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("Seguridad Avanzada", margin, y + 20);
    }

    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Cotizacion - NUO INTEGRACIONES Y SERVICIOS | RFC: NIS230310Q9A", pageWidth - margin, y + 15, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont("helvetica", "normal");
    doc.text(`Folio: ${folio}`, pageWidth - margin, y + 35, { align: "right" });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, pageWidth - margin, y + 50, { align: "right" });

    y += 70;

    // Line separator
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(1);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    // 2. Info Columns
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("Atención a:", margin, y);
    doc.text("Asesor:", pageWidth / 2, y);

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(customerName || "-", margin, y);
    if (customerPhone) doc.text(`Tel: ${customerPhone}`, margin, y + 12);
    
    doc.text(professionalName || "-", pageWidth / 2, y);
    if (professionalPhone) doc.text(`Tel: ${professionalPhone}`, pageWidth / 2, y + 12);

    y += 35;
    if (serviceName) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text(`Servicio: ${serviceName}`, margin, y);
      y += 25;
    }

    // 3. Table Header
    doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 25, "F");
    
    y += 17;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    const colCant = margin + 10;
    const colSku = margin + 50;
    const colConcept = margin + 120;
    const colUnit = pageWidth - margin - 120;
    const colTotal = pageWidth - margin - 10;

    doc.text("Cant.", colCant, y);
    doc.text("SKU", colSku, y);
    doc.text("Concepto", colConcept, y);
    doc.text("P. Unitario", colUnit, y, { align: "right" });
    doc.text("Importe", colTotal, y, { align: "right" });

    y += 15;
    
    // 4. Table Body
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    items.forEach((item) => {
      if (y > 750) {
        doc.addPage();
        y = margin + 20;
      }
      
      doc.text(item.quantity.toString(), colCant, y);
      doc.text(item.sku || "-", colSku, y);
      const splitConcept = doc.splitTextToSize(item.concept || "-", 200);
      doc.text(splitConcept, colConcept, y);
      const priceText = `$${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      doc.text(priceText, colUnit, y, { align: "right" });
      const amountText = `$${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      doc.text(amountText, colTotal, y, { align: "right" });
      
      y += (splitConcept.length * 12) + 8;
      
      doc.setDrawColor(243, 244, 246);
      doc.line(margin, y - 4, pageWidth - margin, y - 4);
    });

    y += 15;

    // 5. Totals
    const subtotalText = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const taxText = `$${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const totalText = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    
    doc.text("Subtotal:", colUnit, y, { align: "right" });
    doc.text(subtotalText, colTotal, y, { align: "right" });
    y += 15;
    doc.text("IVA (16%):", colUnit, y, { align: "right" });
    doc.text(taxText, colTotal, y, { align: "right" });
    y += 20;
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Total:", colUnit, y, { align: "right" });
    doc.text(totalText, colTotal, y, { align: "right" });

    y += 40;

    if (y > 680) {
      doc.addPage();
      y = margin + 20;
    }

    // 6. Bank Data & Footer
    doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 75, "F");
    
    y += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("Datos para Transferencia Bancaria", margin + 15, y);
    
    y += 18;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text("Beneficiario: NUO INTEGRACIONES Y SERVICIOS", margin + 15, y);
    doc.text("Banco: BBVA", margin + 240, y);
    
    y += 15;
    doc.text("Cuenta: 0120314730", margin + 15, y);
    doc.text("CLABE: 012180001203147305", margin + 240, y);

    // Footer contact
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("NUO INTEGRACIONES Y SERVICIOS | RFC: NIS230310Q9A", pageWidth / 2, 790, { align: "center" });
    doc.text("Atenas 1-1, Col. San Alvaro, Alcaldía Azcapotzalco, Ciudad de México, C.P. 02090", pageWidth / 2, 802, { align: "center" });
    doc.text("Contacto: proyectos@seguridad-avanzada.com | WhatsApp MX: +525636741156 | www.seguridad-avanzada.com", pageWidth / 2, 814, { align: "center" });

    doc.save(`Cotizacion-${folio}.pdf`);
  };

  const openWhatsApp = (folio: string) => {
    const phone = customerPhone.replace(/\D/g, '');
    let targetPhone = phone;
    if (targetPhone && !targetPhone.startsWith('52') && targetPhone.length === 10) {
      targetPhone = '52' + targetPhone;
    }
    
    const message = `¡Hola ${customerName}! 👋\nTe comparto tu cotización folio *${folio}* por el servicio de *${serviceName || "Seguridad Avanzada"}*.\n\nTotal: *$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*\n\nSi tienes alguna duda, estoy a tus órdenes.\nAtte. ${professionalName}`;
    const url = targetPhone 
      ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      
    window.open(url, '_blank');
  };

  const handleGenerate = async (e: React.FormEvent, type: 'download' | 'whatsapp') => {
    e.preventDefault();
    if (!customerName || items.length === 0 || subtotal === 0 || !professionalName) {
      alert("Por favor llena el nombre del asesor, del cliente y al menos un producto válido.");
      return;
    }

    setIsSubmitting(true);
    let currentFolio = generatedFolio;

    try {
      if (!currentFolio) {
        // Guardamos en DB solo la primera vez para obtener folio oficial
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
        if (data.success && data.folio) {
          currentFolio = data.folio;
          setGeneratedFolio(currentFolio);
        } else {
          currentFolio = `LOCAL-${Date.now().toString().slice(-6)}`;
        }
      }

      if (type === 'download') {
        await generatePDF(currentFolio);
      } else {
        await generatePDF(currentFolio);
        openWhatsApp(currentFolio);
      }
    } catch (error) {
      alert("Error al generar cotización. Se generará localmente sin guardado oficial.");
      if (!currentFolio) currentFolio = `LOCAL-${Date.now().toString().slice(-6)}`;
      if (type === 'download') {
        await generatePDF(currentFolio);
      } else {
        await generatePDF(currentFolio);
        openWhatsApp(currentFolio);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Encabezado Principal */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-t-2xl shadow-xl overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start justify-between text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Cotizador Rápido Pro</h1>
            <p className="text-red-100 max-w-xl text-sm sm:text-base">
              Genera cotizaciones profesionales al instante, guárdalas en la base de datos y envíalas por WhatsApp a tus clientes con un diseño premium.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center text-center">
            <img src="/logo-white.png" alt="Seguridad Avanzada" className="h-10 sm:h-12 w-auto object-contain mb-2" />
            <p className="text-[10px] sm:text-xs text-red-100 font-bold tracking-wide">Cotizacion - NUO INTEGRACIONES Y SERVICIOS | RFC: NIS230310Q9A</p>
            <p className="text-[8px] sm:text-[9px] text-red-100/80 mt-1">Contacto: proyectos@seguridad-avanzada.com | WhatsApp MX: +525636741156</p>
          </div>
        </div>

        {/* Cuerpo del Formulario */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 sm:p-10 border border-gray-100">
          <form className="space-y-10">
            
            {/* Sección de Datos Personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Asesor */}
              <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-red-100 group">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                  <div className="bg-red-100 p-2 rounded-lg text-red-600 group-hover:scale-110 transition-transform"><User size={20} /></div>
                  <h3 className="font-bold text-gray-900 text-lg">Datos del Asesor</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Nombre Completo *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none py-2.5 px-4 transition-all"
                      value={professionalName}
                      onChange={e => setProfessionalName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Teléfono Móvil</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none py-2.5 px-4 transition-all"
                      value={professionalPhone}
                      onChange={e => setProfessionalPhone(e.target.value)}
                      placeholder="+52 55 1234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-blue-100 group">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:scale-110 transition-transform"><Building size={20} /></div>
                  <h3 className="font-bold text-gray-900 text-lg">Datos del Cliente</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Empresa / Nombre *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none py-2.5 px-4 transition-all"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Empresa S.A. de C.V."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">WhatsApp / Teléfono</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none py-2.5 px-4 transition-all"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="Para envío por WhatsApp"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Servicio a Cotizar */}
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Briefcase size={20} /></div>
                <h3 className="font-bold text-gray-900 text-lg">Detalles del Servicio</h3>
              </div>
              <input 
                type="text" 
                className="w-full bg-white border border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none py-3 px-4 text-gray-800 transition-all font-medium"
                value={serviceName}
                onChange={e => setServiceName(e.target.value)}
                placeholder="Ej. Suministro e Instalación de Sistema CCTV de 8 Cámaras..."
              />
            </div>

            {/* Partidas */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Hash size={20} /></div>
                  <h3 className="font-bold text-gray-900 text-xl">Partidas de Cotización</h3>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-semibold border border-emerald-100 hidden sm:inline-block">
                  El IVA (16%) se calcula automáticamente
                </span>
              </div>
              
              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-4">
                <table className="w-full min-w-[800px] text-sm text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-4 w-40">SKU</th>
                      <th className="px-4 py-4">Concepto</th>
                      <th className="px-4 py-4 text-center w-24">Cant.</th>
                      <th className="px-4 py-4 text-right w-36">P. Unitario</th>
                      <th className="px-4 py-4 text-right w-36">Importe</th>
                      <th className="px-4 py-4 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="p-3 relative">
                          <input 
                            type="text" 
                            className="w-full border-gray-200 border rounded bg-white px-3 py-2 text-xs uppercase focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                            value={item.sku}
                            placeholder="SKU-123"
                            onChange={e => handleItemChange(index, 'sku', e.target.value.toUpperCase())}
                            onBlur={() => fetchProductBySku(item.sku, index)}
                          />
                          {item.loading && <span className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>}
                        </td>
                        <td className="p-3">
                          <input 
                            type="text" 
                            className="w-full border-gray-200 border rounded bg-white px-3 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                            value={item.concept}
                            placeholder="Descripción del producto o servicio"
                            onChange={e => handleItemChange(index, 'concept', e.target.value)}
                          />
                        </td>
                        <td className="p-3">
                          <input 
                            type="number" 
                            min="1"
                            className="w-full border-gray-200 border rounded bg-white px-3 py-2 text-center focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                            value={item.quantity}
                            onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              className="w-full border-gray-200 border rounded bg-white pl-7 pr-3 py-2 text-right focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                              value={item.unitPrice}
                              onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </td>
                        <td className="p-3 text-right font-bold text-gray-900">
                          ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            type="button" 
                            onClick={() => removeRow(index)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Eliminar partida"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button 
                type="button" 
                onClick={addRow}
                className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors border border-emerald-200"
              >
                <PlusCircle size={18} />
                Añadir otra partida
              </button>
            </div>

            {/* Totales y Acciones */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-12 pt-8 border-t border-gray-200 items-start">
              
              <div className="flex-1 w-full order-2 lg:order-1">
                {generatedFolio && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-green-100 p-2 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
                    <div>
                      <p className="text-green-800 font-bold">¡Cotización Oficial Creada!</p>
                      <p className="text-green-700 text-sm">Folio: <span className="font-mono bg-green-100 px-2 py-0.5 rounded">{generatedFolio}</span></p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={(e) => handleGenerate(e, 'download')}
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : <Download size={20} />}
                      {isSubmitting ? 'Procesando...' : 'Descargar PDF Oficial'}
                    </span>
                  </button>
                  
                  <button 
                    type="button"
                    onClick={(e) => handleGenerate(e, 'whatsapp')}
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-all shadow-lg hover:shadow-xl shadow-green-600/30 hover:shadow-green-700/40 hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center gap-3">
                      {isSubmitting ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> : <Send size={20} />}
                      {isSubmitting ? 'Procesando...' : 'Enviar por WhatsApp'}
                    </span>
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Al generar, se guardará en la base de datos y se asignará un folio automáticamente.
                </p>
              </div>

              {/* Totales Resumen */}
              <div className="w-full lg:w-96 order-1 lg:order-2">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Calculator size={18} className="text-gray-500" /> Resumen Financiero
                    </h4>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold text-gray-900">${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="font-medium">IVA (16%)</span>
                      <span className="font-semibold text-gray-900">${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total a Pagar</span>
                        <span className="block text-xs text-gray-400">MXN</span>
                      </div>
                      <span className="text-3xl font-extrabold text-red-600">${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div className="bg-red-50/50 px-6 py-4 border-t border-red-50/80">
                    <p className="text-xs text-red-800 font-medium leading-relaxed">
                      La cotización incluirá datos para transferencia bancaria a nombre de NUO INTEGRACIONES Y SERVICIOS.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
