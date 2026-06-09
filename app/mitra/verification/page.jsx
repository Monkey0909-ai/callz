"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  ArrowLeft,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  IdCard,
  Car,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { API } from "@/api"

// ── Token helper ───────────────────────────────────────────────────────────────
function getMitraToken() {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("mitra_user") || localStorage.getItem("user")
    if (raw) {
      const p = JSON.parse(raw)
      if (p.token || p.access_token) return p.token || p.access_token
    }
  } catch {}
  return localStorage.getItem("token") || null
}

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    title: "Sedang Ditinjau",
    description: "Dokumen Anda sedang dalam proses verifikasi oleh tim kami. Harap tunggu.",
    containerCls: "bg-amber-50 border-amber-200 text-amber-800",
    iconCls: "text-amber-500",
  },
  APPROVED: {
    icon: CheckCircle2,
    title: "Verifikasi Disetujui",
    description: "Akun Anda telah terverifikasi. Anda dapat mulai menggunakan layanan mitra.",
    containerCls: "bg-green-50 border-green-200 text-green-800",
    iconCls: "text-green-500",
  },
  REJECTED: {
    icon: XCircle,
    title: "Verifikasi Ditolak",
    description: "Dokumen Anda ditolak. Silakan periksa catatan dan upload ulang.",
    containerCls: "bg-destructive/5 border-destructive/20 text-destructive",
    iconCls: "text-destructive",
  },
}

// ── Status Banner ──────────────────────────────────────────────────────────────
function StatusBanner({ status, rejectionNote, createdAt }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg) return null
  const Icon = cfg.icon
  const submittedAt = createdAt
    ? new Date(createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    : null
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border p-4 mb-6", cfg.containerCls)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", cfg.iconCls)} />
      <div>
        <p className="text-sm font-semibold">{cfg.title}</p>
        <p className="mt-0.5 text-sm opacity-85">
          {status === "REJECTED" && rejectionNote ? rejectionNote : cfg.description}
        </p>
        {submittedAt && (
          <p className="mt-1 text-xs opacity-70">Diajukan {submittedAt}</p>
        )}
      </div>
    </div>
  )
}

