import type { SellerRegistrationForm } from "./schema";

const ACCEPTED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

export function validateSellerRegistrationForm(data: SellerRegistrationForm, file: File | null) {
  if (!data.name.trim()) {
    throw new Error("Full Name is required");
  }

  if (!data.email.includes("@")) {
    throw new Error("Invalid email format");
  }

  if (!data.businessName.trim()) {
    throw new Error("Business Name is required");
  }

  if (data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  validateSellerLegalDocument(file);
}

export function validateSellerLegalDocument(file: File | null) {
  if (!file) {
    throw new Error("Please upload your NIB / Operating License");
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("File size must be less than 5MB");
  }

  if (!ACCEPTED_DOCUMENT_TYPES.has(file.type)) {
    throw new Error("Only PDF, JPG, or PNG files are allowed");
  }
}
