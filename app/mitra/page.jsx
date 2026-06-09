'use client'

const API_BASE = 'https://generous-awake-serval.ngrok-free.app/api'
import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

function getAuthHeaders() {
  let token = null
  try {
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    if (raw) {
      const p = JSON.parse(raw)
      token = p.token || p.access_token || null
    }
  } catch (_) {}
  if (!token) token = localStorage.getItem('mitra_token') || localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function formatRupiah(n) {
  if (!n && n !== 0) return '—'
  return 'Rp ' + Number(n).toLocaleString('id-ID')
}

function mapStatus(apiStatus) {
  const map = {
    'PENDING':         'Menunggu',
    'SEARCHING':       'Mencari',
    'ACCEPTED':        'Diterima',
    'PICKED_UP':       'Dijemput',
    'COMPLETED':       'Selesai',
    'CANCELLED':       'Dibatalkan',
    'PROOF_SUBMITTED': 'Bukti Dikirim',
  }
  return map[apiStatus] ?? 'Menunggu'
}

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/mitra',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Tugas Aktif',
    href: '/mitra/tugas-aktif',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: 'Riwayat',
    href: '/mitra/riwayat',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3h6l2 3h10a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"/>
      </svg>
    ),
  },
  {
    label: 'Pengaturan',
    href: '/mitra/pengaturan',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
]

function buildNavUrl(pickup, destination) {
  if (!pickup && !destination) return 'https://www.google.com/maps'
  if (pickup && destination) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&travelmode=driving`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pickup || destination)}`
}

// ── Sidebar (sama persis dengan Riwayat) ──
function Sidebar({ active, onLogout }) {
  const [userDisplayName, setUserDisplayName] = useState('Mitra Aktif')

  const loadUserData = () => {
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    if (raw) {
      try {
        const p = JSON.parse(raw)
        const nama = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim()
        if (nama) setUserDisplayName(nama)
      } catch (e) {}
    }
  }

  useEffect(() => {
    loadUserData()
    window.addEventListener('profileUpdated', loadUserData)
    return () => window.removeEventListener('profileUpdated', loadUserData)
  }, [])

  const initialLetter = userDisplayName ? userDisplayName.charAt(0).toUpperCase() : 'M'

  return (
    <div style={{
      width: 200, minHeight: '100vh', background: '#fff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'sticky', top: 0,
    }}>
      <div style={{ padding: '0 20px 28px', fontSize: 20, fontWeight: 800, color: '#2563eb', letterSpacing: -0.5 }}>
        CALLZ
      </div>

      <div style={{
        margin: '0 12px 24px', background: '#f0f4ff', borderRadius: 12,
        padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: '#2563eb', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 15, position: 'relative',
        }}>
          {initialLetter}
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #fff' }} />
        </div>
        <div style={{ textAlign: 'center', width: '100%', overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {userDisplayName}
          </div>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, lineHeight: 1.4, marginTop: 2 }}>
            LAYANAN CONCIERGE<br />TERVERIFIKASI
          </div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = active === item.href
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 9,
              background: isActive ? '#2563eb' : 'transparent',
              color: isActive ? '#fff' : '#64748b',
              fontWeight: isActive ? 700 : 500,
              fontSize: 13, textDecoration: 'none',
            }}>
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 10px', marginTop: 8 }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 9, width: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#ef4444', fontWeight: 500, fontSize: 13, textAlign: 'left',
          }}
        >
          <span>🚪</span> Keluar
        </button>
      </div>
    </div>
  )
}

