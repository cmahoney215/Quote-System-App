/**
 * Model File for Handling queries to quote system database
 * 
 * This file contains the functions to query sales_associates
 * 
 * Tables content for sales_associates:
 * [id, username, password, commision, city, street]
 * 
 */


import connection from "../config/dbConfig.js";
import { mapData } from "../utils/quoteHelpers.js";

async function getSalesAssociate(username) {
    try {
        const query = 'SELECT * FROM sales_associates WHERE username = ?;';
        const [rows] = await connection.quoteDB.execute(query, [username]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getSalesAssociateById(id) {
    try {
        const query = 'SELECT * FROM sales_associates WHERE id = ?;';
        const [rows] = await connection.quoteDB.execute(query, [id]);
            if (rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getAllSalesAssociates() {
    try {
        const [salesAssociates] = await connection.quoteDB.execute('SELECT * FROM sales_associates;');
        return salesAssociates;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Save a new associate to the database
 * 
 * @param {Object} associate 
 */
async function createSalesAssociate(associate) {

    try {
        const associateQuery = 'INSERT INTO sales_associates (username, password, commission, city, street) VALUES (?, ?, ?, ?, ?);';
        const associateValues = [associate.username, associate.password, associate.commission, associate.city, associate.street];
        await connection.quoteDB.execute(associateQuery, associateValues);
    } catch(err) {
        throw err;
    }
}

async function updateSalesAssociate(associate) {
    try {
        const asociateQuery = 'UPDATE sales_associates SET username = ?, password = ?, commission = ?, city = ?, street = ? WHERE id = ?;';
        const associateValues = [associate.username, associate.password, associate.commission, associate.city, associate.street, associate.id];
        await connection.quoteDB.execute(asociateQuery, associateValues);
    } catch (err) {
        throw err;
    }
}

// this function removes selected associate and associate's quotes+notes
async function removeSalesAssociates(associateId) {
    try
    {
        // find all quotes from passed associate
        const queryQuotes = 'SELECT id FROM quotes WHERE sales_associate_id = ?;';
        const paramQuotes = [associateId];
        const [quoteIds] = await connection.quoteDB.execute(queryQuotes, paramQuotes);

        //items
        if(quoteIds.length > 0) {
        const [itemsPlaceholder, itemsParams] = mapData(quoteIds);
        const queryItems = `SELECT id FROM items WHERE quote_id IN (${itemsPlaceholder})`;
        const [itemIds] = await connection.quoteDB.execute(queryItems, itemsParams);

        //secret notes
        const [notesPlaceholder, notesParams] = mapData(quoteIds);
        const queryNotes = `SELECT id FROM secret_notes WHERE quote_id IN (${notesPlaceholder})`;
        const [noteIds] = await connection.quoteDB.execute(queryNotes, notesParams);
     
        //-----------------------------------------------------------------------------//

        // delete secret notes
        if(noteIds.length > 0) {
            const [deleteNotesPlaceholder, deleteNotesParams] = mapData(noteIds);
            const deleteNoteQuery = `DELETE FROM secret_notes WHERE id IN (${deleteNotesPlaceholder})`;
            await connection.quoteDB.execute(deleteNoteQuery, deleteNotesParams);
        }

        // delete items
        if(itemIds.length > 0) {
        const [deleteItemsPlaceholder, deleteItemsParams] = mapData(itemIds);
        const deleteItemQuery = `DELETE FROM items WHERE id IN (${deleteItemsPlaceholder})`;
        await connection.quoteDB.execute(deleteItemQuery, deleteItemsParams);
        }

        // delete quotes
        if(quoteIds.length > 0) {
        const [deleteQuotesPlaceholder, deleteQuotesParams] = mapData(quoteIds);
        const deleteQuoteQuery = `DELETE FROM quotes WHERE id IN (${deleteQuotesPlaceholder})`;
        await connection.quoteDB.execute(deleteQuoteQuery, deleteQuotesParams);
        }

    }
        // delete associate
        const deleteAssociateQuery = 'DELETE FROM sales_associates WHERE id = ?';
        const deleteAssociateParam = [associateId];
        await connection.quoteDB.execute(deleteAssociateQuery, deleteAssociateParam);
    
    } catch(err) {
        throw err;
    }
}

export default { getAllSalesAssociates, getSalesAssociate, createSalesAssociate, removeSalesAssociates, getSalesAssociateById, updateSalesAssociate };