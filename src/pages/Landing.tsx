import React, { useState, useRef, useEffect } from "react";
import "../styles/landing.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import lcpIcon from "../assets/lcpIcon.png";
import giaiNhat from "../assets/giaiNhat.png";
import giaiNhi from "../assets/giaiNhi.png";
import giaiBa from "../assets/giaiBa.png";
import giaiBaMobile from "../assets/giaiBaMobile.png";
import viettravel from "../assets/VIETRAVEL.png";
import starlux from "../assets/STARLUX.png";
import chinaAir from "../assets/CHINA.png";
import evaAir from "../assets/EVA.png";

import teamCFO from "../assets/CFO.png";
import teamGAM from "../assets/GAM.png";
import teamTSW from "../assets/TSW.png";
import teamMVKE from "../assets/MVKE.png";
import teamPSG from "../assets/PSG.png";
// import teamDFM from "../assets/DFM.png";

import slide1 from "../assets/TTA_PIC_ENGAGE.jpg";
import slide2 from "../assets/TTA_PIC_SHARE.jpg";
import slide3 from "../assets/TTA_PIC_DISCOVER.jpg";
import slide4 from "../assets/TTA_PIC_ENJOY.jpg";

import vid1 from "../assets/videos/videos_full.mp4";

import { Toaster, toast } from "sonner";

