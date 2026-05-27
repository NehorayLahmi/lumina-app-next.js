export function isValidEmail(email: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  const d = phone.replace(/[\s\-().]/g, "");
  return /^0[0-9]{8,9}$/.test(d);
}

export function isValidName(name: string): boolean {
  return /^[֐-׿יִ-ﭏa-zA-Z\s'\-]{2,50}$/.test(name);
}

export function isValidPassword(pass: string): boolean {
  return pass.length >= 6 && pass.length <= 100;
}
