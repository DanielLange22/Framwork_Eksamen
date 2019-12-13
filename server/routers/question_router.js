module.exports = (dal, io) => {
    let express = require('express');
    let router = express.Router();

    router.get('/', (req, res) => {
        dal.getQuestions().then(questions => res.json(questions));
    });

    router.get('/:id', (req, res) => {
        let id = req.params.id;
        dal.getQuestion(id).then(question => res.json(question));
    });

    router.post('/', (req, res) => {
        let newQuestion = {
            text : req.body.text,
            answers : []
        };
        dal.createQuestion(newQuestion).then(newQuestion => res.json(newQuestion));

        //Socket
        console.log("Server is sending out message")
        io.of('/api/Socket').emit('new-data-question-list', {
            //Evt. bare send dataen i stedet for en besked :)
            msg: 'New data',
        });
    });

    router.delete('/delete/:id', (req, res) => {

        console.log("We r in delete API :D");

        dal.removeQuestion(req.params.id).then(() => res.json("Succes"));

        //Socket
        console.log("Server is sending out message")
        io.of('/api/Socket').emit('new-data-question-list', {
            //Evt. bare send dataen i stedet for en besked :)
            msg: 'New data',
        });
    });

    router.post('/:id/answers', (req, res) => {
        dal.addAnswer(req.params.id, req.body.text).then(updatedQuestion => res.json(updatedQuestion));
    });

    router.put('/:id/answers/:aid/vote', (req, res) => {
        let id = req.params.id;
        let aid = req.params.aid;
        dal.upvoteAnswer(id, aid).then(updatedQuestion => res.json(updatedQuestion));

        //Socket
        console.log("Server is sending out message")
        io.of('/my_app').emit('new-data-question-list', {
            //Evt. bare send dataen i stedet for en besked :)
            msg: 'New data',
        });
    });

    router.put('/:id/answers/:aid/voteDown', (req, res) => {
        let id = req.params.id;
        let aid = req.params.aid;
        dal.downvoteAnswer(id, aid).then(updatedQuestion => res.json(updatedQuestion));

        //Socket
        console.log("Server is sending out message")
        io.of('/my_app').emit('new-data-question-list', {
            //Evt. bare send dataen i stedet for en besked :)
            msg: 'New data',
        });
    });

    return router;
};