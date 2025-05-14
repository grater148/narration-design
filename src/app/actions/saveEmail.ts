
'use server';

import { db, initializationError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, FirestoreError } from 'firebase/firestore';
import { z } from 'zod';

const LeadSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }), // Added firstName
  email: z.string().email({ message: "Invalid email address" }),
  wordCount: z.number().int().positive({ message: "Word count must be a positive number" }),
  genre: z.string().min(1, { message: "Genre is required" }),
});

interface SaveLeadResult {
  success: boolean;
  message: string;
  crmSynced?: boolean;
}

const AGILED_CRM_URL = 'https://narration-design.agiled.app';
const AGILED_API_KEY = process.env.AGILED_API_KEY;

// Updated function signature to include firstName
export async function saveLead(leadData: { firstName: string; email: string; wordCount: number; genre: string }): Promise<SaveLeadResult> {
  console.log("SERVER: saveLead action invoked"); // <<< ADDED THIS LINE
  if (initializationError) {
    console.error("Firebase not initialized, cannot save lead:", initializationError);
    return { success: false, message: initializationError };
  }

  if (!db) {
    const dbUnavailableMsg = "Database service is not available. Firebase might not be initialized correctly. Please check server logs and Firebase configuration.";
    console.error(dbUnavailableMsg);
    return { success: false, message: "An error occurred while saving the estimate data. The database service is unavailable." };
  }

  if (!AGILED_API_KEY) {
    console.warn("Agiled API key is not configured in environment variables. Skipping CRM sync.");
    // Still save to Firestore if API key is missing for CRM
    try {
        const validatedLead = LeadSchema.safeParse(leadData);
        if (!validatedLead.success) {
            // Handle validation errors as before
            const fieldErrors = validatedLead.error.flatten().fieldErrors;
            const errorMessages = Object.entries(fieldErrors)
              .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
              .join('; ');
            return { success: false, message: `Invalid lead data. ${errorMessages || 'Please check your input.'}` };
        }
        const { firstName, email, wordCount, genre } = validatedLead.data;
        const leadsRef = collection(db, 'costEstimatorLeads');
        await addDoc(leadsRef, {
            firstName, // Added firstName
            email,
            wordCount,
            genre,
            createdAt: serverTimestamp() as Timestamp,
            source: 'NarrationCostCalculator',
        });
        console.log("Lead saved to Firestore (CRM sync skipped due to missing API key).");
        return { success: true, message: "Estimate data saved (CRM sync skipped due to missing API key configuration)." };
    } catch (dbError) {
        console.error("Error saving lead to Firestore (CRM sync skipped):", dbError);
        return { success: false, message: "An error occurred while saving the estimate data." };
    }
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

    // Destructure firstName along with other fields
    const { firstName, email, wordCount, genre } = validatedLead.data;

    // 1. Save to Firestore
    const leadsRef = collection(db, 'costEstimatorLeads');
    const firestoreDoc = await addDoc(leadsRef, {
      firstName, // Added firstName
      email,
      wordCount,
      genre,
      createdAt: serverTimestamp() as Timestamp,
      source: 'NarrationCostCalculator',
    });
    console.log("Lead saved to Firestore with ID:", firestoreDoc.id);

    // 2. Sync with Agiled CRM
    try {
      const agiledApiEndpoint = `/api/agiled/contacts`; // Using the proxied path

      const payload = {
        email: email,
        first_name: firstName, // Use the dynamic firstName
        last_name: "From Estimator",
        role: "Lead",
        tags: "cost_estimator_lead, narration_services",
        custom_fields: [
          {
            key: "estimator_word_count",
            value: wordCount.toString()
          },
          {
            key: "estimator_genre",
            value: genre
          }
        ]
      };

      console.log("Attempting to sync with Agiled CRM. Endpoint:", agiledApiEndpoint);
      console.log("Payload being sent to Agiled:", JSON.stringify(payload));

      const agiledBrandHostname = new URL(AGILED_CRM_URL).hostname;
      // console.log("Using Agiled Brand Hostname for header (if needed):", agiledBrandHostname); // Kept for potential debugging

      const response = await fetch(agiledApiEndpoint, { // Ensure this URL is correct (proxied)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AGILED_API_KEY}`,
          'Brand': agiledBrandHostname, // Changed header name here
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Agiled CRM API Error Response (${response.status}): ${errorBody}`);
        throw new Error(`Agiled CRM API Error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      const responseData = await response.json();
      console.log('Successfully synced lead with Agiled CRM:', responseData);
      
      return { success: true, message: "Estimate data saved and synced with CRM successfully.", crmSynced: true };

    } catch (crmError) {
      console.error("Failed to sync lead with Agiled CRM:", crmError);
      return {
        success: true,
        message: `Estimate data saved, but syncing with CRM failed: ${crmError instanceof Error ? crmError.message : 'Unknown CRM error'}. We will address this manually.`,
        crmSynced: false
      };
    }

  } catch (error) {
    console.error("Error in saveLead function (outer try-catch):", error);
    let userMessage = "An error occurred while saving the estimate data. Please try again later.";
    if (error instanceof FirestoreError) {
        userMessage = `Failed to save data due to a Firebase issue (Code: ${error.code}). Please ensure Firestore is set up correctly or try again. If the problem persists, contact support.`;
    } else if (error instanceof Error && error.message.includes('Agiled CRM API Error')) {
        userMessage = "Failed to save data due to a CRM integration issue. Please try again. If the problem persists, contact support.";
    }
    return { success: false, message: userMessage };
  }
}

