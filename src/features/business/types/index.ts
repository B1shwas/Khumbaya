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
