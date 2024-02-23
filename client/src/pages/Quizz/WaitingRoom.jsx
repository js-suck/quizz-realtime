import {useNavigate, useParams} from "react-router-dom";
import {socket} from "../../socket";

export const WaitingRoom = () => {
    /**
     * TODO: Afficher une salle d'attente
     */

    const { category } = useParams();
    const navigate = useNavigate()
    const navigateToQuizzGame = (category, roomId) => {
        navigate(`/quizz-game/${category}/${roomId}`);
    }

    const user = {
        id: 1 + new Date().getTime(),
        username: "toto"
    }

    socket.emit('search a room', { category, user });

    socket.on('roomFound', (room) => {

        console.log("room found", room);
        navigateToQuizzGame(room.category, room.id);
    }
    );

    return (
        <div>
            <h1>Salle d'attente</h1>
        </div>
    );
}