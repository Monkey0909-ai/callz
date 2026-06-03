'use client'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard',  icon: '⊞', href: '/dashboard' },
  { label: 'Riwayat',    icon: '🕐', href: '/dashboard/riwayat', active: true },
  { label: 'Pengaturan', icon: '⚙', href: '/dashboard/pengaturan' },
]

const DATA = [
  { id:'CZ-089', icon:'🛒', judul:'Belanja bahan makanan',     kategori:'Belanja',  kurir:'David K.',  inisial:'DK', tanggal:'Hari ini, 10:32',  durasi:'45 menit', status:'Selesai',    rating:5, biaya:85000 },
  { id:'CZ-088', icon:'📄', judul:'Antar dokumen ke notaris',  kategori:'Dokumen',  kurir:'Sarah L.',  inisial:'SL', tanggal:'Kemarin, 14:15',   durasi:'30 menit', status:'Selesai',    rating:5, biaya:45000 },
  { id:'CZ-087', icon:'📦', judul:'Ambil paket di JNE',        kategori:'Paket',    kurir:'Marcus J.', inisial:'MJ', tanggal:'Kemarin, 09:00',   durasi:'25 menit', status:'Selesai',    rating:4, biaya:35000 },
  { id:'CZ-086', icon:'⏳', judul:'Antre di Bank BRI',         kategori:'Antre',    kurir:'Rizky M.',  inisial:'RM', tanggal:'1 Jun, 11:20',     durasi:'—',        status:'Dibatalkan', rating:0, biaya:0     },
  { id:'CZ-085', icon:'💊', judul:'Beli obat di apotek K24',   kategori:'Belanja',  kurir:'Sandi W.',  inisial:'SW', tanggal:'31 Mei, 16:45',    durasi:'35 menit', status:'Selesai',    rating:5, biaya:55000 },
  { id:'CZ-084', icon:'🎂', judul:'Antar kue ulang tahun',     kategori:'Paket',    kurir:'David K.',  inisial:'DK', tanggal:'30 Mei, 18:00',    durasi:'40 menit', status:'Selesai',    rating:5, biaya:65000 },
  { id:'CZ-083', icon:'👕', judul:'Ambil laundry',             kategori:'Paket',    kurir:'Andi P.',   inisial:'AP', tanggal:'29 Mei, 08:30',    durasi:'20 menit', status:'Selesai',    rating:4, biaya:25000 },
  { id:'CZ-082', icon:'✏️', judul:'Beli alat tulis kantor',    kategori:'Belanja',  kurir:'Sarah L.',  inisial:'SL', tanggal:'28 Mei, 13:00',    durasi:'—',        status:'Dibatalkan', rating:0, biaya:0     },
]

function fmt(n) { return n === 0 ? '—' : 'Rp ' + n.toLocaleString('id-ID') }

function Stars({ rating }) {
  if (!rating) return <span style={{ fontSize: 12, color: '#94a3b8' }}>Belum dinilai</span>
  return <span style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

function StatusBadge({ status }) {
  const ok = status === 'Selesai'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: ok ? '#f0fdf4' : '#fef2f2', color: ok ? '#16a34a' : '#dc2626' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ok ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
      {status}
    </span>
  )
}

export default function RiwayatPage() {
  const [filter,  setFilter]  = useState('Semua')
  const [periode, setPeriode] = useState('Semua')
  const [search,  setSearch]  = useState('')

  const filtered = DATA.filter(r => {
    const okFilter = filter === 'Semua' || r.status === filter
    const okSearch = !search ||
      r.judul.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.kurir.toLowerCase().includes(search.toLowerCase())
    return okFilter && okSearch
  })

  const totalSelesai = DATA.filter(r => r.status === 'Selesai').length
  const totalBiaya   = DATA.filter(r => r.status === 'Selesai').reduce((a, b) => a + b.biaya, 0)
  const ratingList   = DATA.filter(r => r.rating > 0)
  const avgRating    = (ratingList.reduce((a, b) => a + b.rating, 0) / ratingList.length).toFixed(1)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 210, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontSize: 20, fontWeight: 900, color: '#0f172a' }}>CallZ</div>

        {/* User */}
        <div style={{ margin: '0 12px 20px', background: '#f8fafc', borderRadius: 12, padding: '12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧑</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>User</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>Alex</p>
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

        <div style={{ padding: '28px 32px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Riwayat Tugas</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>Semua tugas yang pernah kamu buat</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Tugas',       value: DATA.length,          sub: 'Sejak bergabung',    color: '#0f172a' },
              { label: 'Berhasil',          value: totalSelesai,          sub: `${Math.round(totalSelesai/DATA.length*100)}% success rate`, color: '#16a34a' },
              { label: 'Total Pengeluaran', value: fmt(totalBiaya),       sub: 'Semua waktu',        color: '#2563eb' },
              { label: 'Rating Rata-rata',  value: avgRating + ' ★',     sub: 'Dari semua kurir',   color: '#f59e0b' },
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
              {['Semua', 'Selesai', 'Dibatalkan'].map(f => (
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
                    {f === 'Semua' ? DATA.length : DATA.filter(r => r.status === f).length}
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
                  {['Tugas', 'Kurir', 'Tanggal', 'Durasi', 'Status', 'Rating', 'Biaya'].map((h, i) => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: i === 6 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#475569' }}>{r.inisial}</div>
                        <span style={{ fontSize: 13, color: '#374151' }}>{r.kurir}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{r.tanggal}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{r.durasi}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: '14px 16px' }}><Stars rating={r.rating} /></td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: r.biaya === 0 ? '#cbd5e1' : '#0f172a' }}>{fmt(r.biaya)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '14px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Menampilkan {filtered.length} dari {DATA.length} riwayat</p>
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
