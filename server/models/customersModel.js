/**
 * Model File for Handling queries to customer legacy database
 * 
 * This file contains the functions to query customers
 * 
 * Tables content for customers:
 * [id, name, city, street, contact]
 * 
 */
import connection from '../config/dbConfig.js';

//  `mysql2` library handles automatically connecting and closing a connection when `query` is called.
async function getAllCustomers() {
    try {
        const [customers] = await connection.customerDB.execute('SELECT * FROM customers');
        return customers;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getCustomerById(id) {
    try {
        const query = 'SELECT * FROM customers WHERE id = ?';
        const params = [id]
        const [customers] = await connection.customerDB.execute(query, params);
        return customers.length > 0 ? customers[0] : null;
    } catch (err) {
        console.error(err);
        throw err;
    }
}



export default { getAllCustomers, getCustomerById };