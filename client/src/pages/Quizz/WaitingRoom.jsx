import {useNavigate, useParams} from "react-router-dom";
import {socket} from "../../socket";
import {useQuizzContext} from "../../hooks/useQuizzContext";
import React from "react";

export const WaitingRoom = () => {
    const { category } = useParams();
    const navigate = useNavigate()
    const {setQuestions, user, setUser, setOpponent} = useQuizzContext();
    const navigateToQuizzGame = (category, roomId) => {
        navigate(`/quizz-game/${category}/${roomId}`);
    }


    socket.emit('search a room', { category, user: {
        ...user,
        socketId: socket.id
        } });

    socket.on('startQuizzGame', ({
        room, questions, users }) => {

        console.log("room found", room, questions);
        setUser((prev) => ({ ...prev, roomId: room.id, category: room.category, socketId: socket.id }));
        setOpponent(users.find((u) => u.id !== user.id));

        setQuestions(questions);
        navigateToQuizzGame(room.category, room.id);
    }
    );

    return (
        <div>t
            <h1>Salle d'attente {category}</h1>
            <img className={'rounded-3xl'} src={`/images/${category}.jpeg`} />

        </div>
    );
}