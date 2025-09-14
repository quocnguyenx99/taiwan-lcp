import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/memberList.css";
import Pagination from "../components/Pagination";

type Member = {
  id: number;
  full_name: string;
  number_phone: string;
  email: string | null;
  address: string;
  team_id: number;
  team_name: string;
  created_at: string;
};

type ApiResponse = {
  status: boolean;
  message: string;
  data: Member[];
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
};

const API_BASE = "https://be.dudoanchungketlcp-tta.vn/api/member/get-all";

const MemberList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get("page") || "1");
  const [page, setPage] = useState<number>(initialPage);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    ApiResponse["pagination"] | null
  >(null);
  const [q, setQ] = useState("");

  // thêm tổng số người tham gia
  const totalCount = pagination?.total ?? members.length;

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
      setMembers(json.data || []);
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
        "https://be.dudoanchungketlcp-tta.vn/api/member/export";
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
      let fileName = `members-page-${page}.xlsx`;
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
    ? members.filter((m) =>
        `${m.full_name} ${m.number_phone} ${m.email ?? ""} ${m.address}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : members;

  // compute start index for serial number (STT) based on pagination
  const startIndex =
    ((pagination?.current_page ?? page) - 1) *
    (pagination?.per_page ?? members.length);

  return (
    <main className="ml-page">
      <div className="ml-backdrop" />

      <div className="ml-card container">
        <header className="ml-header">
          <div>
            <h1 className="ml-title">Quản trị — Danh sách người bình chọn</h1>
            <p className="ml-count">
              Tổng người tham gia:{" "}
              <strong>{totalCount.toLocaleString()}</strong>
            </p>
          </div>

          <div className="ml-actions">
            <input
              className="ml-search"
              placeholder="Tìm tên, điện thoại, email hoặc địa chỉ..."
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
              disabled={!members.length}
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
                      <th>Team</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      filtered.map((m, idx) => {
                        const stt = startIndex + idx + 1;
                        return (
                          <tr key={m.id}>
                            <td>{stt}</td>
                            <td className="name">{m.full_name}</td>
                            <td>{m.number_phone}</td>
                            <td>{m.email ?? "-"}</td>
                            <td className="address">{m.address}</td>
                            <td>{m.team_name}</td>
                            <td>{m.created_at}</td>
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

export default MemberList;
