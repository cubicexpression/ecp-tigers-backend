// backend/src/models.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Transaction schema
const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    merchant: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

// Define the Account schema
const accountSchema = new Schema({
    accountNumber: {
        type: String,
        required: true
    },
    sortCode: {
        type: String,
        required: true
    },
    currentBalance: {
        type: Number,
        required: true
    },
    transactions: [transactionSchema]
});

// Create the models
const Transaction = mongoose.model('Transaction', transactionSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = { Transaction, Account };