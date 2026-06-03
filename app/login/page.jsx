"use client";

import { useState } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12 19.79 19.79 0 0 1 1.7 3.38 2 2 0 0 1 3.68 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.06 6.06l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ── Sub-components ────────────────────────────────────────────────────────────
function InputField({ label, icon, type = "text", placeholder, id, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1a1d2e", marginBottom: 8 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9fa3b0", display: "flex", alignItems: "center" }}>
          {icon}
        </span>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%", padding: "12px 14px 12px 42px",
            border: "1.5px solid #e4e6ed", borderRadius: 14,
            fontSize: 14, fontFamily: "inherit", color: "#1a1d2e",
            background: "#fff", outline: "none",
            transition: "border-color .2s, box-shadow .2s",
            paddingRight: isPassword ? 42 : 14,
          }}
          onFocus={e => { e.target.style.borderColor = "#3B5BFF"; e.target.style.boxShadow = "0 0 0 3px rgba(59,91,255,0.12)"; }}
          onBlur={e => { e.target.style.borderColor = "#e4e6ed"; e.target.style.boxShadow = "none"; }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9fa3b0", display: "flex", alignItems: "center", padding: 0 }}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

function Checkbox({ label, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label onClick={() => setChecked(c => !c)} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#5c6070", cursor: "pointer", userSelect: "none" }}>
      <span style={{
        width: 18, height: 18, border: checked ? "none" : "1.5px solid #e4e6ed",
        borderRadius: 5, background: checked ? "#3B5BFF" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1, transition: "all .2s",
      }}>
        {checked && <CheckIcon />}
      </span>
      {label}
    </label>
  );
}

function SocialButtons({ label }) {
  const btnStyle = {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 0", border: "1.5px solid #e4e6ed", borderRadius: 14,
    background: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "inherit",
    color: "#1a1d2e", cursor: "pointer", transition: "border-color .2s, box-shadow .2s",
  };
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: "#e4e6ed" }} />
        <span style={{ fontSize: 12, color: "#9fa3b0", whiteSpace: "nowrap" }}>Atau {label} dengan</span>
        <div style={{ flex: 1, height: 1, background: "#e4e6ed" }} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button style={btnStyle} onMouseEnter={e => e.currentTarget.style.borderColor = "#9fa3b0"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e4e6ed"}>
          <GoogleIcon /> Google
        </button>
        <button style={btnStyle} onMouseEnter={e => e.currentTarget.style.borderColor = "#9fa3b0"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e4e6ed"}>
          <FacebookIcon /> Facebook
        </button>
      </div>
    </>
  );
}

// ── Login Panel ───────────────────────────────────────────────────────────────
function LoginPanel({ onSwitch }) {
  return (
    <div>
      <InputField label="Email" icon={<MailIcon />} type="email" placeholder="nama@email.com" autoComplete="email" />
      <InputField label="Password" icon={<KeyIcon />} type="password" placeholder="Masukkan password" autoComplete="current-password" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, marginTop: -4 }}>
        <Checkbox label="Ingat saya" defaultChecked />
        <a href="#" style={{ fontSize: 13, fontWeight: 600, color: "#3B5BFF", textDecoration: "none" }}>Lupa password?</a>
      </div>
      <button
        style={{ width: "100%", padding: 14, background: "#3B5BFF", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(59,91,255,0.30)", letterSpacing: ".2px", transition: "background .2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#2945e0"}
        onMouseLeave={e => e.currentTarget.style.background = "#3B5BFF"}
      >
        Masuk
      </button>
      <p style={{ textAlign: "center", fontSize: 13.5, color: "#5c6070", marginTop: 18 }}>
        Belum punya akun?{" "}
        <span onClick={onSwitch} style={{ color: "#3B5BFF", fontWeight: 700, cursor: "pointer" }}>Daftar sekarang</span>
      </p>
      <SocialButtons label="masuk" />
    </div>
  );
}