// ── Upload Box ─────────────────────────────────────────────────────────────────
function UploadBox({ label, icon: Icon, file, onFileChange, onRemove, disabled }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFileChange(dropped)
  }

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  return (
    <div className="mb-5">
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-primary" />
        {label}
      </label>

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-2xl border-2 border-dashed transition",
          file ? "border-primary bg-primary/5 p-3" : "bg-secondary/40 p-7",
          dragging && "border-primary bg-primary/5",
          !file && !dragging && "border-border",
          disabled ? "cursor-default opacity-70" : "cursor-pointer",
        )}
      >
        {file && preview ? (
          <div className="flex items-center gap-3">
            <img
              src={preview}
              alt="preview"
              className="h-14 w-20 shrink-0 rounded-xl border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{file.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove() }}
                className="shrink-0 rounded-lg bg-destructive/10 p-2 text-destructive transition hover:bg-destructive/20"
                aria-label="Hapus file"
              >
                <Trash2 className="size-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Upload className="mb-3 size-8 text-muted-foreground/50" />
            <p className="text-sm font-semibold text-muted-foreground">
              {dragging ? "Lepas file di sini" : "Klik atau seret file ke sini"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">JPG, JPEG, PNG, WEBP — maks. 5 MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpg,image/jpeg,image/png,image/webp"
        onChange={(e) => e.target.files[0] && onFileChange(e.target.files[0])}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}

// ── Existing document preview ──────────────────────────────────────────────────
function DocPreview({ fotoKtp, fotoSim }) {
  if (!fotoKtp && !fotoSim) return null
  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Dokumen Terakhir
      </p>
      <div className="flex gap-3">
        {fotoKtp && (
          <div className="flex-1">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Foto KTP</p>
            <a href={fotoKtp} target="_blank" rel="noopener noreferrer">
              <img
                src={fotoKtp}
                alt="KTP"
                className="h-20 w-full rounded-xl border border-border object-cover transition hover:opacity-80"
              />
            </a>
          </div>
        )}
        {fotoSim && (
          <div className="flex-1">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Foto SIM</p>
            <a href={fotoSim} target="_blank" rel="noopener noreferrer">
              <img
                src={fotoSim}
                alt="SIM"
                className="h-20 w-full rounded-xl border border-border object-cover transition hover:opacity-80"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Verification steps info ────────────────────────────────────────────────────
const STEPS = [
  { step: "1", text: "Upload KTP & SIM asli yang masih berlaku" },
  { step: "2", text: "Tim kami meninjau dalam 1×24 jam kerja" },
  { step: "3", text: "Akun mitra Anda diaktifkan sepenuhnya" },
]

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function VerificationPage() {
  const router = useRouter()
  const [fotoKtp, setFotoKtp] = useState(null)
  const [fotoSim, setFotoSim] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetchingStatus, setFetchingStatus] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [statusData, setStatusData] = useState(null)

  // Fetch status on mount; poll every 10 s while PENDING; redirect when APPROVED
  useEffect(() => {
    let intervalId = null

    const fetchStatus = async () => {
      try {
        const token = getMitraToken()
        const res = await fetch(API.verificationStatus, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "ngrok-skip-browser-warning": "true",
          },
        })
        const data = await res.json()
        if (data.success && data.data) {
          setStatusData(data.data)
          if (data.data.status === "APPROVED") {
            clearInterval(intervalId)
            // Redirect ke dashboard mitra setelah verifikasi disetujui
            router.replace("/mitra")
          }
          // Stop polling jika sudah REJECTED — tidak perlu terus polling
          if (data.data.status === "REJECTED") {
            clearInterval(intervalId)
          }
        }
      } catch (err) {
        console.error("Gagal mengambil status verifikasi:", err)
      } finally {
        setFetchingStatus(false)
      }
    }

    fetchStatus()
    intervalId = setInterval(fetchStatus, 10000)
    return () => clearInterval(intervalId)
  }, [router])

  const isPending = statusData?.status === "PENDING"
  const isApproved = statusData?.status === "APPROVED"
  const canSubmit = !isApproved && !isPending

  const validateFile = (file) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) return "Format file harus JPG, JPEG, PNG, atau WEBP."
    if (file.size > 5 * 1024 * 1024) return "Ukuran file maksimal 5 MB."
    return null
  }

  const handleSubmit = async () => {
    setError("")
    setSuccess("")
    if (!fotoKtp) { setError("Foto KTP wajib diupload."); return }
    if (!fotoSim) { setError("Foto SIM wajib diupload."); return }
    const ktpErr = validateFile(fotoKtp)
    if (ktpErr) { setError(`KTP: ${ktpErr}`); return }
    const simErr = validateFile(fotoSim)
    if (simErr) { setError(`SIM: ${simErr}`); return }

    setLoading(true)
    try {
      const token = getMitraToken()
      const formData = new FormData()
      formData.append("foto_ktp", fotoKtp)
      formData.append("foto_sim", fotoSim)

      const res = await fetch(API.submitVerification, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "ngrok-skip-browser-warning": "true",
          // Do NOT set Content-Type; let browser set multipart boundary
        },
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setSuccess("Dokumen berhasil dikirim! Kami akan meninjau dalam 1×24 jam.")
        setStatusData(data.data)
        setFotoKtp(null)
        setFotoSim(null)
      } else {
        setError(
          data?.message ||
            (data?.errors ? Object.values(data.errors).flat().join(", ") : "Gagal mengirim dokumen."),
        )
      }
    } catch (err) {
      console.error(err)
      setError("Terjadi kesalahan koneksi ke server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary px-4 py-6">
      {/* Back link */}
      <div className="mb-4 w-full max-w-md">
        <button
          onClick={() => router.push("/mitra")}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Dashboard
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-center border-b border-border px-6 py-8">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/30">
            <ShieldCheck className="size-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Verifikasi Identitas</h1>
          <p className="mt-1.5 text-center text-sm text-muted-foreground">
            Upload foto KTP dan SIM Anda untuk menjadi mitra terverifikasi
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {fetchingStatus ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Memuat status verifikasi...
            </div>
          ) : (
            <>
              {statusData && (
                <StatusBanner
                  status={statusData.status}
                  rejectionNote={statusData.rejection_note}
                  createdAt={statusData.created_at}
                />
              )}

              <DocPreview fotoKtp={statusData?.foto_ktp} fotoSim={statusData?.foto_sim} />

              {canSubmit && (
                <>
                  {statusData?.status === "REJECTED" && (
                    <p className="mb-5 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                      ✏️ Silakan upload ulang dokumen Anda di bawah ini.
                    </p>
                  )}

                  <UploadBox
                    label="Foto KTP"
                    icon={IdCard}
                    file={fotoKtp}
                    onFileChange={setFotoKtp}
                    onRemove={() => setFotoKtp(null)}
                  />
                  <UploadBox
                    label="Foto SIM"
                    icon={Car}
                    file={fotoSim}
                    onFileChange={setFotoSim}
                    onRemove={() => setFotoSim(null)}
                  />

                  {error && (
                    <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                      {error}
                    </p>
                  )}
                  {success && (
                    <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                      {success}
                    </p>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                  >
                    {loading
                      ? "Mengirim..."
                      : statusData?.status === "REJECTED"
                        ? "Upload Ulang Dokumen"
                        : "Kirim Dokumen Verifikasi"}
                  </button>
                </>
              )}

              {isPending && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  <RefreshCw className="size-4" />
                  Refresh Status
                </button>
              )}

              {!statusData && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Proses Verifikasi
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {STEPS.map((s) => (
                      <li key={s.step} className="flex items-start gap-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {s.step}
                        </span>
                        <p className="pt-0.5 text-sm text-muted-foreground">{s.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
