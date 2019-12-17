class CategoryDAL {
    constructor(mongoose) {
        this.mongoose = mongoose;
        const categorySchema = new mongoose.Schema({
            text: String,
            books: [{
                title: String,
                author: String,
                category: String, //Skal den evt bare fjernes? Grundet den er nestet...
                price: String,
                name_seller: String,
                email_seller: String
            }]
        });
        this.categoryModel = mongoose.model('category', categorySchema);
    }

    async getCategorySpec() {
        try {
            return await this.categoryModel.find({});
        } catch (error) {
            console.error("getCategory:", error.message);
            return {};
        }
    }

    async getCategory(id) {
        try {
            return await this.categoryModel.findById(id);
        } catch (error) {
            console.error("getCategory:", error.message);
            return {};
        }
    }

    async createCategory(newCategory) {
        let category = new this.categoryModel(newCategory);
        return category.save();
    }

    //Er dette korrekt?
    async removeCategory(id) {
        await this.categoryModel.deleteOne({_id: id});
    }

    async addBook(questionId, title, author, category, price, name_seller, email_seller) {
        const category_book = await this.getCategory(questionId);
        category_book.books.push({
            title: title,
            author: author,
            category: category,
            price: price,
            name_seller: name_seller,
            email_seller: email_seller
        });
        return category_book.save();
    }

    //EN AF DE 2 NEDSTÅENDE ER REDUDANTE
    async removeBook(categoryId, bookID) {
        const category = await this.getCategory(categoryId);
        category.books.pull({_id: bookID});
        return category.save();
    }

    async deleteAnswer(categoryId, bookID) {
        var ObjectId = require('mongodb').ObjectID;
        const category = await this.removeBook(categoryId, bookID);
        return category.save();
    }

    async bootstrap(count = 10) {
        let l = (await this.getQuestions()).length;
        console.log("Question collection size:", l);

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let question = new this.questionModel({
                    text: 'How does this work?',
                    answers: [
                        {text: "No idea!", votes: -3},
                        {text: "Using async functions!", votes: 2},
                        {text: "It's all async but based on promises!", votes: 3},
                    ]
                });
                promises.push(question.save());
            }

            return Promise.all(promises);
        }
    }
}

module.exports = (mongoose) => new CategoryDAL(mongoose);