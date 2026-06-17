import type { User } from "@/store/authStore";

import { type SellerRegistrationForm } from "./schema";
import { validateSellerRegistrationForm } from "./validation";

export async function registerSeller(
  formData: SellerRegistrationForm,
  legalDocument: File | null,
): Promise<{ user: User; token: string }> {
  validateSellerRegistrationForm(formData, legalDocument);

  const registrationFormData = new FormData();
  registrationFormData.append("name", formData.name);
  registrationFormData.append("email", formData.email);
  registrationFormData.append("businessName", formData.businessName);
  registrationFormData.append("password", formData.password);
  registrationFormData.append("legalDocument", legalDocument as File);

  const response = await fetch("/api/seller-registration", {
    method: "POST",
    body: registrationFormData,
  });
  const result = await response.json();

  if (!response.ok || !result.user) {
    throw new Error(result?.message || "Registration failed. Please try again.");
  }

  const user: User = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: "seller",
    ecoPayBalance: 0,
    avatar: undefined,
  };

  return { user, token: "" };
}
