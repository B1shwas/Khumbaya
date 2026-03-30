import api from "@/src/api/axios";
import { Business } from "@/src/constants/business";
import { CreateBusinessPayload, UpdateBusinessPayload } from "../types";

export const getBusinessListApi = async (): Promise<Business[]> => {
  const response = await api.get("/business");
  return response.data.data.items;
};

export const createBusinessApi = async (
  payload: CreateBusinessPayload
): Promise<Business> => {
  if (payload.coverImageUri) {
    const form = new FormData();
    form.append("business_name", payload.business_name);
    if (payload.description) form.append("description", payload.description);
    form.append("category", payload.category);
    if (payload.location) form.append("location", payload.location);
    form.append("cover", {
      uri: payload.coverImageUri,
      type: "image/jpeg",
      name: "cover.jpg",
    } as any);
    // Do NOT manually set Content-Type — React Native must auto-set it with the
    // multipart boundary, otherwise the server cannot parse the form fields.
    const response = await api.post("/business", form);
    console.log("createBusinessApi response:", response.data);
    return response.data.data;
  }
  const response = await api.post("/business", payload);
  console.log("createBusinessApi response:", response.data);
  return response.data.data;
};

export const getBusinessByIdApi = async (id: number | string): Promise<Business> => {
  const response = await api.get(`/business/${id}`);
  console.log("getBusinessByIdApi response:", response.data);

  return response.data.data.business_information;
};

export const updateBusinessApi = async (
  id: number | string,
  payload: UpdateBusinessPayload
): Promise<Business> => {
  const { coverImageUri, ...jsonPayload } = payload;

  if (coverImageUri) {
    const form = new FormData();
    if (jsonPayload.business_name) form.append("business_name", jsonPayload.business_name);
    if (jsonPayload.description)   form.append("description", jsonPayload.description);
    if (jsonPayload.category)      form.append("category", jsonPayload.category);
    if (jsonPayload.location)      form.append("location", jsonPayload.location);
    form.append("cover", {
      uri: coverImageUri,
      type: "image/jpeg",
      name: "cover.jpg",
    } as any);
    const response = await api.patch(`/business/${id}`, form);
    console.log("updateBusinessApi response:", response.data);
    return response.data.data;
  }

  const response = await api.patch(`/business/${id}`, jsonPayload);
  console.log("updateBusinessApi response:", response.data);
  return response.data.data;
};

export const deleteBusinessApi = async (id: number | string): Promise<void> => {
  console.log("deleteBusinessApi called with id:", id);

  await api.delete(`/business/${id}`);
};
