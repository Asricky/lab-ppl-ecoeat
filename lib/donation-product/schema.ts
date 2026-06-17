export const PRODUCTS_TABLE = "products";
export const PRODUCT_IMAGES_TABLE = "product_images";

export interface DonationProductInsert {
  id: string;
  seller_profile_id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  portion_quantity: number;
  expiry_date: string; // ISO string for timestamp
  is_donation: boolean;
  target_lks_id: string | null;
  status: string;
  created_at: string; // ISO string
}

export interface ProductImageInsert {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
}

export interface DonationProductFormFields {
  title: string;
  portionQuantity: number;
  category: string;
  expiryText: string;
  description: string;
}
