var express = require("express");
var app = express();
var socket = require("socket.io");

var server = app.listen(4000, function(){
    console.log("Server Started on port 4000!");
});

app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/informazioni", function(req, res){
    res.render("info.ejs");
});

// Static files
app.use(express.static("public"));

// Socket setup
var io = socket(server);

io.on("connection", function(socket){
    console.log("Made websocket connection!");
    socket.on("chat", function(data){
        io.sockets.emit("chat", data);
    });

    socket.on("typing", function(data){
        socket.broadcast.emit("typing", data);
    })
});