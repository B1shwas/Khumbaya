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
export enum BusinessCategoryEnum {
  Venue = "Venue",
  PhotographerVideographer = "Photographers & Videographer",
  MakeupArtist = "Makeup Artist",
  BridalGrooming = "Bridal Grooming",
  MehendiArtist = "Mehendi Artist",
  WeddingPlannersDecorator = "Wedding Planners & Decorator",
  MusicEntertainment = "Music & Entertainment",
  InvitesGift = "Invites & Gift",
  FoodCatering = "Food & Catering",
  PreWeddingShoot = "Pre Wedding Shoot",
  BridalWear = "Bridal Wear",
  JewelryAccessories = "Jewelry & Accessories",
  SecurityGuard = "Security Guard",
  Baraat = "Baraat"
}
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
