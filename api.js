const BASE_URL = "https://generous-awake-serval.ngrok-free.app/api";
// const BASE_URL = "https://grkx9mvm-8000.asse.devtunnels.ms/api";
const STORAGE_BASE = "https://generous-awake-serval.ngrok-free.app/storage";
// const STORAGE_BASE = "https://grkx9mvm-8000.asse.devtunnels.ms/storage";
export const API = {
  // Auth - Register
  registerUser:  `${BASE_URL}/auth/user/register`,
  registerMitra: `${BASE_URL}/auth/mitra/register`,
 
  // Auth - Login (shared)
  login: `${BASE_URL}/auth/login`,
 
  // Auth - User
  logoutUser: `${BASE_URL}/auth/user/logout`,
  meUser:     `${BASE_URL}/auth/user/me`,
 
  // Auth - Mitra
  logoutMitra: `${BASE_URL}/auth/mitra/logout`,
  meMitra:     `${BASE_URL}/auth/mitra/me`,
 
  // Verifikasi Mitra ← TAMBAHAN BARU
  submitVerification: `${BASE_URL}/mitra/verification`,
  verificationStatus: `${BASE_URL}/mitra/verification/status`,
 
  // Admin Verifikasi ← TAMBAHAN BARU
  adminVerifications:    `${BASE_URL}/admin/verifications`,
  adminVerificationById: (id) => `${BASE_URL}/admin/verifications/${id}`,
  adminUpdateStatus:     (id) => `${BASE_URL}/admin/verifications/${id}/status`,

  
};
 export const getStorageUrl = (path) => {
  if (!path) return null;
  // Kalau sudah full URL, langsung return
  if (path.startsWith("http")) return path;
  // Buang leading slash kalau ada
  return `${STORAGE_BASE}/${path.replace(/^\//, "")}`;
};



