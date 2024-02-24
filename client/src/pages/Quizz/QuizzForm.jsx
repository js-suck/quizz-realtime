import React, { useState } from "react";
import QuestionForm from "./QuestionForm"; // Nous allons définir ce composant ci-dessous

const QuizzForm = () => {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length,
      questionText: "",
      answers: [],
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, updatedQuestion) => {
    setQuestions(questions.map((q) => (q.id === id ? updatedQuestion : q)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez gérer la soumission de votre quiz
    // Par exemple, envoyer les questions au serveur ou les stocker localement
    console.log("Quiz soumis:", questions);
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <QuestionForm
          key={index}
          question={question}
          updateQuestion={updateQuestion}
        />
      ))}
      <button type="button" onClick={addQuestion}>
        Ajouter une question
      </button>
      <button type="submit">Soumettre le Quiz</button>
    </form>
  );
};

export default QuizzForm;
