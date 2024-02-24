import React, { useState, useEffect } from "react";
import "../assets/chat.css";
const { socket } = require("../socket");


const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive message");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      console.log("message", message);
      socket.emit("send message", { message });
      setMessage("");
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.message}</li>
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
