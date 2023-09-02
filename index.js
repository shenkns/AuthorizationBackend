// Config variables
const serverPort = 5000;
const dbUrl = 'mongodb+srv://admin:TvyoPh4fSjE0tgAP@cluster0.qvainjk.mongodb.net/game?retryWrites=true&w=majority';

// Init express
const express = require('express');
const app = express();

// Init Body parsing
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Init Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userScheme = new Schema({name: String, password: String, email: String}, {versionKey: false});
const User = mongoose.model("User", userScheme);

// Main body
async function main() {
    mongoose.connect(dbUrl)
        .then((res) => console.log("Connected to MongoDB!"))
        .catch((error) => console.log(error));

    app.listen(process.env.PORT || serverPort, function()
    {
        console.log("Server started on " + (process.env.PORT || serverPort) + " port");
    });
}
// Main body

// Requests bind
app.get('/', async function(request, response)
{
    console.log(request.url);

    const users = await User.find({});
    response.send(users);
});

app.post('/sign-in-id', async function(request, response)
{
    console.log(request.url);
    console.log(request.body);

    const userId = request.body.id;
    const userPassword = request.body.password;

    if(!userId || !userPassword)
    {
        response.sendStatus(400);
        return;
    }

    const user = await User.findById(userId);
    if(user) 
    {
        if(user['password'] && user['password'] === userPassword)
        {
            response.send({ success: 1 });
        }
        else
        {
            response.send({ success: 0 });
        }
    }
    else response.sendStatus(404);
});

app.post('/sign-in-email', async function(request, response)
{
    console.log(request.url);
    console.log(request.body);

    const userEmail = request.body.email;
    const userPassword = request.body.password;

    if(!userEmail || !userPassword)
    {
        response.sendStatus(400);
        return;
    }

    const user = await User.find({ email: userEmail });
    if(user.length > 0) 
    {
        if(user[0]['password'] && user[0]['password'] === userPassword)
        {
            response.send({ success: 1 });
        }
        else
        {
            response.send({ success: 0 });
        }
    }
    else response.sendStatus(404);
});

app.post('/sign-up', async function(request, response)
{
    console.log(request.url);
    console.log(request.body);

    const userName = request.body.name;
    const userPassword = request.body.password;
    const userEmail = request.body.email;

    if(!userName || !userPassword || !userEmail)
    {
        response.sendStatus(400);
        return;
    }

    const checkUser = await User.find({ email: userEmail });
    if(checkUser.length > 0) 
    {
        response.sendStatus(409);
        return;
    }

    const user = new User({ name: userName, password: userPassword, email: userEmail });

    await user.save();
    response.send(user._id);
});

// Server start
main();