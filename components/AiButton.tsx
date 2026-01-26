"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import AiPopup from "./AiPopup";

const width: number = 100;
const height: number = 100;
const margin: number = 20;
const snap_offsetX: number = width / 2 + margin;
const snap_offsetY: number = height / 2 + margin;

const AiButton = memo(() => {
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: 10000,
    y: 10000,
  });
  const [isReturning, setIsReturning] = React.useState<boolean>(false);
  const [isLeft, setIsLeft] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const offset = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const returnTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPosition({
      x: window.innerWidth - snap_offsetX,
      y: window.innerHeight - snap_offsetY,
    });
  }, []);

  useEffect(() => {
    // 1. 위치를 업데이트하는 함수 분리
    const updatePosition = () => {
      setPosition((prev) => {
        if (isLeft) {
          return { x: snap_offsetX, y: window.innerHeight - snap_offsetY };
        } else {
          return {
            x: window.innerWidth - snap_offsetX,
            y: window.innerHeight - snap_offsetY,
          };
        }
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, [isLeft]);

  // 누르는 순간 : offset 설정, 마우스가 눌린 상태로 변경
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);

      if (returnTimer.current) {
        clearTimeout(returnTimer.current);
        returnTimer.current = null;
      }

      setIsReturning(false);

      const rect = e.currentTarget.getBoundingClientRect();
      offset.current = {
        x: e.clientX - (rect.left + rect.width / 2),
        y: e.clientY - (rect.top + rect.height / 2),
      };
    },
    [],
  );

  // 떼는 순간: 마우스가 떼어진 상태로 변경, 원위치로 이동
  // 클릭이면 팝업 열림/닫힘 토글
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsReturning(true);
      setTimeout(() => {
        setIsReturning(false);
      }, 200);

      const currentX = e.clientX - offset.current.x;

      if (isLeft && currentX <= snap_offsetX + 10) {
        setIsOpen((prev) => !prev);
      } else if (!isLeft && currentX >= window.innerWidth - snap_offsetX - 10) {
        setIsOpen((prev) => !prev);
      } else {
        setIsOpen(false);
      }

      if (currentX >= window.innerWidth / 2) {
        setIsLeft(false);
        setPosition({
          x: window.innerWidth - snap_offsetX,
          y: window.innerHeight - snap_offsetY,
        });
      } else {
        setIsLeft(true);
        setPosition({
          x: snap_offsetX,
          y: window.innerHeight - snap_offsetY,
        });
      }
    },
    [isLeft],
  );

  // 움직이는 순간 : mouse가 눌린 상태가 아니면 알 바 아님
  // 위치 변경, 팝업 닫기
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!(e.buttons & 1)) return;

      const currentX = e.clientX - offset.current.x;
      const currentY = e.clientY - offset.current.y;

      setPosition({
        x: currentX,
        y: currentY,
      });

      if (isLeft && currentX > snap_offsetX + 10) {
        setIsOpen(false);
      } else if (!isLeft && currentX < window.innerWidth - snap_offsetX - 10) {
        setIsOpen(false);
      }
    },
    [isLeft],
  );

  return (
    <div
      style={{
        backgroundColor: "#007bff",
        position: "fixed",
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
        transition: isReturning ? "transform 0.2s ease-in-out" : "none",
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: "50%",
        boxShadow: "inset 0 0 20px rgba(18, 2, 95, 1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "30px",
        cursor: "pointer",
        zIndex: 1000,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <AiPopup isOpen={isOpen} isLeft={isLeft}></AiPopup>
      🤖
    </div>
  );
});

AiButton.displayName = "AiButton";

export default AiButton;
