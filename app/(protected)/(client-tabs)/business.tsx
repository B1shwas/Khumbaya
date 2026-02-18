import Action from "@/src/components/vendor/Action";
import Card from "@/src/components/vendor/Card";
import Nav from "@/src/components/vendor/Nav";
import Review from "@/src/components/vendor/Review";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { FlatList, Image, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VendorDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={[1]}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ee2b8c"
              />
            }
          >
            {/* HEADER */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <View className="flex-row items-center gap-3">
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7XhJq5JOrAN6S4NqoVV83cVtS63_egQzglNgFRxIDOkdpqYnff5GOCJptVykZLiKgpC1jqdfzFw-SEWxNZbllAywQ7XFtB6114JgP4FCW5lq--K-mX_yCXL9k7lrg-fYFxNyB9d6-RKgH9YRF1TB6Zq-GZkzSvahX-kKENLNbqxzLbz231oldlOnh5kHRVoRSzOs7Zd1juUlBqV4rzNY2LWlmgYTJ9MVRkD1jIWSq_pU9wlqlMi__If9iDAo3ejCCFaTu-ogXN4",
                  }}
                  className="w-10 h-10 rounded-full"
                />

                <View>
                  <Text className="text-xs text-gray-400">{greeting}</Text>
                  <Text className="font-bold text-lg">Shyam</Text>
                </View>
              </View>

              <TouchableOpacity>
                <MaterialIcons name="notifications" size={26} color="black" />
              </TouchableOpacity>
            </View>

            {/* PRIMACY CARD - BOOKING REQUESTS */}
            <View className="mx-4 mt-4 bg-pink-500 p-5 rounded-3xl shadow-lg">
              <Text className="text-white text-lg font-bold">
                3 New Booking Requests
              </Text>
              <Text className="text-pink-100 text-sm mt-1">
                Tap to view details
              </Text>
            </View>

            {/* TODAY'S EVENT */}
            <View className="mx-4 mt-4 bg-white p-4 rounded-2xl border border-gray-200">
              <Text className="text-xs text-gray-400 mb-2">Today's Event</Text>
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
                  <MaterialIcons name="event" size={20} color="#ee2b8c" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold">Wedding Ceremony</Text>
                  <Text className="text-sm text-gray-500">
                    5:00 PM • Hyatt Regency
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#ee2b8c" />
              </View>
            </View>

            {/* WEEKLY EARNINGS */}
            <View className="mx-4 mt-4 bg-white p-4 rounded-2xl border border-gray-200">
              <Text className="text-xs text-gray-400 mb-2">
                Weekly Earnings
              </Text>
              <Text className="font-bold text-2xl">$2,430</Text>
              <View className="flex-row items-center gap-1 mt-1">
                <MaterialIcons name="trending-up" size={14} color="#10b981" />
                <Text className="text-sm text-green-600">+18%</Text>
              </View>
            </View>

            {/* SUMMARY CARDS */}
            <View className="flex-row gap-4 px-4 mt-4">
              <Card title="Total Income" value="$12,450" icon="payments" />
              <Card title="Upcoming Events" value="8" icon="calendar-today" />
            </View>

            {/* QUICK ACTIONS */}
            <Text className="font-bold text-lg mt-6 px-4">Quick Actions</Text>

            <View className="flex-row flex-wrap gap-3 px-4 mt-3">
              <Action icon="view-agenda" label="View Bookings" primary />
              <Action icon="chat" label="Messages" />
              <Action icon="calendar-month" label="Calendar" />
              <Action icon="storefront" label="Services" />
            </View>

            {/* REVIEWS */}
            <Text className="font-bold text-lg mt-6 px-4">Recent Reviews</Text>

            <View className="px-4 mt-3 gap-3">
              <Review
                name="Sarah Jenkins"
                text="The wedding planning was seamless. Amazing communication and professional staff!"
              />

              <Review
                name="Michael Chen"
                text="Very reliable vendor. Our corporate gala went off without a single hitch."
              />
            </View>
          </ScrollView>
        )}
    
      />
    </SafeAreaView>
  );
}
