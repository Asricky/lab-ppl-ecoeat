import type { User } from "@/store/authStore";
import { type CourierRegistrationForm } from "./schema";
import { validateCourierRegistrationForm } from "./validation";

export async function registerCourier(
  formData: CourierRegistrationForm,
  simFile: File | null,
  stnkFile: File | null,
): Promise<{ user: User; token: string }> {
  validateCourierRegistrationForm(formData, simFile, stnkFile);

  const registrationFormData = new FormData();
  registrationFormData.append("name", formData.name);
  registrationFormData.append("email", formData.email);
  registrationFormData.append("password", formData.password);
  registrationFormData.append("vehicleType", formData.vehicleType);
  registrationFormData.append("plateNumber", formData.plateNumber);
  registrationFormData.append("simDocument", simFile as File);
  registrationFormData.append("stnkDocument", stnkFile as File);

  const response = await fetch("/api/courier-registration", {
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
    role: "kurir", // Frontend role mapping
    ecoPayBalance: 0,
    avatar: undefined,
  };

  return { user, token: result.token || "" };
}
