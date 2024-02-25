import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className=" text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-blue-200">
              Accueil
            </Link>
          </li>
          <li>
            <Link to="/choose-category" className="hover:text-blue-200">
              Choisir Catégorie
            </Link>
          </li>
          <li>
            <Link to="/chat" className="hover:text-blue-200">
              Chat
            </Link>
          </li>
          <li>
            <Link to="/question-form" className="hover:text-blue-200">
              Formulaire de Question
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

