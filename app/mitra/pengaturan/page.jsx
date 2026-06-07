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

function Sidebar({ active, userDisplayName }) {
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
          <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
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

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, marginBottom: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</div>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: "100%", padding: "10px 14px", fontSize: 13,
        border: "1px solid #e5e7eb", borderRadius: 10,
        outline: "none", fontFamily: "inherit", color: disabled ? "#94a3b8" : "#0f172a",
        background: disabled ? "#f8fafc" : "#fff", boxSizing: "border-box",
      }}
    />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 99, cursor: "pointer",
          background: checked ? "#2563eb" : "#e2e8f0",
          position: "relative", transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: checked ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }} />
      </div>
    </div>
  );
}

export default function PengaturanPage() {
  const [nama, setNama] = useState("Mitra Aktif");
  const [email, setEmail] = useState("mitra@callz.id");
  const [telepon, setTelepon] = useState("+62 812 3456 7890");
  const [kota, setKota] = useState("Banjarmasin");

  const [notifTugas, setNotifTugas] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWA, setNotifWA] = useState(true);

  const [saved, setSaved] = useState(false);

  // Fungsi untuk membaca dan menggabungkan first_name + last_name dari pendaftaran akun
  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Cek jika ada first_name & last_name hasil pendaftaran akun
        if (parsedUser.first_name || parsedUser.last_name) {
          setNama(`${parsedUser.first_name || ""} ${parsedUser.last_name || ""}`.trim());
        } else if (parsedUser.name) {
          setNama(parsedUser.name);
        }

        if (parsedUser.email) setEmail(parsedUser.email);
        if (parsedUser.phone || parsedUser.no_telp) {
          setTelepon(parsedUser.phone || parsedUser.no_telp);
        }
        if (parsedUser.city || parsedUser.kota) {
          setKota(parsedUser.city || parsedUser.kota);
        }
      } catch (e) {
        console.error("Gagal memproses data akun dari localStorage", e);
      }
    }
  };

  useEffect(() => {
    loadUserData();
    
    // Dengarkan event agar sinkron jika ada pembaruan di tab/komponen lain
    window.addEventListener("profileUpdated", loadUserData);
    return () => window.removeEventListener("profileUpdated", loadUserData);
  }, []);

  function handleSave() {
    const storedUser = localStorage.getItem("user");
    let currentData = {};
    
    if (storedUser) {
      try {
        currentData = JSON.parse(storedUser);
      } catch (e) {
        console.error(e);
      }
    }

    // Pisahkan kembali string nama baru ke first_name dan last_name saat disimpan
    const nameParts = nama.trim().split(" ");
    currentData.first_name = nameParts[0] || "";
    currentData.last_name = nameParts.slice(1).join(" ") || "";
    currentData.name = nama;
    currentData.phone = telepon;
    currentData.kota = kota;

    localStorage.setItem("user", JSON.stringify(currentData));

    // MEMICU EVENT: Memberitahu seluruh halaman/sidebar agar ikut berganti nama secara real-time
    window.dispatchEvent(new Event("profileUpdated"));

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const mainAvatarLetter = nama ? nama.charAt(0).toUpperCase() : "M";

  return (
    <div className={plusJakarta.className} style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5" }}>
      <Sidebar active="/mitra/pengaturan" userDisplayName={nama} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#0f172a" }}>Pengaturan</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748b" }}>Kelola profil dan preferensi akun kamu</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", cursor: "pointer", background: "#fff", justifyContent: "center" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Kolom kiri */}
            <div>
              <Section title="Profil Mitra">
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, position: "relative" }}>
                    {mainAvatarLetter}
                    <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#22c55e", border: "2px solid #fff" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{nama}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>LAYANAN CONCIERGE TERVERIFIKASI</div>
                    <button style={{ marginTop: 6, fontSize: 12, color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
                      Ganti Foto
                    </button>
                  </div>
                </div>

                <Field label="Nama Lengkap">
                  <Input value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama lengkap" />
                </Field>
                <Field label="Email">
                  <Input value={email} placeholder="email@example.com" type="email" disabled={true} />
                </Field>
                <Field label="Nomor Telepon" hint="Digunakan untuk konfirmasi tugas via WhatsApp">
                  <Input value={telepon} onChange={e => setTelepon(e.target.value)} placeholder="+62..." />
                </Field>
                <Field label="Kota Layanan">
                  <Input value={kota} onChange={e => setKota(e.target.value)} placeholder="Kota kamu" />
                </Field>
              </Section>

              <Section title="Keamanan">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Password Baru" hint="Kosongkan jika tetap">
                    <Input type="password" value="" placeholder="••••••••" onChange={() => {}} />
                  </Field>
                  <Field label="Konfirmasi Password">
                    <Input type="password" value="" placeholder="••••••••" onChange={() => {}} />
                  </Field>
                </div>
                <button style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, background: "#f1f5f9", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
                  Ubah Password
                </button>
              </Section>
            </div>

            {/* Kolom kanan */}
            <div>
              <Section title="Notifikasi">
                <Toggle checked={notifTugas} onChange={setNotifTugas} label="Notifikasi update tugas" />
                <Toggle checked={notifWA} onChange={setNotifWA} label="Notifikasi via WhatsApp" />
                <Toggle checked={notifEmail} onChange={setNotifEmail} label="Notifikasi via Email" />
                <Toggle checked={notifPromo} onChange={setNotifPromo} label="Promo & penawaran spesial" />
              </Section>

              <Section title="Status Akun">
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#f0fdf4", borderRadius: 12, marginBottom: 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Akun Terverifikasi</div>
                    <div style={{ fontSize: 11, color: "#16a34a", marginTop: 1 }}>Mitra aktif sejak Januari 2026</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span>Total Tugas Selesai</span><span style={{ fontWeight: 700, color: "#0f172a" }}>47</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span>Rating Rata-rata</span><span style={{ fontWeight: 700, color: "#f59e0b" }}>4.8 ★</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                    <span>Level Mitra</span><span style={{ fontWeight: 700, color: "#2563eb" }}>Gold</span>
                  </div>
                </div>
              </Section>

              <Section title="Zona Bahaya">
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
                  Tindakan berikut bersifat permanen dan tidak dapat dibatalkan.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, background: "#fff", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
                    Nonaktifkan Akun
                  </button>
                  <button style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 10, cursor: "pointer", fontFamily: "inherit" }}>
                    Hapus Akun
                  </button>
                </div>
              </Section>
            </div>
          </div>

          {/* Save button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
            <button onClick={handleSave} style={{
              padding: "12px 32px", fontSize: 14, fontWeight: 700,
              background: saved ? "#22c55e" : "#2563eb", color: "#fff",
              border: "none", borderRadius: 12, cursor: "pointer",
              fontFamily: "inherit", transition: "background 0.2s",
            }}>
              {saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
            </button>
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