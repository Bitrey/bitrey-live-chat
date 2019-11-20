var express = require("express");
var app = express();
var socket = require("socket.io");
var mongoose = require("mongoose");
require('dotenv').config();

app.set("view engine", "ejs");

// CONNECT MONGODB URI
mongoose.connect(process.env.mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(){
    console.log("Database connesso!");
});

// SET MESSAGE SCHEMA
var messageSchema = new mongoose.Schema({
    username: String,
    message: String
});
var Message = mongoose.model("messages", messageSchema)

var sendMessage;

app.get("/", function(req, res){
    Message.find({}, function(err, messageFound){
        sendMessage = messageFound;
    });
    res.render("index", sendMessage);
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