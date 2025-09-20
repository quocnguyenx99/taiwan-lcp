import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MemberList from "./pages/MemberList";
import PrivateRoute from "./components/PrivateRoute";
import LotteryAdmin from "./pages/LotteryAdmin";
import AdminDashboard from "./pages/AdminDashboard";

const Visa = lazy(() => import("./pages/Visa"));
const Lottery = lazy(() => import("./pages/Lottery"));

export default function App() {
  return (
    <Routes>
      {/* route riêng, không trong Layout */}
      <Route path="/admin/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        {/* ✅ Wrap Lottery với Suspense */}
        <Route 
          path="rewards" 
          element={
            <Suspense fallback={<div className="skeleton">Đang tải kết quả quay số...</div>}>
              <Lottery />
            </Suspense>
          } 
        />
      </Route>

      <Route
        path="/visa"
        element={
          <Suspense fallback={<div className="skeleton">Đang tải…</div>}>
            <Visa />
          </Suspense>
        }
      />

      {/* Private routes (require token in localStorage) */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/member-list"
        element={
          <PrivateRoute>
            <MemberList />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/rewards"
        element={
          <PrivateRoute>
            <LotteryAdmin />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
