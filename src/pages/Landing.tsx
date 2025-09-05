import React from "react";

import "../styles/landing.css";

const Landing: React.FC = () => {
  return (
    <main>
      <section className="landing-banner">
        <div className="landing-banner__container">
          <h1 className="landing-banner__title">DỰ ĐOÁN ĐỘI CHIẾN THẮNG</h1>
          <div className="landing-banner__sub">
            <div className="landing-banner__subtitle">Chung kết</div>
            <img
              className="landing-banner__logo"
              src="/images/lcp-logo.svg"
              alt="League of Legends Championship Pacific"
              width={160}
              height={80}
            />
          </div>
        </div>
      </section>
      {/* Các section khác của landing sẽ ở đây */}
    </main>
  );
};

export default Landing;
