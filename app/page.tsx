"use client";
import { useState, useEffect } from 'react';
import { Search, Users, Calendar, Clock, BookOpen, Printer } from 'lucide-react';

export default function Dashboard() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [loading, setLoading] = useState(true);

  const URL_API = "https://script.google.com/a/macros/continental.edu.pe/s/AKfycbzyQ56hn_3SefRjVHXQo15ehfNGvL-6UV7XfmaZuWSMqkBU8vMu8cd1qYHAr7oHSDrD/exec";

  useEffect(() => {
    fetch(URL_API)
      .then(res => res.json())
      .then(data => {
        setCursos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const cursosFiltrados = cursos.filter((curso: any) => {
    const coincideTexto = 
      (curso.SECCIÓN?.toLowerCase() || "").includes(filtroTexto.toLowerCase()) ||
      (curso['DOCENTE ASIGNADO']?.toLowerCase() || "").includes(filtroTexto.toLowerCase());
    
    const coincideMes = filtroMes === "" || 
      (curso['MES DE INICIO']?.toLowerCase() || "") === filtroMes.toLowerCase() ||
      (curso['MES DE TÉRMINO']?.toLowerCase() || "") === filtroMes.toLowerCase();

    return coincideTexto && coincideMes;
  });

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Cargando datos del CIC...</div>;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO OFICIAL CIC */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 text-white p-3 rounded-lg font-black text-xl">CIC</div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase leading-none">Centro de Idiomas</h1>
              <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">Reporte de Programación</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Actualizado</p>
            <p className="text-sm font-mono">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* PANEL DE CONTROL */}
        <div className="print:hidden mb-8 flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-xl border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar docente o sección..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          <select 
            onChange={(e) => setFiltroMes(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Todos los meses</option>
            <option value="abril">Abril</option>
            <option value="mayo">Mayo</option>
          </select>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-bold"
          >
            <Printer size={18} /> IMPRIMIR
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso: any, index: number) => (
            <div key={index} className="border-2 border-slate-100 rounded-xl p-5 bg-white shadow-sm hover:border-blue-200 transition-all">
              <div className="flex justify-between mb-2">
                <span className="font-mono font-bold text-blue-700">{curso.SECCIÓN}</span>
                <span className="text-[10px] font-bold border px-2 py-0.5 rounded uppercase bg-slate-50">
                  {curso.ESTADO || 'PROG'}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 uppercase mb-4 h-12 overflow-hidden">
                {curso['DOCENTE ASIGNADO'] || 'SIN DOCENTE'}
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex items-center gap-2"><BookOpen size={14}/> {curso.MODALIDAD}</div>
                <div className="flex items-center gap-2"><Calendar size={14}/> {curso.FRECUENCIA}</div>
                <div className="flex items-center gap-2"><Clock size={14}/> {curso.HORARIO}</div>
                {curso.OBSERVACIONES && (
                  <div className="mt-3 p-2 bg-yellow-50 text-[10px] border rounded italic uppercase">
                    {curso.OBSERVACIONES}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @media print { .print\:hidden { display: none !important; } }
      `}</style>
    </div>
  );
}