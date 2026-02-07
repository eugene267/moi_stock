"use client";

import { use, useEffect, useState } from "react";
import styles from "./OrderPanel.module.css";
import { createClient } from "@/utils/supabase/client";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

interface OrderPanelProps {
  selectedStockCode: string;
}

const supabase = createClient();

export default function OrderPanel({ selectedStockCode }: OrderPanelProps) {
  const [user, setUser] = useState<User | any>(null);
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  const currentPrice = 72000;
  const totalOrderPrice = quantity * currentPrice;

  useEffect(() => {
    const fetchBalance = async (userId: string) => {
      const { data } = await supabase
        .from("accounts")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setBalance(data.balance);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        const currentUser = session?.user;

        if (currentUser) {
          await fetchBalance(currentUser.id);
          setUser(currentUser);
        } else {
          setBalance(0);
          setUser(null);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleOrder = () => {
    if (!user) return;
    if (quantity <= 0) return;

    if (orderType === "buy" && totalOrderPrice > balance) {
      alert("예수금이 부족합니다!");
      return;
    }
    alert(
      `${selectedStockCode} 종목을 ${quantity}주 ${orderType === "buy" ? "매수" : "매도"}합니다.`,
    );
    setQuantity(0);
  };

  return (
    <div className={`${styles.container} ${!user ? styles.blurContent : ""}`}>
      <div className={styles.tabGroup}>
        <button
          className={`${styles.tab} ${orderType === "buy" ? styles.activeBuy : ""}`}
          onClick={() => setOrderType("buy")}
        >
          매수
        </button>
        <button
          className={`${styles.tab} ${orderType === "sell" ? styles.activeSell : ""}`}
          onClick={() => setOrderType("sell")}
        >
          매도
        </button>
      </div>
      <div className={styles.infoRow}>
        <span>주문가능</span>
        <span className={styles.balanceText}>{balance.toLocaleString()}원</span>
      </div>

      <div className={styles.infoRow}>
        <span>현재가</span>
        <span className={styles.currentPriceText}>
          {currentPrice.toLocaleString()}원
        </span>
      </div>

      <div className={styles.inputGroup}>
        <label>수량</label>
        <div className={styles.inputWrapper}>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => setQuantity(Math.max(0, quantity - 1))}
          >
            -
          </button>

          <input
            type="number"
            className={styles.quantityInput}
            value={quantity === 0 ? "" : quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="0"
            min="0"
          />

          <button
            type="button"
            className={styles.stepBtn}
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.totalRow}>
          <span>주문금액</span>
          <span className={styles.totalPrice}>
            {totalOrderPrice.toLocaleString()}원
          </span>
        </div>

        <button
          className={orderType === "buy" ? styles.buyBtn : styles.sellBtn}
          onClick={handleOrder}
        >
          {orderType === "buy" ? "매수주문" : "매도주문"}
        </button>
      </div>
    </div>
  );
}
