"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const navItems = [
  {
    label: "Dashboard",
    href: "/mitra",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: "Tugas Aktif",
    href: "/mitra/tugas-aktif",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: "Riwayat",
    href: "/mitra/riwayat",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3h6l2 3h10a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"/>
      </svg>
    ),
  },
  {
    label: "Pengaturan",
    href: "/mitra/pengaturan",
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

// FIX #1: Definisikan mapStatus di luar komponen
function mapStatus(apiStatus) {
  const map = {
    "PENDING":          "Menunggu",
    "ACCEPTED":         "Diterima",
    "COMPLETED":        "Selesai",
    "CANCELLED":        "Dibatalkan",
    "PROOF_SUBMITTED":  "Bukti Dikirim",
  };
  return map[apiStatus] ?? "Menunggu";
}

const STATUS_STYLE = {
  Selesai:         { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
  Diterima:        { bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
  Menunggu:        { bg: "#fffbeb", color: "#d97706", dot: "#f59e0b" },
  Dibatalkan:      { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" },
  "Bukti Dikirim": { bg: "#f0f9ff", color: "#0369a1", dot: "#0ea5e9" },
};

function fmt(n) {
  return n === 0 ? "—" : "Rp " + n.toLocaleString("id-ID");
}

function Stars({ rating }) {
  if (!rating) return <span style={{ fontSize: 11, color: "#94a3b8" }}>Belum dinilai</span>;
  return (
    <span style={{ color: "#f59e0b", fontSize: 14 }}>
      {"★".repeat(rating)}
      <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function RatingUserModal({ task, onClose, onSubmit }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(task.mitraRating || 0);
  const namaPembuat = task.userNama || "User";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "32px 28px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>👤</div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Beri Rating User</h3>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 6px" }}>
          <strong>{namaPembuat}</strong>
        </p>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 20px" }}>Tugas: {task.judul}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              style={{ fontSize: 36, cursor: "pointer", color: star <= (hovered || selected) ? "#f59e0b" : "#e2e8f0", transition: "color 0.1s" }}
            >&#9733;</span>
          ))}
        </div>
        {selected > 0 && (
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
            {["","Sangat Buruk","Kurang Memuaskan","Cukup","Bagus","Luar Biasa!"][selected]}
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Batal
          </button>
          <button
            disabled={selected === 0}
            onClick={() => onSubmit(task.id, selected)}
            style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: selected ? "#2563eb" : "#e2e8f0", color: selected ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: 13, cursor: selected ? "pointer" : "not-allowed", fontFamily: "inherit" }}
          >
            Kirim Rating
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ active }) {
  const [userDisplayName, setUserDisplayName] = useState("Mitra Aktif");

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.name) {
          setUserDisplayName(parsedUser.name);
        } else if (parsedUser.first_name || parsedUser.last_name) {
          setUserDisplayName(`${parsedUser.first_name || ""} ${parsedUser.last_name || ""}`.trim());
        }
      } catch (e) {
        console.error("Gagal memproses data user di Sidebar Riwayat", e);
      }
    }
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("profileUpdated", loadUserData);
    return () => window.removeEventListener("profileUpdated", loadUserData);
  }, []);

  const initialLetter = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : "M";

  return (
    <div style={{
      width: 200, minHeight: "100vh", background: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex", flexDirection: "column",
      padding: "24px 0", position: "sticky", top: 0,
    }}>
      <div style={{ padding: "0 20px 28px", fontSize: 20, fontWeight: 800, color: "#2563eb", letterSpacing: -0.5 }}>
        CALLZ
      </div>

      <div style={{
        margin: "0 12px 24px", background: "#f0f4ff", borderRadius: 12,
        padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%", background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 15, position: "relative",
        }}>
          {initialLetter}
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
        </div>
        <div style={{ textAlign: "center", width: "100%", overflow: "hidden" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
            {userDisplayName}
          </div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, lineHeight: 1.4, marginTop: 2 }}>
            LAYANAN CONCIERGE<br />TERVERIFIKASI
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 10px" }}>
        {navItems.map((item) => {
          const isActive = active === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 9,
              background: isActive ? "#2563eb" : "transparent",
              color: isActive ? "#fff" : "#64748b",
              fontWeight: isActive ? 700 : 500,
              fontSize: 13, textDecoration: "none",
            }}>
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function RiwayatPage() {
  const [filter,      setFilter]      = useState("Semua");
  const [search,      setSearch]      = useState("");
  const [ratingModal, setRatingModal] = useState(null);
  const [tasksData,   setTasksData]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const filters = ["Semua", "Selesai", "Dibatalkan"];

  // FIX #2: Ganti reloadData (localStorage) dengan fetchRiwayat (API)
  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        // Guard: hentikan jika tidak ada token
        if (!token) {
          setError("Sesi tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${baseUrl}/mitra/tasks/history`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        // Cek status HTTP sebelum parse JSON
        if (!res.ok) {
          setError(`Gagal memuat data (HTTP ${res.status}). Coba muat ulang halaman.`);
          setLoading(false);
          return;
        }

        const json = await res.json();
        const raw = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);

        // FIX #1: mapStatus sekarang terdefinisi
        const mapped = raw.map((t) => ({
          id:          String(t.id),
          judul:       t.title || "—",
          kategori:    t.category_name || "—",
          status:      mapStatus(t.status),
          userNama:    t.user
                        ? (`${t.user.first_name || ""} ${t.user.last_name || ""}`.trim() || t.user.name || "User")
                        : "User",
          tanggal:     t.created_at
                        ? new Date(t.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "short", year: "numeric",
                          })
                        : "—",
          durasi:      "—",
          biaya:       t.total_estimated_fee || 0,
          rating:      t.user_rating || 0,
          mitraRating: t.mitra_rating || 0,
          icon:        "📦",
        }));

        setTasksData(mapped);
      } catch (e) {
        console.error("Gagal fetch riwayat mitra:", e);
        setError("Terjadi kesalahan jaringan. Pastikan koneksi internet kamu aktif.");
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const filtered = tasksData.filter(r => {
    const matchFilter = filter === "Semua" || r.status === filter;
    const matchSearch = !search ||
      (r.judul    || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.id       || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.userNama || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalSelesai = tasksData.filter(r => r.status === "Selesai").length;
  const totalBiaya   = tasksData
    .filter(r => r.status === "Selesai")
    .reduce((a, b) => a + (b.biaya || 0), 0);
  const ratingList   = tasksData.filter(r => r.rating > 0);
  const avgRating    = ratingList.length > 0
    ? (ratingList.reduce((a, b) => a + b.rating, 0) / ratingList.length).toFixed(1)
    : "0.0";

  // FIX #4: handleMitraRating hit ke API, bukan hanya tulis localStorage
  const handleMitraRating = async (taskId, rating) => {
    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      await fetch(`${baseUrl}/tasks/${taskId}/rate-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ rating }),
      });
    } catch (e) {
      console.error("Gagal kirim rating:", e);
    }

    setTasksData(prev =>
      prev.map(t => t.id === taskId ? { ...t, mitraRating: rating } : t)
    );
    setRatingModal(null);
  };

  return (
    <div className={plusJakarta.className} style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar active="/mitra/riwayat" />

      {ratingModal && (
        <RatingUserModal
          task={ratingModal}
          onClose={() => setRatingModal(null)}
          onSubmit={handleMitraRating}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#0f172a" }}>Riwayat Tugas</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>Semua tugas yang pernah kamu ambil</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff" }}>
              <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>Status: Online</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: 0.3 }}>SEDANG BERLANGSUNG</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "28px 32px" }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Total Tugas",      value: tasksData.length, sub: "Sejak bergabung",  color: "#0f172a" },
              { label: "Berhasil",         value: totalSelesai,      sub: tasksData.length > 0 ? `${Math.round(totalSelesai / tasksData.length * 100)}% success rate` : "0% success rate", color: "#16a34a" },
              { label: "Total Pendapatan", value: fmt(totalBiaya),   sub: "Semua waktu",     color: "#2563eb", small: true },
              { label: "Rating Rata-rata", value: avgRating + " ★", sub: "Dari semua user",  color: "#f59e0b" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: s.small ? 20 : 30, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Filter + Search */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {filters.map(f => {
                const count = f === "Semua" ? tasksData.length : tasksData.filter(r => r.status === f).length;
                const isActive = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: "8px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: isActive ? "#2563eb" : "#fff",
                    color: isActive ? "#fff" : "#64748b",
                    border: isActive ? "1px solid #2563eb" : "1px solid #e5e7eb",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    {f}
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99,
                      background: isActive ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                      color: isActive ? "#fff" : "#64748b",
                    }}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 13 }}>&#128269;</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari riwayat tugas..."
                style={{
                  border: "1px solid #e5e7eb", borderRadius: 10, padding: "9px 14px 9px 32px",
                  fontSize: 13, outline: "none", width: 240, fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* FIX #2: Tampilkan loading & error state */}
          {loading ? (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "64px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>&#9203;</div>
              <p style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>Memuat riwayat tugas...</p>
            </div>
          ) : error ? (
            <div style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 16, padding: "48px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>&#9888;&#65039;</div>
              <p style={{ fontSize: 14, color: "#dc2626", fontWeight: 600, marginBottom: 8 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: "8px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              >
                Muat Ulang
              </button>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                    {["Tugas", "Pembuat Tugas", "Tanggal", "Durasi", "Status", "Rating dari User", "Rating ke User", "Biaya"].map((h, i) => (
                      <th key={h + i} style={{
                        padding: "14px 16px", fontSize: 10, fontWeight: 700, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: 0.5,
                        textAlign: i === 7 ? "right" : "left",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>&#128269;</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>Tidak ada riwayat ditemukan</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => {
                      const st = STATUS_STYLE[r.status] || STATUS_STYLE["Selesai"];
                      const inisial = (r.userNama || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                      return (
                        <tr key={r.id} style={{ borderBottom: i === filtered.length - 1 ? "none" : "1px solid #f1f5f9" }}>
                          {/* Kolom Tugas */}
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                                {r.icon}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>{r.judul}</div>
                                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>#{r.id} · {r.kategori}</div>
                              </div>
                            </div>
                          </td>

                          {/* Kolom Pembuat Tugas */}
                          <td style={{ padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#1d4ed8" }}>
                                {inisial}
                              </div>
                              <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{r.userNama}</span>
                            </div>
                          </td>

                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{r.tanggal}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{r.durasi}</td>

                          {/* Kolom Status */}
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              padding: "4px 10px", borderRadius: 99,
                              background: st.bg, color: st.color,
                              fontSize: 11, fontWeight: 700,
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, display: "inline-block" }} />
                              {r.status}
                            </span>
                          </td>

                          {/* Rating dari User ke Mitra */}
                          <td style={{ padding: "14px 16px" }}>
                            <Stars rating={r.rating} />
                          </td>

                          {/* Rating dari Mitra ke User */}
                          <td style={{ padding: "14px 16px" }}>
                            {r.status === "Selesai" ? (
                              r.mitraRating ? (
                                <Stars rating={r.mitraRating} />
                              ) : (
                                <button
                                  onClick={() => setRatingModal(r)}
                                  style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #fde68a", background: "#fffbeb", color: "#d97706", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
                                  onMouseEnter={e => { e.target.style.background = "#fef3c7"; }}
                                  onMouseLeave={e => { e.target.style.background = "#fffbeb"; }}
                                >
                                  &#11088; Nilai User
                                </button>
                              )
                            ) : (
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>&#8212;</span>
                            )}
                          </td>

                          {/* Biaya */}
                          <td style={{ padding: "14px 16px", textAlign: "right", fontSize: 13, fontWeight: 700, color: r.biaya === 0 ? "#d1d5db" : "#0f172a" }}>
                            {fmt(r.biaya)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Menampilkan {filtered.length} dari {tasksData.length} riwayat</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {["\u2190 Sebelumnya", "Berikutnya \u2192"].map(btn => (
                    <button key={btn} style={{
                      padding: "6px 14px", fontSize: 12, fontWeight: 600,
                      border: "1px solid #e5e7eb", borderRadius: 8,
                      background: "#fff", color: "#64748b", cursor: "pointer", fontFamily: "inherit",
                    }}>{btn}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>CALLZ</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>&#169; 2026 CallZ Concierge. Built for Precision.</div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Twitter", "Instagram"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "#64748b", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}