import { emailJSConfig } from "../config/email";
import { EmailService } from "../services/emailService";
import type { ContactFormData } from "../types/types";
import { FormValidator } from "../validators/contactFormValidator";

export class ContactForm {
    private form: HTMLFormElement;
    private submitBtn: HTMLButtonElement;
    private formMessage: HTMLElement;
    private emailService: EmailService;
  
    constructor() {
      this.form = document.getElementById('contactForm') as HTMLFormElement;
      this.submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
      this.formMessage = document.getElementById('formMessage') as HTMLElement;
      this.emailService = new EmailService(emailJSConfig);
      
      this.init();
    }
  
    private init(): void {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  
    private async handleSubmit(e: Event): Promise<void> {
      e.preventDefault();
      
      const formData = this.getFormData();
      const validation = FormValidator.validateForm(formData);
  
      if (!validation.isValid) {
        this.showMessage(validation.errors.join(', '), 'error');
        return;
      }
  
      this.toggleLoading(true);
  
      try {
        const result = await this.emailService.sendEmail(formData);
        
        if (result.success) {
          this.showMessage(result.message, 'success');
          this.form.reset();
        } else {
          this.showMessage(result.message, 'error');
        }
      } catch (error) {
        this.showMessage('Error inesperado al enviar el email', 'error');
        console.error('Error:', error);
      }
  
      this.toggleLoading(false);
    }
  
    private getFormData(): ContactFormData {
      const formData = new FormData(this.form);
      return {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        company: formData.get('company') as string,
        message: formData.get('message') as string
      };
    }
  
    private showMessage(message: string, type: 'success' | 'error'): void {
      this.formMessage.textContent = message;
      this.formMessage.className = `form-message ${type}`;
      this.formMessage.style.bottom = '24px'

      setTimeout(() => {
        this.formMessage.style.bottom = '-100px'
      }, 5000);
    }
  
    private toggleLoading(isLoading: boolean): void {
      this.submitBtn.disabled = isLoading;
      const btnText = this.submitBtn.querySelector('.btn-text') as HTMLElement;
      const btnLoading = this.submitBtn.querySelector('.btn-loading') as HTMLElement;
      
      btnText.style.display = isLoading ? 'none' : 'flex';
      btnLoading.style.display = isLoading ? 'flex' : 'none';
    }
  }