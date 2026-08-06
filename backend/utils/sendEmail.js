import { resend, EMAIL_FROM } from "../config/resend.js";

/**
 * Generic reusable email sending function powered by Resend.
 *
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email address(es)
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body of the email
 * @param {string} [options.from] - Sender email address (defaults to process.env.EMAIL_FROM)
 * @returns {Promise<Object>} Resend API response object
 */
export const sendEmail = async ({ to, subject, html, from = EMAIL_FROM }) => {
  if (!to) {
    throw new Error("sendEmail: 'to' recipient email address is required.");
  }
  if (!subject) {
    throw new Error("sendEmail: 'subject' is required.");
  }
  if (!html) {
    throw new Error("sendEmail: 'html' content is required.");
  }

  try {
    const response = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (response.error) {
      console.error("❌ Resend API Error:", response.error);
      throw new Error(response.error.message || "Failed to send email via Resend.");
    }

    console.log(`✉️ Email successfully sent to ${to}. ID:`, response.data?.id);
    return response;
  } catch (error) {
    console.error(`❌ Error in sendEmail to ${to}:`, error.message);
    throw error;
  }
};
