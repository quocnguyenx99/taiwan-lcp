import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Danh sách user bình chọn",
      desc: "Xem và quản lý tất cả người tham gia bình chọn.",
      to: "/admin/member-list",
    },
    {
      title: "Danh sách người trúng giải",
      desc: "Xem kết quả trúng thưởng mới nhất.",
      to: "admin/reward-list",
    },
    {
      title: "Quay số may mắn",
      desc: "Bắt đầu phiên quay số và phát trực tiếp kết quả.",
      to: "/admin/rewards",
    },
  ];

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard__container">
        <header className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">Bảng điều khiển</h1>
          <p className="admin-dashboard__subtitle">
            Trang quản trị dự đoán chung kết LCP-2025
          </p>
        </header>

        <section className="admin-cards">
          {cards.map((c, idx) => (
            <button
              key={idx}
              className="admin-card"
              onClick={() => navigate(c.to)}
              aria-label={c.title}
            >
              <div className="admin-card__body">
                <h2 className="admin-card__title">{c.title}</h2>
                <p className="admin-card__desc">{c.desc}</p>
              </div>
              <div className="admin-card__arrow" aria-hidden>
                →
              </div>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
};

export default AdminDashboard;
