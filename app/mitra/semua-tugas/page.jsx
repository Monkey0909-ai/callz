'use client'
import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard',   icon: '⊞', href: '/mitra'                    },
  { label: 'Tugas Aktif', icon: '↺', href: '/mitra/tugas-aktif'        },
  { label: 'Riwayat',     icon: '🕐', href: '/mitra/riwayat'           },
  { label: 'Pengaturan',  icon: '⚙', href: '/mitra/pengaturan'         },
]

const SEMUA_TUGAS = [
  {
    id: '4928',
    kategori: 'RINGAN',
    katColor: 'orange',
    judul: 'Ambil Paket',
    lokasi: 'Kantor Pos Pusat',
    jarak: '0.8 mil',
    expire: 'Akan Kedaluwarsa dalam 12M',
    biaya: 18200,
    berat: false,
    icon: '📦',
  },
  {
    id: '4929',
    kategori: 'TUGAS MUDAH',
    katColor: 'blue',
    judul: 'Layanan Penitipan Pakaian',
    lokasi: 'Spin City Cleaners',
    jarak: '1.2 mil',
    expire: 'Rute Terdekat',
    biaya: 12000,
    berat: false,
    icon: '👕',
  },
  {
    id: '4930',
    kategori: 'RINGAN',
    katColor: 'orange',
    judul: 'Pengiriman Makanan untuk Beberapa Pesanan',
    lokasi: 'Chelsea Market',
    jarak: '2.5 mil',
    expire: '3 Barang · Muatan Berat',
    biaya: 22500,
    berat: true,
    icon: '🍱',
  },
  {
    id: '4931',
    kategori: 'SEDANG',
    katColor: 'yellow',
    judul: 'Antar Dokumen Kontrak ke Notaris',
    lokasi: 'Kantor Notaris Jl. Sudirman',
    jarak: '3.1 mil',
    expire: 'Dokumen Penting',
    biaya: 35000,
    berat: false,
    icon: '📄',
  },
  {
    id: '4932',
    kategori: 'RINGAN',
    katColor: 'orange',
    judul: 'Beli Obat di Apotek K24',
    lokasi: 'Apotek K24 Pusat',
    jarak: '1.0 mil',
    expire: 'Akan Kedaluwarsa dalam 8M',
    biaya: 15000,
    berat: false,
    icon: '💊',
  },
  {
    id: '4933',
    kategori: 'BERAT',
    katColor: 'red',
    judul: 'Pengiriman Furnitur Kecil',
    lokasi: 'IKEA Alam Sutera',
    jarak: '5.2 mil',
    expire: 'Butuh Kendaraan Besar',
    biaya: 75000,
    berat: true,
    icon: '🪑',
  },
  {
    id: '4934',
    kategori: 'TUGAS MUDAH',
    katColor: 'blue',
    judul: 'Ambil Laundry',
    lokasi: 'Laundry Bersih Jl. Veteran',
    jarak: '0.6 mil',
    expire: 'Rute Terdekat',
    biaya: 10000,
    berat: false,
    icon: '🧺',
  },
  {
    id: '4935',
    kategori: 'SEDANG',
    katColor: 'yellow',
    judul: 'Belanja Bahan Makanan Organik',
    lokasi: 'Whole Foods Market',
    jarak: '2.0 mil',
    expire: 'Akan Kedaluwarsa dalam 20M',
    biaya: 45000,
    berat: false,
    icon: '🛒',
  },
]

const KAT_STYLE = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-600'   },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  red:    { bg: 'bg-red-100',    text: 'text-red-600'    },
}

function fmt(n) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

export default function SemuaTugasPage() {
  const [diambil, setDiambil] = useState({})
  const [filter, setFilter]   = useState('Semua')
  const [search, setSearch]   = useState('')

  const filters = ['Semua', 'RINGAN', 'SEDANG', 'BERAT', 'TUGAS MUDAH']

  const filtered = SEMUA_TUGAS.filter(t => {
    const okFilter = filter === 'Semua' || t.kategori === filter
    const okSearch = !search || t.judul.toLowerCase().includes(search.toLowerCase()) || t.lokasi.toLowerCase().includes(search.toLowerCase())
    return okFilter && okSearch
  })

  const handleAmbil = (id) => {
    setDiambil(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full shadow-sm">
        <Link href="/mitra" className="font-black text-blue-600 text-2xl px-2 mb-6 block tracking-tight">CALLZ</Link>

        {/* Mitra Info */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">🧑</div>
          <div>
            <p className="font-bold text-sm text-gray-900">Mitra Aktif</p>
            <p className="text-xs text-gray-400 uppercase leading-tight">Layanan Concierge<br/>Terverifikasi</p>
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

      {/* Main */}
      <main className="ml-52 flex-1 p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/mitra" className="text-gray-400 text-sm hover:text-blue-600 transition-colors">← Kembali ke Dashboard</Link>
            </div>
            <h1 className="text-3xl font-black text-gray-900">Semua Tugas Tersedia</h1>
            <p className="text-gray-400 mt-1 text-sm">Ada <span className="font-bold text-blue-600">{filtered.length} tugas</span> tersedia di sekitarmu sekarang</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-green-600">SEDANG BERLANGSUNG</span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => {
              const count = f === 'Semua' ? SEMUA_TUGAS.length : SEMUA_TUGAS.filter(t => t.kategori === f).length
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
              <p className="font-bold text-gray-400 text-lg">Tidak ada tugas ditemukan</p>
            </div>
          ) : filtered.map(t => {
            const ks = KAT_STYLE[t.katColor]
            const sudahDiambil = diambil[t.id]
            return (
              <div
                key={t.id}
                className={`bg-white border rounded-2xl px-6 py-5 flex items-center gap-5 transition-all
                  ${sudahDiambil ? 'border-blue-200 bg-blue-50' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {t.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${ks.bg} ${ks.text}`}>
                      {t.kategori}
                    </span>
                    {t.berat && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-500">
                        MUATAN BERAT
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900 text-base leading-tight truncate">{t.judul}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>📍 {t.lokasi}</span>
                    <span>·</span>
                    <span>Jarak {t.jarak}</span>
                    <span>·</span>
                    <span>🕐 {t.expire}</span>
                  </div>
                </div>

                {/* Biaya */}
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-gray-900 text-lg">{fmt(t.biaya)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Estimasi biaya</p>
                </div>

                {/* Tombol Ambil Job */}
                <div className="flex-shrink-0">
                  {sudahDiambil ? (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 font-bold text-sm px-5 py-2.5 rounded-xl">
                      ✓ Diambil
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAmbil(t.id)}
                      className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      Ambil Job
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer info */}
        {filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">
            Menampilkan {filtered.length} tugas · Diperbarui setiap 30 detik
          </p>
        )}
      </main>
    </div>
  )
}
