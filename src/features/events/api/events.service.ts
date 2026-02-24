import api from "@/src/api/axios";

export interface CREATEEVENT {
  title: string;
  description?: string;
  type?: string;
  startDate?: string;
  date?: string;
  endDate?: string;
  budget?: number;
  theme?: string;
  parentId?: number;
  location?: string;
  role?: string;
  imageUrl?: string;
}


export interface EVENT {
  id: number;
  title: string;
  description?: string;
  type?: string;
  startDate?: string;
  date?: string;
  endDate?: string;
  budget?: number;
  theme?: string;
  parentId?: number;
  location?: string;
  role?: string;
  status?: string;
  organizer?: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
  eventMembershipId?: number;
}

export const createEventApi = async (data: CREATEEVENT) => {
  const response = await api.post("/event", data);
  return response.data;
};

export const getEventsApi = async () => {
  const response = await api.get("/event");
  const payload = response.data?.data;

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }


  return [];
}

export const updateEventApi = async (id: number, data: Partial<CREATEEVENT>) => {
  const response = await api.patch(`/event/${id}`, data);
  return response.data;
};
export const deleteEventApi = async (id: number) => {
  const response = await api.delete(`/event/${id}`);
  return response.data;
};
export const getEventGuest = async (id:number)=>{
  const response = await api.get(`/event/${id}/guests`);
  return response.data;
}