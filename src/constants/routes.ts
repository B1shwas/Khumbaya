export const ROUTES = {
  // Business routes
  BUSINESS_INFO: "/(protected)/(client-tabs)/profile/business-information",
  SERVICES_PRICING: "/(protected)/(client-tabs)/profile/services-pricing",
  PORTFOLIO: "/(protected)/(client-tabs)/profile/portfolio",
  VENDOR_VERIFICATION: "/(protected)/(client-tabs)/profile/vendor-verification",
  ANALYTICS: "/(protected)/(client-tabs)/profile/analytics",

  // Client stack routes
  EVENT_DETAILS: "/(protected)/(client-stack)/events/[eventId]",
  EVENT_CREATE: "/(protected)/(client-stack)/events/create",

  // Shared routes
  EXPLORE_VENDORS: "/(shared)/explore",
  VENDOR_PROFILE: "/(shared)/explore/[vendorId]",

  // Onboarding routes
  LOGIN: "/(onboarding)/login",
  USER_SIGNUP: "/(onboarding)/user-signup",
  VENDOR_SIGNUP: "/(onboarding)/vendor-signup",
};
