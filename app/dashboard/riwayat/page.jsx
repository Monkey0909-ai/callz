'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/dashboard' },
  { label: 'Riwayat',     icon: '🕐', href: '/dashboard/riwayat', active: true },
  { label: 'Pengaturan',  icon: '⚙', href: '/dashboard/pengaturan' },
]

function fmt(n) { return n === 0 ? '—' : 'Rp ' + n.toLocaleString('id-ID') }

function Stars({ rating }) {
  if (!rating) return <span style={{ fontSize: 12, color: '#94a3b8' }}>Belum dinilai</span>
  return <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

function RatingModal({ task, onClose, onSubmit }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(task.rating || 0)
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>⭐</div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Beri Rating Mitra</h3>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px' }}>
          <strong>{task.kurir}</strong>
        </p>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 20px' }}>Tugas: {task.judul}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1,2,3,4,5].map(star => (
            <span
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              style={{ fontSize: 36, cursor: 'pointer', color: star <= (hovered || selected) ? '#f59e0b' : '#e2e8f0', transition: 'color 0.1s' }}
            >★</span>
          ))}
        </div>
        {selected > 0 && (
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
            {['','Sangat Buruk','Kurang Memuaskan','Cukup','Bagus','Luar Biasa!'][selected]}
          </p>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Batal
          </button>
          <button
            disabled={selected === 0}
            onClick={() => onSubmit(task.id, selected)}
            style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: selected ? '#2563eb' : '#e2e8f0', color: selected ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, cursor: selected ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
          >
            Kirim Rating
          </button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styleMap = {
    'Selesai':    { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
    'Diterima':   { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    'Menunggu':   { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
    'Dibatalkan': { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
  }
  const s = styleMap[status] || styleMap['Dibatalkan']
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {status}
    </span>
  )
}

export default function RiwayatPage() {
  const [filter,  setFilter]  = useState('Semua')
  const [periode, setPeriode] = useState('Semua')
  const [search,  setSearch]  = useState('')
  const [confirmCancel, setConfirmCancel] = useState(null) // id tugas yang mau dibatalkan
  const [ratingModal, setRatingModal] = useState(null) // task yang mau dirating

  // ── 1. UBAH DATA MENJADI STATE DINAMIS (Default Kosong []) ──
  const [tasksData, setTasksData] = useState([])
  
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Santoso')

  // ── Helper: baca ulang tasks dari localStorage ──
  const reloadTasks = () => {
    const storedTasks = localStorage.getItem('callz_tasks')
    if (storedTasks) {
      try { setTasksData(JSON.parse(storedTasks)) }
      catch (e) { console.error('Gagal memproses data tugas', e) }
    }
  }

  useEffect(() => {
    // ── 2. AMBIL DATA TUGAS DARI LOCALSTORAGE SAAT HALAMAN DI-LOAD ──
    reloadTasks()

    // Ambil data user profil
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.first_name) setFirstName(parsedUser.first_name)
        if (parsedUser.last_name) setLastName(parsedUser.last_name)
      } catch (e) {
        console.error('Gagal mengambil data user', e)
      }
    }

    // ── Auto-refresh saat mitra ambil job (dispatch storage event) ──
    window.addEventListener('storage', reloadTasks)
    return () => window.removeEventListener('storage', reloadTasks)
  }, [])

  const fullName = `${firstName} ${lastName}`.trim()
  const initialLetter = firstName ? firstName.charAt(0).toUpperCase() : 'A'

  // ── 3. PROSES FILTER BERDASARKAN STATE TASKS_DATA DINAMIS ──
  const filtered = tasksData.filter(r => {
    const okFilter = filter === 'Semua' || r.status === filter
    const okSearch = !search ||
      (r.judul || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.kurir || '').toLowerCase().includes(search.toLowerCase())
    return okFilter && okSearch
  })

  // Perhitungan statistik dinamis dengan proteksi pembagian dengan angka 0
  const totalSelesai  = tasksData.filter(r => r.status === 'Selesai').length
  const totalDiterima = tasksData.filter(r => r.status === 'Diterima').length
  const totalBiaya    = tasksData.filter(r => r.status === 'Selesai' || r.status === 'Diterima').reduce((a, b) => a + b.biaya, 0)
  const ratingList    = tasksData.filter(r => r.rating > 0)
  const avgRating     = ratingList.length > 0 
    ? (ratingList.reduce((a, b) => a + b.rating, 0) / ratingList.length).toFixed(1) 
    : '0.0'

  const successRate = tasksData.length > 0 
    ? `${Math.round((totalSelesai + totalDiterima) / tasksData.length * 100)}% success rate` 
    : '0% success rate'

  const handleCancel = (id) => {
    const updated = tasksData.map(t =>
      t.id === id ? { ...t, status: 'Dibatalkan' } : t
    )
    setTasksData(updated)
    localStorage.setItem('callz_tasks', JSON.stringify(updated))
    setConfirmCancel(null)
    // Dispatch storage event agar halaman lain (semua tugas) ikut update
    window.dispatchEvent(new Event('storage'))
  }

  const handleRate = (id, rating) => {
    const updated = tasksData.map(t =>
      t.id === id ? { ...t, rating } : t
    )
    setTasksData(updated)
    localStorage.setItem('callz_tasks', JSON.stringify(updated))
    setRatingModal(null)
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Rating Modal ── */}
      {ratingModal && (
        <RatingModal
          task={ratingModal}
          onClose={() => setRatingModal(null)}
          onSubmit={handleRate}
        />
      )}

      {/* ── Confirm Cancel Modal ── */}
      {confirmCancel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Batalkan Tugas?</h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>
              Tindakan ini tidak dapat diurungkan. Tugas akan dipindahkan ke status <strong>Dibatalkan</strong>.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmCancel(null)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Kembali
              </button>
              <button
                onClick={() => handleCancel(confirmCancel)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Ya, Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside style={{ width: 210, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontSize: 20, fontWeight: 900, color: '#2563eb', letterSpacing: '-0.5px' }}>CallZ</div>

        {/* User Box */}
        <div style={{ margin: '0 12px 20px', background: '#f8fafc', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
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

        <div style={{ padding: '0 12px 12px' }}>
          <Link href="/dashboard/tugas" style={{
            display: 'block', textAlign: 'center',
            padding: '12px', background: '#2563eb', color: '#fff',
            borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>
            Buat Tugas
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 28px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f1f5f9', borderRadius: 10, padding: '8px 14px', width: 280 }}>
            <span style={{ color: '#94a3b8' }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari riwayat tugas..."
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

        {/* Area isi riwayat */}
        <div style={{ padding: '28px 32px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Riwayat Tugas</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Semua tugas yang pernah kamu buat</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Tugas',       value: tasksData.length,     sub: 'Sejak bergabung',    color: '#0f172a' },
              { label: 'Berhasil',          value: totalSelesai + totalDiterima, sub: successRate,   color: '#16a34a' },
              { label: 'Total Pengeluaran', value: fmt(totalBiaya),       sub: 'Semua waktu',        color: '#2563eb' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontSize: i === 2 ? 18 : 28, fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Semua', 'Menunggu', 'Diterima', 'Selesai', 'Dibatalkan'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  border: filter === f ? 'none' : '1px solid #e2e8f0',
                  background: filter === f ? '#2563eb' : '#fff',
                  color: filter === f ? '#fff' : '#64748b',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {f}
                  <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 20, background: filter === f ? '#1d4ed8' : '#f1f5f9', color: filter === f ? '#fff' : '#64748b' }}>
                    {f === 'Semua' ? tasksData.length : tasksData.filter(r => r.status === f).length}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Semua', 'Hari ini', 'Minggu ini', 'Bulan ini'].map(p => (
                <button key={p} onClick={() => setPeriode(p)} style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  background: periode === p ? '#0f172a' : '#fff',
                  color: periode === p ? '#fff' : '#64748b',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {['Tugas', 'Kurir', 'Tanggal', 'Durasi', 'Status', 'Biaya', ''].map((h, i) => (
                    <th key={h + i} style={{ padding: '14px 16px', textAlign: i === 5 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: 14 }}>📭 Tidak ada riwayat ditemukan</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{r.icon}</div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{r.judul}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>#{r.id} · {r.kategori}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {r.status === 'Menunggu' ? (
                        // Belum ada mitra yang ambil — tampilkan badge menunggu
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#fefce8', color: '#92400e', border: '1px dashed #fcd34d' }}>
                          <span style={{ fontSize: 13 }}>⏳</span> Menunggu mitra...
                        </span>
                      ) : (
                        // Mitra sudah ambil — tampilkan nama akun mitra
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1d4ed8' }}>
                            {r.inisial || (r.kurir ? r.kurir.charAt(0).toUpperCase() : '?')}
                          </div>
                          <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{r.kurir}</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{r.tanggal}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{r.durasi}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: r.biaya === 0 ? '#cbd5e1' : '#0f172a' }}>{fmt(r.biaya)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {r.status === 'Menunggu' && (
                        <button
                          onClick={() => setConfirmCancel(r.id)}
                          style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5', color: '#dc2626', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.target.style.background = '#fee2e2' }}
                          onMouseLeave={e => { e.target.style.background = '#fff5f5' }}
                        >
                          Batalkan
                        </button>
                      )}
                      {r.status === 'Diterima' && (
                        <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Dalam proses</span>
                      )}
                      {r.status === 'Selesai' && (
                        r.rating ? (
                          <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        ) : (
                          <button
                            onClick={() => setRatingModal(r)}
                            style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #fde68a', background: '#fffbeb', color: '#d97706', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                            onMouseEnter={e => { e.target.style.background = '#fef3c7' }}
                            onMouseLeave={e => { e.target.style.background = '#fffbeb' }}
                          >
                            ⭐ Beri Rating
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Menampilkan {filtered.length} dari {tasksData.length} riwayat</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['← Sebelumnya', 'Berikutnya →'].map(b => (
                  <button key={b} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>{b}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}