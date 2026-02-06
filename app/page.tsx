"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import AiButton from "@/components/AiButton";
import StockChart from "@/components/StockChart";
import Title from "@/components/Title";
import StockSelector from "@/components/StockSelector";
import OrderPanel from "@/components/order/OrderPanel";

export default function Home() {
  const [selectedStockCode, setSelectedStockCode] = useState<string>("005930");
  const [isLoading, setIsLoading] = useState(false);
  const [stockData, setStockData] = useState<any[]>([]);

  const handleSelectStock = useCallback((code: string) => {
    setSelectedStockCode(code);
  }, []);

  // 종목 변경될 때마다 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/stock?code=${selectedStockCode}`,
        );
        const data = response.data;

        if (Array.isArray(data)) {
          setStockData(data);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStockCode]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.layout}>
        <div>
          <h1>주식 보유량</h1>
        </div>

        <div className={styles.chartContainer}>
          <Title
            selectedStockCode={selectedStockCode}
            isLoading={isLoading}
          ></Title>

          <StockSelector
            selectedStockCode={selectedStockCode}
            isLoading={isLoading}
            onSelect={handleSelectStock}
          ></StockSelector>

          <StockChart
            selectedStockCode={selectedStockCode}
            isLoading={isLoading}
            stockData={stockData}
          ></StockChart>

          <AiButton></AiButton>
        </div>

        <OrderPanel selectedStockCode={selectedStockCode}></OrderPanel>
      </div>
    </div>
  );
}
