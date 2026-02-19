import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
      comment:
        "Absolutely amazing work! Captured our special day perfectly. The team was professional, friendly, and delivered beyond our expectations. Highly recommend!",
      date: "2 weeks ago",
      service: "Full Wedding Day",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Priya & Raj",
      rating: 4,
      comment:
        "Great experience overall. Would recommend to anyone! The photos turned out beautiful.",
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
  { id: "monthly", label: "This Month" },
  { id: "weekly", label: "This Week" },
];

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </View>
);

// Reusable Stat Card (DRY)
const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
}) => (
  <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
    <Text className="text-gray-500 text-sm mb-1">{title}</Text>
    <Text className="text-2xl font-bold text-gray-900">{value}</Text>
    {subtitle && <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>}
    {trend && (
      <View className="flex-row items-center gap-1 mt-1">
        <MaterialIcons
          name={trendUp ? "trending-up" : "trending-down"}
          size={14}
          color={trendUp ? "#10b981" : "#ef4444"}
        />
        <Text
          className={`text-xs ${trendUp ? "text-green-600" : "text-red-500"}`}
        >
          {trend}
        </Text>
      </View>
    )}
  </View>
);

// Review Card (DRY)
const ReviewCard = ({
  review,
  expanded,
  onToggle,
}: {
  review: any;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <View className="pb-4 border-b border-gray-100 last:border-0">
    <View className="flex-row items-start gap-3 mb-2">
      <Image
        source={{ uri: review.avatar }}
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-semibold text-gray-900">{review.name}</Text>
            <Text className="text-xs text-pink-500">{review.service}</Text>
          </View>
          <Text className="text-xs text-gray-400">{review.date}</Text>
        </View>
        <View className="flex-row items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <MaterialIcons
              key={i}
              name={i < review.rating ? "star" : "star-border"}
              size={14}
              color="#fbbf24"
            />
          ))}
        </View>
      </View>
    </View>
    <Text
      className="text-sm text-gray-600 leading-relaxed"
      numberOfLines={expanded ? undefined : 2}
    >
      {review.comment}
    </Text>
    {review.comment.length > 80 && (
      <TouchableOpacity onPress={onToggle} className="mt-1">
        <Text className="text-sm text-pink-500 font-medium">
          {expanded ? "Show less" : "Read more"}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

// Activity Item (DRY)
const ActivityItem = ({ activity }: { activity: any }) => (
  <View className="flex-row items-center gap-3 py-3">
    <View
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: activity.color + "20" }}
    >
      <MaterialIcons
        name={activity.icon as any}
        size={20}
        color={activity.color}
      />
    </View>
    <View className="flex-1">
      <Text className="font-medium text-gray-900 text-sm" numberOfLines={1}>
        {activity.title}
      </Text>
      <Text className="text-xs text-gray-400">{activity.date}</Text>
    </View>
    {activity.amount && (
      <Text className="font-semibold text-gray-900">{activity.amount}</Text>
    )}
  </View>
);

export default function AnalyticsScreen() {
  const router = useRouter();
  const [analytics] = useState(SAMPLE_ANALYTICS);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  // Calculate max earnings for chart scaling
  const maxEarnings = Math.max(
    ...analytics.monthlyTrend.map((t) => t.earnings),
  );

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Professional Top App Bar */}
        <View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
              accessibilityRole="button"
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-gray-900">Analytics</Text>
              <Text className="text-xs text-gray-500">
                Track your performance
              </Text>
            </View>
            <View className="w-10" />
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
          >
            {FILTER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setSelectedFilter(option.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedFilter === option.id ? "bg-pink-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
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

        <ScrollView
          className="flex-1 px-4 pt-6 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              Performance Overview
            </Text>
            <Text className="text-gray-500">
              Track your bookings, earnings, and reviews
            </Text>
          </View>

          {/* Main Stats */}
          <Card className="mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Total Earnings
              </Text>
              <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <MaterialIcons name="trending-up" size={14} color="#10b981" />
                <Text className="text-xs font-medium text-green-600">+12%</Text>
              </View>
            </View>
            <Text className="text-4xl font-bold text-gray-900 mb-1">
              {analytics.totalEarnings}
            </Text>
            <Text className="text-gray-500 text-sm">
              {analytics.monthlyEarnings} this month
            </Text>
          </Card>

          {/* Stats Grid */}
          <View className="grid grid-cols-2 gap-3 mb-6">
            <StatCard
              title="Jobs Completed"
              value={analytics.jobsCompleted.toString()}
              subtitle="Total bookings"
              trend="+3 this month"
              trendUp={true}
            />
            <StatCard
              title="Average Rating"
              value={analytics.avgRating.toString()}
              subtitle="Based on reviews"
            />
            <StatCard
              title="Total Reviews"
              value={analytics.totalReviews.toString()}
              subtitle="All time"
            />
            <StatCard
              title="This Month"
              value={analytics.monthlyEarnings}
              subtitle="Earnings"
              trend="+8% vs last"
              trendUp={true}
            />
          </View>

          {/* Earnings Chart */}
          <Card className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Earnings Trend
            </Text>
            <View className="h-40 flex-row items-end justify-between px-2 gap-2">
              {analytics.monthlyTrend.map((trend, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-xs text-gray-400 mb-2">
                    ${(trend.earnings / 1000).toFixed(1)}k
                  </Text>
                  <View
                    className="w-full bg-pink-500 rounded-t-lg"
                    style={{
                      height: `${(trend.earnings / maxEarnings) * 100}%`,
                      minHeight: 8,
                    }}
                  />
                  <Text className="text-xs text-gray-500 mt-2">
                    {trend.month}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Services Performance */}
          <Card className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Top Services
              </Text>
              <Text className="text-pink-500 text-sm font-medium">
                View all
              </Text>
            </View>
            <View className="gap-3">
              {analytics.servicesBooked.map((service, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-center py-2 border-b border-gray-50 last:border-0"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 bg-pink-100 rounded-full items-center justify-center">
                      <Text className="text-pink-600 font-bold text-sm">
                        {index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-medium text-gray-900">
                        {service.name}
                      </Text>
                      <Text className="text-xs text-gray-400">
                        {service.count} bookings
                      </Text>
                    </View>
                  </View>
                  <Text className="font-bold text-pink-600">
                    {service.revenue}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Recent Reviews */}
          <Card className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Recent Reviews
              </Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="star" size={16} color="#fbbf24" />
                <Text className="font-semibold text-gray-900">
                  {analytics.avgRating}
                </Text>
                <Text className="text-gray-400 text-sm">
                  ({analytics.totalReviews})
                </Text>
              </View>
            </View>
            <View className="gap-2">
              {analytics.reviews.slice(0, 2).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  expanded={expandedReview === review.id}
                  onToggle={() =>
                    setExpandedReview(
                      expandedReview === review.id ? null : review.id,
                    )
                  }
                />
              ))}
            </View>
            {analytics.reviews.length > 2 && (
              <TouchableOpacity className="mt-3 pt-3 border-t border-gray-100">
                <Text className="text-pink-500 text-center font-medium">
                  View all {analytics.reviews.length} reviews
                </Text>
              </TouchableOpacity>
            )}
          </Card>

          {/* Recent Activity */}
          <Card>
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </Text>
            <View className="divide-y divide-gray-50">
              {analytics.activities.slice(0, 5).map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
