const serverPort = 80;
const dbUrl = 'mongodb+srv://admin:TvyoPh4fSjE0tgAP@cluster0.qvainjk.mongodb.net/game?retryWrites=true&w=majority';

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose
.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
.then((res) => console.log("Connected to DB"))
.catch((error) => console.log(error));

app.get('/', function(request, response)
{
    console.log(request.url);
    response.send("Authorization backend");
});

app.post('/signin', function(request, response)
{
    console.log(request.url);
    response.send("Signed in");
});

app.post('/signup', function(request, response)
{
    console.log(request.url);
    response.send("Signed up");
});

app.listen(serverPort, function()
{
    console.log("Server started on " + serverPort + " port");
});