"use client";

import { on } from "events";
import { memo, useMemo } from "react";
import styles from "./StockSelector.module.css";
import StockButton from "./StockButton";
import { STOCK_MAP } from "@/lib/constants";

const StockSelector = memo(
  ({
    selectedStockCode,
    isLoading,
    onSelect,
  }: {
    selectedStockCode: string;
    isLoading: boolean;
    onSelect: (code: string) => void;
  }) => {
    return (
      <div
        className={`
          ${styles.buttonGroup} 
          ${isLoading ? styles.loadingButtonGroup : ""}
        `}
      >
        {Object.entries(STOCK_MAP).map(([code, name]) => (
          <StockButton
            key={code}
            code={code}
            name={name}
            isActive={selectedStockCode === code}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  },
);

StockSelector.displayName = "StockSelector";
export default StockSelector;
