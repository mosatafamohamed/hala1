"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type InquiryFormProps = {
  interestOptions: string[];
  className?: string;
  sourcePage?: string;
  productName?: string;
  categoryName?: string;
};

type FormState = {
  fullName: string;
  company: string;
  workEmail: string;
  phoneNumber: string;
  areaOfInterest: string;
  inquiryDetails: string;
};

const initialState: FormState = {
  fullName: "",
  company: "",
  workEmail: "",
  phoneNumber: "",
  areaOfInterest: "",
  inquiryDetails: ""
};

type SubmissionState = "idle" | "loading" | "success" | "error";

export function InquiryForm({
  interestOptions,
  className,
  sourcePage,
  productName,
  categoryName
}: InquiryFormProps) {
  const pathname = usePathname();
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [feedback, setFeedback] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const isDisabled = submissionState === "loading";
  const formFields = useMemo(
    () => [
      { id: "fullName", label: "Full Name", type: "text", required: true },
      { id: "company", label: "Company", type: "text", required: true },
      { id: "workEmail", label: "Work Email", type: "email", required: true },
      { id: "phoneNumber", label: "Phone Number", type: "tel", required: false }
    ],
    []
  );

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formState.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!formState.company.trim()) nextErrors.company = "Company is required.";
    if (!formState.workEmail.trim()) nextErrors.workEmail = "Work email is required.";
    if (formState.workEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.workEmail.trim())) {
      nextErrors.workEmail = "Please enter a valid email address.";
    }
    if (!formState.areaOfInterest.trim()) nextErrors.areaOfInterest = "Please select an area.";
    if (!formState.inquiryDetails.trim()) nextErrors.inquiryDetails = "Please provide inquiry details.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    if (!validate()) {
      setSubmissionState("error");
      setFeedback("Please review the highlighted fields.");
      return;
    }

    setSubmissionState("loading");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formState,
          honeypot,
          sourcePage: sourcePage ?? (typeof window !== "undefined" ? window.location.href : pathname ?? "/"),
          productName,
          categoryName
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error ?? "Something went wrong. Please try again.");
      }

      setSubmissionState("success");
      setFeedback("Your inquiry has been sent successfully. Our team will contact you shortly.");
      setFormState(initialState);
      setHoneypot("");
      setErrors({});
    } catch (error) {
      setSubmissionState("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <form className={cn("space-y-4", className)} onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {formFields.map((field) => (
          <label key={field.id} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">
              {field.label}
            </span>
            <input
              required={field.required}
              type={field.type}
              value={formState[field.id as keyof FormState]}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, [field.id]: event.target.value }))
              }
              className={cn(
                "w-full rounded-soft border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/45 transition focus:border-bronze/55 focus:outline-none focus:ring-2 focus:ring-bronze/20",
                errors[field.id as keyof FormState] && "border-red-400"
              )}
              placeholder={field.label}
              disabled={isDisabled}
            />
            {errors[field.id as keyof FormState] ? (
              <p className="text-xs text-red-600">{errors[field.id as keyof FormState]}</p>
            ) : null}
          </label>
        ))}
      </div>

      <label className="hidden" aria-hidden="true">
        <span>Website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          name="website"
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">
          Area of Interest
        </span>
        <select
          value={formState.areaOfInterest}
          onChange={(event) => setFormState((prev) => ({ ...prev, areaOfInterest: event.target.value }))}
          className={cn(
            "w-full rounded-soft border border-border bg-white px-4 py-3 text-sm text-navy transition focus:border-bronze/55 focus:outline-none focus:ring-2 focus:ring-bronze/20",
            errors.areaOfInterest && "border-red-400"
          )}
          disabled={isDisabled}
        >
          <option value="">Select an area</option>
          {interestOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.areaOfInterest ? <p className="text-xs text-red-600">{errors.areaOfInterest}</p> : null}
      </label>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/70">
          Inquiry Details
        </span>
        <textarea
          rows={5}
          value={formState.inquiryDetails}
          onChange={(event) => setFormState((prev) => ({ ...prev, inquiryDetails: event.target.value }))}
          className={cn(
            "w-full rounded-soft border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/45 transition focus:border-bronze/55 focus:outline-none focus:ring-2 focus:ring-bronze/20",
            errors.inquiryDetails && "border-red-400"
          )}
          placeholder="Share project scope, quantity, destination, and timeline."
          disabled={isDisabled}
        />
        {errors.inquiryDetails ? <p className="text-xs text-red-600">{errors.inquiryDetails}</p> : null}
      </label>

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isDisabled}>
        {submissionState === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Inquiry
          </>
        ) : (
          <>
            Submit Inquiry
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </button>

      {feedback ? (
        <p
          className={cn(
            "rounded-soft border px-4 py-3 text-sm",
            submissionState === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-red-300 bg-red-50 text-red-700"
          )}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
