const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const routes = require('./routes/index');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');
const axios = require('axios'); // Add this line


require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Add this line
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Sample route to demonstrate serialization
app.get('/user', (req, res) => {
    const user = new User(1, 'John Doe', 'john.doe@example.com');
    res.json(user.toJSON());
});

app.get('/transaction', (req, res) => {
    const transaction = new Transaction('cust123', 121212, 12345678, '23/07/1989', 'insurance', true);
    res.json(transaction.toJSON());
});

app.get('/payment', (req, res) => {
    const payment = new Payment('utilities', 11.11, 111111, 12345678);
    res.json(payment.toJSON());
});

// Route to handle transaction list and get budget suggestions
app.post('/suggest-budget', async (req, res) => {
    console.log('Request body:', req.body);


    const transactions = req.body.transactions.map(tx => new Transaction(
        tx.customerId, tx.sortCode, tx.accountNumber, tx.date, tx.category, tx.amount
    ));

    if (!Array.isArray(transactions)) {
        return res.status(400).send('Invalid transactions format');
    }

    const endpointUrl = 'https://ai-inference-ecp-tigers.openai.azure.com/openai/deployments/gpt-4o-ecp-tigers/chat/completions?api-version=2024-08-01-preview';
    const client = new AzureGPT4Client(endpointUrl);

    const transactionList = transactions.map(tx => ({
        customerId: tx.customerId,
        sortCode: tx.sortCode,
        accountNumber: tx.accountNumber,
        date: tx.date,
        category: tx.category,
        amount: tx.amount
    }));

    const messages = [
        { role: 'system', content: 'You are a budgeting analyst that returns json' },
        { 
            role: 'user', 
            content: `Take a list of transactions with the following format:\n\n${JSON.stringify(transactionList, null, 2)}\n\nAnalyze the incomings and outgoings, and recommend a balanced budget, with a list of budgets for each payment category. The budget class looks like this:\n\n{
              "category": "string",
              "amount": 69.30
            }\n\nOutput should be in an array of these. Just return the json of array of budget items from inference. NOTHING MORE.` 
          },
    ];

    try {
        const response = await client.sendRequest(messages, 1000, 0.7, 1.0);
        console.log('Response:', response); // Log the response content

        let jsonResponse = response.choices[0].message.content.trim();

        // Check if the response contains Markdown formatting and remove it
        if (jsonResponse.startsWith('```json')) {
            jsonResponse = jsonResponse.replace(/```json|```/g, '');
        }

        console.log('JSON Response:', jsonResponse);    

        const suggestedBudgets = JSON.parse(jsonResponse).map(budget => new Budget(
            budget.category, budget.amount
        ));
        res.json({ suggestedBudgets });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the request');
    }
});




class AzureGPT4Client {
    constructor(endpointUrl) {
        this.apiKey = process.env.AZURE_API_KEY;
        this.endpointUrl = endpointUrl;
    }

    /**
     * Send a request to the GPT-4-0 Azure endpoint
     * @param {Array} messages - Chat history in the format [{ role: 'system' | 'user' | 'assistant', content: string }]
     * @param {number} [maxTokens=100] - Maximum number of tokens in the response
     * @param {string} [temperature=1.0] - Sampling temperature
     * @param {number} [topP=1.0] - Nucleus sampling parameter
     * @returns {Promise<object>} - Response from the GPT-4-0 endpoint
     */
    async sendRequest(messages, maxTokens = 100, temperature = 1.0, topP = 1.0) {
        try {
            const response = await axios.post(
                this.endpointUrl,
                {
                    messages: messages,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    top_p: topP,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': this.apiKey,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error sending request to Azure GPT-4-0 endpoint:', error.response?.data || error.message);
            throw error;
        }
    }
}

// Example usage
(async () => {
    const endpointUrl = 'https://ai-inference-ecp-tigers.openai.azure.com/openai/deployments/gpt-4o-ecp-tigers/chat/completions?api-version=2024-08-01-preview';

    const client = new AzureGPT4Client(endpointUrl);

    const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is the capital of France?' },
    ];

    try {
        const response = await client.sendRequest(messages, 100, 1.0, 1.0);
        console.log('Response:', response);
    } catch (error) {
        console.error('Failed to get a response from the Azure GPT-4-0 endpoint.');
    }
})();

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});