export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: "booked" | "pending" | "available";
  contact?: string;
  price?: string;
  rating?: number;
  imageUrl?: string;
  description?: string;
  location?: string;
  businessId?: string;
}

export interface VendorListResponse {
  items: Vendor[];
  total: number;
  page: number;
  limit: number;
}

export interface HireVendorPayload {
  vendorId: string;
  eventId: string;
  notes?: string;
}

export interface ContactVendorPayload {
  vendorId: string;
  message: string;
  contactType: "email" | "phone" | "message";
}
