const BASE_URL = "https://generous-awake-serval.ngrok-free.app/api";

export const API = {
  // Auth
  login:               `${BASE_URL}/auth/login`,
  registerUser:        `${BASE_URL}/auth/register/user`,
  registerMitra:       `${BASE_URL}/auth/register/mitra`,

  // Verifikasi Mitra
  submitVerification:  `${BASE_URL}/verifications`,          // POST multipart/form-data
  verificationStatus:  `${BASE_URL}/verifications`,          // GET (cek status mitra)

  // Admin Verifikasi
  adminVerifications:     `${BASE_URL}/admin/verifications`,              // GET list
  adminUpdateStatus:      (id) => `${BASE_URL}/verifications/${id}/status`, // PUT approve/reject
};
