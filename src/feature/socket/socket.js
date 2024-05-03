const socketIO = require('socket.io');
let io;
function initialize(server) {
    io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('join_room', (roomId) => {
            socket.join(roomId.roomId);
        });
        socket.on('send_message', (message) => { 
            io.to(message.roomId).emit('receive_message', message);
        })
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}
module.exports = {
    initialize 
};


