'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
    >
      📄 Descargar Cotización en PDF
    </button>
  );
}
