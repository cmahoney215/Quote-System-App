/**
 * Routes File for Handling all API routes
 * 
 * This file contains all API routes which contains
 * [create, read, update, delete] methods. Hnadles routes for
 * customers, quotes, sales associates, authentication
 * 
 */

import express from 'express';
import apiController from '../controllers/apiController.js';

const router = express.Router();

// handler for `/api` routes
router.get('/quotes', apiController.getQuotes);

router.post('/quotes', apiController.postQuotes);

router.put('/quotes', apiController.updateQuotes);

router.get('/detailed-quotes', apiController.getDetailedQuotes);

router.get('/customers', apiController.getCustomers);

router.post('/login', apiController.postLogin);

router.get('/sales-associates', apiController.getSalesAssociates);

router.post('/sales-associates', apiController.postSalesAssociates);

router.delete('/sales-associates/:id', apiController.deleteSalesAssociates);

export default router;

