const socketIO = require('socket.io');
const ChatService = require('../../feature/chat/chat.Service');
let io;
function initialize(server) {
    io = socketIO(server,{ cors: { origin: true } });
    io.on('connection', (socket) => {
        console.log('A user connected' , socket?.id);
        socket.on('join_room', (dataObje) => {
            const room =  JSON.parse(dataObje)
            socket.join(room.roomId);
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
            socket.broadcast.to(messageObj?.roomId).emit('receive_message', {
                msg: messageObj?.message
            });
            io.to(message.roomId).emit('receive_message', messageObj);
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


