// ─── Types ────────────────────────────────────────────────────────────────────

export type MealType =
  | "Breakfast"
  | "Lunch"
  | "High Tea"
  | "Dinner"
  | "Late Night";

export interface CateringColumn {
  id: number;
  eventId: number;
  vendorId: number | null;
  name: string;
  per_plate_price: string;
  startDateTime: Date | string;
  endDateTime: Date | string;
  meal_type: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CateringDetail extends CateringColumn {}

export interface CateringListResponse {
  items: CateringColumn[];
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateCateringPayload {
  name: string;
  per_plate_price: string;
  startDateTime: string | Date;
  endDateTime: string | Date;
  meal_type: string;
  vendorId?: number | null;
}

export interface UpdateCateringPayload {
  name?: string;
  per_plate_price?: string;
  startDateTime?: string | Date;
  endDateTime?: string | Date;
  meal_type?: string;
  vendorId?: number | null;
}
