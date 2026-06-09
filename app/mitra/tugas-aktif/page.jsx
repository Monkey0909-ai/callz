"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const API_BASE = "https://generous-awake-serval.ngrok-free.app/api";

const AVATAR_COLORS = ["#3b5bdb", "#e07b5a", "#5a7be0", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

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

// ── Ambil token dari localStorage (hanya untuk auth header) ──
function getAuthHeaders() {
  let token = null;
  try {
    const raw = localStorage.getItem("mitra_user") || localStorage.getItem("user");
    if (raw) {
      const p = JSON.parse(raw);
      token = p.token || p.access_token || null;
    }
  } catch (_) {}
  if (!token) token = localStorage.getItem("mitra_token") || localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Konversi status API → label UI ──
function mapStatus(apiStatus) {
  const map = {
    PENDING:         "Menunggu",
    SEARCHING:       "Mencari",
    ACCEPTED:        "Diterima",
    PICKED_UP:       "Dijemput",
    COMPLETED:       "Selesai",
    CANCELLED:       "Dibatalkan",
    PROOF_SUBMITTED: "Bukti Dikirim",
  };
  return map[apiStatus] ?? apiStatus;
}

function buatInisial(nama) {
  if (!nama) return "?";
  const parts = nama.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function Sidebar({ active }) {
  const [userDisplayName, setUserDisplayName] = useState("Mitra Aktif");

  const loadUserData = () => {
    const raw = localStorage.getItem("mitra_user") || localStorage.getItem("user");
    if (raw) {
      try {
        const p = JSON.parse(raw);
        const nama = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim();
        if (nama) setUserDisplayName(nama);
      } catch (e) {
        console.error("Gagal membaca profil user di Sidebar", e);
      }
    }
  };

  useEffect(() => {
    loadUserData();
    window.addEventListener("profileUpdated", loadUserData);
    window.addEventListener("storage", loadUserData);
    return () => {
      window.removeEventListener("profileUpdated", loadUserData);
      window.removeEventListener("storage", loadUserData);
    };
  }, []);

  const initialLetter = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : "M";

  return (
    <div style={{
      width: 200, minHeight: "100vh", background: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex", flexDirection: "column",
      padding: "24px 0",
      position: "sticky", top: 0,
    }}>
      <div style={{ padding: "0 20px 28px", fontSize: 20, fontWeight: 900, color: "#2563eb", letterSpacing: -0.5 }}>
        CALLZ
      </div>

      <div style={{
        margin: "0 12px 24px",
        background: "#f0f4ff", borderRadius: 12,
        padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 15, position: "relative",
        }}>
          {initialLetter}
          <div style={{
            position: "absolute", bottom: 1, right: 1,
            width: 10, height: 10, borderRadius: "50%",
            background: "#22c55e", border: "2px solid #fff",
          }} />
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

// ── Kartu tugas aktif — data dari API ──
function TugasCard({ tugas, index, onSelesai }) {
  const mitraName = tugas.mitra?.name || "—";
  const inisial = buatInisial(mitraName);
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const pickup = tugas.pickup_address || null;
  const destination = tugas.destination_address || null;

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [sudahDikirim, setSudahDikirim] = useState(tugas.status === "PROOF_SUBMITTED");

  const handleKirimBukti = async () => {
    if (!proofFile) {
      setSubmitError("Pilih foto bukti pekerjaan terlebih dahulu.");
      return;
    }

    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      setSubmitError("Sesi tidak ditemukan. Silakan login ulang.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    try {
      const formData = new FormData();
      formData.append("proof_of_work", proofFile);

      const res = await fetch(`${API_BASE}/mitra/tasks/${tugas.id}/submit-proof`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: headers.Authorization,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err?.message || `Gagal mengirim bukti (${res.status}).`);
        setSubmitLoading(false);
        return;
      }

      setSudahDikirim(true);
      setProofFile(null);
      setSubmitLoading(false);
      onSelesai(tugas.id);
    } catch {
      setSubmitError("Kesalahan jaringan. Coba lagi.");
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb",
      borderRadius: 16, padding: 24, marginBottom: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Kolom kiri */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: avatarColor, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 22, flexShrink: 0,
            }}>
              📦
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                {tugas.title || "—"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                {tugas.category_name && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: "#2563EB",
                    background: "#eff6ff", borderRadius: 4, padding: "2px 6px",
                    letterSpacing: 0.5,
                  }}>
                    {tugas.category_name.toUpperCase()}
                  </span>
                )}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: sudahDikirim ? "#d97706" : "#16a34a",
                  background: sudahDikirim ? "#fffbeb" : "#f0fdf4",
                  borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5,
                }}>
                  {sudahDikirim ? "BUKTI DIKIRIM" : "MISI AKTIF"}
                </span>
              </div>
            </div>
          </div>

          {/* Lokasi pickup → destination */}
          {(pickup || destination) && (
            <div style={{ marginBottom: 14 }}>
              {pickup && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.4 }}>Jemput</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{pickup}</div>
                  </div>
                </div>
              )}
              {destination && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>🏁</span>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.4 }}>Tujuan</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{destination}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Catatan lokasi */}
          {tugas.location_notes && (
            <div style={{ padding: "8px 10px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0369a1", marginBottom: 3, textTransform: "uppercase" }}>Catatan</div>
              <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, margin: 0 }}>{tugas.location_notes}</p>
            </div>
          )}

          {/* Waktu dibuat */}
          {tugas.created_at && (
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              📅 {new Date(tugas.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
          )}
        </div>

        {/* Kolom kanan: detail + aksi */}
        <div style={{ background: "#f8faff", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5, marginBottom: 10, textTransform: "uppercase" }}>
            Detail Tugas
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {tugas.total_estimated_fee > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#94a3b8" }}>Biaya</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>
                  Rp {Number(tugas.total_estimated_fee).toLocaleString("id-ID")}
                </span>
              </div>
            )}
            {tugas.receiver_name && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#94a3b8" }}>Penerima</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{tugas.receiver_name}</span>
              </div>
            )}
            {tugas.receiver_phone && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#94a3b8" }}>Telepon</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{tugas.receiver_phone}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px solid #e2e8f0", paddingTop: 7, marginTop: 3 }}>
              <span style={{ color: "#94a3b8" }}>ID Tugas</span>
              <span style={{ fontWeight: 700, color: "#64748b" }}>#{tugas.id}</span>
            </div>
          </div>

          {/* Tombol aksi */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Navigasi Maps */}
            {(pickup || destination) && (
              <a
                href={
                  pickup && destination
                    ? `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup || destination)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 12,
                  borderRadius: 10, padding: "9px 14px", textDecoration: "none",
                  boxShadow: "0 1px 4px rgba(22,163,74,0.18)",
                }}
              >
                ▲ Buka Navigasi Google Maps
              </a>
            )}

            {/* Upload bukti + kirim */}
            {!sudahDikirim ? (
              <>
                <label style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: 12,
                  borderRadius: 10, padding: "9px 14px",
                  border: "1.5px dashed #93c5fd", cursor: "pointer",
                }}>
                  <span>📷</span>
                  <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {proofFile ? proofFile.name : "Pilih Foto Bukti Kerja"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    style={{ display: "none" }}
                    onChange={(e) => { setProofFile(e.target.files[0] || null); setSubmitError(""); }}
                  />
                </label>

                {submitError && (
                  <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, margin: "0 2px" }}>{submitError}</p>
                )}

                <button
                  onClick={handleKirimBukti}
                  disabled={submitLoading}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: submitLoading ? "#e2e8f0" : "#2563eb",
                    color: submitLoading ? "#94a3b8" : "#fff",
                    fontWeight: 700, fontSize: 12, borderRadius: 10, padding: "9px 14px",
                    border: "none", cursor: submitLoading ? "not-allowed" : "pointer",
                    boxShadow: submitLoading ? "none" : "0 1px 4px rgba(37,99,235,0.18)",
                    transition: "all 0.2s",
                  }}
                >
                  {submitLoading ? "⏳ Mengirim..." : "✓ Kirim Bukti Pekerjaan"}
                </button>
              </>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: 12,
                borderRadius: 10, padding: "9px 14px", border: "1.5px solid #bbf7d0",
              }}>
                ✓ Bukti berhasil dikirim
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TugasAktifPage() {
  const [tugasAktif, setTugasAktif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tugas aktif dari API
  // Menggunakan GET /mitra/tasks/history (endpoint yang ada di routes Laravel)
  // lalu filter status ACCEPTED atau PICKED_UP — tidak ada ketergantungan localStorage
  const fetchTugasAktif = async () => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      setError("Sesi tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/mitra/tasks/history`, { headers });

      if (!res.ok) {
        setError(`Gagal memuat tugas aktif (${res.status}).`);
        setLoading(false);
        return;
      }

      const json = await res.json();
      const raw = Array.isArray(json.data) ? json.data : (json.data ? [json.data] : []);

      // Filter hanya tugas yang masih berlangsung (ACCEPTED atau PICKED_UP)
      // COMPLETED, CANCELLED, PROOF_SUBMITTED tidak ditampilkan di halaman ini
      const aktif = raw.filter(
        (t) => t.status === "ACCEPTED" || t.status === "PICKED_UP"
      );

      setTugasAktif(aktif);
    } catch (e) {
      console.error("[CallZ] Gagal fetch tugas aktif:", e);
      setError("Kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Dipanggil setelah bukti berhasil dikirim — hapus dari daftar aktif di UI
  const handleSelesai = (tugasId) => {
    setTugasAktif((prev) => prev.filter((t) => t.id !== tugasId));
  };

  useEffect(() => {
    fetchTugasAktif();
  }, []);

  return (
    <div className={plusJakarta.className} style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 2px #bbf7d0; }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px #dcfce7; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <Sidebar active="/mitra/tugas-aktif" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, color: "#0f172a" }}>Mitra Dashboard</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>Selamat Datang Kembali!</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#374151", fontWeight: 600 }}>
              Kamu punya{" "}
              <span style={{ color: "#2563eb" }}>{tugasAktif.length} tugas</span>
              {" "}sedang berjalan.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Tombol refresh */}
            <button
              onClick={fetchTugasAktif}
              disabled={loading}
              title="Refresh tugas aktif"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1.5px solid #e5e7eb",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer",
                background: "#fff", fontSize: 16,
                opacity: loading ? 0.5 : 1,
              }}
            >
              <span style={{ display: "inline-block", animation: loading ? "spin 0.8s linear infinite" : "none" }}>↻</span>
            </button>

            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff" }}>
              <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>Status: Online</div>
              {tugasAktif.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <span style={{
                    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
                    background: "#22c55e", boxShadow: "0 0 0 2px #bbf7d0",
                    animation: "pulse 1.5s infinite",
                  }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: 0.3 }}>
                    {tugasAktif.length} SEDANG BERLANGSUNG
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.3 }}>
                  TIDAK ADA TUGAS AKTIF
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Konten */}
        <div style={{ flex: 1, padding: "28px 32px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 16, textTransform: "uppercase" }}>
            Tugas Aktif ({tugasAktif.length})
          </p>

          {/* Loading state */}
          {loading && (
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
              padding: "60px 32px", textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                width: 36, height: 36, border: "3px solid #2563eb",
                borderTopColor: "transparent", borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 12px",
              }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", margin: 0 }}>
                Memuat tugas aktif...
              </p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid #fecaca",
              padding: "40px 32px", textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#ef4444", margin: "0 0 12px" }}>{error}</p>
              <button
                onClick={fetchTugasAktif}
                style={{
                  background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13,
                  border: "none", borderRadius: 10, padding: "9px 20px", cursor: "pointer",
                }}
              >
                Muat Ulang
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && tugasAktif.length === 0 && (
            <div style={{
              background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
              padding: "60px 32px", textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", margin: 0 }}>
                Belum ada tugas yang sedang dikerjakan
              </p>
              <p style={{ fontSize: 13, color: "#cbd5e1", marginTop: 6 }}>
                Kembali ke{" "}
                <Link href="/mitra" style={{ color: "#2563eb", fontWeight: 600 }}>
                  Dashboard
                </Link>{" "}
                untuk mengambil tugas baru.
              </p>
            </div>
          )}

          {/* Daftar tugas */}
          {!loading && !error && tugasAktif.map((t, i) => (
            <TugasCard key={t.id} tugas={t} index={i} onSelesai={handleSelesai} />
          ))}
        </div>

        {/* Footer */}
        <footer style={{
          background: "#fff", borderTop: "1px solid #e5e7eb",
          padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>CALLZ</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>© 2026 CallZ Concierge. Built for Precision.</div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Twitter", "Instagram"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: "#64748b", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}