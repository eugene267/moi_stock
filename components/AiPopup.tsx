"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import styles from "./AiPopup.module.css";

interface AiPopupProps {
  isOpen: boolean;
  isLeft: boolean;
}

interface Message {
  role: "user" | "model";
  text: string;
}

const AiPopup = memo(({ isOpen, isLeft }: AiPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "무엇을 도와드릴까요?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (inputText.trim() === "") return;
    console.log("Sending message:", inputText);

    const newUserMessage: Message = { role: "user", text: inputText };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();
      const newModelMessage: Message = { role: "model", text: data.text };
      setMessages((prev) => [...prev, newModelMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  return (
    <div
      className={styles.popupContainer}
      style={{
        right: isLeft ? "auto" : "0px",
        left: isLeft ? "0px" : "auto",
        transform: isOpen ? "scale(1, 1)" : "scale(1, 0)",
        opacity: isOpen ? 1 : 0,
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
    >
      <div className={styles.messageContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user" ? styles.userMessage : styles.modelMessage
            }
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className={styles.modelMessage}>답변을 생성 중입니다...</div>
        )}
      </div>

      <div className={styles.inputContainer}>
        <input
          className={styles.inputField}
          type="text"
          placeholder="메세지를 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          전송
        </button>
      </div>
    </div>
  );
});

AiPopup.displayName = "AiPopup";

export default AiPopup;
