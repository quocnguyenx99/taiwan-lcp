import React from "react";
import "../styles/visa.css";

import Header from "../components/Header";

// icons & QR
import docIcon from "../assets/visa/docIcon.png";
import costIcon from "../assets/visa/costIcon.png";
import submitIcon from "../assets/visa/submitIcon.png";
import qr1 from "../assets/visa/qr1.png";
import qr2 from "../assets/visa/qr2.png";
import bearIcon from "../assets/visa/bearIcon.png"; // thêm import bearIcon

// background
import bgTop from "../assets/visa/bgTop.png";
import bgBottom from "../assets/visa/bgBottom.png";
import SEO from "../components/SEO";

const Visa: React.FC = () => {
  return (
    <>
      <SEO
        title="Các Chính Sách Thị Thực Đài Loan"
        description="Tìm hiểu các chính sách thị thực Đài Loan: Visa du lịch, E-Visa, Visa quan hồng. Hướng dẫn chi tiết hồ sơ, chi phí và thủ tục xin visa Đài Loan."
        keywords="visa Đài Loan, thị thực Đài Loan, E-visa, visa du lịch, visa quan hồng, thủ tục visa"
        ogTitle="Hướng Dẫn Các Chính Sách Thị Thực Đài Loan"
        ogDescription="Hướng dẫn chi tiết các loại visa Đài Loan: Visa du lịch, E-Visa, Visa quan hồng với thủ tục, chi phí và hồ sơ cần thiết."
        ogImage="https://dudoanchungketlcp-tta.vn/og-image.jpg"
        ogUrl="https://dudoanchungketlcp-tta.vn/visa"
        twitterTitle="Hướng Dẫn Các Chính Sách Thị Thực Đài Loan"
        twitterDescription="Hướng dẫn chi tiết các loại visa Đài Loan với thủ tục, chi phí và hồ sơ cần thiết."
        twitterImage="https://dudoanchungketlcp-tta.vn/og-image.jpg"
      />

      <Header />

      <section className="visa">
        {/* ảnh nền trên */}
        <img src={bgTop} alt="" className="visa__bg visa__bg--top" />

        {/* title và subtitle trên bg Top */}
        <div className="visa__bg-title">
          <h2 className="visa__title">CÁC CHÍNH SÁCH</h2>
          <h3 className="visa__subtitle">THỊ THỰC ĐÀI LOAN</h3>
        </div>

        {/* vệt loang để nối 2 nền */}
        <div className="visa__fade" />

        {/* nội dung */}
        <div className="visa__content container">
          <div className="visa__table">
            {/* Macot con gấu ở góc trên bên phải */}
            <img src={bearIcon} alt="Macot con gấu" className="visa__bear" />

            {/* HÀNG 1 — CÁC HỒ SƠ YÊU CẦU */}
            <div className="vt__row">
              <div className="vt__label">
                <img src={docIcon} alt="" />
                <span>Các hồ sơ yêu cầu</span>
              </div>

              {/* cột 1 */}
              <div className="vt__cell">
                <div className="vt__chip">VISA DU LỊCH</div>
                <ul className="vt__list">
                  <li>Đơn thông tin</li>
                  <li>Hợp đồng lao động, BHXH</li>
                  <li>Các hồ sơ chứng minh tài chính</li>
                  <li>Lịch trình du lịch</li>
                  <li>Vé máy bay &amp; booking khách sạn</li>
                </ul>
              </div>

              {/* cột 2 */}
              <div className="vt__cell">
                <div className="vt__chip">E-VISA</div>
                <ul className="vt__list">
                  <li>Hành khách thoả một trong các điều kiện dưới đây:</li>
                  <li>
                    Sở hữu visa phổ thông (visa dán trên hộ chiếu) hoặc thẻ cư
                    trú Đài Loan còn hiệu lực trong 10 năm
                  </li>
                  <li>
                    Sở hữu visa hoặc thẻ cư trú Mỹ, Canada, Anh, khối Schengen
                    còn hiệu lực trong 10 n
                  </li>
                  <li>Sở hữu visa còn hạn của New Zealand, Úc</li>
                </ul>
              </div>

              {/* cột 3 */}
              <div className="vt__cell">
                <div className="vt__chip">VISA QUAN HỒNG</div>
                <ul className="vt__list">
                  <li>Được cấp thông qua các công ty du lịch được chỉ định</li>
                  <li>Xuất nhập cảnh cùng một lúc và không được tách đoàn</li>
                </ul>
              </div>
            </div>

            {/* HÀNG 2 — CHI PHÍ */}
            <div className="vt__row">
              <div className="vt__label">
                <img src={costIcon} alt="" />
                <span>Chi phí</span>
              </div>

              <div className="vt__cell">
                <div className="vt__chip vt__chip--mobile">VISA DU LỊCH</div>
                <ul className="vt__list">
                  <li>
                    <span className="vt__label-text">Phổ thông:</span>{" "}
                    <div>5 ngày làm việc / 50 USD</div>
                  </li>
                  <li>
                    <span className="vt__label-text">Khẩn:</span>{" "}
                    <div>3 ngày làm việc / 75 USD</div>
                  </li>
                </ul>
              </div>

              <div className="vt__cell vt__cell--center">
                <div className="vt__chip vt__chip--mobile">E-VISA</div>
                <p className="vt__line">Miễn phí</p>
              </div>

              <div className="vt__cell vt__cell--center">
                <div className="vt__chip vt__chip--mobile">VISA QUAN HỒNG</div>
                <p className="vt__line">Miễn phí</p>
              </div>
            </div>

            {/* HÀNG 3 — PHƯƠNG THỨC NỘP HỒ SƠ + QR */}
            <div className="vt__row">
              <div className="vt__label">
                <img src={submitIcon} alt="" />
                <span>Phương thức nộp hồ sơ</span>
              </div>

              <div className="vt__cell">
                <div className="vt__chip vt__chip--mobile">VISA DU LỊCH</div>
                <ul className="vt__list">
                  <li>Điền đơn thông tin trên web.</li>
                  <li>
                    Đến TECO Hà Nội hoặc Hồ Chí Minh để tiến hành cấp visa.
                  </li>
                  <li className="vt__qr-li">
                    <img className="vt__qr" src={qr1} alt="QR Visa Du Lịch" />
                  </li>
                </ul>
              </div>

              <div className="vt__cell vt__cell--withqr">
                <div className="vt__chip vt__chip--mobile">E-VISA</div>
                <p className="vt__desc">
                  Điền thông tin và visa sẽ cấp trực tiếp trên web.
                </p>
                <img className="vt__qr" src={qr2} alt="QR E-Visa" />
              </div>

              <div className="vt__cell vt__cell--withqr">
                <div className="vt__chip vt__chip--mobile">VISA QUAN HỒNG</div>
                <p className="vt__desc">
                  Hành khách thông qua các công ty du lịch được chỉ định để nộp
                  hồ sơ.
                </p>
                <p className="vt__ref">
                  Tham khảo thêm tại trang web:{" "}
                  <a
                    href="https://taiwan.net.vn/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://taiwan.net.vn/
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ảnh nền dưới */}
        <img src={bgBottom} alt="" className="visa__bg visa__bg--bottom" />
      </section>
    </>
  );
};

export default Visa;
