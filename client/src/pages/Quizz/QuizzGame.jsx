import {useParams} from "react-router-dom";

export const QuizzGame = () => {
    /**
     * TODO: Afficher le jeu
     */

    const { roomId, category } = useParams();

    return (
        <div>
            <h1>Quizz Game {category}</h1>
        </div>
    );
}
