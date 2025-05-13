'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const EmailSchema = z.string().email({ message: "Invalid email address" });

interface SaveEmailResult {
  success: boolean;
  message: string;
}

export async function saveEmail(email: string): Promise<SaveEmailResult> {
  try {
    const validatedEmail = EmailSchema.safeParse(email);
    if (!validatedEmail.success) {
      // console.warn("Invalid email format received by server action:", email, validatedEmail.error.flatten().fieldErrors);
      return { success: false, message: "Invalid email format." };
    }

    const leadsRef = collection(db, 'costEstimatorLeads');
    const q = query(leadsRef, where('email', '==', validatedEmail.data));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Email already exists. We can choose to update a timestamp or simply acknowledge.
      // For now, let's consider it a success as the email is already captured.
      // console.log("Email already exists in Firestore:", validatedEmail.data);
      return { success: true, message: "Email already captured." };
    }

    await addDoc(leadsRef, {
      email: validatedEmail.data,
      createdAt: serverTimestamp() as Timestamp, // Firestore server timestamp
      source: 'NarrationCostCalculator',
    });

    // console.log("Email saved to Firestore:", validatedEmail.data);
    return { success: true, message: "Email saved successfully." };
  } catch (error) {
    console.error("Error saving email to Firestore:", error);
    // It's good practice to not expose detailed error messages to the client.
    return { success: false, message: "An error occurred while saving the email. Please try again later." };
  }
}
