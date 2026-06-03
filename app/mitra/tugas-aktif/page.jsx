"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const tugasData = [
  {
    id: 1,
    mitra: "David K.",
    label: "MISI AKTIF",
    labelColor: "#2563EB",
    tugas: "Belanja Bahan Makanan: Pasar Organik",
    progress: 75,
    status: "Mengambil barang-barang terakhir di kasir. Diperkirakan tiba dalam 12 menit.",
    jarak: "3.2 km",
    avatar: "DK",
    avatarColor: "#3b5bdb",
  },
  {
    id: 2,
    mitra: "Sarah L.",
    label: "MISI AKTIF",
    labelColor: "#2563EB",
    tugas: "Ambil Paket: JNE Cabang Utama",
    progress: 45,
    status: "Sedang dalam perjalanan ke lokasi pengambilan paket.",
    jarak: "1.8 km",
    avatar: "SL",
    avatarColor: "#e07b5a",
  },
  {
    id: 3,
    mitra: "Marcus J.",
    label: "MENUNGGU",
    labelColor: "#F59E0B",
    tugas: "Antre: Kantor Imigrasi",
    progress: 10,
    status: "Mitra sedang menuju lokasi antrean.",
    jarak: "5.1 km",
    avatar: "MJ",
    avatarColor: "#5a7be0",
  },
];

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

function Sidebar({ active }) {
  return (
    <div style={{
      width: 200, minHeight: "100vh", background: "#fff",
      borderRight: "1px solid #e5e7eb",
      display: "flex", flexDirection: "column",
      padding: "24px 0",
      position: "sticky", top: 0,
    }}>
      <div style={{ padding: "0 20px 28px", fontSize: 20, fontWeight: 900, color: "#2563eb", letterSpacing: -0.5 }}>
        CALLZ<span style={{ color: "#0f172a" }}></span>
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
          M
          <div style={{
            position: "absolute", bottom: 1, right: 1,
            width: 10, height: 10, borderRadius: "50%",
            background: "#22c55e", border: "2px solid #fff",
          }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>Mitra Aktif</div>
          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, lineHeight: 1.4 }}>
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

function TugasCard({ tugas }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb",
      borderRadius: 16, padding: 24, marginBottom: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: tugas.avatarColor, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 16, flexShrink: 0,
            }}>{tugas.avatar}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                Courier Mitra:<br />{tugas.mitra}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: tugas.labelColor, letterSpacing: 0.5 }}>
                {tugas.label}
              </span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 8 }}>
            {tugas.tugas}
            <span style={{ color: "#2563eb", marginLeft: 8 }}>{tugas.progress}% Selesai</span>
          </div>
          <div style={{ background: "#e2e8f0", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${tugas.progress}%`, height: "100%", background: "#2563eb", borderRadius: 99 }} />
          </div>
        </div>

        <div style={{ background: "#f8faff", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>
            Status Sekarang
          </div>
          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{tugas.status}</p>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 5, color: "#2563eb", fontSize: 12, fontWeight: 600 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {tugas.jarak}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TugasAktifPage() {
  return (
    <div className={plusJakarta.className} style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar active="/mitra/tugas-aktif" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, color: "#0f172a" }}>Mitra Dashboard</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>Selamat Datang Kembali! Disekitar</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#374151", fontWeight: 600 }}>Kamu ada {tugasData.length} Tugas.</p>
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 16, textTransform: "uppercase" }}>
            Tugas Aktif
          </p>
          {tugasData.map(t => <TugasCard key={t.id} tugas={t} />)}
        </div>

        <footer style={{ background: "#fff", borderTop: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>CALLZ</div>
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
