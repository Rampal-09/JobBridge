import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ Warning: RESEND_API_KEY is not defined in environment variables. Email functionality will fail until it is configured."
  );
}

export const resend = new Resend(apiKey || "dummy_key_for_initialization");

export const EMAIL_FROM =
  process.env.EMAIL_FROM || "JobBridge <onboarding@resend.dev>";
