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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        placeholder="Entrez le texte de la question"
      />
      {answers.map((answer, index) => (
        <div key={index}>
          <input
            type="text"
            value={answer.text}
            onChange={(e) => updateAnswerText(answer.id, e.target.value)}
            placeholder="Entrez le texte de la réponse"
          />
          <input
            type="radio"
            name="correctAnswer"
            checked={answer.isCorrect}
            onChange={() => setCorrectAnswer(answer.id)}
          />
          <label>Correcte</label>
        </div>
      ))}
      <button type="button" onClick={addAnswer}>
        Ajouter une réponse
      </button>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Sélectionnez une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button type="submit">Envoyer la Question</button>
    </form>
  );
};
