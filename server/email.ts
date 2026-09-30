import nodemailer from "nodemailer";

export function isPasswordResetEmailConfigured() {
  const hasCredentials = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const hasPartialCredentials = Boolean(process.env.SMTP_USER) !== Boolean(process.env.SMTP_PASS);

  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM)
    && (hasCredentials || !hasPartialCredentials);
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;

  if (!isPasswordResetEmailConfigured() || !host || !from) {
    throw new Error("SMTP_HOST and SMTP_FROM must be configured");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if ((user && !pass) || (!user && pass)) {
    throw new Error("SMTP_USER and SMTP_PASS must be configured together");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    ...(user && pass ? { auth: { user, pass } } : {}),
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your ResQMeal password",
    text: `We received a request to reset your ResQMeal password. Use this link within 30 minutes:\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>We received a request to reset your ResQMeal password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request this, you can ignore this email.</p>`,
  });
}