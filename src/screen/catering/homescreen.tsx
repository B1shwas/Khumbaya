import CateringPlanCard from "@/src/components/catering/CateringPlanCard";
import { Text } from "@/src/components/ui/Text";
import { useGetCateringsByEventId } from "@/src/features/catering/hooks/use-catering";
import { cn } from "@/src/utils/cn";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateItem {
  day: string;
  date: number;
  disabled?: boolean;
}

const getUpcomingDates = (count: number): DateItem[] => {
  const today = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
    };
  });
};

const PAGE_SIZE = 10;

const getApiErrorMessage = (error: unknown): string => {
  const status = (error as any)?.response?.status;

  // if (status === 401) {
  //   return "You must log in to view this event's catering plans.";
  // }
  // if (status === 403) {
  //   return "You don't have permission to view caterings for this event.";
  // }
  // if (status === 404) {
  //   return "No catering record was found for this event.";
  // }
  // if (status === 422) {
  //   return "There was a validation issue while fetching catering data.";
  // }
  // if (status === 500) {
  //   return "Server error. Please try again later.";
  // }

  return (error as any)?.message ?? "Unable to load catering plans.";
};

export default function CateringDashboard() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(0);
  const [page, setPage] = useState(1);

  const eventIdValue =
    typeof eventId === "string" ? eventId : String(eventId ?? "");

  const dates = getUpcomingDates(6);

  const { data, isLoading, error, isFetching } = useGetCateringsByEventId(
    eventIdValue || undefined,
    page,
    PAGE_SIZE
  );

  useEffect(() => {
    if ((error as any)?.response?.status === 401) {
      router.replace("/(onboarding)/login");
    }
  }, [error, router]);

  const cateringPlans = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const listError = error ? getApiErrorMessage(error) : undefined;

  const addClick = () => {
    router.push(
      `/(protected)/(client-stack)/events/${eventIdValue}/(organizer)/add-catering`
    );
  };

  const handleCardPress = (plan: any) => {
    router.push(
      `/(protected)/(client-stack)/events/${eventIdValue}/(organizer)/edit-catering?cateringId=${plan.id}`
    );
  };

  function handleCateringPress(id: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background-light"
      edges={["top", "bottom"]}
    >
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => refetch()}
            tintColor="#ee2b8c"
          />
        }
      >
        <View className="bg-background-light px-4 py-2 border-b border-outline-variant/30 shadow-sm">
          <View className="flex-row items-center justify-between h-14 w-full">
            <Pressable onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back-ios"
                size={18}
                color="#ee2b8c"
                style={{ marginLeft: 6 }}
              />
            </Pressable>

            <View
              className="absolute left-0 right-0 items-center justify-center pointer-events-none -z-10"
              style={{ paddingBottom: 2 }}
            >
              <Text className="text-xl text-on-surface tracking-tighter font-black text-center">
                Catering
              </Text>
            </View>

            <Pressable
              className="flex-row items-center bg-primary px-4 py-2.5 rounded-md gap-2"
              style={{
                ...shadowStyle,
                shadowColor: "#ee2b8c",
                shadowOpacity: 0.3,
              }}
              onPress={addClick}
            >
              <Text className="text-white font-black text-[15px] tracking-tight">
                Add
              </Text>
              <MaterialIcons name="add" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <View className="px-4 py-4 border-b border-outline-variant/30 gap-4">
          <View className="px-4">
            <Pressable
              className="flex flex-row gap-4 items-center justify-center h-[50px] rounded-md bg-white border border-outline-variant/60"
              style={shadowStyle}
            >
              <MaterialIcons name="calendar-today" size={18} color="#ee2b8c" />
              <Text className="text-on-surface-variant text-md font-bold">
                Select Date
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, marginLeft: 10 }}
            >
              {dates.map((item, index) => (
                <Pressable
                  key={item.date}
                  onPress={() => setSelectedDate(index)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[60px] py-3 px-2 rounded-md mr-2.5 mb-2",
                    selectedDate === index ? "bg-primary" : "bg-white"
                  )}
                  style={selectedDate !== index ? shadowStyle : undefined}
                >
                  <Text
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest mb-0.5",
                      selectedDate === index
                        ? "text-white/80"
                        : "text-muted-light"
                    )}
                  >
                    {item.day}
                  </Text>
                  <Text
                    className={cn(
                      "text-lg font-black",
                      selectedDate === index ? "text-white" : "text-on-surface"
                    )}
                  >
                    {item.date}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <View className="px-4 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-bold text-on-surface">
                Catering plans
              </Text>
              <Text className="text-sm text-muted-light">
                Manage pricing, schedule and menus for this event.
              </Text>
            </View>
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="text-[11px] font-black text-primary uppercase tracking-[1px]">
                Event ID {eventIdValue}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View className="rounded-3xl bg-white p-6" style={shadowStyle}>
              <Text className="text-on-surface">Loading catering plans...</Text>
            </View>
          ) : listError ? (
            <View className="rounded-3xl bg-white p-6" style={shadowStyle}>
              <Text className="text-on-surface font-bold mb-2">
                {listError}
              </Text>
              {(error as any)?.response?.status === 401 ? (
                <Text className="text-sm text-primary">
                  Redirecting to login...
                </Text>
              ) : null}
            </View>
          ) : cateringPlans.length === 0 ? (
            <View
              className="rounded-3xl bg-white p-6 items-center"
              style={shadowStyle}
            >
              <MaterialIcons name="restaurant-menu" size={36} color="#ee2b8c" />
              <Text className="text-on-surface font-black text-lg mt-4">
                No catering plans yet
              </Text>
              <Text className="text-muted-light text-center mt-2">
                Create a new catering package and add menu items for this event.
              </Text>
            </View>
          ) : (
            cateringPlans.map((plan) => (
              <CateringPlanCard
                key={String(plan.id)}
                item={plan}
                onPress={() => handleCardPress(plan)}
              />
            ))
          )}

          {totalPages > 1 ? (
            <View className="flex-row items-center justify-between mt-4 px-3">
              <Pressable
                className="rounded-full bg-white px-4 py-3"
                style={shadowStyle}
                disabled={page <= 1}
                onPress={() => setPage((current) => Math.max(1, current - 1))}
              >
                <Text className="text-sm font-bold text-on-surface">
                  Previous
                </Text>
              </Pressable>
              <Text className="text-sm font-bold text-on-surface">
                Page {page} of {totalPages}
              </Text>
              <Pressable
                className="rounded-full bg-white px-4 py-3"
                style={shadowStyle}
                disabled={page >= totalPages}
                onPress={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                <Text className="text-sm font-bold text-on-surface">Next</Text>
              </Pressable>
            </View>
          ) : null}

          {isFetching && !isLoading ? (
            <View
              className="mt-4 rounded-3xl bg-white p-4 items-center"
              style={shadowStyle}
            >
              <ActivityIndicator size="small" color="#ee2b8c" />
              <Text className="text-sm text-muted-light mt-2">
                Refreshing catering list...
              </Text>
            </View>
          ) : null}

          <View className="items-center py-10">
            <View className=" mb-4" />
           
          </View>

          {/* Catering Cards */}
          {cateringData?.items && cateringData.items.length > 0 ? (
            cateringData.items.map((catering) => (
              <catering
                key={catering.id}
                catering={catering}
                onPress={() => handleCateringPress(catering.id)}
              />
            ))
          ) : (
            <View className="items-center justify-center py-12">
              <MaterialIcons
                name="event-note"
                size={48}
                color="#896175"
                style={{ opacity: 0.3 }}
              />
              <Text className="text-center text-muted-light font-medium mt-4 text-lg">
                No catering plans yet
              </Text>
              <Text className="text-center text-muted-light text-sm mt-2">
                Add your first catering plan to get started
              </Text>
              <TouchableOpacity
                onPress={handleAddClick}
                className="mt-6 bg-primary px-6 py-3 rounded-md"
                style={shadowStyle}
              >
                <Text className="text-white font-bold">Create First Plan</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Pagination (if applicable) */}
          {cateringData && cateringData.totalPages > 1 && (
            <View className="flex-row items-center justify-center gap-4 my-6">
              <TouchableOpacity
                onPress={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md ${
                  page === 1
                    ? "bg-surface-container opacity-50"
                    : "bg-surface-container"
                }`}
              >
                <Text
                  className={
                    page === 1
                      ? "text-muted-light font-bold"
                      : "text-on-surface font-bold"
                  }
                >
                  Previous
                </Text>
              </TouchableOpacity>

              <Text className="text-sm font-bold text-muted-light">
                {page} / {cateringData.totalPages}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setPage(Math.min(cateringData.totalPages, page + 1))
                }
                disabled={page === cateringData.totalPages}
                className={`px-4 py-2 rounded-md ${
                  page === cateringData.totalPages
                    ? "bg-surface-container opacity-50"
                    : "bg-surface-container"
                }`}
              >
                <Text
                  className={
                    page === cateringData.totalPages
                      ? "text-muted-light font-bold"
                      : "text-on-surface font-bold"
                  }
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
