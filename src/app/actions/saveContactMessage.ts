
'use server';

import { db, initializationError } from '@/lib/firebase';
import nodemailer from 'nodemailer';
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

// Email Configuration (ensure these are in your .env.local and deployment environment)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const RECEIVING_EMAIL = 'success@narration.design';
const AGILED_API_KEY = process.env.AGILED_API_KEY;

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
  const firestoreDb = db; // Ensure db is treated as defined

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

  // Helper function to save to Firestore
  const saveToFirestore = async () => {
    const contactSubmissionsRef = collection(firestoreDb, 'contactFormSubmissions');
    const firestoreDoc = await addDoc(contactSubmissionsRef, {
      name,
      email,
      message,
      createdAt: serverTimestamp() as Timestamp,
      source: 'ContactForm',
    });
    console.log("Contact message saved to Firestore with ID:", firestoreDoc.id);
  };

  // Helper function to send email
  const sendEmail = async () => {
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn("Email user or password not configured. Cannot send contact message email.");
      return false; // Indicate failure
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your preferred email service
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Contact Form" <${EMAIL_USER}>`,
        to: RECEIVING_EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
      });
      console.log("Contact message email sent successfully to", RECEIVING_EMAIL);
      return true; // Indicate success
    } catch (emailError) {
      console.error("Failed to send contact message email:", emailError);
      return false; // Indicate failure
    }
  };

  // Helper function to send data to Agiled CRM
  const sendToAgiledCRM = async (data: { name: string; email: string; message: string }) => {
    if (!AGILED_API_KEY) {
      console.warn("Agiled API key not configured. Cannot send contact message to CRM.");
      return false; // Indicate failure
    }

    const CRM_URL = 'https://my.agiled.app/v1/'; // Agiled CRM API endpoint

    try {
      const response = await fetch(CRM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AGILED_API_KEY}`, // Assuming Bearer token authentication
        },
        body: JSON.stringify({
          // Map your form data to the expected Agiled CRM payload structure
          // This is a placeholder and needs to match the actual API documentation
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Failed to send contact message to Agiled CRM. Status: ${response.status}, Response: ${errorBody}`);
        return false; // Indicate failure
      }

      console.log("Contact message sent to Agiled CRM successfully.");
      return true; // Indicate success
    } catch (crmError) {
      console.error("Error sending contact message to Agiled CRM:", crmError);
      return false; // Indicate failure
    }
  };

  try {
    await saveToFirestore(); // Save to Firestore first
  } catch (error) {
    console.error("Error in saveContactMessage function (outer try-catch):", error);
    let userMessage = "An error occurred while sending your message. Please try again later.";
    if (error instanceof FirestoreError) {
        userMessage = `Failed to save your message due to a database issue (Code: ${error.code}). Please try again. If the problem persists, contact support.`;
    } 
    // Note: Email errors are caught within sendEmail and result in emailSent being false.
    // The main catch block here primarily catches Firestore errors from saveToFirestore
    // or other unexpected errors.
    return { success: false, message: userMessage };
  }

  // After successful Firestore save, send email and to CRM (these can happen in parallel or sequence)
  const emailSent = await sendEmail();
  const crmSent = await sendToAgiledCRM({ name, email, message });

  if (emailSent && crmSent) {
    return { success: true, message: "Your message has been sent successfully!" };
  } else if (!emailSent && crmSent) {
    return { success: true, message: "Your message was sent successfully, but there was an issue sending the confirmation email." };
  } else if (emailSent && !crmSent) {
    return { success: true, message: "Your message was sent successfully, but there was an issue submitting it to our CRM." };
  } else {
    return { success: true, message: "Your message was saved to our system, but there were issues sending the email and submitting to the CRM. We will address this manually." };
  }
}
