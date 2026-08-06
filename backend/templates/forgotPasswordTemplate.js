/**
 * Generates responsive HTML content for Forgot Password Email.
 *
 * @param {Object} data
 * @param {string} data.name - Recipient's name
 * @param {string} data.resetLink - Password reset link URL
 * @param {string} [data.appName] - Application name
 * @returns {string} Clean modern HTML string
 */
export const forgotPasswordTemplate = ({
  name = "User",
  resetLink = "#",
  appName = "JobBridge",
} = {}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 36px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
              <p style="color: #fecaca; margin: 8px 0 0 0; font-size: 14px;">Password Reset Request</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #0f172a;">Forgot Your Password?</h2>
              <p style="margin: 0 0 20px 0; line-height: 1.6; font-size: 15px; color: #475569;">
                Hi ${name}, we received a request to reset your password for your <strong>${appName}</strong> account. Click the button below to choose a new password.
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #dc2626;">
                    <a href="${resetLink}" target="_blank" style="font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fff1f2; border-left: 4px solid #f43f5e; padding: 14px 18px; border-radius: 4px; margin-top: 24px;">
                <p style="margin: 0; font-size: 13px; color: #9f1239; line-height: 1.5;">
                  ⚠️ <strong>Security Note:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you suspect unauthorized activity.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
