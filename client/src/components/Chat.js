import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "../assets/chat.css";

const socket = io("http://localhost:3001"); // Assurez-vous que l'adresse correspond à celle de votre serveur

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <div className="champ">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default Chat;
