// Mock data for demonstration purposes
const transactions = [
    { id: 1, date: '2023-10-01', merchant: 'Grocery Store', amount: 100, category: 'Food' },
    { id: 2, date: '2023-10-02', merchant: 'Electric Company', amount: 200, category: 'Utilities' },
    { id: 3, date: '2023-10-03', merchant: 'Takeaway Restaurant', amount: 50, category: 'Food' },
    { id: 4, date: '2023-10-04', merchant: 'Insurance Company', amount: 300, category: 'Insurance' },
    { id: 5, date: '2023-10-05', merchant: 'Credit Card', amount: 400, category: 'Credit Card Bill' },
    { id: 6, date: '2023-10-06', merchant: 'Bank Transfer', amount: 500, category: 'Bank Transfer' },
    { id: 7, date: '2023-10-07', merchant: 'Takeaway Restaurant', amount: 60, category: 'Food' },
    { id: 8, date: '2023-10-08', merchant: 'Utility Company', amount: 220, category: 'Utilities' },
    { id: 9, date: '2023-10-09', merchant: 'Insurance Company', amount: 320, category: 'Insurance' },
    { id: 10, date: '2023-10-10', merchant: 'Credit Card', amount: 450, category: 'Credit Card Bill' },
    { id: 11, date: '2023-10-11', merchant: 'Bank Transfer', amount: 550, category: 'Bank Transfer' },
    // ...add more transactions as needed...
];

const categorySettings = {
    Food: true,
    Utilities: false,
    Insurance: true,
    'Credit Card Bill': true,
    'Bank Transfer': true
};

const budgets = {
    Food: 500,
    Utilities: 300,
    Insurance: 400,
    'Credit Card Bill': 600,
    'Bank Transfer': 1000
};

const account = {
    accountNumber: '12345678',
    sortCode: '12-34-56',
    currentBalance: 5000,
    transactions: transactions
};

// Controller to get transactions
exports.getTransactions = (req, res) => {
    console.log('Received request for transactions');
    console.log('Transactions:', transactions);
    res.json({ transactions, currentBalance: account.currentBalance });
};

// Controller to update category settings
exports.updateCategorySettings = (req, res) => {
    const { category, enabled } = req.body;
    if (category in categorySettings) {
        categorySettings[category] = enabled;
        res.json({ message: 'Category settings updated', categorySettings });
    } else {
        res.status(400).json({ message: 'Invalid category' });
    }
};

// Controller to get analysis
exports.getAnalysis = (req, res) => {
    // Mock analysis result
    const analysisResult = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    };
    res.json(analysisResult);
};

// Controller to get insights
exports.getInsights = (req, res) => {
    const insights = transactions.reduce((acc, transaction) => {
        const { category, amount } = transaction;
        if (!acc[category]) {
            acc[category] = { totalSpent: 0, budget: budgets[category] || 0 };
        }
        acc[category].totalSpent += amount;
        return acc;
    }, {});

    res.json(insights);
};

// Controller to get transactions by category
exports.getTransactionsByCategory = (req, res) => {
    const { category } = req.params;
    if (category in categorySettings) {
        const filteredTransactions = transactions.filter(transaction => transaction.category === category);
        res.json({ transactions: filteredTransactions });
    } else {
        res.status(400).json({ message: 'Invalid category' });
    }
};

// Middleware to check budget before allowing deductions
exports.checkBudget = (req, res, next) => {
    const { category, amount } = req.body;
    const totalSpent = transactions
        .filter(transaction => transaction.category === category)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    if (totalSpent + amount > (budgets[category] || Infinity)) {
        return res.status(400).json({ message: 'Budget exceeded for category', category });
    }
    next();
};