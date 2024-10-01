/**
 * Converts a date string from the database format to 'YYYY-MM-DD'.
 * 
 * @param {string} dateString - The date string from the database.
 * @returns {string} - The formatted date string in 'YYYY-MM-DD' format.
 */
function formatDate(dateString) {
    console.log(dateString);
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 

    return `${year}-${month}-${day}`;
}

export default formatDate;