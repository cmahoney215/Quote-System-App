/**
 * Controller File for Handling API Requests
 * 
 * This file contains the controller functions that are meant for handling API requests related to customers,
 * quotes, and sales associates. 
 * 
 */
import customersModel from '../models/customersModel.js';
import quotesModel from '../models/quotesModel.js';
import salesAssociatesModel from '../models/salesAssociateModel.js';
import { createDetailedQuotes } from '../utils/quoteHelpers.js';
import { authenticateSalesAssociate } from '../services/authService.js';
import { transporter } from '../config/emailConfig.js';
import formatDate from '../utils/dateFormatter.js'
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


async function getCustomers(req, res) {
    try {
        const customers = await customersModel.getAllCustomers();       
        res.status(200).json({ customers: customers});
    } catch (err) {
        console.error('Error getting customer:', err);
        res.status(500).json({ error: 'Failed to get customers' });
    }
}

async function getQuotes(req, res) {
    const { status, salesAssociate, date, customer } = req.query;
    try {
        const quotes = await quotesModel.getQuotes({ status, salesAssociate, date, customer });
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function postQuotes(req, res) {
    try {
        const quoteData = req.body;
        await quotesModel.createQuote(quoteData);
        res.status(201).json({ message: 'Quote added successfully' });
    } catch (err) {
        console.error('Error adding quote:', err);
        res.status(500).json({ error: 'Failed to add quote' });
    }
}

async function updateQuotes(req, res) {
    try {
        let message = '';
        const quoteData = req.body;
        quoteData.commission = 0;
        await quotesModel.updateQuote(quoteData);
        let updatedQuote = await quotesModel.getQuoteById(quoteData.id);

        // Check if we need to send email out if status changed from finalized to sanctioned
        if (quoteData.sendEmail) {
            console.log('trying to send email');
            const customer = await customersModel.getCustomerById(updatedQuote.customerId);

            // Define the email options
            const emailMessage = {
                from: process.env.SMTP_USER,
                to: updatedQuote.email, 
                subject: 'Quote is Now Sanctioned',
                text: `Dear ${customer.name},\n\nYour quote has been sanctioned. Here are the details:\n\nItems:\n` +
                `${updatedQuote.items.map(item => `- ${item.description}: $${item.amount}`).join('\n')}\n\n` +
                `Total Cost: $${updatedQuote.totalCost}\n`,
            };

            // transporter holds the host email. Can find it in config folder. emailMessage holds the destination info
            try {
                await transporter.sendMail(emailMessage);
                console.log('email was sent');
                message += 'Sanctioned quote email sent successfully\n';
            } catch (err) {
                console.error('Error sending email:', err);
                throw err;
            }
            
        // Check to see if we need to process the quote to processing API
        } else if (updatedQuote.status === 'ordered') { // At this point quote can't be updated anymore after the final process here
            try {
                const offset = 1000; // Because we do not want to use the same ids as othe rpeople for the database
                const response = await axios.post('http://blitz.cs.niu.edu/PurchaseOrder/', {
                        order: updatedQuote.id + offset,
                        associate: updatedQuote.salesAssociateId,
                        custid: updatedQuote.customerId,
                        amount: updatedQuote.totalCost
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                let processData = response.data;
                console.log(response.data);

                // At this point we got a response back from process API
                /* The type of data `response.data` holds:
                {
                    order: 18,
                    associate: 10,
                    custid: 7,
                    amount: 1000,
                    name: 'GE Corporation',
                    processDay: '2024/8/31',
                    commission: '9%',
                    timeStamp: 1722888787165,
                    _id: '66b1325396e67b2877d76968'
                }
                */
                // If it all works need to handle the information send back from processing system
                updatedQuote.date = formatDate(processData.processDay);
                const commissionPercentage = parseFloat(processData.commission.replace('%', '')) / 100;
                updatedQuote.commission = commissionPercentage * processData.amount;
                await quotesModel.updateQuote(updatedQuote);
                const salesAssociate = await salesAssociatesModel.getSalesAssociateById(updatedQuote.salesAssociateId);
                salesAssociate.commission = updatedQuote.commission + salesAssociate.commission  // Add quote commission to sales associates total commission for that quote
                await salesAssociatesModel.updateSalesAssociate(salesAssociate);
                message += `Quote has been processsed on ${processData.processDay}\n${salesAssociate.username} got a commission of ${updatedQuote.commission}\n`;

            } catch (err) {
                console.error('Error processing quote:', err);
                throw err;
            }
        }

        message += 'Quote updated successfully';
        console.log(message);
        res.status(200).json({ message: message });
    } catch (err) {
        console.error('Error adding quote:', err);
        res.status(500).json({ error: 'Failed to update quote' });
    }
}
  
async function getDetailedQuotes(req, res) {
    const { status, salesAssociate, date, customer } = req.query;
    try {
        const quotes = await quotesModel.getQuotes({ status, salesAssociate, date, customer });          
        const customers = await customersModel.getAllCustomers(); // Might implement: get customers that are in with array of quote ids
        const salesAssociates = await salesAssociatesModel.getAllSalesAssociates(); // Might implement: get sales associates that are in with array of quote ids
        const detailedQuotes = createDetailedQuotes(quotes, customers, salesAssociates);  // Trying to find a way to speed this up when i have the time
        res.status(200).json({ detailedQuotes: detailedQuotes});
    } catch (err) {
        console.error('Error getting detailed quotes:', err);
        res.status(500).json({ error: 'Failed to get detailed quotes' });
    }
}

async function postLogin(req, res) {
    try {
        const { username, password } = req.body;
        const salesAssociate = await authenticateSalesAssociate(username, password);
        if (salesAssociate) {
            res.status(200).json({ message: 'Login successful', salesAssociate });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error getting sales associate:', err);
        res.status(500).json({ error: 'Failed to log in' });
    }
}

async function getSalesAssociates(req, res) {
    try {
        const salesAssociates = await salesAssociatesModel.getAllSalesAssociates();
        res.json(salesAssociates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function postSalesAssociates(req, res) {
      try {
        const salesAssociateData = req.body;
        await salesAssociatesModel.createSalesAssociate(salesAssociateData);
        res.status(201).json({ message: 'Associate added successfully' });
    } catch (err) {
        console.error('Error adding associate:', err);
        res.status(500).json({ error: 'Failed to add associate' });
    }
}

async function deleteSalesAssociates(req, res) {
    try {
      const salesAssociateId = parseInt(req.params.id);
      await salesAssociatesModel.removeSalesAssociates(salesAssociateId);
      res.status(201).json({ message: 'Associate deleted successfully' });
  } catch (err) {
      console.error('Error deleting associate:', err);
      res.status(500).json({ error: 'Failed to delete associate' });
  }
}

export default { getQuotes, getCustomers, getDetailedQuotes, postQuotes, postLogin, updateQuotes, getSalesAssociates, postSalesAssociates, deleteSalesAssociates };