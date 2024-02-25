import {useNavigate, useParams} from "react-router-dom";
import {socket} from "../../socket";
import {useQuizzContext} from "../../hooks/useQuizzContext";
import React from "react";
import {ThreeCircles} from "react-loader-spinner";

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
        <div className={'flex flex-col justify-center items-center '}>
            <h1 className="text-center w-full mb-10 text-2xl font-bold py-2 px-4 bg-primary text-white rounded mb-2">Waiting for
                players in :  {category}</h1>

            <ThreeCircles
                type="Puff"
                color="white"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />


        </div>
    );
}