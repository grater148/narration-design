
'use server';

import { db, initializationError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, FirestoreError } from 'firebase/firestore';
import { z } from 'zod';

// --- TODO: Configure your Email Sending Service --- 
// Example: If using Resend
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);
// Or for other services, import their respective SDKs.

const ContactMessageSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100, { message: "Name must be 100 characters or less" }),
  email: z.string().email({ message: "Invalid email address" }).max(100, { message: "Email must be 100 characters or less" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }).max(5000, { message: "Message must be 5000 characters or less" }),
});

export interface SaveContactMessageResult {
  success: boolean;
  message: string;
  emailSent?: boolean; // Optional: to indicate if email was attempted/successful
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

    // 1. Save to Firestore (as before)
    const contactSubmissionsRef = collection(db, 'contactFormSubmissions');
    await addDoc(contactSubmissionsRef, {
      name,
      email,
      message,
      createdAt: serverTimestamp() as Timestamp,
      source: 'ContactForm',
    });

    // 2. Send Email Notification
    const emailRecipient = 'success@narration.design';
    const emailSubject = `New Contact Form Submission from ${name}`;
    const emailBody = `
      You have a new contact form submission:
      ------------------------------------------
      Name: ${name}
      Email: ${email}
      Message:
      ${message}
      ------------------------------------------
    `;

    try {
      // --- TODO: Implement your email sending logic here ---
      // This is a placeholder. Replace with your email service provider's code.
      // Example using a hypothetical sendEmail function:
      //
      // await sendEmail({
      //   to: emailRecipient,
      //   from: 'noreply@yourdomain.com', // Your "from" address, configure with your email provider
      //   subject: emailSubject,
      //   text: emailBody, // Or html: emailBodyHTML if you have an HTML version
      // });
      //
      // Example if using Resend (ensure RESEND_API_KEY is in your .env):
      // const { data, error } = await resend.emails.send({
      //   from: 'Narration Design Contact Form <noreply@yourverifieddomain.com>', // Replace with your verified Resend domain
      //   to: [emailRecipient],
      //   subject: emailSubject,
      //   text: emailBody, // or use `react: EmailTemplate({ name, email, message })` for HTML emails
      // });
      // if (error) {
      //   throw new Error(`Resend error: ${error.message}`);
      // }

      console.log(`Email notification supposedly sent to ${emailRecipient}`); // Replace with actual success logging
      // --- End of TODO for email sending logic ---

      return { success: true, message: "Your message has been sent successfully!", emailSent: true };

    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Still return success: true for the form submission part, as the message was saved to Firestore.
      // But include a message indicating email sending failed.
      return {
        success: true, 
        message: "Your message was saved, but we encountered an issue sending the email notification to our team. We will follow up as soon as possible.", 
        emailSent: false 
      };
    }

  } catch (error) {
    console.error("Error saving contact message to Firestore:", error);
    let userMessage = "An error occurred while sending your message. Please try again later.";
    if (error instanceof FirestoreError) {
      userMessage = `Failed to send message due to a database issue (Code: ${error.code}). Please try again. If the problem persists, contact support.`;
    }
    return { success: false, message: userMessage };
  }
}

// --- TODO: Define your sendEmail function or use an SDK ---
// async function sendEmail(options: { to: string; from: string; subject: string; text: string; html?: string }) {
//   // This is where you'd use nodemailer, Resend, SendGrid, AWS SES SDK, etc.
//   // For example, with Nodemailer:
//   // const transporter = nodemailer.createTransport({ /* ...your transport config... */ });
//   // await transporter.sendMail(options);
//   console.log("Email sending logic for:", options);
//   return Promise.resolve();
// }

