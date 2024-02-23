import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import {ChooseCategory} from "./pages/Quizz/ChooseCategory";
import {WaitingRoom} from "./pages/Quizz/WaitingRoom";
import {QuizzGame} from "./pages/Quizz/QuizzGame";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h2>RealTime Quizz</h2>
                </header>

                <Routes>
                    <Route path="/choose-category" element={<ChooseCategory />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/waiting-room/:category" element={<WaitingRoom />} />
                    <Route path="/quizz-game/:category/:roomId" element={<QuizzGame />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;