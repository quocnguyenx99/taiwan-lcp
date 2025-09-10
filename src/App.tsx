import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login"; // thêm import
import MemberList from "./pages/MemberList";
import PrivateRoute from "./components/PrivateRoute";

const Visa = lazy(() => import("./pages/Visa"));
const Lottery = lazy(() => import("./pages/Lottery"));

export default function App() {
  return (
    <Routes>
      {/* route riêng, không trong Layout */}
      <Route path="/admin/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route index element={<Landing />} />
      </Route>

      <Route
        path="/visa"
        element={
          <Suspense fallback={<div className="skeleton">Đang tải…</div>}>
            <Visa />
          </Suspense>
        }
      />
      <Route
        path="/lottery"
        element={
          <Suspense fallback={<div className="skeleton">Đang tải…</div>}>
            <Lottery />
          </Suspense>
        }
      />
      {/* Private routes (require token in localStorage) */}
      <Route
        path="/admin/member-list"
        element={
          <PrivateRoute>
            <MemberList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
