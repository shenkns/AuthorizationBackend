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

// Init JWT
const customJWT = require('./src/user/auth/customJWT.js');

// Init Mongoose
const mongoose = require('mongoose');
const User = require('./src/user/models/user.js');

// Init crypto
const crypto = require('crypto');

function md5(content) {  
    return crypto.createHash('md5').update(content).digest('hex');
};

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
app.post('/user/auth/sign-in-id', async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userId = request.body.id;
    var userPassword = request.body.password;

    if(!userId || !userPassword) {
        response.status(400).json({
            message: "No id or password field in request!"
        });
        return;
    }

    userPassword = md5(userPassword);

    const user = await User.findById(userId);
    if(user) {
        if(user.password && user.password === userPassword) {
            const accessToken = customJWT.sign({ id: user._id });

            response.status(200).json({
                accessToken: accessToken,
                message: "Successful signed in!"
            });
        }
        else {
            response.status(401).json({
                message: "Invalid password!"
            });
        }
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
});

app.post('/user/auth/sign-in-email', async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userEmail = request.body.email;
    var userPassword = request.body.password;

    if(!userEmail || !userPassword) {
        response.status(400).json({
            message: "No email or password field in request!"
        });
        return;
    }

    userPassword = md5(userPassword);

    const user = await User.find({ email: userEmail });
    if(user.length > 0) {
        if(user[0].password && user[0].password === userPassword) {
            const accessToken = customJWT.sign({ id: user._id });

            response.status(200).json({
                accessToken: accessToken,
                message: "Successful signed in!"
            });
        }
        else {
            response.status(401).json({
                message: "Invalid password!"
            });
        }
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
});

app.post('/user/auth/sign-up', async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const userName = request.body.name;
    const userEmail = request.body.email;
    var userPassword = request.body.password;

    if(!userName || !userPassword || !userEmail) {
        response.status(400).json({
            message: "No name or email or password field in request!"
        });
        return;
    }

    userPassword = md5(userPassword);

    const checkUser = await User.find({ email: userEmail });
    if(checkUser.length > 0) {
        response.status(409).json({
            message: "Email already used!"
        });
        return;
    }

    const user = new User({ name: userName, email: userEmail, password: userPassword });

    await user.save();
    response.status(200).json({
        id: user._id,
        message: "Successful signed up!"
    });
});

app.post('/user/get-name', customJWT.authenticateJWT, async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;

    if(!id) {
        response.status(400).json({
            message: "No id field in request!"
        });
        return;
    }

    const user = await User.findById(id);
    if(user) {
        response.status(200).json( {
            name: user.name,
            message: "Name got!"
        });
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
});

app.post('/user/auth/reset-password', customJWT.authenticateJWT, async function(request, response) {
    console.log(request.url);
    console.log(request.body);

    const id = request.body.id;
    var oldPassword = request.body.oldPassword;
    var newPassword = request.body.newPassword;

    if(!id || !oldPassword || !newPassword) {
        response.status(400).json({
            message: "No id or oldPassword or newPassword field in request!"
        });
        return;
    }

    oldPassword = md5(oldPassword);
    newPassword = md5(newPassword);

    if(!(request.user.id === id)) {
        response.status(403).json({
            message: "You don't have permission to access!"
        });
        return;
    }

    const user = await User.findById(id);
    if(user) {
        if(user.password && user.password === oldPassword) {
            if(oldPassword === newPassword) {
                response.status(409).json({
                    message: "New password equals old!"
                });
                return;
            }

            user.password = newPassword;
            await user.save();

            const accessToken = customJWT.sign({ id: user._id });

            response.status(200).json({
                accessToken: accessToken,
                message: "Password successful changed!"
            });
        }
        else {
            response.status(401).json({
                message: "Invalid current password!"
            });
        }
    }
    else {
        response.status(404).json({
            message: "User not found!"
        });
    }
});

// Server start
main();