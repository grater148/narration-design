
'use server';

import { z } from 'zod';
import { FirestoreError } from 'firebase/firestore'; // Assuming FirestoreError might be used for more comprehensive error handling later

export interface SaveContactMessageResult {
  success: boolean;
  message: string;
}

const AGILED_CRM_URL = 'https://narration-design.agiled.app';
const AGILED_API_KEY = process.env.AGILED_API_KEY;

// Email Configuration (ensure these are in your .env.local and deployment environment)
export async function saveContactMessage({ name, email, message }: {
  name: string;
  email: string;
  message: string;
}): Promise<SaveContactMessageResult> {

  if (!AGILED_API_KEY) {
    console.warn("Agiled API key is not configured in environment variables. Cannot send contact message to CRM.");
    return { success: false, message: "Contact form temporarily unavailable due to missing API configuration." };
  }

  try {
    const agiledApiEndpoint = 'https://api.agiled.app/api/v1/contacts';
    const payload = {
      email: email,
      first_name: name, // Mapping name to first_name
      last_name: "From Contact Form", // Placeholder for last name
      role: "Lead", // Assuming contact form submissions are leads
      tags: "contact_form_submission, narration_services",
      custom_fields: [ // Add the message to a custom field
        {
          key: "message_body", // Use the actual key from your Agiled custom field
          value: message
        }
      ],
      // notes: message // Removed notes as custom_fields is preferred for structured data

    };

    console.log("Attempting to send contact message to Agiled CRM. Endpoint:", agiledApiEndpoint);
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
      const errorData = await response.json().catch(() => null);
      console.error('CRM API error:', errorData);
      return {
        success: false,
        message: errorData?.message || `Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log('Successfully sent contact message to Agiled CRM:', data);

    return {
      success: true,
      message: 'Your message has been sent successfully!',
    };
  } catch (error: any) { // Add type hint for error
    console.error("Error in saveContactMessage function (outer try-catch):", error);
    return {
      success: false,
      message: 'Failed to send your message. Please try again later.',
    };
  }
}
