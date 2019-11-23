var socket = io.connect();
$(".alert").hide();
// Query DOM
var message = document.getElementById("message"),
    username = document.getElementById("username"),
    btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback");

function inviaMsg() {
    if (username.value !== "" && message.value !== "") {
        $(".alert").hide();
        socket.emit("chat", {
            message: message.value,
            username: username.value
        });
        message.value = "";

    } else {
        $(".alert").show();
    }
}

// Emit event
btn.addEventListener("click", inviaMsg);

message.addEventListener("keypress", function() {
    if(username.value != ""){
        socket.emit("typing", username.value);
    };
});

message.addEventListener("keyup", function(){
    if(event.keyCode == 13){
        inviaMsg();
    };
});

// Listen for events
socket.on("chat", function(data) {
    feedback.innerHTML = "";
    output.innerHTML += "<p><strong>" + data.username + "</strong> " + data.message + "</p>";
});

socket.on("typing", function(data) {
    feedback.innerHTML = "<p><em>" + data + " sta scrivendo...</em></p>"
});

socket.on("pastMsg", function(data){
    data.forEach(function(message){
        output.innerHTML += "<p><strong>" + message.username + "</strong> " + message.message + "</p>";
    });
    console.log(socket.id);
});

$(".hideMe").hide();

var sfondo = false;

function magia(){
    $(".hideMe").toggle();
    if(sfondo == false){
        $("#chat-window").css("background", "#ffffff88");
        $("#chat-window").css("background-image", "url('https://s5.gifyu.com/images/ezgif-2-52ade8a765d5.gif')");
        sfondo = true;
    } else {
        $("#chat-window").css("background", "#f9f9f9");
        $("#chat-window").css("background-image", "");
        sfondo = false;
    };
};