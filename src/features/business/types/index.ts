import {
  Business,
  BusinessCategory,
  BusinessRequest,
  BusinessReview,
  BusinessService,
  VenueAttribute,
  OtherServiceAttribute,
} from "@/src/constants/business";

export type {
  Business,
  BusinessCategory,
  BusinessRequest,
  BusinessReview,
  BusinessService,
  VenueAttribute,
  OtherServiceAttribute,
};

export interface CreateBusinessPayload {
  business_name: string;
  category: BusinessCategory;
  description?: string;
  location?: string;
  coverImageUri?: string;
  categoryDetails?: Record<string, string | boolean>;
}

export interface UpdateBusinessPayload extends Partial<CreateBusinessPayload> {}
