import { Pool } from 'pg'
import dotenv from "dotenv"

dotenv.config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
//   max: 20,          
//   idleTimeoutMillis: 30000, // close idle clients after 30s
//   connectionTimeoutMillis: 2000, // return error if no connection in 2s
});




export default pool 

