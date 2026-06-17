import type { User } from "@/store/authStore";
import { type LksRegistrationForm } from "./schema";
import { validateLksRegistrationForm } from "./validation";

export async function registerLks(
  formData: LksRegistrationForm,
  legalDocument: File | null,
): Promise<{ user: User; token: string }> {
  validateLksRegistrationForm(formData, legalDocument);

  const registrationFormData = new FormData();
  registrationFormData.append("name", formData.name);
  registrationFormData.append("email", formData.email);
  registrationFormData.append("businessName", formData.businessName);
  registrationFormData.append("password", formData.password);
  registrationFormData.append("lksType", formData.lksType);
  registrationFormData.append("legalPermit", formData.legalPermit);
  registrationFormData.append("capacity", formData.capacity);
  registrationFormData.append("foodStorage", formData.foodStorage);
  registrationFormData.append("legalDocument", legalDocument as File);

  const response = await fetch("/api/lks-registration", {
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
    role: "lks-panti", // Frontend role mapping
    ecoPayBalance: 0,
    avatar: undefined,
  };

  return { user, token: result.token || "" };
}
