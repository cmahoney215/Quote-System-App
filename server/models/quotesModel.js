/**
 * Model File for Handling queries to quote system database
 * 
 * This file contains the functions to query quotes
 * 
 * Tables content for quotes:
 * [id, customer_id, sales_associate_id, email, total_cost, status, date, commission_amount]
 * 
 */

import connection from '../config/dbConfig.js';
import { formatQuotes } from '../utils/quoteHelpers.js';

// Get all quotes depending on the arguments passed in from url
async function getQuotes({ status, salesAssociate, date, customer }) {

    // Start with fetching all the quotes
    let query = 'SELECT * FROM quotes WHERE 1=1';
    let params = [];

    // If arguments values were passed in then add them to the query to get a quote depending on these values
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    if (salesAssociate) {
        query += ' AND sales_associate_id = ?';
        params.push(salesAssociate);
    }
    if (date) {
        query += ' AND DATE(date) = ?';
        params.push(date);
    }
    if (customer) {
        query += ' AND customer_id = ?';
        params.push(customer);
    }

    const [quoteResults] = await connection.quoteDB.execute(query, params);
    const quotes = await formatQuotes(quoteResults);
    return quotes;
}

// Get quote depending on the id
async function getQuoteById(id) {

    // Start with fetching all the quotes
    let query = 'SELECT * FROM quotes WHERE id = ?';
    let params = [id];

    const [quoteResults] = await connection.quoteDB.execute(query, params);
    const quotes = await formatQuotes(quoteResults);
    return quotes.length > 0 ? quotes[0] : null;  // So t returns a quote and not an array of quotes
}


// The quote we want to update
// Example of content being passed in
// {
//     id: 13,
//     customerId: 15,
//     salesAssociateId: 10,
//     email: 'filly@gmail.com',
//     items: [
//       { id: 9, description: 'Club', amount: 200 },
//       { id: 10, description: 'Nails', amount: 50 },
//       { description: 'Jeans', amount: 25, editing: false }
//     ],
//     status: 'open',
//     secretNotes: [ { id: 3, description: 'Is this safe?' } ],
//     totalCost: 275,
//     date: '2024-8-2'
// }
async function updateQuote(quote) {

    try {
        // Update the quote in the database
        const quoteQuery = 'UPDATE quotes SET customer_id = ?, sales_associate_id = ?, email = ?, total_cost = ?, status = ?, date = ?, commission_amount = ? WHERE id = ?;';
        const quoteValues = [quote.customerId, quote.salesAssociateId, quote.email, quote.totalCost, quote.status, quote.date, quote.commission, quote.id];
        await connection.quoteDB.execute(quoteQuery, quoteValues);

        // Get existing items for the quote
        const [existingItems] = await connection.quoteDB.execute('SELECT * FROM items WHERE quote_id = ?;', [quote.id]);
        const existingItemIds = existingItems.map(item => item.id);

        // Update existing items and add new items
        for (const item of quote.items) {
            if (item.id) {
                // Update existing item
                const itemQuery = 'UPDATE items SET description = ?, price = ? WHERE id = ?;';
                const itemValues = [item.description, item.amount, item.id];
                await connection.quoteDB.execute(itemQuery, itemValues);
                
                // Remove the updated item from existingItemIds array
                const index = existingItemIds.indexOf(item.id);
                if (index > -1) {
                    existingItemIds.splice(index, 1);
                }
            } else {
                // Add new item
                const newItemQuery = 'INSERT INTO items (quote_id, description, price) VALUES (?, ?, ?);';
                const newItemValues = [quote.id, item.description, item.amount];
                await connection.quoteDB.execute(newItemQuery, newItemValues);
            }
        }

        // Delete removed items
        if (existingItemIds.length > 0) {
            const deleteItemQuery = `DELETE FROM items WHERE id IN (${existingItemIds.join(',')});`;
            await connection.quoteDB.execute(deleteItemQuery);
        }

        // Get existing secret notes for the quote
        const [existingSecretNotes] = await connection.quoteDB.execute('SELECT * FROM secret_notes WHERE quote_id = ?;', [quote.id]);
        const existingSecretNoteIds = existingSecretNotes.map(note => note.id);

        // Update existing secret notes and add new secret notes
        for (const secretNote of quote.secretNotes) {
            if (secretNote.id) {
                // Update existing secret note
                const noteQuery = 'UPDATE secret_notes SET note = ? WHERE id = ?;';
                const noteValues = [secretNote.description, secretNote.id];
                await connection.quoteDB.execute(noteQuery, noteValues);
                
                // Remove the updated note from existingSecretNoteIds array
                const index = existingSecretNoteIds.indexOf(secretNote.id);
                if (index > -1) {
                    existingSecretNoteIds.splice(index, 1);
                }
            } else {
                // Add new secret note
                const newNoteQuery = 'INSERT INTO secret_notes (quote_id, note) VALUES (?, ?);';
                const newNoteValues = [quote.id, secretNote.description];
                await connection.quoteDB.execute(newNoteQuery, newNoteValues);
            }
        }

        // Delete removed secret notes
        if (existingSecretNoteIds.length > 0) {
            const deleteNoteQuery = `DELETE FROM secret_notes WHERE id IN (${existingSecretNoteIds.join(',')});`;
            await connection.quoteDB.execute(deleteNoteQuery);
        }

    } catch (err) {
        throw err;
    }
}

/**
 * Save a new quote to the database
 * 
 * @param {Object} quote - The quote object to be saved
 */
async function createQuote(quote) {

    // Parameterized query to help avoid SQL injections
    try {
        // Add quote to database
        const quoteQuery = 'INSERT INTO quotes (customer_id, sales_associate_id, email, total_cost, status, date) VALUES (?, ?, ?, ?, ?, ?);';
        const quoteValues = [quote.customerId, quote.salesAssociateId, quote.email, quote.totalCost, quote.status, quote.date];
        const [result] = await connection.quoteDB.execute(quoteQuery, quoteValues);
        const quoteId = result.insertId;

        // Add item for the quote to the database
        const itemQuery = 'INSERT INTO items (quote_id, description, price) VALUES (?, ?, ?);';
        for (const item of quote.items) {
            const itemValues = [quoteId, item.description, item.amount];
            await connection.quoteDB.execute(itemQuery, itemValues);
        }

        // Add secret notes to the database
        const noteQuery = 'INSERT INTO secret_notes (quote_id, note) VALUES (?, ?);';
        for (const secretNote of quote.secretNotes) {
            const secretNoteValues = [quoteId, secretNote.description];
            await connection.quoteDB.execute(noteQuery, secretNoteValues);
        }

    } catch(err) {
        throw err;
    }
}

export default { getQuotes, updateQuote, createQuote, getQuoteById };
