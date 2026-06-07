'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/mitra'             },
  { label: 'Tugas Aktif', icon: '↺', href: '/mitra/tugas-aktif' },
  { label: 'Riwayat',     icon: '🕐', href: '/mitra/riwayat'    },
  { label: 'Pengaturan',  icon: '⚙', href: '/mitra/pengaturan'  },
]

const KAT_STYLE = {
  'RINGAN':      { bg: 'bg-orange-100', text: 'text-orange-600' },
  'TUGAS MUDAH': { bg: 'bg-blue-100',   text: 'text-blue-600'   },
  'SEDANG':      { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  'BERAT':       { bg: 'bg-red-100',    text: 'text-red-600'    },
  // Kategori dari form buat tugas (jenisPaket)
  'Belanja':     { bg: 'bg-green-100',  text: 'text-green-600'  },
  'Dokumen':     { bg: 'bg-purple-100', text: 'text-purple-600' },
  'Paket':       { bg: 'bg-blue-100',   text: 'text-blue-600'   },
  'Antre':       { bg: 'bg-amber-100',  text: 'text-amber-600'  },
}

// ── Modal Konfirmasi Ambil Job ──
function ConfirmModal({ tugas, onConfirm, onCancel }) {
  if (!tugas) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[380px] text-center animate-in fade-in zoom-in duration-200">
        <div className="text-5xl mb-4">{tugas.icon || '📋'}</div>
        <h3 className="text-lg font-extrabold text-gray-900 mb-1">Ambil Tugas Ini?</h3>
        <p className="text-sm text-gray-500 mb-1 font-semibold">{tugas.judul}</p>
        <p className="text-xs text-gray-400 mb-6">
          Status akan berubah menjadi <strong className="text-blue-600">Diterima</strong> dan tugas akan masuk ke riwayat user.
        </p>

        {/* Detail ringkas */}
        <div className="bg-gray-50 rounded-xl p-4 text-left mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">ID Tugas</span>
            <span className="font-bold text-gray-700">#{tugas.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Kategori</span>
            <span className="font-bold text-gray-700">{tugas.kategori || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Kurir Terpilih</span>
            <span className="font-bold text-gray-700">{tugas.kurir || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Durasi Est.</span>
            <span className="font-bold text-gray-700">{tugas.durasi || '—'}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-500 font-semibold">Total Biaya</span>
            <span className="font-extrabold text-blue-600 text-base">
              {tugas.biaya ? `Rp ${tugas.biaya.toLocaleString('id-ID')}` : '—'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm active:scale-95"
          >
            ✓ Ambil Job
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Toast Notifikasi ──
function Toast({ msg, visible }) {
  if (!visible) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300">
      <span className="text-green-400 text-base">✓</span>
      {msg}
    </div>
  )
}

export default function SemuaTugasPage() {
  const [filter, setFilter]               = useState('Semua')
  const [search, setSearch]               = useState('')
  const [userDisplayName, setUserDisplayName] = useState('Mitra Aktif')
  const [mitraName, setMitraName]             = useState('')
  const [mitraInisial, setMitraInisial]       = useState('M')
  const [semuaTugas, setSemuaTugas]       = useState([])
  const [confirmTugas, setConfirmTugas]   = useState(null) // tugas yang mau diambil
  const [toast, setToast]                 = useState({ visible: false, msg: '' })

  // ── Helper: buat inisial dari nama lengkap ──
  const buatInisial = (nama) => {
    if (!nama) return '?'
    const parts = nama.trim().split(' ')
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // ── Load dari localStorage ──
  const loadUserTasks = () => {
    const stored = localStorage.getItem('callz_tasks')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          // Tampilkan hanya tugas yang masih "Menunggu" (belum diambil / dibatalkan)
          setSemuaTugas(parsed.filter(t => t.status === 'Menunggu'))
        }
      } catch (e) {
        console.error('Gagal memproses callz_tasks', e)
      }
    }
  }

  const loadUserData = () => {
    // Baca dari 'mitra_user' dulu, fallback ke 'user'
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    if (raw) {
      try {
        const parsedUser = JSON.parse(raw)
        let nama = ''
        if (parsedUser.name) {
          nama = parsedUser.name
        } else if (parsedUser.first_name || parsedUser.last_name) {
          nama = `${parsedUser.first_name || ''} ${parsedUser.last_name || ''}`.trim()
        }
        if (nama) {
          setUserDisplayName(nama)
          setMitraName(nama)
          setMitraInisial(parsedUser.inisial || buatInisial(nama))
        }
      } catch (e) {
        console.error('Gagal memproses data user', e)
      }
    }
  }

  useEffect(() => {
    loadUserData()
    loadUserTasks()
    window.addEventListener('profileUpdated', loadUserData)
    window.addEventListener('storage', () => { loadUserData(); loadUserTasks() })
    return () => {
      window.removeEventListener('profileUpdated', loadUserData)
      window.removeEventListener('storage', loadUserTasks)
    }
  }, [])

  const initialLetter = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'M'

  const kategoriList = ['Semua', ...Array.from(new Set(semuaTugas.map(t => t.kategori).filter(Boolean)))]

  const filtered = semuaTugas.filter(t => {
    const okFilter = filter === 'Semua' || t.kategori === filter
    const okSearch = !search ||
      t.judul?.toLowerCase().includes(search.toLowerCase()) ||
      t.kurir?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toLowerCase().includes(search.toLowerCase())
    return okFilter && okSearch
  })

  // ── INTI: Ambil Job → update localStorage → sinkronisasi semua halaman ──
  const handleAmbilJob = (tugas) => {
    // 1. Update status di localStorage: Menunggu → Diterima
    const allTasks = JSON.parse(localStorage.getItem('callz_tasks') || '[]')
    const updated = allTasks.map(t =>
      t.id === tugas.id
        ? {
            ...t,
            // Timpa kurir dengan nama akun mitra yang sedang login
            kurir: mitraName || userDisplayName,
            inisial: mitraInisial,
            status: 'Diterima',
            waktuDiambil: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          }
        : t
    )
    localStorage.setItem('callz_tasks', JSON.stringify(updated))

    // 2. Update state lokal: hapus dari daftar "Menunggu"
    setSemuaTugas(prev => prev.filter(t => t.id !== tugas.id))

    // 3. Dispatch storage event agar halaman riwayat user ikut update
    window.dispatchEvent(new Event('storage'))

    // 4. Tutup modal & tampilkan toast
    setConfirmTugas(null)
    setToast({ visible: true, msg: `Job "${tugas.judul}" berhasil diambil!` })
    setTimeout(() => setToast({ visible: false, msg: '' }), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Modal Konfirmasi */}
      <ConfirmModal
        tugas={confirmTugas}
        onConfirm={() => handleAmbilJob(confirmTugas)}
        onCancel={() => setConfirmTugas(null)}
      />

      {/* Toast */}
      <Toast visible={toast.visible} msg={toast.msg} />

      {/* ── Sidebar ── */}
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full shadow-sm z-10">
        <Link href="/mitra" className="font-black text-blue-600 text-2xl px-2 mb-6 block tracking-tight">CALLZ</Link>

        <div className="flex items-center gap-3 px-2 mb-8 w-full overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-extrabold text-base flex-shrink-0">
            {initialLetter}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm text-gray-900 truncate">{userDisplayName}</p>
            <p className="text-xs text-gray-400 uppercase leading-tight mt-0.5">Layanan Concierge<br />Terverifikasi</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="ml-52 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/mitra" className="text-gray-400 text-sm hover:text-blue-600 transition-colors">← Kembali ke Dashboard</Link>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Semua Tugas Tersedia</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Ada <span className="font-bold text-blue-600">{filtered.length} tugas</span> menunggu diambil sekarang
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-green-600">SEDANG BERLANGSUNG</span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {kategoriList.map(f => {
              const count = f === 'Semua' ? semuaTugas.length : semuaTugas.filter(t => t.kategori === f).length
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors
                    ${filter === f
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-blue-300'}`}
                >
                  {f}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full
                    ${filter === f ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tugas atau lokasi..."
              className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-56"
            />
          </div>
        </div>

        {/* Tugas List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-bold text-gray-400 text-lg">
                {semuaTugas.length === 0 ? 'Belum ada tugas dari pengguna' : 'Tidak ada tugas ditemukan'}
              </p>
              {semuaTugas.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">Tugas akan muncul setelah pengguna membuat order</p>
              )}
            </div>
          ) : filtered.map((t, i) => {
            const ks = KAT_STYLE[t.kategori] || { bg: 'bg-gray-100', text: 'text-gray-600' }
            return (
              <div
                key={t.id || i}
                className="bg-white border border-gray-100 rounded-2xl px-6 py-5 flex items-center gap-5 transition-all hover:border-gray-200 hover:shadow-sm"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {t.icon || '📋'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {t.kategori && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${ks.bg} ${ks.text}`}>
                        {t.kategori}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-600">
                      Menunggu
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 text-base leading-tight truncate">{t.judul}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                    {t.kurir && <span>👤 {t.kurir}</span>}
                    {t.kurir && t.tanggal && <span>·</span>}
                    {t.tanggal && <span>📅 {t.tanggal}</span>}
                    {t.durasi && <><span>·</span><span>⏱ {t.durasi}</span></>}
                    {t.id && <><span>·</span><span className="text-gray-300">#{t.id}</span></>}
                  </div>
                </div>

                {/* Biaya */}
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-gray-900 text-lg">
                    {t.biaya ? `Rp ${t.biaya.toLocaleString('id-ID')}` : '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Estimasi biaya</p>
                </div>

                {/* Tombol Ambil Job → buka modal konfirmasi */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setConfirmTugas(t)}
                    className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    Ambil Job
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Menampilkan {filtered.length} tugas menunggu · Diperbarui otomatis
          </p>
        )}
      </main>
    </div>
  )
}
