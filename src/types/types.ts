export interface EmailJSConfig {
    serviceId: string;
    templateId: string;
    publicKey: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
}

export interface EmailResponse {
    success: boolean;
    message: string;
    response?: any;
    error?: any;
}
