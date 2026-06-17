import type { CourierRegistrationForm } from "./schema";

const ACCEPTED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

export function validateCourierRegistrationForm(
  data: CourierRegistrationForm,
  simFile: File | null,
  stnkFile: File | null,
) {
  if (!data.name || !data.name.trim()) {
    throw new Error("Full Name is required");
  }

  if (!data.email || !data.email.includes("@")) {
    throw new Error("Invalid email format");
  }

  if (!data.password || data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!data.plateNumber || !data.plateNumber.trim()) {
    throw new Error("Plate number is required");
  }

  validateCourierDocument(simFile, "Driver License (SIM)");
  validateCourierDocument(stnkFile, "Vehicle Registration (STNK)");
}

export function validateCourierDocument(file: File | null, fieldName: string) {
  if (!file) {
    throw new Error(`Please upload your ${fieldName}`);
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error(`${fieldName} size must be less than 5MB`);
  }

  if (!ACCEPTED_DOCUMENT_TYPES.has(file.type)) {
    throw new Error(`Only PDF, JPG, or PNG files are allowed for ${fieldName}`);
  }
}
