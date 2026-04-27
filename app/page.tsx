"use client";
import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Printer, AlertTriangle, Info } from 'lucide-react';

export default function Dashboard() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cursos")
      .then(res => res.json())
      .then(data => { setCursos(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cursosFiltrados = cursos.filter((c: any) => {
    const fechaCorte = new Date('2026-04-21');
    const fechaInicio = new Date(c.fecha_inicio);
    const seccionEspecial = "6IBVW03007";
    
    const coincideBusqueda = (c.seccion || "").toLowerCase().includes(filtroTexto.toLowerCase()) ||
                             (c.docente_asignado || "").toLowerCase().includes(filtroTexto.toLowerCase());

    const esVigente = fechaInicio >= fechaCorte || c.seccion === seccionEspecial;
    
    // OJO: Filtramos para no mostrar los cancelados en el monitoreo diario
    return coincideBusqueda && esVigente && c.estado_curso !== 'CANCELADO';
  });

  if (loading) return <div className="p-20 text-center font-black text-blue-900">ACTUALIZANDO DATOS DEL CIC...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white p-6 rounded-2xl shadow-md border-b-4 border-blue-900 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-blue-900 uppercase">Monitoreo de Sesiones</h1>
            <p className="text-slate-500 font-bold">Filtro activo: Desde 21 de Abril | Secciones Reales</p>
          </div>
          <button onClick={() => window.print()} className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <Printer size={20} /> IMPRIMIR HOJA DE RUTA
          </button>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por Docente, Sección o Código..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-4 focus:ring-blue-500/20 text-lg"
            onChange={(e) => setFiltroTexto(e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl transition-all">
              <div className="bg-blue-900 p-4 flex justify-between items-center">
                <span className="text-white font-mono font-bold">{curso.seccion}</span>
                <span className="text-blue-200 text-xs font-bold">{curso.codigo_docente}</span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-black text-slate-800 mb-4 uppercase">{curso.docente_asignado}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-600 font-medium">
                    <Calendar size={18} className="text-blue-600" /> {curso.horario}
                  </div>
                </div>

                {/* ALERTA DE OBSERVACIONES (REEMPLAZOS/RECUPERACIONES) */}
                {curso.observaciones && (
                  <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-2xl mb-4 flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                    <p className="text-sm font-bold text-amber-800">{curso.observaciones}</p>
                  </div>
                )}

                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                  <Info className="text-blue-900" size={20} />
                  <p className="text-xs font-black text-blue-900 uppercase">Verificar grabación de hoy</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}