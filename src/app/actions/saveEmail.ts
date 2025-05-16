
'use server';

// Removed Firebase imports: db, initializationError, collection, addDoc, serverTimestamp, Timestamp, FirestoreError
import { z } from 'zod';

const LeadSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  wordCount: z.number().int().positive({ message: "Word count must be a positive number" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  selectedService: z.string().min(1, { message: "Service level is required" }),
});

interface SaveLeadResult {
  success: boolean;
  message: string;
  crmSynced?: boolean; // Kept for consistency, will always be true or error out
}

const AGILED_CRM_URL = 'https://narration-design.agiled.app'; // Ensure this is correct
const AGILED_API_KEY = process.env.AGILED_API_KEY;

export async function saveLead(leadData: { 
  firstName: string; 
  email: string; 
  wordCount: number; 
  genre: string; 
  selectedService: string; 
}): Promise<SaveLeadResult> {
  console.log("SERVER: saveLead action invoked with data (Agiled Only):", leadData); 

  // Removed Firebase initialization checks (initializationError and !db)
  
  const validatedLead = LeadSchema.safeParse(leadData);
  if (!validatedLead.success) {
    const fieldErrors = validatedLead.error.flatten().fieldErrors;
    const errorMessages = Object.entries(fieldErrors)
      .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
      .join('; ');
    console.warn("Invalid lead data received by server action (Agiled Only):", leadData, fieldErrors);
    return { success: false, message: `Invalid lead data. ${errorMessages || 'Please check your input.'}` };
  }

  const { firstName, email, wordCount, genre, selectedService } = validatedLead.data;

  // Removed Firestore save logic (saveToFirestore function and its calls)

  if (!AGILED_API_KEY) {
    console.error("Agiled API key is not configured in environment variables. Cannot sync with CRM.");
    // If Agiled is the only target, and its key is missing, this is a hard failure for the intended operation.
    return { success: false, message: "CRM configuration error. Could not save estimate details." };
  }

  try {
    // Directly attempt to sync with Agiled CRM
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
          key: "estimator_service_level",
          value: selectedService 
        }
      ]
    };

    console.log("Attempting to sync with Agiled CRM (Agiled Only). Endpoint:", agiledApiEndpoint);
    console.log("Payload being sent to Agiled (Agiled Only):", JSON.stringify(payload));

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
      console.error(`Agiled CRM API Error Response (${response.status}) (Agiled Only): ${errorBody}`);
      return {
          success: false, // Changed to false as CRM sync is the primary goal now
          message: `Syncing with CRM failed: ${response.status} ${response.statusText}. Details: ${errorBody}. Please try again or contact support if the issue persists.`,
          crmSynced: false
      };
    }

    const responseData = await response.json();
    console.log('Successfully synced lead with Agiled CRM (Agiled Only):', responseData);
    
    return { success: true, message: "Estimate data synced with CRM successfully.", crmSynced: true };

  } catch (error) {
    console.error("Error in saveLead function (Agiled Only - outer try-catch):", error);
    let userMessage = "An error occurred while saving the estimate data. Please try again later.";
    if (error instanceof Error) {
        // More generic error message now that FirebaseError is not expected
        userMessage = `An operational error occurred: ${error.message}. Please try again or contact support.`;
    } 
    return { success: false, message: userMessage, crmSynced: false };
  }
}

