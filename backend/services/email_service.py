import logging
import httpx
from utils.config import settings

logger = logging.getLogger("sarva_ai.email_service")

async def send_password_reset_email(recipient_email: str, reset_code: str, reset_url: str) -> bool:
    """
    Dispatches password reset email to recipient_email via Resend API.
    Renders a crisp, professional light-themed email template compatible across all email clients.
    """
    if not settings.RESEND_API_KEY:
        logger.warning("[EMAIL SERVICE] RESEND_API_KEY not configured. Skipping email dispatch.")
        print("[EMAIL SERVICE] RESEND_API_KEY missing in environment. Email dispatch skipped.")
        return False

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your SARVA AI password</title>
      <!--[if mso]>
      <style type="text/css">
        table {{ border-collapse: collapse; }}
        td {{ font-family: Arial, sans-serif !important; }}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
        <tr>
          <td align="center">
            <!-- Main Card Container -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05); overflow: hidden;">
              
              <!-- Brand Header Bar -->
              <tr>
                <td style="background-color: #0f172a; padding: 28px 32px; text-align: center;">
                  <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto;">
                    <tr>
                      <td style="background-color: #0284c7; border-radius: 10px; width: 36px; height: 36px; text-align: center; vertical-align: middle; font-size: 20px;">
                        ⚡
                      </td>
                      <td style="padding-left: 12px; text-align: left;">
                        <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; display: block;">
                          SARVA AI
                        </span>
                        <span style="font-size: 11px; font-weight: 600; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-top: 2px;">
                          Conversational Platform
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Card Body -->
              <tr>
                <td style="padding: 36px 32px 32px 32px;">
                  
                  <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">
                    Password Reset Request
                  </h2>

                  <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                    Hello,
                  </p>
                  
                  <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                    We received a request to reset your <strong>SARVA AI</strong> account password. Use the security code below to update your credentials:
                  </p>

                  <!-- Security Reset Code Container -->
                  <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 20px 16px; text-align: center; margin-bottom: 28px;">
                    <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">
                      Your Security Reset Code
                    </span>
                    <span style="font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, Monaco, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0284c7; display: block;">
                      {reset_code}
                    </span>
                  </div>

                  <!-- Direct CTA Button -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                    <tr>
                      <td align="center">
                        <a href="{reset_url}" target="_blank" style="background-color: #0284c7; color: #ffffff; display: inline-block; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 9999px; text-align: center; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3); border: 1px solid #0284c7;">
                          Reset Your Password →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiration Alert Box -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 12px 16px; font-size: 13px; color: #92400e; line-height: 1.5; text-align: center;">
                        ⏳ This security code and reset link will expire in <strong>15 minutes</strong>.
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <div style="border-top: 1px solid #e2e8f0; margin-bottom: 20px;"></div>

                  <!-- Security Disclaimer -->
                  <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #94a3b8; text-align: center;">
                    If you did not request a password reset, you can safely ignore this message. Your account remains secure and no changes have been made.
                  </p>

                </td>
              </tr>

              <!-- Card Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 20px 32px; text-align: center;">
                  <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #64748b;">
                    SARVA AI Platform
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                    © 2026 SARVA AI • Built with React & FastAPI
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    text_content = f"""Hello,

We received a request to reset your SARVA AI password.

Your security reset code is: {reset_code}

You can also reset your password directly by visiting this link:
{reset_url}

This link and code will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.
"""

    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "from": settings.EMAIL_FROM,
        "to": [recipient_email],
        "subject": "Reset your SARVA AI password",
        "html": html_content,
        "text": text_content
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers=headers,
                json=payload
            )
            if response.status_code in (200, 201):
                logger.info(f"[EMAIL SERVICE] Password reset email successfully dispatched to {recipient_email}")
                print(f"[EMAIL SERVICE] Password reset email successfully sent via Resend.")
                return True
            else:
                logger.error(f"[EMAIL SERVICE] Resend API error (Status {response.status_code}): {response.text}")
                print(f"[EMAIL SERVICE] Resend API error ({response.status_code}).")
                return False
    except Exception as e:
        logger.error(f"[EMAIL SERVICE] Failed to send password reset email: {str(e)}")
        print(f"[EMAIL SERVICE] Exception during email dispatch.")
        return False
