import React, { useState, useRef } from "react";
import { Link } from "react-router-dom"; // thêm import Link
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
      <div id="home">
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
              &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; 為此而生
              &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp; SẴN SÀNG
              ĐƯỜNG ĐẦU &nbsp; LEAGUE OF LEGENDS CHAMPIONSHIP PACIFIC &nbsp;
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
            <img
              src={giaiBa}
              alt="Giải ba"
              className="prize-image prize-image--ba"
            />
          </div>
        </section>
      </div>

      <div id="vote">
        <section className="landing-vote">
          <div className="container landing-vote__container">
            <button className="vote-cta">VOTE NGAY!</button>

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
      </div>

      {/* predict form section */}
      <section className="landing-form" id="form">
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
                    Iusto possimus, nesciunt quas deserunt et, voluptas eius
                    necessitatibus consequatur magni nam optio, ad natus quis
                    ipsa mollitia sed inventore dolore commodi. Dicta beatae
                    molestiae quis assumenda iste in porro, veniam totam
                    eligendi quaerat soluta aliquam delectus voluptatem
                    sapiente, illum ratione tenetur dolorum. Eaque amet impedit
                    aut nesciunt alias dolore voluptatibus aliquid, culpa quos
                    quod assumenda exercitationem, illo quaerat architecto!
                    Debitis nemo, magni eligendi dolorem earum reprehenderit
                    molestias sapiente ipsum voluptates culpa est eveniet
                    voluptatem nam corporis, nihil voluptate distinctio quo
                    porro? Necessitatibus eveniet beatae dolor fugit laboriosam
                    at rerum harum, repellendus dolores dolore repellat
                    similique doloribus explicabo aliquid possimus eaque iste
                    unde? Enim harum incidunt cupiditate excepturi asperiores
                    debitis tempora velit obcaecati nihil, mollitia similique
                    totam? Sit, iure quisquam. Deleniti facilis repellat nihil
                    quis quasi voluptas, distinctio ipsa. Sed eos dicta deleniti
                    laborum tempora iste voluptas amet repellendus veritatis at.
                    Perspiciatis quidem beatae impedit porro quas, excepturi,
                    debitis voluptatem cum repudiandae deserunt veritatis omnis
                    facilis laudantium quos fugit voluptatibus nostrum
                    necessitatibus vero provident iusto atque quibusdam!
                    Corrupti quos veritatis debitis mollitia nam sapiente
                    incidunt corporis quasi magnam temporibus voluptates ratione
                    neque sit tempora nemo laudantium labore, ducimus facilis,
                    quia maiores! Ex nulla nihil voluptas iure suscipit cumque
                    dolore alias libero, quod voluptatem? Ipsam expedita fuga
                    veniam reiciendis quidem dolorem cumque eligendi provident
                    distinctio, quaerat vero, omnis quos rerum ipsa dicta autem
                    architecto iure, excepturi nostrum sed deleniti alias?
                    Facere nulla incidunt ipsum nobis, provident laudantium
                    itaque aperiam doloremque, exercitationem praesentium, amet
                    a quia reiciendis ea alias? Tempora quo inventore placeat
                    dolore recusandae ea fugit voluptates necessitatibus, quod
                    mollitia corporis voluptate dolorem deserunt. Commodi modi
                    adipisci sapiente aperiam, libero harum aspernatur.
                    Voluptatum, odit. Dolores obcaecati facere nesciunt,
                    pariatur incidunt ipsa voluptas omnis aliquid placeat! Nisi
                    illo rem amet eveniet unde exercitationem distinctio optio
                    vel modi neque asperiores qui voluptatibus expedita dolorum
                    impedit enim voluptatum corporis dolores reiciendis, eius
                    molestiae vero culpa officia! Libero alias architecto,
                    dignissimos at, assumenda consequatur repellendus eligendi
                    ut, possimus accusantium dolore commodi aperiam excepturi
                    reprehenderit illo fugit dolorum? Voluptas, amet quis
                    ratione excepturi, in dolorum, placeat illo accusamus modi
                    numquam cupiditate quisquam esse? Ut libero officiis
                    distinctio, maiores consequatur minus excepturi impedit
                    nostrum itaque placeat, nam magni quisquam vitae quaerat
                    maxime obcaecati a nihil? Illo, reprehenderit at. Officiis
                    numquam nisi fugiat, a vero labore laudantium culpa est,
                    praesentium quo aliquid asperiores? Aperiam odio vero eum
                    sint libero, ad eaque nemo saepe, fuga modi officia?
                    Voluptatem itaque architecto tempora pariatur quis
                    consectetur? Ut, repudiandae voluptas porro sequi, modi
                    exercitationem dolor hic cum officia tenetur amet nulla
                    veritatis fugiat possimus animi blanditiis consequuntur
                    officiis. Temporibus, cupiditate? Asperiores corporis
                    explicabo similique et maxime nihil doloremque cumque quam
                    ullam consectetur, quas veniam dolorum placeat optio
                    deleniti ad fugit. Suscipit deserunt voluptate magni sunt
                    hic voluptas, non minus. Rem voluptate optio quaerat minima
                    voluptas necessitatibus voluptatum. Aspernatur ullam,
                    dolorem ab quibusdam expedita ducimus numquam dolores
                    inventore, doloremque amet error eligendi harum debitis
                    similique omnis sunt ipsum neque nihil molestiae laudantium
                    non nulla corrupti?
                  </p>
                  <p>...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-video" id="video">
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
