"use client";

import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createChart,
  CandlestickSeries,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import styles from "./page.module.css";
import StockButton from "@/components/StockButton";

const stockMap: { [key: string]: string } = {
  "005930": "삼성전자",
  "000660": "SK하이닉스",
  "035420": "NAVER",
  "051910": "LG화학",
  "207940": "삼성바이오로직스",
};

export default function Home() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const seriesInstance = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [selectedStockCode, setSelectedStockCode] = useState<string>("005930");
  const [isLoading, setIsLoading] = useState(false);

  // 최초 차트 구성
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. 차트 생성
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#131722" }, textColor: "#d1d4dc" },
      grid: {
        vertLines: { color: "#2b2b43" },
        horzLines: { color: "#2b2b43" },
      },
    });
    chartInstance.current = chart;

    // 2. 시리즈 생성
    seriesInstance.current = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
    });

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth || 800,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // 종목 변경될 때마다 데이터 가져오기
  useEffect(() => {
    if (!seriesInstance.current || !chartInstance.current) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/stock?code=${selectedStockCode}`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          seriesInstance.current?.setData(data);
          chartInstance.current?.timeScale().fitContent();
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStockCode]);

  // 선택 종목이 변경될 때마다 버튼 렌더링
  const stockButtons = useMemo(() => {
    return Object.entries(stockMap).map(([code, name]) => (
      <StockButton // 종목 버튼 컴포넌트는 react.memo를 활용하여 props 변경 시에만 리렌더링
        key={code}
        code={code}
        name={name}
        isActive={selectedStockCode === code}
        onSelect={() => setSelectedStockCode(code)} // useCallback으로 handleSelect 메모이제이션
      />
    ));
  }, [selectedStockCode]);

  // 로딩 중이거나 종목명이 변경될 때 타이틀 텍스트 변경
  const titleText = useMemo(() => {
    if (isLoading)
      return (
        <span className={styles.loadingIndicator}>데이터 가져오는 중...</span>
      );

    return `${stockMap[selectedStockCode]} (${selectedStockCode})`;
  }, [selectedStockCode, isLoading]);

  //html 렌더링
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>{titleText}</h1>

      <div
        className={`
          ${styles.buttonGroup} 
          ${isLoading ? styles.loadingButtonGroup : ""}
        `}
      >
        {stockButtons} {/* useMemo 필요한지 확인하기 */}
      </div>

      <div ref={chartContainerRef} className={styles.chartWrapper} />
    </div>
  );
}
