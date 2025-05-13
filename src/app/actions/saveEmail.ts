
'use server';

import { db, initializationError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, Timestamp, FirestoreError } from 'firebase/firestore';
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
  if (initializationError) {
    console.error("Firebase not initialized, cannot save lead:", initializationError);
    // Provide the detailed initialization error to the client for debugging
    return { success: false, message: initializationError };
  }

  if (!db) {
    // This case should be covered by initializationError, but as a fallback:
    const dbUnavailableMsg = "Database service is not available. Firebase might not be initialized correctly. Please check server logs and Firebase configuration.";
    console.error(dbUnavailableMsg);
    return { success: false, message: "An error occurred while saving the estimate data. The database service is unavailable." };
  }

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
    
    // The check for existing email was commented out, retaining that behavior.
    // const q = query(leadsRef, where('email', '==', email));
    // const querySnapshot = await getDocs(q);
    // if (!querySnapshot.empty) {
    //   return { success: true, message: "Email already captured. New estimate not saved if identical." };
    // }

    await addDoc(leadsRef, {
      email,
      wordCount,
      genre,
      createdAt: serverTimestamp() as Timestamp,
      source: 'NarrationCostCalculator',
    });

    return { success: true, message: "Estimate data saved successfully." };
  } catch (error) {
    console.error("Error saving lead data to Firestore:", error);
    let userMessage = "An error occurred while saving the estimate data. Please try again later.";
    if (error instanceof FirestoreError) { // Check if it's a FirestoreError
        userMessage = `Failed to save data due to a Firebase issue (Code: ${error.code}). Please ensure Firestore is set up correctly with appropriate security rules, or try again. If the problem persists, contact support.`;
    } else if (error instanceof Error) {
        // For other types of errors, you might not want to expose error.message directly
        // userMessage = `An unexpected error occurred: ${error.message}`; // Potentially too verbose
    }
    return { success: false, message: userMessage };
  }
}

