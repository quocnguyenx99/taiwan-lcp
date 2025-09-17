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

const LotteryAdmin: React.FC<{ campaignId?: string }> = ({ campaignId }) => {
  const activeCampaignId = campaignId || "taiwan-lcp";

  // Giải nhất (1 người) - UPDATE TYPE ĐỂ HỖ TRỢ X
  const [firstDigits, setFirstDigits] = useState<(number | string)[]>(Array(10).fill(0));
  const [firstSpinning, setFirstSpinning] = useState(false);
  const firstSpinningRef = useRef(false);
  const [firstWinner, setFirstWinner] = useState<Winner | null>(null);

  // Giải nhì (3 người) - UPDATE TYPE ĐỂ HỖ TRỢ X
  const [secondDigits, setSecondDigits] = useState<(number | string)[][]>(
    Array.from({ length: 3 }, () => Array(10).fill(0))
  );
  const [secondSpinningStates, setSecondSpinningStates] = useState<boolean[]>([false, false, false]);
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

  // Admin gating
  const [hasToken, setHasToken] = useState(false);

  // Socket / timer
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const socketRef = useRef<any | null>(null);

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
            behavior: "smooth",
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
            behavior: "smooth",
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
            behavior: "smooth",
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
              const headerHeight = 110;
              const tablePosition = table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth",
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
              const headerHeight = 110;
              const tablePosition = table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth",
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
              const headerHeight = 110;
              const tablePosition = table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth",
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
        const headerHeight = 110;
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition - headerHeight,
          behavior: "smooth",
        });
      }
    }, delay);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);

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
      setFirstSpinning(true);
      firstSpinningRef.current = true;
      setFirstWinner(null);
      spinIntervalRef.current = setInterval(() => {
        setFirstDigits(
          Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
        );
      }, 80);
    };

    // === HÀM QUAY GIẢI NHÌ THEO INDEX ===
    const startSecondSpin = (prizeIndex: number) => {
      console.log(`🎰 Starting spin for second prize ${prizeIndex + 1} (prizeId: ${prizeIndex + 21})`);
      
      // Cập nhật trạng thái spinning cho giải cụ thể
      setSecondSpinningStates(prev => {
        const newStates = [...prev];
        newStates[prizeIndex] = true;
        console.log(`🎰 Updated spinning states:`, newStates);
        return newStates;
      });

      // Clear interval cũ nếu có
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }

      // Tạo interval riêng cho giải này
      const spinInterval = setInterval(() => {
        setSecondDigits(prev => {
          const newDigits = prev.map((arr, idx) => {
            // Chỉ quay animation cho giải đang được chọn
            if (idx === prizeIndex) {
              return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
            }
            return arr; // Giữ nguyên các giải khác
          });
          return newDigits;
        });
      }, 80);

      // Lưu interval này để có thể clear sau
      spinIntervalRef.current = spinInterval;
    };

    // === STOP SPIN: xử lý từng giải riêng biệt ===
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

      // Hàm helper để xử lý number_phone có chứa XXXX
      const processPhoneDisplay = (phoneStr: string) => {
        const cleanPhone = phoneStr.padStart(10, "0").slice(0, 10);
        return cleanPhone.split("").map((char) => {
          if (char === "X" || char === "x") {
            return "X"; // Giữ nguyên X
          }
          const num = Number(char);
          return isNaN(num) ? "X" : num; // Nếu không phải số thì hiển thị X
        });
      };

      // Giải 1: reveal 1 người, có animation "giảm tốc"
      if (prizeId === 1) {
        setFirstSpinning(false);
        firstSpinningRef.current = false;
        const first = results[0];
        const displayArray = processPhoneDisplay(String(first.number_phone));

        for (let i = 0; i < 10; i++) {
          const t = setTimeout(() => {
            if (i < 9) {
              setFirstDigits(
                Array.from({ length: 10 }, () => Math.floor(Math.random() * 10))
              );
            } else {
              setFirstDigits(displayArray);
              setFirstWinner(first);
              scrollToSection(".second-prize", 2000);
            }
          }, 120 + i * 120);
          stopTimeoutsRef.current.push(t);
        }
      }

      // Giải 2: xử lý từng giải Nhì riêng biệt (21, 22, 23)
      if (prizeId >= 21 && prizeId <= 23) {
        const prizeIndex = prizeId - 21; // 21->0, 22->1, 23->2
        const winner = results[0]; // Mỗi lần chỉ nhận 1 người
        
        console.log(`🏆 Stopping spin for second prize ${prizeIndex + 1} (prizeId: ${prizeId})`);
        console.log(`🏆 Winner:`, winner);
        
        // Dừng animation cho giải này
        setSecondSpinningStates(prev => {
          const newStates = [...prev];
          newStates[prizeIndex] = false;
          console.log(`🏆 Updated spinning states after stop:`, newStates);
          return newStates;
        });

        // Animation giảm tốc cho giải này
        const displayArray = processPhoneDisplay(String(winner.number_phone));

        for (let i = 0; i < 8; i++) {
          const t = setTimeout(() => {
            if (i < 7) {
              setSecondDigits(prev => {
                const newDigits = prev.map((arr, idx) => {
                  if (idx === prizeIndex) {
                    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
                  }
                  return arr;
                });
                return newDigits;
              });
            } else {
              // Hiển thị kết quả cuối cùng
              setSecondDigits(prev => {
                const newDigits = prev.map((arr, idx) => {
                  if (idx === prizeIndex) {
                    return displayArray;
                  }
                  return arr;
                });
                return newDigits;
              });

              // Cập nhật danh sách winners
              setSecondWinners(prev => {
                const newWinners = [...prev];
                newWinners[prizeIndex] = winner;
                console.log(`🏆 Updated second winners:`, newWinners);
                return newWinners;
              });

              // Nếu đây là giải cuối cùng (prizeId 23), scroll xuống giải 3
              if (prizeId === 23) {
                console.log(`🏆 Completed all second prizes, scrolling to third prize`);
                scrollToSection(".third-prize", 2000);
              }
            }
          }, 100 + i * 150); // Animation giảm tốc
          stopTimeoutsRef.current.push(t);
        }
      }

      // Giải 3–5: render bảng và scroll xuống giải tiếp theo
      if (prizeId === 3) {
        setOriginalBackpackList(results);
        setBackpackList(results);
        setBackpackVisible(10);
        setIsBackpackExpanded(false);
        scrollToSection(".backpack-prize", 500);
      }
      if (prizeId === 4) {
        setOriginalBottleList(results);
        setBottleList(results);
        setBottleVisible(10);
        setIsBottleExpanded(false);
        scrollToSection(".bottle-prize", 500);
      }
      if (prizeId === 5) {
        setOriginalBagList(results);
        setBagList(results);
        setBagVisible(10);
        setIsBagExpanded(false);
        scrollToSection(".bag-prize", 500);
      }
    };

    // Lắng nghe start-spin để khởi động animation đúng giải
    socket.on("start-spin", (p: any) => {
      console.log("📡 start-spin:", p);
      if (p?.campaignId && p.campaignId !== activeCampaignId) return;
      
      if (p?.prizeId === 1 && !firstSpinningRef.current) {
        console.log("🎰 Starting first prize spin");
        startFirstSpin();
      }
      
      // Xử lý các giải Nhì riêng biệt
      if (p?.prizeId >= 21 && p?.prizeId <= 23) {
        const prizeIndex = p.prizeId - 21;
        console.log(`📡 Received start-spin for second prize ${prizeIndex + 1} (prizeId: ${p.prizeId})`);
        
        // Lấy current state thay vì dựa vào stale closure
        setSecondSpinningStates(currentStates => {
          console.log(`📡 Current spinning states:`, currentStates);
          if (!currentStates[prizeIndex]) {
            console.log(`📡 Starting spin for prize index ${prizeIndex}`);
            // Call startSecondSpin trong microtask để đảm bảo state đã update
            setTimeout(() => startSecondSpin(prizeIndex), 0);
          } else {
            console.log(`📡 Prize index ${prizeIndex} is already spinning`);
          }
          return currentStates; // Không thay đổi state ở đây
        });
      }
    });

    // Lắng nghe stop-spin để dừng và show kết quả
    socket.on("stop-spin", (p: any) => {
      console.log("📡 stop-spin:", p);
      if (p?.campaignId && p.campaignId !== activeCampaignId) return;
      stopSpin(p);
    });

    return () => {
      console.log("🔌 Cleaning up socket connection");
      socket.off("start-spin");
      socket.off("stop-spin");
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeCampaignId]); // BỎ secondSpinningStates khỏi dependency array

  // Call API theo prizeId 1..5 - GIỮ NGUYÊN LOGIC ADMIN
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
                  {d === 'X' ? 'X' : d}
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
                      {d === 'X' ? 'X' : d}
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

          {/* CHỈ 1 BUTTON DUY NHẤT CHO GIẢI NHÌ */}
          {hasToken && (
            <div className="second-prize__action">
              <button
                className="second-prize__spin-btn"
                onClick={() => handleSpinClick(2)}
                disabled={secondSpinningStates.some(state => state)}
              >
                {secondSpinningStates.some(state => state) ? "ĐANG QUAY GIẢI NHÌ..." : "QUAY SỐ"}
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

export default LotteryAdmin;
