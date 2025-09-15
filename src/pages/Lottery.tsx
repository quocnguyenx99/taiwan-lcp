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

  // Thêm sample 100 records cho balo (nếu chưa có)
  const backpackSample: Winner[] = [
    { number_phone: "0945408728", full_name: "Trần Thanh Khiết" },
    { number_phone: "0857305348", full_name: "Phạm Tuấn Anh" },
    { number_phone: "0967131112", full_name: "Phạm Quân" },
    { number_phone: "0969421547", full_name: "Đào Thái Dương" },
    { number_phone: "0902463269", full_name: "ĐỖ PHƯỚC DANH" },
    { number_phone: "0905777098", full_name: "Nguyễn Thị Phương Thảo" },
    { number_phone: "0969043530", full_name: "Phạm trung tính" },
    { number_phone: "0947853384", full_name: "Hoàng anh quốc" },
    { number_phone: "0372864598", full_name: "Vũ văn linh" },
    { number_phone: "0976608340", full_name: "Huỳnh Quang Tiên" },
    { number_phone: "0369897344", full_name: "Trần bảo hoàng" },
    { number_phone: "0332954799", full_name: "NGUYỄN HOÀNG PHƯƠNG NAM" },
    { number_phone: "0896662240", full_name: "Ng thi phuong an" },
    { number_phone: "0707022924", full_name: "Hồ Hải Đăng" },
    { number_phone: "0782998281", full_name: "Trần sương thanh hải" },
    { number_phone: "0931971007", full_name: "Lê Thành đạt" },
    { number_phone: "0708459569", full_name: "Hà Nguyễn Nhật Minh" },
    { number_phone: "0868773512", full_name: "Võ Đặng đường" },
    { number_phone: "0772890874", full_name: "Nguyễn trương hải duy" },
    { number_phone: "0907096017", full_name: "Lê Nguyễn hiếu thông" },
    { number_phone: "0941233509", full_name: "Kiều Đăng Nguyên" },
    { number_phone: "0969936076", full_name: "NGUYỄN THỊ PHƯƠNG ANH" },
    { number_phone: "0902588780", full_name: "Nguyen Thi Hoang Oanh" },
    { number_phone: "0772103926", full_name: "Đào Thanh Nhân" },
    { number_phone: "0789683374", full_name: "Lê Phú Hoà" },
    { number_phone: "0794714612", full_name: "Hà Ngô Quang Minh" },
    { number_phone: "0377921171", full_name: "Mai Gia Bảo" },
    { number_phone: "0898135240", full_name: "Phan Thanh Bình" },
    { number_phone: "0788200653", full_name: "Trương Thị Thuý Phương" },
    { number_phone: "0334806096", full_name: "Nguyễn văn lâm" },
    { number_phone: "0365435370", full_name: "Nguyễn Phương Mai" },
    { number_phone: "0326648998", full_name: "Nguyễn Hồng Quân" },
    { number_phone: "0365629897", full_name: "Tô Thanh cường" },
    { number_phone: "0828161459", full_name: "Cao Tuyến Trung" },
    { number_phone: "0566355042", full_name: "Nguyễn Hoàng Thái" },
    { number_phone: "0981981978", full_name: "NGUYỄN LÊ HOÀNG LÂN" },
    { number_phone: "0366718765", full_name: "Võ Mai Hùng Anh" },
    { number_phone: "0987524878", full_name: "Trần Hoàng quân" },
    { number_phone: "0918228175", full_name: "Hồ thị kiều linh" },
    { number_phone: "0865663164", full_name: "Tạ Đức Phúc" },
    { number_phone: "0329865712", full_name: "Hồ Thanh Hóa" },
    { number_phone: "0786078806", full_name: "Nguyễn minh khôi" },
    { number_phone: "0795747151", full_name: "Nguyễn Thành nhân" },
    { number_phone: "0973533995", full_name: "NGUYỄN VÕ TÙNG" },
    { number_phone: "0921327386", full_name: "Võ minh nghĩa" },
    { number_phone: "0931821812", full_name: "Phan Nhật Trường" },
    { number_phone: "0355037448", full_name: "Nguyễn Thị Lan Anh" },
    { number_phone: "0343158004", full_name: "Lê Minh Nhật" },
    { number_phone: "0931304810", full_name: "Nguyễn trúc quỳnh" },
    { number_phone: "0859650995", full_name: "LƯƠNG NGỌC VĨNH HUY" },
    { number_phone: "0328096064", full_name: "Bùi Phương Thảo" },
    { number_phone: "0366922860", full_name: "Lê Xuân dương" },
    { number_phone: "0387920961", full_name: "LÊ NHẬT QUanG" },
    { number_phone: "0985167128", full_name: "Nguyễn Hoàng Hiệp" },
    { number_phone: "0339456098", full_name: "Nguyễn Hữu Hiệp" },
    { number_phone: "0796829523", full_name: "Trần duy chương" },
    { number_phone: "0909202041", full_name: "Trần Quốc đạt" },
    { number_phone: "0907612423", full_name: "Đặng Hoàng Khang" },
    { number_phone: "0366333149", full_name: "Cao Nguyễn Anh Vũ" },
    { number_phone: "0336872678", full_name: "Hoàng Lan Anh" },
    { number_phone: "0708044741", full_name: "Trần Đoàn Gia Huân" },
    { number_phone: "0938993538", full_name: "Dương Ngọc Kim" },
    { number_phone: "0367460106", full_name: "Trần Minh nhựt" },
    { number_phone: "0848333937", full_name: "Đặng nguyên phương" },
    { number_phone: "0888211040", full_name: "Nguyễn Nhựt Khang Nhựt Khang" },
    { number_phone: "0965435451", full_name: "Trương Tấn Tài" },
    { number_phone: "0868756249", full_name: "Phan Nhật Huy" },
    { number_phone: "0559502422", full_name: "Đỗ Hoàng Long" },
    { number_phone: "0342892004", full_name: "Đào TRỌNG KHẢI" },
    { number_phone: "0902821908", full_name: "Mạch Chấn Giang" },
    { number_phone: "0937010816", full_name: "Võ Thị HỒng my" },
    { number_phone: "0789433919", full_name: "Lê Thu Thảo" },
    { number_phone: "0387385900", full_name: "Lục Thị Giang" },
    { number_phone: "0397809536", full_name: "Phạm Đình nam" },
    { number_phone: "0376903439", full_name: "Nguyễn Đình Trường" },
    { number_phone: "0582312139", full_name: "Trần thanh trà" },
    { number_phone: "0773061824", full_name: "Khổng Lê Minh" },
    { number_phone: "0983871703", full_name: "Lê Thu Phương" },
    { number_phone: "0949697898", full_name: "Ngô gia nhựt" },
    { number_phone: "0854568679", full_name: "Đỗ mạnh thịnh" },
    { number_phone: "0943890108", full_name: "MAI THỊ NGỌC YẾN" },
    { number_phone: "0765197885", full_name: "Dang Quoc Anh" },
    { number_phone: "0767207537", full_name: "LƯƠNG Ngọc quế chi" },
    { number_phone: "0334028875", full_name: "Nguyễn thanh tùng" },
    { number_phone: "0768013457", full_name: "Le Nhat Tan" },
    { number_phone: "0858091585", full_name: "Nguyễn Hà Quang Dũng" },
    { number_phone: "0384215606", full_name: "Huỳnh bẢO nGỌC" },
    { number_phone: "0908668603", full_name: "Trần Quốc anh" },
    { number_phone: "0365707425", full_name: "Trương quốc khánh" },
    { number_phone: "0825200539", full_name: "Nguyễn Đức Huy" },
    { number_phone: "0346770948", full_name: "Phạm Nguyễn hoàng tiến" },
    { number_phone: "0907713825", full_name: "Võ Viết Dũng" },
    { number_phone: "0905459342", full_name: "Nguyễn bảo minh hoàng" },
    { number_phone: "0395433185", full_name: "Ngô Tấn hậu" },
    { number_phone: "0397789739", full_name: "Nguyễn Phước Dũng" },
    { number_phone: "0385487636", full_name: "Đào thị Hoa" },
    { number_phone: "0911630090", full_name: "Trịnh công hiếu" },
    { number_phone: "0373352572", full_name: "Đỗ thành trung" },
    { number_phone: "0986226612", full_name: "Phạm Hải Hà" },
    { number_phone: "0942912209", full_name: "Vũ thái sơn" },
  ];

  // State cho số lượng record hiển thị
  const [backpackVisible, setBackpackVisible] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);

  // Khi mount, set sample cho balo nếu chưa có
  useEffect(() => {
    if (backpackList.length === 0) setBackpackList(backpackSample);
    // eslint-disable-next-line
  }, []);

  // Khi bấm XEM THÊM hoặc THU GỌN
  const handleToggleBackpack = () => {
    if (isExpanded) {
      // Thu gọn: chỉ hiển thị 10 record đầu
      setBackpackVisible(10);
      setIsExpanded(false);
      // Cuộn lên bảng balo
      setTimeout(() => {
        const table = document.querySelector(".backpack-prize__table-wrap");
        if (table) {
          table.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Mở rộng: hiển thị hết 100 record
      setBackpackVisible(backpackList.length);
      setIsExpanded(true);
    }
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
            <div className="backpack-prize__more">
              <button
                className="backpack-prize__more-btn"
                onClick={handleToggleBackpack}
              >
                {isExpanded ? "THU GỌN" : "XEM THÊM"}
              </button>
            </div>
          </div>

          {/* BÌNH NƯỚC GẤU OH-BEAR TINH NGHỊCH (prizeId = 4) */}
          <div className="backpack-prize">
            <div className="backpack-prize__title">
              BÌNH NƯỚC GẤU OH-BEAR TINH NGHỊCH
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
            <div className="backpack-prize__more">
              <button className="backpack-prize__more-btn">XEM THÊM</button>
            </div>
          </div>

          {/* TÚI XẾP TIỆN LỢI (prizeId = 5) */}
          <div className="backpack-prize">
            <div className="backpack-prize__title">TÚI XẾP TIỆN LỢI</div>

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
