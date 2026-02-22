import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER || process.env.GMAIL_USER,
    pass: process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    if (!process.env.EMAIL_USER && !process.env.GMAIL_USER) {
      console.log('📧 Email (Development Mode)');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('📧 Email would be sent in production mode');
      return { success: true };
    }

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}