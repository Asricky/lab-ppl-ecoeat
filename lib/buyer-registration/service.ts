import type { User } from "@/store/authStore";
import { type BuyerRegistrationForm } from "./schema";
import { validateBuyerRegistrationForm } from "./validation";

export async function registerBuyer(
  formData: BuyerRegistrationForm,
): Promise<{ user: User; token: string }> {
  validateBuyerRegistrationForm(formData);

  const response = await fetch("/api/buyer-registration", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const result = await response.json();

  if (!response.ok || !result.user) {
    throw new Error(result?.message || "Registration failed. Please try again.");
  }

  const user: User = {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: "buyer",
    ecoPayBalance: 0,
    avatar: undefined,
  };

  return { user, token: result.token || "" };
}
