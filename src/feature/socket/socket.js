const socketIO = require('socket.io');
const ChatService = require('../../feature/chat/chat.Service');
let io;
function initialize(server) {
    io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('join_room', (roomId) => {
            socket.join(roomId.roomId);
        });
        /**
         * @description: this socket is used to  send messages to the user's room
         */
        socket.on('send_message', async (message) => {
            const messageObj = JSON.parse(message)
            const usersdata = await ChatService.findMemberOfRoom({roomId:messageObj.roomId});
            let memberList = []
            if (usersdata?.length > 0) {
                memberList =  usersdata[0]?.members.map(user => user._id).filter(id => id != messageObj.senderId);
            }
            messageObj.isNotSeen = memberList
            await ChatService.createChat(messageObj)
            io.to(message.roomId).emit('receive_message', message);
        })
        socket.on('seen_message', async (message) => {
            const messageObj = JSON.parse(message)
            await ChatService.isSeenMessage(messageObj)
        })
        
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}
module.exports = {
    initialize 
};


