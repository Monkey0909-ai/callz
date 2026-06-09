'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/dashboard' },
  { label: 'Riwayat',     icon: '🕐', href: '/dashboard/riwayat' },
  { label: 'Pengaturan', icon: '⚙', href: '/dashboard/pengaturan', active: true },
]

const settingsTabs = [
  { id: 'profil',     label: 'Profil' },
  { id: 'notifikasi', label: 'Notifikasi' },
  { id: 'keamanan',   label: 'Keamanan' },
  { id: 'pembayaran', label: 'Pembayaran' },
  { id: 'alamat',     label: 'Alamat' },
  { id: 'bantuan',    label: 'Bantuan' },
]

function Field({ label, value = '', type = 'text', placeholder, hint, readOnly, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
        {label}
      </label>
      <input
        type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder} 
        readOnly={readOnly}
        style={{
          width: '100%', padding: '10px 14px',
          border: '1.5px solid #e2e8f0', borderRadius: 10,
          fontSize: 14, fontFamily: 'inherit', color: readOnly ? '#94a3b8' : '#0f172a',
          background: readOnly ? '#f8fafc' : '#fff', outline: 'none', boxSizing: 'border-box',
        }}
      />
      {hint && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{hint}</p>}
    </div>
  )
}

function Toggle({ on, setOn }) {
  return (
    <button onClick={() => setOn(!on)} style={{
      width: 42, height: 23, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: on ? '#2563eb' : '#e2e8f0', position: 'relative', transition: 'background .2s', flexShrink: 0,
    }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
        {title}
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}

function ProfilPanel({ firstName, setFirstName, lastName, setLastName, email, setEmail, phone, setPhone, birthDate, setBirthDate, onSave, saveStatus, saveError }) {
  return (
    <>
      <Section title="Foto Profil">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
            {firstName ? firstName.charAt(0).toUpperCase() : '😊'}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{firstName || 'User'}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10 }}>JPG, PNG maks. 2MB</p>
            <button style={{ padding: '7px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: '#475569' }}>Ganti Foto</button>
          </div>
        </div>
      </Section>
      <Section title="Informasi Pribadi">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
          <Field label="Nama Depan" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Field label="Nama Belakang" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Field label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" hint="Gunakan alamat email aktif Anda" />
        <Field label="No. Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
        <Field label="Tanggal Lahir" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="date" />
        <button 
          onClick={onSave}
          disabled={saveStatus === 'Menyimpan...'}
          style={{ 
            padding: '10px 22px', 
            background: saveStatus === 'Tersimpan!' ? '#22c55e' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 10, 
            fontSize: 13, 
            fontWeight: 700, 
            cursor: saveStatus === 'Menyimpan...' ? 'wait' : 'pointer', 
            fontFamily: 'inherit',
            transition: 'background 0.2s',
            opacity: saveStatus === 'Menyimpan...' ? 0.7 : 1,
          }}
        >
          {saveStatus}
        </button>
        {saveError && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 10 }}>{saveError}</p>}
      </Section>
    </>
  )
}

function NotifikasiPanel() {
  const items = [
    { label: 'Status Tugas', desc: 'Notifikasi saat status tugas berubah', def: true },
    { label: 'Kurir Ditemukan', desc: 'Info ketika kurir menerima tugasmu', def: true },
    { label: 'Tugas Selesai', desc: 'Konfirmasi saat tugas selesai', def: true },
    { label: 'Promo & Penawaran', desc: 'Diskon dan voucher eksklusif', def: false },
  ]
  return (
    <Section title="Preferensi Notifikasi">
      {items.map((item, i) => {
        const [on, setOn] = useState(item.def)
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{item.label}</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{item.desc}</p>
            </div>
            <Toggle on={on} setOn={setOn} />
          </div>
        )
      })}
    </Section>
  )
}

