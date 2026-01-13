import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { KiwoomPriceItem, ChartData } from '@/types/stock';

const APP_KEY = process.env.KIWOOM_APP_KEY;
const SECRET_KEY = process.env.KIWOOM_SECRET_KEY;
const BASE_URL = "https://mockapi.kiwoom.com"; 

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code') || "005930"; 

    const today = new Date();
    const baseDate = today.toISOString().slice(0, 10).replace(/-/g, "");

    // 토큰 발급
    const tokenResponse = await axios.post(`${BASE_URL}/oauth2/token`, {
      grant_type: 'client_credentials',
      appkey: APP_KEY,
      secretkey: SECRET_KEY,
    });
    
    const accessToken = tokenResponse.data.token; 

    // 주가 차트 데이터 요청
    const priceResponse = await axios.post(`${BASE_URL}/api/dostk/chart`, 
      {
        stk_cd: code,       // 종목코드
        base_dt: baseDate,  // 기준일자
        upd_stkpc_tp: "1"   // 수정주가 적용
      },
      {
        headers: {
          'authorization': `Bearer ${accessToken}`,
          'appkey': APP_KEY,
          'appsecret': SECRET_KEY,
          'api-id': 'ka10081', 
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    );
    const rawData = priceResponse.data.stk_dt_pole_chart_qry;

    if (!rawData || !Array.isArray(rawData)) {
      throw new Error("데이터 형식이 올바르지 않습니다.");
    }
    
    // 데이터 가공
    const chartData: ChartData[] = rawData.map((item: KiwoomPriceItem) => ({
      time: `${item.dt.slice(0, 4)}-${item.dt.slice(4, 6)}-${item.dt.slice(6, 8)}`, 
      open: parseInt(item.open_pric),  // 시가
      high: parseInt(item.high_pric),  // 고가
      low:  parseInt(item.low_pric),   // 저가
      close: parseInt(item.cur_prc),   // 현재가(종가)
    }));

    chartData.sort((a, b) => (a.time > b.time ? 1 : -1));

    // 반환
    return NextResponse.json(chartData);

  } catch (error: any) {
    console.error("API Error 상세:", error.response?.data || error.message);
    
    // 에러 났을 때 임시 데이터
    const fallbackData: ChartData[] = [{ time: '2025-01-01', open: 50000, high: 51000, low: 49000, close: 50500 }]
    return NextResponse.json(fallbackData);
  }
}