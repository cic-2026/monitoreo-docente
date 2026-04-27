import { NextResponse } from 'next/server';
import ejecutarQuery from '@/lib/db';

export async function GET() {
  try {
    // La consulta SQL con el filtro de tu amiga (Sección y Fecha)
    const result = await ejecutarQuery(`
      SELECT * FROM monitoreo_docente 
      WHERE seccion = '6IBVW03007' 
      OR fecha_inicio >= '2026-04-21'
      ORDER BY fecha_inicio DESC
    `);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Error al conectar con Workbench' }, { status: 500 });
  }
}