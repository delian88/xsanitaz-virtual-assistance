import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Message {
  sender: "You" | "Assistant";
  text?: string;
  fileUrl?: string;
  fileType?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get API URL from environment variable with local fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://xsanitaz-virtual-assistance-backend.onrender.com/api/message";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_URL}/api/message`, {
        message: input,
      });

      const assistantMessage: Message = {
        sender: "Assistant",
        text: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "Assistant", 
          text: "Sorry, I'm having trouble connecting right now. Please try again later." 
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    const userFileMessage: Message = {
      sender: "You",
      fileUrl: localUrl,
      fileType: file.type,
    };
    setMessages((prev) => [...prev, userFileMessage]);
    setIsTyping(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/api/message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const assistantMessage: Message = {
        sender: "Assistant",
        text: response.data.reply || "File received successfully!",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "Assistant", 
          text: "Sorry, file upload is currently unavailable." 
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg h-[85vh] flex flex-col">
      <h2 className="text-xl font-bold text-blue-700 mb-4">
        xSanitaz Virtual Assistant
      </h2>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "You" ? "justify-end" : "justify-start"
            } fade-slide-in`}
          >
            <div
              className={`px-4 py-2 rounded-lg text-sm max-w-xs break-words ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text && <p>{msg.text}</p>}

              {msg.fileUrl && (
                <>
                  {msg.fileType?.startsWith("image/") ? (
                    <img
                      src={msg.fileUrl}
                      alt="Uploaded"
                      className="mt-2 w-40 rounded-md"
                    />
                  ) : msg.fileType?.startsWith("audio/") ? (
                    <audio controls className="mt-2 w-48">
                      <source src={msg.fileUrl} type={msg.fileType} />
                    </audio>
                  ) : (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-100 underline mt-2 block"
                    >
                      {msg.fileUrl.split("/").pop()}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="typing-dots bg-gray-200 px-3 py-2 rounded-lg">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input and upload controls */}
      <div className="flex items-center">
        <label
          htmlFor="file-upload"
          className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md cursor-pointer hover:bg-gray-200"
        >
          📎
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;