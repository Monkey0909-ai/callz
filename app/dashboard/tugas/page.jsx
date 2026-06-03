"use client";

import { useState } from "react";
import Link from "next/link";

const KATEGORI_LIST = [
  { id: "ringan",  label: "Ringan",  extra: 0,     badge: "#2563EB" },
  { id: "sedang",  label: "Sedang",  extra: 5000,  badge: "#F59E0B" },
  { id: "berat",   label: "Berat",   extra: 15000, badge: "#EF4444" },
  { id: "khusus",  label: "Khusus",  extra: 25000, badge: "#7C3AED" },
];

const BASE_FEE = 20000;
const TARIF_PER_KM = 5000; // Tarif tambahan per kilometer rute

function fmt(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

// Fungsi simulasi untuk menghitung jarak berdasarkan panjang teks alamat agar simulasi terlihat dinamis & nyata
function hitungSimulasiJarak(pickup, destination) {
  if (!pickup || !destination) return 0;
  const gabung = pickup.length + destination.length;
  // Menghasilkan jarak antara 2 km sampai 15 km secara konsisten
  return (gabung % 13) + 2; 
}

function Stepper({ step }) {
  const steps = [1, 2, 3];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyvalue: "center", gap: 0, marginBottom: 32, justifyContent: "center" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: step >= s ? "#2563EB" : "#E2E8F0",
            color: step >= s ? "#fff" : "#94A3B8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700,
            border: step === s ? "2px solid #2563EB" : "none",
            boxSizing: "border-box",
          }}>{s}</div>
          {i < steps.length - 1 && (
            <div style={{ width: 48, height: 2, background: step > s ? "#2563EB" : "#E2E8F0" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ================= KOMPONEN MAPS DENGAN NAVIGASI RUTE NYATA =================
function MapPlaceholder({ pickup, destination }) {
  // Peta default Banjarmasin jika input kosong
  let mapUrl = "https://maps.google.com/maps?q=Banjarmasin&t=&z=13&ie=UTF8&iwloc=&output=embed";

  // Jika asal dan tujuan terisi, gunakan mode navigasi rute (direction) resmi dari Google Maps Embed
  if (pickup && destination) {
    mapUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(pickup)}&daddr=${encodeURIComponent(destination)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  } else if (pickup) {
    mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(pickup)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  } else if (destination) {
    mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }

  return (
    <div style={{
      borderRadius: 12, height: "100%", minHeight: 280,
      position: "relative", overflow: "hidden",
      border: "1px solid #E2E8F0", background: "#E5E7EB"
    }}>
      <iframe
        key={mapUrl} 
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, position: "absolute", inset: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      <div style={{
        position: "absolute", bottom: 12, left: 12,
        background: "rgba(255, 255, 255, 0.95)", border: "1px solid #E2E8F0",
        borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600,
        display: "flex", alignItems: "center", gap: 6, color: "#0F172A",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)", pointerEvents: "none", zIndex: 10
      }}>
        🗺️ {pickup && destination ? "Garis rute perjalanan aktif!" : "Masukkan lokasi asal & tujuan..."}
      </div>
    </div>
  );
}

// ================= RANGKUMAN BIAYA DENGAN VALIDASI JENIS PAKET & JARAK =================
function CostSummary({ data }) {
  // JANGAN TAMPILKAN HARGA JIKA JENIS PAKET BELUM DIPILIH / KOSONG
  if (!data.jenisPaket) {
    return (
      <div style={{ background: "#F8FAFF", border: "1.5px dashed #CBD5E1", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 200 }}>
        <span style={{ fontSize: 32, marginBottom: 12 }}>📦</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Harga Belum Tersedia</span>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, maxWidth: 220 }}>
          Silakan pilih <strong>Jenis Paket</strong> terlebih dahulu pada langkah berikutnya untuk memunculkan rincian biaya pengiriman.
        </p>
      </div>
    );
  }

  const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
  const jarak = hitungSimulasiJarak(data.pickup, data.destination);
  const biayaJarak = jarak * TARIF_PER_KM;
  const total = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

  return (
    <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>RINGKASAN BIAYA</span>
        <span style={{ fontSize: 12, background: "#E0F2FE", color: "#0369A1", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{data.jenisPaket.toUpperCase()}</span>
      </div>
      <Row label="Biaya Layanan Dasar" value={fmt(BASE_FEE)} />
      <Row label="Kategori Kerja" value={`+${fmt(kat.extra)}`} badge={kat.label} badgeColor={kat.badge} valueColor={kat.extra > 0 ? "#EF4444" : "#0F172A"} />
      <Row label={`Ongkir Jarak (${jarak} km)`} value={`+${fmt(biayaJarak)}`} valueColor="#10B981" />
      <Row label="Biaya Tambahan (Tips)" value={`+${fmt(data.extraFee)}`} />
      
      <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 14, paddingTop: 14 }}>
        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: 0.4, marginBottom: 4 }}>TOTAL ESTIMASI BIAYA</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#2563EB", letterSpacing: -0.5 }}>{fmt(total)}</span>
          <span style={{ fontSize: 11, color: "#94A3B8", maxWidth: 120, textAlign: "right", lineHeight: 1.4 }}>
            Tarif final sudah termasuk hitungan jarak rute jalan.
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, badge, badgeColor, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#475569" }}>{label}</span>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: badgeColor + "22", color: badgeColor, textTransform: "uppercase" }}>{badge}</span>
        )}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: valueColor || "#0F172A" }}>{value}</span>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function NavBar({ onBack, onNext, nextLabel, nextDisabled, backLabel }) {
  return (
    <div style={{ display: "flex", justifyContent: onBack ? "space-between" : "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid #F1F5F9", gap: 12 }}>
      {onBack && (
        <button onClick={onBack} style={btnOutlineStyle}>{backLabel || "← Kembali"}</button>
      )}
      <button onClick={onNext} disabled={nextDisabled} style={{ ...btnPrimaryStyle, opacity: nextDisabled ? 0.5 : 1, cursor: nextDisabled ? "not-allowed" : "pointer" }}>
        {nextLabel || "Lanjut →"}
      </button>
    </div>
  );
}

