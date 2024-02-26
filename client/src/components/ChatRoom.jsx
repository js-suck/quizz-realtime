import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "../assets/chat.css";
const { socket } = require("../socket");

export const ChatRoom = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomId } = useParams();

  useEffect(() => {
    socket.on("receive message room", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.sender !== user.username) {
      }
    });

    return () => {
      socket.off("receive message room");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      const messageData = {
        text: message, // Le contenu du message
        sender: user.username, // Remplacez par le nom de l'expéditeur actuel
      };
      socket.emit("send message room", { roomId, message: messageData });
      setMessage("");
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender}:</strong> {msg.text}
            </li>
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

