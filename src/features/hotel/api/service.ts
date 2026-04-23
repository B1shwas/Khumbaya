import api from "@/src/api/axios";

export type ToggleCheckin_outType = {
  invitationId: string | number,
  action: "checkIn" | "checkOut"
}
export const toggleCheckin_out = async (
  { invitationId, action }: ToggleCheckin_outType
) => {
  const serviceCall = await api.post(
    `invitation/${invitationId}/check-status`,
    { action }
  );
  return serviceCall.data?.data ?? serviceCall.data;
}

