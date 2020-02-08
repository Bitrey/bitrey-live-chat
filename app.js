var express = require("express");
var app = express();
var socket = require("socket.io");
var mongoose = require("mongoose");
require('dotenv').config();

app.set("view engine", "ejs");

// CONNECT MONGODB URI
mongoose.connect(process.env.mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, function(){
    console.log("Database connesso!");
});

// SET MESSAGE SCHEMA
var MessageSchema = new mongoose.Schema({
    username: String,
    message: String,
    date: { type: Date, default: Date.now },
    socket_id: String
});
var Message = mongoose.model("Message", MessageSchema);

app.get("/", function(req, res){
    Message.find({}, function(err, messageFound){
        if(err){
            res.status(204).send("Si è verificato un errore nel caricamento");
        } else {
            res.render("index", messageFound);
        }
    });
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
    Message.find({}, function(err, messages){
        if(err){
            socket.emit("err", err);
        } else {
            socket.emit("pastMsg", messages);
        }
    });
    socket.on("chat", function(data){
        let messageObj = new Message({
            message: data.message,
            username: data.username,
            date: Date.now(),
            socket_id: socket.id
        })
        messageObj.save(function(err){if(err){console.log(err);}});
        io.sockets.emit("chat", messageObj);
    });

    socket.on("typing", function(data){
        socket.broadcast.emit("typing", data);
    })

    socket.on("cancella", function(data){
        Message.findOneAndRemove({date: data}, function(err, deleted){
            if(err){
                console.log(err);
            } else {
                io.emit("cancella", deleted);
            }
        });
    })
});