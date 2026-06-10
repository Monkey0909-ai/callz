'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { NgrokImage } from '@/components/NgrokImage'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/dashboard' },
  { label: 'Riwayat',     icon: '🕐', href: '/dashboard/riwayat', active: true },
  { label: 'Pengaturan',  icon: '⚙', href: '/dashboard/pengaturan' },
]

const STORAGE_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') + '/storage'
  : ''

function mapStatus(apiStatus) {
  const map = {
    'PENDING':          'Menunggu',
    'ACCEPTED':         'Diterima',
    'COMPLETED':        'Selesai',
    'CANCELLED':        'Dibatalkan',
    'PROOF_SUBMITTED':  'Bukti Dikirim',
  }
  return map[apiStatus] ?? 'Menunggu'
}

function fmt(n) { return n === 0 ? '—' : 'Rp ' + n.toLocaleString('id-ID') }

function Stars({ rating }) {
  if (!rating) return <span style={{ fontSize: 12, color: '#94a3b8' }}>Belum dinilai</span>
  return <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

/* ── Proof Photo Modal ── */
function ProofModal({ task, onClose, onConfirm, onReject }) {
  const [zoomed, setZoomed] = useState(false)

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 24px 64px rgba(0,0,0,0.22)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Bukti Penyelesaian</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
              {task.judul} · oleh <strong style={{ color: '#374151' }}>{task.kurir || 'Mitra'}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', lineHeight: 1 }}
          >×</button>
        </div>

        {/* Photo Area — pakai NgrokImage */}
        <div
          style={{ background: '#f1f5f9', position: 'relative', minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: task.proof_url ? 'zoom-in' : 'default' }}
          onClick={() => { if (task.proof_url) setZoomed(true) }}
        >
          {task.proof_url ? (
            <>
              <NgrokImage
                src={task.proof_url}
                alt="Bukti penyelesaian"
                style={{ width: '100%', maxHeight: 360, objectFit: 'contain', display: 'block' }}
                fallbackText="Gagal memuat foto bukti"
              />
              <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.45)', color: '#fff', fontSize: 11, borderRadius: 6, padding: '3px 8px', fontWeight: 600, pointerEvents: 'none' }}>
                🔍 Klik untuk perbesar
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>📷</div>
              <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Foto bukti belum tersedia</p>
              <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>Mitra belum mengunggah foto bukti</p>
            </div>
          )}
        </div>

        {/* Catatan mitra */}
        {task.proof_note && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', background: '#fffbeb' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Catatan Mitra</p>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{task.proof_note}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
          <button
            onClick={() => onReject(task.id)}
            style={{ flex: 1, padding: '11px', borderRadius: 10, border: '1.5px solid #fecaca', background: '#fff5f5', color: '#dc2626', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff5f5'}
          >
            ✗ Tolak Bukti
          </button>
          <button
            onClick={() => onConfirm(task.id)}
            style={{ flex: 1.4, padding: '11px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
          >
            ✓ Konfirmasi Selesai
          </button>
        </div>
      </div>

      {/* Zoom overlay — juga pakai NgrokImage */}
      {zoomed && task.proof_url && (
        <div
          onClick={() => setZoomed(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 24 }}
        >
          <NgrokImage
            src={task.proof_url}
            alt="Bukti penyelesaian (full)"
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}
          />
          <button
            onClick={() => setZoomed(false)}
            style={{ position: 'fixed', top: 20, right: 20, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}
          >×</button>
        </div>
      )}
    </div>
  )
}

/* ── Rating Modal ── */
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL

function StatusBadge({ status }) {
  const styleMap = {
    'Selesai':         { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
    'Diterima':        { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
    'Menunggu':        { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
    'Dibatalkan':      { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
    'Bukti Dikirim':   { bg: '#f0f9ff', color: '#0369a1', dot: '#0ea5e9' },
    'PROOF_SUBMITTED': { bg: '#f0f9ff', color: '#0369a1', dot: '#0ea5e9' },
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
  const [filter,        setFilter]        = useState('Semua')
  const [periode,       setPeriode]       = useState('Semua')
  const [search,        setSearch]        = useState('')
  const [confirmCancel, setConfirmCancel] = useState(null)
  const [ratingModal,   setRatingModal]   = useState(null)
  const [proofModal,    setProofModal]    = useState(null)
  const [tasksData,     setTasksData]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [firstName,     setFirstName]     = useState('Alex')
  const [lastName,      setLastName]      = useState('Santoso')

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('token')

        if (!token) {
          setError('Sesi tidak ditemukan. Silakan login kembali.')
          setLoading(false)
          return
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${baseUrl}/tasks/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '6024', // Header khusus untuk bypass splash page ngrok, jika diperlukan
          },
        })

        if (!res.ok) {
          setError(`Gagal memuat data (HTTP ${res.status}). Coba muat ulang halaman.`)
          setLoading(false)
          return
        }

        const json = await res.json()
        const raw = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : [])

        const mapped = raw.map((t) => ({
          id:          String(t.id),
          judul:       t.title || '—',
          kategori:    t.category_name || '—',
          status:      mapStatus(t.status),
          kurir:       t.mitra?.name || null,
          inisial:     t.mitra?.name?.charAt(0).toUpperCase() || null,
          tanggal:     t.created_at
                        ? new Date(t.created_at).toLocaleDateString('id-ID', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })
                        : '—',
          durasi:      '—',
          biaya:       t.total_estimated_fee || 0,
          rating:      t.user_rating || 0,
          mitraRating: t.mitra_rating || 0,
          icon:        '📦',

          // Bangun URL proof — prioritaskan yang sudah full URL, fallback ke STORAGE_BASE
          proof_url: (() => {
              const raw = t.proof_of_work || t.proof_of_work_url || t.proof_url || t.proof_photo_url || null
              if (!raw) return null
              if (raw.startsWith('http')) {
                  // Ekstrak path setelah /storage/ lalu route lewat API
                  const match = raw.match(/\/storage\/(.+)/)
                  return match ? `${API_BASE}/file/${match[1]}` : raw
              }
              return `${API_BASE}/file/${raw.replace(/^\//, '')}`
          })(),

          proof_note: t.proof_note || t.mitra_note || t.completion_note || null,
        }))

        setTasksData(mapped)
      } catch (e) {
        console.error('Gagal fetch riwayat:', e)
        setError('Terjadi kesalahan jaringan. Pastikan koneksi internet kamu aktif.')
      } finally {
        setLoading(false)
      }
    }

    fetchRiwayat()

    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const p = JSON.parse(storedUser)
        if (p.first_name) setFirstName(p.first_name)
        if (p.last_name)  setLastName(p.last_name)
      } catch (e) {}
    }
  }, [])

  const fullName      = `${firstName} ${lastName}`.trim()
  const initialLetter = firstName ? firstName.charAt(0).toUpperCase() : 'A'

  const filtered = tasksData.filter(r => {
    const okFilter = filter === 'Semua' || r.status === filter
    const okSearch = !search ||
      (r.judul   || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.id      || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.kurir   || '').toLowerCase().includes(search.toLowerCase())
    return okFilter && okSearch
  })

  const totalSelesai  = tasksData.filter(r => r.status === 'Selesai').length
  const totalDiterima = tasksData.filter(r => r.status === 'Diterima').length
  const totalBiaya    = tasksData
    .filter(r => r.status === 'Selesai' || r.status === 'Diterima')
    .reduce((a, b) => a + b.biaya, 0)
  const ratingList    = tasksData.filter(r => r.rating > 0)
  const avgRating     = ratingList.length > 0
    ? (ratingList.reduce((a, b) => a + b.rating, 0) / ratingList.length).toFixed(1)
    : '0.0'
  const successRate   = tasksData.length > 0
    ? `${Math.round((totalSelesai + totalDiterima) / tasksData.length * 100)}% success rate`
    : '0% success rate'

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!res.ok) { alert('Gagal membatalkan tugas. Coba lagi.'); return }
    } catch { alert('Kesalahan jaringan.'); return }

    setTasksData(prev => prev.map(t => t.id === id ? { ...t, status: 'Dibatalkan' } : t))
    setConfirmCancel(null)
  }

  const handleRate = async (id, rating) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_BASE}/tasks/${id}/rate-mitra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ rating }),
      })
    } catch {}
    setTasksData(prev => prev.map(t => t.id === id ? { ...t, rating } : t))
    setRatingModal(null)
  }

  const handleConfirm = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/tasks/${id}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!res.ok) { alert('Gagal mengkonfirmasi. Coba lagi.'); return }
    } catch { alert('Kesalahan jaringan.'); return }

    setTasksData(prev => prev.map(t => t.id === id ? { ...t, status: 'Selesai' } : t))
    setProofModal(null)
  }

  const handleRejectProof = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/tasks/${id}/reject-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!res.ok) { alert('Gagal menolak bukti. Coba lagi.'); return }
    } catch { alert('Kesalahan jaringan.'); return }

    setTasksData(prev => prev.map(t => t.id === id ? { ...t, status: 'Diterima' } : t))
    setProofModal(null)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {proofModal && (
        <ProofModal
          task={proofModal}
          onClose={() => setProofModal(null)}
          onConfirm={handleConfirm}
          onReject={handleRejectProof}
        />
      )}

      {ratingModal && (
        <RatingModal
          task={ratingModal}
          onClose={() => setRatingModal(null)}
          onSubmit={handleRate}
        />
      )}

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

      {/* Sidebar */}
      <aside style={{ width: 210, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontSize: 20, fontWeight: 900, color: '#2563eb', letterSpacing: '-0.5px' }}>CallZ</div>

        <div style={{ margin: '0 12px 20px', background: '#f8fafc', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
            {initialLetter}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName || 'User'}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>User Pelanggan</p>
          </div>
        </div>

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

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

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

        <div style={{ padding: '28px 32px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Riwayat Tugas</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Semua tugas yang pernah kamu buat</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Tugas',       value: tasksData.length,             sub: 'Sejak bergabung', color: '#0f172a' },
              { label: 'Berhasil',          value: totalSelesai + totalDiterima,  sub: successRate,      color: '#16a34a' },
              { label: 'Total Pengeluaran', value: fmt(totalBiaya),               sub: 'Semua waktu',    color: '#2563eb' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontSize: i === 2 ? 18 : 28, fontWeight: 900, color: s.color }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Semua', 'Menunggu', 'Diterima', 'Bukti Dikirim', 'Selesai', 'Dibatalkan'].map(f => (
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

          {loading ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '64px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
              <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>Memuat riwayat tugas...</p>
            </div>
          ) : error ? (
            <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 16, padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <p style={{ fontSize: 14, color: '#dc2626', fontWeight: 600, marginBottom: 8 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Muat Ulang
              </button>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Tugas', 'Mitra', 'Tanggal', 'Durasi', 'Status', 'Biaya', 'Rating Kamu', 'Rating dari Mitra', 'Aksi'].map((h, i) => (
                      <th key={h + i} style={{ padding: '14px 16px', textAlign: i === 5 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: 14 }}>📭 Tidak ada riwayat ditemukan</td></tr>
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
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: '#fefce8', color: '#92400e', border: '1px dashed #fcd34d' }}>
                            <span style={{ fontSize: 13 }}>⏳</span> Menunggu mitra...
                          </span>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1d4ed8' }}>
                              {r.inisial || (r.kurir ? r.kurir.charAt(0).toUpperCase() : '?')}
                            </div>
                            <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{r.kurir || '—'}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{r.tanggal}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{r.durasi}</td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={r.status} /></td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: r.biaya === 0 ? '#cbd5e1' : '#0f172a' }}>{fmt(r.biaya)}</td>

                      <td style={{ padding: '14px 16px' }}>
                        {r.status === 'Selesai' ? (
                          r.rating
                            ? <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                            : <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>Belum dinilai</span>
                        ) : (
                          <span style={{ fontSize: 12, color: '#d1d5db' }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        {r.mitraRating ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ color: '#10b981', fontSize: 14 }}>{'★'.repeat(r.mitraRating)}{'☆'.repeat(5 - r.mitraRating)}</span>
                            <span style={{ fontSize: 10, color: '#94a3b8' }}>{['','Sangat Buruk','Kurang Memuaskan','Cukup','Bagus','Luar Biasa!'][r.mitraRating]}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                            {r.status === 'Selesai' ? 'Belum dinilai' : '—'}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {r.status === 'Menunggu' && (
                            <button
                              onClick={() => setConfirmCancel(r.id)}
                              style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff5f5', color: '#dc2626', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5' }}
                            >
                              Batalkan
                            </button>
                          )}
                          {r.status === 'Diterima' && (
                            <span style={{ fontSize: 11, color: '#2563eb', fontWeight: 600 }}>Dalam proses</span>
                          )}
                          {(r.status === 'Bukti Dikirim' || r.status === 'PROOF_SUBMITTED') && (
                            <button
                              onClick={() => setProofModal(r)}
                              style={{ padding: '5px 12px', borderRadius: 8, border: '1.5px solid #bae6fd', background: '#f0f9ff', color: '#0369a1', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#e0f2fe' }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#f0f9ff' }}
                            >
                              📷 Lihat Bukti
                            </button>
                          )}
                          {r.status === 'Selesai' && !r.rating && (
                            <button
                              onClick={() => setRatingModal(r)}
                              style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #fde68a', background: '#fffbeb', color: '#d97706', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#fef3c7' }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fffbeb' }}
                            >
                              ⭐ Beri Rating
                            </button>
                          )}
                          {r.status === 'Selesai' && r.rating && (
                            <span style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>✓ Selesai</span>
                          )}
                        </div>
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
          )}
        </div>
      </main>
    </div>
  )
}