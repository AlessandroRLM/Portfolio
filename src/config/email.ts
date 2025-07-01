import type { EmailJSConfig } from "../types/types";

export const emailJSConfig: EmailJSConfig = {
    serviceId: import.meta.env.VITE_SERVICE_ID || '',
    templateId: import.meta.env.VITE_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_PUBLIC_KEY || ''
}