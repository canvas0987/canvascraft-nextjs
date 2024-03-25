"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const prevPoint = useRef<{ x: number; y: number } | null>(null);

  const [mouseDown, setMouseDown] = useState(false);

  const draw = ({ ctx, currentPosition, prevPosition }: any) => {
    const { x: currX, y: currY } = currentPosition;

    const startPosition = prevPosition ?? currentPosition;
    ctx?.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(currX, currY);

    ctx.stroke();

    ctx.fillStyle = "#000";
    ctx.arc(startPosition.x, startPosition.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;
      console.log("draw");
      const currentPosition = getCurrentPosition(e);
      const ctx = canvasRef?.current?.getContext("2d");

      if (!ctx || !currentPosition) return;
      draw({ ctx, currentPosition, prevPosition: prevPoint?.current });
      prevPoint.current = currentPosition;
    };

    const getCurrentPosition = (e: MouseEvent) => {
      const canvas = canvasRef?.current;
      if (!canvas) return;

      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const handleMouseUp = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };
    canvasRef?.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvasRef?.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseDown]);

  console.log(mouseDown, "popp");

  return (
    <>
      <canvas
        onMouseDown={() => setMouseDown(true)}
        ref={canvasRef}
        width={500}
        height={500}
        className="bg-white border border-white"></canvas>
    </>
  );
}
