import React from "react";

import taiwanLogoOrange from "../assets/taiwanLogoOrange.png";

const Footer: React.FC = () => {
  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label="Thông tin liên hệ"
    >
      <div className="footer__container container">
        {/* Logo bên trái */}
        <div className="footer__brand">
          <img
            src={taiwanLogoOrange}
            alt="TAIWAN • Waves of Wonder"
            width={200}
            height={40}
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Nội dung liên hệ bên phải */}
        <div className="footer__content">
          <h3 className="footer__title">Liên Hệ Chúng Tôi:</h3>
          <ul className="footer__list">
            <li className="footer__row">
              <strong>
                Cục Du lịch Đài Loan tại Thành phố Hồ Chí Minh
              </strong>
            </li>
            <li className="footer__row">
              <span className="footer__label">Địa chỉ:</span>
              <span>
                336 Nguyễn Trị Phương, Phường Vườn Lài, TP. Hồ Chí Minh, Việt
                Nam.
              </span>
            </li>
            <li className="footer__row">
              <span className="footer__label">Email:</span>
              <a href="mailto:follow@taiwan.net.vn" className="footer__link">
                follow@taiwan.net.vn
              </a>
            </li>
            <li className="footer__row">
              <span className="footer__label">Số điện thoại:</span>
              <span>+84-28-3834-9160 #3106 / #3107 / #3108</span>
            </li>
            <li className="footer__row">
              <span className="footer__label">Giờ làm việc:</span>
              <span> Thứ Hai ~ Thứ Sáu — 09:00~18:00 (Trừ các ngày lễ)</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
