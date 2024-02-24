import {fetchApi} from "../helpers/fetchApi";
import {createContext, useCallback, useContext, useState} from "react";
import {getApirUrl} from "../helpers/getApirUrl";

const QuizzContext = createContext('');

export const useQuizz = () => {
    const [error, setError] = useState(null);
    const apiUrl = getApirUrl();
    const [questions, setQuestions] = useState([]);
    const [user, setUser] = useState({
        id: 1 + Math.random(),
       username: 'user',
    });

    const getQuizz = useCallback(
        async (category) => {
            return fetchApi(`${apiUrl}/questions/${category}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    setQuestions(data);
                })
                .catch((error) => {
                    setError(error);
                });
        },
        [apiUrl]
    );



    return {
        error,
        getQuizz,
        questions,
        setQuestions,
        user,
        setUser
    };

}


export const QuizProvider = ({ children }) => {
    const quizz = useQuizz();

    return (
        <QuizzContext.Provider value={quizz}>
            {children}
        </QuizzContext.Provider>
    );
}

export const useQuizzContext = () => {
   if (!QuizzContext) {
       throw new Error('useQuizzContext must be used within a QuizzProvider');
   }

    return useContext(QuizzContext);
}