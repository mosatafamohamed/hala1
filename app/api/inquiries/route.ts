import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import {
  buildInquiryHtml,
  buildInquirySubject,
  buildInquiryText,
  validateInquiryPayload
} from "@/lib/email/inquiries";
import { hasSupabaseServiceEnv } from "@/lib/supabase/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestCounts = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const existing = requestCounts.get(identifier);

  if (!existing || existing.resetAt <= now) {
    requestCounts.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return false;
  }

  existing.count += 1;
  requestCounts.set(identifier, existing);
  return existing.count > RATE_LIMIT_MAX_REQUESTS;
}

async function saveInquiry(input: {
  fullName: string;
  company: string;
  workEmail: string;
  phoneNumber: string;
  areaOfInterest: string;
  inquiryDetails: string;
  sourcePage: string;
  productName: string;
  categoryName: string;
  emailStatus: "sent" | "failed";
  emailError: string | null;
}) {
  if (!hasSupabaseServiceEnv()) {
    return;
  }

  try {
    const supabase = createSupabaseServiceClient();
    await supabase.from("inquiries").insert({
      full_name: input.fullName,
      company: input.company,
      work_email: input.workEmail,
      phone_number: input.phoneNumber || null,
      area_of_interest: input.areaOfInterest,
      inquiry_details: input.inquiryDetails,
      source_page: input.sourcePage || null,
      product_name: input.productName || null,
      category_name: input.categoryName || null,
      email_status: input.emailStatus,
      email_error: input.emailError
    });
  } catch {
    // Inquiry persistence is optional and should not break user flow.
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const payload = validateInquiryPayload(requestBody);
  if (!payload.valid) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  if (payload.data.honeypot) {
    // Honey pot hit: return success to avoid teaching bots about validation.
    return NextResponse.json({ success: true });
  }

  const gmailUser = process.env.GMAIL_USER ?? "";
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD ?? "";
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "";
  const fromName = process.env.CONTACT_FROM_NAME ?? "1Hala Website";

  if (!gmailUser || !gmailAppPassword || !toEmail) {
    return NextResponse.json(
      { error: "Inquiry service is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const timestampIso = new Date().toISOString();
  const subject = buildInquirySubject(payload.data);
  const html = buildInquiryHtml(payload.data, timestampIso);
  const text = buildInquiryText(payload.data, timestampIso);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword
    }
  });

  try {
    await transporter.sendMail({
      from: `${fromName} <${gmailUser}>`,
      to: toEmail,
      subject,
      html,
      text,
      replyTo: payload.data.workEmail
    });

    await saveInquiry({
      fullName: payload.data.fullName,
      company: payload.data.company,
      workEmail: payload.data.workEmail,
      phoneNumber: payload.data.phoneNumber,
      areaOfInterest: payload.data.areaOfInterest,
      inquiryDetails: payload.data.inquiryDetails,
      sourcePage: payload.data.sourcePage,
      productName: payload.data.productName,
      categoryName: payload.data.categoryName,
      emailStatus: "sent",
      emailError: null
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    await saveInquiry({
      fullName: payload.data.fullName,
      company: payload.data.company,
      workEmail: payload.data.workEmail,
      phoneNumber: payload.data.phoneNumber,
      areaOfInterest: payload.data.areaOfInterest,
      inquiryDetails: payload.data.inquiryDetails,
      sourcePage: payload.data.sourcePage,
      productName: payload.data.productName,
      categoryName: payload.data.categoryName,
      emailStatus: "failed",
      emailError: error instanceof Error ? error.message : "Unknown email error"
    });

    return NextResponse.json(
      { error: "We could not send your inquiry right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
