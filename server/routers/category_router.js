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
        let newCategory = {
            text : req.body.text,
            books : []
        };
        dal.createCategory(newCategory).then(newCategory => res.json(newCategory));

        //Socket
        console.log("Server is sending out message")
        io.of('/api/Socket').emit('new-data-category-list', {
            //Evt. bare send dataen i stedet for en besked :)
            msg: 'New data',
        });
    });

    router.delete('/delete/:id', (req, res) => {
        console.log("We r in delete API :D");
        dal.removeCategory(req.params.id).then(() => res.json("Succes"));
        //Socket
        console.log("Server is sending out message")
        io.of('/api/Socket').emit('new-data-category-list', {
            //Evt. bare send dataen i stedet for en besked :)
            msg: 'New data',
        });
    });

    //Old
    /*router.post('/:id/answers', (req, res) => {
        dal.addAnswer(req.params.id, req.body.text).then(updatedQuestion => res.json(updatedQuestion));
    });*/

    //New
    //Bliver rettet til uden ID
    router.post('/books', async (req, res) => {
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
        dal.deleteBook(req.params.id, req.body.id).then(updatedCategory => res.json(updatedCategory));
    });

    return router;
};