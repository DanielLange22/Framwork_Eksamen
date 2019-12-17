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
//const MONGO_URL = process.env.MONGO_URL;
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://BrugerEt:dani6602@cluster0-yrtpu.mongodb.net/test?retryWrites=true&w=majority';

app.use(express.static(path.resolve('..', 'client', 'build')));
app.use(cors());
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console

// Open paths that does not need login. Any route not included here is protected!
let openPaths = [
    /^(?!\/api).*/gim, // Open everything that doesn't begin with '/api'
    '/api/users/authenticate',
    '/api/users/create',
    '/api/users/update',
    { url: '/api/category', methods: ['GET']  }  // Open GET questions, but not POST.
];

// Validate the user using authentication. checkJwt checks for auth token.
const secret = process.env.SECRET || "the cake is a lie";
if (!process.env.SECRET) console.error("Warning: SECRET is undefined.");
app.use(checkJwt({ secret: secret }).unless({ path : openPaths }));

// This middleware checks the result of checkJwt
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { // If the user didn't authorize correctly
        res.status(401).json({ error: err.message }); // Return 401 with error message.
    } else {
        next(); // If no errors, send request to next middleware or route handler
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


