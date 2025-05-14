
'use server';

import { db, initializationError } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, FirestoreError } from 'firebase/firestore';
import { z } from 'zod';

const LeadSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  wordCount: z.number().int().positive({ message: "Word count must be a positive number" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  selectedService: z.string().min(1, { message: "Service level is required" }), // Added selectedService
});

interface SaveLeadResult {
  success: boolean;
  message: string;
  crmSynced?: boolean;
}

const AGILED_CRM_URL = 'https://narration-design.agiled.app';
const AGILED_API_KEY = process.env.AGILED_API_KEY;

export async function saveLead(leadData: { 
  firstName: string; 
  email: string; 
  wordCount: number; 
  genre: string; 
  selectedService: string; // Added selectedService
}): Promise<SaveLeadResult> {
  console.log("SERVER: saveLead action invoked with data:", leadData); 
  if (initializationError) {
    console.error("Firebase not initialized, cannot save lead:", initializationError);
    return { success: false, message: initializationError };
  }

  if (!db) {
    const dbUnavailableMsg = "Database service is not available. Firebase might not be initialized correctly. Please check server logs and Firebase configuration.";
    console.error(dbUnavailableMsg);
    return { success: false, message: "An error occurred while saving the estimate data. The database service is unavailable." };
  }
  
  const validatedLead = LeadSchema.safeParse(leadData);
  if (!validatedLead.success) {
    const fieldErrors = validatedLead.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
      .join('; ');
    console.warn("Invalid lead data received by server action:", leadData, fieldErrors);
    return { success: false, message: `Invalid lead data. ${errorMessages || 'Please check your input.'}` };
  }

  const { firstName, email, wordCount, genre, selectedService } = validatedLead.data;

  // Common Firestore save logic
  const saveToFirestore = async () => {
    const leadsRef = collection(db, 'costEstimatorLeads');
    const firestoreDoc = await addDoc(leadsRef, {
        firstName,
        email,
        wordCount,
        genre,
        selectedService, // Added selectedService
        createdAt: serverTimestamp() as Timestamp,
        source: 'NarrationCostCalculator',
    });
    console.log("Lead saved to Firestore with ID:", firestoreDoc.id);
  };

  if (!AGILED_API_KEY) {
    console.warn("Agiled API key is not configured in environment variables. Skipping CRM sync.");
    try {
        await saveToFirestore();
        return { success: true, message: "Estimate data saved (CRM sync skipped due to missing API key configuration)." };
    } catch (dbError) {
        console.error("Error saving lead to Firestore (CRM sync skipped):", dbError);
        return { success: false, message: "An error occurred while saving the estimate data." };
    }
  }

  try {
    // 1. Save to Firestore first
    await saveToFirestore();

    // 2. Sync with Agiled CRM
    try {
      const agiledApiEndpoint = 'https://api.agiled.app/api/v1/contacts'; 
      const payload = {
        email: email,
        first_name: firstName,
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
          },
          {
            key: "estimator_service_level", // Added for selectedService
            value: selectedService 
          }
        ]
      };

      console.log("Attempting to sync with Agiled CRM. Endpoint:", agiledApiEndpoint);
      console.log("Payload being sent to Agiled:", JSON.stringify(payload));

      const agiledBrandHostname = new URL(AGILED_CRM_URL).hostname;

      const response = await fetch(agiledApiEndpoint, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AGILED_API_KEY}`,
          'Brand': agiledBrandHostname, 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Agiled CRM API Error Response (${response.status}): ${errorBody}`);
        // Note: Even if CRM sync fails, Firestore save was successful.
        // So, we return success:true but with a CRM sync failure message.
        return {
            success: true, 
            message: `Estimate data saved, but syncing with CRM failed: ${response.status} ${response.statusText}. Details: ${errorBody}. We will address this manually.`,
            crmSynced: false
        };
      }

      const responseData = await response.json();
      console.log('Successfully synced lead with Agiled CRM:', responseData);
      
      return { success: true, message: "Estimate data saved and synced with CRM successfully.", crmSynced: true };

    } catch (crmError) {
      console.error("Failed to sync lead with Agiled CRM:", crmError);
      // Firestore save was successful, but CRM sync failed.
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
    } 
    // We no longer need to check for Agiled CRM API Error here as it's handled within its own try-catch and doesn't make the overall operation fail.
    return { success: false, message: userMessage };
  }
}

