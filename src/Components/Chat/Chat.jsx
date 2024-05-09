import React, { useRef, useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";

function Chat() {
  const messageref = useRef();
  const token = localStorage.getItem("userid");
  const [latestMessages, setLatestMessages] = useState([]);

  //const [latestMessages, setLatestMessages] = useState([]);

  // async function fetchData() {
  //   try {
  //     const response = await axios.get("http://localhost:3000/showchatdata");
  //     setLatestMessages(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // }

  async function fetchData() {
    try {
      // Get the latest message ID from local storage
      const latestMessageId =
        parseInt(localStorage.getItem("latestMessageId")) || 0;

      const chats = JSON.parse(localStorage.getItem("messages")) || [];

      // Fetch messages from backend with IDs greater than the latestMessageId
      const response = await axios.get(
        `http://localhost:3000/showchatdata?latestmessageId=${latestMessageId}`
      );
      const messages = response.data;

      //console.log(messages)
      // Update local storage with new messages
      if (!chats.length) {
        localStorage.setItem("messages", JSON.stringify(messages));
        setLatestMessages(messages);

        // Update the latestMessageId in local storage
        const newLatestMessageId = messages[messages.length - 1].id;
        localStorage.setItem("latestMessageId", newLatestMessageId);
      } else {
        const updatedmessages = [...chats, ...messages];
        localStorage.setItem("messages", JSON.stringify(updatedmessages));
        setLatestMessages(updatedmessages);

        const message = JSON.parse(localStorage.getItem("messages"));
        // Update the latestMessageId in local storage
        const newLatestMessageId = message[message.length - 1].id;
        localStorage.setItem("latestMessageId", newLatestMessageId);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  function dataHandler(e) {
    e.preventDefault();
    const data = {
      message: messageref.current.value,
    };
    console.log(data);

    axios
      .post("http://localhost:3000/sendchat", data, {
        headers: { Authorization: token },
      })
      .then(() => {
        alert("Data sent to database");
        fetchData();
        messageref.current.value = "";
      })
      .catch((err) => {
        console.error("Error sending data:", err);
      });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-center text-3xl">Chat App</h1>
      <div className="flex-grow">
        {latestMessages.length > 0 &&
          latestMessages.map((result, index) => (
            <div key={index}>{result.message}</div>
          ))}
      </div>
      <div className="bg-cyan-400 px-4 py-5 border-2 flex justify-center items-center">
        <form className="flex" onSubmit={dataHandler}>
          <input
            type="text"
            ref={messageref}
            className="border-2 border-slate-800 mr-2"
          />
          <button type="submit" className="bg-zinc-400 px-5 py-1">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
