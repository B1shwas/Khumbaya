import { Text } from "@/src/components/ui/Text";
import { useGetEventOwner } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { router as expoRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export function TransferOwnerShipPage() {
  const params = useLocalSearchParams();
  const {
    data: eventMembers,
    isLoading: memberLoading,
    refetch: refetchEventMembers,
  } = useGetEventOwner(Number(params.eventId));
  const eventId = useMemo(() => {
    const raw = Array.isArray(params.eventId) ? params.eventId[0] : params.eventId;
    return raw ?? null;
  }, [params.eventId]);

  useFocusEffect(
    useCallback(() => {
      refetchEventMembers();
    }, [refetchEventMembers])
  );

  const openAddMemberModal = () => {
    if (!eventId) return;
    expoRouter.push({
      pathname: "/(protected)/(client-stack)/events/[eventId]/(organizer)/addeventmember",
      params: { eventId },
    });
  };

  const totalMembers = eventMembers?.length ?? 0;
  const activeRoles = useMemo(() => {
    if (!eventMembers?.length) return 0;
    return new Set(
      eventMembers
        .map((member) => (member as { role?: string })?.role)
        .filter((role): role is string => !!role)
    ).size;
  }, [eventMembers]);

  return (
    <View className="flex-1 ">
      <ScrollView
        className="flex-1 px-6 pt-2 pb-36"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="pt-2">
        </View>

        <View className="mb-8">
          <View className="bg-primary-container rounded-[32px] p-6 relative overflow-hidden gap-6">
            <View className="relative z-10">
              <Text className="text-on-primary-container text-2xl font-jakarta-bold mb-2">
                Collaboration Hub
              </Text>
              <Text className="text-on-primary-container/70 max-w-xs font-jakarta-medium">
                Manage your event team and assign the right member roles.
              </Text>
            </View>

            <View className="flex-row gap-4 relative z-10">
              <View className="bg-white/40 rounded-2xl p-4 items-center min-w-[110px]">
                <Text className="text-primary font-jakarta-extrabold text-2xl">
                  {totalMembers}
                </Text>
                <Text className="text-on-primary-container/60 text-[10px] font-jakarta-bold uppercase tracking-wider text-center">
                  Total Members
                </Text>
              </View>

              <View className="bg-white/40 rounded-2xl p-4 items-center min-w-[110px]">
                <Text className="text-primary font-jakarta-extrabold text-2xl">
                  {activeRoles}
                </Text>
                <Text className="text-on-primary-container/60 text-[10px] font-jakarta-bold uppercase tracking-wider text-center">
                  Roles Active
                </Text>
              </View>
            </View>

            <View className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full" />
          </View>
        </View>
        <View>
       
        </View>

        <View className="flex gap-2 pb-10">
          <TouchableOpacity
            onPress={openAddMemberModal}
            activeOpacity={0.8}
            className="h-12 px-4 rounded-md bg-primary flex-row items-center justify-center gap-2"
          >
            <Ionicons name="person-add" size={18} color="white" />
            <Text className="text-white font-jakarta-bold text-sm">
              Add Event Member
            </Text>
          </TouchableOpacity>
          <Text className="text-slate-900 text-sm font-jakarta-bold uppercase mb-3">
            Member List
          </Text>
          <Text className="text-sm text-slate-600 mb-3">
            {totalMembers} member(s) managing this event
          </Text>

          {memberLoading ? (
            <View className="p-4 rounded-md border border-slate-200 bg-slate-50">
              <Text className="text-sm text-slate-600">Loading members...</Text>
            </View>
          ) : !!eventMembers && eventMembers.length ? (
            <View className="gap-3">
              {eventMembers?.map((member, index) => {
                const user = (member as { user?: any })?.user ?? member;
                const name = user?.username || "Member";
                const phoneValue = user?.phone || user?.phoneNumber || null;
                const role = (member as { role?: string })?.role;

                return (
                  <View
                    key={String((member as { id?: number | string })?.id ?? index)}
                    className="flex-row items-center p-4 bg-slate-50 rounded-md border border-slate-200"
                  >
                    <View className="size-12 rounded-full bg-slate-200 items-center justify-center mr-4">
                      <Ionicons name="person" size={24} color="#64748b" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-jakarta-bold text-slate-900">{name}</Text>
                      {phoneValue && (
                        <Text className="text-sm text-dark-500">{phoneValue}</Text>
                      )}
                      <Text className="text-sm text-dark-500">
                        {role ? `Role: ${role}` : "Event member"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className="p-4 rounded-md border border-slate-200 bg-slate-50">
              <Text className="text-sm text-slate-600">No members yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom CTA */}
    </View>
  );
}
