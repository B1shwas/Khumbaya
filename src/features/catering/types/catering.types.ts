export interface CateringMenu {
  id: string | number;
  name: string;
  description: string;
  type: string;
  menuType: string;
}

export interface CateringPlan {
  id: string | number;
  eventId?: number;
  vendorId?: number | null;
  name: string;
  per_plate_price: number;
  startDateTime: string;
  endDateTime: string;
  meal_type: string;
  createdAt?: string;
  updatedAt?: string;
  menus?: CateringMenu[];
}

export interface PaginatedCateringResponse {
  items: CateringPlan[];
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateCateringPayload {
  name: string;
  per_plate_price: number;
  startDateTime: string;
  endDateTime: string;
  meal_type: string;
  vendorId?: number;
}

export interface UpdateCateringPayload {
  name?: string;
  per_plate_price?: number;
  startDateTime?: string;
  endDateTime?: string;
  meal_type?: string;
  vendorId?: number | null;
}

export interface CreateMenuPayload {
  name: string;
  description: string;
  type: string;
  menuType: string;
}

export interface UpdateMenuPayload {
  name?: string;
  description?: string;
  type?: string;
  menuType?: string;
}
