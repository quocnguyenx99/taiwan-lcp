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

  // Giải nhất (1 người)
  const [firstDigits, setFirstDigits] = useState<number[]>(Array(10).fill(0));
  const firstSpinningRef = useRef(false);
  const [firstWinner, setFirstWinner] = useState<Winner | null>(null);

  // Giải nhì (3 người)
  const [secondDigits, setSecondDigits] = useState<number[][]>(
    Array.from({ length: 3 }, () => Array(10).fill(0))
  );
  const secondSpinningRef = useRef(false);
  const [secondWinners, setSecondWinners] = useState<Winner[]>([]);

  // Giải 3–5 (chỉ render bảng)
  const [backpackList, setBackpackList] = useState<Winner[]>([]); // prizeId = 3
  const [bottleList, setBottleList] = useState<Winner[]>([]); // prizeId = 4
  const [bagList, setBagList] = useState<Winner[]>([]); // prizeId = 5

  // State cho số lượng record hiển thị của từng giải
  const [backpackVisible, setBackpackVisible] = useState(10);
  const [isBackpackExpanded, setIsBackpackExpanded] = useState(false);

  const [bottleVisible, setBottleVisible] = useState(10);
  const [isBottleExpanded, setIsBottleExpanded] = useState(false);

  const [bagVisible, setBagVisible] = useState(10);
  const [isBagExpanded, setIsBagExpanded] = useState(false);

  // Thêm state cho tra cứu
  const [searchPhone, setSearchPhone] = useState("");
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    message: string;
    winner?: Winner & { prize_id: number; prize: string };
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // State để lưu danh sách gốc (không bị filter)
  const [originalBackpackList, setOriginalBackpackList] = useState<Winner[]>([]);
  const [originalBottleList, setOriginalBottleList] = useState<Winner[]>([]);
  const [originalBagList, setOriginalBagList] = useState<Winner[]>([]);

  // Hàm toggle cho từng giải
  const handleToggleBackpack = () => {
    if (isBackpackExpanded) {
      setBackpackVisible(10);
      setIsBackpackExpanded(false);
      setTimeout(() => {
        const table = document.querySelector(".backpack-prize");
        if (table) {
          const headerHeight = 110;
          const tablePosition = table.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: tablePosition - headerHeight,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      setBackpackVisible(backpackList.length);
      setIsBackpackExpanded(true);
    }
  };

  const handleToggleBottle = () => {
    if (isBottleExpanded) {
      setBottleVisible(10);
      setIsBottleExpanded(false);
      setTimeout(() => {
        const table = document.querySelector(".bottle-prize");
        if (table) {
          const headerHeight = 110;
          const tablePosition = table.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: tablePosition - headerHeight,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      setBottleVisible(bottleList.length);
      setIsBottleExpanded(true);
    }
  };

  const handleToggleBag = () => {
    if (isBagExpanded) {
      setBagVisible(10);
      setIsBagExpanded(false);
      setTimeout(() => {
        const table = document.querySelector(".bag-prize");
        if (table) {
          const headerHeight = 110;
          const tablePosition = table.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: tablePosition - headerHeight,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      setBagVisible(bagList.length);
      setIsBagExpanded(true);
    }
  };

  // Hàm tra cứu số điện thoại
  const handleSearch = async () => {
    // Nếu input trống, reset về danh sách gốc
    if (!searchPhone.trim()) {
      setSearchResult(null);
      setBackpackList(originalBackpackList);
      setBackpackVisible(10);
      setIsBackpackExpanded(false);
      
      setBottleList(originalBottleList);
      setBottleVisible(10);
      setIsBottleExpanded(false);
      
      setBagList(originalBagList);
      setBagVisible(10);
      setIsBagExpanded(false);
      return;
    }
  
    setIsSearching(true);
    try {
      const response = await fetch("https://be.dudoanchungketlcp-tta.vn/api/prize/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: searchPhone.trim(),
        }),
      });
  
      const result = await response.json();
  
      console.log("Search result:", result);
  
      if (result.status && result.data) {
        // Trúng giải - chỉ hiển thị 1 record trong bảng tương ứng
        setSearchResult({
          found: true,
          message: "CHÚC MỪNG BẠN NẰM TRONG DANH SÁCH TRÚNG GIẢI.",
          winner: result.data,
        });
  
        // Filter bảng tương ứng chỉ hiển thị 1 record
        const winnerRecord = {
          number_phone: result.data.number_phone,
          full_name: result.data.full_name,
        };
  
        if (result.data.prize_id === 3) {
          setBackpackList([winnerRecord]);
          setBackpackVisible(1);
          setIsBackpackExpanded(false);
          // Scroll xuống bảng balo sau khi render
          setTimeout(() => {
            const table = document.querySelector(".backpack-prize");
            if (table) {
              const headerHeight = 110; // Chiều cao header
              const tablePosition = table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth"
              });
            }
          }, 100);
        } else if (result.data.prize_id === 4) {
          setBottleList([winnerRecord]);
          setBottleVisible(1);
          setIsBottleExpanded(false);
          // Scroll xuống bảng bình nước sau khi render
          setTimeout(() => {
            const table = document.querySelector(".bottle-prize");
            if (table) {
              const headerHeight = 110; // Chiều cao header
              const tablePosition = table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth"
              });
            }
          }, 100);
        } else if (result.data.prize_id === 5) {
          setBagList([winnerRecord]);
          setBagVisible(1);
          setIsBagExpanded(false);
          // Scroll xuống bảng túi xếp sau khi render
          setTimeout(() => {
            const table = document.querySelector(".bag-prize");
            if (table) {
              const headerHeight = 110; // Chiều cao header
              const tablePosition = table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth"
              });
            }
          }, 100);
        }
      } else {
        // Không trúng giải - khôi phục lại danh sách gốc
        setSearchResult({
          found: false,
          message: "BẠN KHÔNG NẰM TRONG DANH SÁCH TRÚNG GIẢI.",
        });
        
        // Khôi phục lại danh sách gốc
        setBackpackList(originalBackpackList);
        setBackpackVisible(10);
        setIsBackpackExpanded(false);
        
        setBottleList(originalBottleList);
        setBottleVisible(10);
        setIsBottleExpanded(false);
        
        setBagList(originalBagList);
        setBagVisible(10);
        setIsBagExpanded(false);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResult({
        found: false,
        message: "CÓ LỖI XẢY RA KHI TRA CỨU.",
      });
    } finally {
      setIsSearching(false);
    }
  };

// Hàm scroll đến section tương ứng
const scrollToSection = (sectionClass: string, delay = 1000) => {
  setTimeout(() => {
    const section = document.querySelector(sectionClass);
    if (section) {
      const headerHeight = 110; // Chiều cao header
      const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: sectionPosition - headerHeight,
        behavior: "smooth"
      });
    }
  }, delay);
};

  // Socket / timer
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const socketRef = useRef<any | null>(null);

  useEffect(() => {
    const socket = io("https://sk.dudoanchungketlcp-tta.vn", {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("join", { campaignId: activeCampaignId });

    // === HÀM QUAY GIẢI NHẤT ===
    const startFirstSpin = () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];
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
              // Sau khi hoàn thành giải 1, scroll xuống giải 2
              scrollToSection(".second-prize", 2000);
            }
          }, 120 + i * 120);
          stopTimeoutsRef.current.push(t);
        }
      }

      // Giải 2: reveal 3 người, hiển thị 3 ô số theo thứ tự
      if (prizeId === 2) {
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
            
            // Sau khi hoàn thành reveal cuối cùng, scroll xuống giải 3
            if (idx === reveal.length - 1) {
              scrollToSection(".third-prize", 2000);
            }
          }, 300 * idx);
        });
        setSecondWinners(reveal);
      }

      // Giải 3–5: render bảng và scroll xuống giải tiếp theo
      if (prizeId === 3) {
        setOriginalBackpackList(results); // Lưu danh sách gốc
        setBackpackList(results);
        setBackpackVisible(10);
        setIsBackpackExpanded(false);
        // Scroll xuống bảng balo ngay lập tức, sau đó scroll xuống giải 4
        scrollToSection(".backpack-prize", 500);
        // Nếu có giải 4 tiếp theo, có thể scroll xuống (tùy logic)
        // scrollToSection(".bottle-prize", 3000);
      }
      if (prizeId === 4) {
        setOriginalBottleList(results); // Lưu danh sách gốc
        setBottleList(results);
        setBottleVisible(10);
        setIsBottleExpanded(false);
        // Scroll xuống bảng bình nước
        scrollToSection(".bottle-prize", 500);
        // Nếu có giải 5 tiếp theo, có thể scroll xuống
        // scrollToSection(".bag-prize", 3000);
      }
      if (prizeId === 5) {
        setOriginalBagList(results); // Lưu danh sách gốc
        setBagList(results);
        setBagVisible(10);
        setIsBagExpanded(false);
        // Scroll xuống bảng túi xếp
        scrollToSection(".bag-prize", 500);
      }
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
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                  <button 
                    className="third-prize__lookup-btn"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? "ĐANG TRA..." : "TRA CỨU"}
                  </button>
                </div>
              </div>
            </div>
            <div className="third-prize__lookup-result">
              {searchResult ? searchResult.message : "NHẬP SỐ ĐIỆN THOẠI ĐỂ TRA CỨU."}
            </div>
          </div>

          {/* BALO DU LỊCH (prizeId = 3) */}
          <div className="backpack-prize">
            <div className="backpack-prize__title">BALO DU LỊCH</div>
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
                  {backpackList.slice(0, backpackVisible).map((w, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {backpackList.length > 10 && (
              <div className="backpack-prize__more">
                <button
                  className="backpack-prize__more-btn"
                  onClick={handleToggleBackpack}
                >
                  {isBackpackExpanded ? "THU GỌN" : "XEM THÊM"}
                </button>
              </div>
            )}
          </div>

          {/* BÌNH NƯỚC GẤU OH-BEAR TINH NGHỊCH (prizeId = 4) */}
          <div className="backpack-prize bottle-prize">
            <div className="backpack-prize__title">
              BÌNH NƯỚC GẤU OH-BEAR TINH NGHỊCH
            </div>
            <div className="bottle-prize__table-wrap">
              <table className="backpack-prize__table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SỐ ĐIỆN THOẠI</th>
                    <th>HỌ VÀ TÊN</th>
                  </tr>
                </thead>
                <tbody>
                  {bottleList.slice(0, bottleVisible).map((w, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bottleList.length > 10 && (
              <div className="backpack-prize__more">
                <button
                  className="backpack-prize__more-btn"
                  onClick={handleToggleBottle}
                >
                  {isBottleExpanded ? "THU GỌN" : "XEM THÊM"}
                </button>
              </div>
            )}
          </div>

          {/* TÚI XẾP TIỆN LỢI (prizeId = 5) */}
          <div className="backpack-prize bag-prize">
            <div className="backpack-prize__title">TÚI XẾP TIỆN LỢI</div>
            <div className="bag-prize__table-wrap">
              <table className="backpack-prize__table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>SỐ ĐIỆN THOẠI</th>
                    <th>HỌ VÀ TÊN</th>
                  </tr>
                </thead>
                <tbody>
                  {bagList.slice(0, bagVisible).map((w, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bagList.length > 10 && (
              <div className="backpack-prize__more">
                <button
                  className="backpack-prize__more-btn"
                  onClick={handleToggleBag}
                >
                  {isBagExpanded ? "THU GỌN" : "XEM THÊM"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* END THIRD PRIZE SECTION */}
    </div>
  );
};

export default Lottery;
