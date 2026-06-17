import type { BuyerRegistrationForm } from "./schema";

export function validateBuyerRegistrationForm(data: BuyerRegistrationForm) {
  if (!data.name || !data.name.trim()) {
    throw new Error("Full Name is required");
  }

  if (!data.email || !data.email.includes("@")) {
    throw new Error("Invalid email format");
  }

  if (!data.password || data.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
}
