export const USER_TABLE = "users";
export const COURIER_TABLE = "courier_profiles";

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

export const COURIER_TABLE_COLUMNS = [
  "id",
  "user_id",
  "vehicle_type",
  "vehicle_plate_number",
  "driver_license_url",
  "vehicle_registration_url",
  "verification_status",
  "reviewed_by",
  "reviewed_at",
  "created_at",
] as const;

export type UserTableColumn = (typeof USER_TABLE_COLUMNS)[number];
export type CourierTableColumn = (typeof COURIER_TABLE_COLUMNS)[number];

export type UserRole = "admin" | "seller" | "buyer" | "courier" | "lks";
export type UserVerificationStatus = "pending" | "approved" | "rejected";
export type CourierVerificationStatus = "pending" | "approved" | "rejected";

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

export interface CourierProfileInsert extends Record<CourierTableColumn, string | null> {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_plate_number: string;
  driver_license_url: string;
  vehicle_registration_url: string;
  verification_status: CourierVerificationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface CourierRegistrationForm {
  name: string;
  email: string;
  password: string;
  vehicleType: string;
  plateNumber: string;
}

export const DEFAULT_COURIER_PROFILE_FIELDS = {
  verification_status: "pending" as CourierVerificationStatus,
  reviewed_by: null,
  reviewed_at: null,
};

export const DEFAULT_COURIER_USER_FIELDS = {
  role: "courier" as UserRole,
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
