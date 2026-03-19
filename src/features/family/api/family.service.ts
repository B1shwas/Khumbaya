import api from "@/src/api/axios";
import { User } from "@/store/AuthStore";

export interface FamilyCreatePayload {
  familyName: string;
}

export interface Family {
  id: number;
  familyName: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FamilyMember = User;

export type AddFamilyMemberPayload = {
  phone: string | undefined;
  username: string;
  email: string | undefined;
  relation: string;
  dob: Date;
  foodPreference: string;
};

export type UpdateFamilyMemberPayload = Partial<FamilyMember>;

export const createFamilyApi = async (data: FamilyCreatePayload) => {
  const response = await api.post("/family", data);
  return response.data;
};

export const updateFamilyApi = async (id: number, data: FamilyCreatePayload) => {
  const response = await api.patch(`/family/${id}`, data);
  return response.data;
};

export const deleteFamilyApi = async (id: number) => {
  const response = await api.delete(`/family/${id}`);
  return response.data;
};

export const getFamilyByIdApi = async (id: number) => {
  const response = await api.get(`/family/${id}`);
  return response.data;
};

export const addFamilyMemberApi = async (
  familyId: number,
  data: AddFamilyMemberPayload
) => {
  const response = await api.post(`/family/${familyId}/member`, { ...data, name: data.username });
  return response.data;
};

export const getFamilyMembersApi = async (familyId: number) => {
  const response = await api.get(`/family/${familyId}/member`);
  const payload = response.data?.data;

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [] as FamilyMember[];
};

export const updateFamilyMemberApi = async (
  familyId: number,
  memberId: number,
  data: UpdateFamilyMemberPayload
) => {
  console.log("thiis it the u🍈🍈🍈🍈🍈🍈🍈🍈ser information that is going to be updated in the backend in the system of the user in thiis ", data);
  const response = await api.patch(
    `/family/${familyId}/member/${memberId}`,
    data
  );
  return response.data;
};

export const deleteFamilyMemberApi = async (
  familyId: number,
  memberId: number
) => {
  const response = await api.delete(`/family/${familyId}/member/${memberId}`);
  return response.data;
};

export const getFamilyByUserIdApi = async () => {
  const response = await api.get(`/family`);
  return response.data;
};
