"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const KATEGORI_LIST = [
  { id: "ringan",  label: "Ringan",  extra: 0,     badge: "#2563EB" },
  { id: "sedang",  label: "Sedang",  extra: 5000,  badge: "#F59E0B" },
  { id: "berat",   label: "Berat",   extra: 15000, badge: "#EF4444" },
  { id: "khusus",  label: "Khusus",  extra: 25000, badge: "#7C3AED" },
];

const BASE_FEE = 20000;
const TARIF_PER_KM = 5000;

function fmt(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

// Database koordinat lokal (sama dengan yang dipakai di MapPlaceholder)
const LOCAL_POI_COORDS = {
  'duta mall': { lat: -3.3248, lon: 114.5911 },
  'duta mall banjarmasin': { lat: -3.3248, lon: 114.5911 },
  'siring': { lat: -3.3317, lon: 114.5925 },
  'menara pandang': { lat: -3.3320, lon: 114.5930 },
  'pasar lama': { lat: -3.3287, lon: 114.5897 },
  'pasar baru': { lat: -3.3254, lon: 114.5862 },
  'pasar sudimampir': { lat: -3.3260, lon: 114.5870 },
  'pasar antasari': { lat: -3.3195, lon: 114.5832 },
  'pasar sentra antasari': { lat: -3.3195, lon: 114.5832 },
  'rsud ulin': { lat: -3.3131, lon: 114.5818 },
  'rs ulin': { lat: -3.3131, lon: 114.5818 },
  'rumah sakit ulin': { lat: -3.3131, lon: 114.5818 },
  'rs sultan suriansyah': { lat: -3.2890, lon: 114.5651 },
  'rs bhayangkara': { lat: -3.3120, lon: 114.6020 },
  'rs islam': { lat: -3.3350, lon: 114.6100 },
  'banjarmasin trade center': { lat: -3.3190, lon: 114.5920 },
  'btc': { lat: -3.3190, lon: 114.5920 },
  'transmart': { lat: -3.3150, lon: 114.6050 },
  'ahmad yani': { lat: -3.3186, lon: 114.5944 },
  'jl ahmad yani': { lat: -3.3186, lon: 114.5944 },
  'lambung mangkurat': { lat: -3.3280, lon: 114.5900 },
  'pangeran antasari': { lat: -3.3195, lon: 114.5832 },
  'hasanuddin hm': { lat: -3.3120, lon: 114.5750 },
  'gatot subroto': { lat: -3.3050, lon: 114.5980 },
  'a yani km 1': { lat: -3.3180, lon: 114.5930 },
  'a yani km 2': { lat: -3.3150, lon: 114.5970 },
  'a yani km 3': { lat: -3.3120, lon: 114.6010 },
  'a yani km 4': { lat: -3.3090, lon: 114.6050 },
  'a yani km 5': { lat: -3.3060, lon: 114.6090 },
  'a yani km 6': { lat: -3.3020, lon: 114.6130 },
  'kayutangi': { lat: -3.3020, lon: 114.5810 },
  'uin antasari': { lat: -3.2990, lon: 114.5820 },
  'unlam': { lat: -3.2990, lon: 114.5820 },
  'ulm': { lat: -3.2990, lon: 114.5820 },
  'poliban': { lat: -3.2980, lon: 114.5900 },
  'banjarmasin utara': { lat: -3.2950, lon: 114.5900 },
  'banjarmasin barat': { lat: -3.3300, lon: 114.5700 },
  'banjarmasin timur': { lat: -3.3200, lon: 114.6100 },
  'banjarmasin selatan': { lat: -3.3500, lon: 114.5900 },
  'banjarmasin tengah': { lat: -3.3250, lon: 114.5900 },
  'pekauman': { lat: -3.3400, lon: 114.5850 },
  'kuin': { lat: -3.3100, lon: 114.5680 },
  'kelayan': { lat: -3.3500, lon: 114.5800 },
  'mantuil': { lat: -3.3700, lon: 114.5850 },
  'pemurus': { lat: -3.3600, lon: 114.6000 },
  'pemurus baru': { lat: -3.3580, lon: 114.5980 },
  'landasan ulin': { lat: -3.4420, lon: 114.7580 },
  'banjarbaru': { lat: -3.4417, lon: 114.8275 },
  'martapura': { lat: -3.4122, lon: 114.8640 },
  'gambut': { lat: -3.4010, lon: 114.7330 },
  'kertak hanyar': { lat: -3.3880, lon: 114.6750 },
  'terminal km 6': { lat: -3.3020, lon: 114.6130 },
  'bandara syamsudin noor': { lat: -3.4424, lon: 114.7630 },
  'pelabuhan trisakti': { lat: -3.3120, lon: 114.5620 },
  'masjid raya sabilal muhtadin': { lat: -3.3315, lon: 114.5910 },
  'masjid raya': { lat: -3.3315, lon: 114.5910 },
  'sabilal muhtadin': { lat: -3.3315, lon: 114.5910 },
  'taman siring': { lat: -3.3317, lon: 114.5925 },
  'q mall': { lat: -3.3190, lon: 114.6080 },
  'big mall': { lat: -3.3190, lon: 114.6080 },
  'mall ratu indah': { lat: -3.3248, lon: 114.5911 },
};

// Haversine formula — menghitung jarak garis lurus antar dua koordinat (km)
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Cari koordinat dari nama lokasi di database lokal
function cariKoordinat(addr) {
  if (!addr) return null;
  const key = addr.toLowerCase().trim().replace(/\s+/g, ' ');
  for (const [k, coords] of Object.entries(LOCAL_POI_COORDS)) {
    if (key.includes(k) || k.includes(key)) return coords;
  }
  return null;
}

function hitungSimulasiJarak(pickup, destination) {
  if (!pickup || !destination) return 0;
  const coordA = cariKoordinat(pickup);
  const coordB = cariKoordinat(destination);
  if (coordA && coordB) {
    // Jarak nyata × 1.3 sebagai faktor koreksi rute jalan (tidak lurus)
    const jarakLurus = haversineKm(coordA.lat, coordA.lon, coordB.lat, coordB.lon);
    return Math.max(1, Math.round(jarakLurus * 1.3));
  }
  // Fallback jika lokasi tidak dikenali: estimasi 3 km
  return 3;
}

function Stepper({ step }) {
  const steps = [1, 2, 3, 4];
  const labels = ["Lokasi", "Detail", "Instruksi", "Bayar"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32, justifyContent: "center" }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: step >= s ? "#2563EB" : "#E2E8F0",
              color: step >= s ? "#fff" : "#94A3B8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              border: step === s ? "2px solid #2563EB" : "none",
              boxSizing: "border-box",
            }}>{s}</div>
            <span style={{ fontSize: 10, fontWeight: 600, color: step >= s ? "#2563EB" : "#94A3B8", whiteSpace: "nowrap" }}>{labels[i]}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 48, height: 2, background: step > s ? "#2563EB" : "#E2E8F0", marginBottom: 14 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── MapView: Leaflet + Nominatim geocoding + OSRM real route ──
