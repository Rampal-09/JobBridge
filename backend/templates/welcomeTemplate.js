/**
 * Generates responsive HTML content for Welcome Email.
 *
 * @param {Object} data
 * @param {string} data.name - Recipient's name
 * @param {string} [data.actionLink] - Optional call to action URL (e.g. login or explore jobs)
 * @param {string} [data.appName] - Application name (defaults to 'JobBridge')
 * @returns {string} Clean modern HTML string
 */
export const welcomeTemplate = ({
  name = "User",
  actionLink = "http://localhost:5173",
  appName = "JobBridge",
} = {}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 36px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${appName}</h1>
              <p style="color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px;">Connecting Talent with Opportunity</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 22px; color: #0f172a; font-weight: 600;">Welcome, ${name}! 🎉</h2>
              <p style="margin: 0 0 20px 0; line-height: 1.6; font-size: 15px; color: #475569;">
                We are thrilled to have you join <strong>${appName}</strong>. Whether you are searching for your next dream role or looking to discover top tech talent, our platform is built to make the process effortless.
              </p>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px 20px; border-radius: 4px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
                  🚀 <strong>Getting Started:</strong> Complete your profile to get personalized job matches or post your active job listings.
                </p>
              </div>

              ${
                actionLink
                  ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #4f46e5;">
                          <a href="${actionLink}" target="_blank" style="font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block;">
                            Explore Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>`
                  : ""
              }

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                If you have any questions, feel free to reply to this email. Our team is always here to support you.
              </p>
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
