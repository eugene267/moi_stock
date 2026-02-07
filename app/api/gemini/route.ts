import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import AiButton from "@/components/AiHelp/AiButton";

interface Message {
  role: "user" | "model";
  text: string;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const systemPrompt = `
      너는 AI 주식 투자 및 분석 비서야. 
      사용자는 현재 '모의 주식 투자 사이트'를 이용 중이야.
      
      [응답 규칙]
      1. 답변은 100자 이내의 간결하고 명확한 문장으로 작성해줘.
      2. 만약 필요하다면 주식 용어(매수, 매도, 손절, 이평선 등)를 적절히 섞어 전문적으로 답변해줘.
      3. 차트 분석 방법이나 투자 전략(단타, 장기투자 등)를 묻는다면 이에 대해 친절히 설명해줘.
      4. 마크다운 형식은 사용하지 마.
    `;

    const formattedHistory = [
      {role:"user", parts: [{text: systemPrompt}]}, 
      {role:"model", parts: [{text: "확인했습니다. 주식 분석 비서로서 도와드리겠습니다."}]}, 
      ...history.map((item: Message) => ({ 
        role: item.role, 
        parts: [{ text: item.text }] 
      }))
    ];

    const genAI = new GoogleGenAI({apiKey: apiKey});
    const chat = genAI.chats.create({ model: "gemini-3-flash-preview", history: formattedHistory});
    const response = await chat.sendMessage({message: message});
    const text = response.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "답변을 생성하는 중 오류가 발생했습니다." }, { status: 500 });
  }
}