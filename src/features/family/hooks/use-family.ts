import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFamilyMemberApi,
  createFamilyApi,
  deleteFamilyApi,
  deleteFamilyMemberApi,
  FamilyMemberPayload,
  getFamilyByIdApi,
  getFamilyByUserIdApi,
  getFamilyMembersApi,
  updateFamilyApi,
  updateFamilyMemberApi,
} from "../api/family.service";

export const useCreateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamilyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family-user"] });
    },
  });
};

export const useGetFamilyById = (familyId?: number) => {
  return useQuery({
    queryKey: ["family", familyId],
    queryFn: () => getFamilyByIdApi(familyId as number),
    enabled: typeof familyId === "number",
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetFamilyByUserId = () => {
  return useQuery({
    queryKey: ["family-user"],
    queryFn: getFamilyByUserIdApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useUpdateFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFamilyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family"] });
    },
  });
};

export const useDeleteFamily = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFamilyApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family"] });
      queryClient.invalidateQueries({ queryKey: ["family-members"] });
    },
  });
};

type AddFamilyMemberInput = {
  familyId: number;
  data: FamilyMemberPayload;
};

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, data }: AddFamilyMemberInput) =>
      addFamilyMemberApi(familyId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["family-members", variables.familyId],
      });
    },
  });
};

export const useGetFamilyMembers = (familyId?: number) => {
  return useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => getFamilyMembersApi(familyId as number),
    enabled: typeof familyId === "number",
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

type UpdateFamilyMemberInput = {
  familyId: number;
  memberId: number;
  data: Partial<FamilyMemberPayload>;
};

export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, memberId, data }: UpdateFamilyMemberInput) =>
      updateFamilyMemberApi(familyId, memberId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["family-members", variables.familyId],
      });
    },
  });
};

type DeleteFamilyMemberInput = {
  familyId: number;
  memberId: number;
};

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, memberId }: DeleteFamilyMemberInput) =>
      deleteFamilyMemberApi(familyId, memberId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["family-members", variables.familyId],
      });
    },
  });
};
