export const USER_TABLE = "users";
export const SELLER_TABLE = "seller_profiles";

export const USER_TABLE_COLUMNS = [
  "id",
  "full_name",
  "email",
  "password_hash",
  "role",
  "avatar_url",
  "phone_number",
  "is_verified",
  "verification_status",
  "is_active",
  "suspended_at",
  "suspended_reason",
  "suspended_by",
  "last_login_at",
  "created_at",
  "updated_at",
] as const;

export const SELLER_TABLE_COLUMNS = [
  "id",
  "user_id",
  "business_name",
  "business_type",
  "legal_document_url",
  "verification_status",
  "reviewed_by",
  "reviewed_at",
  "operational_start",
  "operational_end",
  "created_at",
] as const;

export type UserTableColumn = (typeof USER_TABLE_COLUMNS)[number];
export type SellerTableColumn = (typeof SELLER_TABLE_COLUMNS)[number];

export type UserRole = "admin" | "seller" | "buyer" | "courier" | "lks";
export type UserVerificationStatus = "pending" | "approved" | "rejected";
export type SellerVerificationStatus = "pending" | "approved" | "rejected";

export interface EcoEatUserInsert extends Record<UserTableColumn, string | boolean | null> {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  avatar_url: string | null;
  phone_number: string | null;
  is_verified: boolean;
  verification_status: UserVerificationStatus;
  is_active: boolean;
  suspended_at: string | null;
  suspended_reason: string | null;
  suspended_by: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerProfileInsert extends Record<SellerTableColumn, string | null> {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  legal_document_url: string;
  verification_status: SellerVerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  operational_start: string | null;
  operational_end: string | null;
  created_at: string;
}

export interface SellerRegistrationForm {
  name: string;
  email: string;
  businessName: string;
  password: string;
}

export const DEFAULT_SELLER_PROFILE_FIELDS = {
  business_type: "food_business",
  verification_status: "pending" as SellerVerificationStatus,
  reviewed_by: null,
  reviewed_at: null,
  operational_start: null,
  operational_end: null,
};

export const DEFAULT_SELLER_USER_FIELDS = {
  role: "seller" as UserRole,
  avatar_url: null,
  phone_number: null,
  is_verified: false,
  verification_status: "pending" as UserVerificationStatus,
  is_active: true,
  suspended_at: null,
  suspended_reason: null,
  suspended_by: null,
  last_login_at: null,
};
