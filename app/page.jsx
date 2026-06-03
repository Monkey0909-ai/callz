'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-xl font-black tracking-tight text-blue-600">CALLZ</span>
        <div className="hidden md:flex gap-8 text-sm text-gray-600">
          <a href="#layanan" className="hover:text-blue-600 transition-colors">Layanan</a>
          <a href="#tentang" className="hover:text-blue-600 transition-colors">Tentang</a>
          <a href="#bantuan" className="hover:text-blue-600 transition-colors">Bantuan</a>
        </div>
        <Link
          href="/login"
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mulai Sekarang
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-black leading-tight mb-4">
            Ada Kerjaan?<br />
            <span className="text-blue-600">CallZ</span> Aja!
          </h1>
          <p className="text-gray-500 text-base mb-8 max-w-sm">
            Delegasikan tugas harian Anda kepada mitra profesional kami. Hemat waktu, kurangi stres, dan nikmati hidup dengan layanan concierge terpercaya.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gunakan Jasa (User) →
            </Link>
            <Link
              href="/mitra"
              className="border-2 border-gray-800 text-gray-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Mulai Kerja (Mitra)
            </Link>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-2xl h-44 flex items-center justify-center text-5xl">📦</div>
          <div className="bg-gray-100 rounded-2xl h-44 flex items-center justify-center text-5xl">🛍️</div>
          <div className="bg-green-50 rounded-2xl h-44 flex items-center justify-center text-5xl">🥦</div>
          <div className="bg-orange-50 rounded-2xl h-44 flex items-center justify-center text-5xl">🛵</div>
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section id="layanan" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wide">Layanan Unggulan</h2>
              <p className="text-gray-500 text-sm mt-1">Pilih layanan yang paling sesuai dengan kebutuhan mendesak Anda hari ini.</p>
            </div>
            <Link href="/dashboard" className="text-blue-600 text-sm font-semibold hover:underline">
              Lihat Semua Layanan →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📦', title: 'Penjemputan & Pengiriman', desc: 'Kirim paket, dokumen, atau barang apa pun ke mana saja dengan aman dan cepat.' },
              { icon: '🛒', title: 'Layanan Belanja Pribadi', desc: 'Butuh belanja bulanan anda, titip barang khusus? Serahkan belanjaan Anda pada kami.' },
              { icon: '✅', title: 'Tugas Khusus', desc: 'Antri tiket, bayar tagihan, atau urusan administratif lainnya? Kami siap membantu.' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm mb-5">{s.desc}</p>
                <Link href="/dashboard" className="text-blue-600 text-sm font-semibold hover:underline">
                  Pesan Sekarang →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 max-w-6xl mx-auto px-8">
        <h2 className="text-center text-2xl font-black uppercase tracking-wide mb-10">Dipercaya oleh Ribuan Pengguna</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-600 text-white rounded-2xl p-6 md:col-span-2">
            <div className="text-yellow-300 text-lg mb-3">★★★★★</div>
            <p className="text-lg font-semibold leading-relaxed mb-4">
              "Layanan CallZ benar-benar menyelamatkan waktu saya yang super padat. Mitra mereka sangat profesional dan teliti saat belanja keperluan dapur."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">SW</div>
              <div>
                <p className="font-semibold text-sm">Sarah Wijaya</p>
                <p className="text-blue-200 text-xs">Marketing Manager</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { name: 'Budi Santoso', role: 'Wiraswasta', text: 'Kurirnya tepat waktu dan sangat komunikatif. Rekomendasiin banget, buat urusan yang pakai urgent!' },
              { name: 'Andra Pratama', role: 'Software Engineer', text: 'Pesan special errand buat ambil tiket ternyata semudah itu. Ga perlu repot keluar kantor lagi!' },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
                <p className="text-gray-700 text-sm mb-3">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-16 text-center px-8">
        <h2 className="text-3xl font-black uppercase mb-3">Siap Memulai Hari yang Lebih Produktif?</h2>
        <p className="text-gray-500 mb-8">Download aplikasi CallZ sekarang dan biarkan kami mengurus semua detail kecil hidup Anda.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-black transition-colors flex items-center gap-2">
            📲 Download App
          </button>
          <button className="border-2 border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:border-gray-600 transition-colors flex items-center gap-2">
            💬 Hubungi Kami
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <p className="font-black text-blue-600 text-lg mb-2">CALLZ</p>
            <p className="text-sm text-gray-500">Layanan concierge yang precise untuk era digital. Kami yang mengurus semuanya.</p>
          </div>
          <div className="flex gap-16 text-sm text-gray-500">
            <div className="space-y-2">
              <p className="font-semibold text-gray-800 uppercase text-xs">Perusahaan</p>
              <a href="#" className="block hover:text-blue-600">About Us</a>
              <a href="#" className="block hover:text-blue-600">Privacy</a>
              <a href="#" className="block hover:text-blue-600">Legal</a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-800 uppercase text-xs">Bantuan</p>
              <a href="#" className="block hover:text-blue-600">Help Center</a>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-800 uppercase text-xs">Sosial</p>
              <a href="#" className="block hover:text-blue-600">Twitter</a>
              <a href="#" className="block hover:text-blue-600">Instagram</a>
              <a href="#" className="block hover:text-blue-600">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 flex justify-between text-xs text-gray-400">
          <span>© 2026 CallZ Concierge. Built for Precision.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">Legal</a>
            <a href="#" className="hover:text-blue-600">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
