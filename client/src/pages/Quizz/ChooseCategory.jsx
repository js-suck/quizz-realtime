import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApirUrl } from "../../helpers/getApirUrl";


export const ChooseCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
    const apiUrl = getApirUrl();


  useEffect(() => {
    // Récupérez les catégories depuis le serveur
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
  }, [apiUrl]);

  const handleCategorySelect = (category) => {
    // Naviguez vers la salle d'attente avec la catégorie sélectionnée
    navigate(`/waiting-room/${category}`);
  };

  return (
    <div className="container mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-10">
        Choisissez une catégorie
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategorySelect(category.name)}
            className="bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out text-lg font-medium"
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};