var socket = io.connect("http://localhost:4000");
$(".alert").hide();
// Query DOM
var message = document.getElementById("message"),
    username = document.getElementById("username"),
    btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback");

// Emit event
btn.addEventListener("click", function () {
    if (username.value !== "" && message.value !== "") {
        $(".alert").hide();
        socket.emit("chat", {
            message: message.value,
            username: username.value
        });
    } else {
        $(".alert").show();
    }
});

message.addEventListener("keypress", function () {
    socket.emit("typing", username.value);
})

// Listen for events
socket.on("chat", function (data) {
    feedback.innerHTML = "";
    output.innerHTML += "<p><strong>" + data.username + "</strong> " + data.message + "</p>";
});

socket.on("typing", function (data) {
    feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>"
})