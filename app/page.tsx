"use client";
import { useState, useEffect } from 'react';
import { Search, Users, Calendar, Clock, Printer, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");
  const [loading, setLoading] = useState(true);

  const URL_API = 
  "https://script.google.com/a/macros/continental.edu.pe/s/AKfycbwX5XwgBQL6Je90iynSVyXFKz9zl7Vw2AAi5O70dOBrngz8Zr_RiM2z_1-WdEi0XP58/exec";

  useEffect(() => {
    fetch(URL_API)
      .then(res => res.json())
      .then(data => { setCursos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cursosFiltrados = cursos.filter((c: any) => {
    const coincideTexto = (c.SECCIÓN || "").toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          (c['DOCENTE ASIGNADO'] || "").toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideTurno = filtroTurno === "" || (c.HORARIO || "").toLowerCase().includes(filtroTurno.toLowerCase());
    return coincideTexto && coincideTurno;
  });

  if (loading) return <div className="p-20 text-center font-bold text-blue-900">Conectando con el Excel del CIC...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ENCABEZADO CON TU LOGO */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b-4 border-blue-900 pb-4 mb-6 bg-white p-4 rounded-t-xl shadow-sm">
          <div className="flex items-center gap-4">
            <img src="https://tse2.mm.bing.net/th/id/OIP._HL2PzgNf4-9EEuRaFajYwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" 
                 alt="Logo CIC" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-2xl font-black text-blue-900 uppercase leading-tight">Centro de Idiomas</h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-tighter">Reporte de Programación Continental</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-blue-900 uppercase">Actualizado Hoy</p>
             <p className="text-lg font-mono font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* PANEL DE CONTROL */}
        <div className="print:hidden mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar docente..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-blue-100 outline-none focus:border-blue-500" onChange={(e) => setFiltroTexto(e.target.value)} />
          </div>
          <select onChange={(e) => setFiltroTurno(e.target.value)} className="px-4 py-2.5 rounded-xl border-2 border-blue-100 bg-white font-bold text-blue-900">
            <option value="">Todos los Turnos</option>
            <option value="mañana">Turno Mañana</option>
            <option value="tarde">Turno Tarde</option>
            <option value="noche">Turno Noche</option>
          </select>
          <button onClick={() => window.print()} className="bg-blue-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-800 flex items-center justify-center gap-2">
            <Printer size={18} /> IMPRIMIR
          </button>
        </div>

        {/* GRID DE CURSOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso, i) => (
            <div key={i} className="bg-white rounded-2xl border-b-4 border-blue-900 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-blue-700 text-sm">{curso.SECCIÓN}</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">En Curso</span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-4 uppercase">{curso['DOCENTE ASIGNADO']}</h3>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2"><Calendar size={14}/> {curso.FRECUENCIA}</div>
                <div className="flex items-center gap-2"><Clock size={14}/> {curso.HORARIO}</div>
              </div>
              {/* INDICADOR DE REVISIÓN */}
              <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                <AlertCircle className="text-orange-500" size={20} />
                <div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase">Turnos a Revisar:</p>
                  <p className="text-xs font-bold text-slate-700">Verificar grabación de hoy</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}