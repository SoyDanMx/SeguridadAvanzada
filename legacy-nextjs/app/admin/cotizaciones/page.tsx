"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Quote = {
  id: string;
  folio: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  createdAt: string;
  items: any;
};

export default function CotizacionesDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cotizaciones?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setQuotes(data);
      }
    } catch (error) {
      console.error("Error fetching quotes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuotes(searchTerm);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/cotizaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ACCEPTED": return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "EXPIRED": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING": return "Pendiente";
      case "ACCEPTED": return "Aprobada";
      case "REJECTED": return "Rechazada";
      case "EXPIRED": return "Expirada";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cotizaciones Generadas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Panel de control para seguimiento de ventas (CRM)
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex max-w-md w-full gap-2">
            <input
              type="text"
              placeholder="Buscar folio, cliente o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Cargando cotizaciones...</div>
          ) : quotes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No se encontraron cotizaciones.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio / Fecha</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asesor</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estatus</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => {
                    const profName = quote.items?.professionalName || "Asesor";
                    const date = new Date(quote.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                    });
                    
                    return (
                      <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{quote.folio}</div>
                          <div className="text-xs text-gray-500">{date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quote.customerName}</div>
                          <div className="text-xs text-gray-500">{quote.customerPhone || "Sin teléfono"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {profName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          ${quote.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <select
                            value={quote.status}
                            onChange={(e) => updateStatus(quote.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 outline-none cursor-pointer ${getStatusColor(quote.status)}`}
                          >
                            <option value="PENDING">Pendiente</option>
                            <option value="ACCEPTED">Aprobada</option>
                            <option value="REJECTED">Rechazada</option>
                            <option value="EXPIRED">Expirada</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <Link href={`/cotizador-rapido/${quote.id}`} target="_blank" className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors font-bold">
                            Ver PDF &rarr;
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
