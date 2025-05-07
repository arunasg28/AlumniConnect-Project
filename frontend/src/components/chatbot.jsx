import { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { FaRobot, FaUser } from "react-icons/fa"; // Importing user & bot icons
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
const Chatbot = ({ designation }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await axiosInstance.post("/chatbot", { message: input });
    const botMsg = { role: "bot", text: res.data.reply };
    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (designation !== "Faculty") {
    return (
      <p className="text-center mt-10 text-red-500 font-bold">
        Access only for Faculty users.
      </p>
    );
  }

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className=' grid grid-cols-1 lg:grid-cols-4 gap-6'>
          <div className='hidden lg:block lg:col-span-1'>
            <Sidebar user={authUser} />
          </div>

          <div className="col-span-1 lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        🎓 Student Info Chatbot
      </h2>

      <div className="h-80 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-center gap-2 rounded-lg px-4 py-2 max-w-xs text-sm ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}>
              {msg.role === "user" ? (
                <>
                  <FaUser />
                  <span>{msg.text}</span>
                </>
              ) : (
                <>
                  <FaRobot className="text-purple-600" />
                  {/* Render the reply with line breaks */}
                  <div className="whitespace-pre-wrap">
                    {msg.text.split("\n").map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask about student..."
          className="input input-bordered w-full text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary text-white"
        >
          Send
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Chatbot;
