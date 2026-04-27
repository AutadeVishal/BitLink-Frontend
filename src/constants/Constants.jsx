// ─── Secrets (from .env) ───
export const BASE_URL = import.meta.env.VITE_BASE_URL;

// ─── Assets ───
export const DEFAULT_AVATAR = "https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png";

// ─── Validation ───
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => EMAIL_REGEX.test(email);
