// src/schemas/contact.schema.ts
// Used by: /contact page form AND app/api/contact route.

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Subject is required").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

// Used by: Newsletter.tsx (home page) AND app/api/newsletter route.
export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