function MapPlaceholder({ pickup, destination, onJarakUpdate }) {
  const mapRef = useRef(null)
  const instanceRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const hasData = !!(pickup || destination)

  // Safe destroy: stop animation sebelum remove agar tidak muncul _leaflet_pos error
  const destroyMap = () => {
    if (!instanceRef.current) return
    try {
      const m = instanceRef.current
      instanceRef.current = null
      if (m._mapPane) m._mapPane.style.transition = 'none'
      m.remove()
    } catch (_) {}
  }

  useEffect(() => {
    destroyMap()
    if (!hasData || !mapRef.current) { setStatus('idle'); return }

    let isMounted = true
    setStatus('loading')

    const init = async () => {
      if (!document.getElementById('leaflet-css-tugas')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css-tugas'
        link.rel = 'stylesheet'
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

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        // Matikan animasi zoom — sumber utama _leaflet_pos crash saat unmount
        zoomAnimation: false,
        fadeAnimation: false,
        markerZoomAnimation: false,
      }).setView([-3.3186, 114.5944], 13)
      instanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const geocode = async (addr) => {
        // ── 1. Database lokal tempat-tempat Banjarmasin ──
        const LOCAL_POI = {
          'duta mall': { lat: -3.3248, lon: 114.5911 },
          'duta mall banjarmasin': { lat: -3.3248, lon: 114.5911 },
          'siring': { lat: -3.3317, lon: 114.5925 },
          'siring banjarmasin': { lat: -3.3317, lon: 114.5925 },
          'siring duta mall': { lat: -3.3248, lon: 114.5911 },
          'menara pandang': { lat: -3.3320, lon: 114.5930 },
          'pasar lama': { lat: -3.3287, lon: 114.5897 },
          'pasar baru': { lat: -3.3254, lon: 114.5862 },
          'pasar sudimampir': { lat: -3.3260, lon: 114.5870 },
          'pasar antasari': { lat: -3.3195, lon: 114.5832 },
          'pasar sentra antasari': { lat: -3.3195, lon: 114.5832 },
          'rsud ulin': { lat: -3.3131, lon: 114.5818 },
          'rs ulin': { lat: -3.3131, lon: 114.5818 },
          'rumah sakit ulin': { lat: -3.3131, lon: 114.5818 },
          'rs sultan suriansyah': { lat: -3.2890, lon: 114.5651 },
          'rs bhayangkara': { lat: -3.3120, lon: 114.6020 },
          'rs islam': { lat: -3.3350, lon: 114.6100 },
          'puskesmas pekauman': { lat: -3.3350, lon: 114.5870 },
          'banjarmasin trade center': { lat: -3.3190, lon: 114.5920 },
          'btc': { lat: -3.3190, lon: 114.5920 },
          'mitra plaza': { lat: -3.3230, lon: 114.5880 },
          'hero supermarket': { lat: -3.3240, lon: 114.5900 },
          'transmart': { lat: -3.3150, lon: 114.6050 },
          'hypermart': { lat: -3.3248, lon: 114.5911 },
          'lippo plaza': { lat: -3.3248, lon: 114.5911 },
          'ahmad yani': { lat: -3.3186, lon: 114.5944 },
          'jl ahmad yani': { lat: -3.3186, lon: 114.5944 },
          'jalan ahmad yani': { lat: -3.3186, lon: 114.5944 },
          'lambung mangkurat': { lat: -3.3280, lon: 114.5900 },
          'jl lambung mangkurat': { lat: -3.3280, lon: 114.5900 },
          'pangeran antasari': { lat: -3.3195, lon: 114.5832 },
          'jl pangeran antasari': { lat: -3.3195, lon: 114.5832 },
          'hasanuddin hm': { lat: -3.3120, lon: 114.5750 },
          'jl hasanuddin': { lat: -3.3120, lon: 114.5750 },
          'gatot subroto': { lat: -3.3050, lon: 114.5980 },
          'jl gatot subroto': { lat: -3.3050, lon: 114.5980 },
          'a yani km 1': { lat: -3.3180, lon: 114.5930 },
          'a yani km 2': { lat: -3.3150, lon: 114.5970 },
          'a yani km 3': { lat: -3.3120, lon: 114.6010 },
          'a yani km 4': { lat: -3.3090, lon: 114.6050 },
          'a yani km 5': { lat: -3.3060, lon: 114.6090 },
          'a yani km 6': { lat: -3.3020, lon: 114.6130 },
          'kayutangi': { lat: -3.3020, lon: 114.5810 },
          'kayu tangi': { lat: -3.3020, lon: 114.5810 },
          'uin antasari': { lat: -3.2990, lon: 114.5820 },
          'unlam': { lat: -3.2990, lon: 114.5820 },
          'ulm': { lat: -3.2990, lon: 114.5820 },
          'universitas lambung mangkurat': { lat: -3.2990, lon: 114.5820 },
          'poliban': { lat: -3.2980, lon: 114.5900 },
          'banjarmasin utara': { lat: -3.2950, lon: 114.5900 },
          'banjarmasin barat': { lat: -3.3300, lon: 114.5700 },
          'banjarmasin timur': { lat: -3.3200, lon: 114.6100 },
          'banjarmasin selatan': { lat: -3.3500, lon: 114.5900 },
          'banjarmasin tengah': { lat: -3.3250, lon: 114.5900 },
          'pekauman': { lat: -3.3400, lon: 114.5850 },
          'kuin': { lat: -3.3100, lon: 114.5680 },
          'kelayan': { lat: -3.3500, lon: 114.5800 },
          'mantuil': { lat: -3.3700, lon: 114.5850 },
          'pemurus': { lat: -3.3600, lon: 114.6000 },
          'pemurus baru': { lat: -3.3580, lon: 114.5980 },
          'landasan ulin': { lat: -3.4420, lon: 114.7580 },
          'banjarbaru': { lat: -3.4417, lon: 114.8275 },
          'martapura': { lat: -3.4122, lon: 114.8640 },
          'gambut': { lat: -3.4010, lon: 114.7330 },
          'kertak hanyar': { lat: -3.3880, lon: 114.6750 },
          'terminal km 6': { lat: -3.3020, lon: 114.6130 },
          'terminal antasari': { lat: -3.3195, lon: 114.5832 },
          'bandara syamsudin noor': { lat: -3.4424, lon: 114.7630 },
          'pelabuhan trisakti': { lat: -3.3120, lon: 114.5620 },
          'masjid raya sabilal muhtadin': { lat: -3.3315, lon: 114.5910 },
          'masjid raya': { lat: -3.3315, lon: 114.5910 },
          'sabilal muhtadin': { lat: -3.3315, lon: 114.5910 },
          'taman siring': { lat: -3.3317, lon: 114.5925 },
          'taman maskot': { lat: -3.3200, lon: 114.6000 },
          'stadion 17 mei': { lat: -3.3100, lon: 114.5950 },
          'gedung paman birin': { lat: -3.3250, lon: 114.5850 },
          'kantor gubernur': { lat: -3.3250, lon: 114.5850 },
          'balai kota': { lat: -3.3270, lon: 114.5860 },
          'mall ratu indah': { lat: -3.3248, lon: 114.5911 },
          'q mall': { lat: -3.3190, lon: 114.6080 },
          'big mall': { lat: -3.3190, lon: 114.6080 },
        }

        // Cek database lokal dulu (case-insensitive, strip spasi ekstra)
        const key = addr.toLowerCase().trim()
          .replace(/^(jl\.|jalan|jl)\s+/, 'jl ')
          .replace(/\s+/g, ' ')
        for (const [k, coords] of Object.entries(LOCAL_POI)) {
          if (key.includes(k) || k.includes(key)) return coords
        }

        // ── 2. Fallback ke Nominatim dengan multiple query ──
        const queries = [
          addr + ', Banjarmasin, Kalimantan Selatan, Indonesia',
          addr + ', Banjarmasin, Indonesia',
          addr + ', Kalimantan Selatan, Indonesia',
          addr + ', Indonesia',
        ]
        for (const q of queries) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&countrycodes=id`,
              { headers: { 'Accept-Language': 'id' } }
            )
            const data = await res.json()
            if (data?.[0]) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
          } catch {}
        }
        return null
      }

      const [pickupCoords, destCoords] = await Promise.all([
        pickup ? geocode(pickup) : Promise.resolve(null),
        destination ? geocode(destination) : Promise.resolve(null),
      ])

      if (!isMounted || !instanceRef.current) return

      const greenIcon = L.divIcon({
        html: `<div style="position:relative;width:32px;height:40px;"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #16a34a;"></div><div style="background:#16a34a;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.35);">📍</div></div>`,
        iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -40], className: ''
      })
      const redIcon = L.divIcon({
        html: `<div style="position:relative;width:32px;height:40px;"><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:10px solid #dc2626;"></div><div style="background:#dc2626;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:3px solid white;box-shadow:0 3px 8px rgba(0,0,0,0.35);">🏁</div></div>`,
        iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -40], className: ''
      })

      if (pickupCoords) L.marker([pickupCoords.lat, pickupCoords.lon], { icon: greenIcon }).addTo(map).bindPopup(`<b>📍 Penjemputan</b><br/>${pickup}`)
      if (destCoords) L.marker([destCoords.lat, destCoords.lon], { icon: redIcon }).addTo(map).bindPopup(`<b>🏁 Tujuan</b><br/>${destination}`)

      if (pickupCoords && destCoords) {
        try {
          const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lon},${pickupCoords.lat};${destCoords.lon},${destCoords.lat}?overview=full&geometries=geojson`
          const routeRes = await fetch(osrmUrl)
          const routeData = await routeRes.json()
          if (!isMounted || !instanceRef.current) return

          if (routeData.code === 'Ok' && routeData.routes?.[0]) {
            const coords = routeData.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon])
            const routeLine = L.polyline(coords, { color: '#2563eb', weight: 5, opacity: 0.85 }).addTo(map)
            map.fitBounds(routeLine.getBounds(), { padding: [30, 30] })

            const dist = (routeData.routes[0].distance / 1000).toFixed(1)
            const dur = Math.round(routeData.routes[0].duration / 60)

            // ── Kirim jarak OSRM nyata ke parent untuk hitung ongkir ──
            if (onJarakUpdate) onJarakUpdate(parseFloat(dist))

            const infoBox = L.control({ position: 'bottomleft' })
            infoBox.onAdd = () => {
              const div = L.DomUtil.create('div')
              div.innerHTML = `<div style="background:white;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.2);color:#1e40af;">🛣️ ${dist} km &nbsp;·&nbsp; ⏱ ~${dur} menit</div>`
              return div
            }
            infoBox.addTo(map)
          } else {
            L.polyline([[pickupCoords.lat, pickupCoords.lon], [destCoords.lat, destCoords.lon]], { color: '#2563eb', weight: 4, dashArray: '8,5', opacity: 0.7 }).addTo(map)
            map.fitBounds(L.latLngBounds([[pickupCoords.lat, pickupCoords.lon], [destCoords.lat, destCoords.lon]]), { padding: [30, 30] })
          }
        } catch {
          L.polyline([[pickupCoords.lat, pickupCoords.lon], [destCoords.lat, destCoords.lon]], { color: '#2563eb', weight: 4, dashArray: '8,5', opacity: 0.7 }).addTo(instanceRef.current)
          instanceRef.current.fitBounds(L.latLngBounds([[pickupCoords.lat, pickupCoords.lon], [destCoords.lat, destCoords.lon]]), { padding: [30, 30] })
        }
      } else if (pickupCoords) {
        map.setView([pickupCoords.lat, pickupCoords.lon], 15)
      } else if (destCoords) {
        map.setView([destCoords.lat, destCoords.lon], 15)
      }

      if (isMounted) setStatus('ready')
    }

    init().catch(() => { if (isMounted) setStatus('error') })

    return () => {
      isMounted = false
      destroyMap()
    }
  }, [pickup, destination])

  return (
    <div style={{ borderRadius: 12, height: "100%", minHeight: 280, position: "relative", overflow: "hidden", border: "1px solid #E2E8F0" }}>
      {/* Placeholder saat belum ada input */}
      {!hasData && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFF", gap: 8, zIndex: 10 }}>
          <span style={{ fontSize: 32 }}>🗺️</span>
          <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Masukkan lokasi asal &amp; tujuan...</span>
        </div>
      )}
      {/* Loading spinner */}
      {status === 'loading' && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(248,250,252,0.85)", zIndex: 9999, gap: 8 }}>
          <div style={{ width: 28, height: 28, border: "3px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Memuat rute...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
      {/* Status bar bawah */}
      {status === 'ready' && (
        <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.95)", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, color: "#0F172A", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", pointerEvents: "none", zIndex: 10 }}>
          🗺️ Rute perjalanan aktif!
        </div>
      )}
      <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: 280 }} />
    </div>
  )
}

function CostSummary({ data }) {
  if (!data.jenisPaket) {
    return (
      <div style={{ background: "#F8FAFF", border: "1.5px dashed #CBD5E1", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 200 }}>
        <span style={{ fontSize: 32, marginBottom: 12 }}>📦</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>Harga Belum Tersedia</span>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, maxWidth: 220 }}>
          Silakan pilih <strong>Jenis Paket</strong> terlebih dahulu pada langkah berikutnya untuk memunculkan rincian biaya pengiriman.
        </p>
      </div>
    );
  }

  const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
  // Pakai jarak OSRM nyata jika sudah tersedia, fallback ke Haversine
  const jarak = data.jarakOSRM != null ? data.jarakOSRM : hitungSimulasiJarak(data.pickup, data.destination);
  const jarakLabel = data.jarakOSRM != null ? jarak.toFixed(1) : jarak;
  const biayaJarak = Math.round(jarak * TARIF_PER_KM);
  const total = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

  return (
    <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>RINGKASAN BIAYA</span>
        <span style={{ fontSize: 12, background: "#E0F2FE", color: "#0369A1", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>{data.jenisPaket.toUpperCase()}</span>
      </div>
      <Row label="Biaya Layanan Dasar" value={fmt(BASE_FEE)} />
      <Row label="Kategori Kerja" value={`+${fmt(kat.extra)}`} badge={kat.label} badgeColor={kat.badge} valueColor={kat.extra > 0 ? "#EF4444" : "#0F172A"} />
      <Row
        label={`Ongkir Jarak (${jarakLabel} km${data.jarakOSRM != null ? ' · rute nyata' : ' · estimasi'})`}
        value={`+${fmt(biayaJarak)}`}
        valueColor="#10B981"
      />
      <Row label="Biaya Tambahan (Tips)" value={`+${fmt(data.extraFee)}`} />
      
      <div style={{ borderTop: "1px solid #F1F5F9", marginTop: 14, paddingTop: 14 }}>
        <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: 0.4, marginBottom: 4 }}>TOTAL ESTIMASI BIAYA</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#2563EB", letterSpacing: -0.5 }}>{fmt(total)}</span>
          <span style={{ fontSize: 11, color: "#94A3B8", maxWidth: 120, textAlign: "right", lineHeight: 1.4 }}>
            {data.jarakOSRM != null ? "Tarif berdasarkan rute jalan OSRM." : "Menunggu konfirmasi rute dari peta."}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, badge, badgeColor, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "#475569" }}>{label}</span>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: badgeColor + "22", color: badgeColor, textTransform: "uppercase" }}>{badge}</span>
        )}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: valueColor || "#0F172A" }}>{value}</span>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function NavBar({ onBack, onNext, nextLabel, nextDisabled, backLabel }) {
  return (
    <div style={{ display: "flex", justifyContent: onBack ? "space-between" : "flex-end", marginTop: 28, paddingTop: 20, borderTop: "1px solid #F1F5F9", gap: 12 }}>
      {onBack && (
        <button onClick={onBack} style={btnOutlineStyle}>{backLabel || "← Kembali"}</button>
      )}
      <button onClick={onNext} disabled={nextDisabled} style={{ ...btnPrimaryStyle, opacity: nextDisabled ? 0.5 : 1, cursor: nextDisabled ? "not-allowed" : "pointer" }}>
        {nextLabel || "Lanjut →"}
      </button>
    </div>
  );
}

function StepLokasi({ data, setData, onNext }) {
  const ok = data.pickup && data.destination;
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Buat Tugas</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 1 : Tentukan lokasi penjemputan dan tujuan</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Alamat Penjemputan" required>
            <input style={inputStyle} placeholder="Contoh: Duta Mall Banjarmasin" value={data.pickup} onChange={e => setData(p => ({ ...p, pickup: e.target.value, jarakOSRM: null }))} />
          </FormField>
          <FormField label="Alamat Tujuan" required>
            <input style={inputStyle} placeholder="Contoh: Menara Pandang Banjarmasin" value={data.destination} onChange={e => setData(p => ({ ...p, destination: e.target.value, jarakOSRM: null }))} />
          </FormField>
          <FormField label="Catatan Lokasi">
            <input style={inputStyle} placeholder="Patokan, lantai, nomor gedung..." value={data.locationNote} onChange={e => setData(p => ({ ...p, locationNote: e.target.value }))} />
          </FormField>
        </div>
        <MapPlaceholder
          pickup={data.pickup}
          destination={data.destination}
          onJarakUpdate={km => setData(p => ({ ...p, jarakOSRM: km }))}
        />
      </div>
      <NavBar onBack={null} onNext={onNext} nextDisabled={!ok} nextLabel="Lanjut ke Detail →" />
    </div>
  );
}

function StepDetail({ data, setData, onBack, onNext }) {
  const ok = data.judulTugas && data.telepon && data.jenisPaket;
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Buat Tugas</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 2 : Lengkapi informasi paket dan penerima</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Judul Tugas" required>
            <input style={inputStyle} placeholder="misalnya, Pencarian Dokumen Cepat" value={data.judulTugas} onChange={e => setData(p => ({ ...p, judulTugas: e.target.value }))} />
          </FormField>
          <FormField label="Jenis Paket" required>
            <select style={{ ...inputStyle, backgroundImage: chevron, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", appearance: "none" }} value={data.jenisPaket} onChange={e => setData(p => ({ ...p, jenisPaket: e.target.value }))}>
              <option value="">-- Pilih Jenis Paket --</option>
              <option value="Belanja">Belanja</option>
              <option value="Dokumen">Dokumen</option>
              <option value="Paket">Paket</option>
              <option value="Antre">Antre</option>
            </select>
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Nama Penerima">
              <input style={inputStyle} placeholder="Nama lengkap" value={data.namaPenerima} onChange={e => setData(p => ({ ...p, namaPenerima: e.target.value }))} />
            </FormField>
            <FormField label="Telepon Penerima" required>
              <input style={inputStyle} placeholder="+62 8xx-xxxx-xxxx" value={data.telepon} onChange={e => setData(p => ({ ...p, telepon: e.target.value }))} />
            </FormField>
          </div>
        </div>
        <CostSummary data={data} />
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextDisabled={!ok} nextLabel="Lanjut ke Instruksi →" />
    </div>
  );
}

function StepInstruksi({ data, setData, onBack, onSubmit, loading }) {
  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Buat Tugas</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 3 : Uraikan tugas dan detail instruksi</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Judul Tugas">
            <input style={{ ...inputStyle, background: "#F8FAFF" }} value={data.judulTugas} disabled />
          </FormField>
          <FormField label="Detail Instruksi">
            <textarea style={{ ...inputStyle, minHeight: 96, resize: "vertical" }} placeholder="Sebutkan lokasi tertentu, nama kontak, atau persyaratan khusus..." value={data.instruksi} onChange={e => setData(p => ({ ...p, instruksi: e.target.value }))} />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Kategori Pekerjaan">
              <select style={{ ...inputStyle, backgroundImage: chevron, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", appearance: "none" }} value={data.kategori} onChange={e => setData(p => ({ ...p, kategori: e.target.value }))}>
                {KATEGORI_LIST.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
              </select>
            </FormField>
            <FormField label="Telepon Penerima">
              <input style={{ ...inputStyle, background: "#F8FAFF" }} value={data.telepon} disabled />
            </FormField>
          </div>
          <FormField label="Biaya Tambahan (Tips Opsional)">
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
              {[0, 2000, 5000, 10000, 20000].map(nominal => (
                <button
                  key={nominal}
                  type="button"
                  onClick={() => setData(p => ({ ...p, extraFee: nominal }))}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 20,
                    border: data.extraFee === nominal ? "2px solid #2563EB" : "1.5px solid #E2E8F0",
                    background: data.extraFee === nominal ? "#EFF6FF" : "white",
                    color: data.extraFee === nominal ? "#2563EB" : "#475569",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {nominal === 0 ? "Tidak" : fmt(nominal)}
                </button>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                fontSize: 14, color: "#94A3B8", fontWeight: 600, pointerEvents: "none",
              }}>Rp</span>
              <input
                style={{ ...inputStyle, paddingLeft: 36 }}
                placeholder="0"
                inputMode="numeric"
                value={data.extraFee === 0 ? "" : data.extraFee.toLocaleString("id-ID")}
                onChange={e => {
                  const raw = e.target.value.replace(/\./g, "").replace(/\D/g, "");
                  const num = parseInt(raw) || 0;
                  setData(p => ({ ...p, extraFee: num }));
                }}
              />
            </div>
            {data.extraFee > 0 && (
              <p style={{ fontSize: 11, color: "#10B981", fontWeight: 600, marginTop: 4 }}>
                ✓ Tips {fmt(data.extraFee)} akan ditambahkan ke total
              </p>
            )}
          </FormField>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <MapPlaceholder
            pickup={data.pickup}
            destination={data.destination}
            onJarakUpdate={km => setData(p => ({ ...p, jarakOSRM: km }))}
          />
          <CostSummary data={data} />
        </div>
      </div>
      <NavBar onBack={onBack} onNext={onSubmit} nextLabel={loading ? "Memproses..." : "Lanjut ke Pembayaran →"} nextDisabled={loading} backLabel="← Kembali ke Map" />
    </div>
  );
}

// CALLZ GoPay number — ganti sesuai nomor GoPay merchant
const GOPAY_NUMBER = "0812-3456-7890";
const GOPAY_NAME   = "CallZ Concierge";

function StepPembayaran({ data, onBack, onSubmit, loading }) {
  const [paid, setPaid] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
  // Pakai jarak OSRM nyata jika tersedia, fallback ke Haversine
  const jarak = data.jarakOSRM != null ? data.jarakOSRM : hitungSimulasiJarak(data.pickup, data.destination);
  const jarakLabel = data.jarakOSRM != null ? parseFloat(jarak).toFixed(1) : jarak;
  const biayaJarak = Math.round(jarak * TARIF_PER_KM);
  const total = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

  const handlePay = () => {
    setPaid(true);
    setTimeout(() => { setConfirmed(true); setTimeout(() => onSubmit(), 900); }, 1600);
  };

  // ── QR Code simulasi GoPay ──
  const qrSize = 180;
  const qrCells = 21;
  const cellSize = qrSize / qrCells;
  function fakeQR(i, j) {
    const inTopLeft     = i < 7 && j < 7;
    const inTopRight    = i < 7 && j >= qrCells - 7;
    const inBottomLeft  = i >= qrCells - 7 && j < 7;
    if (inTopLeft || inTopRight || inBottomLeft) {
      const ri = inTopRight  ? i     : inBottomLeft ? i - (qrCells - 7) : i;
      const rj = inTopRight  ? j - (qrCells - 7) : j;
      const isOuter = ri === 0 || ri === 6 || rj === 0 || rj === 6;
      const isInner = ri >= 2 && ri <= 4 && rj >= 2 && rj <= 4;
      return isOuter || isInner ? "#2563EB" : "white";
    }
    // timing pattern
    if ((i === 6 && j > 7 && j < qrCells - 7) || (j === 6 && i > 7 && i < qrCells - 7)) {
      return (i + j) % 2 === 0 ? "#2563EB" : "white";
    }
    const seed = ((i * 53 + j * 29) ^ (i * 7 + j)) % 11;
    return seed < 5 ? "#2563EB" : "white";
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Pembayaran GoPay</h1>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Langkah 4 : Scan QR atau transfer ke nomor GoPay CallZ</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* KIRI — QR + nomor GoPay */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Header branding */}
          <div style={{ background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", borderRadius: 14, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: "white", margin: 0, letterSpacing: -0.5 }}>GoPay</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>Total tagihan</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: "white", margin: 0 }}>{fmt(total)}</p>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ background: "white", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 16 }}>Scan QR Code ini</p>
            <div style={{ display: "inline-block", padding: 12, background: "white", border: "3px solid #2563EB", borderRadius: 12, marginBottom: 14, boxShadow: "0 4px 20px rgba(37,99,235,0.15)" }}>
              <svg width={qrSize} height={qrSize} style={{ display: "block" }}>
                {/* white background */}
                <rect width={qrSize} height={qrSize} fill="white" />
                {Array.from({ length: qrCells }).map((_, i) =>
                  Array.from({ length: qrCells }).map((_, j) => {
                    const fill = fakeQR(i, j);
                    return (
                      <rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill={fill} />
                    );
                  })
                )}
                {/* Center GoPay logo overlay */}
                <rect x={qrSize/2 - 18} y={qrSize/2 - 18} width={36} height={36} rx={6} fill="white" />
                <rect x={qrSize/2 - 14} y={qrSize/2 - 14} width={28} height={28} rx={4} fill="#2563EB" />
                <text x={qrSize/2} y={qrSize/2 + 5} textAnchor="middle" fill="white" fontSize={14} fontWeight="bold">G</text>
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 4px" }}>Buka app <strong>Gojek</strong> → GoPay → Scan</p>
            <p style={{ fontSize: 11, color: "#94A3B8" }}>QR berlaku 15 menit · Jangan tutup halaman ini</p>
          </div>

          {/* Nomor GoPay untuk transfer manual */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14 }}>Atau Transfer ke Nomor GoPay</p>
            <div style={{ background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 11, color: "#2563EB", fontWeight: 600, margin: "0 0 2px" }}>{GOPAY_NAME}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", letterSpacing: 1, margin: 0 }}>{GOPAY_NUMBER}</p>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(GOPAY_NUMBER.replace(/\D/g,"")); }}
                style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #BFDBFE", background: "white", color: "#2563EB", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
              >
                Salin
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>
              Kirim tepat <strong style={{ color: "#0F172A" }}>{fmt(total)}</strong> ke nomor di atas. Tulis nama kamu sebagai catatan transfer.
            </p>
          </div>
        </div>

        {/* KANAN — ringkasan + konfirmasi */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Ringkasan biaya */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 22 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Ringkasan Pesanan</p>
            <Row label="Layanan Dasar"             value={fmt(BASE_FEE)} />
            <Row label={`Kategori (${kat.label})`} value={`+${fmt(kat.extra)}`} />
            <Row label={`Ongkir (${jarakLabel} km)`}    value={`+${fmt(biayaJarak)}`} valueColor="#10B981" />
            <Row label="Tips"                       value={`+${fmt(data.extraFee)}`} />
            <div style={{ borderTop: "1.5px solid #F1F5F9", marginTop: 12, paddingTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Total Pembayaran</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#2563EB" }}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Info tugas */}
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 14, padding: 22 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Detail Tugas</p>
            <Row label="Judul"    value={data.judulTugas || "—"} />
            <Row label="Paket"    value={data.jenisPaket || "—"} />
            <Row label="Dari"     value={data.pickup || "—"} />
            <Row label="Ke"       value={data.destination || "—"} />
            <Row label="Penerima" value={data.telepon || "—"} />
          </div>

          {/* Instruksi langkah */}
          <div style={{ background: "#F8FAFF", border: "1.5px dashed #93C5FD", borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 10 }}>📋 Cara Bayar</p>
            {[
              "Scan QR di kiri atau buka GoPay",
              `Transfer tepat ${fmt(total)} ke ${GOPAY_NUMBER}`,
              'Klik "Sudah Bayar" di bawah',
              "Mitra akan segera dikonfirmasi",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 3 ? 8 : 0, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#2563EB", color: "white", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tombol konfirmasi */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
        <button onClick={onBack} style={btnOutlineStyle}>← Kembali ke Instruksi</button>
        <button
          onClick={handlePay}
          disabled={paid || loading}
          style={{
            ...btnPrimaryStyle,
            background: confirmed ? "#10B981" : "#2563EB",
            opacity: paid && !confirmed ? 0.7 : 1,
            cursor: paid ? "not-allowed" : "pointer",
            gap: 8, minWidth: 220, justifyContent: "center",
            transition: "background 0.3s",
          }}
        >
          {confirmed ? "✓ Pembayaran Dikonfirmasi!" : paid ? "⏳ Memverifikasi..." : "✅ Sudah Bayar via GoPay"}
        </button>
      </div>
    </div>
  );
}

function SuccessView({ generatedData, onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Tugas Berhasil Dibuat!</h2>
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32 }}>
        Kami sedang mencarikan kurir terdekat untuk tugas <strong>{generatedData.judul}</strong>
      </p>
      <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: 24, maxWidth: 400, margin: "0 auto 32px", textAlign: "left" }}>
        <Row label="ID Tugas" value={generatedData.id} />
        <Row label="Judul" value={generatedData.judul} />
        <Row label="Kurir" value={generatedData.kurir} />
        <Row label="Jarak Estimasi" value={generatedData.jarakKm + " km"} />
        <Row label="Durasi Estimasi" value={generatedData.durasi} />
        <Row label="Kategori" value={generatedData.kategori} />
        <Row label="Status" value={generatedData.status} valueColor="#F59E0B" />
        <Row label="Total Biaya" value={fmt(generatedData.biaya)} valueColor="#2563EB" />
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/dashboard/riwayat" style={btnOutlineStyle}>← Lihat di Riwayat</Link>
        <button onClick={onReset} style={btnPrimaryStyle}>+ Buat Tugas Baru</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px",
  border: "1.5px solid #E2E8F0", borderRadius: 8,
  fontSize: 14, fontFamily: "inherit", color: "#0F172A",
  background: "white", outline: "none", boxSizing: "border-box",
};

const btnPrimaryStyle = {
  padding: "11px 24px", background: "#2563EB", color: "white",
  border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit", textDecoration: "none",
  display: "inline-flex", alignItems: "center",
};

const btnOutlineStyle = {
  padding: "11px 24px", background: "transparent", color: "#2563EB",
  border: "1.5px solid #2563EB", borderRadius: 8, fontSize: 14, fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit", textDecoration: "none",
  display: "inline-flex", alignItems: "center",
};

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`;

export default function TugasPage() {
  const [step, setStep]    = useState(1);
  const [done, setDone]    = useState(false);
  const [loading, setLoad] = useState(false);
  const [data, setData]    = useState({
    pickup: "", destination: "", locationNote: "",
    judulTugas: "", instruksi: "", jenisPaket: "", 
    namaPenerima: "", telepon: "", kategori: "ringan", extraFee: 0,
    jarakOSRM: null,
  });
  const [lastSavedTask, setLastSavedTask] = useState(null);

  const handleSubmit = async () => {
    setLoad(true);

    const kat = KATEGORI_LIST.find(k => k.id === data.kategori) || KATEGORI_LIST[0];
    const jarak = data.jarakOSRM != null ? data.jarakOSRM : hitungSimulasiJarak(data.pickup, data.destination);
    const biayaJarak = Math.round(jarak * TARIF_PER_KM);
    const totalBiaya = BASE_FEE + kat.extra + biayaJarak + data.extraFee;

    const PAKET_ID = { Belanja: 1, Dokumen: 2, Paket: 3, Antre: 4 };
    const KATEGORI_ID = { ringan: 1, sedang: 2, berat: 3, khusus: 4 };

    const coordPickup = cariKoordinat(data.pickup) || { lat: 0, lon: 0 };
    const coordDest   = cariKoordinat(data.destination) || { lat: 0, lon: 0 };

    const payload = {

      package_category_id:    PAKET_ID[data.jenisPaket] ?? 3,
      job_category_id:        KATEGORI_ID[data.kategori] ?? 1,
      pickup_address:         data.pickup,
      pickup_latitude:        coordPickup.lat,
      pickup_longitude:       coordPickup.lon,
      destination_address:    data.destination,
      destination_latitude:   coordDest.lat,
      destination_longitude:  coordDest.lon,

      title:                  data.judulTugas,
      instruction_detail:     data.instruksi || "",
      receiver_name:          data.namaPenerima || "",
      receiver_phone:         data.telepon,

      base_fee:               BASE_FEE,
      job_category_fee:       kat.extra,
      distance_km:            parseFloat(jarak),
      distance_fee:           biayaJarak,
      tips_fee:               data.extraFee,
      discount:               0,
      total_estimated_fee:    totalBiaya,
    };

    let token = null;
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("mitra_user");
      if (raw) {
        const p = JSON.parse(raw);
        token = p.token || p.access_token || null;
      }
    } catch (_) {}
    if (!token) token = localStorage.getItem("token") || localStorage.getItem("mitra_token");

    try {

      console.log("[CallZ] POST /api/tasks payload:", JSON.stringify(payload, null, 2));
      console.log("[CallZ] Token tersedia:", !!token);

      const res = await fetch("https://generous-awake-serval.ngrok-free.app/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",          
          "ngrok-skip-browser-warning": "true",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text().catch(() => "");
      let resData = {};
      try { resData = JSON.parse(rawText); } catch (_) {}

      if (!res.ok) {
        console.error("Gagal membuat tugas [" + res.status + "]:", rawText);
        alert(resData?.message || `Gagal membuat tugas (HTTP ${res.status}). Coba lagi.`);
        setLoad(false);
        return;
      }

      const menitPerjalanan = Math.round((jarak / 30) * 60);
      const durasiLabel = menitPerjalanan < 60
        ? `${menitPerjalanan} menit`
        : `${Math.floor(menitPerjalanan / 60)} jam ${menitPerjalanan % 60} menit`;

      const taskFormatRiwayat = {
        id: resData?.data?.id ? "CZ-" + resData.data.id : "CZ-" + Math.floor(Math.random() * 900 + 100),
        icon: data.jenisPaket === "Belanja" ? "🛒" : data.jenisPaket === "Dokumen" ? "📄" : data.jenisPaket === "Antre" ? "⏳" : "📦",
        judul: data.judulTugas,
        kategori: data.jenisPaket,
        kurir: "Menunggu mitra...",
        inisial: "?",
        tanggal: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        durasi: durasiLabel,
        jarakKm: jarak,
        status: "Menunggu",
        rating: 0,
        biaya: totalBiaya,
        pickup: data.pickup,
        destination: data.destination,
        locationNote: data.locationNote,
        instruksi: data.instruksi,
        namaPenerima: data.namaPenerima,
        telepon: data.telepon,
      };

      const existingTasks = JSON.parse(localStorage.getItem("callz_tasks")) || [];
      localStorage.setItem("callz_tasks", JSON.stringify([taskFormatRiwayat, ...existingTasks]));

      setLastSavedTask(taskFormatRiwayat);
      setLoad(false);
      setDone(true);

    } catch (err) {
      console.error("Network error:", err);
      alert("Terjadi kesalahan jaringan. Coba lagi.");
      setLoad(false);
    }
  };

  const reset = () => {
    setDone(false); 
    setStep(1);
    setLastSavedTask(null);
    setData({ pickup: "", destination: "", locationNote: "", judulTugas: "", instruksi: "", jenisPaket: "", namaPenerima: "", telepon: "", kategori: "ringan", extraFee: 0, jarakOSRM: null });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#2563EB", letterSpacing: -0.5 }}>
          CALLZ<span style={{ color: "#0F172A" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Layanan", "Tentang", "Bantuan"].map(n => (
            <a key={n} href="#" style={{ fontSize: 14, color: "#475569", textDecoration: "none", fontWeight: 500 }}>{n}</a>
          ))}
        </div>
        <Link href="/dashboard/riwayat" style={{ ...btnPrimaryStyle, fontSize: 13, padding: "8px 18px" }}>
          Ke Halaman Riwayat
        </Link>
      </nav>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600, letterSpacing: 0.5, marginBottom: 20, textTransform: "uppercase" }}>
          Mission Page
        </div>
        <div style={{ border: "1.5px dashed #93C5FD", borderRadius: 16, padding: "28px 32px", background: "white", marginBottom: 32 }}>
          <Stepper step={step} />
          {done && lastSavedTask ? (
            <SuccessView generatedData={lastSavedTask} onReset={reset} />
          ) : (
            <>
              {step === 1 && <StepLokasi    data={data} setData={setData} onNext={() => setStep(2)} />}
              {step === 2 && <StepDetail    data={data} setData={setData} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
              {step === 3 && <StepInstruksi data={data} setData={setData} onBack={() => setStep(2)} onSubmit={() => setStep(4)} loading={false} />}
              {step === 4 && <StepPembayaran data={data} onBack={() => setStep(3)} onSubmit={handleSubmit} loading={loading} />}
            </>
          )}
        </div>
      </main>

      <footer style={{ background: "white", borderTop: "1px solid #E2E8F0", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#0F172A" }}>CALLZ</div>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>© 2026 CallZ Concierge. Built for Precision.</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Twitter", "Instagram"].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}