var express = require("express");
var app = express();
var socket = require("socket.io");
require('dotenv').config();

app.set("view engine", "ejs")

app.get("/", function(req, res){
    res.render("index");
});

app.get("/informazioni", function(req, res){
    res.render("info");
});

// Static files
app.use(express.static("public"));

var server = app.listen(process.env.PORT, process.env.IP);

// Socket setup
var io = socket(server);

io.on("connection", function(socket){
    console.log("Nuova connessione da " + socket.id + "!");
    socket.on("chat", function(data){
        io.sockets.emit("chat", data);
    });

    socket.on("typing", function(data){
        socket.broadcast.emit("typing", data);
    })
});