// ── Register Panel ────────────────────────────────────────────────────────────
function RegisterPanel({ onSwitch }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <InputField label="Nama Depan" icon={<UserIcon />} placeholder="Budi" autoComplete="given-name" />
        </div>
        <div style={{ flex: 1 }}>
          <InputField label="Nama Belakang" icon={<UserIcon />} placeholder="Santoso" autoComplete="family-name" />
        </div>
      </div>
      <InputField label="Email" icon={<MailIcon />} type="email" placeholder="nama@email.com" autoComplete="email" />
      <InputField label="No. Telepon" icon={<PhoneIcon />} type="tel" placeholder="08xxxxxxxxxx" autoComplete="tel" />
      <InputField label="Password" icon={<KeyIcon />} type="password" placeholder="Buat password" autoComplete="new-password" />
      <InputField label="Konfirmasi Password" icon={<KeyIcon />} type="password" placeholder="Ulangi password" autoComplete="new-password" />
      <div style={{ marginBottom: 20 }}>
        <Checkbox
          label={
            <span>
              Saya menyetujui{" "}
              <a href="#" style={{ color: "#3B5BFF", fontWeight: 600, textDecoration: "none" }}>Syarat & Ketentuan</a>
              {" "}dan{" "}
              <a href="#" style={{ color: "#3B5BFF", fontWeight: 600, textDecoration: "none" }}>Kebijakan Privasi</a>
            </span>
          }
        />
      </div>
      <button
        style={{ width: "100%", padding: 14, background: "#3B5BFF", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 4px 16px rgba(59,91,255,0.30)", letterSpacing: ".2px", transition: "background .2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#2945e0"}
        onMouseLeave={e => e.currentTarget.style.background = "#3B5BFF"}
      >
        Daftar Sekarang
      </button>
      <p style={{ textAlign: "center", fontSize: 13.5, color: "#5c6070", marginTop: 18 }}>
        Sudah punya akun?{" "}
        <span onClick={onSwitch} style={{ color: "#3B5BFF", fontWeight: 700, cursor: "pointer" }}>Masuk di sini</span>
      </p>
      <SocialButtons label="daftar" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [panel, setPanel] = useState("login");   // "login" | "daftar"
  const [role, setRole]   = useState("pengguna"); // "pengguna" | "mitra"

  const isLogin  = panel === "login";
  const title    = isLogin ? "Selamat Datang" : "Buat Akun";
  const subtitle = isLogin ? "Silakan masuk ke akun Anda" : "Daftarkan diri Anda sekarang";

  return (
    <div style={{ minHeight: "100vh", background: "#e8ecf5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Back link */}
      <a href="/" style={{ alignSelf: "flex-start", maxWidth: 420, width: "100%", color: "#5c6070", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
        <BackIcon /> Kembali ke Beranda
      </a>

      {/* Card */}
      <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 40px rgba(59,91,255,0.10), 0 2px 8px rgba(0,0,0,0.06)", padding: "40px 36px 36px", width: "100%", maxWidth: 420 }}>

        {/* Lock icon */}
        <div style={{ width: 64, height: 64, background: "#3B5BFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 8px 24px rgba(59,91,255,0.30)" }}>
          <LockIcon />
        </div>

        {/* Title */}
        <h1 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#1a1d2e", marginBottom: 6, letterSpacing: "-0.5px" }}>{title}</h1>
        <p  style={{ textAlign: "center", fontSize: 14, color: "#9fa3b0", marginBottom: 26 }}>{subtitle}</p>

        {/* Role tabs */}
        <div style={{ display: "flex", background: "#f4f5f8", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["pengguna", "mitra"].map(r => (
            <div
              key={r}
              onClick={() => setRole(r)}
              style={{
                flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                color: role === r ? "#3B5BFF" : "#9fa3b0",
                background: role === r ? "#fff" : "transparent",
                boxShadow: role === r ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                textTransform: "capitalize",
              }}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </div>
          ))}
        </div>

        {/* Auth tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #e4e6ed", marginBottom: 26 }}>
          {[{ key: "login", label: "Masuk" }, { key: "daftar", label: "Daftar" }].map(t => (
            <div
              key={t.key}
              onClick={() => setPanel(t.key)}
              style={{
                flex: 1, textAlign: "center", padding: "10px 0 12px",
                fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "color .2s",
                color: panel === t.key ? "#3B5BFF" : "#9fa3b0",
                position: "relative",
              }}
            >
              {t.label}
              {panel === t.key && (
                <span style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: 2, background: "#3B5BFF", borderRadius: 2 }} />
              )}
            </div>
          ))}
        </div>

        {/* Panel */}
        {isLogin
          ? <LoginPanel   onSwitch={() => setPanel("daftar")} />
          : <RegisterPanel onSwitch={() => setPanel("login")} />
        }

      </div>
    </div>
  );
}
