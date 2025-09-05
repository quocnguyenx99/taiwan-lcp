import React from "react";
import "../styles/landing.css";
import lcpIcon from "../assets/lcpIcon.png";
import giaiNhat from "../assets/giaiNhat.png";
import giaiNhi from "../assets/giaiNhi.png";
import giaiBa from "../assets/giaiBa.png";
import viettravel from "../assets/VIETRAVEL.png";
import starlux from "../assets/STARLUX.png";
import chinaAir from "../assets/CHINA.png";
import evaAir from "../assets/EVA.png";

/* team images (thêm file image vào src/assets và đổi tên import cho đúng) */
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

SwiperCore.use([Navigation, Autoplay]);

const Landing: React.FC = () => {
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

      {/* slider section */}
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
                <h3 className="predict-terms__title">ĐIỀU KIỆN &amp; ĐIỀU KHOẢN</h3>

                <div className="predict-terms__inner">
                  {/* Nội dung dài sẽ nằm bên trong khung scroll 200px */}
                  <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit
                    inventore explicabo voluptas temporibus rerum, aut, dolor aperiam
                    deserunt suscipit illum vel fuga repellendus quos minima! A
                    doloremque, quaerat iure, deleniti voluptatum consectetur velit
                    eveniet consequatur delectus sequi blanditiis expedita modi id
                    molestias culpa sint! Enim, nisi minima, tenetur reiciendis
                    dolores voluptatem omnis atque odit totam accusantium, debitis ea
                    neque nihil porro a consequuntur recusandae? Doloremque quo
                    corrupti accusantium ut ducimus molestias illo laboriosam
                    ratione? Quibusdam facilis molestias impedit culpa error deserunt
                    recusandae nihil veniam? Numquam qui atque vero id vitae. Officiis
                    vero nemo placeat tempora culpa eaque delectus numquam ut esse cum
                    debitis illo quaerat voluptate doloribus aliquid quos eum, hic
                    architecto! Similique, architecto. Ullam nostrum, quia sit fugit
                    distinctio suscipit iste reiciendis aspernatur repellendus.
                    Reprehenderit voluptatibus rem inventore repudiandae quam numquam
                    libero, quibusdam modi labore fugit, ut hic blanditiis esse, sunt
                    deserunt? Porro, quos, cum deleniti, laudantium molestiae nam
                    ullam provident sequi error iusto fuga. Recusandae unde reiciendis
                    mollitia repudiandae nihil minus quis veniam inventore praesentium,
                    accusamus similique totam, corrupti incidunt possimus. Accusamus at
                    accusantium magnam eligendi iste quidem. Illum, nobis assumenda
                    excepturi incidunt natus eius deleniti harum cumque sequi,
                    repudiandae veniam, porro numquam dolore sunt laboriosam eum
                    architecto ipsa accusamus doloribus illo temporibus doloremque quis
                    molestiae. Illo, distinctio laboriosam? Aut, autem enim placeat
                    quidem doloremque reprehenderit facilis nihil hic nisi ex? Quasi
                    quaerat, voluptatibus aut officia provident sit veritatis quis
                    consequuntur tempore expedita, id, cumque tempora laudantium
                    suscipit voluptate neque fugiat temporibus adipisci unde! Nemo, ad
                    vel! Laudantium eos aliquam labore eaque, ad beatae sed eum, est
                    dolore deleniti voluptatibus asperiores! Obcaecati eaque sequi
                    ratione velit harum fugit adipisci error officiis odit nam
                    reprehenderit quo sit voluptate fugiat ipsa fuga distinctio
                    laudantium, aspernatur natus itaque excepturi. Consequuntur, vero,
                    excepturi, fugit quod nulla voluptatem quisquam error temporibus
                    ipsa ex obcaecati. Fugiat iusto consectetur impedit modi tempore
                    nisi et doloremque commodi esse aliquam distinctio a dolore
                    similique, nam odio facilis mollitia totam officia vitae architecto
                    perspiciatis porro aliquid expedita animi. Magnam animi soluta
                    expedita earum voluptatum! Architecto, alias quod dicta facere
                    natus modi explicabo veniam earum hic, placeat debitis odio
                    necessitatibus doloribus quam magni facilis expedita est
                    consequatur. Soluta, corporis omnis. In dolore quo perspiciatis
                    sapiente, ducimus consequuntur libero culpa eaque! Vero, aliquam
                    placeat. Ipsa architecto magnam beatae animi nemo culpa libero
                    commodi, recusandae accusamus ea unde sint. Distinctio vero
                    temporibus mollitia blanditiis, laboriosam, ratione sequi dolore
                    aliquid doloremque quod, amet voluptate illo reiciendis libero
                    similique ipsa sint laborum natus illum. Laborum minus maxime ab
                    laboriosam molestiae veritatis facilis illo id explicabo ex maiores
                    asperiores velit earum libero saepe repudiandae reiciendis iusto,
                    provident voluptas mollitia similique autem exercitationem?
                    Temporibus debitis quia veniam blanditiis velit alias nesciunt
                    beatae odio placeat tempore quos itaque sequi laboriosam culpa
                    dolorum illum laborum vero officia maiores error magni, mollitia,
                    tempora a voluptatem. Fugiat provident nobis porro necessitatibus vel,
                    perspiciatis at voluptatibus? Obcaecati a minus facere, omnis
                    corporis similique vel iste enim soluta. Dolorum, consectetur
                    commodi error excepturi expedita vero quis necessitatibus mollitia
                    esse, laborum, sunt voluptatum! Aut ullam quisquam itaque magnam
                    assumenda corrupti iure! Sint officia, eum a consequatur, aut
                    cupiditate, quas quasi unde voluptatem iusto facilis cum. Fugit
                    inventore minus beatae nulla! Cumque reprehenderit deserunt
                    veritatis quisquam eum, repudiandae dignissimos exercitationem
                    voluptates vero minus accusantium corporis eius nostrum deleniti
                    quaerat porro expedita necessitatibus enim? Fugit unde nemo
                    maxime. Ex ipsa nulla soluta distinctio eligendi at quo provident
                    dolores. Dolore fugiat nemo ipsa dolor facere! Tenetur dignissimos
                    iusto alias nihil ratione, quasi, provident odio adipisci libero
                    aliquam debitis nam et consectetur dolore exercitationem doloremque
                    enim sunt non dolores inventore quos. Atque, consequuntur asperiores
                    eum aperiam distinctio quasi illum est voluptas cumque provident
                    corporis, nisi perferendis sapiente qui eveniet, accusantium porro
                    nulla vitae modi! Quisquam alias quibusdam tenetur corporis
                    reprehenderit sapiente, quam accusamus aut dolorem dolores ratione
                    voluptates. Nemo, tempora aliquid! Ducimus, dolores doloribus amet
                    alias praesentium perspiciatis, aliquam nihil pariatur veritatis
                    vero eveniet dolor id animi necessitatibus. Repudiandae adipisci
                    beatae corporis mollitia, numquam voluptas, debitis, inventore illo
                    nihil temporibus suscipit sapiente. Fugiat totam accusamus earum
                    vitae hic ad velit dolores dolore magnam aspernatur quia,
                    exercitationem molestias in illo, minima cumque at recusandae
                    porro expedita quisquam officia sit impedit optio corrupti? Alias,
                    at quis quam quibusdam placeat autem qui adipisci est, necessitatibus
                    vel doloribus, sequi nam ipsa. Autem aliquid magnam, sint harum porro
                    quidem minima dicta, qui ex mollitia repudiandae voluptas nesciunt,
                    nobis atque saepe enim! In veritatis quasi incidunt voluptate
                    asperiores laboriosam, aperiam reiciendis praesentium nesciunt
                    vero ipsa. Est eius vitae explicabo facilis fuga quaerat ut impedit
                    quibusdam. Nesciunt impedit, quod quisquam rem ipsum dicta corrupti
                    blanditiis suscipit atque amet doloremque fuga, distinctio
                    temporibus dolor magnam ullam nisi sint quis eos doloribus! Hic sunt
                    mollitia nesciunt saepe error, soluta, perferendis recusandae,
                    nostrum autem eius quas! Ea, sunt aperiam! Quam consequatur sint
                    molestiae beatae qui exercitationem corrupti reprehenderit magnam
                    consequuntur dolores, sed, vitae optio at assumenda eveniet
                    sunt, illo mollitia illum. Distinctio amet quae fugit fugiat
                    exercitationem voluptatem quas aspernatur reiciendis nemo hic. Quasi
                    nisi libero hic sint voluptatum sed eligendi itaque at nesciunt
                    quam vero omnis vitae tempore, deserunt sunt laborum nihil ex
                    molestiae porro. Delectus accusamus sapiente asperiores eum sequi
                    quam aliquam. Iure sed et dolor fugiat, animi totam nisi doloremque.
                    Nemo perspiciatis fuga repellat quibusdam quis impedit perferendis
                    incidunt, iure molestias doloribus quia, quos illo sequi pariatur
                    voluptates sit adipisci dolores non velit inventore! Quibusdam
                    nesciunt ea repellat dolore id, commodi nam vel quos eius
                    repellendus laboriosam. Quibusdam, neque quisquam. Sed reiciendis
                    velit, asperiores molestiae modi harum magnam ipsam mollitia dicta
                    magni aliquid? In rerum quia reiciendis! Dolor tenetur, perferendis,
                    aliquid obcaecati optio magnam architecto tempora quisquam, iusto
                    natus voluptas similique maxime? Laboriosam, esse possimus vero odio
                    incidunt voluptatum ut a tempore. Mollitia atque nam similique
                    voluptate maiores dolorum aperiam odit illo ipsa illum architecto
                    quis, sit tempora rerum vero corrupti nihil. Voluptate quaerat modi
                    ullam deserunt, temporibus nihil. Corrupti corporis harum deserunt
                    suscipit quos a beatae officiis et atque, consequatur incidunt quasi
                    maiores itaque, illo quia rem culpa, sapiente cumque delectus
                    vitae!
                  </p>
                  <p>...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
