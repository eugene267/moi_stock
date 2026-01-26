"use client";

import React, { memo, useCallback, useEffect } from "react";

interface AiPopupProps {
  isOpen: boolean;
  isLeft: boolean;
}

const AiPopup = memo(({ isOpen, isLeft }: AiPopupProps) => {
  return (
    <div
      style={{
        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
        transform: isOpen ? "scale(1, 1)" : "scale(1, 0)",
        opacity: isOpen ? 1 : 0,
        transformOrigin: "bottom",
        position: "absolute",
        bottom: "110px",
        right: isLeft ? "auto" : "0px",
        left: isLeft ? "0px" : "auto",
        width: "300px",
        height: "400px",
        backgroundColor: "white",
        border: "1px solid #000000",
        borderRadius: "8px",
        zIndex: 1000,
      }}
    >
      <iframe
        src="https://chat.openai.com/chat"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="AI Chat"
      ></iframe>
    </div>
  );
});

AiPopup.displayName = "AiPopup";

export default AiPopup;
