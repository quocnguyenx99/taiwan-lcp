import React, { useState, useRef } from "react";
import "../styles/landing.css";
import lcpIcon from "../assets/lcpIcon.png";
import giaiNhat from "../assets/giaiNhat.png";
import giaiNhi from "../assets/giaiNhi.png";
import giaiBa from "../assets/giaiBa.png";
import viettravel from "../assets/VIETRAVEL.png";
import starlux from "../assets/STARLUX.png";
import chinaAir from "../assets/CHINA.png";
import evaAir from "../assets/EVA.png";

import teamCFO from "../assets/CFO.png";
import teamGAM from "../assets/GAM.png";
import teamTSW from "../assets/TSW.png";
import teamMVKE from "../assets/MVKE.png";
import teamPSG from "../assets/PSG.png";
import teamDFM from "../assets/DFM.png";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import slide1 from "../assets/TTA_PIC_ENGAGE.jpg";
import slide2 from "../assets/TTA_PIC_SHARE.jpg";
import slide3 from "../assets/TTA_PIC_DISCOVER.jpg";
import slide4 from "../assets/TTA_PIC_ENJOY.jpg";

import vid1 from "../assets/videos/1023_Engage_60_B.mp4";
import promoBg from "../assets/PROMO VDO.png";
import playBtn from "../assets/Layer 5.png";

SwiperCore.use([Navigation, Autoplay]);

const Landing: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <main>
      <section className="landing-banner">
        <div className="landing-banner__container">
          <h1 className="landing-banner__title">DỰ ĐOÁN ĐỘI CHIẾN THẮNG</h1>
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
            LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG ĐƯỜNG ĐẦU
            &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; 為此而生 &nbsp;
            LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG ĐƯỜNG ĐẦU
            &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; 為此而生 &nbsp;
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
          <img
            src={giaiBa}
            alt="Giải ba"
            className="prize-image prize-image--ba"
          />
        </div>
      </section>

      <section className="landing-vote">
        <div className="container landing-vote__container">
          <button className="vote-cta">VOTE NGAY!</button>

          <div className="sponsors" aria-label="Nhà tài trợ">
            <div className="sponsor__title">NHÀ TÀI TRỢ</div>
            <div className="sponsor__logo">
              <img src={viettravel} alt="Vietravel" className="sponsor" />
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
                <img src={slide1} alt="slide1" className="landing-slide-img" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={slide2} alt="slide2" className="landing-slide-img" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={slide3} alt="slide3" className="landing-slide-img" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={slide4} alt="slide4" className="landing-slide-img" />
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
      <section className="landing-form">
        <div className="landing-form__container">
          <div className="predict-cta">
            <div className="predict-cta__title">DỰ ĐOÁN ĐỘI CHIẾN THẮNG</div>

            <div className="teams-grid" role="list">
              <div className="team-card" role="listitem" aria-label="CFO">
                <img src={teamCFO} alt="CFO" />
              </div>

              <div className="team-card" role="listitem" aria-label="GAM">
                <img src={teamGAM} alt="GAM" />
              </div>

              <div className="team-card" role="listitem" aria-label="TSW">
                <img src={teamTSW} alt="TSW" />
              </div>

              <div className="team-card" role="listitem" aria-label="MVKE">
                <img src={teamMVKE} alt="MVKE" />
              </div>

              <div className="team-card" role="listitem" aria-label="PSG">
                <img src={teamPSG} alt="PSG" />
              </div>

              <div className="team-card" role="listitem" aria-label="DFM">
                <img src={teamDFM} alt="DFM" />
              </div>
            </div>

            {/* FORM + TERMS */}
            <div className="predict-form">
              <form
                className="predict-form__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget as HTMLFormElement);
                  console.log(Object.fromEntries(fd)); // replace with submit logic
                }}
                aria-label="Dự đoán form"
              >
                <div className="form-row">
                  <div className="field-label">
                    <div className="field-label__title">HỌ VÀ TÊN</div>
                    <div className="field-label__subtitle">
                      *Viết đầy đủ theo giấy tờ để đối chiếu trao giải
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

                <div className="form-row">
                  <div className="field-label">
                    <div className="field-label__title">SỐ ĐIỆN THOẠI</div>
                    <div className="field-label__subtitle">&nbsp;</div>
                  </div>
                  <div className="field-input">
                    <input
                      name="phone"
                      type="tel"
                      className="input--orange input--ghost"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field-label">
                    <div className="field-label__title">EMAIL CÁ NHÂN</div>
                    <div className="field-label__subtitle">*Không bắt buộc</div>
                  </div>
                  <div className="field-input">
                    <input
                      name="email"
                      type="email"
                      className="input--orange input--ghost"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field-label">
                    <div className="field-label__title">ĐỊA CHỈ NHẬN QUÀ</div>
                    <div className="field-label__subtitle">
                      *Vui lòng cung cấp địa chỉ trước sắp nhập
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

                <div className="form-actions">
                  <button type="submit" className="predict-form__submit">
                    Submit
                  </button>
                </div>
              </form>

              <div
                className="predict-terms"
                role="region"
                aria-label="Điều kiện và điều khoản"
              >
                <h3 className="predict-terms__title">
                  ĐIỀU KIỆN &amp; ĐIỀU KHOẢN
                </h3>

                <div className="predict-terms__inner">
                  {/* Nội dung dài sẽ nằm bên trong khung scroll 200px */}
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Doloremque tempora aspernatur iure aut explicabo, quod
                    adipisci illo assumenda fugiat aliquid optio provident
                    voluptate? Fugit, suscipit, magni iste itaque eaque et
                    commodi eligendi inventore veniam sequi excepturi nihil
                    molestias quas beatae maxime aperiam? Ea quia neque illo
                    voluptatibus incidunt doloremque sapiente.
                  </p>
                  <p>...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-video">
        <div className="landing-video__container container">
          <img
            src={promoBg}
            alt="Promo Background"
            className="landing-video__bg"
          />
          {!isPlaying && (
            <button className="landing-video__play-btn" onClick={handlePlay}>
              <img src={playBtn} alt="Play" />
            </button>
          )}
          <video
            ref={videoRef}
            className="landing-video__element"
            src={vid1}
            controls={isPlaying}
            style={{ display: isPlaying ? "block" : "none" }}
          />
        </div>
      </section>
    </main>
  );
};

export default Landing;
