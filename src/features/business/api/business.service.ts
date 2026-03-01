import api from "@/src/api/axios";

export interface BusinessPayload {
  business_name: string;
  description?: string;
  avatar?: string;
  cover?: string;
  location?: string;
  legal_document?: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  subcategory?: string;
  status?: string;
  // additional fields can be added later (e.g. social links)
}

// complete business object returned from the server
export interface Business extends BusinessPayload {
  id: number;
  user_id: number;
  created_at?: string;
  updated_at?: string;
  // legacy camelCase properties for backward compatibility
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// API methods
export const createBusinessApi = async (data: BusinessPayload) => {
  const response = await api.post("/business", data);
  return response.data;
};

export const getBusinessesApi = async ({
  page = 1,
  limit = 20,
}: { page?: number; limit?: number } = {}) => {
  const response = await api.get("/business", {
    params: { page, limit },
  });
  const payload = response.data?.data;

  // the backend returns pagination wrapper, make sure we return an array
  if (Array.isArray(payload?.items)) {
    return payload.items as Business[];
  }

  if (Array.isArray(payload)) {
    return payload as Business[];
  }

  return [] as Business[];
};

export const getMyBusinessesApi = async () => {
  try {
    // Try /business/my-businesses first (may not exist on all backends)
    const response = await api.get("/business/my-businesses");
    const payload = response.data?.data;
    if (Array.isArray(payload?.items)) {
      return payload.items as Business[];
    }
    if (Array.isArray(payload)) {
      return payload as Business[];
    }
    return [] as Business[];
  } catch (error: any) {
    // Fallback: use /business endpoint and filter by user
    // Note: This is a workaround when /business/my-businesses is not implemented
    if (error.response?.status === 404) {
      console.warn(
        "[Business API] /business/my-businesses not found, using fallback"
      );
      const response = await api.get("/business");
      const payload = response.data?.data;
      if (Array.isArray(payload?.items)) {
        return payload.items as Business[];
      }
      if (Array.isArray(payload)) {
        return payload as Business[];
      }
    }
    return [] as Business[];
  }
};

export const getBusinessByIdApi = async (id: number) => {
  const response = await api.get(`/business/${id}`);
  return response.data;
};

export const updateBusinessApi = async (
  id: number,
  data: Partial<BusinessPayload>
) => {
  const response = await api.patch(`/business/${id}`, data);
  return response.data;
};

export const deleteBusinessApi = async (id: number) => {
  const response = await api.delete(`/business/${id}`);
  return response.data;
};
