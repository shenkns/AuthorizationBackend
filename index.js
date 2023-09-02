const serverPort = 5000;
const dbUrl = 'mongodb+srv://admin:TvyoPh4fSjE0tgAP@cluster0.qvainjk.mongodb.net/game?retryWrites=true&w=majority';

const express = require('express');
const app = express();

const mongoose = require('mongoose');

app.get('/', function(request, response)
{
    console.log(request.url);
    response.send("Authorization backend");
});

app.post('/signin', function(request, response)
{
    console.log(request.url);

    mongoose.connect(dbUrl)
    .then((res) => response.send("Signed in"))
    .catch((error) => response.send(error));
});

app.post('/signup', function(request, response)
{
    console.log(request.url);

    mongoose.connect(dbUrl)
    .then((res) => response.send("Signed up"))
    .catch((error) => response.send(error));
});

app.listen(process.env.PORT || serverPort, function()
{
    console.log("Server started on " + (process.env.PORT || serverPort) + " port");
});