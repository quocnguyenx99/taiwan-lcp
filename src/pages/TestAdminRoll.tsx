import React, { useState } from "react";
import TestRoll from "./TestRoll";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const apiUrl =
    "https://be.dudoanchungketlcp-tta.vn/api/prize/spin-member?id=1";

  const handleSpin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTkyLjE2OC4yNDUuMTc0OjgwMzAvYXBpL2FkbWluL2xvZ2luIiwiaWF0IjoxNzU3NjkzODUwLCJleHAiOjE3NTgyOTg2NTAsIm5iZiI6MTc1NzY5Mzg1MCwianRpIjoibjYxTjZFNHY5S3V1SUlCSyIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.Mb9guV-Q-_P1RKtWsTQJ7nxVNBqdxkygrhWOhphNTDY",
        },
      });
      const data = await res.json();
      setMessage(data.message || "Đã gửi yêu cầu quay số!");
    } catch (err) {
      setMessage("Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
      }}
    >
      <TestRoll fullHeight={false} />
      <button
        onClick={handleSpin}
        disabled={loading}
        style={{
          marginTop: 48,
          width: 320,
          height: 80,
          fontSize: "2.2rem",
          fontWeight: "bold",
          borderRadius: "18px",
          background: "#22c55e",
          color: "#fff",
          border: "none",
          boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: 2,
        }}
      >
        {loading ? "Đang gửi..." : "QUAY SỐ"}
      </button>
      {message && (
        <p
          style={{
            marginTop: 32,
            fontSize: "1.3rem",
            color: "#0d9488",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
