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

const RIWAYAT = [
  { id: "CZ-089", judul: "Belanja Bahan Makanan: Pasar Organik", kurir: "David K.", tanggal: "Hari ini, 10:32", status: "Selesai", biaya: 85000, rating: 5, kategori: "Belanja", icon: "🛒", durasi: "45 menit" },
  { id: "CZ-088", judul: "Antar Dokumen ke Notaris", kurir: "Sarah L.", tanggal: "Kemarin, 14:15", status: "Selesai", biaya: 45000, rating: 5, kategori: "Dokumen", icon: "📄", durasi: "30 menit" },
  { id: "CZ-087", judul: "Ambil Paket di JNE", kurir: "Marcus J.", tanggal: "Kemarin, 09:00", status: "Selesai", biaya: 35000, rating: 4, kategori: "Paket", icon: "📦", durasi: "25 menit" },
  { id: "CZ-086", judul: "Antre di Bank BRI", kurir: "Rizky M.", tanggal: "1 Jun, 11:20", status: "Dibatalkan", biaya: 0, rating: null, kategori: "Antre", icon: "⏳", durasi: "-" },
  { id: "CZ-085", judul: "Beli Obat di Apotek K24", kurir: "Sandi W.", tanggal: "31 Mei, 16:45", status: "Selesai", biaya: 55000, rating: 5, kategori: "Belanja", icon: "💊", durasi: "35 menit" },
  { id: "CZ-084", judul: "Antar Kue Ulang Tahun", kurir: "David K.", tanggal: "30 Mei, 18:00", status: "Selesai", biaya: 65000, rating: 5, kategori: "Paket", icon: "🎂", durasi: "40 menit" },
  { id: "CZ-083", judul: "Ambil Laundry", kurir: "Andi P.", tanggal: "29 Mei, 08:30", status: "Selesai", biaya: 25000, rating: 4, kategori: "Paket", icon: "👕", durasi: "20 menit" },
  { id: "CZ-082", judul: "Beli Alat Tulis Kantor", kurir: "Sarah L.", tanggal: "28 Mei, 13:00", status: "Dibatalkan", biaya: 0, rating: null, kategori: "Belanja", icon: "✏️", durasi: "-" },
];

const STATUS_STYLE = {
  Selesai:    { bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a" },
  Dibatalkan: { bg: "#fef2f2", color: "#dc2626", dot: "#dc2626" },
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

// Sidebar Component dengan state Nama Dinamis
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
        {/* Avatar Inisial Dinamis */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%", background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyCenter: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 15, position: "relative",
        }}>
          {initialLetter}
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
        </div>
        <div style={{ textAlign: "center", width: "100%", overflow: "hidden" }}>
          {/* Teks Nama Dinamis */}
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
  const [filter, setFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filters = ["Semua", "Selesai", "Dibatalkan"];

  const filtered = RIWAYAT.filter(r => {
    const matchFilter = filter === "Semua" || r.status === filter;
    const matchSearch = !search ||
      r.judul.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.kurir.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalSelesai = RIWAYAT.filter(r => r.status === "Selesai").length;
  const totalBiaya = RIWAYAT.filter(r => r.status === "Selesai").reduce((a, b) => a + b.biaya, 0);
  const avgRating = (RIWAYAT.filter(r => r.rating).reduce((a, b) => a + b.rating, 0) / RIWAYAT.filter(r => r.rating).length).toFixed(1);

  return (
    <div className={plusJakarta.className} style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar active="/mitra/riwayat" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#0f172a" }}>Riwayat Tugas</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>Semua tugas yang pernah kamu buat</p>
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
              { label: "Total Tugas", value: RIWAYAT.length, sub: "Sejak bergabung", color: "#0f172a" },
              { label: "Berhasil", value: totalSelesai, sub: `${Math.round(totalSelesai / RIWAYAT.length * 100)}% success rate`, color: "#16a34a" },
              { label: "Total Pengeluaran", value: fmt(totalBiaya), sub: "Semua waktu", color: "#2563eb", small: true },
              { label: "Rating Rata-rata", value: avgRating + " ★", sub: "Dari semua kurir", color: "#f59e0b" },
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
                const count = f === "Semua" ? RIWAYAT.length : RIWAYAT.filter(r => r.status === f).length;
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
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 13 }}>🔍</span>
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

          {/* Table */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  {["Tugas", "Kurir", "Tanggal", "Durasi", "Status", "Rating", "Biaya"].map((h, i) => (
                    <th key={h} style={{
                      padding: "14px 16px", fontSize: 10, fontWeight: 700, color: "#94a3b8",
                      textTransform: "uppercase", letterSpacing: 0.5,
                      textAlign: i === 6 ? "right" : "left",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>Tidak ada riwayat ditemukan</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => {
                    const st = STATUS_STYLE[r.status] || STATUS_STYLE["Selesai"];
                    return (
                      <tr key={r.id} style={{ borderBottom: i === filtered.length - 1 ? "none" : "1px solid #f1f5f9" }}>
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
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#475569" }}>
                              {r.kurir.split(" ").map(w => w[0]).join("")}
                            </div>
                            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{r.kurir}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{r.tanggal}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748b" }}>{r.durasi}</td>
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
                        <td style={{ padding: "14px 16px" }}><Stars rating={r.rating} /></td>
                        <td style={{ padding: "14px 16px", textAlign: "right", fontSize: 13, fontWeight: 700, color: r.biaya === 0 ? "#d1d5db" : "#0f172a" }}>
                          {fmt(r.biaya)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Table footer */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid #e5e7eb", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Menampilkan {filtered.length} dari {RIWAYAT.length} riwayat</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["← Sebelumnya", "Berikutnya →"].map(btn => (
                  <button key={btn} style={{
                    padding: "6px 14px", fontSize: 12, fontWeight: 600,
                    border: "1px solid #e5e7eb", borderRadius: 8,
                    background: "#fff", color: "#64748b", cursor: "pointer", fontFamily: "inherit",
                  }}>{btn}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>CALLZ</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>© 2026 CallZ Concierge. Built for Precision.</div>
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