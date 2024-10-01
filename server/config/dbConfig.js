import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Load the SSL certificate
// const sslCa = fs.readFileSync(process.env.QUOTE_DB_SSL_CA);

// Create a connection to the internal quote datbase hosted on RDS
const quoteDB = await mysql.createConnection({ 
    host: process.env.QUOTE_DB_HOST, 
    user: process.env.QUOTE_DB_USER,
    password: process.env.QUOTE_DB_PASSWORD,
    database: process.env.QUOTE_DB_DATABASE,
    port: process.env.QUOTE_DB_PORT,
    /* Should use ssl when connecting but won't. RDS custom DB instance parameter group turned off.
    ssl: {
        ca: sslCa,
    },
    */
});

// Create a connection to the customers database
const customerDB = await mysql.createConnection({
    host: process.env.CUSTOMER_DB_HOST, 
    user: process.env.CUSTOMER_DB_USER,
    password: process.env.CUSTOMER_DB_PASSWORD,
    database: process.env.CUSTOMER_DB_DATABASE
});


export default { customerDB, quoteDB };
