'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const LeadSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  wordCount: z.number().int().positive({ message: "Word count must be a positive number" }),
  genre: z.string().min(1, { message: "Genre is required" }),
});

interface SaveLeadResult {
  success: boolean;
  message: string;
}

export async function saveLead(leadData: { email: string; wordCount: number; genre: string }): Promise<SaveLeadResult> {
  try {
    const validatedLead = LeadSchema.safeParse(leadData);
    if (!validatedLead.success) {
      const fieldErrors = validatedLead.error.flatten().fieldErrors;
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
        .join('; ');
      console.warn("Invalid lead data received by server action:", leadData, fieldErrors);
      return { success: false, message: `Invalid lead data. ${errorMessages || 'Please check your input.'}` };
    }

    const { email, wordCount, genre } = validatedLead.data;

    const leadsRef = collection(db, 'costEstimatorLeads');
    // Optional: Check if a very similar lead (e.g., same email, word count, and genre) was submitted recently
    // This might be overkill if we're just trying to capture all estimate requests.
    // For now, we'll check if the email itself exists, similar to the previous logic.
    const q = query(leadsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    // If we want to allow multiple estimates from the same email but with different parameters,
    // we might not need to check if the email exists. Or, if we do, the logic for "already captured"
    // would need to be more nuanced (e.g., update if parameters are different).
    // For simplicity, if an email exists, we will still save the new estimate data as a new document.
    // This allows tracking of all estimate interactions.

    // if (!querySnapshot.empty) {
    //   return { success: true, message: "Email already captured. New estimate not saved if identical." };
    // }

    await addDoc(leadsRef, {
      email,
      wordCount,
      genre,
      createdAt: serverTimestamp() as Timestamp, // Firestore server timestamp
      source: 'NarrationCostCalculator',
    });

    // console.log("Lead data saved to Firestore:", validatedLead.data);
    return { success: true, message: "Estimate data saved successfully." };
  } catch (error) {
    console.error("Error saving lead data to Firestore:", error);
    return { success: false, message: "An error occurred while saving the estimate data. Please try again later." };
  }
}
