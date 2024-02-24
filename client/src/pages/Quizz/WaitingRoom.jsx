import {useNavigate, useParams} from "react-router-dom";
import {socket} from "../../socket";
import {useQuizzContext} from "../../hooks/useQuizzContext";

export const WaitingRoom = () => {
    const { category } = useParams();
    const navigate = useNavigate()
    const {setQuestions, user, setUser} = useQuizzContext();
    const navigateToQuizzGame = (category, roomId) => {
        navigate(`/quizz-game/${category}/${roomId}`);
    }


    socket.emit('search a room', { category, user: {
        ...user,
        socketId: socket.id
        } });

    socket.on('startQuizzGame', ({
        room, questions }) => {

        console.log("room found", room, questions);
        setUser((prev) => ({ ...prev, roomId: room.id, category: room.category, socketId: socket.id }));
        setQuestions(questions);
        navigateToQuizzGame(room.category, room.id);
    }
    );

    return (
        <div>
            <h1>Salle d'attente</h1>
        </div>
    );
}