import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample analytics data (replace with real data from backend)
const SAMPLE_ANALYTICS = {
  totalEarnings: "$12,500",
  monthlyEarnings: "$3,200",
  jobsCompleted: 15,
  avgRating: 4.8,
  totalReviews: 23,
  servicesBooked: [
    { name: "Pre-Wedding Shoot", count: 8, revenue: "$4,000" },
    { name: "Full Wedding Day", count: 5, revenue: "$12,500" },
    { name: "Album Design", count: 12, revenue: "$3,600" },
  ],
  monthlyTrend: [
    { month: "Jan", earnings: 2500 },
    { month: "Feb", earnings: 3200 },
    { month: "Mar", earnings: 4100 },
    { month: "Apr", earnings: 3800 },
    { month: "May", earnings: 4500 },
  ],
  reviews: [
    {
      id: 1,
      name: "Sarah & James",
      rating: 5,
      comment: "Absolutely amazing work! Captured our special day perfectly.",
      date: "2 weeks ago",
      service: "Full Wedding Day",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Priya & Raj",
      rating: 4,
      comment: "Great experience overall. Would recommend to anyone!",
      date: "1 month ago",
      service: "Pre-Wedding Shoot",
      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Emily & Michael",
      rating: 5,
      comment:
        "The album design was breathtaking. They captured every moment beautifully.",
      date: "3 weeks ago",
      service: "Album Design",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ],
  activities: [
    {
      id: 1,
      type: "job_completed",
      title: "Wedding Photography - Sarah & James",
      amount: "$2,500",
      date: "2 weeks ago",
      icon: "check-circle",
      color: "#10b981",
    },
    {
      id: 2,
      type: "payment_received",
      title: "Payment Received",
      amount: "$2,500",
      date: "2 weeks ago",
      icon: "payment",
      color: "#3b82f6",
    },
    {
      id: 3,
      type: "booking",
      title: "Pre-Wedding Shoot - Priya & Raj",
      amount: "$500",
      date: "1 month ago",
      icon: "schedule",
      color: "#f59e0b",
    },
    {
      id: 4,
      type: "review",
      title: "5-star review from Emily & Michael",
      amount: "",
      date: "3 weeks ago",
      icon: "stars",
      color: "#fbbf24",
    },
    {
      id: 5,
      type: "job_completed",
      title: "Album Design - David & Lisa",
      amount: "$300",
      date: "1 month ago",
      icon: "check-circle",
      color: "#10b981",
    },
  ],
};

// Filter options
const FILTER_OPTIONS = [
  { id: "all", label: "All Time" },
  { id: "monthly", label: "Monthly" },
  { id: "weekly", label: "Weekly" },
  { id: "daily", label: "Daily" },
];

export default function AnalyticsScreen() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(SAMPLE_ANALYTICS);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [filteredActivities, setFilteredActivities] = useState(
    analytics.activities,
  );

  useEffect(() => {
    // Filter activities based on selected time period
    const filterActivities = () => {
      let filtered = [...analytics.activities];

      // In real app, filter based on actual dates
      if (selectedFilter === "monthly") {
        filtered = analytics.activities.filter((act) =>
          act.date.includes("month"),
        );
      } else if (selectedFilter === "weekly") {
        filtered = analytics.activities.filter((act) =>
          act.date.includes("week"),
        );
      } else if (selectedFilter === "daily") {
        filtered = analytics.activities.filter((act) =>
          act.date.includes("day"),
        );
      }

      setFilteredActivities(filtered);
    };

    filterActivities();

    // TODO: Fetch real analytics data from backend
    // fetchAnalytics().then(data => setAnalytics(data));
  }, [selectedFilter]);

  // Calculate max earnings for chart scaling
  const maxEarnings = Math.max(
    ...analytics.monthlyTrend.map((t) => t.earnings),
  );

  // Filter reviews by selected period
  const getFilteredReviews = () => {
    return analytics.reviews; // In real app, filter based on selected time period
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="sticky top-0 z-10 flex-row items-center px-4 py-4 bg-white shadow-sm">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full z-10"
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color="#0f172a"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 flex-1 text-center">
            Analytics
          </Text>
        </View>

        {/* Filter Tabs */}
        <View className="bg-white px-4 py-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3"
          >
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                className={`min-w-[100px] px-4 py-2 rounded-full ${
                  selectedFilter === option.id ? "bg-pink-500" : "bg-gray-100"
                }`}
                onPress={() => setSelectedFilter(option.id)}
              >
                <Text
                  className={`text-sm font-medium text-center ${
                    selectedFilter === option.id
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-4 pt-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Cards */}
          <View className="gap-4 mb-6">
            <View className="bg-white rounded-2xl p-4 shadow-sm">
              <Text className="text-gray-500 text-sm mb-2">Total Earnings</Text>
              <Text className="text-3xl font-bold text-gray-900">
                {analytics.totalEarnings}
              </Text>
              <Text className="text-green-600 text-sm mt-1">
                ↑ 12% from last month
              </Text>
            </View>

            <View className="grid grid-cols-2 gap-3">
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-gray-500 text-sm mb-2">
                  Jobs Completed
                </Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {analytics.jobsCompleted}
                </Text>
              </View>

              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-gray-500 text-sm mb-2">Avg Rating</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {analytics.avgRating}
                </Text>
              </View>

              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-gray-500 text-sm mb-2">
                  Total Reviews
                </Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {analytics.totalReviews}
                </Text>
              </View>

              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-gray-500 text-sm mb-2">
                  Monthly Earnings
                </Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {analytics.monthlyEarnings}
                </Text>
              </View>
            </View>
          </View>

          {/* Monthly Trend Chart */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Monthly Earnings Trend
            </Text>
            <View className="h-32 flex-row items-end justify-between px-2">
              {analytics.monthlyTrend.map((trend, index) => (
                <View key={index} className="flex-1 items-center">
                  <View
                    className="bg-pink-500 rounded-t"
                    style={{
                      height: (trend.earnings / maxEarnings) * 100,
                      width: 20,
                    }}
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    {trend.month}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Services Booked */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Services Booked
            </Text>
            <View className="gap-3">
              {analytics.servicesBooked.map((service, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center pb-3 border-b border-gray-100"
                >
                  <View>
                    <Text className="font-semibold text-gray-900">
                      {service.name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {service.count} bookings
                    </Text>
                  </View>
                  <Text className="font-bold text-pink-500">
                    {service.revenue}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Customer Reviews */}
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Customer Reviews
            </Text>
            <View className="gap-4">
              {getFilteredReviews().map((review) => (
                <View key={review.id} className="pb-3 border-b border-gray-100">
                  <View className="flex-row items-center gap-3 mb-2">
                    <Image
                      source={{ uri: review.avatar }}
                      className="w-10 h-10 rounded-full"
                    />
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="font-semibold text-gray-900">
                          {review.name}
                        </Text>
                        <View className="flex-row">
                          {[...Array(5)].map((_, i) => (
                            <MaterialIcons
                              key={i}
                              name={i < review.rating ? "star" : "star-outline"}
                              size={14}
                              color="#fbbf24"
                            />
                          ))}
                        </View>
                        <Text className="text-xs text-gray-500">
                          {review.date}
                        </Text>
                      </View>
                      <Text className="text-xs text-pink-500">
                        {review.service}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-700">
                    {expandedReview === review.id
                      ? review.comment
                      : review.comment.length > 100
                        ? review.comment.substring(0, 100) + "..."
                        : review.comment}
                  </Text>
                  {review.comment.length > 100 && (
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedReview(
                          expandedReview === review.id ? null : review.id,
                        )
                      }
                    >
                      <Text className="text-sm text-pink-500 mt-1">
                        {expandedReview === review.id
                          ? "Show Less"
                          : "Read More"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Activity History */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mt-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </Text>
            <View className="gap-4">
              {filteredActivities.map((activity) => (
                <View key={activity.id} className="flex-row items-center gap-3">
                  <View className="bg-gray-100 p-2 rounded-full">
                    <MaterialIcons
                      name={activity.icon as any}
                      size={20}
                      color={activity.color}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {activity.title}
                    </Text>
                    {activity.amount && (
                      <Text className="text-xs text-gray-500">
                        {activity.amount}
                      </Text>
                    )}
                  </View>
                  <Text className="text-xs text-gray-500">{activity.date}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
