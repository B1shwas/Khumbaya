import api from "@/src/api/axios";

export interface FamilyPayload {
  familyName: string;
}

export interface Family {
  id: number;
  familyName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FamilyMemberPayload {
  relation: string;
  dob: string;
  name: string;
  email: string;
}

export interface FamilyMember {
  id: number;
  familyId: number;
  relation: string;
  dob: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export const createFamilyApi = async (data: FamilyPayload) => {
  const response = await api.post("/family", data);
  return response.data;
};

export const updateFamilyApi = async (data: FamilyPayload) => {
  const response = await api.patch("/family", data);
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
  data: FamilyMemberPayload
) => {
  const response = await api.post(`/family/${familyId}/member`, data);
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
  data: Partial<FamilyMemberPayload>
) => {
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
