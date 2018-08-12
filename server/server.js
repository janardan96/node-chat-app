const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const {generateMessage,generateLocationMessage}=require("./utlis/message");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on("connection", (socket) => {
    console.log("New User is connected");
    
    socket.emit("newMessage", generateMessage("Janardan","Welcome to the chat room"));

    
        socket.broadcast.emit("newMessage",generateMessage("Admin","New User is added"));

    socket.on("CreatedMessage", (message,callback) => {
        console.log("Created Message From Client", message);
        io.emit("newMessage", generateMessage(message.from,message.text));
        callback("its work  ")
    });


    socket.on("createLocationMessage",(coords)=>{
        io.emit("newLocationMessage",generateLocationMessage("Admin",coords.latitude,coords.longitude));
    });


    socket.on("disconnect", () => {
        console.log("User is disconnected");
    });
});


server.listen(port, () => {
    console.log(`Server is on ${port}`);
})