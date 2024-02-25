import React from "react";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Chat from "./components/Chat";
import {ChooseCategory} from "./pages/Quizz/ChooseCategory";
import {WaitingRoom} from "./pages/Quizz/WaitingRoom";
import {QuizzGame} from "./pages/Quizz/QuizzGame";
import {QuizProvider} from "./hooks/useQuizzContext";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">

        <QuizProvider>

          <Routes>
          <Route path="/choose-category" element={<ChooseCategory />} />
            <Route path="/" element={<ChooseCategory />} />
            <Route path="/chat" element={<Chat />} />
          <Route path="/waiting-room/:category" element={<WaitingRoom />} />
          <Route path="/quizz-game/:category/:roomId" element={<QuizzGame />} />
        </Routes>
        </QuizProvider>

      </div>
    </Router>
  );
}

export default App;