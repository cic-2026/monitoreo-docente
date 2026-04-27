import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
});

export default async function ejecutarQuery(query: string, values: any[] = []) {
  try {
    const resultados = await db.query(query, values);
    await db.end();
    return resultados;
  } catch (error) {
    return { error };
  }
}