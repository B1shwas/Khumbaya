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

export type CreateBusinessVenuePayload = {
  business_id: number | string;
} & UpdateBusinessVenuePayload;
