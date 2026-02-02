/**
 * Validación de email reutilizable.
 * Devuelve { valid: true } o { valid: false, error: string } con mensaje claro.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export function validateEmail(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) {
    return { valid: false, error: 'El email es obligatorio.' };
  }
  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: 'El email es demasiado largo.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Ingresá un email válido (ej: nombre@dominio.com).' };
  }
  return { valid: true, value: trimmed };
}
