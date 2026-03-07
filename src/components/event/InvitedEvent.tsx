import { useGetInvitedEvents } from "@/src/features/events/hooks/use-event";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { Event_WITH_ROLE } from "./EventwithRole";

interface InvitedEventsTabProps {
  isActive: boolean;
}

export const InvitedEventsTab = ({ isActive }: InvitedEventsTabProps) => {
  //hydration and unwanted call from the top parent component 
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    data: invitedEventsData = [],
    isLoading,
    isError,
    refetch,
  } = useGetInvitedEvents();

  

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  useEffect(() => setMounted(true));
  if (!isActive && !mounted) {
    return null;
  }
  return (
    <ScrollView
      className="flex-1 px-4"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {isLoading ? (
        <View className="items-center justify-center mt-24">
          <Text className="text-gray-400 text-base font-medium mt-4">
            Loading invitations...
          </Text>
        </View>
      ) : isError ? (
        <View className="items-center justify-center mt-24">
          <Text className="text-gray-400 text-base font-medium mt-4">
            Failed to load invitations
          </Text>
        </View>
      ) : invitedEventsData.length > 0 ? (
        invitedEventsData.map((event:any) => (
          <Event_WITH_ROLE
            key={event.id}
            event={event}
            onPress={() => { }}
            isRequest
            asGuest={event.role === "Guest"}
          />
        ))
      ) : (
        <View className="items-center justify-center mt-24">
          <Ionicons name="mail-open-outline" size={52} color="#d1d5db" />
          <Text className="text-gray-400 text-base font-medium mt-4">
            No events found
          </Text>
          <Text className="text-gray-400 text-sm mt-1 text-center px-8">
            No pending invitations
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
