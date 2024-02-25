const QuestionsService = require('./../services/questionsService');

function roomId() {
    return Math.random().toString(36).substr(2, 9);
}
function createRoom(user, category) {
    const room = { id: roomId(), users: [], usersAnswered: [], category: category };
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

            
            socket.on("send message", ({ message }) => {
              console.log("message", message);
              this.io.emit("receive message", {
                message,
              });

              // const userRoom = this.connectedUsers.get(socket.id)?.roomId;
              // if (userRoom) {
              //     this.io.to(userRoom).emit("receive message", {
              //         message
              //     // timestamp: new Date(), // Optionnel : ajouter un horodatage
              //     });
              // }
            });

            socket.on('search a room', async ({ user, category }) => {
                console.log("search a room", user, category)
                let room= null;

                if (this.rooms?.[category] !== undefined) {
                    console.log("category already exist", this.rooms[category]);
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
                        console.log("\x1b[31m%s\x1b[0m","startQuizzGame");
                        const questionService = new QuestionsService();

                        const questions = await questionService.findByName(category, {page: 1, itemsPerPage: 5, order: {id: 'ASC'}});
                        console.log(questions, 'questions', category)

                        this.io.to(room.id).emit('startQuizzGame', {
                            room,
                            category,
                            questions,
                            users: room.users
                        });
                    } else {

                        console.log("\x1b[31m%s\x1b[0m","Wait for other player");
                    }
                }
                console.log(user, 'is added to the connected sockets')
                this.connectedUsers.set(socket.id, user);
                console.log(this.connectedUsers)
            });

            socket.on('quizz ended', ({ roomId, category }) => {
                const room = this.findRoomByCategory(category, roomId);

                if (room) {
                    this.io.to(roomId).emit('quizz ended', { room });
                }
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


          socket.on('answered', ({ user, questionId, isAnswerValid, answerId }) => {
            const room = this.findRoomByCategory(user.category, user.roomId);

            if (room) {
                const userInRoom = room.users.find(u => u.id === user.id);

                if (userInRoom) {
                    userInRoom.score = isAnswerValid ? userInRoom.score + 1 : userInRoom.score;

                    if (!room.usersAnswered.includes(user.id)) {
                        room.usersAnswered.push(user.id);
                    }

                    // send then answer to the other users but not the user who answered
                    room.users.forEach((u) => {
                        if (u.id !== user.id) {
                            // TODO Vivian : send the scores default scores for now
                            this.io.to(room.id).emit('update score', { user: u, room });
                            this.io.to(u.socketId).emit('opponent answered', { user, questionId, isAnswerValid, answerId,opponentScore: 0 });
                        }
                    });

                    if (room.usersAnswered.length === room.users.length) {
                        console.log("All users have answered");

                        // wait 5 seconds before sending the next question
                        setTimeout(() => {
                            this.io.to(room.id).emit('next question', room);
                        }
                        , 5000);
                        room.usersAnswered = [];
                    } else {
                        console.log("Not all users have answered", room.users);
                        // TODO Vivian : send the scores default scores for now
                        this.io.to(room.id).emit('update score', { user: userInRoom, room });


                    }
                }
            }
        });

              socket.on('quizz ended', ({ roomId }) => {
             const room = this.rooms.find(r => r.id === roomId);
                if (room) {
                    this.io.to(roomId).emit('quizz ended', { room });
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