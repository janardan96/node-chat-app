const express = require("express");
const path = require("path");
const socketIO = require("socket.io");
const http = require("http");

const {generateMessage,generateLocationMessage}=require("./utlis/message.js");
const{isRealString}=require("./utlis/validation.js");
const{Users}=require("./utlis/users.js");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users=new Users();

app.use(express.static(publicPath));


io.on("connection", (socket) => {
    console.log("New User is connected");
    
        socket.on('join',(params,callback)=>{
            if(!isRealString(params.name) || !isRealString(params.room)){
               return callback("name and room are required");
            }

            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id,params.name,params.room);

            io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit("newMessage", generateMessage("Admin","Welcome to the chat room"));
    socket.broadcast.to(params.room).emit("newMessage",generateMessage("Admin",`${params.name} has joined the room`));

            callback();
        })

    socket.on("CreatedMessage", (message,callback) => {
        console.log("Created Message From Client", message);
        var user=users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit("newMessage", generateMessage(user.name,message.text));

        }
        callback();
    });


    socket.on("createLocationMessage",(coords)=>{
        var user=users.getUser(socket.id);
        if(user){
            io.to(user.room).emit("newLocationMessage",generateLocationMessage(user.name,coords.latitude,coords.longitude));

        }
    });


    socket.on("disconnect", () => {
        console.log("User is disconnected");
        var user=users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left the room`));
        }
    });
});


server.listen(port, () => {
    console.log(`Server is on ${port}`);
})