function KeamananPanel() {
  return (
    <Section title="Ubah Password">
      <Field label="Password Saat Ini" type="password" placeholder="••••••••" />
      <Field label="Password Baru" type="password" placeholder="Min. 8 karakter" />
      <Field label="Konfirmasi Password Baru" type="password" placeholder="••••••••" />
      <button style={{ padding: '10px 22px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        Perbarui Password
      </button>
    </Section>
  )
}

function PembayaranPanel() {
  return (
    <Section title="Metode Pembayaran">
      {[
        { name: 'BCA Virtual Account', sub: '•••• 1234', primary: true },
        { name: 'GoPay', sub: '081234567890', primary: false },
      ].map((m, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              {m.name}
              {m.primary && <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: 20, marginLeft: 8 }}>Utama</span>}
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>{m.sub}</p>
          </div>
          <button style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', background: '#fee2e2', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit' }}>Hapus</button>
        </div>
      ))}
      <button style={{ marginTop: 14, padding: '9px 18px', background: '#eff6ff', color: '#2563eb', border: '1.5px dashed #bfdbfe', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        + Tambah Metode Pembayaran
      </button>
    </Section>
  )
}

function AlamatPanel() {
  return (
    <Section title="Alamat Tersimpan">
      {[
        { label: 'Rumah', addr: 'Jl. A. Yani No. 45, Banjarmasin Timur, Kalimantan Selatan 70232', primary: true },
        { label: 'Kantor', addr: 'Jl. Lambung Mangkurat No. 12, Banjarmasin Tengah 70111', primary: false },
      ].map((a, i) => (
        <div key={i} style={{ padding: '12px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{a.label}</span>
            {a.primary && <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: 20, marginLeft: 8 }}>Utama</span>}
          </div>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{a.addr}</p>
          <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
            <button style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit' }}>Edit</button>
            {!a.primary && <button style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', background: '#fee2e2', border: 'none', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontFamily: 'inherit' }}>Hapus</button>}
          </div>
        </div>
      ))}
      <button style={{ marginTop: 14, padding: '9px 18px', background: '#eff6ff', color: '#2563eb', border: '1.5px dashed #bfdbfe', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        + Tambah Alamat Baru
      </button>
    </Section>
  )
}

function BantuanPanel() {
  const [open, setOpen] = useState(null)
  const faqs = [
    { q: 'Bagaimana cara membuat tugas baru?', a: "Klik tombol 'Buat Tugas' di sidebar, lalu isi detail tugas." },
    { q: 'Apa yang terjadi jika kurir membatalkan?', a: 'Sistem akan mencarikan kurir pengganti secara otomatis.' },
    { q: 'Bagaimana cara mendapat refund?', a: 'Refund diproses otomatis ke metode pembayaran asal dalam 1-3 hari kerja.' },
  ]
  return (
    <Section title="Pertanyaan Umum (FAQ)">
      {faqs.map((f, i) => (
        <div key={i} style={{ borderBottom: i < faqs.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{f.q}</span>
            <span style={{ color: '#94a3b8' }}>{open === i ? '▲' : '▼'}</span>
          </button>
          {open === i && <p style={{ fontSize: 13, color: '#64748b', paddingBottom: 12, lineHeight: 1.6 }}>{f.a}</p>}
        </div>
      ))}
    </Section>
  )
}

export default function PengaturanPage() {
  const [tab, setTab] = useState('profil')
  const [role, setRole] = useState('user')
  const [saveStatus, setSaveStatus] = useState('Simpan Perubahan')
  const [saveError, setSaveError] = useState('')

  // State untuk data profil user
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')

  // Load data awal dari localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    if (storedRole) setRole(storedRole)

    const storedRole2 = localStorage.getItem('role') || 'user'
    const userKey = storedRole2 === 'mitra' ? 'mitra_data' : 'user_data'
    const storedUser = localStorage.getItem(userKey) || localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.first_name) setFirstName(parsedUser.first_name)
        if (parsedUser.last_name) setLastName(parsedUser.last_name)
        if (parsedUser.email) setEmail(parsedUser.email)
        if (parsedUser.phone) setPhone(parsedUser.phone)
        if (parsedUser.tanggal_lahir) setBirthDate(parsedUser.tanggal_lahir)
        else if (parsedUser.birthDate) setBirthDate(parsedUser.birthDate)
      } catch (e) {
        console.error('Gagal memproses data pengguna.', e)
      }
    }
  }, [])

  // Ambil koordinat (opsional) dari browser, fallback ke null jika ditolak
  const getCoords = () =>
    new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        return resolve({ latitude: null, longitude: null })
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve({ latitude: null, longitude: null }),
        { timeout: 5000 }
      )
    })

  // Aksi simpan: kirim ke API /auth/user/update lalu sinkronkan ke localStorage
  const handleSaveProfile = async () => {
    setSaveError('')
    setSaveStatus('Menyimpan...')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Sesi tidak ditemukan. Silakan masuk kembali.')
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_API_URL belum dikonfigurasi.')
      }

      const { latitude, longitude } = await getCoords()

      // Bangun payload — kirim semua field profil, hanya yang terisi
      const payload = {}
      if (firstName) payload.first_name = firstName
      if (lastName) payload.last_name = lastName
      if (email) payload.email = email
      if (phone) payload.phone = phone
      if (birthDate) payload.tanggal_lahir = birthDate
      if (latitude != null) payload.latitude = latitude
      if (longitude != null) payload.longitude = longitude

      const res = await fetch(`${baseUrl.replace(/\/$/, '')}/auth/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.message || `Gagal menyimpan (HTTP ${res.status}).`)
      }

      // Sinkronkan data terbaru ke localStorage
      const updatedUser = {
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        tanggal_lahir: birthDate,
        latitude,
        longitude,
      }
      const saveRole = localStorage.getItem('role') || 'user'
      const saveKey = saveRole === 'mitra' ? 'mitra_data' : 'user_data'
      localStorage.setItem(saveKey, JSON.stringify(updatedUser))
      window.dispatchEvent(new Event('profileUpdated'))

      setSaveStatus('Tersimpan!')
      setTimeout(() => setSaveStatus('Simpan Perubahan'), 2000)
    } catch (err) {
      console.error('[v0] Gagal update profil:', err)
      setSaveError(err instanceof Error ? err.message : 'Terjadi kesalahan.')
      setSaveStatus('Simpan Perubahan')
    }
  }

  const panels = {
    profil: <ProfilPanel 
              firstName={firstName} setFirstName={setFirstName}
              lastName={lastName} setLastName={setLastName}
              email={email} setEmail={setEmail}
              phone={phone} setPhone={setPhone}
              birthDate={birthDate} setBirthDate={setBirthDate}
              onSave={handleSaveProfile} saveStatus={saveStatus} saveError={saveError}
            />,
    notifikasi: <NotifikasiPanel />,
    keamanan:   <KeamananPanel />,
    pembayaran: <PembayaranPanel />,
    alamat:     <AlamatPanel />,
    bantuan:    <BantuanPanel />,
  }

  const fullName = `${firstName} ${lastName}`.trim()
  const initialLetter = firstName ? firstName.charAt(0).toUpperCase() : 'A'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Sidebar kiri ── */}
      <aside style={{ width: 210, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontSize: 20, fontWeight: 900, color: '#2563eb', letterSpacing: '-0.5px' }}>CallZ</div>

        {/* User - Dinamis */}
        <div style={{ margin: '0 12px 20px', background: '#f8fafc', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
            {initialLetter}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName || 'User'}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{role === 'mitra' ? 'Mitra Terverifikasi' : 'User Pelanggan'}</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0 10px', flex: 1 }}>
          {navItems.map(item => (
            <Link key={item.label} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              background: item.active ? '#eff6ff' : 'transparent',
              color: item.active ? '#2563eb' : '#64748b',
              fontWeight: item.active ? 700 : 500,
              fontSize: 12, textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.4px',
            }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0 12px 12px' }}>
          <Link href="/dashboard/tugas" style={{
            display: 'block', textAlign: 'center',
            padding: '12px', background: '#2563eb', color: '#fff',
            borderRadius: 12, fontSize: 14, fontWeight: 700,
            textDecoration: 'none',
          }}>
            Buat Tugas
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', width: 280 }}>
            <span style={{ color: '#94a3b8', fontSize: 14 }}>🔍</span>
            <input placeholder="Cari tugas, mitra, atau riwayat..." style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: '#374151', width: '100%', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {['Layanan', 'Tentang', 'Bantuan'].map((l, i) => (
              <a key={l} href="#" style={{ fontSize: 13, color: i === 0 ? '#2563eb' : '#64748b', fontWeight: i === 0 ? 700 : 500, textDecoration: 'none', padding: '6px 10px' }}>{l}</a>
            ))}
            <button style={{ padding: '8px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginLeft: 4, fontFamily: 'inherit' }}>
              Mulai Sekarang
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Settings tabs */}
          <div style={{ width: 180, background: '#fff', borderRight: '1px solid #e2e8f0', padding: '16px 10px', flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', padding: '0 10px', marginBottom: 8, textTransform: 'uppercase' }}>PENGATURAN</p>
            {settingsTabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                background: tab === t.id ? '#eff6ff' : 'transparent',
                color: tab === t.id ? '#2563eb' : '#64748b',
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: 13, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', textAlign: 'left',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Pengaturan</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Kelola akun dan preferensi kamu</p>
            <div style={{ maxWidth: 600 }}>
              {panels[tab]}
            </div>
          </div>

        </div>
      </div> 
    </div>
  )
}
