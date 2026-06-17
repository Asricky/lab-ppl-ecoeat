export const USER_TABLE = "users";
export const LKS_TABLE = "lks_profiles";

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

export const LKS_TABLE_COLUMNS = [
  "id",
  "user_id",
  "foundation_name",
  "lks_category",
  "legal_permit_number",
  "legal_document_url",
  "storage_type",
  "storage_capacity",
  "beneficiaries_count",
  "verification_status",
  "reviewed_by",
  "reviewed_at",
  "created_at",
] as const;

export type UserTableColumn = (typeof USER_TABLE_COLUMNS)[number];
export type LksTableColumn = (typeof LKS_TABLE_COLUMNS)[number];

export type UserRole = "admin" | "seller" | "buyer" | "courier" | "lks";
export type UserVerificationStatus = "pending" | "approved" | "rejected";
export type LksVerificationStatus = "pending" | "approved" | "rejected";

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

export interface LksProfileInsert extends Record<LksTableColumn, string | number | null> {
  id: string;
  user_id: string;
  foundation_name: string;
  lks_category: string;
  legal_permit_number: string;
  legal_document_url: string;
  storage_type: string | null;
  storage_capacity: number | null;
  beneficiaries_count: number | null;
  verification_status: LksVerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface LksRegistrationForm {
  name: string;
  email: string;
  businessName: string;
  password: string;
  lksType: string;
  legalPermit: string;
  capacity: string;
  foodStorage: string;
}

export const DEFAULT_LKS_PROFILE_FIELDS = {
  verification_status: "pending" as LksVerificationStatus,
  reviewed_by: null,
  reviewed_at: null,
};

export const DEFAULT_LKS_USER_FIELDS = {
  role: "lks" as UserRole,
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
