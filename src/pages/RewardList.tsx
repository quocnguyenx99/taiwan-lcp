import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/memberList.css";
import Pagination from "../components/Pagination";

type Winner = {
  id: number;
  full_name: string;
  number_phone: string;
  email: string | null;
  address: string;
  team_id: number;
  team_name: string;
  prize_id: number;
  prize: string;
  created_at: string;
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: Winner[];
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
};

const API_BASE = "https://be.dudoanchungketlcp-tta.vn/api/admin/prize/get-member";

const RewardList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get("page") || "1");
  const [page, setPage] = useState<number>(initialPage);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [q, setQ] = useState("");

  // Tổng số người trúng giải
  const totalCount = pagination?.total ?? winners.length;

  useEffect(() => {
    // keep URL in sync
    setSearchParams((prev) => {
      prev.set("page", String(page));
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const ctrl = new AbortController();
    // Extract fetchData to be reusable
    fetchData(ctrl);
    return () => ctrl.abort();
  }, [page, navigate, setSearchParams]);

  // Extract fetchData function to reuse in refresh
  const fetchData = async (controller?: AbortController) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const ctrl = controller || new AbortController();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?page=${page}`, {
        signal: ctrl.signal,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin/login");
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      if (!json.status) throw new Error(json.message || "API trả về lỗi");
      setWinners(json.data || []);
      setPagination(json.pagination || null);
      setIsFirstLoad(false);
    } catch (err: any) {
      if (err.name !== "AbortError")
        setError(err.message || "Lỗi khi fetch dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Add refreshData function
  const refreshData = async () => {
    // Reset về page 1 và clear search
    setPage(1);
    setQ("");
    setError(null);

    // Force reload data by updating URL params
    setSearchParams((prev) => {
      prev.set("page", "1");
      return prev;
    });

    // Gọi fetchData trực tiếp để refresh ngay lập tức
    await fetchData();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (p: number) => {
    if (p < 1 || (pagination && p > pagination.last_page)) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Export Excel - call backend export endpoint directly
  const exportExcel = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const EXPORT_URL =
        "https://be.dudoanchungketlcp-tta.vn/api/prize/export-prizes";
      const res = await fetch(EXPORT_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/admin/login");
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error(`Export failed: HTTP ${res.status}`);

      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") || "";
      let fileName = `rewards-page-${page}.xlsx`;
      const fnMatch =
        cd.match(/filename\*=UTF-8''([^;\n\r]+)/i) ||
        cd.match(/filename="?([^";]+)"?/i);
      if (fnMatch && fnMatch[1]) {
        try {
          fileName = decodeURIComponent(fnMatch[1]);
        } catch {
          fileName = fnMatch[1].replace(/"/g, "");
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Export error:", err);
      window.alert(err?.message || "Không thể xuất file. Vui lòng thử lại.");
    }
  };

  const filtered = q
    ? winners.filter((w) =>
        `${w.full_name} ${w.number_phone} ${w.email ?? ""} ${w.address} ${w.prize} ${w.team_name}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : winners;

  // compute start index for serial number (STT) based on pagination
  const startIndex =
    ((pagination?.current_page ?? page) - 1) *
    (pagination?.per_page ?? winners.length);

  return (
    <main className="ml-page">
      <div className="ml-backdrop" />

      <div className="ml-card container">
        <header className="ml-header">
          <div>
            <h1 className="ml-title">Quản trị — Danh sách người trúng giải</h1>
            <p className="ml-sub">
              Xem và quản lý tất cả người đã trúng thưởng
            </p>
            <p className="ml-count">
              Tổng người trúng giải:{" "}
              <strong>{totalCount.toLocaleString()}</strong>
            </p>
          </div>

          <div className="ml-actions">
            <input
              className="ml-search"
              placeholder="Tìm tên, điện thoại, giải thưởng hoặc team..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tìm kiếm"
            />
            <button className="btn primary" onClick={refreshData}>
              Refresh
            </button>
            <button
              className="btn"
              onClick={exportExcel}
              disabled={!winners.length}
            >
              Export Excel
            </button>
          </div>
        </header>

        <section className="ml-body">
          {pagination && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              totalItems={pagination.total}
              onPageChange={goToPage}
              loading={loading}
            />
          )}
          {isFirstLoad && loading ? (
            <div className="ml-first-loading">Đang tải dữ liệu…</div>
          ) : error ? (
            <div className="ml-error">Lỗi: {error}</div>
          ) : (
            <>
              <div className="ml-table-wrap">
                {/* overlay while fetching new pages but keep old data visible */}
                {loading && !isFirstLoad && (
                  <div className="ml-loading-overlay" aria-hidden>
                    <div className="spinner" />
                    <div className="loading-text">Đang tải…</div>
                  </div>
                )}

                <table className="ml-table" role="table" aria-busy={loading}>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Họ và tên</th>
                      <th>Điện thoại</th>
                      <th>Email</th>
                      <th>Địa chỉ</th>
                      <th>Team dự đoán</th>
                      <th>Giải thưởng</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="empty">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      filtered.map((w, idx) => {
                        const stt = startIndex + idx + 1;
                        return (
                          <tr key={w.id}>
                            <td>{stt}</td>
                            <td className="name">{w.full_name}</td>
                            <td>{w.number_phone}</td>
                            <td>{w.email ?? "-"}</td>
                            <td className="address">{w.address}</td>
                            <td className="team-name">{w.team_name}</td>
                            <td className="prize-name">{w.prize}</td>
                            <td className="datetime">{w.created_at}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {pagination && (
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  totalItems={pagination.total}
                  onPageChange={goToPage}
                  loading={loading}
                />
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default RewardList;