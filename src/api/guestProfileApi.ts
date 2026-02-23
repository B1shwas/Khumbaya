// Guest Profile API Service
import axios from "@/src/api/axios";
import {
    FamilyMember,
    FamilyMemberFormData,
    FamilyMemberResponse,
    GuestProfileFormData,
    GuestProfileListResponse,
    GuestProfileResponse
} from "@/src/types/guest";

const GUEST_PROFILE_API = "/guest-profile";

// Guest Profile APIs
export const guestProfileApi = {
  // Get current user's guest profile
  getMyProfile: async (): Promise<GuestProfileResponse> => {
    const response = await axios.get<GuestProfileResponse>(
      `${GUEST_PROFILE_API}/me`
    );
    return response.data;
  },

  // Get guest profile by ID (admin view)
  getProfileById: async (profileId: string): Promise<GuestProfileResponse> => {
    const response = await axios.get<GuestProfileResponse>(
      `${GUEST_PROFILE_API}/${profileId}`
    );
    return response.data;
  },

  // Get all guest profiles (admin view)
  getAllProfiles: async (
    page = 1,
    limit = 20
  ): Promise<GuestProfileListResponse> => {
    const response = await axios.get<GuestProfileListResponse>(
      `${GUEST_PROFILE_API}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Create or update guest profile
  saveProfile: async (
    data: GuestProfileFormData
  ): Promise<GuestProfileResponse> => {
    const response = await axios.post<GuestProfileResponse>(
      `${GUEST_PROFILE_API}`,
      data
    );
    return response.data;
  },

  // Update guest profile
  updateProfile: async (
    profileId: string,
    data: Partial<GuestProfileFormData>
  ): Promise<GuestProfileResponse> => {
    const response = await axios.put<GuestProfileResponse>(
      `${GUEST_PROFILE_API}/${profileId}`,
      data
    );
    return response.data;
  },

  // Upload identity proof document
  uploadIdentityProof: async (
    profileId: string,
    document: FormData
  ): Promise<{ documentUri: string }> => {
    const response = await axios.post<{ documentUri: string }>(
      `${GUEST_PROFILE_API}/${profileId}/identity/upload`,
      document,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// Family Member APIs
export const familyMemberApi = {
  // Add a family member
  addFamilyMember: async (
    profileId: string,
    data: FamilyMemberFormData
  ): Promise<FamilyMemberResponse> => {
    const response = await axios.post<FamilyMemberResponse>(
      `${GUEST_PROFILE_API}/${profileId}/family-members`,
      data
    );
    return response.data;
  },

  // Update a family member
  updateFamilyMember: async (
    profileId: string,
    memberId: string,
    data: Partial<FamilyMemberFormData>
  ): Promise<FamilyMemberResponse> => {
    const response = await axios.put<FamilyMemberResponse>(
      `${GUEST_PROFILE_API}/${profileId}/family-members/${memberId}`,
      data
    );
    return response.data;
  },

  // Delete a family member
  deleteFamilyMember: async (
    profileId: string,
    memberId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${GUEST_PROFILE_API}/${profileId}/family-members/${memberId}`
    );
    return response.data;
  },

  // Get all family members
  getFamilyMembers: async (
    profileId: string
  ): Promise<{ success: boolean; data: FamilyMember[] }> => {
    const response = await axios.get<{
      success: boolean;
      data: FamilyMember[];
    }>(`${GUEST_PROFILE_API}/${profileId}/family-members`);
    return response.data;
  },

  // Upload identity proof for family member
  uploadFamilyMemberIdentityProof: async (
    profileId: string,
    memberId: string,
    document: FormData
  ): Promise<{ documentUri: string }> => {
    const response = await axios.post<{ documentUri: string }>(
      `${GUEST_PROFILE_API}/${profileId}/family-members/${memberId}/identity/upload`,
      document,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

// Room Allocation APIs
export const roomAllocationApi = {
  // Get room allocation for a profile
  getRoomAllocation: async (
    profileId: string
  ): Promise<{ allocated: boolean; roomNumber?: string; notes?: string }> => {
    const response = await axios.get(
      `${GUEST_PROFILE_API}/${profileId}/room-allocation`
    );
    return response.data;
  },

  // Allocate room (admin only)
  allocateRoom: async (
    profileId: string,
    roomNumber: string,
    notes?: string
  ): Promise<{ success: boolean }> => {
    const response = await axios.post<{ success: boolean }>(
      `${GUEST_PROFILE_API}/${profileId}/room-allocation`,
      { roomNumber, notes }
    );
    return response.data;
  },
};
