'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = 'https://generous-awake-serval.ngrok-free.app/api'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/dashboard',            active: true },
  { label: 'Riwayat',     icon: '🕐', href: '/dashboard/riwayat'                },
  { label: 'Pengaturan',  icon: '⚙', href: '/dashboard/pengaturan'             },
]

const TUGAS_CEPAT = [
  { icon: '🧺', label: 'Belanja Bahan Makanan', sub: 'Sudah tersedia' },
  { icon: '📦', label: 'Ambil Paket',           sub: '3 Mitras di sekitar sini' },
  { icon: '⏳', label: 'Antre',                 sub: 'Permintaan mendesak' },
]

export default function UserDashboard() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Santoso')
  const [locationStatus, setLocationStatus] = useState(null)
  const locationSentRef = useRef(false)

  const [activeTask, setActiveTask] = useState(null)
  const [simulatedProgress, setSimulatedProgress] = useState(15)
  const [simulatedStatus, setSimulatedStatus] = useState('Mencari kurir terdekat untuk menjemput paket...')
  const [activeMitras, setActiveMitras] = useState([])

  const updateUserLocation = async (latitude, longitude) => {
    try {
      const raw = localStorage.getItem('user')
      let token = null
      if (raw) {
        try { const p = JSON.parse(raw); token = p.token || p.access_token || null } catch (e) {}
      }
      if (!token) token = localStorage.getItem('user_token') || localStorage.getItem('token')

      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch(`${API_BASE}/auth/user/update-location`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ latitude, longitude }),
      })
      setLocationStatus(res.ok ? 'success' : 'error')
    } catch (e) {
      setLocationStatus('error')
    }
  }

  const requestAndSendLocation = () => {
    if (!navigator.geolocation || locationSentRef.current) return
    setLocationStatus('updating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        locationSentRef.current = true
        updateUserLocation(coords.latitude, coords.longitude)
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const p = JSON.parse(storedUser)
        if (p.first_name) setFirstName(p.first_name)
        if (p.last_name)  setLastName(p.last_name)
      } catch (e) {}
    }
  }

  const checkActiveMitras = () => {
    try {
      const statusData = JSON.parse(localStorage.getItem('callz_mitra_status') || '{}')
      setActiveMitras(Object.values(statusData).filter(m => m.status === 'aktif'))
    } catch (e) { setActiveMitras([]) }
  }

  const checkActiveTask = () => {
    const existingTasks = JSON.parse(localStorage.getItem('callz_tasks')) || []
    const running = existingTasks.find(t => t.kurir === 'Mencari Kurir...')
    setActiveTask(running || null)
  }

  useEffect(() => {
    loadUserData()
    checkActiveTask()
    checkActiveMitras()
    requestAndSendLocation()

    window.addEventListener('profileUpdated', loadUserData)
    window.addEventListener('storage', () => { checkActiveTask(); checkActiveMitras() })
    return () => {
      window.removeEventListener('profileUpdated', loadUserData)
      window.removeEventListener('storage', checkActiveMitras)
    }
  }, [])

  useEffect(() => {
    if (!activeTask) return
    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          const existing = JSON.parse(localStorage.getItem('callz_tasks')) || []
          const updated = existing.map(t =>
            t.id === activeTask.id ? { ...t, kurir: 'David K.', status: 'Selesai' } : t
          )
          localStorage.setItem('callz_tasks', JSON.stringify(updated))
          return 100
        }
        if (prev > 75) setSimulatedStatus('Kurir hampir sampai ke lokasi tujuan pengantaran.')
        else if (prev > 45) setSimulatedStatus('Paket berhasil diambil. Kurir sedang menuju lokasi tujuan.')
        else if (prev > 25) setSimulatedStatus('Kurir sudah tiba di lokasi penjemputan utama.')
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [activeTask])

  const fullName      = `${firstName} ${lastName}`.trim()
  const initialLetter = firstName ? firstName.charAt(0).toUpperCase() : 'A'

  const handleLogout = () => {
    ['token','role','user','mitra_user','mitra_token','user_token','callz_tasks','callz_mitra_status']
      .forEach(k => localStorage.removeItem(k))
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 210, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontSize: 20, fontWeight: 900, color: '#2563eb', letterSpacing: '-0.5px' }}>CallZ</div>

        {/* User Box */}
        <div style={{ margin: '0 12px 20px', background: '#f8fafc', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
            {initialLetter}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName || 'User'}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>User Pelanggan</p>
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

        <div style={{ padding: '0 12px 8px' }}>
          <Link href="/dashboard/tugas" style={{
            display: 'block', textAlign: 'center',
            padding: '12px', background: '#2563eb', color: '#fff',
            borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            Buat Tugas
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: '8px 12px 0' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🚪</span> Keluar
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', width: 300 }}>
            <span style={{ color: '#94a3b8' }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tugas, mitra, atau riwayat..."
              style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: '#374151', width: '100%', fontFamily: 'inherit' }}
            />
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
        <div style={{ padding: '28px 32px', flex: 1, overflowY: 'auto' }}>

          {/* Hero */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.25 }}>
              Selamat datang kembali, {firstName}.<br />
              Siap untuk <span style={{ color: '#2563eb' }}>mengembalikan waktu Anda?</span>
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Jaringan concierge pribadi Anda sudah aktif dan siap untuk misi Anda berikutnya.
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

            {/* Left Column */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Tugas Cepat */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>Tugas Cepat</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {TUGAS_CEPAT.map((t, i) => (
                    <Link key={i} href="/dashboard/tugas" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.10)'; e.currentTarget.style.borderColor = '#bfdbfe' }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0' }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 10, color: '#2563eb' }}>{t.icon}</div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3 }}>{t.label}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tugas Aktif */}
              {activeTask ? (
                <div style={{ background: '#fff', border: '1px solid #dbeafe', borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Tugas Aktif Terkini</p>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: simulatedProgress === 100 ? '#f0fdf4' : '#fffbeb',
                      color:      simulatedProgress === 100 ? '#16a34a' : '#d97706',
                    }}>
                      {simulatedProgress === 100 ? 'SELESAI' : 'DALAM PROGRESS'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      {activeTask.icon || '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeTask.judul}</p>
                      <p style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 8px' }}>ID: {activeTask.id}</p>
                      <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px' }}>Kategori: <strong style={{ color: '#374151' }}>{activeTask.kategori}</strong></p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                          <div style={{ background: '#2563eb', height: '100%', borderRadius: 999, width: `${simulatedProgress}%`, transition: 'width 1s ease' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>{simulatedProgress}%</span>
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', minWidth: 200, maxWidth: 220, flexShrink: 0 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.5px' }}>Status Live</p>
                      <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: '0 0 8px' }}>{simulatedStatus}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>📍 Kurir: {simulatedProgress > 25 ? 'David K.' : 'Menuju Lokasi'}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <Link href="/dashboard/riwayat" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 9, border: '1px solid #e2e8f0',
                      background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, textDecoration: 'none',
                    }}>
                      📋 Detail Histori & Biaya
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: 16, padding: '40px', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🤝</div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#64748b', margin: '0 0 4px' }}>Tidak Ada Misi Berjalan</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Semua kiriman atau tugas Anda telah selesai dikerjakan oleh Mitra CallZ.</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div style={{ width: 256, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Map */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', margin: 0 }}>Mitra di Sekitar</p>
                  {activeMitras.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: '#f0fdf4', color: '#16a34a', padding: '2px 8px', borderRadius: 20 }}>
                      {activeMitras.length} AKTIF
                    </span>
                  )}
                </div>
                <div style={{ width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative', background: '#f1f5f9' }}>
                  {activeMitras.length > 0 ? (
                    <>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31869.456012356555!2d114.590111!3d-3.316694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                        width="100%" height="100%"
                        style={{ border: 0, position: 'absolute', inset: 0 }}
                        allowFullScreen="" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      {activeMitras.map((m, i) => {
                        const pins = [
                          { top: '32%', left: '40%', color: '#f97316' },
                          { top: '55%', left: '65%', color: '#2563eb' },
                          { top: '20%', left: '58%', color: '#9333ea' },
                        ]
                        const pos = pins[i % pins.length]
                        return (
                          <div key={i} style={{ position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                            <div style={{ width: 28, height: 28, background: '#fff', borderRadius: '50%', border: `2.5px solid ${pos.color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#374151' }}>
                              {m.nama ? m.nama.charAt(0).toUpperCase() : '?'}
                            </div>
                          </div>
                        )
                      })}
                    </>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span style={{ fontSize: 28 }}>🗺️</span>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: 0 }}>Belum ada mitra aktif</p>
                      <p style={{ fontSize: 10, color: '#cbd5e1', textAlign: 'center', margin: 0, padding: '0 16px' }}>Mitra akan muncul di sini saat mereka mengaktifkan status siap</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tersedia Sekarang */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 10px' }}>Tersedia Sekarang</p>
                {activeMitras.length === 0 ? (
                  <div style={{ background: '#f8fafc', border: '1.5px dashed #e2e8f0', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', margin: '0 0 2px' }}>Belum ada mitra siap</p>
                    <p style={{ fontSize: 10, color: '#cbd5e1', margin: 0 }}>Menunggu mitra mengaktifkan status</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {activeMitras.map((m, i) => (
                      <div key={i} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>
                          {m.nama ? m.nama.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{m.nama}</p>
                          <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 600, margin: 0 }}>● Aktif & Siap</p>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, background: '#16a34a', color: '#fff', padding: '3px 8px', borderRadius: 6 }}>SIAP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}