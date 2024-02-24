import React from "react";

const QuestionForm = ({ question, updateQuestion }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateQuestion(question.id, { ...question, [name]: value });
  };

  const addAnswer = () => {
    const newAnswer = { id: question.answers.length, text: "" };
    const updatedAnswers = [...question.answers, newAnswer];
    updateQuestion(question.id, { ...question, answers: updatedAnswers });
  };

  const updateAnswer = (id, text) => {
    const updatedAnswers = question.answers.map((ans) =>
      ans.id === id ? { ...ans, text } : ans
    );
    updateQuestion(question.id, { ...question, answers: updatedAnswers });
  };

  const handleCorrectAnswerChange = (e) => {
    updateQuestion(question.id, { ...question, correctAnswer: e.target.value });
  };

  return (
    <div>
      <input
        type="text"
        name="questionText"
        value={question.questionText}
        onChange={handleChange}
        placeholder="Entrez le texte de la question"
      />
      {question.answers.map((answer, index) => (
        <div key={index}>
          <input
            type="text"
            value={answer.text}
            onChange={(e) => updateAnswer(answer.id, e.target.value)}
            placeholder="Entrez le texte de la réponse"
          />
          <input
            type="radio"
            name={`correctAnswer-${question.id}`}
            value={answer.id}
            checked={question.correctAnswer === answer.id.toString()}
            onChange={handleCorrectAnswerChange}
          />
        </div>
      ))}
      <button type="button" onClick={addAnswer}>
        Ajouter une réponse
      </button>
    </div>
  );
};

export default QuestionForm;
