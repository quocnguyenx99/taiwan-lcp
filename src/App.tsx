import { Routes, Route } from "react-router-dom";
import { Suspense , lazy} from "react";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";

const Visa = lazy(() => import("./pages/Visa"));
const Lottery = lazy(() => import("./pages/Lottery"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
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
      </Route>
    </Routes>
  );
}
