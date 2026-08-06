/**
 * Generates responsive HTML content for Candidate Application Status updates.
 * Supports: 'shortlisted', 'interview' / 'interviewing', 'hired', and 'rejected'.
 *
 * @param {Object} data
 * @param {string} data.candidateName - Candidate's name
 * @param {string} data.jobTitle - Title of the job
 * @param {string} [data.companyName] - Hiring company or employer name
 * @param {'shortlisted'|'interview'|'interviewing'|'hired'|'rejected'|string} data.status - The new status
 * @param {string} [data.actionLink] - URL to view application/dashboard
 * @param {string} [data.appName] - Application name
 * @returns {string} Clean modern HTML string
 */
export const candidateStatusTemplate = ({
  candidateName = "Candidate",
  jobTitle = "your applied position",
  companyName = "the employer",
  status = "shortlisted",
  actionLink = "http://localhost:5173",
  appName = "JobBridge",
} = {}) => {
  const normalizedStatus = status.toLowerCase();

  let headerGradient = "linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)";
  let badgeBg = "#f3e8ff";
  let badgeColor = "#6b21a8";
  let badgeText = "Application Shortlisted";
  let titleText = "Great News! Your Application Has Been Shortlisted 🌟";
  let mainMessage = `Congratulations! Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been shortlisted by the hiring team.`;

  if (normalizedStatus === "interview" || normalizedStatus === "interviewing") {
    headerGradient = "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)";
    badgeBg = "#dbeafe";
    badgeColor = "#1e40af";
    badgeText = "Interview Scheduled";
    titleText = "Interview Invitation! 🎯";
    mainMessage = `Congratulations! <strong>${companyName}</strong> would like to invite you for an interview regarding your application for the position of <strong>${jobTitle}</strong>.`;
  } else if (normalizedStatus === "hired") {
    headerGradient = "linear-gradient(135deg, #059669 0%, #10b981 100%)";
    badgeBg = "#d1fae5";
    badgeColor = "#065f46";
    badgeText = "Application Offered / Hired";
    titleText = "You've Been Hired! 🎉";
    mainMessage = `Fantastic news! <strong>${companyName}</strong> has selected you for the position of <strong>${jobTitle}</strong>! They will reach out to you with next steps.`;
  } else if (normalizedStatus === "rejected") {
    headerGradient = "linear-gradient(135deg, #475569 0%, #64748b 100%)";
    badgeBg = "#f1f5f9";
    badgeColor = "#334155";
    badgeText = "Application Update";
    titleText = "Update on Your Application for " + jobTitle;
    mainMessage = `Thank you for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>. After careful review, the hiring team has decided to move forward with other candidates at this time. We encourage you to apply for future opportunities on ${appName}!`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Update - ${appName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: ${headerGradient}; padding: 36px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">${appName}</h1>
              <p style="color: #f3e8ff; margin: 8px 0 0 0; font-size: 14px;">Application Status Update</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <div style="display: inline-block; background-color: ${badgeBg}; color: ${badgeColor}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px;">
                ${badgeText}
              </div>

              <h2 style="margin: 0 0 16px 0; font-size: 22px; color: #0f172a;">${titleText}</h2>
              
              <p style="margin: 0 0 20px 0; line-height: 1.6; font-size: 15px; color: #475569;">
                Hi ${candidateName},
              </p>

              <p style="margin: 0 0 24px 0; line-height: 1.6; font-size: 15px; color: #334155;">
                ${mainMessage}
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-size: 14px; color: #64748b; padding-bottom: 8px;">Job Role:</td>
                    <td style="font-size: 14px; color: #0f172a; font-weight: 600; padding-bottom: 8px; text-align: right;">${jobTitle}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #64748b;">Company / Employer:</td>
                    <td style="font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">${companyName}</td>
                  </tr>
                </table>
              </div>

              ${
                actionLink
                  ? `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
                      <tr>
                        <td align="center" style="border-radius: 8px; background-color: #2563eb;">
                          <a href="${actionLink}" target="_blank" style="font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; display: inline-block;">
                            View Dashboard &rarr;
                          </a>
                        </td>
                      </tr>
                    </table>`
                  : ""
              }

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                Thank you for using JobBridge!
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
