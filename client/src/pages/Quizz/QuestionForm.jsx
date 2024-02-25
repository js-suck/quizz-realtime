import React, { useState, useEffect } from "react";
import { getApirUrl } from "../../helpers/getApirUrl";

export const QuestionForm = () => {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState([
    { id: 0, text: "", isCorrect: false },
  ]);
  const apiUrl = getApirUrl();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Note: l'URL est supposée être /categories pour récupérer toutes les catégories
    fetch(`${apiUrl}/category`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Erreur réseau lors de la récupération des catégories."
          );
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data); // Stocke les catégories récupérées dans l'état
      })
      .catch((error) => {
        console.error("Erreur de chargement des catégories:", error);
      });
  }, [apiUrl]); // Dépendance à apiUrl pour recharger si l'URL change

  const addAnswer = () => {
    const newAnswer = { id: answers.length, text: "", isCorrect: false };
    setAnswers([...answers, newAnswer]);
  };

  const updateAnswerText = (id, text) => {
    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? { ...ans, text } : ans
    );
    setAnswers(updatedAnswers);
  };

  const setCorrectAnswer = (id) => {
    const updatedAnswers = answers.map((ans) =>
      ans.id === id ? { ...ans, isCorrect: true } : { ...ans, isCorrect: false }
    );
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedQuestion = {
      label: questionText,
      answers: answers.map((ans) => ({
        label: ans.text,
        isCorrect: ans.isCorrect,
      })),
      categoryId: category,
    };

    try {
      const response = await fetch(`${apiUrl}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedQuestion),
      });

      if (!response.ok) {
        throw new Error("Erreur réseau ou du serveur");
      }

      const responseData = await response.json();
      console.log("Question soumise avec succès:", responseData);
      // Réinitialiser le formulaire
      setQuestionText("");
      setAnswers([{ id: 0, text: "", isCorrect: false }]);
      setCategory("");
    } catch (error) {
      console.error("Erreur lors de la soumission de la question:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 shadow-md rounded-lg"
    >
      <div className="mb-4">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Entrez le texte de la question"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {answers.map((answer, index) => (
        <div key={index} className="mb-2 flex items-center space-x-2">
          <input
            type="text"
            value={answer.text}
            onChange={(e) => updateAnswerText(answer.id, e.target.value)}
            placeholder="Entrez le texte de la réponse"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="radio"
            name="correctAnswer"
            checked={answer.isCorrect}
            onChange={() => setCorrectAnswer(answer.id)}
            className="form-radio"
          />
          <label className="text-gray-700">Correcte</label>
        </div>
      ))}

      <div className="mb-4">
        <button
          type="button"
          onClick={addAnswer}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
          Ajouter une réponse
        </button>
      </div>

      <div className="mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionnez une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition duration-300"
        >
          Envoyer la Question
        </button>
      </div>
    </form>
  );
};
