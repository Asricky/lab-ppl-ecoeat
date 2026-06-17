import { type DonationProductFormFields } from "./schema";
import { validateDonationProductForm } from "./validation";

export async function addDonationProduct(
  fields: DonationProductFormFields,
  imageFile: File | null,
  userId: string
): Promise<{ product: any; error?: string }> {
  validateDonationProductForm(fields);

  if (!userId) {
    throw new Error("User ID tidak valid. Silakan login kembali.");
  }

  const formData = new FormData();
  formData.append("title", fields.title.trim());
  formData.append("portionQuantity", fields.portionQuantity.toString());
  formData.append("category", fields.category.trim());
  formData.append("expiryText", fields.expiryText.trim());
  formData.append("description", fields.description?.trim() || "");
  formData.append("userId", userId);
  
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }

  const response = await fetch("/api/seller/donations/products", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gagal menambahkan produk donasi.");
  }

  return { product: data.product };
}
