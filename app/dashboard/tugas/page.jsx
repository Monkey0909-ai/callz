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
const TARIF_PER_KM = 5000;

function fmt(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function hitungSimulasiJarak(pickup, destination) {
  if (!pickup || !destination) return 0;
  const gabung = pickup.length + destination.length;
  return (gabung % 13) + 2; 
}

function Stepper({ step }) {
  const steps = [1, 2, 3, 4];
  const labels = ["Lokasi", "Detail", "Instruksi", "Bayar"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, justifyContent: "center" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: step >= s ? "#2563EB" : "#E2E8F0",
              color: step >= s ? "#fff" : "#94A3B8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              border: step === s ? "2px solid #2563EB" : "none",
              boxSizing: "border-box",
            }}>{s}</div>
            <span style={{ fontSize: 10, fontWeight: 600, color: step >= s ? "#2563EB" : "#94A3B8", whiteSpace: "nowrap" }}>{labels[i]}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 48, height: 2, background: step > s ? "#2563EB" : "#E2E8F0", marginBottom: 14 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function MapPlaceholder({ pickup, destination }) {
  let mapUrl = "https://maps.google.com/maps?q=Banjarmasin&t=&z=13&ie=UTF8&iwloc=&output=embed";

  // Perbaikan interpolasi string `${}` yang sebelumnya rusak
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

function CostSummary({ data }) {
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
              <option value="Belanja">Belanja</option>
              <option value="Dokumen">Dokumen</option>
              <option value="Paket">Paket</option>
              <option value="Antre">Antre</option>
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
      <NavBar onBack={onBack} onNext={onSubmit} nextLabel={loading ? "Memproses..." : "Lanjut ke Pembayaran →"} nextDisabled={loading} backLabel="← Kembali ke Map" />
    </div>
  );
}

// CALLZ GoPay number — ganti sesuai nomor GoPay merchant
const GOPAY_NUMBER = "0812-3456-7890";
const GOPAY_NAME   = "CallZ Concierge";

function StepPembayaran({ data, onBack, onSubmit, loading }) {
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
  const jarak = hitungSimulasiJarak(data.pickup, data.destination);
  const biayaJarak = jarak * TARIF_PER_KM;
  const total = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => { setConfirmed(true); setTimeout(() => onSubmit(), 900); }, 1600);
  };

  // ── QR Code simulasi GoPay ──
  const qrSize = 180;
  const qrCells = 21;
  const cellSize = qrSize / qrCells;
  function fakeQR(i, j) {
    const inTopLeft     = i < 7 && j < 7;
    const inTopRight    = i < 7 && j >= qrCells - 7;
    const inBottomLeft  = i >= qrCells - 7 && j < 7;
    if (inTopLeft || inTopRight || inBottomLeft) {
      const ri = inTopRight  ? i     : inBottomLeft ? i - (qrCells - 7) : i;
      const rj = inTopRight  ? j - (qrCells - 7) : j;
      const isOuter = ri === 0 || ri === 6 || rj === 0 || rj === 6;
      const isInner = ri >= 2 && ri <= 4 && rj >= 2 && rj <= 4;
      return isOuter || isInner ? "#2563EB" : "white";
    }
    // timing pattern
    if ((i === 6 && j > 7 && j < qrCells - 7) || (j === 6 && i > 7 && i < qrCells - 7)) {
      return (i + j) % 2 === 0 ? "#2563EB" : "white";
    }
    const seed = ((i * 53 + j * 29) ^ (i * 7 + j)) % 11;
    return seed < 5 ? "#2563EB" : "white";
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Pembayaran GoPay</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 4 : Scan QR atau transfer ke nomor GoPay CallZ</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* KIRI — QR + nomor GoPay */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Header branding */}
          <div style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "white", margin: 0, letterSpacing: -0.5 }}>GoPay</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>Total tagihan</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: "white", margin: 0 }}>{fmt(total)}</p>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ background: "white", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16 }}>Scan QR Code ini</p>
            <div style={{ display: "inline-block", padding: 12, background: "white", border: "3px solid #2563EB", borderRadius: 12, marginBottom: 14, boxShadow: "0 4px 20px rgba(37,99,235,0.15)" }}>
              <svg width={qrSize} height={qrSize} style={{ display: "block" }}>
                {/* white background */}
                <rect width={qrSize} height={qrSize} fill="white" />
                {Array.from({ length: qrCells }).map((_, i) =>
                  Array.from({ length: qrCells }).map((_, j) => {
                    const fill = fakeQR(i, j);
                    return (
                      <rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill={fill} />
                    );
                  })
                )}
                {/* Center GoPay logo overlay */}
                <rect x={qrSize/2 - 18} y={qrSize/2 - 18} width={36} height={36} rx={6} fill="white" />
                <rect x={qrSize/2 - 14} y={qrSize/2 - 14} width={28} height={28} rx={4} fill="#2563EB" />
                <text x={qrSize/2} y={qrSize/2 + 5} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">G</text>
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 4px" }}>Buka app <strong>Gojek</strong> → GoPay → Scan</p>
            <p style={{ fontSize: 11, color: "#94A3B8" }}>QR berlaku 15 menit · Jangan tutup halaman ini</p>
          </div>

          {/* Nomor GoPay untuk transfer manual */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14 }}>Atau Transfer ke Nomor GoPay</p>
            <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 11, color: "#2563EB", fontWeight: 600, margin: "0 0 2px" }}>{GOPAY_NAME}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", letterSpacing: 1, margin: 0 }}>{GOPAY_NUMBER}</p>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(GOPAY_NUMBER.replace(/\D/g,"")); }}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #BFDBFE", background: "white", color: "#2563EB", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
              >
                Salin
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>
              Kirim tepat <strong style={{ color: "#0F172A" }}>{fmt(total)}</strong> ke nomor di atas. Tulis nama kamu sebagai catatan transfer.
            </p>
          </div>
        </div>

        {/* KANAN — ringkasan + konfirmasi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Ringkasan biaya */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 22 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Ringkasan Pesanan</p>
            <Row label="Layanan Dasar"             value={fmt(BASE_FEE)} />
            <Row label={`Kategori (${kat.label})`} value={`+${fmt(kat.extra)}`} />
            <Row label={`Ongkir (${jarak} km)`}    value={`+${fmt(biayaJarak)}`} valueColor="#10B981" />
            <Row label="Tips"                       value={`+${fmt(data.extraFee)}`} />
            <div style={{ borderTop: "1.5px solid #F1F5F9", marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Total Pembayaran</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#2563EB" }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Info tugas */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 22 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Detail Tugas</p>
            <Row label="Judul"    value={data.judulTugas || "—"} />
            <Row label="Paket"    value={data.jenisPaket || "—"} />
            <Row label="Dari"     value={data.pickup || "—"} />
            <Row label="Ke"       value={data.destination || "—"} />
            <Row label="Penerima" value={data.telepon || "—"} />
          </div>

          {/* Instruksi langkah */}
          <div style={{ background: "#F8FAFF", border: "1.5px dashed #93C5FD", borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 10 }}>📋 Cara Bayar</p>
            {[
              "Scan QR di kiri atau buka GoPay",
              `Transfer tepat ${fmt(total)} ke ${GOPAY_NUMBER}`,
              'Klik "Sudah Bayar" di bawah',
              "Mitra akan segera dikonfirmasi",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 3 ? 8 : 0, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2563EB", color: "white", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tombol konfirmasi */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
        <button onClick={onBack} style={btnOutlineStyle}>← Kembali ke Instruksi</button>
        <button
          onClick={handlePay}
          disabled={paid || loading}
          style={{
            ...btnPrimaryStyle,
            background: confirmed ? "#10B981" : "#2563EB",
            opacity: paid && !confirmed ? 0.7 : 1,
            cursor: paid ? "not-allowed" : "pointer",
            gap: 8, minWidth: 220, justifyContent: "center",
            transition: "background 0.3s",
          }}
        >
          {confirmed ? "✓ Pembayaran Dikonfirmasi!" : paid ? "⏳ Memverifikasi..." : "✅ Sudah Bayar via GoPay"}
        </button>
      </div>
    </div>
  );
}

function SuccessView({ generatedData, onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tugas Berhasil Dibuat!</h2>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>
        Kami sedang mencarikan kurir terdekat untuk tugas <strong>{generatedData.judul}</strong>
      </p>
      <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24, maxWidth: 400, margin: "0 auto 32px", textAlign: "left" }}>
        <Row label="ID Tugas" value={generatedData.id} />
        <Row label="Judul" value={generatedData.judul} />
        <Row label="Kurir" value={generatedData.kurir} />
        <Row label="Jarak Estimasi" value={generatedData.jarakKm + " km"} />
        <Row label="Durasi Estimasi" value={generatedData.durasi} />
        <Row label="Kategori" value={generatedData.kategori} />
        <Row label="Status" value={generatedData.status} valueColor="#F59E0B" />
        <Row label="Total Biaya" value={fmt(generatedData.biaya)} valueColor="#2563EB" />
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/dashboard/riwayat" style={btnOutlineStyle}>← Lihat di Riwayat</Link>
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
    judulTugas: "", instruksi: "", jenisPaket: "", 
    namaPenerima: "", telepon: "", kategori: "ringan", extraFee: 0,
  });
  const [lastSavedTask, setLastSavedTask] = useState(null);

  // ── FUNGSIONALITAS UTAMA: MENYIMPAN KE LOCALSTORAGE ──
  const handleSubmit = () => {
    setLoad(true);

    setTimeout(() => {
      const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
      const jarak = hitungSimulasiJarak(data.pickup, data.destination);
      const biayaJarak = jarak * TARIF_PER_KM;
      const totalBiaya = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

      // Hitung durasi estimasi dari jarak (asumsi kecepatan rata-rata 30 km/jam)
      const menitPerjalanan = Math.round((jarak / 30) * 60);
      const durasiLabel = menitPerjalanan < 60
        ? `${menitPerjalanan} menit`
        : `${Math.floor(menitPerjalanan / 60)} jam ${menitPerjalanan % 60} menit`;

      // Kurir DIKOSONGKAN — akan diisi nama akun mitra saat mereka ambil job
      const taskFormatRiwayat = {
        id: "CZ-" + Math.floor(Math.random() * 900 + 100),
        icon: data.jenisPaket === "Belanja" ? "🛒" : data.jenisPaket === "Dokumen" ? "📄" : data.jenisPaket === "Antre" ? "⏳" : "📦",
        judul: data.judulTugas,
        kategori: data.jenisPaket,
        kurir: "Menunggu mitra...",
        inisial: "?",
        tanggal: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        durasi: durasiLabel,
        jarakKm: jarak,
        status: "Menunggu",
        rating: 0,
        biaya: totalBiaya,
        // ── Data lokasi & instruksi untuk peta rute mitra ──
        pickup: data.pickup,
        destination: data.destination,
        locationNote: data.locationNote,
        instruksi: data.instruksi,
        namaPenerima: data.namaPenerima,
        telepon: data.telepon,
      };

      // Ambil data lama, gabungkan, lalu simpan kembali
      const existingTasks = JSON.parse(localStorage.getItem("callz_tasks")) || [];
      const updatedTasks = [taskFormatRiwayat, ...existingTasks];
      localStorage.setItem("callz_tasks", JSON.stringify(updatedTasks));

      setLastSavedTask(taskFormatRiwayat);
      setLoad(false);
      setDone(true);
    }, 1200);
  };

  const reset = () => {
    setDone(false); 
    setStep(1);
    setLastSavedTask(null);
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
        <Link href="/dashboard/riwayat" style={{ ...btnPrimaryStyle, fontSize: 13, padding: "8px 18px" }}>
          Ke Halaman Riwayat
        </Link>
      </nav>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, letterSpacing: 0.5, marginBottom: 20, textTransform: "uppercase" }}>
          Mission Page
        </div>
        <div style={{ border: "1.5px dashed #93C5FD", borderRadius: 16, padding: "28px 32px", background: "white", marginBottom: 32 }}>
          <Stepper step={step} />
          {done && lastSavedTask ? (
            <SuccessView generatedData={lastSavedTask} onReset={reset} />
          ) : (
            <>
              {step === 1 && <StepLokasi    data={data} setData={setData} onNext={() => setStep(2)} />}
              {step === 2 && <StepDetail    data={data} setData={setData} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
              {step === 3 && <StepInstruksi data={data} setData={setData} onBack={() => setStep(2)} onSubmit={() => setStep(4)} loading={false} />}
              {step === 4 && <StepPembayaran data={data} onBack={() => setStep(3)} onSubmit={handleSubmit} loading={loading} />}
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