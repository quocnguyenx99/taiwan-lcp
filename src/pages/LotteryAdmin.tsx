import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import lcpIcon from "../assets/lcpIcon.png";
import "../styles/lottery.css";

import groupPrize1 from "../assets/groupPrize1.png";
import boardPrize1 from "../assets/boardPrize1.png";
import groupPrize2 from "../assets/groupPrize2.png";
import groupPrize3 from "../assets/groupPrize3.png";
import lookupImage from "../assets/lookupImage.png";
import Header from "../components/Header";

interface Winner {
  number_phone: string;
  full_name: string;
}

const Lottery: React.FC<{ campaignId?: string }> = ({ campaignId }) => {
  const activeCampaignId = campaignId || "taiwan-lcp";

  const [thirdTable, setThirdTable] = useState<Winner[]>([]);
  const [thirdVisibleCount, setThirdVisibleCount] = useState(5);

  const [fourthTable, setFourthTable] = useState<Winner[]>([]);
  const [fourthVisibleCount, setFourthVisibleCount] = useState(5);

  const [fifthTable, setFifthTable] = useState<Winner[]>([]);
  const [fifthVisibleCount, setFifthVisibleCount] = useState(5);

  // Giải nhất (1 người)
  const [firstDigits, setFirstDigits] = useState<number[]>(Array(10).fill(0));
  const [firstSpinning, setFirstSpinning] = useState(false);
  const firstSpinningRef = useRef(false);
  const [firstWinner, setFirstWinner] = useState<Winner | null>(null);

  // Giải nhì (3 người)
  const [secondDigits, setSecondDigits] = useState<number[][]>(
    Array.from({ length: 3 }, () => Array(10).fill(0)) // tránh fill cùng tham chiếu
  );
  const [secondSpinning, setSecondSpinning] = useState(false);
  const secondSpinningRef = useRef(false);
  const [secondWinners, setSecondWinners] = useState<Winner[]>([]);

  // Giải 3–5 (chỉ render bảng)
  const [backpackList, setBackpackList] = useState<Winner[]>([]); // prizeId = 3
  const [bottleList, setBottleList] = useState<Winner[]>([]); // prizeId = 4
  const [bagList, setBagList] = useState<Winner[]>([]); // prizeId = 5

  // Admin gating
  const [hasToken, setHasToken] = useState(false);

  // Socket / timer
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const socketRef = useRef<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);

    const socket = io("https://sk.dudoanchungketlcp-tta.vn", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // join đúng campaign ngay từ đầu
    socket.emit("join", { campaignId: activeCampaignId });

    // === HÀM QUAY GIẢI NHẤT ===
    const startFirstSpin = () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];
      setFirstSpinning(true);
      firstSpinningRef.current = true;
      setFirstWinner(null);
      spinIntervalRef.current = setInterval(() => {
        setFirstDigits(
          Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
        );
      }, 80);
    };

    // === HÀM QUAY GIẢI NHÌ (3 ô) ===
    const startSecondSpin = () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];
      setSecondSpinning(true);
      secondSpinningRef.current = true;
      setSecondWinners([]);
      spinIntervalRef.current = setInterval(() => {
        setSecondDigits((prev) =>
          prev.map(() =>
            Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
          )
        );
      }, 80);
    };

    // === STOP SPIN: dùng cho cả giải 1 & 2, và set dữ liệu bảng cho 3–5 ===
    const stopSpin = (payload: any) => {
      console.log("🎯 STOP SPIN PAYLOAD:", payload);
      const prizeId: number = payload?.prizeId;
      const results: Winner[] = payload?.result || [];
      if (!Array.isArray(results) || results.length === 0) return;

      // clear vòng quay hiện tại (nếu có)
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];

      // Giải 1: reveal 1 người, có animation "giảm tốc"
      if (prizeId === 1) {
        setFirstSpinning(false);
        firstSpinningRef.current = false;
        const first = results[0];
        const resultStr = String(first.number_phone)
          .padStart(10, "0")
          .slice(0, 10);

        for (let i = 0; i < 10; i++) {
          const t = setTimeout(() => {
            if (i < 9) {
              setFirstDigits(
                Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
              );
            } else {
              setFirstDigits(resultStr.split("").map((c) => Number(c)));
              setFirstWinner(first);
            }
          }, 120 + i * 120);
          stopTimeoutsRef.current.push(t);
        }
      }

      // Giải 2: reveal 3 người, hiển thị 3 ô số theo thứ tự
      if (prizeId === 2) {
        setSecondSpinning(false);
        secondSpinningRef.current = false;
        const reveal = results.slice(0, 3);
        reveal.forEach((w, idx) => {
          setTimeout(() => {
            const resultStr = String(w.number_phone)
              .padStart(10, "0")
              .slice(0, 10);
            setSecondDigits((prev) => {
              const newDigits = prev.map((arr) => [...arr]); // clone an toàn
              newDigits[idx] = resultStr.split("").map((c) => Number(c));
              return newDigits;
            });
          }, 300 * idx);
        });
        setSecondWinners(reveal);
      }

      // Giải 3–5: render bảng
      if (prizeId === 3) setBackpackList(results);
      if (prizeId === 4) setBottleList(results);
      if (prizeId === 5) setBagList(results);
    };

    // Lắng nghe start-spin để khởi động animation đúng giải
    socket.on("start-spin", (p: any) => {
      console.log("📡 start-spin:", p);
      if (p?.campaignId && p.campaignId !== activeCampaignId) return;
      if (p?.prizeId === 1 && !firstSpinningRef.current) startFirstSpin();
      if (p?.prizeId === 2 && !secondSpinningRef.current) startSecondSpin();
    });

    // Lắng nghe stop-spin để dừng và show kết quả
    socket.on("stop-spin", (p: any) => {
      console.log("📡 stop-spin:", p);
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

  // Call API theo prizeId 1..5
  const handleSpinClick = async (prizeId: number) => {
    try {
      await fetch(
        `https://be.dudoanchungketlcp-tta.vn/api/prize/spin-member?id=${prizeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (localStorage.getItem("token") || ""),
          },
        }
      );
    } catch (e) {
      console.error("Gọi API quay số thất bại", e);
    }
  };

  return (
    <div>
      <Header />

      {/* START BANNER */}
      <section className="lottery-banner">
        <div className="lottery-banner__container">
          <h1 className="lottery-banner__title">
            <span className="lottery-banner__title-line">KẾT QUẢ QUAY SỐ</span>
            <span className="lottery-banner__title-line">MAY MẮN</span>
          </h1>
          <div className="lottery-banner__sub">
            <div className="lottery-banner__subtitle">
              <span className="lottery-banner__subtitle-line">
                DỰ ĐOÁN ĐỘI CHIẾN THẮNG
              </span>
              <span className="lottery-banner__subtitle-line">CHUNG KẾT</span>
            </div>
            <img
              className="lottery-banner__logo"
              src={lcpIcon}
              alt="League of Legends Championship Pacific"
              width={499}
              height={196}
            />
          </div>
        </div>
        <div className="lottery-banner__marquee">
          <div className="lottery-banner__marquee-content">
            LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG ĐƯƠNG ĐẦU
            &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; 為此而生 &nbsp;
            LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG ĐƯƠNG ĐẦU
            &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; 為此而生 &nbsp;
          </div>
        </div>
      </section>
      {/* END BANNER */}

      {/* START FIRST PRIZE SECTION */}
      <section className="first-prize">
        <div className="first-prize__container container">
          <div className="first-prize__header-image">
            <img src={groupPrize1} alt="1 Giải Nhất" />
          </div>

          <div className="first-prize__board">
            <img
              className="first-prize__board-image"
              src={boardPrize1}
              alt="Bảng kết quả"
            />

            <div className="first-prize__phone-overlay">
              {firstDigits.map((d, i) => (
                <span key={i} className="first-prize__digit">
                  {d}
                </span>
              ))}
            </div>

            {firstWinner && (
              <div
                className="first-prize__name-overlay"
                title={firstWinner.full_name}
              >
                {firstWinner.full_name}
              </div>
            )}
          </div>

          {hasToken && (
            <div className="first-prize__action">
              <button
                className="first-prize__spin-btn"
                onClick={() => handleSpinClick(1)}
                disabled={firstSpinning}
              >
                {firstSpinning ? "ĐANG QUAY..." : "QUAY SỐ"}
              </button>
            </div>
          )}
        </div>
      </section>
      {/* END FIRST PRIZE SECTION */}

      {/* START SECOND PRIZE SECTION */}
      <section className="second-prize">
        <div className="second-prize__container container">
          <div className="second-prize__header-image">
            <img src={groupPrize2} alt="3 Giải Nhì" />
          </div>
          <div className="second-prize__boards">
            {secondDigits.map((row, idx) => (
              <div className="second-prize__board" key={idx}>
                <img
                  className="second-prize__board-image"
                  src={boardPrize1}
                  alt="Bảng kết quả"
                />
                <div className="second-prize__phone-overlay">
                  {row.map((d, i) => (
                    <span key={i} className="second-prize__digit">
                      {d}
                    </span>
                  ))}
                </div>
                {secondWinners[idx] && (
                  <div
                    className="second-prize__name-overlay"
                    title={secondWinners[idx].full_name}
                  >
                    {secondWinners[idx].full_name}
                  </div>
                )}
              </div>
            ))}
          </div>
          {hasToken && (
            <div className="second-prize__action">
              <button
                className="second-prize__spin-btn"
                onClick={() => handleSpinClick(2)}
                disabled={secondSpinning}
              >
                {secondSpinning ? "ĐANG QUAY..." : "QUAY SỐ"}
              </button>
            </div>
          )}
        </div>
      </section>
      {/* END SECOND PRIZE SECTION */}

      {/* START THIRD PRIZE SECTION */}
      <section className="third-prize">
        <div className="third-prize__container container">
          <div className="third-prize__header-image">
            <img src={groupPrize3} alt="300 Giải Ba" />
          </div>

          <div className="third-prize__lookup-row">
            <div className="third-prize__lookup-search">
              <img
                src={lookupImage}
                alt="search"
                className="third-prize__lookup-icon"
              />
              <div className="third-prize__lookup-content">
                <div className="third-prize__lookup-label">
                  TRA CỨU SỐ ĐIỆN THOẠI:
                </div>
                <div className="third-prize__lookup-input-row">
                  <input
                    className="third-prize__lookup-input"
                    placeholder="0123456789"
                    maxLength={10}
                  />
                  <button className="third-prize__lookup-btn">TRA CỨU</button>
                </div>
              </div>
            </div>
            <div className="third-prize__lookup-result">
              BẠN KHÔNG NẰM TRONG DANH SÁCH TRÚNG GIẢI.
            </div>
          </div>

          {/* BALO DU LỊCH (prizeId = 3) */}
          <div className="backpack-prize">
            <div className="backpack-prize__title">BALO DU LỊCH</div>
            {hasToken && (
              <div className="backpack-prize__action">
                <button
                  className="backpack-prize__spin-btn"
                  onClick={() => handleSpinClick(3)}
                >
                  QUAY SỐ
                </button>
              </div>
            )}
            <div className="backpack-prize__table-wrap">
              <table className="backpack-prize__table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SỐ ĐIỆN THOẠI</th>
                    <th>HỌ VÀ TÊN</th>
                  </tr>
                </thead>
                <tbody>
                  {backpackList.map((w, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {thirdVisibleCount < thirdTable.length && (
      <div className="backpack-prize__more">
        <button
          className="backpack-prize__more-btn"
          onClick={() => setThirdVisibleCount(thirdTable.length)}
        >
          XEM THÊM
        </button>
      </div>
    )}
          </div>

          {/* BÌNH NƯỚC GẤU OH-BEAR TINH NGHỊCH (prizeId = 4) */}
          <div className="backpack-prize">
            <div className="backpack-prize__title">
              BÌNH NƯỚC GẤU OH-BEAR TINH NGHỊCH
            </div>
            {hasToken && (
              <div className="backpack-prize__action">
                <button
                  className="backpack-prize__spin-btn"
                  onClick={() => handleSpinClick(4)}
                >
                  QUAY SỐ
                </button>
              </div>
            )}
            <div className="backpack-prize__table-wrap">
              <table className="backpack-prize__table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SỐ ĐIỆN THOẠI</th>
                    <th>HỌ VÀ TÊN</th>
                  </tr>
                </thead>
                <tbody>
                  {bottleList.map((w, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {fourthVisibleCount < fourthTable.length && (
      <div className="backpack-prize__more">
        <button
          className="backpack-prize__more-btn"
          onClick={() => setFourthVisibleCount(fourthTable.length)}
        >
          XEM THÊM
        </button>
      </div>
    )}
          </div>

          {/* TÚI XẾP TIỆN LỢI (prizeId = 5) */}
          <div className="backpack-prize">
            <div className="backpack-prize__title">TÚI XẾP TIỆN LỢI</div>
            {hasToken && (
              <div className="backpack-prize__action">
                <button
                  className="backpack-prize__spin-btn"
                  onClick={() => handleSpinClick(5)}
                >
                  QUAY SỐ
                </button>
              </div>
            )}
            <div className="backpack-prize__table-wrap">
              <table className="backpack-prize__table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SỐ ĐIỆN THOẠI</th>
                    <th>HỌ VÀ TÊN</th>
                  </tr>
                </thead>
                <tbody>
                  {bagList.map((w, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="backpack-prize__more">
              <button className="backpack-prize__more-btn">XEM THÊM</button>
            </div>
          </div>
        </div>
      </section>
      {/* END THIRD PRIZE SECTION */}
    </div>
  );
};

export default Lottery;
