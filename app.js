var express = require("express");
var app = express();
var socket = require("socket.io");

app.get("/", function(req, res){
    res.render("index.ejs");
});

app.get("/informazioni", function(req, res){
    res.render("info.ejs");
});

// Static files
app.use(express.static("public"));

var server = app.listen(process.env.PORT, process.env.IP);

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