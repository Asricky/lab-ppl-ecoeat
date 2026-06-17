export const USER_TABLE = "users";
export const BUYER_TABLE = "buyer_profiles";

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

export const BUYER_TABLE_COLUMNS = [
  "id",
  "user_id",
  "created_at",
] as const;

export type UserTableColumn = (typeof USER_TABLE_COLUMNS)[number];
export type BuyerTableColumn = (typeof BUYER_TABLE_COLUMNS)[number];

export type UserRole = "admin" | "seller" | "buyer" | "courier" | "lks";
export type UserVerificationStatus = "pending" | "approved" | "rejected";

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

export interface BuyerProfileInsert extends Record<BuyerTableColumn, string | null> {
  id: string;
  user_id: string;
  created_at: string;
}

export interface BuyerRegistrationForm {
  name: string;
  email: string;
  password: string;
}

export const DEFAULT_BUYER_USER_FIELDS = {
  role: "buyer" as UserRole,
  avatar_url: null,
  phone_number: null,
  is_verified: true, // Buyers do not need pending verification documents, verified by default
  verification_status: "approved" as UserVerificationStatus,
  is_active: true,
  suspended_at: null,
  suspended_reason: null,
  suspended_by: null,
  last_login_at: null,
};
