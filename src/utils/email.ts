import nodemailer from 'nodemailer';

const createTransporter = async () => {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER !== 'ethereal_user') {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal test account:', testAccount.user, testAccount.pass);
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
};

export const sendVerificationEmail = async (email: string, name: string, token: string): Promise<void> => {
  const transporter = await createTransporter();
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const info = await transporter.sendMail({
    from: `"JewelRocX" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify your JewelRocX account',
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF6F0;padding:40px;border-radius:8px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:32px;color:#1A1A1A;letter-spacing:4px;margin:0;">JEWELROCX</h1>
          <div style="height:2px;background:linear-gradient(90deg,transparent,#C9A96E,transparent);margin:12px 0;"></div>
        </div>
        <h2 style="color:#1A1A1A;font-size:22px;">Hello, ${name}</h2>
        <p style="color:#4A4A4A;font-size:16px;line-height:1.7;">Thank you for joining JewelRocX. Please verify your email address to complete your registration.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${verifyUrl}" style="background:linear-gradient(135deg,#C9A96E,#A07850);color:#fff;padding:14px 36px;border-radius:4px;text-decoration:none;font-size:16px;letter-spacing:1px;display:inline-block;">Verify Email Address</a>
        </div>
        <p style="color:#888;font-size:13px;">This link expires in 24 hours. If you did not create an account, please ignore this email.</p>
        <div style="border-top:1px solid #E8D5B0;margin-top:32px;padding-top:16px;text-align:center;">
          <p style="color:#C9A96E;font-size:12px;letter-spacing:2px;">TIMELESS ELEGANCE</p>
        </div>
      </div>
    `,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('Verification email preview URL:', nodemailer.getTestMessageUrl(info));
  }
};

export const sendPasswordResetEmail = async (email: string, name: string, token: string): Promise<void> => {
  const transporter = await createTransporter();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: `"JewelRocX" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset your JewelRocX password',
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;background:#FAF6F0;padding:40px;border-radius:8px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="font-size:32px;color:#1A1A1A;letter-spacing:4px;margin:0;">JEWELROCX</h1>
        </div>
        <h2 style="color:#1A1A1A;">Password Reset Request</h2>
        <p style="color:#4A4A4A;line-height:1.7;">Hello ${name}, we received a request to reset your password.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:linear-gradient(135deg,#C9A96E,#A07850);color:#fff;padding:14px 36px;border-radius:4px;text-decoration:none;font-size:16px;display:inline-block;">Reset Password</a>
        </div>
        <p style="color:#888;font-size:13px;">This link expires in 1 hour. If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  });
};
