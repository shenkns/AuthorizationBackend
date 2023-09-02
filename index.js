const serverPort = 5000;
const dbUrl = 'mongodb+srv://admin:TvyoPh4fSjE0tgAP@cluster0.qvainjk.mongodb.net/game?retryWrites=true&w=majority';

const express = require('express');
const app = express();

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

app.listen(process.env.PORT || port, function()
{
    console.log("Server started on " + serverPort + " port");
});