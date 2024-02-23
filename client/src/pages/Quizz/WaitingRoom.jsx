import {useParams} from "react-router-dom";
import {socket} from "../../socket";

export const WaitingRoom = () => {
    /**
     * TODO: Afficher une salle d'attente
     */

    const { category } = useParams();

    const user = "Nom d'utilisateur";

    socket.emit('search a room', { category, user });

    return (
        <div>
            <h1>Salle d'attente</h1>
        </div>
    );
}