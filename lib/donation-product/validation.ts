import { type DonationProductFormFields } from "./schema";

export function validateDonationProductForm(fields: DonationProductFormFields) {
  if (!fields.title || !fields.title.trim()) {
    throw new Error("Nama produk wajib diisi");
  }

  if (fields.portionQuantity === undefined || fields.portionQuantity <= 0) {
    throw new Error("Jumlah porsi harus lebih besar dari 0");
  }

  if (!fields.category || !fields.category.trim()) {
    throw new Error("Kategori wajib dipilih");
  }

  if (!fields.expiryText || !fields.expiryText.trim()) {
    throw new Error("Informasi expired/expiry wajib diisi");
  }
}