const Landing: React.FC = () => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isInView, setIsInView] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const teams = [
    { id: 1, name: "CFO", img: teamCFO },
    { id: 2, name: "GAM", img: teamGAM },
    { id: 3, name: "TSW", img: teamTSW },
    { id: 4, name: "MVKE", img: teamMVKE },
    { id: 5, name: "PSG", img: teamPSG },
    // { id: 6, name: "DFM", img: teamDFM },
  ];

  useEffect(() => {
    const videoElement = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (videoElement) {
            videoElement.muted = true;
            videoElement.play();
          }
        } else {
          setIsInView(false);
          if (videoElement) {
            videoElement.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const handleTeamSelect = (id: number) => {
    setSelectedTeamId(id);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget; // Lưu reference trước khi async
    const fd = new FormData(formElement);
    const data = {
      full_name: fd.get("name") as string,
      number_phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      address: fd.get("address") as string,
    };

    const newErrors = {
      name: "",
      phone: "",
      email: "",
      address: "",
    };

    // Validate name
    if (!data.full_name.trim()) {
      newErrors.name = "Họ và tên là bắt buộc.";
    }

    // Validate phone
    if (!data.number_phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc.";
    } else if (
      data.number_phone.length !== 10 ||
      !/^\d+$/.test(data.number_phone)
    ) {
      newErrors.phone = "Số điện thoại phải có đúng 10 chữ số.";
    }

    // Validate email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    // Validate address
    if (!data.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((e) => e)) {
      return;
    }

    if (!selectedTeamId) {
      toast.error("Vui lòng chọn đội chiến thắng", { position: "top-right" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://be.dudoanchungketlcp-tta.vn/api/member",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: data.full_name,
            number_phone: data.number_phone,
            email: data.email,
            address: data.address,
            team_id: selectedTeamId,
          }),
        }
      );

      const result = await response.json();
      
      // Debug: log response để kiểm tra
      console.log("API Response:", result);

      // Kiểm tra trường hợp số điện thoại đã được đăng ký
      if (!result.status && result.message === "Số điện thoại này đã được đăng ký") {
        toast.error("Số điện thoại đã được sử dụng. Vui lòng sử dụng số khác", {
          position: "top-right",
        });
        return;
      }

      // Kiểm tra success
      if (result.status === true) {
        toast.success("Gửi dự đoán thành công! Chúc bạn may mắn!", {
          position: "top-right",
        });
        
        // Reset form và đội được chọn khi submit thành công
        setSelectedTeamId(null);
        setErrors({ name: "", phone: "", email: "", address: "" });
        
        // Reset form fields - sử dụng formElement đã lưu
        if (formElement) {
          formElement.reset();
        }
      } else {
        // Trường hợp khác (không phải success hoặc duplicate phone)
        toast.error(result.message || "Có lỗi xảy ra. Vui lòng thử lại!", {
          position: "top-right",
        });
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi kết nối. Vui lòng thử lại!", {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors />
      <main>
        <div id="home">
          <section className="landing-banner">
            <div className="landing-banner__container">
              <h1 className="landing-banner__title">
                <span className="landing-banner__title-line">DỰ ĐOÁN ĐỘI</span>
                <span className="landing-banner__title-line">CHIẾN THẮNG</span>
              </h1>
              <div className="landing-banner__sub">
                <div className="landing-banner__subtitle">CHUNG KẾT</div>
                <img
                  className="landing-banner__logo"
                  src={lcpIcon}
                  alt="League of Legends Championship Pacific"
                  width={499}
                  height={196}
                />
              </div>
            </div>
            <div className="landing-banner__marquee">
              <div className="landing-banner__marquee-content">
                LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG ĐƯƠNG ĐẦU
                &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; 為此而生
                &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG
                ĐƯƠNG ĐẦU &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp;
                為此而生 &nbsp;
              </div>
            </div>
          </section>

          <section className="landing-prizes">
            <div className="landing-prizes__container container">
              <div className="landing-prizes__top-row">
                <img
                  src={giaiNhat}
                  alt="Giải nhất"
                  className="prize-image prize-image--nhat"
                />
                <img
                  src={giaiNhi}
                  alt="Giải nhì"
                  className="prize-image prize-image--nhi"
                />
              </div>
              {/* Desktop: Giải Ba gốc */}
              <img
                src={giaiBa}
                alt="Giải ba"
                className="prize-image prize-image--ba prize-image--desktop"
              />
              
              {/* Mobile: Giải Ba phiên bản mobile */}
              <img
                src={giaiBaMobile}
                alt="Giải ba"
                className="prize-image prize-image--ba prize-image--mobile"
              />
            </div>
          </section>
        </div>

        <section className="landing-vote">
          <div className="container landing-vote__container">
            {/* <button className="vote-cta">VOTE NGAY!</button> */}

            <div className="sponsors" aria-label="Nhà tài trợ">
              <div className="sponsor__title">NHÀ TÀI TRỢ</div>
              <div className="sponsor__logo">
                <a
                  href="https://travel.com.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={viettravel} alt="Vietravel" className="sponsor" />
                </a>
                <img src={evaAir} alt="EVA Air" className="sponsor" />
                <img src={chinaAir} alt="China Airlines" className="sponsor" />
                <img src={starlux} alt="Starlux" className="sponsor" />
              </div>
            </div>
          </div>
        </section>

        {/* slider section (images) */}
        <section className="landing-swiper">
          <div className="container landing-swiper__container">
            <div className="landing-swiper__stage">
              <Swiper
                modules={[Navigation, Autoplay]}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                slidesPerView={1}
                navigation={{
                  nextEl: ".custom-swiper-next",
                  prevEl: ".custom-swiper-prev",
                }}
                onBeforeInit={(swiper: any) => {
                  swiper.params.navigation.prevEl = ".custom-swiper-prev";
                  swiper.params.navigation.nextEl = ".custom-swiper-next";
                }}
              >
                <SwiperSlide>
                  <img
                    src={slide1}
                    alt="slide1"
                    className="landing-slide-img"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={slide2}
                    alt="slide2"
                    className="landing-slide-img"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={slide3}
                    alt="slide3"
                    className="landing-slide-img"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={slide4}
                    alt="slide4"
                    className="landing-slide-img"
                  />
                </SwiperSlide>
              </Swiper>
              <button
                className="custom-swiper-prev"
                aria-label="Previous"
              ></button>
              <button className="custom-swiper-next" aria-label="Next"></button>
            </div>
          </div>
        </section>

        {/* predict form section */}
        <section className="landing-form" id="vote">
          <div className="landing-form__container">
            <div className="predict-cta">
              <div className="predict-cta__title">DỰ ĐOÁN ĐỘI CHIẾN THẮNG</div>

              <div className="predict-cta__subtitle">
                <span className="predict-cta__subtitle-line">
                  CLICK vào đội bạn dự đoán
                </span>
                <span className="predict-cta__subtitle-line">
                  sẽ là quán quân
                </span>
                <span className="predict-cta__subtitle-line">
                  điền form và chọn SUBMIT
                </span>
              </div>


              {/* FORM + TERMS */}
              <div className="predict-form">
                <form
                  className="predict-form__form"
                  onSubmit={handleSubmit}
                  aria-label="Dự đoán form"
                >
                  {/* Teams selection */}
                  <div className="teams-grid" role="list">
                    {teams.map((team) => (
                      <div
                        key={team.id}
                        className={`team-card ${
                          selectedTeamId === team.id ? "selected" : ""
                        }`}
                        role="listitem"
                        aria-label={team.name}
                        onClick={() => handleTeamSelect(team.id)}
                      >
                        <img src={team.img} alt={team.name} />
                      </div>
                    ))}
                  </div>

                  {/* Form fields */}
                  <div className={`form-row ${errors.name ? "has-error" : ""}`}>
                    <div className="field-label">
                      <div className="field-label__title">HỌ VÀ TÊN *</div>
                      <div className="field-label__subtitle">
                        Viết đầy đủ theo giấy tờ để đối chiếu trao giải
                      </div>
                    </div>
                    <div className="field-input">
                      <input
                        name="name"
                        type="text"
                        className="input--orange input--ghost"
                      />
                    </div>
                  </div>
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}

                  <div
                    className={`form-row ${errors.phone ? "has-error" : ""}`}
                  >
                    <div className="field-label">
                      <div className="field-label__title">SỐ ĐIỆN THOẠI *</div>
                      <div className="field-label__subtitle">
                        Mỗi cá nhân chỉ sử dụng 1 số điện thoại
                      </div>
                    </div>
                    <div className="field-input">
                      <input
                        name="phone"
                        type="tel"
                        className="input--orange input--ghost"
                      />
                    </div>
                  </div>
                  {errors.phone && (
                    <div className="error-message">{errors.phone}</div>
                  )}

                  <div
                    className={`form-row ${errors.email ? "has-error" : ""}`}
                  >
                    <div className="field-label">
                      <div className="field-label__title">EMAIL CÁ NHÂN</div>
                      <div className="field-label__subtitle">
                        Không bắt buộc
                      </div>
                    </div>
                    <div className="field-input">
                      <input
                        name="email"
                        type="email"
                        className="input--orange input--ghost"
                      />
                    </div>
                  </div>
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}

                  <div
                    className={`form-row ${errors.address ? "has-error" : ""}`}
                  >
                    <div className="field-label">
                      <div className="field-label__title">
                        ĐỊA CHỈ NHẬN QUÀ *
                      </div>
                      <div className="field-label__subtitle">
                        Vui lòng cung cấp địa chỉ trước khi sáp nhập
                      </div>
                    </div>
                    <div className="field-input">
                      <input
                        name="address"
                        type="text"
                        className="input--orange input--ghost"
                      />
                    </div>
                  </div>
                  {errors.address && (
                    <div className="error-message">{errors.address}</div>
                  )}

                  <div className="form-actions"  >
                    <button
                      type="submit"
                      className="predict-form__submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang gửi..." : "Submit"}
                    </button>
                  </div>
                </form>

                <div
                
                  className="predict-terms"
                  role="region"
                  aria-label="Điều kiện và điều khoản"
                 
                >
                  <h3 id="terms" className="predict-terms__title">
                    ĐIỀU KIỆN &amp; ĐIỀU KHOẢN
                  </h3>

                  <div className="predict-terms__inner">
                    {/* Nội dung dài sẽ nằm bên trong khung scroll 200px */}
                    <p>
                      <strong>
                        THỂ LỆ TRÒ CHƠI "BÌNH CHỌN ĐỘI CHIẾN THẮNG CHUNG KẾT LCP
                        2025"
                      </strong>
                      <br />
                      <br />
                      <strong>Tên trò chơi:</strong> "BÌNH CHỌN ĐỘI CHIẾN THẮNG
                      CHUNG KẾT LCP 2025"
                      <br />
                      <br />
                      <strong>Phạm vi và thời gian tổ chức:</strong>
                      <br />
                      Chương trình diễn ra trên toàn lãnh thổ Việt Nam.
                      <br />
                      Diễn ra trên website chính thức của Cục Du lịch Đài Loan
                      văn phòng tại Thành phố Hồ Chí Minh về <strong style={{color:'red'}}>LCP 2025 - Giải đấu
                      vô địch LMHT khu vực Châu Á - Thái Bình Dương (APAC)
                      https://dudoanchungketlcp-tta.vn</strong>
                      <br />
                      Thời gian thực hiện: <strong style={{color:'red'}}>Từ 20h00 ngày 09/09/2025 đến 16:30
                      ngày 21/09/2025</strong>
                      <br />
                      <br />
                      <strong>Đối tượng và điều kiện tham gia:</strong>
                      <br />
                      Công dân có quốc tịch Việt Nam hiện đang cư trú trên phạm
                      vi lãnh thổ Việt Nam.
                      <br />
                      Trường hợp công dân tham gia chương trình chưa đủ 18 tuổi
                      phải có sự đồng ý của người giám hộ (ba, mẹ hoặc người
                      thân trong gia đình từ 18 trở lên) và giấy tờ tùy thân
                      (CMND/CCCD/hộ chiếu) trong trường hợp nhận thưởng.
                      <br />
                      Sau đây được gọi là "Người tham gia".
                      <br />
                      <br />
                      <strong>Nội dung chương trình:</strong>
                      <br />
                      <strong>Cách thức tham gia:</strong>
                      <br />
                      👌 Bước 1: Truy cập website
                      https://dudoanchungketlcp-tta.vn
                      <br />
                      👌 Bước 2: Bình chọn cho đội bạn dự đoán giành chiến thắng
                      LCP 2025 - Giải đấu vô địch <strong style={{color:'red'}}>LMHT khu vực Châu Á - Thái
                      Bình Dương (APAC) </strong> được tổ chức tại Cung Thể thao Tiên Sơn
                      - Đà Nẵng vào chiều tối ngày 21/9/2025
                      <br />
                      Cách thức bình chọn: Ấn chọn vào 1 trong 6 đội hiển thị
                      trên màn hình website
                      <br />
                      👌Bước 3: Cung cấp thông tin để quay số trúng giải và liên
                      hệ khi trao giải:
                      <br />
                      Họ và tên: vui lòng cung cấp họ tên đầy đủ theo CCCD để
                      đối chiếu trao giải
                      <br />
                      Số điện thoại: Số điện thoại di động cá nhân chính chủ
                      <br />
                      Email cá nhân: Không bắt buộc
                      <br />
                      Địa chỉ nhận quà: Vui lòng cung cấp địa chỉ trước sáp nhập
                      <br />
                      (*Lưu ý: Số điện thoại tham gia ứng với mỗi người chơi là
                      duy nhất. 1 số điện thoại được phép tham gia 1 lần)
                      <br />
                      <br />
                      <strong>Điều kiện của bài tham gia hợp lệ:</strong>
                      <br />
                      Lượt tham gia hợp lệ là lượt tham gia mà người chơi thực
                      hiện đủ 3 bước đã nêu trên theo thể lệ của Ban Tổ Chức
                      (BTC). Nếu thiếu 1 trong 3 bước trên, coi như lượt chơi
                      sẽ bị loại.
                      <br />
                      Lượt tham gia được thực hiện trong khung thời gian quy
                      định <strong style={{color:'red'}}>(từ 20h00 ngày 09/09/2025 đến 16:30 ngày 21/09/2025) </strong>
                       sẽ được xem là hợp lệ. Các lượt tham gia ngoài khoảng thời
                      gian này sẽ không được tính.
                      <br />
                      Số điện thoại tham gia phải là số điện thoại chính chủ và
                      còn tồn tại đến hết thời gian trao giải.
                      <br />
                      Người chơi không được sử dụng số điện thoại của người khác
                      (trừ trường hợp người tham gia chưa đủ 18 tuổi và sử dụng
                      số điện thoại của người giám hộ. Trường hợp này sẽ cần các
                      chứng từ chứng thực: CCCD, hộ khẩu,... theo yêu cầu cụ thể
                      tương ứng của Cục Du lịch Đài Loan văn phòng tại Thành phố
                      Hồ Chí Minh khi người chơi nhận giải).
                      <br />
                      <br />
                      <strong>
                        3. Cơ cấu giải thưởng và tiêu chí chấm giải:
                      </strong>
                      <br />
                      <strong>3.1 Cơ cấu giải thưởng:</strong>
                      <br />
                      01 giải Nhất: 01 Chuyến đi Đài Loan trị giá 13 triệu đồng
                      + 01 Vé vào cổng LCP cho mùa giải 2026 được tổ chức tại
                      Đài Loan
                      <br />
                      03 giải Nhì: mỗi giải 01 Vé máy bay khứ hồi đến Đài Loan +
                      01 Vé vào cổng LCP cho mùa giải 2026 được tổ chức tại Đài
                      Loan
                      <br />
                      300 giải Ba: Mỗi giải được nhận ngẫu nhiên 01 trong 03 món
                      quà sau:
                      <br />
                      100 Balo du lịch
                      <br />
                      100 Bình nước Gấu Oh-bear tinh nghịch
                      <br />
                      100 Túi xếp tiện lợi
                      <br />
                      <br />
                      <strong>3.2 Tiêu chí chấm giải:</strong>
                      <br />
                      Người chơi có dự đoán đúng đội chiến thắng <strong style={{color:"red"}}>LCP 2025 - Giải
                      đấu vô địch LMHT khu vực Châu Á - Thái Bình Dương (APAC) </strong>
                       được tổ chức tại Cung Thể thao Tiên Sơn - Đà Nẵng vào
                      chiều tối ngày 21/9/2025
                      <br />
                      Các giải được quay số may mắn trực tiếp vào 9h sáng ngày
                      22/09/2025 tại website
                      <br />
                      *Lưu ý:
                      <br />
                      ▪️ Kết quả quay số được thực hiện và công bố trực tiếp
                      trên website
                      <br />
                      ▪️ Trong mọi trường hợp tranh chấp, quyết định cuối cùng
                      thuộc về Ban Tổ Chức. BTC có thể loại bỏ những lượt tham
                      gia có nghi vấn gian lận mà không cần thông báo đến người
                      tham dự.
                      <br />
                      <br />
                      <strong>5. Cách thức công bố và trao thưởng:</strong>
                      <br />
                      Kết quả người thắng giải được <strong style={{color:"red"}}>thực hiện và công bố dự kiến
                      vào 9 giờ sáng ngày 22/09/2025 tại website
                      https://dudoanchungketlcp-tta.vn</strong>. Sau đó, cũng sẽ được
                      công bố bên dưới phần bình luận của bài đăng thông báo
                      cuộc thi trên fanpage của Cục Du lịch Đài Loan văn phòng
                      tại Thành phố Hồ Chí Minh
                      <br />
                      <strong>Người Tham Gia trúng giải:</strong>
                      <br />
                      <strong style={{color:"red"}}>
                        Đối với người tham gia trúng Giải 1 và Giải 2:
                      </strong>{" "}
                      Trong vòng 14 ngày kể từ ngày công bố kết quả, người thắng
                      giải cung cấp thông tin cho BTC qua cổng thông tin mà BTC
                      sẽ thông báo kèm với tin công bố danh sách. Các thông tin
                      bao gồm:
                      <br />
                      Họ và tên
                      <br />
                      Địa chỉ
                      <br />
                      Số điện thoại
                      <br />
                      Ảnh chụp 2 mặt chứng minh nhân dân / căn cước công dân /
                      hộ chiếu để định danh.
                      <br />
                      <strong style={{color:"red"}}>Đối với người tham gia trúng Giải 3:</strong>{" "}
                      <strong style={{color:"red"}}>Trong vòng 20 ngày kể từ ngày công bố kết quả, BTC sẽ liên
                      hệ qua số điện thoại cung cấp trước đó để xác nhận địa chỉ
                      nhận quà theo thứ tự danh sách trúng thưởng. Vui lòng lưu
                      ý nhận điện thoại từ số hotline của BTC sẽ được thông báo
                      kèm với tin công bố danh sách.</strong>
                      <br />
                      <strong style={{color:"red"}}>Giải thưởng sau khi được BTC liên hệ trực tiếp người thắng
                      giải để thông báo hình thức trao giải, sẽ được tiến hành
                      chuyển phát trao giải trong vòng 20 ngày kể từ ngày xác
                      nhận thông tin nhận giải.</strong> Mọi vấn đề thất lạc do người
                      thắng giải cung cấp sai thông tin, BTC sẽ không chịu trách
                      nhiệm hoàn trả.
                      <br />
                      Trong trường hợp đã quá thời gian nêu trên, nếu BTC vẫn
                      chưa nhận được thông tin người trúng giải thì giải thưởng
                      sẽ bị hủy bỏ.
                      <br />
                      Trong trường hợp người thắng giải không nhận điện thoại và
                      các hình thức liên lạc khác từ đơn vị vận chuyển của Ban
                      tổ chức thì giải thưởng sẽ bị hủy bỏ.
                      <br />
                      BTC không có nhiệm vụ và trách nhiệm phải cung cấp công
                      khai ghi hình quá trình quay số của người trúng giải
                      <br />
                      Lưu ý: Giải thưởng không được quy đổi thành tiền mặt.
                      <br />
                      <br />
                      <strong>6. Điều Kiện sử dụng các giải thưởng:</strong>
                      <br />
                      <strong>A. Đối với Chuyến đi Đài Loan</strong>
                      <br />
                      i/. Người trúng giải phải mang quốc tịch Việt Nam.
                      <br />
                      ii/. Phần quà được trao dưới dạng voucher tour Đài Loan có
                      trị giá 13 triệu đồng dành cho 01 khách từ Vietravel.
                      Voucher có thể dùng để đổi một chuyến đi Đài Loan trong
                      các gói tour sẵn có của Vietravel, nếu chọn gói tour có
                      giá tiền cao hơn sẽ phải bù tiền, nếu chọn gói có giá tiền
                      thấp hơn thì không được hoàn lại thành tiền mặt.
                      <br />
                      iii/. Voucher có giá trị sử dụng và quy đổi trong vòng 01
                      năm tính từ ngày 01/09/2025
                      <br />
                      iv/. Voucher chưa bao gồm tiền tip và tiền phụ thu phòng
                      đơn
                      <br />
                      v/. Voucher không được quy đổi thành tiền mặt.
                      <br />
                      <br />
                      <strong>B. Đối với vé vào cổng LCP</strong>
                      <br />
                      - Được áp dụng cho mùa LCP năm 2026 tổ chức tại Đài Loan.
                      <br />
                      - Vé vào cổng sẽ được gửi đến user trúng giải ngay khi có
                      thông tin mở bán vé chính thức cho sự kiện từ BTC.
                      <br />
                      <br />
                      <strong>C. Đối với Vé máy bay</strong>
                      <br />
                      i/. Vé máy bay khứ hồi của ba hãng hàng không sẽ được phát
                      ngẫu nhiên cho người chơi thắng cuộc
                      <br />
                      ii/. Vé chỉ sử dụng dành cho các chuyến bay khứ hồi từ
                      Việt Nam đến Đài Loan của ba hãng hàng không EVA Air,
                      China Airlines, STARLUX.
                      <br />
                      iii/. Thời hạn và quy định sử dụng sẽ được quyết định bởi
                      ba hãng hàng không EVA Air, China Airlines, STARLUX.
                      <br />
                      <br />
                      <strong>7. Quy định chung tham gia chương trình:</strong>
                      <br />
                      Nếu trường hợp Người tham gia bị khóa số điện thoại liên
                      lạc hoặc số điện thoại bị mất khả năng liên hệ, Người tham
                      gia sẽ bị xem xét loại khỏi chương trình và tước giải
                      thưởng ở bất kỳ giai đoạn nào, kể cả sau khi đã trao giải.
                      <br />
                      Trong trường hợp có bất kỳ tranh chấp nào phát sinh, quyết
                      định của BTC sẽ là quyết định cuối cùng.
                      <br />
                      Người tham gia không được có các hành vi gian lận, cung
                      cấp sai thông tin cá nhân.
                      <br />
                      Cuộc thi tuân thủ nghiêm chỉnh các quy định của pháp luật
                      Việt Nam. Trong trường hợp có tranh chấp xảy ra, BTC có
                      quyền quyết định dựa trên nội dung chương trình và pháp
                      luật Việt Nam hiện hành.
                      <br />
                      Thể lệ chương trình có thể được điều chỉnh trong suốt quá
                      trình cuộc thi diễn ra để phù hợp với tình hình thực tế và
                      đảm bảo công bằng cho người tham gia.
                      <br />
                      Trong trường hợp có sự tranh chấp giải thưởng, BTC và các
                      đơn vị có liên quan không đứng ra giải quyết.
                      <br />
                      <br />
                      <strong>Quyền và trách nhiệm của người tham gia:</strong>
                      <br />
                      Bằng cách tham gia chương trình, Người tham gia đồng ý và
                      tuân theo quy định của bản thể lệ này. Bất kỳ Người tham
                      gia nào vi phạm những quy định và thể lệ của chương trình
                      đều sẽ bị loại và sẽ bị xem xét không được quyền tham gia
                      các chương trình khác do fanpage Cục du lịch Đài Loan tổ chức. Nếu được
                      trúng giải cũng sẽ bị tước giải thưởng theo quyết định của
                      BTC.
                      <br />
                      Người tham gia phải đảm bảo tính xác thực thông tin, nếu
                      cung cấp thông tin không đúng sự thật cho BTC, người tham
                      gia sẽ bị xem xét loại khỏi chương trình và tước giải
                      thưởng ở bất kỳ giai đoạn nào, kể cả sau khi đã trao giải
                      và phải chịu hoàn toàn trách nhiệm trước pháp luật.
                      <br />
                      Người tham gia cam kết và chịu trách nhiệm về bình luận
                      của mình, đảm bảo các quyền hợp pháp khác liên quan đối
                      với bình luận được tạo ra, đảm bảo các quyền này không xâm
                      phạm bất kỳ quyền hợp pháp khác của bất kỳ cá nhân, tổ
                      chức nào.
                      <br />
                      Trong suốt và sau quá trình diễn ra Chương trình, Người
                      tham gia không được đưa ra bất kỳ bình luận chỉ trích hoặc
                      ý kiến nhận định cá nhân nào liên quan đến Chương trình và
                      về các ý kiến bình luận phê bình khác do các bên thứ ba
                      đưa ra đối với lượt tham gia của mình trên bất kỳ phương
                      tiện thông tin truyền thông nào mà có khả năng sẽ gây ra
                      thiệt hại đến tài sản và uy tín của BTC cũng như Cục Du
                      lịch Đài Loan văn phòng tại Thành phố Hồ Chí Minh hoặc
                      Người tham gia khác.
                      <br />
                      Các bình luận tại bài đăng công bố trò chơi trên fanpage
                      Facebook không được có các thông tin, hình ảnh nhằm:
                      khuyến khích uống rượu, bia; thông tin rượu, bia có tác
                      dụng tạo sự trưởng thành, thành đạt, thân thiện, hấp dẫn
                      về giới tính; hướng đến trẻ em, học sinh, sinh viên, thanh
                      niên, phụ nữ mang thai.
                      <br />
                      Người tham gia bình luận đồng nghĩa với việc chấp thuận
                      thể lệ trò chơi này. Bằng cách tham gia, người tham gia
                      đồng ý rằng Ban tổ chức của Chương trình và/hoặc Cục Du
                      lịch Đài Loan văn phòng tại Thành phố Hồ Chí Minh có quyền
                      sử dụng hình ảnh, bài viết, tên tuổi hay là bất kỳ thông
                      tin cá nhân nào khác mà người tham gia Chương trình đã
                      cung cấp cho BTC cho các mục đích nằm trong khuôn khổ
                      Chương Trình này, bao gồm nhưng không giới hạn quảng cáo,
                      truyền thông, giới thiệu cho Chương trình, mà không phải
                      có thêm bất kỳ sự chấp thuận nào khác cũng như thanh toán
                      bất kỳ khoản chi phí nào liên quan cho Người tham gia.
                      <br />
                      Người tham gia đoạt giải phải đảm bảo tuân thủ thời gian
                      và sự sắp xếp của BTC trong quá trình nhận giải. Người
                      thắng giải phải chịu mọi chi phí (nếu có) liên quan đến
                      việc nhận thưởng bao gồm nhưng không giới hạn thuế thu
                      nhập cá nhân đối với giải thưởng, chi phí đi lại để nhận
                      thưởng, chi phí chuyển phát quà tặng…
                      <br />
                      Chủ động cập nhật thể lệ Chương Trình trên trang Fanpage
                      Cục Du lịch Đài Loan văn phòng tại Thành phố Hồ Chí Minh,
                      các thông báo từ BTC thông qua các kênh thông tin được
                      Người Tham gia cung cấp.
                      <br />
                      <br />
                      <strong>Quyền và trách nhiệm của BTC:</strong>
                      <br />
                      BTC có quyền loại bỏ bất kỳ lượt tham gia trò chơi nào mà
                      không cần báo trước khi Người tham gia thực hiện những
                      hành động gây ảnh hưởng đến kết quả trung thực của cuộc
                      thi, hoặc vi phạm thể lệ cuộc thi đã được BTC quy định.
                      <br />
                      Trường hợp bất khả kháng như thiên tai, hoả hoạn, hư hỏng
                      máy chủ,... làm thất thoát dữ liệu đăng ký của Người tham
                      gia; BTC giữ quyền quyết định thay đổi hoặc hủy bỏ chương
                      trình và thông báo với Người tham gia dự thi trong thời
                      gian sớm nhất.
                      <br />
                      BTC có quyền sửa đổi, bổ sung thể lệ trong suốt quá trình
                      cuộc thi diễn ra để phù hợp với tình hình thực tế và đảm
                      bảo công bằng cho người tham gia.
                      <br />
                      Trong mọi trường hợp, quyết định của BTC là quyết định
                      cuối cùng. Mọi người tham gia (hoặc có liên quan) đều cần
                      tuân theo quyết định cuối cùng của BTC
                      <br />
                      BTC sẽ không chịu bất kỳ trách nhiệm nào nếu người nhận
                      giải gửi thông tin không đầy đủ theo quy định của thể lệ
                      và/hoặc không chính xác, gian lận. BTC sẽ không chịu trách
                      nhiệm đối với việc giải thưởng bị thất lạc do thông tin
                      Người tham gia cung cấp không chính xác, thiếu thông tin
                      hoặc không liên lạc được với Người tham gia khi nhân viên
                      trao giải thưởng đến giao quà.
                      <br />
                      BTC sẽ trao giải cho người thắng giải thưởng khi chương
                      trình kết thúc, người tham gia tự bảo quản Phiếu mua
                      hàng/thông tin giao hàng, và không tiết lộ cho người khác.
                      BTC sẽ không chịu bất kỳ trách nhiệm nào nếu Phiếu mua
                      hàng/thông tin giao hàng bị tiết lộ sau khi hoàn thành
                      việc giao nhận Phiếu mua hàng/quà tặng cho người thắng
                      giải.
                      <br />
                      Nếu có bất kỳ thay đổi nào về thể lệ của Chương trình, BTC
                      sẽ cập nhật và thông báo trên trang fanpage Cục Du lịch
                      Đài Loan văn phòng tại Thành phố Hồ Chí Minh và website
                      [link website].
                      <br />
                      BTC có toàn quyền sử dụng thông tin cá nhân người tham
                      gia; sử dụng, sao chép, sửa đổi, cắt ghép, cải biên hình
                      ảnh bài dự thi; truyền đạt hình ảnh hoặc một phần hình ảnh
                      với mục đích truyền thông, quảng cáo thương mại trên các
                      kênh truyền thông liên quan đến Cục Du lịch Đài Loan văn
                      phòng tại Thành phố Hồ Chí Minh mà không cần thông báo đến
                      người tham gia.
                      <br />
                      <br />
                      <strong>
                        VII. Chính sách về quyền riêng tư và bảo mật của BTC:
                      </strong>
                      <br />
                      Bằng việc tham gia Chương Trình và cung cấp các dữ liệu cá
                      nhân của mình, Người tham gia đồng ý với các Điều Kiện và
                      Điều Khoản của chương trình và cho phép BTC thu thập và xử
                      lý dữ liệu thông tin cá nhân của người tham gia ("Chủ Thể
                      Dữ Liệu"), cũng như việc chia sẻ thông tin dựa trên theo
                      chính sách dưới đây:
                      <br />
                      <br />
                      <strong>1. Loại dữ liệu cá nhân được xử lý:</strong>
                      <br />
                      - Hình ảnh, video của Chủ Thể Dữ Liệu khi tham gia chương
                      trình….
                      <br />
                      - Họ, chữ đệm và tên khai sinh;
                      <br />
                      - Ngày, tháng, năm sinh;
                      <br />
                      - Giới tính;
                      <br />
                      - Nơi sinh, nơi đăng ký khai sinh, nơi thường trú, nơi tạm
                      trú, nơi ở hiện tại, quê quán; địa chỉ liên hệ;
                      <br />
                      - Số điện thoại;
                      <br />
                      - Địa chỉ email;
                      <br />
                      - Số chứng minh nhân dân, số định danh cá nhân, số hộ
                      chiếu.
                      <br />
                      - Mã số thuế cá nhân;
                      <br />
                      - Dữ liệu cá nhân phản ánh hoạt động, lịch sử hoạt động
                      trên không gian mạng;
                      <br />
                      <br />
                      <strong>2. Mục đích sử dụng:</strong>
                      <br />
                      - Liên lạc, trao đổi thông tin với Chủ Thể Dữ Liệu liên
                      quan đến Chương Trình;
                      <br />
                      - Lưu trữ Dữ Liệu Cá Nhân nhằm mục đích phục vụ cho hoạt
                      động quảng cáo nhãn hàng sản phẩm thuộc Cục Du lịch Đài
                      Loan văn phòng tại Thành phố Hồ Chí Minh.
                      <br />
                      - Thực hiện các chỉ thị, yêu cầu, nghĩa vụ pháp lý theo
                      quy định pháp luật và/hoặc yêu cầu hiện hành từ bất kỳ cơ
                      quan có thẩm quyền địa phương, bao gồm cơ quan quản lý,
                      chính phủ, thuế và thực thi pháp luật hoặc các cơ quan có
                      thẩm quyền khác;
                      <br />
                      - Sử dụng hình ảnh, nội dung, thông tin người thắng giải
                      cho mục đích truyền thông nội bộ và truyền thông trên tất
                      cả các nền tảng online và offline.
                      <br />
                      <br />
                      <strong>3. Cách thức xử lý:</strong> Dữ Liệu Cá Nhân sẽ
                      được thu thập, ghi, phân tích, xác nhận, lưu trữ, chỉnh
                      sửa, công khai, kết hợp, truy cập, truy xuất, thu hồi, mã
                      hóa, giải mã, sao chép, chia sẻ, truyền đưa, cung cấp,
                      chuyển giao, xóa, hủy dữ liệu cá nhân hoặc các hành động
                      khác có liên quan.
                      <br />
                      <br />
                      <strong>
                        4. Thời gian bắt đầu, thời gian kết thúc xử lý dữ liệu:
                      </strong>
                      <br />
                      Dữ Liệu Cá Nhân được xử lý tại thời điểm Chủ Thể Dữ Liệu
                      cung cấp cho BTC thông qua việc cung cấp thông tin trong
                      quá trình tham gia chiến dịch và kết thúc xử lý trong thời
                      hạn 10 năm kể từ thời điểm được thu thập hoặc tại thời
                      điểm BTC nhận được yêu cầu hủy bỏ từ Chủ Thể Dữ Liệu.
                      <br />
                      <br />
                      <strong>5. Quyền và nghĩa vụ của Chủ Thể Dữ Liệu</strong>
                      <br />
                      <strong>a. Quyền của Chủ Thể Dữ Liệu</strong>
                      <br />
                      - Tự điều chỉnh hoặc yêu cầu Bên Xử Lý Dữ Liệu điều chỉnh
                      Dữ Liệu Cá Nhân khi Chủ Thể Dữ Liệu nhận thấy Dữ Liệu Cá
                      Nhân của tôi không chính xác;
                      <br />
                      - Được quyền rút lại một phần hoặc toàn bộ sự đồng ý của
                      Chủ Thể Dữ Liệu và yêu cầu Bên Xử Lý Dữ Liệu xóa Dữ Liệu
                      Cá Nhân của Chủ Thể Dữ Liệu đã được cung cấp cho Bên Xử Lý
                      Dữ Liệu;
                      <br />
                      - Yêu cầu Bên Xử Lý Dữ Liệu hỗ trợ thông báo đến cơ quan
                      chức năng có thẩm quyền trong trường hợp Dữ Liệu Cá Nhân
                      của Chủ Thể Dữ Liệu bị bên thứ ba xâm phạm bất hợp pháp
                      gây ra thiệt hại cho Chủ Thể Dữ Liệu;
                      <br />
                      - Khiếu nại đến Bên Xử Lý Dữ Liệu về việc lộ Dữ Liệu Cá
                      Nhân và yêu cầu Bên Xử Lý Dữ Liệu phản hồi, giải trình về
                      việc lộ Dữ Liệu Cá Nhân (nếu có);
                      <br />
                      - Các quyền khác theo quy định tại Bản Xác Nhận này và quy
                      định của pháp luật.
                      <br />
                      <br />
                      <strong>b. Nghĩa vụ của Chủ Thể Dữ Liệu</strong>
                      <br />
                      - Tự bảo vệ Dữ Liệu Cá Nhân của tôi;
                      <br />
                      - Yêu cầu Bên Xử Lý Dữ Liệu và các tổ chức, cá nhân khác
                      có liên quan bảo vệ Dữ Liệu Cá Nhân của Chủ Thể Dữ Liệu;
                      <br />
                      - Cập nhật bằng văn bản cho Bên Xử Lý Dữ Liệu ngay khi có
                      bất kỳ thay đổi nào về Dữ Liệu Cá Nhân đã cung cấp;
                      <br />
                      - Cung cấp đầy đủ, chính xác Dữ Liệu Cá Nhân khi đồng ý
                      cho phép xử lý dữ liệu cá nhân;
                      <br />
                      - Thông báo kịp thời đến Bên Xử Lý Dữ Liệu khi biết được
                      những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật
                      của bên thứ ba để Bên Xử Lý Dữ Liệu và các bên liên quan
                      có biện pháp giải quyết phù hợp; và
                      <br />
                      - Các nghĩa vụ khác theo quy định tại Bản Xác Nhận này và
                      quy định của pháp luật
                      <br />
                      <br />
                      <strong>6. Hậu quả thiệt hại không mong muốn</strong>
                      <br />
                      - BTC luôn nỗ lực thực hiện các biện pháp thích hợp trong
                      khả năng về kỹ thuật và an ninh để ngăn chặn việc truy
                      cập, sử dụng trái phép Dữ Liệu Cá Nhân. Dù vậy, không có
                      biện pháp bảo mật dữ liệu nào có thể đảm bảo an toàn tuyệt
                      đối. BTC khuyến cáo Chủ Thể Dữ Liệu nên chủ động thực hiện
                      các biện pháp giúp ngăn chặn việc truy cập trái phép vào
                      mật khẩu, điện thoại và máy tính bằng cách đăng xuất tài
                      khoản sau khi sử dụng máy tính chung, đặt một mật khẩu
                      mạnh và khó đoán và giữ bí mật thông tin đăng nhập cũng
                      như mật khẩu của mình.
                      <br />
                      - BTC luôn ràng buộc các chủ thể tiếp nhận Dữ Liệu Cá Nhân
                      nêu tại Mục 4 Chính Sách này tuân thủ tuyệt đối các cam
                      kết về bảo vệ Dữ Liệu Cá Nhân nhằm bảo vệ tối đa quyền lợi
                      của Chủ Thể Dữ Liệu. Tuy nhiên, trong nhiều trường hợp,
                      BTC không thể kiểm soát tuyệt đối việc các chủ thể này xử
                      lý Dữ Liệu Cá Nhân nằm ngoài phạm vi cho phép hoặc quy
                      định của pháp luật, đặc biệt sau thời điểm chấm dứt các
                      giao dịch liên quan.
                      <br />- Các trường hợp, sự kiện khác nằm ngoài khả năng
                      lường trước, ngăn chặn, khắc phục của BTC.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-video" id="video">
          <div className="landing-video__container container">
            <video
              ref={videoRef}
              className="landing-video__element"
              src={vid1}
              controls={isInView} // show controls when in view
              muted // always muted for autoplay
              autoPlay={isInView} // autoplay when in view
              loop
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Landing;
