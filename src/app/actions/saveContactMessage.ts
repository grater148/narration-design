
'use server';

import { db, initializationError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, FirestoreError } from 'firebase/firestore';
import { z } from 'zod';

const ContactMessageSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name must be 100 characters or less" }),
  email: z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be 100 characters or less" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }).max(5000, { message: "Message must be 5000 characters or less" }),
});

export interface SaveContactMessageResult {
  success: boolean;
  message: string;
}

export async function saveContactMessage(formData: { name: string; email: string; message: string }): Promise<SaveContactMessageResult> {
  if (initializationError) {
    console.error("Firebase not initialized, cannot save contact message:", initializationError);
    return { success: false, message: "Server error: Firebase not initialized." };
  }

  if (!db) {
    const dbUnavailableMsg = "Database service is not available. Firebase might not be initialized correctly.";
    console.error(dbUnavailableMsg);
    return { success: false, message: "Server error: Database service unavailable." };
  }

  try {
    const validatedData = ContactMessageSchema.safeParse(formData);
    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
        .join('; ');
      console.warn("Invalid contact message data received by server action:", formData, fieldErrors);
      return { success: false, message: `Invalid data. ${errorMessages || 'Please check your input.'}` };
    }

    const { name, email, message } = validatedData.data;

    const contactSubmissionsRef = collection(db, 'contactFormSubmissions');

    await addDoc(contactSubmissionsRef, {
      name,
      email,
      message,
      createdAt: serverTimestamp() as Timestamp,
      source: 'ContactForm',
    });

    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Error saving contact message to Firestore:", error);
    let userMessage = "An error occurred while sending your message. Please try again later.";
    if (error instanceof FirestoreError) {
      userMessage = `Failed to send message due to a database issue (Code: ${error.code}). Please try again. If the problem persists, contact support.`;
    }
    return { success: false, message: userMessage };
  }
}
