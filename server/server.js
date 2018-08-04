const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on("connection", (socket) => {
    console.log("New User is connected");

    socket.on("CreatedMessage", (message) => {
        console.log("Created Message From Client", message);
        io.emit("newMessage",{
            text:message.text,
            from:message.from
        });
    });

    socket.on("disconnect", () => {
        console.log("User is disconnected");
    });
});


server.listen(port, () => {
    console.log(`Server is on ${port}`);
})