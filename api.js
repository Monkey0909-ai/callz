const BASE_URL = "https://generous-awake-serval.ngrok-free.app/api";

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
};