// ── MapView (tidak diubah) ──
function MapView({ pickup, destination, taskId }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const hasTask = !!(pickup || destination)

  useEffect(() => {
    if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null }
    if (!hasTask || !mapRef.current) { setStatus('idle'); return }
    let isMounted = true
    setStatus('loading')
    const init = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'; link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }
      const L = (await import('leaflet')).default
      if (!isMounted || !mapRef.current) return
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current, { scrollWheelZoom: false, zoomControl: true }).setView([-3.3186, 114.5944], 13)
      instanceRef.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map)
      const LOCAL_POI = {
        'duta mall': { lat: -3.3248, lon: 114.5911 }, 'siring': { lat: -3.3317, lon: 114.5925 },
        'pasar lama': { lat: -3.3287, lon: 114.5897 }, 'pasar baru': { lat: -3.3254, lon: 114.5862 },
        'rsud ulin': { lat: -3.3131, lon: 114.5818 }, 'rs ulin': { lat: -3.3131, lon: 114.5818 },
        'masjid raya sabilal muhtadin': { lat: -3.3315, lon: 114.5910 },
        'btc': { lat: -3.3190, lon: 114.5920 }, 'transmart': { lat: -3.3150, lon: 114.6050 },
        'ulm': { lat: -3.2990, lon: 114.5820 }, 'q mall': { lat: -3.3190, lon: 114.6080 },
        'landasan ulin': { lat: -3.4420, lon: 114.7580 }, 'banjarbaru': { lat: -3.4417, lon: 114.8275 },
      }
      const geocode = async (addr) => {
        const key = addr.toLowerCase().trim().replace(/\s+/g, ' ')
        for (const [k, coords] of Object.entries(LOCAL_POI)) { if (key.includes(k) || k.includes(key)) return coords }
        for (const q of [addr + ', Banjarmasin, Kalimantan Selatan, Indonesia', addr + ', Banjarmasin, Indonesia', addr + ', Indonesia']) {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&countrycodes=id`, { headers: { 'Accept-Language': 'id' } })
            const data = await res.json()
            if (data?.[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
          } catch {}
        }
        return null
      }
      const greenIcon = L.divIcon({ html: `<div style="position:relative;width:32px;height:40px;"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #16a34a;"></div><div style="background:#16a34a;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.35);">📍</div></div>`, iconSize: [32,40], iconAnchor: [16,40], popupAnchor: [0,-40], className: '' })
      const redIcon  = L.divIcon({ html: `<div style="position:relative;width:32px;height:40px;"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #dc2626;"></div><div style="background:#dc2626;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.35);">🏁</div></div>`, iconSize: [32,40], iconAnchor: [16,40], popupAnchor: [0,-40], className: '' })
      const [pc, dc] = await Promise.all([pickup ? geocode(pickup) : null, destination ? geocode(destination) : null])
      if (!isMounted || !instanceRef.current) return
      if (pc) L.marker([pc.lat, pc.lon], { icon: greenIcon }).addTo(map).bindPopup(`<b>📍 Pengambilan</b><br/>${pickup}`)
      if (dc) L.marker([dc.lat, dc.lon], { icon: redIcon  }).addTo(map).bindPopup(`<b>🏁 Tujuan</b><br/>${destination}`)
      if (pc && dc) {
        try {
          const rd = await (await fetch(`https://router.project-osrm.org/route/v1/driving/${pc.lon},${pc.lat};${dc.lon},${dc.lat}?overview=full&geometries=geojson`)).json()
          if (!isMounted || !instanceRef.current) return
          if (rd.code === 'Ok' && rd.routes?.[0]) {
            const line = L.polyline(rd.routes[0].geometry.coordinates.map(([lon,lat])=>[lat,lon]), { color: '#2563eb', weight: 5, opacity: 0.85 }).addTo(map)
            map.fitBounds(line.getBounds(), { padding: [30,30] })
            const ib = L.control({ position: 'bottomleft' }); ib.onAdd = () => { const d = L.DomUtil.create('div'); d.innerHTML = `<div style="background:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.2);color:#1e40af;">🛣️ ${(rd.routes[0].distance/1000).toFixed(1)} km &nbsp;·&nbsp; ⏱ ~${Math.round(rd.routes[0].duration/60)} menit</div>`; return d }; ib.addTo(map)
          } else { L.polyline([[pc.lat,pc.lon],[dc.lat,dc.lon]], { color: '#2563eb', weight: 4, dashArray: '8,5', opacity: 0.7 }).addTo(map); map.fitBounds(L.latLngBounds([[pc.lat,pc.lon],[dc.lat,dc.lon]]), { padding: [30,30] }) }
        } catch { if (instanceRef.current) { L.polyline([[pc.lat,pc.lon],[dc.lat,dc.lon]], { color: '#2563eb', weight: 4, dashArray: '8,5', opacity: 0.7 }).addTo(instanceRef.current); instanceRef.current.fitBounds(L.latLngBounds([[pc.lat,pc.lon],[dc.lat,dc.lon]]), { padding: [30,30] }) } }
      } else if (pc) { map.setView([pc.lat, pc.lon], 15) } else if (dc) { map.setView([dc.lat, dc.lon], 15) }
      if (isMounted) setStatus('ready')
    }
    init().catch(() => { if (isMounted) setStatus('error') })
    return () => { isMounted = false; if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null } }
  }, [pickup, destination, taskId, hasTask])

  if (!hasTask) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(248,250,252,0.97)', gap: 6 }}>
      <span style={{ fontSize: 28 }}>🗺️</span>
      <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>Ambil tugas untuk melihat rute</span>
    </div>
  )
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {status === 'loading' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(248,250,252,0.85)', zIndex: 9999, gap: 8 }}>
          <div style={{ width: 28, height: 28, border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Memuat rute...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
      {status === 'error' && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(248,250,252,0.9)', zIndex: 9999, gap: 6 }}>
          <span style={{ fontSize: 28 }}>⚠️</span>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Gagal memuat peta</span>
        </div>
      )}
    </div>
  )
}

