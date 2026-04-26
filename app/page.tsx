"use client";
import { useState, useEffect } from 'react';
import { Search, Users, Calendar, Clock, BookOpen, Printer, Filter } from 'lucide-react';

export default function Dashboard() {
  const [cursos, setCursos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [loading, setLoading] = useState(true);

  const URL_API = "https://script.google.com/a/macros/continental.edu.pe/s/AKfycbzyQ56hn_3SefRjVHXQo15ehfNGvL-6UV7XfmaZuWSMqkBU8vMu8cd1qYHAr7oHSDrD/exec";

  useEffect(() => {
    fetch(URL_API)
      .then(res => res.json())
      .then(data => {
        setCursos(data);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  // Lógica para filtrar por texto y por mes (incluye inicio y fin)
  const cursosFiltrados = cursos.filter((curso: any) => {
    const coincideTexto = 
      curso.SECCIÓN?.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      curso['DOCENTE ASIGNADO']?.toLowerCase().includes(filtroTexto.toLowerCase());
    
    // Si un curso tiene "mayo" en inicio o término, aparece si el filtro es mayo
    const coincideMes = filtroMes === "" || 
      curso['MES DE INICIO']?.toLowerCase() === filtroMes.toLowerCase() ||
      curso['MES DE TÉRMINO']?.toLowerCase() === filtroMes.toLowerCase();

    return coincideTexto && coincideMes;
  });

  if (loading) return <div className="p-20 text-center font-bold">Cargando datos del CIC...</div>;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO OFICIAL CIC (Visible en impresión) */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Espacio para el Logo */}
            <div className="bg-slate-900 text-white p-3 rounded-lg font-black text-xl">
              CIC
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase">Centro de Idiomas Continental</h1>
              <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">Reporte Académico de Programación</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase">Fecha de Reporte</p>
            <p className="text-sm font-mono">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* PANEL DE CONTROL (Se oculta al imprimir) */}
        <div className="print:hidden mb-8 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por docente o sección..."
                className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>
            <select 
              onChange={(e) => setFiltroMes(e.target.value)}
              className="px-4 py-2 border rounded-xl outline-none bg-white font-medium"
            >
              <option value="">Todos los meses</option>
              <option value="abril">Abril</option>
              <option value="mayo">Mayo</option>
              <option value="junio">Junio</option>
            </select>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg"
            >
              <Printer size={18} /> IMPRIMIR REPORTE
            </button>
          </div>
        </div>

        {/* TABLA DE REPORTES (Formato limpio para impresión) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso: any, index: number) => (
            <div key={index} className="border-2 border-slate-100 rounded-xl p-5 bg-white page-break-inside-avoid">
              <div className="flex justify-between mb-2">
                <span className="font-mono font-bold text-blue-700">{curso.SECCIÓN}</span>
                <span className="text-[10px] font-bold border border-slate-300 px-2 py-0.5 rounded uppercase">
                  {curso.ESTADO}
                </span>
              </div>
              <h3 className="font-black text-slate-800 uppercase mb-4 leading-tight">
                {curso['DOCENTE ASIGNADO'] || 'SIN DOCENTE'}
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <p><strong>MODALIDAD:</strong> {curso.MODALIDAD}</p>
                <p><strong>FRECUENCIA:</strong> {curso.FRECUENCIA}</p>
                <p><strong>HORARIO:</strong> {curso.HORARIO}</p>
                {/* Si hay observaciones en el Excel, se muestran aquí */}
                {curso.OBSERVACIONES && (
                  <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded italic">
                    {curso.OBSERVACIONES}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ESTILOS CSS EXTRA PARA IMPRESIÓN */}
      <style jsx global>{`
        @media print {
          .print\:hidden { display: none !important; }
          body { background-color: white !important; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}