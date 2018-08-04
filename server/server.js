const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const {generateMessage}=require("./utlis/message");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on("connection", (socket) => {
    console.log("New User is connected");
    
    socket.emit("newMessage", generateMessage("janardan","Welcome to the chat room"));

    
        socket.broadcast.emit("newMessage",generateMessage("Admin","New User is added"));

    socket.on("CreatedMessage", (message) => {
        console.log("Created Message From Client", message);
        io.emit("newMessage", generateMessage(message.form,message.text));

        // socket.broadcast.emit("newMessage",{
        //     text:message.text,
        //     from:message.from
        // });
    });

    socket.on("disconnect", () => {
        console.log("User is disconnected");
    });
});


server.listen(port, () => {
    console.log(`Server is on ${port}`);
})