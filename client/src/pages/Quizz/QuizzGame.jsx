import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuizzContext } from "../../hooks/useQuizzContext";
import { PlayerInfo } from "./components/PlayerInfo";
import { QuestionStepBubbleList } from "./components/QuestionBubbleList";
import { ChatRoom } from "../../components/ChatRoom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
const { socket } = require('../../socket');

export const QuizzGame = () => {
    const { questions, setQuestions, user, opponent } = useQuizzContext();
    const [firstQuestion, ...restOfQuestions] = questions;
    const { roomId, category } = useParams();
    const [opponentAnswered, setOpponentAnswered] = useState(false);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);

    const [currentQuestion, setCurrentQuestion] = useState(firstQuestion);
    const [timer, setTimer] = useState(10);
    const [remainingQuestions, setRemainingQuestions] = useState(restOfQuestions);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [quizzStarted, setQuizzStarted] = useState(false);

    useEffect(() => {
        socket.on('update timer', (newTimer) => {
            setTimer(newTimer);
        });

        return () => {
            socket.off('update timer');
        };
    }, []);

    useEffect(() => {

        if (!quizzStarted) {
            toast.info("Le quizz " + category +  " commence !");
            setQuizzStarted(true);
        }

        const handleNextQuestion = () => {
            if (remainingQuestions.length === 0) {
                socket.emit('quizz ended', { roomId, category });
                return;
            }
            setCurrentQuestion(remainingQuestions[0]);
            setSelectedAnswerId(null);
            socket.emit('start timer', { roomId, category });

            // Lorsque vous passez à la question suivante
            toast.info("Passage à la question suivante...");
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
        setSelectedAnswerId(answer.id);
    };

    const [quizzEnded, setQuizzEnded] = useState(false);

    useEffect(() => {
        toast.info("Fin du Quizz " + category);

        const handleQuizzEnded = () => {
            setQuizzEnded(true);
        };

        socket.on('quizz ended', handleQuizzEnded);

        return () => {
            socket.off('quizz ended', handleQuizzEnded);
        };
    }, []);

    const player1 = user;
    const player2 = opponent;

    return (
      <div className="flex flex-row">
          <ToastContainer />
          <div className={"bg-primary p-10 rounded-3xl w-9/12"}>
          <h1 className={"text-2xl p-4 text-center"}>Quizz Game {category}</h1>
          <div className={"bg-primary p-10 rounded-3xl"}>
            <div className="flex justify-between">
              <PlayerInfo {...player1} />
              <PlayerInfo {...player2} />
            </div>
          </div>
          <QuestionStepBubbleList
            questions={questions}
            currentQuestion={currentQuestion}
          />
          {quizzEnded ? (
            <QuizzEnd scores={[player1, player2]} />
          ) : (
            <div
              className={
                "flex flex-col w-3/4 justify-center items-center mx-auto"
              }
            >
              <img
                className={"rounded-3xl max-h-96	"}
                src={`/images/${currentQuestion.image_url}`}
                alt={currentQuestion.label}
              />
              <h2 className={"text-2xl m-4 font-bold text-center"}>
                {currentQuestion.label}
              </h2>
              <div>
                {currentQuestion.answers.map((answer, index) => (
                  <button
                    disabled={selectedAnswerId != null || timer === 0}
                    className={`p-4 m-2 h-20 rounded-xl ${
                      selectedAnswerId != null && selectedAnswerId === answer.id
                        ? "bg-slate-300"
                        : "bg-slate-500"
                    }`}
                    key={index}
                    onClick={() => handleAnswer(answer)}
                  >
                    <div className="flex items-center">
                      {answer.label}
                      {selectedAnswerId != null &&
                        opponentAnswered === answer.id && (
                          <img
                            src={`/images/${opponent.profilePicturePath}`}
                            alt={opponent.username}
                            className={"w-8 h-8 rounded-full ml-2"}
                          />
                        )}
                      {selectedAnswerId != null &&
                        selectedAnswerId === answer.id && (
                          <span className={"ml-4"}>
                            {answer.isCorrect ? "✅" : "❌"}
                          </span>
                        )}
                    </div>
                  </button>
                ))}
              </div>

              <p>{timer}</p>

              {selectedAnswerId != null && opponentAnswered && (
                <p>loading...</p>
              )}
            </div>
          )}
        </div>

        <div className="w-3/12">
          <ChatRoom roomId={roomId} user={user} />
        </div>
      </div>
    );
};


const QuizzEnd = ({ scores }) => {
    return (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
            <h1 style={{ textAlign: 'center', color: '#6c757d' }}>Quizz Ended</h1>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {scores.map((score, index) => (
                    <li key={index} style={{ margin: '10px 0', backgroundColor: '#a3cbf4', padding: '10px', borderRadius: '5px' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{score.username}</span> : <span>{score.score}</span>
                    </li>
                ))}
            </ul>
            <Link to={'/'}><button className={
                'bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded  w-full'

            }>Go back to Quizz selection</button></Link>

        </div>
    );
}