import { Socket, Server } from "socket.io";

interface UserSocketData {
    socketId: string;
    userId: string;
    username: string;
    room: string
}

let globalRoom: UserSocketData[] = [];

export const privateChat = (io: Server) => {
    io.on('connect', (client: Socket) => {

        client.on('online', ({ userId, username }) => {
            client.join('global'); //Join to the global room
            client.join(userId); //Join to a private room with a unique id

            globalRoom.push({ //Set user data in the global array
                socketId: client.id,
                userId,
                username: username.trim().toLowerCase(),
                room: 'gobal'
            });

            const onlineUsers = [... new Set(globalRoom.map(user => user.userId))];
            io.emit('usersOnline', { onlineUsers });
        });

        client.on('logout', () => {
            const index = globalRoom.findIndex(userData => userData.socketId === client.id);
            globalRoom.splice(index, 1)[0];
            const onlineUsers = [... new Set(globalRoom.map(user => user.userId))];
            io.emit('usersOnline', { onlineUsers });
        });

        client.on('disconnect', () => {
            const index = globalRoom.findIndex(userData => userData.socketId === client.id);
            globalRoom.splice(index, 1)[0];
            const onlineUsers = [... new Set(globalRoom.map(user => user.userId))];
            io.emit('usersOnline', { onlineUsers });
        });
    });



}