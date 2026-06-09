"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { API } from "../../api.js";

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

function InputField({ label, icon, type = "text", placeholder, id, autoComplete, value, onChange }) {
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
          value={value}
          onChange={onChange}
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

function LoginPanel({ onSwitch, role }) {
  const router = useRouter(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await fetch(API.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email, password, role: role }),
      });

      const data = await response.json();

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.data));

        alert("Login Berhasil!");

        if (data.role === "mitra") {
          try {
            const statusRes = await fetch(API.verificationStatus, {
              headers: {
                Authorization: `Bearer ${data.token}`,
                "ngrok-skip-browser-warning": "true",
              },
            });
            const statusData = await statusRes.json();
            const verStatus = statusData?.data?.status;
            if (verStatus === "APPROVED") {
              router.push("/mitra");
            } else {
              router.push("/mitra/verification");
            }
          } catch {
            router.push("/mitra/verification");
          }
        } else {
          router.push("/dashboard");
        }
      } else {
        const errMsg = data?.message || (data?.errors?.role ? data.errors.role[0] : "Email atau password salah.");
        setError(errMsg);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <InputField
        label="Email"
        icon={<MailIcon />}
        type="email"
        placeholder="nama@email.com"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        icon={<KeyIcon />}
        type="password"
        placeholder="Masukkan password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {error && (
        <p style={{ color: "#e53935", fontSize: 13, marginBottom: 12, marginTop: -6 }}>{error}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, marginTop: -4 }}>
        <Checkbox label="Ingat saya" defaultChecked />
        <a href="#" style={{ fontSize: 13, fontWeight: 600, color: "#3B5BFF", textDecoration: "none" }}>Lupa password?</a>
      </div>
      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ width: "100%", padding: 14, background: loading ? "#7a91ff" : "#3B5BFF", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(59,91,255,0.30)", letterSpacing: ".2px", transition: "background .2s" }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2945e0"; }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#3B5BFF"; }}
      >
        {loading ? "Memproses..." : "Masuk"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13.5, color: "#5c6070", marginTop: 18 }}>
        Belum punya akun?{" "}
        <span onClick={onSwitch} style={{ color: "#3B5BFF", fontWeight: 700, cursor: "pointer" }}>Daftar sekarang</span>
      </p>
    </div>
  );
}

function RegisterPanel({ onSwitch, role }) {
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleRegister = async () => {
    setError("");
    if (password !== confirmPass) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    setLoading(true);
    try {
      const endpoint = role === "mitra" ? API.registerMitra : API.registerUser;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          password,
          password_confirmation: confirmPass,
        }),
      });

      const data = await response.json();
      console.log("Register response:", data);

      if (!data.success) {
        const errMsg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(", ") : "Pendaftaran gagal. Periksa data Anda.");
        setError(errMsg);
        return;
      }

      alert("Pendaftaran berhasil! Silakan masuk.");
      onSwitch();
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <InputField
            label="Nama Depan"
            icon={<UserIcon />}
            placeholder="Budi"
            autoComplete="given-name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <InputField
            label="Nama Belakang"
            icon={<UserIcon />}
            placeholder="Santoso"
            autoComplete="family-name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
      </div>
      <InputField
        label="Email"
        icon={<MailIcon />}
        type="email"
        placeholder="nama@email.com"
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <InputField
        label="No. Telepon"
        icon={<PhoneIcon />}
        type="tel"
        placeholder="08xxxxxxxxxx"
        autoComplete="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <InputField
        label="Password"
        icon={<KeyIcon />}
        type="password"
        placeholder="Buat password"
        autoComplete="new-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <InputField
        label="Konfirmasi Password"
        icon={<KeyIcon />}
        type="password"
        placeholder="Ulangi password"
        autoComplete="new-password"
        value={confirmPass}
        onChange={e => setConfirmPass(e.target.value)}
      />

      {error && (
        <p style={{ color: "#e53935", fontSize: 13, marginBottom: 12, marginTop: -6 }}>{error}</p>
      )}

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
        onClick={handleRegister}
        disabled={loading}
        style={{ width: "100%", padding: 14, background: loading ? "#7a91ff" : "#3B5BFF", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(59,91,255,0.30)", letterSpacing: ".2px", transition: "background .2s" }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2945e0"; }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#3B5BFF"; }}
      >
        {loading ? "Memproses..." : "Daftar Sekarang"}
      </button>
      <p style={{ textAlign: "center", fontSize: 13.5, color: "#5c6070", marginTop: 18 }}>
        Sudah punya akun?{" "}
        <span onClick={onSwitch} style={{ color: "#3B5BFF", fontWeight: 700, cursor: "pointer" }}>Masuk di sini</span>
      </p>
    </div>
  );
}

export default function AuthPage() {
  const [panel, setPanel] = useState("login");
  const [role, setRole]   = useState("user");

  const isLogin  = panel === "login";
  const title    = isLogin ? "Selamat Datang" : "Buat Akun";
  const subtitle = isLogin ? "Silakan masuk ke akun Anda" : "Daftarkan diri Anda sekarang";

  const rolesConfig = [
    { key: "user", label: "pengguna" },
    { key: "mitra", label: "mitra" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#e8ecf5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <a href="/" style={{ alignSelf: "flex-start", maxWidth: 420, width: "100%", color: "#5c6070", fontSize: 14, fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
        <BackIcon /> Kembali ke Beranda
      </a>

      <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 40px rgba(59,91,255,0.10), 0 2px 8px rgba(0,0,0,0.06)", padding: "40px 36px 36px", width: "100%", maxWidth: 420 }}>

        <div style={{ width: 64, height: 64, background: "#3B5BFF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 8px 24px rgba(59,91,255,0.30)" }}>
          <LockIcon />
        </div>

        <h1 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: "#1a1d2e", marginBottom: 6, letterSpacing: "-0.5px" }}>{title}</h1>
        <p  style={{ textAlign: "center", fontSize: 14, color: "#9fa3b0", marginBottom: 26 }}>{subtitle}</p>

        <div style={{ display: "flex", background: "#f4f5f8", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {rolesConfig.map(r => (
            <div
              key={r.key}
              onClick={() => setRole(r.key)}
              style={{
                flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 8,
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s",
                color: role === r.key ? "#3B5BFF" : "#9fa3b0",
                background: role === r.key ? "#fff" : "transparent",
                boxShadow: role === r.key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                textTransform: "capitalize",
              }}
            >
              {r.label}
            </div>
          ))}
        </div>

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

        {isLogin
          ? <LoginPanel role={role} onSwitch={() => setPanel("daftar")} />
          : <RegisterPanel role={role} onSwitch={() => setPanel("login")} />
        }

      </div>
    </div>
  );
}