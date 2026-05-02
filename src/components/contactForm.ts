import { emailJSConfig } from "../config/email";
import { EmailService } from "../services/emailService";
import type { ContactFormData } from "../types/types";
import { FormValidator } from "../validators/contactFormValidator";
import { t } from "../lib/i18n";

export class ContactForm {
  private form: HTMLFormElement;
  private submitBtn: HTMLButtonElement;
  private formMessage: HTMLElement;
  private emailService: EmailService;

  constructor() {
    this.form = document.getElementById("contactForm") as HTMLFormElement;
    this.submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
    this.formMessage = document.getElementById("formMessage") as HTMLElement;
    this.emailService = new EmailService(emailJSConfig);

    this.init();
  }

  private init(): void {
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const formData = this.getFormData();
    const validation = FormValidator.validateForm(formData);

    if (!validation.isValid) {
      this.showMessage(validation.errors.map(err => t(err)).join(", "), "error");
      return;
    }

    this.toggleLoading(true);

    try {
      const result = await this.emailService.sendEmail(formData);

      if (result.success) {
        this.showMessage(t("form.success"), "success");
        this.form.reset();
      } else {
        this.showMessage(t("form.error"), "error");
      }
    } catch (error) {
      this.showMessage(t("form.error"), "error");
      console.error("Error:", error);
    }

    this.toggleLoading(false);
  }

  private getFormData(): ContactFormData {
    const formData = new FormData(this.form);
    return {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    };
  }

  private showMessage(message: string, type: "success" | "error"): void {
    this.formMessage.textContent = message;
    this.formMessage.className = `form-message ${type} show`;

    setTimeout(() => {
      this.formMessage.className = `form-message`;
    }, 5000);
  }

  private toggleLoading(isLoading: boolean): void {
    this.submitBtn.disabled = isLoading;

    if (isLoading) {
      this.submitBtn.innerHTML = `<span data-i18n="form.sending">${t("form.sending")}</span><span>⏳</span>`;
    } else {
      this.submitBtn.innerHTML = `<span data-i18n="form.submit">${t("form.submit")}</span><span>→</span>`;
    }
  }
}

