import { BusinessCard, CreateBusinessButton } from "@/src/components/business";
import { useGetBusinessList } from "@/src/features/business";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";

export default function BusinessScreen() {
  const router = useRouter();
  const { data: businesses, isLoading, isError, refetch } = useGetBusinessList();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const businessList = Array.isArray(businesses) ? businesses : [];

  return (
    <View className="flex-1 bg-[#f8f6f7]">

      {/* Content */}
      <ScrollView
        className="flex-1 p-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ee2b8c"
          />
        }
      >
        {/* Hero */}
        <View className="px-5 pt-7 pb-5">
          <Text className="text-[30px] font-extrabold text-[#181114] tracking-tighter leading-9">
            My Businesses
          </Text>
          <Text className="mt-1.5 text-sm font-medium text-[#594048]">
            Manage all your professional services from one place.
          </Text>
        </View>

        {/* Business list */}
        {isLoading ? (
          <ActivityIndicator className="mt-10" color="#ee2b8c" />
        ) : isError ? (
          <View className="items-center justify-center mt-24 px-8">
            <MaterialIcons name="error-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-400 text-base font-medium mt-4">
              Failed to load businesses
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Pull down to try again
            </Text>
          </View>
        ) : businessList.length === 0 ? (
          <View className="items-center justify-center mt-24 px-8">
            <MaterialIcons name="storefront" size={52} color="#d1d5db" />
            <Text className="text-[#594048] text-base font-semibold mt-4">
              No businesses yet
            </Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">
              Create your first business to start managing your services.
            </Text>
          </View>
        ) : (
          <View className="px-4 gap-5">
            {businessList.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onPress={() => router.push(`/business/${business.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating action button */}
      <CreateBusinessButton onPress={() => router.push("/business/create")} />
    </View>
  );
}