function MapPlaceholder({ pickup, destination, height = 180 }) {
  if (!(pickup || destination)) return (
    <div style={{ width: '100%', height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', gap: 6, borderRadius: 12 }}>
      <span style={{ fontSize: 24 }}>🗺️</span>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Tidak ada lokasi</span>
    </div>
  )
  const query = pickup && destination ? `${pickup} to ${destination}, Banjarmasin` : `${destination || pickup}, Banjarmasin`
  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 12, overflow: 'hidden', border: '1px solid #bfdbfe' }}>
      <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=14`} width="100%" height="100%" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      {pickup && <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '3px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', zIndex: 10 }}><p style={{ fontSize: 9, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>JEMPUT</p><p style={{ fontSize: 10, fontWeight: 700, color: '#1f2937', margin: 0, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pickup}</p></div>}
      {destination && <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '3px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', zIndex: 10 }}><p style={{ fontSize: 9, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>TUJUAN</p><p style={{ fontSize: 10, fontWeight: 700, color: '#1f2937', margin: 0, maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{destination}</p></div>}
    </div>
  )
}

const KAT_STYLE = {
  Belanja: { bg: '#fff7ed', color: '#ea580c' },
  Antar:   { bg: '#eff6ff', color: '#2563eb' },
  Jemput:  { bg: '#fefce8', color: '#ca8a04' },
  Lainnya: { bg: '#f1f5f9', color: '#475569' },
}

export default function MitraDashboard() {
  const router = useRouter()
  const [userDisplayName, setUserDisplayName] = useState('Mitra Aktif')
  const [mitraStatus, setMitraStatus]         = useState(null)
  const [activeTask, setActiveTask]           = useState(null)
  const [availableTasks, setAvailableTasks]   = useState([])
  const [tasksLoading, setTasksLoading]       = useState(true)
  const [tasksError, setTasksError]           = useState('')
  const [mitraRating, setMitraRating]         = useState({ avg: null, count: 0 })
  const [expandedTaskId, setExpandedTaskId]   = useState(null)
  const [locationStatus, setLocationStatus]   = useState(null)
  const locationIntervalRef = useRef(null)
  const activeTaskRef       = useRef(null)
  const [mitraIncome, setMitraIncome] = useState({ omzet_hari_ini: null, omzet_bulan_ini: null, total_omzet: null, total_completed_tasks: null, loading: true, error: false })
  const [proofFile, setProofFile]     = useState(null)
  const [proofLoading, setProofLoading] = useState(false)
  const [proofError, setProofError]   = useState('')

  const fetchActiveTask = async () => {
    const headers = getAuthHeaders()
    if (!headers.Authorization) return
    try {
      const res = await fetch(`${API_BASE}/mitra/tasks/history`, { headers })
      if (!res.ok) return
      const json = await res.json()
      const raw = Array.isArray(json.data) ? json.data : (json.data ? [json.data] : [])
      const aktif = raw.find(t => t.status === 'ACCEPTED' || t.status === 'PICKED_UP') || null
      if (aktif) {
        setActiveTask({ id: aktif.id, judul: aktif.title || '—', kategori: aktif.category_name || '—', status: mapStatus(aktif.status), pickup: aktif.pickup_address || null, destination: aktif.destination_address || null, instruksi: aktif.location_notes || null, biaya: aktif.total_estimated_fee || 0, icon: '📦', tanggal: aktif.created_at ? new Date(aktif.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' })
      } else { setActiveTask(null) }
    } catch (e) { console.warn('[CallZ] Gagal fetch active task:', e) }
  }

  const fetchAvailableTasks = async () => {
    const headers = getAuthHeaders()
    if (!headers.Authorization) { setTasksError('Sesi tidak ditemukan, silakan login ulang.'); setTasksLoading(false); return }
    setTasksLoading(true); setTasksError('')
    try {
      const res = await fetch(`${API_BASE}/mitra/tasks`, { headers })
      if (!res.ok) { setTasksError(`Gagal memuat tugas (${res.status})`); setTasksLoading(false); return }
      const json = await res.json()
      const raw = Array.isArray(json.data) ? json.data : (json.data ? [json.data] : [])
      setAvailableTasks(raw.filter(t => t.status === 'SEARCHING' || t.status === 'PENDING').map(t => ({ id: t.id, judul: t.title || '—', kategori: t.category_name || '—', status: mapStatus(t.status), pickup: t.pickup_address || null, destination: t.destination_address || null, instruksi: t.location_notes || null, biaya: t.total_estimated_fee || 0, tanggal: t.created_at ? new Date(t.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', icon: '📦' })))
    } catch (e) { console.error('[CallZ]', e); setTasksError('Kesalahan jaringan. Coba lagi.') }
    finally { setTasksLoading(false) }
  }

  const fetchMitraIncome = async () => {
    setMitraIncome(prev => ({ ...prev, loading: true, error: false }))
    try {
      const headers = getAuthHeaders()
      const today = new Date(), yyyy = today.getFullYear(), mm = String(today.getMonth()+1).padStart(2,'0'), dd = String(today.getDate()).padStart(2,'0')
      const todayStr = `${yyyy}-${mm}-${dd}`, firstOfMonth = `${yyyy}-${mm}-01`
      const [rH, rB, rT] = await Promise.all([fetch(`${API_BASE}/mitra/omzet?from=${todayStr}&to=${todayStr}`, { headers }), fetch(`${API_BASE}/mitra/omzet?from=${firstOfMonth}&to=${todayStr}`, { headers }), fetch(`${API_BASE}/mitra/omzet`, { headers })])
      const [h, b, t] = await Promise.all([rH.ok ? rH.json() : null, rB.ok ? rB.json() : null, rT.ok ? rT.json() : null])
      setMitraIncome({ omzet_hari_ini: h?.data?.omzet ?? null, omzet_bulan_ini: b?.data?.omzet ?? null, total_omzet: t?.data?.omzet ?? null, total_completed_tasks: t?.data?.total_completed_tasks ?? null, loading: false, error: false })
    } catch { setMitraIncome(prev => ({ ...prev, loading: false, error: true })) }
  }

  const updateLocationToServer = async (latitude, longitude) => {
    try { const res = await fetch(`${API_BASE}/auth/mitra/update-location`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ latitude, longitude }) }); setLocationStatus(res.ok ? 'success' : 'error') } catch { setLocationStatus('error') }
  }
  const startLocationTracking = () => {
    if (!navigator.geolocation) return
    setLocationStatus('updating')
    navigator.geolocation.getCurrentPosition(({ coords }) => updateLocationToServer(coords.latitude, coords.longitude), err => { console.warn(err); setLocationStatus('error') }, { enableHighAccuracy: true, timeout: 10000 })
    locationIntervalRef.current = setInterval(() => navigator.geolocation.getCurrentPosition(({ coords }) => updateLocationToServer(coords.latitude, coords.longitude), err => console.warn(err), { enableHighAccuracy: true, timeout: 10000 }), 30000)
  }
  const stopLocationTracking = () => { if (locationIntervalRef.current) { clearInterval(locationIntervalRef.current); locationIntervalRef.current = null }; setLocationStatus(null) }

  const handleToggleStatus = () => {
    const newStatus = mitraStatus === 'aktif' ? null : 'aktif'
    setMitraStatus(newStatus)
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    let nama = userDisplayName
    if (raw) { try { const p = JSON.parse(raw); nama = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || nama } catch {} }
    const mitraInfo = JSON.parse(localStorage.getItem('callz_mitra_status') || '{}')
    if (newStatus === 'aktif') { mitraInfo[nama] = { status: 'aktif', nama, waktu: new Date().toISOString() }; startLocationTracking() } else { delete mitraInfo[nama]; stopLocationTracking() }
    localStorage.setItem('callz_mitra_status', JSON.stringify(mitraInfo))
  }

  const loadUserData = () => {
    const raw = localStorage.getItem('mitra_user') || localStorage.getItem('user')
    if (raw) { try { const p = JSON.parse(raw); const nama = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(); if (nama) { setUserDisplayName(nama); const sd = JSON.parse(localStorage.getItem('callz_mitra_status') || '{}'); setMitraStatus(sd[nama]?.status || null) } } catch (e) {} }
  }

  const handleAmbilDariDashboard = async (tugas) => {
    const headers = getAuthHeaders()
    if (!headers.Authorization) { alert('Sesi tidak ditemukan. Silakan login ulang.'); return }
    try {
      const res = await fetch(`${API_BASE}/mitra/tasks/${tugas.id}/accept`, { method: 'POST', headers })
      if (!res.ok) { const err = await res.json().catch(() => ({})); alert(err?.message || `Gagal mengambil tugas (${res.status}).`); return }
      await Promise.all([fetchActiveTask(), fetchAvailableTasks()])
      setExpandedTaskId(null)
      setTimeout(() => { if (activeTaskRef.current) activeTaskRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 150)
    } catch (e) { console.error(e); alert('Kesalahan jaringan. Coba lagi.') }
  }

  const handleSelesai = async () => {
    if (!activeTask) return
    if (!proofFile) { setProofError('Pilih foto bukti pekerjaan terlebih dahulu.'); return }
    const headers = getAuthHeaders()
    if (!headers.Authorization) { setProofError('Sesi tidak ditemukan. Silakan login ulang.'); return }
    setProofLoading(true); setProofError('')
    try {
      const formData = new FormData(); formData.append('proof_of_work', proofFile)
      const res = await fetch(`${API_BASE}/mitra/tasks/${activeTask.id}/submit-proof`, { method: 'POST', headers: { 'ngrok-skip-browser-warning': 'true', Authorization: headers.Authorization }, body: formData })
      if (!res.ok) { const err = await res.json().catch(() => ({})); setProofError(err?.message || 'Gagal mengirim bukti.'); setProofLoading(false); return }
      setProofFile(null); setProofLoading(false); await fetchActiveTask()
    } catch { setProofError('Kesalahan jaringan. Coba lagi.'); setProofLoading(false) }
  }

  const handleLogout = () => {
    ['token','role','user','mitra_user','mitra_token','user_token','callz_mitra_status'].forEach(k => localStorage.removeItem(k))
    stopLocationTracking(); router.push('/login')
  }

  useEffect(() => { loadUserData(); fetchActiveTask(); fetchAvailableTasks(); fetchMitraIncome(); return () => stopLocationTracking() }, [])

  return (
    <div className={plusJakarta.className} style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar active="/mitra" onLogout={handleLogout} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* ── Header ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#0f172a' }}>Mitra Dashboard</h1>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>
              Selamat Datang Kembali! Tersedia {availableTasks.length} tugas di sekitarmu.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}>
              <svg width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </div>
            {/* Toggle Status */}
            <button
              onClick={handleToggleStatus}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                border: mitraStatus === 'aktif' ? '1.5px solid #16a34a' : '1.5px solid #d1d5db',
                background: mitraStatus === 'aktif' ? '#f0fdf4' : '#f8fafc',
                color: mitraStatus === 'aktif' ? '#15803d' : '#64748b',
                fontWeight: 700, fontSize: 12,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: mitraStatus === 'aktif' ? '#16a34a' : '#94a3b8' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>
                  {mitraStatus === 'aktif' ? 'Status: Aktif' : 'Status: Tidak Aktif'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: mitraStatus === 'aktif' ? '#16a34a' : '#94a3b8', letterSpacing: 0.3 }}>
                  {mitraStatus === 'aktif' ? 'SEDANG BERLANGSUNG' : 'TEKAN UNTUK SIAP'}
                </div>
              </div>
              {mitraStatus === 'aktif' && locationStatus && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 6, background: locationStatus === 'success' ? '#dcfce7' : locationStatus === 'error' ? '#fee2e2' : '#dbeafe', color: locationStatus === 'success' ? '#16a34a' : locationStatus === 'error' ? '#dc2626' : '#2563eb' }}>
                  📍
                </span>
              )}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '28px 32px' }}>

          {/* ── Stats Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
            {/* Pendapatan Hari Ini */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '18px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Pendapatan Hari Ini</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                {mitraIncome.loading ? <span style={{ color: '#d1d5db' }}>...</span> : formatRupiah(mitraIncome.omzet_hari_ini)}
              </div>
              {!mitraIncome.loading && mitraIncome.omzet_bulan_ini != null && (
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Bulan ini: {formatRupiah(mitraIncome.omzet_bulan_ini)}</div>
              )}
              {mitraIncome.error && (
                <div style={{ fontSize: 11, color: '#ef4444', marginTop: 5 }}>Gagal memuat · <button onClick={fetchMitraIncome} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: 11, padding: 0 }}>Coba lagi</button></div>
              )}
            </div>

            {/* Tugas Diselesaikan */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '18px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Tugas Diselesaikan</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>
                {mitraIncome.loading ? <span style={{ color: '#d1d5db' }}>...</span> : (mitraIncome.total_completed_tasks ?? 0)}
              </div>
              {!mitraIncome.loading && mitraIncome.total_omzet != null && (
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Total omzet: {formatRupiah(mitraIncome.total_omzet)}</div>
              )}
            </div>

            {/* Rating */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: '18px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>Rating Mitra</div>
              {mitraRating.avg ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{mitraRating.avg}</div>
                    <span style={{ color: '#f59e0b', fontSize: 16 }}>{'★'.repeat(Math.round(mitraRating.avg))}<span style={{ color: '#d1d5db' }}>{'★'.repeat(5 - Math.round(mitraRating.avg))}</span></span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Dari {mitraRating.count} ulasan</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 30, fontWeight: 800, color: '#d1d5db', lineHeight: 1 }}>—</div>
                  <div style={{ fontSize: 11, color: '#d1d5db', marginTop: 5 }}>Belum ada rating</div>
                </>
              )}
            </div>
          </div>

          {/* ── Main Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

            {/* ── Tugas Aktif ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Tugas Aktif Sekarang</h2>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, background: '#eff6ff', color: '#2563eb', fontSize: 11, fontWeight: 700 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                  DALAM PROGRESS
                </span>
              </div>

              <div ref={activeTaskRef} style={{ background: '#fff', border: `1px solid ${activeTask ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: 16, padding: 24, boxShadow: activeTask ? '0 1px 6px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {activeTask ? activeTask.judul : 'Belum Ada Misi Aktif'}
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>
                      {activeTask
                        ? `Kategori: ${activeTask.kategori} · ID: #${activeTask.id} · Status: ${activeTask.status}`
                        : 'Ambil tugas di panel kanan atau tunggu permintaan masuk.'}
                    </p>
                  </div>
                  <span style={{ fontSize: 24 }}>{activeTask?.icon || '📋'}</span>
                </div>

                {/* Map */}
                <div style={{ width: '100%', height: 208, margin: '14px 0', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.06)' }}>
                  <MapView
                    key={`${activeTask?.id || 'default'}-${activeTask?.pickup || ''}-${activeTask?.destination || ''}`}
                    pickup={activeTask?.pickup || null}
                    destination={activeTask?.destination || null}
                    taskId={activeTask?.id || 'default'}
                  />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', zIndex: 1000 }}>
                    <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>PENGAMBILAN</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>{activeTask?.pickup || '—'}</p>
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 10px', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', zIndex: 1000 }}>
                    <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>TUJUAN</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>{activeTask?.destination || '—'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  {/* Instruksi */}
                  <div style={{ flex: 1, background: '#eff6ff', borderLeft: '4px solid #2563eb', borderRadius: '0 10px 10px 0', padding: '12px 14px' }}>
                    <p style={{ fontSize: 10, color: '#2563eb', fontWeight: 700, margin: '0 0 4px', textTransform: 'uppercase' }}>INSTRUKSI / CATATAN</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, fontStyle: 'italic' }}>
                      "{activeTask?.instruksi || 'Tidak ada instruksi khusus tambahan dari pembuat tugas.'}"
                    </p>
                    {activeTask && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #bfdbfe', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 11, color: '#64748b' }}>
                        <span>📅 {activeTask.tanggal || '—'}</span>
                        <span>💰 {activeTask.biaya ? formatRupiah(activeTask.biaya) : '—'}</span>
                        <span>📦 {activeTask.kategori || '—'}</span>
                        <span>🔖 #{activeTask.id}</span>
                      </div>
                    )}
                  </div>

                  {/* Aksi */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
                    <button
                      onClick={() => { if (!activeTask) return; window.open(buildNavUrl(activeTask.pickup, activeTask.destination), '_blank', 'noopener,noreferrer') }}
                      disabled={!activeTask}
                      style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: activeTask ? 'pointer' : 'not-allowed', background: activeTask ? '#16a34a' : '#e2e8f0', color: activeTask ? '#fff' : '#94a3b8', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                    >
                      <span>▲</span>
                      <span>{activeTask ? 'Buka Navigasi' : 'Belum Ada Tugas'}</span>
                    </button>

                    {activeTask && (
                      <>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '8px 12px', fontSize: 13, fontWeight: 600, color: '#2563eb' }}>
                          <span>📷</span>
                          <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proofFile ? proofFile.name : 'Pilih Foto Bukti'}</span>
                          <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={e => { setProofFile(e.target.files[0] || null); setProofError('') }} />
                        </label>
                        {proofError && <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, margin: 0 }}>{proofError}</p>}
                        <button
                          disabled={proofLoading}
                          onClick={handleSelesai}
                          style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: proofLoading ? 'not-allowed' : 'pointer', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13, opacity: proofLoading ? 0.5 : 1, fontFamily: 'inherit' }}
                        >
                          {proofLoading ? '⏳ Mengirim...' : '✓ Kirim Bukti'}
                        </button>
                      </>
                    )}
                    {!activeTask && (
                      <button disabled style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 13, opacity: 0.35, cursor: 'not-allowed', fontFamily: 'inherit' }}>
                        ✓ Kirim Bukti
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Tersedia di Dekatmu ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Tersedia di Dekatmu</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={fetchAvailableTasks}
                    disabled={tasksLoading}
                    style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 12, cursor: tasksLoading ? 'not-allowed' : 'pointer', opacity: tasksLoading ? 0.5 : 1, fontFamily: 'inherit' }}
                  >
                    {tasksLoading ? '⏳' : '↻'}
                  </button>
                  <span style={{ padding: '4px 10px', borderRadius: 99, background: '#fff7ed', color: '#ea580c', fontSize: 11, fontWeight: 700 }}>
                    {availableTasks.length} TUGAS
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {tasksLoading && (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                    <div style={{ width: 28, height: 28, border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                    <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, margin: 0 }}>Memuat tugas...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </div>
                )}

                {!tasksLoading && tasksError && (
                  <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: '0 0 10px' }}>{tasksError}</p>
                    <button onClick={fetchAvailableTasks} style={{ padding: '6px 16px', background: '#fee2e2', border: 'none', borderRadius: 8, color: '#dc2626', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Muat Ulang</button>
                  </div>
                )}

                {!tasksLoading && !tasksError && availableTasks.length === 0 && (
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                    <p style={{ fontWeight: 700, color: '#94a3b8', fontSize: 13, margin: 0 }}>Belum ada tugas tersedia</p>
                    <p style={{ fontSize: 11, color: '#cbd5e1', margin: '4px 0 0' }}>Tugas baru akan muncul di sini</p>
                  </div>
                )}

                {!tasksLoading && !tasksError && availableTasks.slice(0, 3).map((task) => {
                  const ks = KAT_STYLE[task.kategori] || KAT_STYLE['Lainnya']
                  const hasLocation = !!(task.pickup || task.destination)
                  const isExpanded = expandedTaskId === task.id
                  return (
                    <div key={task.id} style={{ background: '#fff', border: `1px solid ${isExpanded ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: 14, padding: '14px 16px', boxShadow: isExpanded ? '0 2px 8px rgba(37,99,235,0.1)' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                          {task.icon || '📋'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {task.kategori && (
                            <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: ks.bg, color: ks.color, marginBottom: 3 }}>{task.kategori}</span>
                          )}
                          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.judul}</p>
                          {task.tanggal && <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>📅 {task.tanggal}</p>}
                          {hasLocation && (
                            <div style={{ marginTop: 4 }}>
                              {task.pickup && <div style={{ display: 'flex', gap: 4, fontSize: 11, color: '#64748b', alignItems: 'flex-start' }}><span style={{ color: '#16a34a', flexShrink: 0 }}>📍</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.pickup}</span></div>}
                              {task.destination && <div style={{ display: 'flex', gap: 4, fontSize: 11, color: '#64748b', alignItems: 'flex-start' }}><span style={{ color: '#dc2626', flexShrink: 0 }}>🏁</span><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.destination}</span></div>}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>{task.biaya ? formatRupiah(task.biaya) : '—'}</p>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {hasLocation && (
                              <button onClick={() => setExpandedTaskId(isExpanded ? null : task.id)} style={{ padding: '5px 8px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>🗺️</button>
                            )}
                            <button onClick={() => handleAmbilDariDashboard(task)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Ambil</button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && hasLocation && (
                        <div style={{ marginTop: 12 }}>
                          <MapPlaceholder pickup={task.pickup} destination={task.destination} height={160} />
                          <button onClick={() => window.open(buildNavUrl(task.pickup, task.destination), '_blank', 'noopener,noreferrer')} style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 10, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
                            ▲ Buka Navigasi Google Maps
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}

                <Link href="/mitra/semua-tugas" style={{ display: 'block', textAlign: 'center', border: '1.5px dashed #d1d5db', borderRadius: 12, padding: '12px', fontSize: 13, fontWeight: 600, color: '#64748b', textDecoration: 'none' }}>
                  Lihat Semua Tugas →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ background: '#fff', borderTop: '1px solid #e5e7eb', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>CALLZ</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>© 2026 CallZ Concierge. Built for Precision.</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Twitter', 'Instagram'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: '#64748b', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}