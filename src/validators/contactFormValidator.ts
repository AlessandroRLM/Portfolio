import type { ContactFormData } from "../types/types";

export class FormValidator {
  static validateForm(data: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!data.email.trim()) {
      errors.push('El email es requerido');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('El email no es válido');
    }

    if (!data.message.trim()) {
      errors.push('El mensaje es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}