var socket = io();

function scrollToBottom() {
    var messages = jQuery("#messages");
    var newMessage = messages.children("li:last-child");

    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log("Scroll is requireed");
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function () {
    console.log("Connected to the server");
    var params = jQuery.deparam(window.location.search);
    socket.emit("join", params, function (err) {
        if (err) {
            alert(err)
            window.location.href = "/";
        } else {
            console.log("no error");
        }
    });
});

socket.on("newMessage", function (message) {
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });
    jQuery("#messages").append(html);
    scrollToBottom();
});

socket.on("newLocationMessage", function (message) {

    var formatedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formatedTime,
        url: message.url
    });
    jQuery("#messages").append(html);
    scrollToBottom();
})

socket.on("disconnect", function () {
    console.log("Disconnected from the server");
});

socket.on('updateUserList', function (users) {
    console.log("User List", users);
    var ol = jQuery('<ol></ol>');

    users.forEach(function(users){
        ol.append(jQuery('<li></li>').text(users));
    });

    jQuery('#users').html(ol);
});

jQuery("#message-form").on("submit", function (e) {
    e.preventDefault();

    var messageTextbox = jQuery("[name=message]");  
    socket.emit("CreatedMessage", {
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val("");
    });

});

var locationButton = jQuery("#send-location");
locationButton.on("click", function () {
    if (!navigator.geolocation) {
        return alert("Geolocation is not working");
    }
    locationButton.attr('disabled', 'disabled').text("sending location...");

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text("send location");
        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text("send location");
        console.log("unable to fetch data");
    })
});