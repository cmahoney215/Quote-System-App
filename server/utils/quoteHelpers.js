import connection from '../config/dbConfig.js';
import formatDate from './dateFormatter.js'
/**
 * Add all customer information to quotes
 * @param {Array} quotes - The list of quotes.
 * @param {Array} customers - The list of customers.
 * @returns {Array} - The list of quotes with customer details.
 * 
 * Example output:
 * [
 *   {
 *     id: 4,
 *     customerId: 2,
 *     salesAssociateId: 10,
 *     email: 'dmoney55@gmail.com',
 *     totalCost: 800,
 *     status: 'open',
 *     date: '2024-07-27',
 *     commission: null,
 *     items: [ 
 *         { id: 1, description: 'Toilet', amount: 300 },
 *         { id: 2, description: 'Shower', amount: 500 }
 *     ],
 *     secretNotes: [ 
 *         { id: 1, note: 'This is a secret note' }
 *     ],
 *     customer: {
 *       id: 2,
 *       name: 'Ege Consulting, Inc.',
 *       city: 'Miami, FL',
 *       street: '14531 SW 76 Street',
 *       contact: 'www.ege.com'
 *     },
 *     salesAssociate: {
 *       id: 10,
 *       username: 'jimmydean',
 *       password: 'secretpassword',
 *       commission: 0,
 *       city: 'chicago',
 *       street: '5th street'
 *     }
 *   }
 * ]
 */
export function createDetailedQuotes(quotes, customers, salesAssociates) {
    const customersMap = {};
    const salesAssociatesMap = {};
    customers.forEach((customer) => {
        customersMap[customer.id] = customer;
    });
    salesAssociates.forEach((salesAssociate) => {
        salesAssociatesMap[salesAssociate.id] = salesAssociate;
    });
    quotes.forEach((quote) => {
        quote.customer = customersMap[quote.customerId];
        quote.salesAssociate = salesAssociatesMap[quote.salesAssociateId];
    });
    return quotes;
}



/**
 * Formats quote data from the database into a structured object.
 * 
 * @returns {Promise<Array>} - An array of quote objects
 * 
 * Example output:
 * [
 *   {
 *     id: 4,
 *     customerId: 2,
 *     salesAssociateId: 10,
 *     email: 'dmoney55@gmail.com',
 *     totalCost: 800,
 *     status: 'open',
 *     date: '2024-07-27',
 *     commission: null,
 *     items: [ 
 *         { id: 1, description: 'Toilet', amount: 300 },
 *         { id: 2, description: 'Shower', amount: 500 }
 *     ],
 *     secretNotes: [ 
 *         { id: 1, note: 'This is a secret note' }
 *     ]
 *   }
 * ]
 */
export async function formatQuotes(quoteResults) {
    try {
        const quotes = [];

        for (const row of quoteResults) {
            quotes.push({
                id: row.id,
                customerId: row.customer_id,
                salesAssociateId: row.sales_associate_id,
                email: row.email,
                totalCost: row.total_cost,
                status: row.status,
                date: formatDate(row.date),
                commission: row.commission_amount,
                items: [],
                secretNotes: []
            });
        }

        // Add secret notes and items that are with each quote from the database
        for (const quote of quotes) {   

            // Add all the items from the database that are associated with the current quote
            const itemQuery = 'SELECT * FROM items WHERE quote_id = ?;';
            const [itemResults] = await connection.quoteDB.query(itemQuery, quote.id);
            for (const row of itemResults) {
                quote.items.push({
                    id: row.id,
                    description: row.description,
                    amount: row.price
                });
            }

            // Add all the secret notes from the database that are associated with the current quote
            const secretNoteQuery = 'SELECT * FROM secret_notes WHERE quote_id = ?;';
            const [secretNoteResults] = await connection.quoteDB.query(secretNoteQuery, quote.id);
            for (const row of secretNoteResults) {
                quote.secretNotes.push({
                    id: row.id,
                    description: row.note
                });
            }
        }
        return quotes;

    } catch (err) {
        throw err;
    }
}

export function mapData(data) {

    const temp = data.map(() => '?').join(',');
    const paramsTemp = data.map((value) => value.id);

    return [temp, paramsTemp]
}

