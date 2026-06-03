'use client'
import Link from 'next/link'

const navItems = [
  { label: 'Dashboard', icon: '⊞', href: '/mitra', active: true },
  { label: 'Tugas Aktif', icon: '↺', href: '/mitra/tugas-aktif'        },
  { label: 'Riwayat', icon: '🕐', href: '/mitra/riwayat' },
  { label: 'Pengaturan', icon: '⚙', href: '/mitra/pengaturan' },
]

const nearbyTasks = [
  { tag: 'RINGAN', tagColor: 'orange', title: 'Ambil Paket', sub: 'Kantor Pos Pusat · Jarak 0.8 mil', note: 'Akan Kedaluwarsa dalam 12M', price: 'Rp 18.200' },
  { tag: 'TUGAS MUDAH', tagColor: 'gray', title: 'Layanan Penitipan Pakaian', sub: 'Spin City Cleaners · Jarak 1.2 mil', note: 'Rute Terdekat', price: 'Rp 12.000' },
  { tag: 'RINGAN', tagColor: 'orange', title: 'Pengiriman Makanan untuk Beberapa Pesanan', sub: 'Chelsea Market · Jaraknya 2.5 mil', note: '3 Barang · Muatan Berat', price: 'Rp 22.500' },
]

export default function MitraDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full">
        <Link href="/" className="font-black text-blue-600 text-xl px-2 mb-8 block">CALLZ</Link>

        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">🧑</div>
          <div>
            <p className="font-bold text-sm text-gray-900">Mitra Aktif</p>
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
            <p className="text-gray-500 text-sm mt-1">Selamat Datang Kembali! Disekitar kamu ada 3 Tugas.</p>
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
              <p className="text-2xl font-black text-gray-900">Rp 142.500</p>
              <span className="text-green-600 text-sm font-bold">+12%</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Tugas Diselesaikan</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-gray-900">12</p>
              <span className="text-gray-400 text-sm">Hari ini</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Rating Mitra</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-gray-900">4.92</p>
              <div className="text-yellow-400">★★★★☆</div>
            </div>
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
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Pengiriman Bahan Makanan #4928</h3>
                  <p className="text-sm text-gray-500 mt-1">Klien: Sarah J. · Diperkirakan selesai dalam 15 menit</p>
                </div>
                <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200">
                  📋
                </button>
              </div>

             {/* Map Real (Google Maps Banjarmasin Resmi) */}
<div className="w-full h-52 my-4 rounded-xl overflow-hidden border border-gray-200 relative shadow-inner">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63717.3787723908!2d114.55742516416625!3d-3.316693982464167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dee3f3a4bd87bf9%3A0x3030bfbcaf7b050!2sBanjarmasin%2C%20Kota%20Banjarmasin%2C%20Kalimantan%20Selatan!5e0!3m2!1sid!2sid!4v1717460000000!5m2!1sid!2sid"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="w-full h-full"
  ></iframe>

  {/* Route markers (Tetap Melayang di Atas Peta) */}
  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-100 z-10">
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PENGAMBILAN</p>
    <p className="text-xs font-bold text-gray-800">Pesanan di warung </p>
  </div>
  
  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-100 z-10">
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PENGIRIMAN</p>
    <p className="text-xs font-bold text-gray-800">Jalan 23 Barat No. 242</p>
  </div>
</div>

              {/* Instructions + Actions */}
              <div className="flex gap-4">
                <div className="flex-1 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl p-4">
                  <p className="text-xs text-blue-600 font-bold mb-1">INSTRUKSI</p>
                  <p className="text-sm text-gray-700">"Pastikan telor nya di pisahkan plastiknya dan telpon ketika sampai di lobi. Jangan digantung di pintu."</p>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  
                {/* LANGSUNG GANTI JADI SEPERTI INI */}
<a
  href="https://www.google.com/maps/dir/?api=1&destination=Jalan+23+Barat+No.+242+Banjarmasin"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
>
  ▲ Buka Navigasi
</a>
                  <button className="bg-gray-100 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm">
                    Tandai sudah diambil
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 text-lg">Tersedia di Dekatmu</h2>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">3 BARU</span>
            </div>
            <div className="space-y-3">
              {nearbyTasks.map((task, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${task.tagColor === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                      {task.tag}
                    </span>
                    <span className="font-black text-gray-900 text-sm">{task.price}</span>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.sub}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                    <span>⏱</span>
                    <span>{task.note}</span>
                  </div>
                </div>
              ))}
              <Link
                href="/mitra/semua-tugas"
                className="block text-center border-2 border-gray-200 text-gray-600 font-semibold text-sm py-3 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                Lihat Semua Tugas Tersedia
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
