export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify Your Email</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px 40px;
      text-align: center;
    }

    .header-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .main-content {
      padding: 48px 40px;
      color: #1a202c;
    }

    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 20px;
      line-height: 1.4;
    }

    .text {
      font-size: 15px;
      line-height: 1.6;
      color: #4a5568;
      margin-bottom: 16px;
    }

    .email-highlight {
      color: #667eea;
      font-weight: 600;
      word-break: break-all;
    }

    .otp-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
      padding: 24px;
      margin: 32px 0;
      text-align: center;
    }

    .otp-label {
      font-size: 13px;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .otp-code {
      font-size: 36px;
      font-weight: 700;
      color: #2d3748;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      margin: 0;
      user-select: all;
    }

    .expiry-notice {
      background: #fff5f5;
      border-left: 4px solid #fc8181;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 4px;
    }

    .expiry-text {
      font-size: 14px;
      color: #742a2a;
      margin: 0;
      font-weight: 500;
    }

    .security-notice {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-top: 24px;
    }

    .security-title {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .security-text {
      font-size: 13px;
      line-height: 1.5;
      color: #718096;
      margin: 0;
    }

    .footer {
      background: #f7fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 13px;
      color: #718096;
      line-height: 1.5;
      margin: 0 0 8px 0;
    }

    .footer-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    @media only screen and (max-width: 600px) {
      .container {
        border-radius: 0;
        margin: 0 !important;
      }

      .header,
      .main-content,
      .footer {
        padding: 24px 20px !important;
      }

      .greeting {
        font-size: 18px;
      }

      .otp-code {
        font-size: 28px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>

<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7fa">
    <tr>
      <td style="padding: 40px 20px;" align="center">
        <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 class="header-title">Email Verification</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="main-content">
              <h2 class="greeting">Verify Your Email Address</h2>
              
              <p class="text">
                Thank you for signing up! You're almost there. To complete your registration and secure your account, please verify your email address:
              </p>
              
              <p class="text">
                <span class="email-highlight">{{email}}</span>
              </p>
              
              <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <p class="otp-code">{{otp}}</p>
              </div>
              
              <div class="expiry-notice">
                <p class="expiry-text">⏱️ This code expires in 10 minutes</p>
              </div>
              
              <p class="text">
                Simply enter this code in the verification page to activate your account and get started.
              </p>
              
              <div class="security-notice">
                <div class="security-title">🔒 Security Note</div>
                <p class="security-text">
                  If you didn't request this verification, please ignore this email or contact our support team if you have concerns about your account security.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p class="footer-text">
                Need help? <a href="#" class="footer-link">Contact Support</a>
              </p>
              <p class="footer-text">
                © 2025 Your Company. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Reset Your Password</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      padding: 32px 40px;
      text-align: center;
    }

    .header-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .main-content {
      padding: 48px 40px;
      color: #1a202c;
    }

    .greeting {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 20px;
      line-height: 1.4;
    }

    .text {
      font-size: 15px;
      line-height: 1.6;
      color: #4a5568;
      margin-bottom: 16px;
    }

    .email-highlight {
      color: #f5576c;
      font-weight: 600;
      word-break: break-all;
    }

    .otp-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border: 2px dashed #cbd5e0;
      border-radius: 12px;
      padding: 24px;
      margin: 32px 0;
      text-align: center;
    }

    .otp-label {
      font-size: 13px;
      font-weight: 600;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .otp-code {
      font-size: 36px;
      font-weight: 700;
      color: #2d3748;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      margin: 0;
      user-select: all;
    }

    .expiry-notice {
      background: #fff5f5;
      border-left: 4px solid #fc8181;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 4px;
    }

    .expiry-text {
      font-size: 14px;
      color: #742a2a;
      margin: 0;
      font-weight: 500;
    }

    .security-notice {
      background: #fffaf0;
      border: 1px solid #fbd38d;
      border-radius: 8px;
      padding: 20px;
      margin-top: 24px;
    }

    .security-title {
      font-size: 14px;
      font-weight: 600;
      color: #744210;
      margin-bottom: 8px;
    }

    .security-text {
      font-size: 13px;
      line-height: 1.5;
      color: #975a16;
      margin: 0;
    }

    .footer {
      background: #f7fafc;
      padding: 32px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      font-size: 13px;
      color: #718096;
      line-height: 1.5;
      margin: 0 0 8px 0;
    }

    .footer-link {
      color: #f5576c;
      text-decoration: none;
      font-weight: 500;
    }

    @media only screen and (max-width: 600px) {
      .container {
        border-radius: 0;
        margin: 0 !important;
      }

      .header,
      .main-content,
      .footer {
        padding: 24px 20px !important;
      }

      .greeting {
        font-size: 18px;
      }

      .otp-code {
        font-size: 28px;
        letter-spacing: 4px;
      }
    }
  </style>
</head>

<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f5f7fa">
    <tr>
      <td style="padding: 40px 20px;" align="center">
        <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 class="header-title">Password Reset Request</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="main-content">
              <h2 class="greeting">Reset Your Password</h2>
              
              <p class="text">
                We received a request to reset the password for your account associated with:
              </p>
              
              <p class="text">
                <span class="email-highlight">{{email}}</span>
              </p>
              
              <p class="text">
                Use the verification code below to proceed with resetting your password. If you didn't make this request, you can safely ignore this email.
              </p>
              
              <div class="otp-container">
                <div class="otp-label">Password Reset Code</div>
                <p class="otp-code">{{otp}}</p>
              </div>
              
              <div class="expiry-notice">
                <p class="expiry-text">⏱️ This code expires in 15 minutes</p>
              </div>
              
              <p class="text">
                Enter this code on the password reset page to create a new password for your account.
              </p>
              
              <div class="security-notice">
                <div class="security-title">⚠️ Important Security Information</div>
                <p class="security-text">
                  If you didn't request a password reset, please secure your account immediately by changing your password and contacting our support team. Someone may be trying to access your account.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p class="footer-text">
                Need help? <a href="#" class="footer-link">Contact Support</a>
              </p>
              <p class="footer-text">
                © 2025 Your Company. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;