import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || process.env.DB_USER || 'u286675027_orvano_db',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || 'Gyhui9090..',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'u286675027_orvano_db',
  port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error: any) {
    if (error?.code !== 'ECONNREFUSED') {
      console.warn('MySQL Info:', error.message);
    }
    return [];
  }
}

export default pool;
