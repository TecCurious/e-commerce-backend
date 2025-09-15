import { Pool } from 'pg'


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'teccurious06',
  port: 5432,
//   max: 20,          
//   idleTimeoutMillis: 30000, // close idle clients after 30s
//   connectionTimeoutMillis: 2000, // return error if no connection in 2s
});


export default pool