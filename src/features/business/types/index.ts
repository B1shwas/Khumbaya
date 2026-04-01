import {
  Business,
  BusinessCategory,
  BusinessRequest,
  BusinessReview,
  BusinessService,
  OtherServiceAttribute,
  VenueAttribute,
} from "@/src/constants/business";

export type {
  Business,
  BusinessCategory,
  BusinessRequest,
  BusinessReview,
  BusinessService, OtherServiceAttribute, VenueAttribute
};

export interface CreateBusinessPayload {
  business_name: string;
  category: BusinessCategory;
  description?: string;
  location?: string;
  cover?: string;
  categoryDetails?: Record<string, string | boolean>;
}

export interface UpdateBusinessPayload extends Partial<CreateBusinessPayload> { }

export type UpdateBusinessServicePayload = Partial<
  Omit<OtherServiceAttribute, "id" | "business_id" | "createdAt" | "updatedAt">
>;

export type UpdateBusinessVenuePayload = Partial<
  Omit<VenueAttribute, "id" | "business_id" | "createdAt" | "updatedAt">
>;

export interface AddVenueFormState {
  venue_type: string;
  is_outDoor: boolean;
  parking: boolean;
  capacity: string;
  area_sqft: string;
  min_booking_hours: string;
  max_booking_hours: string;
  price_per_hour: string;
}

export type CreateVenuePayload = Omit<
  Partial<VenueAttribute>,
  "id" | "business_id" | "createdAt" | "updatedAt"
> & { venue_type: string };
