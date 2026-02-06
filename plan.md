# 1. 프로젝트 개요

## 1.1. 주제

모의 주식 훈련 - 웹사이트 내부에서 실제 종목을 바탕으로 모의 계좌를 운용

## 1.2. 핵심 가치

주식에 대한 인사이트 제공

# 2. 주요 기능

## 2.1. 본인 계좌 관리

로그인 후 본인 계좌에 접근 가능
본인 계좌의 잔고, 보유 주식 현황 등을 확인 가능

## 2.2. 주식 매매 기능

실제 주식 데이터를 바탕으로 본인 계좌에서 주식을 사고 팔 수 있음

# 3. 기술 스택

## 3.1. 프론트엔드

- 프레임워크 : next.js
- 언어 : typescript
- 스타일링 : CSS module

## 3.2. DB & Server

- 온프레미스 DB : postgreSQL
- 클라우드 DB : Supabase
- 서버 : next.js api routes

## 3.3. 인증 방식

- Google oauth

## 3.4. 외부 API

- 주식 차트 : 키움 API

<br><br>

# 4. 주차별 계획

## 4.1. 1주차 (~01/13)

- 프로젝트 계획 수립
- 프론트엔드 기본 틀 구축
- 주식 차트 API 연동

## 4.2. 2주차 (~01/20)

- DB 구축 및 데이터 모델링

## 4.3. 3주차 (~01/27)

- Google oauth 인증 및 데이터 매핑 구현
- 계좌 조회 기능 구현

## 4.4. 4주차 (~02/03)

- 계좌 관리 기능 구현
- 주식 매매 기능 구현
- UI/UX 개선
- 최종 테스트 및 디버깅

# tip

계산량이 많지 않은 것은 굳이 hook써서 줄 늘리지 말기

컴포넌트를 할 때 : 재사용성이 높은가?

origin : github에 올릴 때 (로컬 관련 명령어는 안 씀)

의존성 배열은 다 넣기

# 질문

# DB 스키마

## Cloud (Supabase)

A. users (사용자 정보)
id: uuid (PK, Supabase Auth 연동)

email: text (Google OAuth 계정 이메일)

created_at: timestamp

B. accounts (계좌 요약)
id: uuid (PK)

user_id: uuid (FK -> users.id)

balance: numeric (현재 주문 가능 현금)

total_evaluation: numeric (총 자산 평가액)

updated_at: timestamp

C. holdings (보유 종목 현황)
id: uuid (PK)

account_id: uuid (FK -> accounts.id)

stock_code: text (종목코드)

stock_name: text (종목명)

quantity: integer (보유 수량)

avg_buy_price: numeric (평단가)

제약 조건: UNIQUE(account_id, stock_code) (한 계좌 내 종목 중복 방지)

## On-Premise (PostgreSQL)

D. local_transactions (상세 매매 로그)
id: bigint (PK)

order_id: text (어떤 주문에 의한 체결인지 기록)

user_id: uuid

stock_code: text

side: text (BUY / SELL)

price: numeric (체결가)

quantity: integer (체결 수량)

executed_at: timestamp
