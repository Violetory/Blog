import mysql from 'mysql2'

export const db = mysql.createConnection({
  host: 'localhost',
  // port:'8800',
  user: 'root',
  password: 'Sun130739050',
  database: 'blog'
})
