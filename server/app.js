const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const checkJwt = require('express-jwt'); // Check for access tokens automatically

/**** Configuration ****/
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/eksamen_framework";

app.use(express.static(path.resolve('..', 'client', 'build')));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

let openPaths = [
    /^(?!\/api).*/gim,
    '/api/users/authenticate',
    '/api/users/create',
    '/api/users/update',
    { url: '/api/category', methods: ['GET']  }
];

const secret = process.env.SECRET || "the cake is a lie";
if (!process.env.SECRET) console.error("Warning: SECRET is undefined.");
app.use(checkJwt({ secret: secret }).unless({ path : openPaths }));

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: err.message });
    } else {
        next();
    }
});

/**** Database access layers *****/
const categoryDAL = require('./dal/CategoryDAL')(mongoose);
const userDAL = require('./dal/user_dal')(mongoose);

/**** Start ****/
mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(async () => {
        console.log("Database connected");
        //Nedstående er test data
        await categoryDAL.bootstrap();
        await userDAL.bootstrapTestusers();

        const server = await app.listen(PORT, () => console.log(`App us running on port: ${PORT}`));
        const io = require('socket.io').listen(server);

        /**** Socket.io event handlers ****/
        io.of('/api/Socket').on('connection', function (socket) {
            socket.on('hello', function (from, msg) {
                console.log('Ye you recieved a message')
            })
            socket.on('disconnect', () => {
                console.log('Disconnect')
            })
        })

        /**** Routes ****/
        const usersRouter = require('./routers/user_router')(userDAL, secret);
        app.use('/api/users', usersRouter);

        const categoryRouter = require('./routers/category_router')(categoryDAL, io);
        app.use('/api/category', categoryRouter);

        app.get('*', (req, res) =>
            res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
        );

    })
    .catch(error => { console.error(error) })


