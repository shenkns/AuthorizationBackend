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
const userScheme = new Schema({name: String, age: Number}, {versionKey: false});
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

app.post('/signin', async function(request, response)
{
    console.log(request.url);
    console.log(request.body);

    const userName = request.body.name;

    if(!userName)
    {
        response.sendStatus(400);
        return;
    }

    const user = await User.find({ name: userName });
    if(user) response.send(user[0]['age'].toString());
    else response.sendStatus(404);
});

app.post('/signup', async function(request, response)
{
    console.log(request.url);
    console.log(request.body);

    const userName = request.body.name;
    const userAge = request.body.age;

    if(!userName || !userAge)
    {
        response.sendStatus(400);
        return;
    }

    const user = new User({ name: userName, age: userAge });

    await user.save();
    response.send(user);
});

// Server start
main();