import React from "react";
import '../styles/lottery.css'

const Lottery: React.FC = () => {
  const [result, setResult] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      // Demo: giả lập API
      const res = await fetch("https://api.example.com/lottery/latest");
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      setResult(data.number ?? JSON.stringify(data));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="lottery">
      <h1>Kết quả quay số</h1>
      <p>Nhấn nút để tải kết quả mới nhất.</p>
      <button className="btn" onClick={fetchResult} disabled={loading}>
        {loading ? "Đang tải..." : "Tải kết quả"}
      </button>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result">
          <strong>Kết quả:</strong> {result}
        </div>
      )}
    </section>
  );
};

export default Lottery;
