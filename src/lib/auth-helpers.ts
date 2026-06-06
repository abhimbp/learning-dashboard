export const ADMIN_EMAIL = "admin@edgelearn.com";

export function checkIsAdmin(email?: string | null) {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
