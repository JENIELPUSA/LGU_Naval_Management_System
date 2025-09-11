const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    pool: true,
    maxMessages: Infinity,
    maxConnections: 500,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `LGU Naval Management System <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LGU Event Management System</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fbfe;
            color: #2d3748;
        }
        
        .container {
            max-width: 600px;
            margin: 20px auto;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #0ea5e9, #ec4899);
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .system-name {
            color: white;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .tagline {
            color: rgba(255,255,255,0.9);
            font-size: 16px;
            margin: 8px 0 0;
            font-weight: 300;
        }
        
        .event-icon {
            font-size: 36px;
            margin-top: 15px;
            display: inline-block;
        }
        
        .content {
            padding: 40px;
            background: white;
            line-height: 1.7;
        }
        
        .greeting {
            color: #0f172a;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 25px;
            font-weight: 600;
        }
        
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #475569;
            line-height: 1.8;
        }
        
        .info-card {
            background: #fdf2f8;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
            border-left: 4px solid #ec4899;
        }
        
        .info-label {
            font-weight: 600;
            color: #9d174d;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .info-value {
            font-size: 18px;
            color: #0f172a;
            font-weight: 500;
        }
        
        .btn-container {
            text-align: center;
            margin: 35px 0 25px;
        }
        
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #0ea5e9, #ec4899);
            color: white !important;
            padding: 14px 35px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(2, 132, 199, 0.25);
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(236, 72, 153, 0.35);
        }
        
        .contact-info {
            text-align: center;
            margin-top: 30px;
            color: #64748b;
            font-size: 15px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer {
            background: #f1f5f9;
            padding: 25px;
            text-align: center;
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
        }
        
        .auto-msg {
            display: block;
            margin-top: 8px;
        }
        
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .greeting {
                font-size: 22px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="event-icon">📅</div>
            <h1 class="system-name">LGU Event Management System</h1>
            <p class="tagline">Bringing Communities Together Through Events</p>
        </div>
        
        <div class="content">
            <h2 class="greeting">Hello!</h2>
            <div class="message">
                ${options.text}
            </div>
            
            <div class="info-card">
                <span class="info-label">EVENT</span>
                <span class="info-value">${options.subject}</span>
            </div>
            
            <p class="message">
                For more information or assistance, please visit our portal or contact our support.
            </p>
            
            <div class="btn-container">
                <a href="https://mediumslateblue-woodcock-600772.hostingersite.com" class="btn">Access Event Portal</a>
            </div>
            
            <div class="contact-info">
                📍 Municipal Hall, Naval, Biliran<br>
                📞 (053) 500-1234 | 📱 0918 123 4567<br>
                ✉️ events@lgu-naval.gov.ph
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from the LGU Event Management System. Please do not reply to this email.</p>
            <span class="auto-msg">© 2025 LGU Naval Event Management System. All rights reserved.</span>
        </div>
    </div>
</body>
</html>
        `,
    attachments: options.attachments || [],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = sendEmail;
