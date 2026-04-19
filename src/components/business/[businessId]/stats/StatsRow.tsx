import { Business } from "@/src/constants/business";
import { View } from "react-native";
import { StatCard } from "./StatCard";

export function StatsRow({ business }: { business: Business }) {
  const views = business.profileViews ?? 0;
  const viewsFormatted =
    views >= 1000 ? `${(views / 1000).toFixed(1)}k` : String(views);

  // return (
  //   <View className="flex-row gap-3">
  //     <StatCard
  //       label="Total Bookings"
  //       value={String(business.totalBookings ?? 0)}
  //       iconName="event-available"
  //       iconColor="#ee2b8c"
  //       bgColor="#fdf2f8"
  //     />
  //     <StatCard
  //       label="Total Earnings"
  //       value={business.totalEarnings ?? "$0"}
  //       iconName="payments"
  //       iconColor="#059669"
  //       bgColor="#d1fae5"
  //     />
  //     <StatCard
  //       label="Profile Views"
  //       value={viewsFormatted}
  //       iconName="visibility"
  //       iconColor="#2563eb"
  //       bgColor="#dbeafe"
  //     />
  //   </View>
  // );
}