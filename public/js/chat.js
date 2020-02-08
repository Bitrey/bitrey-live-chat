var socket = io.connect();
$(".alert").hide();
// Query DOM

var chat_window = document.getElementById("chat-window");

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

var unread = 0;

// Listen for events
socket.on("chat", function(data) {
    feedback.innerHTML = "";
    if(data.socket_id == socket.id){
        output.innerHTML += "<p id='" + data.date + "'><span class='delete'><i class='fa fa-trash' aria-hidden='true'></i></span> <strong>" + data.username + "</strong> " + data.message + "</p>";
    } else {
        output.innerHTML += "<p id='" + data.date + "'><strong>" + data.username + "</strong> " + data.message + "</p>";
    };
    chat_window.scrollTop = chat_window.scrollHeight;
    unread++;
    document.title = "(" + unread + ") 3F Chat";
});

socket.on("typing", function(data) {
    feedback.innerHTML = "<p><em>" + data + " sta scrivendo...</em></p>"
    chat_window.scrollTop = chat_window.scrollHeight;
});

setInterval(function(){
    if(document.hidden){
        if(unread != 0){
            document.title = "(" + unread + ") 3F Chat";
        }
    } else {
        unread = 0;
        document.title = "3F Chat";
    }
}, 500);

socket.on("pastMsg", function(messages){
    $("#output").html("");
    for(let i = 0; i < messages.length; i++){
        unread++;
        document.title = "(" + unread + ") 3F Chat";
        output.innerHTML += "<p id='" + messages[i].date + "'><strong>" + messages[i].username + "</strong> " + messages[i].message + "</p>";
    }
    chat_window.scrollTop = chat_window.scrollHeight;
});

$(".hideMe").hide();

var sfondo = false;

function magia(){
    $(".hideMe").toggle();
    if(sfondo == false){
        $("#chat-window").css("background", "#ffffff88");
        $("#chat-window").css("background-image", "url('https://s5.gifyu.com/images/ezgif-2-52ade8a765d5.gif')");
        $("#footer-img-left").attr("src", "https://www.googleapis.com/drive/v3/files/1K8QMR8ETZbb0kP0pGRl8noQB-XaR78nn?alt=media&key=AIzaSyCzJtUQTqW3tZTuLnq4b8EvfZlZqhaw5Hw");
        $("#footer-img-right").attr("src", "https://www.googleapis.com/drive/v3/files/1K8QMR8ETZbb0kP0pGRl8noQB-XaR78nn?alt=media&key=AIzaSyCzJtUQTqW3tZTuLnq4b8EvfZlZqhaw5Hw");
        sfondo = true;
    } else {
        $("#chat-window").css("background", "#f9f9f9");
        $("#chat-window").css("background-image", "");
        $("#footer-img-left").attr("src", "https://i.imgur.com/P60WYPZ.png");
        $("#footer-img-right").attr("src", "https://i.imgur.com/lDIspTu.png");
        sfondo = false;
    };
};

$("#output").on("click", ".delete", function(){
    socket.emit("cancella", $(this).parent().attr("id"));
	$(this).parent().html('<p id="loading" class="text-center pt-3"><span class="spinner-border spinner-border-sm text-danger" role="status"><span class="sr-only">Rimozione...</span></span> Rimozione del messaggio</p>');
});

socket.on("cancella", function(data){
    setTimeout(function(){$(`#${data.date}`).remove();}, 100);
});