import {
  Business,
  BusinessCategory,
  BusinessRequest,
  BusinessReview,
  BusinessService,
} from "@/src/constants/business";

export type {
  Business,
  BusinessCategory,
  BusinessRequest,
  BusinessReview,
  BusinessService,
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
