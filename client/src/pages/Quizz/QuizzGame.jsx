import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuizzContext } from "../../hooks/useQuizzContext";
const { socket } = require('../../socket');

export const QuizzGame = () => {
    const { questions, setQuestions, user } = useQuizzContext();
    const [firstQuestion, ...restOfQuestions] = questions;
    const { roomId, category } = useParams();
    const [opponentAnswered, setOpponentAnswered] = useState(false);
    const [userAnswered, setUserAnswered] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
    const [timer, setTimer] = useState(10);
    const [remainingQuestions, setRemainingQuestions] = useState(restOfQuestions);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);

    useEffect(() => {
        socket.on('update timer', (newTimer) => {
            setTimer(newTimer);
        });

        return () => {
            socket.off('update timer');
        };
    }, []);

    useEffect(() => {
        const handleNextQuestion = () => {
            setCurrentQuestion(remainingQuestions[0]);
            setUserAnswered(false);
            if (remainingQuestions.length === 1) {
                socket.emit('quizz ended', { roomId });
            } else {
                socket.emit('start timer', { roomId });
            }
        };

        socket.on('next question', handleNextQuestion);

        return () => {
            socket.off('next question', handleNextQuestion);
        };
    }, [remainingQuestions, roomId]);

    useEffect(() => {
        const handleOpponentAnswered = ({ user, questionId, isAnswerValid, answerId }) => {
            if (questionId === currentQuestion.id) {
                setOpponentAnswered(answerId);
            }
        };

        socket.on('opponent answered', handleOpponentAnswered);

        return () => {
            socket.off('opponent answered', handleOpponentAnswered);
        };
    }, [currentQuestion]);

    useEffect(() => {
        const index = questions.findIndex(q => q.id === currentQuestion.id);
        setRemainingQuestions(questions.slice(index + 1));
    }, [currentQuestion, questions]);

    const handleAnswer = (answer) => {
        socket.emit('answer', { roomId, answer });
        const isCorrect = answer.isCorrect
        setIsAnswerCorrect(isCorrect);
        socket.emit('answered', {user, questionId: currentQuestion.id, isAnswerValid: isCorrect , answerId: answer.id});
        setUserAnswered(true);
    };

    return (
        <div>
            <h1>Quizz Game {category}</h1>
            {currentQuestion && (
                <div>
                    <h2>{currentQuestion.label}</h2>
                    <img src={require(`../../assets/categories/${currentQuestion.image_url}`).default} alt={currentQuestion.label} />
                    <div>
                        {currentQuestion.answers.map((answer, index) => (
                            <button key={index} onClick={() => handleAnswer(answer)}>
                                {answer.label}
                                {userAnswered && opponentAnswered === answer.id && <p>Opponent answered</p>}
                            </button>
                        ))}
                    </div>
                    <p>{timer}</p>
                    {isAnswerCorrect !== null && (
                        <div>
                        {isAnswerCorrect ? <p>Correct</p> : <p>Incorrect</p>}
                        </div>
                    )}

                    {userAnswered && opponentAnswered && (

                        <p>loading...</p>)
                    }
                </div>
            )}
        </div>
    );
};
