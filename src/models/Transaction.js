const { model } = require("mongoose");

class Transaction {
    constructor(customerId, sortCode, accountNumber, date, category, recurrence) {
        this.customerId = customerId;
        this.sortCode = sortCode;
        this.accountNumber = accountNumber;
        this.date = date;
        this.category = category;
        this.amount = amount;
    }

    toJSON() {
        return {
            customerId: this.customerId,
            sortCode: this.sortCode,
            accountNumber: this.accountNumber,
            date: this.date,
            category: this.category,
            amount: this.amount
        };
    }
}

module.exports = Transaction;