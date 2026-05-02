import type { ContactFormData } from "../types/types";

export class FormValidator {
  static validateForm(data: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name.trim()) {
      errors.push('form.validation.name');
    }

    if (!data.email.trim()) {
      errors.push('form.validation.email.required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('form.validation.email.invalid');
    }

    if (!data.message.trim()) {
      errors.push('form.validation.message');
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