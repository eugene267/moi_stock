"use client";

import {
  CandlestickSeries,
  createChart,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { memo, use, useEffect, useMemo, useRef } from "react";
import styles from "./StockChart.module.css";

const StockChart = memo(
  ({
    selectedStockCode,
    isLoading,
    stockData,
  }: {
    selectedStockCode: string;
    isLoading: boolean;
    stockData: any[];
  }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<IChartApi | null>(null);
    const seriesInstance = useRef<ISeriesApi<"Candlestick"> | null>(null);
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

    useEffect(() => {
      if (!seriesInstance.current || !chartInstance.current) return;
      seriesInstance.current?.setData(stockData);
      chartInstance.current?.timeScale().fitContent();
    }, [stockData]);

    return <div ref={chartContainerRef} className={styles.chartWrapper} />;
  },
);

StockChart.displayName = "StockChart";

export default StockChart;
