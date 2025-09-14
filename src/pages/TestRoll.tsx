import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface SpinGameProps {
  campaignId?: string;
  fullHeight?: boolean;
}

export default function SpinGame({
  campaignId,
  fullHeight = true,
}: SpinGameProps) {
  const activeCampaignId = campaignId || "taiwan-lcp";

  const [digits, setDigits] = useState<number[]>(Array(10).fill(0));
  const [spinning, setSpinning] = useState(false);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const socketRef = useRef<any | null>(null);

  useEffect(() => {
    const socket = io("https://sk.dudoanchungketlcp-tta.vn", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join", { campaignId: activeCampaignId });

    const startSpin = () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];

      setSpinning(true);
      setFinalResult(null);

      spinIntervalRef.current = setInterval(() => {
        setDigits(
          Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
        );
      }, 80);
    };

    const stopSpin = (payload: any) => {
      const resultRaw = payload?.result ?? payload;
      const resultStr = String(resultRaw ?? "")
        .padStart(10, "0")
        .slice(0, 10);

      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }

      setSpinning(false);
      setFinalResult(resultStr);

      const steps = 10;
      for (let i = 0; i < steps; i++) {
        const t = setTimeout(() => {
          if (i < steps - 1) {
            setDigits(
              Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
            );
          } else {
            setDigits(
              resultStr.split("").map((c) => {
                const n = Number(c);
                return Number.isNaN(n) ? 0 : n;
              })
            );
          }
        }, 120 + i * 120);
        stopTimeoutsRef.current.push(t);
      }
    };

    socket.on("start-spin", (p: any) => {
      if (p?.campaignId && p.campaignId !== activeCampaignId) return;
      startSpin();
    });

    socket.on("stop-spin", (p: any) => {
      if (p?.campaignId && p.campaignId !== activeCampaignId) return;
      stopSpin(p);
    });

    return () => {
      socket.off("start-spin");
      socket.off("stop-spin");
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeCampaignId]);

  return (
    <div
      style={{
        minHeight: fullHeight ? "100vh" : "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: 32 }}>
        🎰 Quay số trúng thưởng
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          fontFamily: "monospace",
          fontSize: "3rem",
          letterSpacing: "6px",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {digits.map((d, i) => (
          <span
            key={i}
            style={{
              width: 40,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            {d}
          </span>
        ))}
      </div>

      {finalResult && (
        <p
          style={{
            marginTop: 12,
            color: "#16a34a",
            fontWeight: "bold",
            fontSize: "1.25rem",
          }}
        >
          📞 Kết quả: {finalResult}
        </p>
      )}

      {spinning && <p style={{ color: "#ef4444", marginTop: 8 }}>Đang quay…</p>}
    </div>
  );
}
