// app/../lib/api.js  atau  src/lib/api.js
const STORAGE_BASE = 'https://generous-awake-serval.ngrok-free.app/storage'

export const getStorageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${STORAGE_BASE}/${path.replace(/^\//, '')}`
}