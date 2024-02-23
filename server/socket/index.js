function roomId() {
    return Math.random().toString(36).substr(2, 9);
}
function createRoom(user, category) {
    const room = { id: roomId(), users: [], category: category };
    room.users.push(user);
    if (user && room) {
        user.roomId = room.id;
    } else {
        console.log('User or room is undefined or null');
    }

    return room;
}
const socketIo = require("socket.io");

class RealTimeQuizzSocket {
     io;
     rooms = {};
     connectedUsers = new Map();

    constructor(server) {
        this.io = socketIo(server, {
            cors: {
                origin: "*",
            },
        })
        console.log("Socket server initialized")

        this.initializeSocketEvents();
    }

     findRoomByCategory(category, id) {
        return this.rooms[category]?.find((r) => r.id === id);
    }

     getUserKey(socketId, category) {
        return `${socketId}:${category}`;
    }

     initializeSocketEvents() {
        this.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                console.log(socket.id, 'is disconnected')
                console.log(this.connectedUsers)
                console.log(this.connectedUsers.get(socket.id))
                const user = this.connectedUsers.get(socket.id);

                if (user) {
                    console.log(user.roomId)
                    const { roomId } = user;
                    socket.to(roomId).emit('userDisconnected', user.id);
                }

                this.connectedUsers.delete(socket.id);
            });

            socket.on('search a room', ({ user, category }) => {
                let room= null;

                if (this.rooms?.[category] !== undefined) {
                    // Search if a room with the same category exists and has only one user
                    this.rooms[category].forEach((r) => {
                        if (r.users.length === 1 && !r.users.find(u => u.id === user.id)) {
                            room = r;
                        }
                    });
                }

                if (!room) {
                    room = createRoom(user, category);
                    console.log("Created a room", room);

                    // Check if the category exists or create it
                    if (!this.rooms[category]) {
                        this.rooms[category] = [];
                    }

                    this.rooms[category].push(room);
                    socket.join(room.id);
                } else {
                    console.log("\x1b[31m%s\x1b[0m","ROOM WITH USER", room);
                    room.users.forEach((user) => {
                        if (user.id === user.id) {
                            return;
                        }
                    });
                    user.roomId = room.id;


                    if (room.users.length === 1) {
                        room.users.push(user);
                        socket.join(room.id);
                        user.category = category;
                        console.log("\x1b[31m%s\x1b[0m","roomFound");
                        this.io.to(room.id).emit('roomFound', room);
                    } else {

                        console.log("\x1b[31m%s\x1b[0m","Wait for other player");
                    }
                }
                console.log(user, 'is added to the connected sockets')
                this.connectedUsers.set(socket.id, user);
                console.log(this.connectedUsers)
            });

            socket.on("fetch room", ({ room: roomId, category, user }) => {

                user.roomId = roomId;
                this.connectedUsers.set(socket.id, user);
                const room = this.rooms?.[category]?.find((r) => r.id === roomId);
                console.log("finded room:", room);
                if (room !== undefined) {
                    socket.join(room.id);
                    this.io.to(room.id).emit('startGame', room);
                } else {
                    console.log("room not found");
                }

            });

            socket.on("update score", ({ user, room, score, category }) => {
                const roomToUpdate = this.rooms[category]?.find((r) => r.id === room);
                if (roomToUpdate) {
                    const userToUpdate = roomToUpdate.users.find((u) => u.id === user.id);
                    if (userToUpdate) {
                        userToUpdate.score = score;
                    } else {
                        console.log("user not found");
                    }
                }

                this.io.to(room).emit('update score', roomToUpdate);
            });

            socket.on("user finished", ({ user, room, category }) => {
                const roomToUpdate = this.findRoomByCategory(category, room);
                if (roomToUpdate) {
                    const userToUpdate = roomToUpdate.users.find((u) => u.id === user.id);
                    if (userToUpdate) {
                        userToUpdate.finished = true;
                    } else {
                        console.log("user not found");
                    }
                }

                const allFinished = roomToUpdate?.users.every((u) => u.finished);
                if (allFinished) {
                    this.io.to(roomToUpdate.id).emit('game finished', roomToUpdate);

                    const indexToRemove = this.rooms[category]?.indexOf(roomToUpdate);
                    if (indexToRemove !== -1) {
                        this.rooms[category]?.splice(indexToRemove, 1);
                        console.log("Salle supprimée :", roomToUpdate);
                    } else {
                        console.log("La salle n'a pas été trouvée dans le tableau");
                    }
                }
            });



        });
    }

    // ...
}

module.exports = RealTimeQuizzSocket;