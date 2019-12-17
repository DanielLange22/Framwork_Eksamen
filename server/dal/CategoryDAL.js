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
        let l = (await this.getCategorySpec()).length;
        console.log("Question collection size:", l);

        if (l === 0) {
            let promises = [];

            let category0 = new this.categoryModel({
                text: 'War',
                books: [
                    {title: "Krig",author: "Louise Klinke Øhrstrøm", category: "Krig",price: "151",name_seller: "Jesper",email_seller: "Test@gmail.com"},
                    {title: "Krig1",author: "Louise Klinke Øhrstrøm", category: "Krig",price: "245",name_seller: "Jesper",email_seller: "Test@gmail.com"},
                    {title: "Krig2",author: "Louise Klinke Øhrstrøm", category: "Krig",price: "2562",name_seller: "Jesper",email_seller: "Test@gmail.com"},
                ]
            });
            let category1 = new this.categoryModel({
                text: 'Horror',
                books: [
                    {title: "Amulet - stenens vogter",author: "Kazu Kibuishi",category: "Gys",price: "125",name_seller: "Jaasa",email_seller: "Something@gmail.com"},
                    {title: "Amulet - stenens vogter2",author: "Kazu Kibuishi",category: "Gys",price: "3254",name_seller: "Jaasa",email_seller: "Something@gmail.com"},
                    {title: "Amulet - stenens vogter3",author: "Kazu Kibuishi",category: "Gys",price: "232",name_seller: "Jaasa",email_seller: "Something@gmail.com"},
                ]
            });
                let category2 = new this.categoryModel({
                text: 'Humor',
                books: [
                    {title: "Ternet Ninja 2",author: "Anders Matthesen",category: "Humor",price: "125",name_seller: "Anders Matthesen",email_seller: "Anders_Matthesen@gmail.com"},
                    {title: "Ternet Ninja 1",author: "Anders Matthesen",category: "Humor",price: "225",name_seller: "Anders Matthesen",email_seller: "Anders_Matthesen@gmail.com"},
                    {title: "Ternet Ninja 0",author: "Anders Matthesen",category: "Humor",price: "315",name_seller: "Anders Matthesen",email_seller: "Anders_Matthesen@gmail.com"}
                ]
                });
                promises.push(category0.save());
                promises.push(category1.save());
                promises.push(category2.save());


            return Promise.all(promises);
        }
    }
}

module.exports = (mongoose) => new CategoryDAL(mongoose);