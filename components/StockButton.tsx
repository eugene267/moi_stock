"use client";

import React, { memo } from "react";
import styles from "../app/page.module.css";

interface StockButtonProps {
  code: string;
  name: string;
  isActive: boolean;
  onSelect: (code: string) => void;
}

// React.memo로 감싸서 props가 안 변하면 안 그려지게 설정
const StockButton = memo(
  ({ code, name, isActive, onSelect }: StockButtonProps) => {
    return (
      <button
        className={`
        ${styles.stockButton} 
        ${isActive ? styles.activeButton : ""}
      `}
        onClick={() => onSelect(code)}
      >
        {name}
      </button>
    );
  }
);

StockButton.displayName = "StockButton";

export default StockButton;
