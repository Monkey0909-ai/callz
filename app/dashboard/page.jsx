'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/dashboard',           active: true },
  { label: 'Riwayat',     icon: '🕐', href: '/dashboard/riwayat'               },
  { label: 'Pengaturan',  icon: '⚙', href: '/dashboard/pengaturan'            },
]

const TUGAS_CEPAT = [
  { icon: '🧺', label: 'Belanja Bahan Makanan', sub: 'Sudah tersedia' },
  { icon: '📦', label: 'Ambil Paket',           sub: '3 Mitras di sekitar sini' },
  { icon: '⏳', label: 'Antre',                 sub: 'Permintaan mendesak' },
]

const MITRA_TERSEDIA = [
  { nama: 'Sarah L.',   info: '98% Rating · 1.2 mi', foto: '👩' },
  { nama: 'Marcus J.',  info: 'Elite · 0.8 mi',      foto: '👨' },
]

export default function UserDashboard() {
  const [search, setSearch] = useState('')
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Santoso')
  
  // State baru untuk menangkap tugas aktif dari localStorage
  const [activeTask, setActiveTask] = useState(null)
  const [simulatedProgress, setSimulatedProgress] = useState(15)
  const [simulatedStatus, setSimulatedStatus] = useState('Mencari kurir terdekat untuk menjemput paket...')

  const loadUserData = () => {
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
  }

  const checkActiveTask = () => {
    const existingTasks = JSON.parse(localStorage.getItem('callz_tasks')) || []
    // Mencari jika ada tugas yang statusnya masih berjalan/mencari kurir
    const currentRunningTask = existingTasks.find(task => task.kurir === 'Mencari Kurir...')
    
    if (currentRunningTask) {
      setActiveTask(currentRunningTask)
    } else {
      setActiveTask(null)
    }
  }

  useEffect(() => {
    loadUserData()
    checkActiveTask()

    window.addEventListener('profileUpdated', loadUserData)
    return () => window.removeEventListener('profileUpdated', loadUserData)
  }, [])

  // Efek simulasi pergerakan kurir & progress update secara real-time
  useEffect(() => {
    if (!activeTask) return;

    const interval = setInterval(() => {
      setSimulatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          // Opsional: Perbarui status di localStorage ke 'Selesai' jika sudah 100%
          const existingTasks = JSON.parse(localStorage.getItem('callz_tasks')) || []
          const updated = existingTasks.map(t => t.id === activeTask.id ? { ...t, kurir: 'David K.', status: 'Selesai' } : t)
          localStorage.setItem('callz_tasks', JSON.stringify(updated))
          return 100
        }
        
        // Perubahan pesan status berdasarkan jangkauan progress
        if (prev > 75) {
          setSimulatedStatus('Kurir hampir sampai ke lokasi tujuan pengantaran.')
        } else if (prev > 45) {
          setSimulatedStatus('Paket berhasil diambil. Kurir sedang menuju lokasi tujuan.')
        } else if (prev > 25) {
          setSimulatedStatus('Kurir sudah tiba di lokasi penjemputan utama.')
        }
        
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [activeTask])

  const fullName = `${firstName} ${lastName}`.trim()
  const initialLetter = firstName ? firstName.charAt(0).toUpperCase() : 'A'

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ minHeight: 820 }}>

        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari tugas, mitra, atau riwayat..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <nav className="flex gap-5 text-sm">
              <span className="font-bold text-blue-600 cursor-pointer">Layanan</span>
              <span className="text-gray-500 hover:text-gray-800 cursor-pointer">Tentang</span>
              <span className="text-gray-500 hover:text-gray-800 cursor-pointer">Bantuan</span>
            </nav>
            <Link
              href="/login"
              className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mulai Sekarang
            </Link>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-6 px-4 flex-shrink-0">
            <p className="font-black text-blue-600 text-xl px-2 mb-6">CallZ</p>

            <div className="flex items-center gap-3 px-2 mb-8 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {initialLetter}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-gray-900 truncate m-0">{fullName || 'User'}</p>
                <p className="text-xs text-gray-400 m-0">User Pelanggan</p>
              </div>
            </div>

            <nav className="space-y-1 flex-1">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors
                    ${item.active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="uppercase tracking-wide text-xs">{item.label}</span>
                </Link>
              ))}
            </nav>

            <Link
              href="/dashboard/tugas"
              className="bg-blue-600 text-white text-sm font-bold text-center py-3 rounded-xl hover:bg-blue-700 transition-colors block"
            >
              Buat Tugas
            </Link>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 leading-tight">
                Selamat Datang kembali, {firstName}.<br />
                Siap untuk{' '}
                <span className="text-blue-600">mengembalikan waktu Anda?</span>
              </h1>
              <p className="text-gray-400 mt-3 text-sm">
                Jaringan concierge pribadi Anda sudah aktif dan siap untuk misi Anda berikutnya.
              </p>
            </div>

            <div className="flex gap-8">
              {/* Left Column */}
              <div className="flex-1 min-w-0 flex flex-col gap-6">
                {/* Tugas Cepat */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tugas Cepat</p>
                  <div className="grid grid-cols-3 gap-4">
                    {TUGAS_CEPAT.map((t, i) => (
                      <Link
                        key={i}
                        href="/dashboard/tugas"
                        className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer block"
                      >
                        <div className="text-blue-500 text-2xl mb-3">{t.icon}</div>
                        <p className="font-bold text-sm text-gray-900 mb-1 leading-tight">{t.label}</p>
                        <p className="text-xs text-gray-400">{t.sub}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tugas Aktif — Dinamis menggunakan LocalStorage */}
                {activeTask ? (
                  <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tugas Aktif Terkini</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${simulatedProgress === 100 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'}`}>
                        {simulatedProgress === 100 ? 'SELESAI' : 'DALAM PROGRESS'}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                        {activeTask.icon || '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 truncate">{activeTask.judul}</p>
                        <p className="text-xs text-blue-600 font-bold uppercase mt-0.5">ID: {activeTask.id}</p>
                        <p className="text-sm text-gray-500 mt-2">Kategori Kerja: <strong className="text-gray-700">{activeTask.kategori}</strong></p>
                        
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${simulatedProgress}%` }}></div>
                          </div>
                          <span className="text-sm font-bold text-blue-600 flex-shrink-0">{simulatedProgress}%</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 max-w-xs w-full flex flex-col gap-1">
                        <p className="text-xs font-bold text-gray-400">STATUS LIVE</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{simulatedStatus}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                          <span>📍</span><span>Kurir: {simulatedProgress > 25 ? 'David K.' : 'Menuju Lokasi'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href="/dashboard/riwayat" className="border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        📋 Detail Histori & Biaya
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
                    <span className="text-3xl mb-2">🤝</span>
                    <p className="text-sm font-bold text-gray-500">Tidak Ada Misi Berjalan</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm">Semua kiriman atau tugas Anda telah selesai dikerjakan oleh Mitra CallZ.</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="w-64 flex-shrink-0">
                {/* Map */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mitra di Sekitar</p>
                <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner mb-6 bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31869.456012356555!2d114.590111!3d-3.316694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full absolute inset-0"
                  ></iframe>

                  {/* Simulasi Pin Mitra */}
                  <div className="absolute top-[32%] left-[40%] z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                    <div className="w-7 h-7 bg-white rounded-full border-2 border-orange-500 shadow-md flex items-center justify-center animate-bounce duration-1000">
                      <span className="text-xs">👩</span>
                    </div>
                    <div className="w-3 h-1.5 bg-orange-500/30 rounded-full absolute -bottom-1 blur-[1px] animate-ping"></div>
                  </div>

                  <div className="absolute bottom-[28%] right-[25%] z-10 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                    <div className="w-7 h-7 bg-white rounded-full border-2 border-blue-600 shadow-md flex items-center justify-center animate-bounce" style={{ animationDelay: '200ms' }}>
                      <span className="text-xs">👨</span>
                    </div>
                    <div className="w-3 h-1.5 bg-blue-600/30 rounded-full absolute -bottom-1 blur-[1px] animate-ping"></div>
                  </div>

                  <button className="absolute bottom-3 right-3 bg-white hover:bg-gray-50 p-2 rounded-xl shadow-md border border-gray-100 text-gray-500 transition-colors active:scale-95 z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                    </svg>
                  </button>
                </div>

                {/* Tersedia */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tersedia Sekarang</p>
                <div className="space-y-3">
                  {MITRA_TERSEDIA.map((m, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-base">{m.foto}</div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900">{m.nama}</p>
                        <p className="text-xs text-gray-400">{m.info}</p>
                      </div>
                      <button className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors">
                        SIAP
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}