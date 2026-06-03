'use client'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard',  icon: '⊞', href: '/dashboard',          active: true },
  { label: 'Riwayat',    icon: '🕐', href: '/dashboard/riwayat'              },
  { label: 'Pengaturan', icon: '⚙', href: '/dashboard/pengaturan'            },
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {/* Outer frame */}
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
            {/* Logo */}
            <p className="font-black text-gray-900 text-xl px-2 mb-6">CallZ</p>

            {/* User */}
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-base">🧑</div>
              <p className="font-bold text-sm text-gray-900">User</p>
            </div>

            {/* Nav */}
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

            {/* Buat Tugas */}
            <Link
              href="/dashboard/tugas"
              className="bg-blue-600 text-white text-sm font-bold text-center py-3 rounded-xl hover:bg-blue-700 transition-colors block"
            >
              Buat Tugas
            </Link>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            {/* Welcome */}
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 leading-tight">
                Selamat Datang kembali, Alex.<br />
                Siap untuk{' '}
                <span className="text-blue-600">mengembalikan waktu Anda?</span>
              </h1>
              <p className="text-gray-400 mt-3 text-sm">
                Jaringan concierge pribadi Anda sudah aktif dan siap untuk misi Anda berikutnya.
              </p>
            </div>

            <div className="flex gap-8">
              {/* Left */}
              <div className="flex-1 min-w-0">
                {/* Tugas Cepat */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tugas Cepat</p>
                <div className="grid grid-cols-3 gap-4 mb-8">
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

                {/* Tugas Aktif — hanya tampil kalau ada tugas */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hidden">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tugas Aktif</p>
                    <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-2.5 py-1 rounded-full">DALAM PROGRESS</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">👨‍💼</div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">Courier Mitra: David K.</p>
                      <p className="text-xs text-blue-600 font-bold uppercase mt-0.5">Misi Aktif</p>
                      <p className="text-sm text-gray-500 mt-2">Belanja Bahan Makanan: Pasar Organik</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm font-bold text-blue-600">75% Selesai</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 max-w-xs">
                      <p className="text-xs font-bold text-gray-400 mb-1">STATUS SEKARANG</p>
                      <p className="text-sm text-gray-700">Mengambil barang-barang terakhir di kasir. Diperkirakan tiba dalam 12 menit.</p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                        <span>📍</span><span>3.2 km</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    📋 Lihat Daftar
                  </button>
                </div>
              </div>

              {/* Right */}
              <div className="w-64 flex-shrink-0">
                {/* Map */}
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mitra di Sekitar</p>
                <div className="rounded-2xl overflow-hidden mb-6 relative" style={{ height: 220, background: '#1a5c4a' }}>
                  {/* SVG map */}
                  <svg viewBox="0 0 260 220" className="w-full h-full absolute inset-0 opacity-60">
                    {/* Roads */}
                    <path d="M30 110 Q80 55 130 75 Q185 95 240 55" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.5"/>
                    <path d="M20 170 Q75 130 130 115 Q185 100 245 130" stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.4"/>
                    <path d="M130 10 Q140 70 130 115 Q120 165 135 210" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.4"/>
                    {/* City block */}
                    <polygon points="65,60 155,45 200,85 175,145 90,155 50,110" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                  </svg>
                  {/* Blue dot */}
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
                    style={{ top: '55%', left: '52%', transform: 'translate(-50%,-50%)' }}
                  />
                  {/* Small dot */}
                  <div className="absolute w-3 h-3 bg-blue-300 rounded-full border-2 border-white shadow"
                    style={{ top: '28%', left: '30%' }}
                  />
                  {/* Expand */}
                  <button className="absolute bottom-2 right-2 bg-white rounded-lg p-1.5 shadow text-gray-600 text-xs">⤢</button>
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
