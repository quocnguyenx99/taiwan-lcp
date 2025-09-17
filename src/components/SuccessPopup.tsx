import React from 'react';
import '../styles/successPopup.css';
import checkMark from '../assets/checkMark.png';

interface SuccessPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="success-popup-overlay">
      <div className="success-popup" onClick={(e) => e.stopPropagation()}>
        <div className="success-popup__icon">
          <img src={checkMark} alt="Success" className="success-popup__checkmark" />
        </div>
        
        <div className="success-popup__content">
          <h2 className="success-popup__title">
            CHÚC MỪNG BẠN ĐÃ<br />
            THAM GIA THÀNH CÔNG!
          </h2>
          
          <p className="success-popup__message">
            CHƯƠNG TRÌNH QUAY SỐ VÀ CÔNG BỐ KẾT QUẢ<br />
            SẼ DIỄN RA VÀO LÚC 9:00 NGÀY 22/9/2025<br />
            TRÊN WEBSITE.
          </p>
        </div>

        <button className="success-popup__button" onClick={onClose}>
          XÁC NHẬN
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;