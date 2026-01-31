"use client";

import { memo, useMemo } from "react";
import styles from "./Title.module.css";
import { STOCK_MAP } from "@/lib/constants";

const Title = memo(
  ({
    selectedStockCode,
    isLoading,
  }: {
    selectedStockCode: string;
    isLoading: boolean;
  }) => {
    // 로딩 중이거나 종목명이 변경될 때 타이틀 텍스트 변경
    const titleText = useMemo(() => {
      if (isLoading)
        return (
          <span className={styles.loadingIndicator}>데이터 가져오는 중...</span>
        );

      return `${STOCK_MAP[selectedStockCode]} (${selectedStockCode})`;
    }, [selectedStockCode, isLoading]);

    return <h1 className={styles.title}>{titleText}</h1>;
  },
);

Title.displayName = "Title";
export default Title;
