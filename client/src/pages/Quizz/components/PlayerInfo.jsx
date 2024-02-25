import React from "react";

export const PlayerInfo = ({ profilePicturePath, username, score }) => {
    return (
        <div className="flex items-center space-x-4">
            <img src={`/images/${profilePicturePath}`} alt={username} className="w-16 h-16 rounded-full" />
            <div>
                <h2 className="text-xl font-bold">{username}</h2>
                <p>Score: {score}</p>
            </div>
        </div>
    );
};
