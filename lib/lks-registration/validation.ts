import type { LksRegistrationForm } from "./schema";

const ACCEPTED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

export function validateLksRegistrationForm(data: LksRegistrationForm, file: File | null) {
  if (!data.name || !data.name.trim()) {
    throw new Error("Full Name is required");
  }

  if (!data.email || !data.email.includes("@")) {
    throw new Error("Invalid email format");
  }

  if (!data.businessName || !data.businessName.trim()) {
    throw new Error("Organization Name is required");
  }

  if (!data.password || data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!data.lksType) {
    throw new Error("Please select LKS Type");
  }

  if (!data.legalPermit || !data.legalPermit.trim()) {
    throw new Error("Please enter LKS Legal Permit");
  }

  if (!data.capacity || Number(data.capacity) <= 0) {
    throw new Error("Please enter a valid capacity number");
  }

  if (!data.foodStorage) {
    throw new Error("Please select Food Storage type");
  }

  validateLksLegalDocument(file);
}

export function validateLksLegalDocument(file: File | null) {
  if (!file) {
    throw new Error("Please upload your Legal Document / SK Kemenkumham");
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  if (!ACCEPTED_DOCUMENT_TYPES.has(file.type)) {
    throw new Error("Only PDF, JPG, or PNG files are allowed");
  }
}
