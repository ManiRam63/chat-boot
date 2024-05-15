import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import ChatService from '../chat/chat.service';
import RoomUserService from '../roomUser/roomUsers.service';
import { STATUSCODE } from '../../utils/statusCode';
let io;
export default function initialize(server: HttpServer): void {
  io = new Server(server, {
    cors: { origin: '*' }
    // transports: ['websocket']
  });
  let allUsers;
  io.on('connection', (socket) => {
    socket.on('join_room', async (data) => {
      const { roomId, userId, username } = data;
      socket.join(roomId);
      const isExistInRoom = await RoomUserService.findRoomUser({
        roomId: roomId,
        userId: userId
      });
      if (!isExistInRoom) {
        await RoomUserService.addRoomMember({
          roomId: roomId,
          userId: userId
        });
        io.to(roomId).emit('connectToRoomOk', { status: STATUSCODE.OK, message: 'room joined successfully' });
      }

      io.to(roomId).emit('room_joined', {
        message: `${userId} has joined the chat room`,
        username: username
      });
      allUsers = await RoomUserService.getAllUsers(roomId);
      io.to(roomId).emit('chatroom_users', allUsers);
    });
    socket.on('send_message', async (data) => {
      if (!socket.rooms.has(data?.roomId)) {
        await socket.join(data?.roomId);
      }
      io.to(data.roomId).emit('receiveMessage', data);
      const result = await RoomUserService.findRoomUser({
        roomId: data.roomId
      });
      let memberList = [];
      if (result && Array.isArray(result)) {
        memberList = result.map((user) => user._id).filter((id) => id !== data.senderId);
      }
      data.isNotSeen = memberList || [];
      await ChatService.createChat(data);
    });
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
}
