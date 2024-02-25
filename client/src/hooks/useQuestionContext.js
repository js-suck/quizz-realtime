import { createContext, useCallback, useContext, useState } from "react";
import { fetchApi } from "../helpers/fetchApi";
import { getApiUrl } from "../helpers/getApiUrl";

const QuestionsContext = createContext();

export const useQuestions = () => {
  const [error, setError] = useState(null);
  const apiUrl = getApiUrl();
  const [questions, setQuestions] = useState([]);

  const getQuestions = useCallback(
    async (category) => {
      return fetchApi(`${apiUrl}/questions/${category}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
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
    getQuestions,
    questions,
    setQuestions,
  };
};

export const QuestionsProvider = ({ children }) => {
  const questions = useQuestions();

  return (
    <QuestionsContext.Provider value={questions}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestionsContext = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error(
      "useQuestionsContext must be used within a QuestionsProvider"
    );
  }
  return context;
};
