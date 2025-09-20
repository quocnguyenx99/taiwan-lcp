import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import lcpIcon from "../assets/lcpIcon.png";
import "../styles/lottery.css";

import groupPrize1 from "../assets/groupPrize1.png";
import boardPrize2 from "../assets/boardPrize2.png";

import groupPrize2 from "../assets/groupPrize2.png";
import groupPrize3 from "../assets/groupPrize3.png";
import lookupImage from "../assets/lookupImage.png";
import Header from "../components/Header";
import Countdown from "../components/Countdown";

interface Winner {
  number_phone: string;
  full_name: string;
}

interface PrizeData {
  id: number;
  title: string;
  description: string;
  picture: string | null;
  status: number;
  type: number;
  members: Array<{
    id: number;
    full_name: string;
    number_phone: string;
    email: string;
    address: string;
    created_at: string;
    team_id: number;
    team_vote: {
      id: number;
      name: string;
    };
  }>;
}

interface ApiResponse {
  status: boolean;
  errorCode: number;
  message: string;
  data: PrizeData[];
}

const Lottery: React.FC<{ campaignId?: string }> = ({ campaignId }) => {
  const activeCampaignId = campaignId || "taiwan-lcp";

  // Giải nhất (1 người)
  const [firstDigits, setFirstDigits] = useState<(number | string)[]>(
    Array(10).fill(0)
  );
  const firstSpinningRef = useRef(false);
  const [firstWinner, setFirstWinner] = useState<Winner | null>(null);

  // Giải nhì (3 người) - thay đổi state để xử lý từng giải riêng
  const [secondDigits, setSecondDigits] = useState<(number | string)[][]>(
    Array.from({ length: 3 }, () => Array(10).fill(0))
  );
  const [secondSpinningStates, setSecondSpinningStates] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
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
  const [originalBackpackList, setOriginalBackpackList] = useState<Winner[]>(
    []
  );
  const [originalBottleList, setOriginalBottleList] = useState<Winner[]>([]);
  const [originalBagList, setOriginalBagList] = useState<Winner[]>([]);

  // State để kiểm soát hiển thị countdown
  const [showCountdown, setShowCountdown] = useState(true);

  // Thêm state để track loading
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  // Thêm states cho animation table
  const [backpackAnimatedRows, setBackpackAnimatedRows] = useState(0);
  const [bottleAnimatedRows, setBottleAnimatedRows] = useState(0);
  const [bagAnimatedRows, setBagAnimatedRows] = useState(0);
  const [isAnimatingBackpack, setIsAnimatingBackpack] = useState(false);
  const [isAnimatingBottle, setIsAnimatingBottle] = useState(false);
  const [isAnimatingBag, setIsAnimatingBag] = useState(false);

  // Refs để clear timeout khi cần
  const backpackAnimationRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bottleAnimationRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const bagAnimationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Hàm helper để convert phone number thành digit array
  const processPhoneToDigits = (phoneStr: string): (number | string)[] => {
    const cleanPhone = phoneStr.padStart(10, "0").slice(0, 10);
    return cleanPhone.split("").map((char) => {
      if (char === "X" || char === "x") {
        return "X";
      }
      const num = Number(char);
      return isNaN(num) ? "X" : num;
    });
  };

  // Hàm toggle cho từng giải
  const handleToggleBackpack = () => {
    if (isBackpackExpanded) {
      setBackpackVisible(10);
      setIsBackpackExpanded(false);
      setBackpackAnimatedRows(10); // Hiển thị 10 rows khi thu gọn
      setIsAnimatingBackpack(false);
      setTimeout(() => {
        const table = document.querySelector(".backpack-prize");
        if (table) {
          const headerHeight = 110;
          const tablePosition =
            table.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: tablePosition - headerHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      setBackpackVisible(backpackList.length);
      setIsBackpackExpanded(true);
      setBackpackAnimatedRows(backpackList.length); // Hiển thị tất cả ngay lập tức
      setIsAnimatingBackpack(false);
    }
  };

  const handleToggleBottle = () => {
    if (isBottleExpanded) {
      setBottleVisible(10);
      setIsBottleExpanded(false);
      setBottleAnimatedRows(10);
      setIsAnimatingBottle(false);
      setTimeout(() => {
        const table = document.querySelector(".bottle-prize");
        if (table) {
          const headerHeight = 110;
          const tablePosition =
            table.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: tablePosition - headerHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      setBottleVisible(bottleList.length);
      setIsBottleExpanded(true);
      setBottleAnimatedRows(bottleList.length);
      setIsAnimatingBottle(false);
    }
  };

  const handleToggleBag = () => {
    if (isBagExpanded) {
      setBagVisible(10);
      setIsBagExpanded(false);
      setBagAnimatedRows(10);
      setIsAnimatingBag(false);
      setTimeout(() => {
        const table = document.querySelector(".bag-prize");
        if (table) {
          const headerHeight = 110;
          const tablePosition =
            table.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: tablePosition - headerHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      setBagVisible(bagList.length);
      setIsBagExpanded(true);
      setBagAnimatedRows(bagList.length);
      setIsAnimatingBag(false);
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
      const response = await fetch(
        "https://be.dudoanchungketlcp-tta.vn/api/prize/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: searchPhone.trim(),
          }),
        }
      );

      const result = await response.json();

      if (result.status && result.data) {
        // Trúng giải - chỉ hiển thị 1 record trong bảng tương ứng
        setSearchResult({
          found: true,
          message: "🏆 CHÚC MỪNG BẠN NẰM TRONG DANH SÁCH TRÚNG GIẢI.",
          winner: result.data,
        });

        // Filter bảng tương ứng chỉ hiển thị 1 record
        const winnerRecord = {
          number_phone: result.data.number_phone,
          full_name: result.data.full_name,
        };

        // ✅ GIẢI NHẤT (prizeId = 1)
        if (result.data.prize_id === 1) {
          // Scroll xuống section giải nhất sau khi render
          setTimeout(() => {
            const section = document.querySelector(".search-first-prize");
            if (section) {
              const headerHeight = 110;
              const sectionPosition =
                section.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: sectionPosition - headerHeight,
                behavior: "smooth",
              });
            }
          }, 100);
        }
        // ✅ GIẢI NHÌ (prizeId = 2) 
        else if (result.data.prize_id === 2) {
          // Scroll xuống section giải nhì sau khi render
          setTimeout(() => {
            const section = document.querySelector(".search-second-prize");
            if (section) {
              const headerHeight = 110;
              const sectionPosition =
                section.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: sectionPosition - headerHeight,
                behavior: "smooth",
              });
            }
          }, 100);
        }
        // GIẢI BA - BALO (prizeId = 3)
        else if (result.data.prize_id === 3) {
          setBackpackList([winnerRecord]);
          setBackpackVisible(1);
          setIsBackpackExpanded(false);
          setBackpackAnimatedRows(1); // ✅ Hiển thị ngay 1 row
          setTimeout(() => {
            const table = document.querySelector(".backpack-prize");
            if (table) {
              const headerHeight = 110;
              const tablePosition =
                table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth",
              });
            }
          }, 100);
        } 
        // GIẢI BA - BÌNH NƯỚC (prizeId = 4)
        else if (result.data.prize_id === 4) {
          setBottleList([winnerRecord]);
          setBottleVisible(1);
          setIsBottleExpanded(false);
          setBottleAnimatedRows(1); // ✅ Hiển thị ngay 1 row
          setTimeout(() => {
            const table = document.querySelector(".bottle-prize");
            if (table) {
              const headerHeight = 110;
              const tablePosition =
                table.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: tablePosition - headerHeight,
                behavior: "smooth",
              });
            }
          }, 100);
        } 
        // GIẢI BA - TÚI XẾP (prizeId = 5)
        else if (result.data.prize_id === 5) {
          setBagList([winnerRecord]);
          setBagVisible(1);
          setIsBagExpanded(false);
          setBagAnimatedRows(1); // ✅ Hiển thị ngay 1 row
          setTimeout(() => {
            const table = document.querySelector(".bag-prize");
            if (table) {
              const headerHeight = 110;
              const tablePosition =
                table.getBoundingClientRect().top + window.scrollY;
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
        setBackpackAnimatedRows(Math.min(originalBackpackList.length, 10));

        setBottleList(originalBottleList);
        setBottleVisible(10);
        setIsBottleExpanded(false);
        setBottleAnimatedRows(Math.min(originalBottleList.length, 10));

        setBagList(originalBagList);
        setBagVisible(10);
        setIsBagExpanded(false);
        setBagAnimatedRows(Math.min(originalBagList.length, 10));
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
        const sectionPosition =
          section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionPosition - headerHeight,
          behavior: "smooth",
        });
      }
    }, delay);
  };

  // Fetch initial data khi component mount

  useEffect(() => {
    const fetchInitialResults = async () => {
      try {
        setIsLoadingInitialData(true);

        const response = await fetch(
          "https://be.dudoanchungketlcp-tta.vn/api/prize/get-member"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.status && result.data) {
          console.log("✅ Initial data loaded:", result.data);

          result.data.forEach((prize) => {
            const { id, type, members } = prize; // ✅ Thêm id vào destructuring

            if (!members || members.length === 0) {
              console.log(
                `⏭️ No members found for prize id: ${id}, type: ${type}`
              );
              return;
            }

            switch (type) {
              case 1: // Giải nhất
                if (members.length > 0) {
                  const winner = members[0];
                  const digits = processPhoneToDigits(winner.number_phone);
                  setFirstDigits(digits);
                  setFirstWinner({
                    number_phone: winner.number_phone,
                    full_name: winner.full_name,
                  });
                 
                }
                break;

              case 2: // Giải nhì (có thể có nhiều người)
                if (members.length > 0) {
                  const newSecondDigits = Array.from({ length: 3 }, () =>
                    Array(10).fill(0)
                  );
                  const newSecondWinners: Winner[] = [];

                  members.slice(0, 3).forEach((member, idx) => {
                    const digits = processPhoneToDigits(member.number_phone);
                    newSecondDigits[idx] = digits;
                    newSecondWinners[idx] = {
                      number_phone: member.number_phone,
                      full_name: member.full_name,
                    };
                  });

                  setSecondDigits(newSecondDigits);
                  setSecondWinners(newSecondWinners);
                  
                }
                break;

              case 3: // Giải ba - cần check thêm id để phân biệt
                if (id === 3) {
                  // ✅ Balo du lịch (id = 3)
                  const backpackWinners = members.map((m) => ({
                    number_phone: m.number_phone,
                    full_name: m.full_name,
                  }));
                  setOriginalBackpackList(backpackWinners);
                  setBackpackList(backpackWinners);
                  setBackpackAnimatedRows(Math.min(backpackWinners.length, 10));
                  setIsAnimatingBackpack(false);
                  
                } else if (id === 4) {
                  // ✅ Bình nước (id = 4)
                  const bottleWinners = members.map((m) => ({
                    number_phone: m.number_phone,
                    full_name: m.full_name,
                  }));
                  setOriginalBottleList(bottleWinners);
                  setBottleList(bottleWinners);
                  setBottleAnimatedRows(Math.min(bottleWinners.length, 10));
                  setIsAnimatingBottle(false);
                 
                } else if (id === 5) {
                  // ✅ Túi xếp (id = 5)
                  const bagWinners = members.map((m) => ({
                    number_phone: m.number_phone,
                    full_name: m.full_name,
                  }));
                  setOriginalBagList(bagWinners);
                  setBagList(bagWinners);
                  setBagAnimatedRows(Math.min(bagWinners.length, 10));
                  setIsAnimatingBag(false);
                  
                }
                break;

              default:
                console.log(`❓ Unknown prize type: ${type}, id: ${id}`);
            }
          });
        } else {
          console.log("⚠️ No initial data available or API returned error");
        }
      } catch (error) {
        console.error("❌ Error fetching initial results:", error);
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    fetchInitialResults();
  }, []);

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

    // === HÀM QUAY GIẢI NHÌ THEO INDEX ===
    const startSecondSpin = (prizeIndex: number) => {
     

      // Cập nhật trạng thái spinning cho giải cụ thể
      setSecondSpinningStates((prev) => {
        const newStates = [...prev];
        newStates[prizeIndex] = true;
        return newStates;
      });

      // Clear interval cũ nếu có
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }

      // Tạo interval riêng cho giải này
      const spinInterval = setInterval(() => {
        setSecondDigits((prev) => {
          const newDigits = prev.map((arr, idx) => {
            // Chỉ quay animation cho giải đang được chọn
            if (idx === prizeIndex) {
              return Array.from({ length: 10 }, () =>
                Math.floor(Math.random() * 10)
              );
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
              // Sau khi hoàn thành giải 1, scroll xuống giải 2
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

        console.log(
          `🏆 Stopping spin for second prize ${
            prizeIndex + 1
          } (prizeId: ${prizeId})`
        );

        // Dừng animation cho giải này
        setSecondSpinningStates((prev) => {
          const newStates = [...prev];
          newStates[prizeIndex] = false;
          return newStates;
        });

        // Animation giảm tốc cho giải này
        const displayArray = processPhoneDisplay(String(winner.number_phone));

        for (let i = 0; i < 8; i++) {
          const t = setTimeout(() => {
            if (i < 7) {
              setSecondDigits((prev) => {
                const newDigits = prev.map((arr, idx) => {
                  if (idx === prizeIndex) {
                    return Array.from({ length: 10 }, () =>
                      Math.floor(Math.random() * 10)
                    );
                  }
                  return arr;
                });
                return newDigits;
              });
            } else {
              // Hiển thị kết quả cuối cùng
              setSecondDigits((prev) => {
                const newDigits = prev.map((arr, idx) => {
                  if (idx === prizeIndex) {
                    return displayArray;
                  }
                  return arr;
                });
                return newDigits;
              });

              // Cập nhật danh sách winners
              setSecondWinners((prev) => {
                const newWinners = [...prev];
                newWinners[prizeIndex] = winner;
                return newWinners;
              });

              // Nếu đây là giải cuối cùng (prizeId 23), scroll xuống giải 3
              if (prizeId === 23) {
                scrollToSection(".third-prize", 2000);
              }
            }
          }, 100 + i * 150); // Animation giảm tốc
          stopTimeoutsRef.current.push(t);
        }
      }

      // Giải 3–5: render bảng với animation CHỈ KHI SOCKET QUAY
      if (prizeId === 3) {
        setOriginalBackpackList(results);
        setBackpackList(results);
        setBackpackVisible(10);
        setIsBackpackExpanded(false);

        // ✅ CHỈ ANIMATION KHI NHẬN TỪ SOCKET (không phải initial data)
        setBackpackAnimatedRows(0);
        setIsAnimatingBackpack(false);

        // Bắt đầu animation sau 800ms
        setTimeout(() => {
          animateTableRows("backpack", results.length, 200);
        }, 800);

        scrollToSection(".backpack-prize", 500);
      }

      if (prizeId === 4) {
        setOriginalBottleList(results);
        setBottleList(results);
        setBottleVisible(10);
        setIsBottleExpanded(false);

        // ✅ CHỈ ANIMATION KHI NHẬN TỪ SOCKET
        setBottleAnimatedRows(0);
        setIsAnimatingBottle(false);

        setTimeout(() => {
          animateTableRows("bottle", results.length, 200);
        }, 800);

        scrollToSection(".bottle-prize", 500);
      }

      if (prizeId === 5) {
        setOriginalBagList(results);
        setBagList(results);
        setBagVisible(10);
        setIsBagExpanded(false);

        // ✅ CHỈ ANIMATION KHI NHẬN TỪ SOCKET
        setBagAnimatedRows(0);
        setIsAnimatingBag(false);

        setTimeout(() => {
          animateTableRows("bag", results.length, 200);
        }, 800);

        scrollToSection(".bag-prize", 500);
      }
    };

    // === HÀM ANIMATE TABLE ROWS ===
    const animateTableRows = (
      prizeType: "backpack" | "bottle" | "bag",
      totalRows: number,
      delayBetweenRows = 200
    ) => {
      const maxRowsToShow = Math.min(totalRows, 10);

      let animationRef: React.MutableRefObject<ReturnType<typeof setTimeout>[]>;
      let setAnimatedRows: React.Dispatch<React.SetStateAction<number>>;
      let setIsAnimating: React.Dispatch<React.SetStateAction<boolean>>;

      switch (prizeType) {
        case "backpack":
          animationRef = backpackAnimationRef;
          setAnimatedRows = setBackpackAnimatedRows;
          setIsAnimating = setIsAnimatingBackpack;
          break;
        case "bottle":
          animationRef = bottleAnimationRef;
          setAnimatedRows = setBottleAnimatedRows;
          setIsAnimating = setIsAnimatingBottle;
          break;
        case "bag":
          animationRef = bagAnimationRef;
          setAnimatedRows = setBagAnimatedRows;
          setIsAnimating = setIsAnimatingBag;
          break;
      }

      // Clear previous timeouts
      animationRef.current.forEach(clearTimeout);
      animationRef.current = [];

      // Reset và bắt đầu animation
      setAnimatedRows(0);
      setIsAnimating(true);


      // Animate từng row
      for (let i = 0; i < maxRowsToShow; i++) {
        const timeout = setTimeout(() => {
          setAnimatedRows(i + 1);

          // Khi hoàn thành animation cuối cùng
          if (i === maxRowsToShow - 1) {
            setIsAnimating(false);
          }
        }, i * delayBetweenRows);

        animationRef.current.push(timeout);
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
        console.log(
          `📡 Received start-spin for second prize ${
            prizeIndex + 1
          } (prizeId: ${p.prizeId})`
        );

        // Lấy current state thay vì dựa vào stale closure
        setSecondSpinningStates((currentStates) => {
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
      socket.off("start-spin");
      socket.off("stop-spin");
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
      stopTimeoutsRef.current.forEach(clearTimeout);
      stopTimeoutsRef.current = [];
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeCampaignId]); // BỎ secondSpinningStates khỏi dependency array

  // Cleanup animation timeouts khi component unmount
  useEffect(() => {
    return () => {
      backpackAnimationRef.current.forEach(clearTimeout);
      bottleAnimationRef.current.forEach(clearTimeout);
      bagAnimationRef.current.forEach(clearTimeout);
    };
  }, []);

  // Callback khi countdown hết thời gian
  const handleCountdownExpired = () => {
    setShowCountdown(false);
  };

  // Hiển thị loading state khi đang fetch data ban đầu
  if (isLoadingInitialData) {
    return (
      <div>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            fontSize: "18px",
            color: "white",
          }}
        >
          <div>
            <div>Đang tải dữ liệu...</div>
            <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
              Vui lòng chờ trong giây lát
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* COUNTDOWN - Chỉ hiển thị khi chưa hết thời gian */}
      {showCountdown && <Countdown onExpired={handleCountdownExpired} />}

      {/* START FIRST PRIZE SECTION */}
      <section className="first-prize">
        <div className="first-prize__container container">
          <div className="first-prize__header-image">
            <img src={groupPrize1} alt="1 Giải Nhất" />
          </div>

          <div className="first-prize__board">
            <img
              className="first-prize__board-image"
              src={boardPrize2}
              alt="Bảng kết quả"
            />

            <div className="first-prize__phone-overlay">
              {firstDigits.map((d, i) => (
                <span key={i} className="first-prize__digit">
                  {d === "X" ? "X" : d}
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
                  src={boardPrize2}
                  alt="Bảng kết quả"
                />
                <div className="second-prize__phone-overlay">
                  {row.map((d, i) => (
                    <span key={i} className="second-prize__digit">
                      {d === "X" ? "X" : d}
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
              {searchResult
                ? searchResult.message
                : "NHẬP SỐ ĐIỆN THOẠI ĐỂ TRA CỨU."}
            </div>
          </div>

          {/* ✅ SEARCH RESULT - GIẢI NHẤT (CHỈ HIỂN THỊ KHI SEARCH TRÚNG) */}
          {searchResult?.found && searchResult.winner?.prize_id === 1 && (
            <div className="backpack-prize search-first-prize">
              <div className="backpack-prize__title">
                {searchResult.winner.prize || "GIẢI NHẤT"}
              </div>
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
                    <tr className="prize-table-row prize-table-row--visible">
                      <td>1</td>
                      <td>{searchResult.winner.number_phone}</td>
                      <td>{searchResult.winner.full_name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ✅ SEARCH RESULT - GIẢI NHÌ (CHỈ HIỂN THỊ KHI SEARCH TRÚNG) */}
          {searchResult?.found && searchResult.winner?.prize_id === 2 && (
            <div className="backpack-prize search-second-prize">
              <div className="backpack-prize__title">
                {searchResult.winner.prize || "GIẢI NHÌ"}
              </div>
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
                    <tr className="prize-table-row prize-table-row--visible">
                      <td>1</td>
                      <td>{searchResult.winner.number_phone}</td>
                      <td>{searchResult.winner.full_name}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                    <tr
                      key={idx}
                      className={`prize-table-row ${
                        idx < backpackAnimatedRows
                          ? "prize-table-row--visible"
                          : "prize-table-row--hidden"
                      }`}
                    >
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {backpackList.length > 10 && (
              <div
                className="backpack-prize__more"
                style={{
                  opacity: isAnimatingBackpack ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <button
                  className="backpack-prize__more-btn"
                  onClick={handleToggleBackpack}
                  disabled={isAnimatingBackpack}
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
                    <tr
                      key={idx}
                      className={`prize-table-row ${
                        idx < bottleAnimatedRows
                          ? "prize-table-row--visible"
                          : "prize-table-row--hidden"
                      }`}
                    >
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bottleList.length > 10 && (
              <div
                className="backpack-prize__more"
                style={{
                  opacity: isAnimatingBottle ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
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
                    <tr
                      key={idx}
                      className={`prize-table-row ${
                        idx < bagAnimatedRows
                          ? "prize-table-row--visible"
                          : "prize-table-row--hidden"
                      }`}
                    >
                      <td>{idx + 1}</td>
                      <td>{w.number_phone}</td>
                      <td>{w.full_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {bagList.length > 10 && (
              <div
                className="backpack-prize__more"
                style={{
                  opacity: isAnimatingBag ? 0 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
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
