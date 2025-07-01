import emailjs from '@emailjs/browser'
import { emailJSConfig } from '../config/email'
import type { ContactFormData, EmailJSConfig, EmailResponse } from '../types/types'

export class EmailService {
    private config = emailJSConfig

    constructor(config: EmailJSConfig) {
        this.config = config
        this.init()
    }

    private init(): void {
        emailjs.init({
            publicKey: this.config.publicKey
        })
    }

    async sendEmail(formData: ContactFormData): Promise<EmailResponse> {
        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                company: formData.company,
                phone: formData.phone,
                message: formData.message,
            };

            const response = await emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                templateParams
            );

            return {
                success: true,
                message: 'Email enviado correctamente',
                response
            };
        } catch (error: any) {
            console.error('Error al enviar email:', error);
            return {
                success: false,
                message: `Error al enviar el email: ${error.text || error.message}`,
                error
            };
        }
    }
}

