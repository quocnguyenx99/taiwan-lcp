import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/memberList.css";

type Member = {
  id: number;
  full_name: string;
  number_phone: string;
  email: string | null;
  address: string;
  team_id: number;
  team_name:string;
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
  const [pagination, setPagination] = useState<ApiResponse["pagination"] | null>(null);
  const [q, setQ] = useState("");

  // thêm tổng số người tham gia
  const totalCount = pagination?.total ?? members.length;

  useEffect(() => {
    // keep URL in sync
    setSearchParams(prev => {
      prev.set("page", String(page));
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // redirect to login if no token
      navigate("/admin/login");
      return;
    }

    const ctrl = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}?page=${page}`, {
          signal: ctrl.signal,
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
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
        if (err.name !== "AbortError") setError(err.message || "Lỗi khi fetch dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return () => ctrl.abort();
  }, [page, navigate, setSearchParams]);

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
      const EXPORT_URL = "https://be.dudoanchungketlcp-tta.vn/api/member/export";
      const res = await fetch(EXPORT_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream",
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
      const fnMatch = cd.match(/filename\*=UTF-8''([^;\n\r]+)/i) || cd.match(/filename="?([^";]+)"?/i);
      if (fnMatch && fnMatch[1]) {
        try { fileName = decodeURIComponent(fnMatch[1]); } catch { fileName = fnMatch[1].replace(/"/g, ""); }
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
    ? members.filter(m =>
        `${m.full_name} ${m.number_phone} ${m.email ?? ""} ${m.address}`.toLowerCase().includes(q.toLowerCase())
      )
    : members;

  // compute start index for serial number (STT) based on pagination
  const startIndex = ((pagination?.current_page ?? page) - 1) * (pagination?.per_page ?? members.length);

  const renderPager = () => {
    if (!pagination) return null;
    const total = pagination.last_page;
    const current = pagination.current_page;
    const windowSize = 5;
    let start = Math.max(1, current - Math.floor(windowSize / 2));
    let end = Math.min(total, start + windowSize - 1);
    if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="ml-pager">
        <button className="btn-ghost" onClick={() => goToPage(1)} disabled={current === 1}>«</button>
        <button className="btn-ghost" onClick={() => goToPage(current - 1)} disabled={current === 1}>‹</button>

        {start > 1 && <span className="dots">…</span>}
        {pages.map(p => (
          <button key={p} className={`btn-page ${p === current ? "active" : ""}`} onClick={() => goToPage(p)}>
            {p}
          </button>
        ))}
        {end < total && <span className="dots">…</span>}

        <button className="btn-ghost" onClick={() => goToPage(current + 1)} disabled={current === total}>›</button>
        <button className="btn-ghost" onClick={() => goToPage(total)} disabled={current === total}>»</button>

        <div className="pager-meta">
          Trang {current} / {total} • Tổng {pagination.total}
        </div>
      </div>
    );
  };

  return (
    <main className="ml-page">
      <div className="ml-backdrop" />

      <div className="ml-card container">
        <header className="ml-header">
          <div>
            <h1 className="ml-title">Quản trị — Danh sách người bình chọn</h1>
            <p className="ml-sub">Xem, lọc nhanh và xuất CSV.</p>
            <p className="ml-count">Tổng người tham gia: <strong>{totalCount.toLocaleString()}</strong></p>
          </div>

          <div className="ml-actions">
            <input
              className="ml-search"
              placeholder="Tìm tên, điện thoại, email hoặc địa chỉ..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tìm kiếm"
            />
            <button className="btn primary" onClick={() => goToPage(1)}>Refresh</button>
            <button className="btn" onClick={exportExcel} disabled={!members.length}>Export Excel</button>
          </div>
        </header>

        <section className="ml-body">
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
                      <tr><td colSpan={7} className="empty">Không có dữ liệu</td></tr>
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

              {renderPager()}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default MemberList;