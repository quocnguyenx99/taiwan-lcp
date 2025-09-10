import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
}

/**
 * Kiểm tra token trong localStorage.
 * Nếu có -> render children, nếu không -> redirect về /login và lưu đường dẫn hiện tại trong state
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token"); // hoặc đổi key nếu bạn lưu khác

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;