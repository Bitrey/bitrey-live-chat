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
var MessageSchema = new mongoose.Schema({
    username: String,
    message: String
});
var Message = mongoose.model("Message", MessageSchema)

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

app.get("/delete", function(req, res){
    Message.deleteMany({}, function(err){
        if(err){
            console.log(err);
        };
        res.redirect("/");
    });
});

// Static files
app.use(express.static("public"));

var server = app.listen(process.env.PORT, process.env.IP);

// Socket setup
var io = socket(server);

io.on("connection", function(socket){
    console.log("Nuova connessione da " + socket.id);
    socket.on("chat", function(data){
        io.sockets.emit("chat", data);
        Message.create({
            username: data.username,
            message: data.message
        }, function(err, saved){
            if(err){
                console.log(err);
            };
        });
    });
    
    Message.find({}, function(err, messages){
        socket.emit("pastMsg", messages);
    });

    socket.on("typing", function(data){
        socket.broadcast.emit("typing", data);
    })
});