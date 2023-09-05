// Config variables
const serverPort = 5000;
const dbUrl = 'mongodb+srv://admin:TvyoPh4fSjE0tgAP@cluster0.qvainjk.mongodb.net/game?retryWrites=true&w=majority';

// Init express
const express = require('express');
const app = express();

// Init Body parsing
const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ extended: true }));

// Init Crypto
const customJWT = require('./src/user/auth/crypto/customJWT.js');

// Init Mongoose
const mongoose = require('mongoose');

//Swagger Docs
const swaggerUI = require('swagger-ui-express');
const swaggerDoc = require('./src/swagger.json');

app.use('/api', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// Main body
async function main() {
    mongoose.connect(dbUrl)
        .then((res) => console.log("Connected to MongoDB!"))
        .catch((error) => console.log(error));

    app.listen(process.env.PORT || serverPort, function()
    {
        console.log("Server started on " + (process.env.PORT || serverPort) + " port");
    });
};
// Main body

// Requests bind
const signInGuest = require('./src/user/auth/signInGuest.js');
app.post('/user/auth/sign-in-guest', signInGuest);

const signUp = require('./src/user/auth/signUp.js');
app.post('/user/auth/sign-up', customJWT.authenticateJWT, signUp);

const signInId = require('./src/user/auth/signInId.js');
app.post('/user/auth/sign-in-id', customJWT.authenticateJWT, signInId);

const signInEmail = require('./src/user/auth/signInEmail.js');
app.post('/user/auth/sign-in-email', customJWT.authenticateJWT, signInEmail);

const resetPassword = require('./src/user/auth/resetPassword.js');
app.post('/user/auth/reset-password', customJWT.authenticateJWT, resetPassword);

const getName = require('./src/user/getName.js');
app.post('/user/get-name', customJWT.authenticateJWT, getName);

// Server start
main();