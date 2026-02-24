import api from "@/src/api/axios";

export interface CREATEEVENT {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl:string; // will update this to have the object which will be handled in the bacend but for now we will use te string like it is now 
}


export interface EVENT {
  id: number;
  title: string;
  description: string;
  date: string;
location: string;
  imageUrl:string;
  // Other field are optional and can be added as needed
}

export const createEventApi = async (data: CREATEEVENT) => {
  const response = await api.post("/events", data);
  return response.data;
};

export const getEventsApi = async () => {
  const response = await api.get("/event");
  console.log(`This is the response of the event get api ${response.data.data.items}`);
  return response.data.data.items;
}

export const updateEventApi = async (id: number, data: Partial<CREATEEVENT>) => {
  const response = await api.patch(`/events/${id}`, data);
  return response.data;
};
export const deleteEventApi = async (id: number) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};
export const getEventGuest = async (id:number)=>{
  const response = await api.get(`/events/${id}/guests`);
  return response.data;
}