// Authentication
import salesAssociateModel from '../models/salesAssociateModel.js';

export async function authenticateSalesAssociate(username, password) {
    try {
        const salesAssociate = await salesAssociateModel.getSalesAssociate(username);
        if (salesAssociate && salesAssociate.password === password) {  // This is where we should be using bcrypt compare. Passwords should be salted then hashed.
            return salesAssociate;
        } 
        return null;
    } catch (err) {
        console.error(err);
        throw err;
    }
}