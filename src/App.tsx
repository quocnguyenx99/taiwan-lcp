import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login"; // thêm import
import MemberList from "./pages/MemberList";
import PrivateRoute from "./components/PrivateRoute";
import TestRoll from "./pages/TestRoll";
import TestAdminRoll from "./pages/TestAdminRoll";
import LotteryAdmin from "./pages/LotteryAdmin";

const Visa = lazy(() => import("./pages/Visa"));
const Lottery = lazy(() => import("./pages/Lottery"));

export default function App() {
  return (
    <Routes>
      {/* route riêng, không trong Layout */}
      <Route path="/admin/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="rewards" element={<Lottery />} />
      </Route>

      <Route
        path="/test-roll"
        element={
          <Suspense fallback={<div className="skeleton">Đang tải…</div>}>
            <TestRoll />
          </Suspense>
        }
      />

      <Route
        path="/visa"
        element={
          <Suspense fallback={<div className="skeleton">Đang tải…</div>}>
            <Visa />
          </Suspense>
        }
      />
      {/* <Route
        path="/lottery"
        element={
          <Suspense fallback={<div className="skeleton">Đang tải…</div>}>
            <Lottery />
          </Suspense>
        }
      /> */}
      {/* Private routes (require token in localStorage) */}
      <Route
        path="/admin/member-list"
        element={
          <PrivateRoute>
            <MemberList />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/test-roll"
        element={
          <PrivateRoute>
            <TestAdminRoll />
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
