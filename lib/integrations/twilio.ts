// lib/integrations/twilio.ts

import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

/**
 * Sends an SMS message using Twilio API.
 * Safe, reusable helper function.
 */
export async function sendMessage(to: string, content: string) {
  try {
    const message = await client.messages.create({
      body: content,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });
    return message;
  } catch (error) {
    console.error("Twilio send error:", error);
    throw error;
  }
}
