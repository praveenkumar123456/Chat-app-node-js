const express = require('express');
const app = express();
const path = require('path');
const server = app.listen(4000, ()=>{
    console.log(`Server on port 4000`);
})
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', onConnected)
let socketConnect = new Set();

function onConnected(socket){
    console.log(socket.id)
    socketConnect.add(socket.id)
    io.emit('clients-total', socketConnect.size)

    socket.on('disconnect', ()=>{
        console.log("Socket Disconnect", socket.id)
        io.emit('clients-total', socketConnect.size)
        socketConnect.delete(socket.id)
    })

    socket.on('message', (data)=>{
        socket.broadcast.emit('chat-message', data);
    })

    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data);
    })
}


// additional liberary moment.js, used cdn in index.html, it is for date format
