import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/contestClosed.css';

const ContestClosed: React.FC = () => {
  const navigate = useNavigate();

  const handleViewResults = () => {
    navigate('/rewards');
  };

  return (
    <section className="contest-closed">
      <div className="contest-closed__container container">
        <div className="contest-closed__notification">
          <div className="contest-closed__message">
            THỜI GIAN THAM GIA ĐÃ KẾT THÚC!
          </div>
          <button 
            className="contest-closed__button"
            onClick={handleViewResults}
          >
            VÀO XEM NGAY TRANG KẾT QUẢ
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContestClosed;