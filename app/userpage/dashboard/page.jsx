"use client";

import { useState } from "react";
import Link from "next/link";

// ── DATA ──────────────────────────────────────────────────────────────────────
const TUGAS_CEPAT = [
  { icon: "🛒", label: "Belanja Bahan Makanan", sub: "Sudah tersedia" },
  { icon: "📦", label: "Ambil Paket", sub: "3 Mitra di sekitar sini" },
  { icon: "⏳", label: "Antre", sub: "Permintaan mendesak" },
];

const MITRA_TERSEDIA = [
  { inisial: "SL", nama: "Sarah L.",   rating: "98% Rating", jarak: "1.2 mi", warna: "#7C3AED" },
  { inisial: "MJ", nama: "Marcus J.",  rating: "Elite",      jarak: "0.8 mi", warna: "#2563EB" },
];

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ active }) {
  const menu = [
    { id: "dashboard",   icon: "⊞", label: "Dashboard" },
    { id: "tugas-aktif", icon: "↻", label: "Tugas Aktif" },
    { id: "riwayat",     icon: "◷", label: "Riwayat" },
    { id: "pengaturan",  icon: "⚙", label: "Pengaturan" },
  ];
  return (
    <aside style={{
      width: 180, background: "white", borderRight: "1px solid #E2E8F0",
      display: "flex", flexDirection: "column",
      padding: "20px 12px", gap: 4, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", marginBottom: 20, paddingLeft: 8 }}>CallZ</div>

      {/* User Info */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 8px", marginBottom: 16,
        background: "#F8FAFF", borderRadius: 10,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#0F172A", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>👤</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Mitra Aktif</div>
          <div style={{ fontSize: 10, color: "#2563EB", fontWeight: 600 }}>LAYANAN CONCIERGE</div>
          <div style={{ fontSize: 10, color: "#2563EB", fontWeight: 600 }}>TERVERIFIKASI</div>
        </div>
      </div>

      {/* Menu */}
      {menu.map(m => (
        <Link key={m.id} href={`/User/${m.id}`} style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 10px", borderRadius: 8,
            background: active === m.id ? "#EFF6FF" : "transparent",
            color: active === m.id ? "#2563EB" : "#64748B",
            fontSize: 13, fontWeight: active === m.id ? 700 : 500,
            cursor: "pointer",
          }}>
            <span style={{ fontSize: 15 }}>{m.icon}</span>
            {m.label.toUpperCase()}
          </div>
        </Link>
      ))}

      <div style={{ flex: 1 }} />

      {/* Buat Tugas Button */}
      <Link href="/User/buat-tugas" style={{ textDecoration: "none" }}>
        <div style={{
          background: "#2563EB", color: "white",
          borderRadius: 10, padding: "12px",
          textAlign: "center", fontWeight: 700, fontSize: 14,
          cursor: "pointer",
        }}>
          Buat Tugas
        </div>
      </Link>
    </aside>
  );
}

// ── TOPBAR ────────────────────────────────────────────────────────────────────
function Topbar() {
  return (
    <div style={{
      height: 56, background: "white", borderBottom: "1px solid #E2E8F0",
      display: "flex", alignItems: "center", gap: 16, padding: "0 24px",
    }}>
      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "#F8FAFF", border: "1px solid #E2E8F0",
        borderRadius: 8, padding: "7px 14px", flex: 1, maxWidth: 340,
      }}>
        <span style={{ color: "#94A3B8", fontSize: 14 }}>🔍</span>
        <input style={{
          border: "none", background: "transparent", outline: "none",
          fontSize: 13, color: "#0F172A", fontFamily: "inherit", width: "100%",
        }} placeholder="Cari tugas, mitra, atau riwayat..." />
      </div>

      <div style={{ flex: 1 }} />

      {/* Nav links */}
      {["Layanan", "Tentang", "Bantuan"].map(n => (
        <a key={n} href="#" style={{
          fontSize: 13, color: n === "Layanan" ? "#2563EB" : "#475569",
          textDecoration: "none", fontWeight: n === "Layanan" ? 700 : 500,
        }}>{n}</a>
      ))}

      <button style={{
        background: "#2563EB", color: "white",
        border: "none", borderRadius: 8, padding: "8px 18px",
        fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
      }}>Mulai Sekarang</button>
    </div>
  );
}

// ── MAP PLACEHOLDER ───────────────────────────────────────────────────────────
function MapBox() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1a4a3a 0%, #2d6e56 40%, #3a8a6a 100%)",
      borderRadius: 12, height: "100%", minHeight: 200,
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Road lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.4 }} viewBox="0 0 300 220">
        <path d="M 20 110 Q 80 60 150 80 Q 220 100 280 60" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"/>
        <path d="M 50 200 Q 100 150 150 130 Q 200 110 260 140" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round"/>
        <path d="M 150 10 Q 160 80 150 130 Q 140 180 155 210" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M 10 60 Q 70 90 120 80" stroke="white" strokeWidth="5" fill="none"/>
        <path d="M 200 170 Q 240 160 280 180" stroke="white" strokeWidth="5" fill="none"/>
        {/* Area block */}
        <polygon points="80,70 160,55 200,90 180,140 100,150 60,110" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      </svg>
      {/* Blue dot - user location */}
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        background: "#2563EB", border: "3px solid white",
        boxShadow: "0 0 12px rgba(37,99,235,0.8)",
        position: "absolute", top: "42%", left: "52%", zIndex: 2,
      }} />
      {/* Expand button */}
      <button style={{
        position: "absolute", bottom: 12, right: 12,
        width: 32, height: 32, background: "white", border: "none",
        borderRadius: 6, cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 14,
      }}>⤢</button>
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [progress] = useState(75);

  return (
    <div style={{
      minHeight: "100vh", background: "#F0F2F5",
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
      display: "flex", flexDirection: "column",
    }}>
      {/* Label */}
      <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, padding: "8px 16px", letterSpacing: 0.5 }}>
        User Page
      </div>

      {/* Outer frame */}
      <div style={{
        margin: "0 auto", width: "100%", maxWidth: 900,
        background: "white", borderRadius: 16,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        display: "flex", flexDirection: "column",
        minHeight: "calc(100vh - 40px)",
      }}>
        <Topbar />

        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar active="dashboard" />

          {/* Main Content */}
          <main style={{ flex: 1, padding: "28px 24px", overflowY: "auto" }}>

            {/* Welcome */}
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", lineHeight: 1.2, marginBottom: 8 }}>
              Selamat Datang kembali, Alex.<br />
              Siap untuk{" "}
              <span style={{ color: "#2563EB" }}>mengembalikan waktu Anda?</span>
            </h1>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
              Jaringan concierge pribadi Anda sudah aktif dan siap untuk misi Anda berikutnya.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
              {/* Left Column */}
              <div>
                {/* Tugas Cepat */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.8, marginBottom: 12 }}>
                    TUGAS CEPAT
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {TUGAS_CEPAT.map((t, i) => (
                      <Link key={i} href="/User/buat-tugas" style={{ textDecoration: "none" }}>
                        <div style={{
                          background: "white", border: "1px solid #E2E8F0",
                          borderRadius: 12, padding: "18px 14px", textAlign: "center",
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{t.sub}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tugas Aktif */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.8 }}>TUGAS AKTIF</div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 10px",
                      background: "#FEF3C7", color: "#D97706", borderRadius: 20,
                    }}>DALAM PROGRESS</span>
                  </div>

                  <div style={{
                    background: "white", border: "1px solid #E2E8F0",
                    borderRadius: 12, padding: 20,
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* Kurir Info */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "#1E293B", display: "flex", alignItems: "center",
                            justifyContent: "center", fontSize: 22,
                          }}>👨</div>
                          <div>
                            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>Courier Mitra:</div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>David K.</div>
                            <div style={{ fontSize: 10, color: "#2563EB", fontWeight: 700 }}>MISI AKTIF</div>
                          </div>
                        </div>

                        <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>
                          Belanja Bahan Makanan: Pasar Organik
                        </div>

                        {/* Progress */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <div style={{ flex: 1, height: 6, background: "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: progress + "%", height: "100%", background: "#2563EB", borderRadius: 3 }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>{progress}%</span>
                          <span style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>Selesai</span>
                        </div>

                        {/* Action */}
                        <div style={{ marginTop: 16 }}>
                          <button style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 14px", background: "#F8FAFF",
                            border: "1px solid #E2E8F0", borderRadius: 8,
                            fontSize: 12, fontWeight: 600, color: "#475569",
                            cursor: "pointer", fontFamily: "inherit",
                          }}>
                            📋 Lihat Daftar
                          </button>
                        </div>
                      </div>

                      {/* Status */}
                      <div style={{
                        background: "#F8FAFF", borderRadius: 10, padding: 16,
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.5, marginBottom: 10 }}>
                          STATUS SEKARANG
                        </div>
                        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>
                          Mengambil barang-barang terakhir di kasir. Diperkirakan tiba dalam 12 menit.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
                          <span>📍</span> 3.2 km
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Map */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.8, marginBottom: 10 }}>
                    MITRA DI SEKITAR
                  </div>
                  <MapBox />
                </div>

                {/* Mitra Tersedia */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.8, marginBottom: 10 }}>
                    TERSEDIA SEKARANG
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {MITRA_TERSEDIA.map((m, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: "white", border: "1px solid #E2E8F0",
                        borderRadius: 10, padding: "10px 12px",
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: m.warna + "22", color: m.warna,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, overflow: "hidden",
                        }}>
                          {i === 0 ? "👩" : "👨"}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{m.nama}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{m.rating} · {m.jarak}</div>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "3px 10px",
                          background: "#2563EB", color: "white", borderRadius: 20,
                        }}>SIAP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
