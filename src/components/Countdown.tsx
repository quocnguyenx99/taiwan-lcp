import React, { useState, useEffect } from "react";
import "../styles/countdown.css";

interface CountdownProps {
  onExpired?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ onExpired }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    // Target: 9:00 AM ngày 22/09/2025
    const targetDate = new Date("2025-09-22T09:00:00+07:00"); // UTC+7 timezone

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });

        // Gọi callback khi hết thời gian
        if (onExpired) {
          onExpired();
        }

        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    // Tính toán lần đầu
    calculateTimeLeft();

    // Cập nhật mỗi giây
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [onExpired]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  // Trả về null để ẩn component khi hết thời gian
  if (timeLeft.isExpired) {
    return null;
  }

  return (
    <div className="countdown-wrapper">
        <div className="countdown-container">
          <div className="countdown-label">CÒN</div>
          <div className="countdown-time">
            <div className="countdown-segment">
              <span className="countdown-number">
                {formatNumber(timeLeft.days)}
              </span>
              <span className="countdown-unit">NGÀY</span>
            </div>
            <div className="countdown-segment">
              <span className="countdown-number">
                {formatNumber(timeLeft.hours)}
              </span>
              <span className="countdown-unit">GIỜ</span>
            </div>
            <div className="countdown-segment">
              <span className="countdown-number">
                {formatNumber(timeLeft.minutes)}
              </span>
              <span className="countdown-unit">PHÚT</span>
            </div>
          </div>
          <div className="countdown-description">
            ĐẾN BUỔI QUAY SỐ VÀ CÔNG BỐ KẾT QUẢ
          </div>
        </div>
      </div>
  );
};

export default Countdown;
