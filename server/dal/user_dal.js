const bcrypt = require('bcryptjs'); // Used for hashing passwords!

class UserDAL {
    constructor(mongoose) {
        this.mongoose = mongoose;
        const userSchema = new mongoose.Schema({
            username: String,
            admin: Boolean,
            hash: String
        });
        this.userModel = mongoose.model('user', userSchema);
    }

    async createUser(user) {
        let newUser = new this.userModel(user);
        return newUser.save();
    }

    async updateOne(username, hashP) {
        await this.userModel.updateOne(
            {"username" : username},
            {$set: {hash: hashP}}
        )
        /*
         await dal.updateOne(
            {"username" : username},
            {$set: {hash: hashP}}
        )*/
    }

    async getUser(username) {
        try {
            return await this.userModel.findOne({"username": username});
        } catch (error) {
            console.error("getUser:", error.message);
            return {};
        }
    }

    async getUsers() {
        try {
            return await this.userModel.find({});
        } catch (error) {
            console.error("getUsers:", error.message);
            return {};
        }
    }

    async bootstrapTestusers() {
        let l = (await this.getUsers()).length;
        console.log("Users in system:", l);

        if (l !== 0) return;

        const users = [
            { username: "krdo", password: '123', admin: false},
            { username: "tosk", password: 'password', admin: true},
            { username: "mvkh", password: 'l33th0xor', admin: false},
        ];

        let promises = [];
        users.forEach(user => {
            bcrypt.hash(user.password, 10, (err, hash) => {
                user.hash = hash;
                delete user.password;

                let newUser = new this.userModel(user);
                promises.push(newUser.save());
            });
        });

        return Promise.all(promises);
    }
}

module.exports = (mongoose) => new UserDAL(mongoose);