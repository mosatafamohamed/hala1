export type InquiryPayload = {
  fullName: string;
  company: string;
  workEmail: string;
  phoneNumber?: string;
  areaOfInterest: string;
  inquiryDetails: string;
  sourcePage?: string;
  productName?: string;
  categoryName?: string;
  honeypot?: string;
};

type ValidationResult =
  | { valid: true; data: Required<Omit<InquiryPayload, "honeypot">> & { honeypot: string } }
  | { valid: false; error: string };

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateInquiryPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { valid: false, error: "Invalid form payload." };
  }

  const raw = payload as Record<string, unknown>;
  const fullName = toText(raw.fullName);
  const company = toText(raw.company);
  const workEmail = toText(raw.workEmail);
  const phoneNumber = toText(raw.phoneNumber);
  const areaOfInterest = toText(raw.areaOfInterest);
  const inquiryDetails = toText(raw.inquiryDetails);
  const sourcePage = toText(raw.sourcePage);
  const productName = toText(raw.productName);
  const categoryName = toText(raw.categoryName);
  const honeypot = toText(raw.honeypot);

  if (fullName.length < 2 || fullName.length > 120) {
    return { valid: false, error: "Please provide a valid full name." };
  }
  if (company.length < 2 || company.length > 160) {
    return { valid: false, error: "Please provide a valid company name." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail) || workEmail.length > 180) {
    return { valid: false, error: "Please provide a valid work email." };
  }
  if (phoneNumber.length > 60) {
    return { valid: false, error: "Phone number is too long." };
  }
  if (areaOfInterest.length < 2 || areaOfInterest.length > 160) {
    return { valid: false, error: "Please select a valid area of interest." };
  }
  if (inquiryDetails.length < 8 || inquiryDetails.length > 4000) {
    return { valid: false, error: "Please provide more inquiry details." };
  }
  if (sourcePage.length > 500 || productName.length > 200 || categoryName.length > 200) {
    return { valid: false, error: "Submitted context is invalid." };
  }

  return {
    valid: true,
    data: {
      fullName,
      company,
      workEmail,
      phoneNumber,
      areaOfInterest,
      inquiryDetails,
      sourcePage,
      productName,
      categoryName,
      honeypot
    }
  };
}

function esc(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildInquirySubject(payload: Required<Omit<InquiryPayload, "honeypot">>) {
  if (payload.productName) {
    return `New 1Hala Product Inquiry: ${payload.productName}`;
  }
  return "New 1Hala Contact Inquiry";
}

export function buildInquiryHtml(payload: Required<Omit<InquiryPayload, "honeypot">>, timestampIso: string) {
  const optionalRows = [
    payload.phoneNumber ? `<tr><td><strong>Phone</strong></td><td>${esc(payload.phoneNumber)}</td></tr>` : "",
    payload.productName ? `<tr><td><strong>Product</strong></td><td>${esc(payload.productName)}</td></tr>` : "",
    payload.categoryName ? `<tr><td><strong>Category</strong></td><td>${esc(payload.categoryName)}</td></tr>` : "",
    payload.sourcePage ? `<tr><td><strong>Source Page</strong></td><td>${esc(payload.sourcePage)}</td></tr>` : ""
  ]
    .filter(Boolean)
    .join("");

  return `
    <div style="font-family: Inter, Arial, sans-serif; color:#1A3050; max-width: 760px; margin:0 auto;">
      <h2 style="margin-bottom: 14px;">New Inquiry from 1Hala Website</h2>
      <table cellpadding="8" cellspacing="0" border="0" style="width:100%; border-collapse: collapse; background:#F7FAFC; border:1px solid #D8E1E8;">
        <tr><td><strong>Full Name</strong></td><td>${esc(payload.fullName)}</td></tr>
        <tr><td><strong>Work Email</strong></td><td>${esc(payload.workEmail)}</td></tr>
        <tr><td><strong>Company</strong></td><td>${esc(payload.company)}</td></tr>
        <tr><td><strong>Area of Interest</strong></td><td>${esc(payload.areaOfInterest)}</td></tr>
        ${optionalRows}
        <tr><td><strong>Submitted At</strong></td><td>${esc(timestampIso)}</td></tr>
      </table>
      <div style="margin-top:16px; padding:14px; background:#ffffff; border:1px solid #D8E1E8;">
        <strong>Inquiry Details</strong>
        <p style="margin-top:8px; white-space:pre-wrap;">${esc(payload.inquiryDetails)}</p>
      </div>
    </div>
  `;
}

export function buildInquiryText(payload: Required<Omit<InquiryPayload, "honeypot">>, timestampIso: string) {
  return [
    "New Inquiry from 1Hala Website",
    `Full Name: ${payload.fullName}`,
    `Work Email: ${payload.workEmail}`,
    `Company: ${payload.company}`,
    `Phone: ${payload.phoneNumber || "-"}`,
    `Area of Interest: ${payload.areaOfInterest}`,
    `Product: ${payload.productName || "-"}`,
    `Category: ${payload.categoryName || "-"}`,
    `Source Page: ${payload.sourcePage || "-"}`,
    `Submitted At: ${timestampIso}`,
    "",
    "Inquiry Details:",
    payload.inquiryDetails
  ].join("\n");
}
