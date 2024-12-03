
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = name;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email
        };
    }
}

module.exports = User;