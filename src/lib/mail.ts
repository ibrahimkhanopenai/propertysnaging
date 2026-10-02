import "server-only";
import nodemailer from "nodemailer";

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail(o: { subject: string; text: string; html: string; replyTo?: string }) {
  if (!mailConfigured()) {
    console.warn("[mail] SMTP not configured — skipping email:", o.subject);
    return false;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.LEAD_NOTIFY_TO,
    replyTo: o.replyTo,
    subject: o.subject,
    text: o.text,
    html: o.html,
  });
  return true;
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
