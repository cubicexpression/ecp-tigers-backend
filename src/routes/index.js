// backend/src/routes/index.js

const express = require('express');
const router = express.Router();

// Import transaction-related controllers
const { 
    getTransactions,
    updateCategorySettings,
    getAnalysis,
    getInsights,
    checkBudget,
    getTransactionsByCategory // Add this line
} = require('../controllers/transactionController');

// Transaction routes
router.get('/transactions', getTransactions);
router.get('/transactions/category/:category', getTransactionsByCategory); // Add this line
router.post('/transactions', checkBudget, (req, res) => {
    // Logic to add a new transaction
    res.status(201).json({ message: 'Transaction added' });
});

// Category settings routes
router.put('/categories/settings', updateCategorySettings);
router.get('/categories/settings', (req, res) => {
    res.status(200).send('Get category settings'); // Placeholder function
});

// Analysis routes
router.post('/analysis', getAnalysis);

// Insights route
router.get('/insights', getInsights);

// Backend status route
router.get('/status', (req, res) => {
    res.status(200).json({ status: 'Backend is running' });
});

// Default route to handle undefined routes
router.use((req, res) => {
    res.status(404).send('Route not found');
});

// Export the router
module.exports = router;