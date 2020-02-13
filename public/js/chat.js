var socket = io.connect();
$(".alert").hide();
// Query DOM

var chat_window = document.getElementById("chat-window");

var message = document.getElementById("message"),
    username = document.getElementById("username"),
    btn = document.getElementById("send"),
    output = document.getElementById("output"),
    feedback = document.getElementById("feedback");

var spamTimer = false;
function inviaMsg() {
    if(!spamTimer){
        $("#send").attr("disabled", true);
        $("#message").attr("disabled", true);
        clearTimeout(spamTimer);
        spamTimer = setTimeout(function(){
            spamTimer = false;
            $("#send").attr("disabled", false);
            $("#message").attr("disabled", false);
            $("#message").focus();
        }, 1000);
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
    } else {
        $("#send").text("Slow down ni🅱️🅱️a");
        $("#send").attr("disabled", true);
        clearTimeout(spamTimer);
        spamTimer = setTimeout(function(){
            $("#send").text("Invia");
            $("#send").attr("disabled", false);
            $("#message").attr("disabled", false);
            $("#message").focus();
            spamTimer = false;
        }, 1000);
    }
}

// Emit event
btn.addEventListener("click", inviaMsg);

message.addEventListener("keypress", function() {
    if(username.value != ""){
        if($("#message").val() != ""){
            socket.emit("typing", username.value);
        } else {
            socket.emit("notyping");
        }
    };
});

$('body').click(function(){
    if($("#message").val() == ""){
        socket.emit("notyping");
    }
})

$('body').keypress(function(){
    if($("#message").val() == ""){
        socket.emit("notyping");
    }
})

message.addEventListener("keyup", function(){
    if(event.keyCode == 13 && !event.shiftKey){
        inviaMsg();
    };
});

var unread = 0;

function getOreMinuti(dataString){
    var date = new Date(Date.parse(dataString));
    return `${(date.getHours()<10?'0':'') + date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
}

// Listen for events
socket.on("chat", function(data) {
    feedback.innerHTML = "";
    if(data.socket_id == socket.id){
        output.innerHTML += "<p id='" + data.date + "'><span class='delete'><i class='fa fa-trash' aria-hidden='true'></i></span> <strong>" + data.username + "</strong> " + data.message + "<br><small>" + getOreMinuti(data.date) + "</small></p>";
    } else {
        output.innerHTML += "<p id='" + data.date + "'><strong>" + data.username + "</strong> " + data.message + "<br><small>" + getOreMinuti(data.date) + "</small></p>";
    };
    chat_window.scrollTop = chat_window.scrollHeight;
    unread++;
    document.title = "(" + unread + ") 3F Chat";
});

socket.on("typing", function(data) {
    feedback.innerHTML = "<p><em>" + data + " sta scrivendo...</em></p>";
    chat_window.scrollTop = chat_window.scrollHeight;
});

socket.on("notyping", function() {
    feedback.innerHTML = "";
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
        output.innerHTML += "<p id='" + messages[i].date + "'><strong>" + messages[i].username + "</strong> " + messages[i].message + "<br><small>" + getOreMinuti(messages[i].date) + "</small></p>";
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
    var element = document.getElementById(data.date);
    element.parentNode.removeChild(element);
});

var imgPrompt = false;
$("#img").on("click", function(){
    if($("#username").val() == ""){
        alert("Inserisci uno username");
    } else {
        imgPrompt = prompt("Inserisci il link dell'immagine");
        if(imgPrompt){
            try {
                var img = new Image();
                img.src = imgPrompt;
                img.onload = function(){
                    $(".alert").hide();
                    socket.emit("chat", {
                        message: "<img style='width: auto; max-width: 80%; max-height: 300px; display: block;' src='" + imgPrompt + "'",
                        username: username.value
                    });
                };
                img.onerror = function() {alert("Immagine non valida")};
            } catch(e){
                alert("Si è verificato un errore: " + e);
            }
        }
    }
})

function isUrlImage(uri){
    uri = uri.split('?')[0];
    var parts = uri.split('.');
    var extension = parts[parts.length-1];
    var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
    if(imageTypes.indexOf(extension) !== -1) {
        return true;   
    }
}