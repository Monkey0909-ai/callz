'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Dashboard', icon: '⊞', href: '/mitra', active: true },
  { label: 'Tugas Aktif', icon: '↺', href: '/mitra/tugas-aktif'        },
  { label: 'Riwayat', icon: '🕐', href: '/mitra/riwayat' },
  { label: 'Pengaturan', icon: '⚙', href: '/mitra/pengaturan' },
]



// ── Helper: buat inisial dari nama ──
function buatInisial(nama) {
  if (!nama) return '?'
  const parts = nama.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// ── Helper: buat URL embed maps tanpa API key (pakai iframe gratis) ──
function buildMapUrl(pickup, destination) {
  if (pickup && destination) {
    // Tampilkan rute dari pickup ke destination tanpa API key
    return `https://maps.google.com/maps?q=from:${encodeURIComponent(pickup)}+to:${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
  } else if (pickup) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(pickup)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }
  return `https://maps.google.com/maps?q=Banjarmasin&t=&z=13&ie=UTF8&iwloc=&output=embed`
}

// ── Helper: buat URL navigasi Google Maps (dari lokasi saat ini ke tujuan) ──
function buildNavUrl(pickup, destination) {
  if (!destination) return 'https://maps.google.com'
  if (pickup && destination) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`
}

export default function MitraDashboard() {
  const [userDisplayName, setUserDisplayName] = useState('Mitra Aktif')
  const [mitraName, setMitraName]             = useState('')

  // Tugas yang sedang aktif diambil mitra ini
  const [activeTask, setActiveTask] = useState(null)

  // Tugas yang masih "Menunggu" untuk panel Tersedia di Dekatmu
  const [userTasks, setUserTasks] = useState([])

  // Rating dinamis dari tugas yang sudah selesai dan dirating user
  const [mitraRating, setMitraRating] = useState({ avg: null, count: 0 })
  const [completedCount, setCompletedCount] = useState(0)
  const [dailyIncome, setDailyIncome] = useState(0)

  // ── Baca nama mitra dari localStorage ──
  const loadUserData = () => {
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    if (raw) {
      try {
        const p = JSON.parse(raw)
        let nama = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim()
        if (nama) {
          setUserDisplayName(nama)
          setMitraName(nama)
        }
      } catch (e) { console.error('Gagal memproses data user', e) }
    }
  }

  // ── Baca tugas dari callz_tasks, pisah aktif vs menunggu ──
  const loadTasks = () => {
    const raw = localStorage.getItem('callz_tasks')
    if (!raw) return
    try {
      const all = JSON.parse(raw)
      if (!Array.isArray(all)) return

      // Nama mitra saat ini (baca langsung dari storage agar tidak stale)
      const rawUser = localStorage.getItem('mitra_user') || localStorage.getItem('user')
      let currentMitra = ''
      if (rawUser) {
        const p = JSON.parse(rawUser)
        currentMitra = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim()
      }

      // Tugas aktif = Diterima oleh mitra ini
      const aktif = all.find(t => t.status === 'Diterima' && t.kurir === currentMitra)
      setActiveTask(aktif || null)

      // Panel kanan = hanya tugas yang masih Menunggu
      setUserTasks(all.filter(t => t.status === 'Menunggu'))

      // ── Hitung rating, tugas selesai, dan pendapatan harian untuk mitra ini ──
      const mitraTasks = all.filter(t => t.kurir === currentMitra)
      const selesai = mitraTasks.filter(t => t.status === 'Selesai')
      setCompletedCount(selesai.length)

      // Pendapatan harian = sum biaya tugas selesai hari ini
      // Pakai tanggalSelesai (disimpan saat tandai selesai), fallback ke tanggal
      const todayStr = new Date().toLocaleDateString('id-ID')
      const incomeToday = selesai
        .filter(t => (t.tanggalSelesai || t.tanggal) === todayStr)
        .reduce((sum, t) => sum + (t.biaya || 0), 0)
      // Jika tidak ada yang cocok hari ini tapi ada tugas selesai, tampilkan total semua
      const incomeAll = selesai.reduce((sum, t) => sum + (t.biaya || 0), 0)
      setDailyIncome(incomeToday > 0 ? incomeToday : incomeAll)

      // Rating rata-rata dari tugas selesai yang sudah dirating user
      const rated = selesai.filter(t => t.rating > 0)
      if (rated.length > 0) {
        const avg = rated.reduce((s, t) => s + t.rating, 0) / rated.length
        setMitraRating({ avg: avg.toFixed(2), count: rated.length })
      } else {
        setMitraRating({ avg: null, count: 0 })
      }
    } catch (e) { console.error('Gagal memproses callz_tasks', e) }
  }

  // ── Ambil job langsung dari panel kanan dashboard ──
  const handleAmbilDariDashboard = (tugas) => {
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    let nama = userDisplayName
    let inisial = buatInisial(nama)
    if (raw) {
      try {
        const p = JSON.parse(raw)
        nama = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || nama
        inisial = p.inisial || buatInisial(nama)
      } catch (e) {}
    }

    const all = JSON.parse(localStorage.getItem('callz_tasks') || '[]')
    const updated = all.map(t =>
      t.id === tugas.id
        ? { ...t, kurir: nama, inisial, status: 'Diterima', waktuDiambil: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
        : t
    )
    localStorage.setItem('callz_tasks', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  // ── Tandai tugas aktif sebagai Selesai ──
  const handleSelesai = () => {
    if (!activeTask) return
    const all = JSON.parse(localStorage.getItem('callz_tasks') || '[]')
    const now = new Date()
    const updated = all.map(t =>
      t.id === activeTask.id
        ? {
            ...t,
            status: 'Selesai',
            waktuSelesai: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            tanggalSelesai: now.toLocaleDateString('id-ID'),
          }
        : t
    )
    localStorage.setItem('callz_tasks', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  useEffect(() => {
    loadUserData()
    loadTasks()
    window.addEventListener('profileUpdated', loadUserData)
    window.addEventListener('storage', () => { loadUserData(); loadTasks() })
    return () => {
      window.removeEventListener('profileUpdated', loadUserData)
      window.removeEventListener('storage', loadTasks)
    }
  }, [])

  const initialLetter = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'M'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full">
        <Link href="/" className="font-black text-blue-600 text-xl px-2 mb-8 block">CALLZ</Link>

        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            {initialLetter}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-gray-900 truncate">{userDisplayName}</p>
            <p className="text-xs text-gray-400 uppercase leading-tight">Layanan Concierge Terverifikasi</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mitra Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Selamat Datang Kembali! Disekitar kamu ada {activeTask ? 4 : 3} Tugas.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors">
              🔔
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-xs font-bold text-gray-700">Status: Online</p>
                <p className="text-xs text-green-600 font-semibold">SEDANG BERLANGSUNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Pendapatan Harian</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-gray-900">
                {dailyIncome > 0 ? `Rp ${dailyIncome.toLocaleString('id-ID')}` : '—'}
              </p>
              {dailyIncome > 0 && (
                <span className="text-green-600 text-sm font-bold">
                  {(() => {
                    const todayStr = new Date().toLocaleDateString('id-ID')
                    const raw = localStorage.getItem('callz_tasks') || '[]'
                    const rawUser = localStorage.getItem('mitra_user') || localStorage.getItem('user') || '{}'
                    try {
                      const all = JSON.parse(raw)
                      const p = JSON.parse(rawUser)
                      const currentMitra = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim()
                      const todaySelesai = all.filter(t => t.kurir === currentMitra && t.status === 'Selesai' && (t.tanggalSelesai || t.tanggal) === todayStr)
                      return todaySelesai.length > 0 ? 'Hari ini' : 'Total'
                    } catch { return 'Total' }
                  })()}
                </span>
              )}
            </div>
            {completedCount > 0 && (
              <p className="text-xs text-gray-400 mt-1">{completedCount} tugas selesai</p>
            )}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Tugas Diselesaikan</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-gray-900">{completedCount}</p>
              <span className="text-gray-400 text-sm">Total</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Rating Mitra</p>
            {mitraRating.avg ? (
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-gray-900">{mitraRating.avg}</p>
                  <div className="text-yellow-400 text-lg">
                    {'★'.repeat(Math.round(mitraRating.avg))}{'☆'.repeat(5 - Math.round(mitraRating.avg))}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Dari {mitraRating.count} ulasan</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-black text-gray-300">—</p>
                <p className="text-xs text-gray-300 mt-1">Belum ada rating</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Task + Nearby tasks */}
        <div className="grid grid-cols-3 gap-6">
          {/* Active Task */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 text-lg">Tugas Aktif Sekarang</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                DALAM PROGRESS
              </span>
            </div>

            <div className={`bg-white border rounded-2xl p-6 transition-all ${activeTask ? 'border-blue-200 shadow-sm' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">
                    {activeTask ? activeTask.judul || "Tugas Aktif" : "Belum Ada Misi Aktif"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTask
                      ? `Kategori: ${activeTask.kategori || '—'} · ID: #${activeTask.id} · Status: Diterima`
                      : 'Ambil tugas di panel kanan atau tunggu permintaan masuk.'}
                  </p>
                </div>
                <span className="text-2xl">{activeTask?.icon || '📋'}</span>
              </div>

              {/* Map Dinamis — ikuti lokasi tugas yang diambil */}
              <div className="w-full h-52 my-4 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
                {activeTask ? (
                  <iframe
                    key={activeTask.id}
                    src={buildMapUrl(activeTask.pickup, activeTask.destination)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                ) : (
                  <iframe
                    src="https://maps.google.com/maps?q=Banjarmasin&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    width="100%" height="100%"
                    style={{ border: 0 }}
                    allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                )}

                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-100 z-10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PENGAMBILAN</p>
                  <p className="text-xs font-bold text-gray-800">
                    {activeTask?.pickup || "—"}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-100 z-10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TUJUAN</p>
                  <p className="text-xs font-bold text-gray-800">
                    {activeTask?.destination || "—"}
                  </p>
                </div>
              </div>

              {/* Instruksi + Aksi */}
              <div className="flex gap-4">
                <div className="flex-1 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-4">
                  <p className="text-xs text-blue-600 font-bold mb-1">INSTRUKSI / CATATAN</p>
                  <p className="text-sm text-gray-700 italic">
                    "{activeTask?.instruksi || activeTask?.locationNote || "Tidak ada instruksi khusus tambahan dari pembuat tugas."}"
                  </p>
                  {activeTask && (
                    <div className="mt-3 pt-3 border-t border-blue-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <span>⏱ {activeTask.durasi || '—'}</span>
                      <span>💰 {activeTask.biaya ? `Rp ${activeTask.biaya.toLocaleString('id-ID')}` : '—'}</span>
                      <span>📅 {activeTask.tanggal || '—'}</span>
                      <span>📦 {activeTask.kategori || '—'}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <a
                    href={activeTask ? buildNavUrl(activeTask.pickup, activeTask.destination) : 'https://maps.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 ${activeTask ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    ▲ Buka Navigasi
                  </a>
                  <button
                    disabled={!activeTask}
                    onClick={handleSelesai}
                    className="bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    ✓ Tandai Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Tasks — dari riwayat tugas user */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 text-lg">Tersedia di Dekatmu</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {userTasks.length} TUGAS
              </span>
            </div>
            <div className="space-y-3">
              {userTasks.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-bold text-gray-400 text-sm">Belum ada tugas dari pengguna</p>
                  <p className="text-xs text-gray-300 mt-1">Tugas akan muncul setelah pengguna membuat order</p>
                </div>
              ) : (
                userTasks.slice(0, 3).map((task, i) => {
                  const KAT_STYLE = {
                    'RINGAN':      { bg: 'bg-orange-100', text: 'text-orange-600' },
                    'TUGAS MUDAH': { bg: 'bg-blue-100',   text: 'text-blue-600'   },
                    'SEDANG':      { bg: 'bg-yellow-100', text: 'text-yellow-600' },
                    'BERAT':       { bg: 'bg-red-100',    text: 'text-red-600'    },
                  }
                  const ks = KAT_STYLE[task.kategori] || { bg: 'bg-gray-100', text: 'text-gray-600' }

                  return (
                    <div key={task.id || i} className="bg-white border border-gray-100 rounded-2xl px-4 py-4 flex items-center gap-3 hover:border-gray-200 hover:shadow-sm transition-all">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                        {task.icon || '📋'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          {task.kategori && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${ks.bg} ${ks.text}`}>
                              {task.kategori}
                            </span>
                          )}
                          {task.status && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-green-100 text-green-600">
                              {task.status}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-gray-900 text-sm leading-tight truncate">{task.judul}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                          {task.tanggal && <span>📅 {task.tanggal}</span>}
                        </div>
                        {(task.pickup || task.destination) && (
                          <div className="mt-1.5 space-y-0.5">
                            {task.pickup && (
                              <div className="flex items-start gap-1 text-xs text-gray-500">
                                <span className="text-green-500 mt-0.5 flex-shrink-0">📍</span>
                                <span className="truncate">{task.pickup}</span>
                              </div>
                            )}
                            {task.destination && (
                              <div className="flex items-start gap-1 text-xs text-gray-500">
                                <span className="text-red-500 mt-0.5 flex-shrink-0">🏁</span>
                                <span className="truncate">{task.destination}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Biaya + Tombol */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <p className="font-black text-gray-900 text-sm">
                          {task.biaya ? `Rp ${task.biaya.toLocaleString('id-ID')}` : '—'}
                        </p>
                        <button
                          onClick={() => handleAmbilDariDashboard(task)}
                          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-sm"
                        >
                          Ambil
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
              <Link
                href="/mitra/semua-tugas"
                className="block text-center border-2 border-dashed border-gray-200 text-gray-500 font-semibold text-sm py-3 rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                Lihat Semua Tugas →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}