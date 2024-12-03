class Budget {
    constructor(category, amount) {
        this.category = category;
        this.amount = amount;
    }

    toJSON() {
        return {
            category: this.category,
            amount: this.amount
        };
    }
}


module.exports = Budget;