function StepLokasi({ data, setData, onNext }) {
  const ok = data.pickup && data.destination;
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Buat Tugas</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 1 : Tentukan lokasi penjemputan dan tujuan</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Alamat Penjemputan" required>
            <input style={inputStyle} placeholder="Contoh: Duta Mall Banjarmasin" value={data.pickup} onChange={e => setData(p => ({ ...p, pickup: e.target.value }))} />
          </FormField>
          <FormField label="Alamat Tujuan" required>
            <input style={inputStyle} placeholder="Contoh: Menara Pandang Banjarmasin" value={data.destination} onChange={e => setData(p => ({ ...p, destination: e.target.value }))} />
          </FormField>
          <FormField label="Catatan Lokasi">
            <input style={inputStyle} placeholder="Patokan, lantai, nomor gedung..." value={data.locationNote} onChange={e => setData(p => ({ ...p, locationNote: e.target.value }))} />
          </FormField>
        </div>
        {/* Peta mengikut rute otomatis */}
        <MapPlaceholder pickup={data.pickup} destination={data.destination} />
      </div>
      <NavBar onBack={null} onNext={onNext} nextDisabled={!ok} nextLabel="Lanjut ke Detail →" />
    </div>
  );
}

function StepDetail({ data, setData, onBack, onNext }) {
  const ok = data.judulTugas && data.telepon && data.jenisPaket;
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Buat Tugas</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 2 : Lengkapi informasi paket dan penerima</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Judul Tugas" required>
            <input style={inputStyle} placeholder="misalnya, Pencarian Dokumen Cepat" value={data.judulTugas} onChange={e => setData(p => ({ ...p, judulTugas: e.target.value }))} />
          </FormField>
          <FormField label="Jenis Paket" required>
            <select style={{ ...inputStyle, backgroundImage: chevron, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", appearance: "none" }} value={data.jenisPaket} onChange={e => setData(p => ({ ...p, jenisPaket: e.target.value }))}>
              <option value="">-- Pilih Jenis Paket --</option>
              <option value="dokumen">Dokumen</option>
              <option value="paket-kecil">Paket Kecil {"(<1kg)"}</option>
              <option value="paket-sedang">Paket Sedang (1–5kg)</option>
              <option value="paket-besar">Paket Besar {"(>5kg)"}</option>
            </select>
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Nama Penerima">
              <input style={inputStyle} placeholder="Nama lengkap" value={data.namaPenerima} onChange={e => setData(p => ({ ...p, namaPenerima: e.target.value }))} />
            </FormField>
            <FormField label="Telepon Penerima" required>
              <input style={inputStyle} placeholder="+62 8xx-xxxx-xxxx" value={data.telepon} onChange={e => setData(p => ({ ...p, telepon: e.target.value }))} />
            </FormField>
          </div>
        </div>
        <CostSummary data={data} />
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextDisabled={!ok} nextLabel="Lanjut ke Instruksi →" />
    </div>
  );
}

function StepInstruksi({ data, setData, onBack, onSubmit, loading }) {
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Buat Tugas</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 3 : Uraikan tugas dan detail instruksi</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Judul Tugas">
            <input style={{ ...inputStyle, background: "#F8FAFF" }} value={data.judulTugas} disabled />
          </FormField>
          <FormField label="Detail Instruksi">
            <textarea style={{ ...inputStyle, minHeight: 96, resize: "vertical" }} placeholder="Sebutkan lokasi tertentu, nama kontak, atau persyaratan khusus..." value={data.instruksi} onChange={e => setData(p => ({ ...p, instruksi: e.target.value }))} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Kategori Pekerjaan">
              <select style={{ ...inputStyle, backgroundImage: chevron, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", appearance: "none" }} value={data.kategori} onChange={e => setData(p => ({ ...p, kategori: e.target.value }))}>
                {KATEGORI_LIST.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </FormField>
            <FormField label="Telepon Penerima">
              <input style={{ ...inputStyle, background: "#F8FAFF" }} value={data.telepon} disabled />
            </FormField>
          </div>
          <FormField label="Biaya Tambahan">
            <input style={inputStyle} placeholder="Rp 0"
              value={data.extraFee === 0 ? "Rp 0" : "Rp " + data.extraFee.toLocaleString("id-ID")}
              onChange={e => { const num = parseInt(e.target.value.replace(/\D/g, "")) || 0; setData(p => ({ ...p, extraFee: num })); }}
            />
          </FormField>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MapPlaceholder pickup={data.pickup} destination={data.destination} />
          <CostSummary data={data} />
        </div>
      </div>
      <NavBar onBack={onBack} onNext={onSubmit} nextLabel={loading ? "Memproses..." : "Proses Pembayaran →"} nextDisabled={loading} backLabel="← Kembali ke Map" />
    </div>
  );
}

function SuccessView({ data, onReset }) {
  const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
  const jarak = hitungSimulasiJarak(data.pickup, data.destination);
  const biayaJarak = jarak * TARIF_PER_KM;
  const total = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tugas Berhasil Dibuat!</h2>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>
        Kami sedang mencarikan kurir terdekat untuk tugas <strong>{data.judulTugas}</strong>
      </p>
      <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24, maxWidth: 400, margin: "0 auto 32px", textAlign: "left" }}>
        <Row label="ID Tugas" value={"#CZ-" + Math.floor(Math.random()*900+100)} />
        <Row label="Dari" value={data.pickup} />
        <Row label="Ke" value={data.destination} />
        <Row label="Jarak" value={`${jarak} km`} />
        <Row label="Kategori" value={kat.label} badge={kat.label} badgeColor={kat.badge} />
        <Row label="Total Biaya" value={fmt(total)} valueColor="#2563EB" />
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/dashboard" style={btnOutlineStyle}>← Kembali ke Dashboard</Link>
        <button onClick={onReset} style={btnPrimaryStyle}>+ Buat Tugas Baru</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #E2E8F0", borderRadius: 8,
  fontSize: 14, fontFamily: "inherit", color: "#0F172A",
  background: "white", outline: "none", boxSizing: "border-box",
};

const btnPrimaryStyle = {
  padding: "11px 24px", background: "#2563EB", color: "white",
  border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit", textDecoration: "none",
  display: "inline-flex", alignItems: "center",
};

const btnOutlineStyle = {
  padding: "11px 24px", background: "transparent", color: "#2563EB",
  border: "1.5px solid #2563EB", borderRadius: 8, fontSize: 14, fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit", textDecoration: "none",
  display: "inline-flex", alignItems: "center",
};

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;

export default function TugasPage() {
  const [step, setStep]    = useState(1);
  const [done, setDone]    = useState(false);
  const [loading, setLoad] = useState(false);
  const [data, setData]    = useState({
    pickup: "", destination: "", locationNote: "",
    judulTugas: "", instruksi: "", jenisPaket: "", // Default dikosongkan agar memicu validasi sembunyi harga
    namaPenerima: "", telepon: "", kategori: "ringan", extraFee: 0,
  });

  const handleSubmit = () => {
    setLoad(true);
    setTimeout(() => { setLoad(false); setDone(true); }, 1200);
  };

  const reset = () => {
    setDone(false); setStep(1);
    setData({ pickup: "", destination: "", locationNote: "", judulTugas: "", instruksi: "", jenisPaket: "", namaPenerima: "", telepon: "", kategori: "ringan", extraFee: 0 });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#2563EB", letterSpacing: -0.5 }}>
          CALLZ<span style={{ color: "#0F172A" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Layanan", "Tentang", "Bantuan"].map(n => (
            <a key={n} href="#" style={{ fontSize: 14, color: "#475569", textDecoration: "none", fontWeight: 500 }}>{n}</a>
          ))}
        </div>
        <Link href="/dashboard" style={{ ...btnPrimaryStyle, fontSize: 13, padding: "8px 18px" }}>
          Kembali ke Dashboard
        </Link>
      </nav>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, letterSpacing: 0.5, marginBottom: 20, textTransform: "uppercase" }}>
          Mission Page
        </div>
        <div style={{ border: "1.5px dashed #93C5FD", borderRadius: 16, padding: "28px 32px", background: "white", marginBottom: 32 }}>
          <Stepper step={step} />
          {done ? (
            <SuccessView data={data} onReset={reset} />
          ) : (
            <>
              {step === 1 && <StepLokasi    data={data} setData={setData} onNext={() => setStep(2)} />}
              {step === 2 && <StepDetail    data={data} setData={setData} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
              {step === 3 && <StepInstruksi data={data} setData={setData} onBack={() => setStep(2)} onSubmit={handleSubmit} loading={loading} />}
            </>
          )}
        </div>
      </main>

      <footer style={{ background: "white", borderTop: "1px solid #E2E8F0", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0F172A" }}>CALLZ</div>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>© 2026 CallZ Concierge. Built for Precision.</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Twitter", "Instagram"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}