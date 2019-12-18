module.exports = (dal, io) => {
    let express = require('express');
    let router = express.Router();

    router.get('/', (req, res) => {
        dal.getCategorySpec().then(cateorgy => res.json(cateorgy));
    });

    router.get('/:id', (req, res) => {
        let id = req.params.id;
        dal.getCategory(id).then(cateorgy => res.json(cateorgy));
    });

    router.post('/', (req, res) => {
        let msg = "Need to be admin before u can delete";
        if (!req.user.admin) return res.status(401).json({msg});

        if (!req.body.text) {
            let msg = "Information missing for post category";
            console.error(msg);
            res.status(400).json({msg: msg});
            return;
        }

        let newCategory = {
            text : req.body.text,
            books : []
        };
        dal.createCategory(newCategory).then(newCategory => res.json(newCategory));

        //Socket
        console.log("Server is sending out message")
        io.of('/api/Socket').emit('new-data-category-list', {
            msg: 'New data',
        });
    });

    router.delete('/delete/:id', (req, res) => {
        let msg = "Need to be admin before u can delete";
        if (!req.user.admin) return res.status(401).json({msg});

        dal.removeCategory(req.params.id).then(() => res.json("Succes"));

        //Socket
        console.log("Server is sending out message")
        io.of('/api/Socket').emit('new-data-category-list', {
            msg: 'New data',
        });
    });

    router.post('/books', async (req, res) => {
        if (!req.body.id || !req.body.title || !req.body.author || !req.body.price || !req.body.name_seller || !req.body.email_seller) {
            let msg = "Information missing for post book";
            console.error(msg);
            res.status(400).json({msg: msg});
            return;
        }

        let categoryT;
        await dal.getCategory(req.body.category).then(cateorgy => categoryT = cateorgy);

        dal.addBook(
            req.body.id,
            req.body.title,
            req.body.author,
            categoryT.text,
            req.body.price,
            req.body.name_seller,
            req.body.email_seller,
        ).then(updatedCategory => res.json(updatedCategory));
    });

    router.delete('/:id/books', (req, res) => {
        let msg = "Need to be admin before u can delete";
        if (!req.user.admin) return res.status(401).json({msg});

        dal.removeBook(req.params.id, req.body.id).then(updatedCategory => res.json(updatedCategory));
    });

    return router;
};