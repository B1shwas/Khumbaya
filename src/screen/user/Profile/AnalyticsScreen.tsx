import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#ec4899";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthlyTrend {
  month: string;
  earnings: number;
}

interface ServiceStat {
  name: string;
  count: number;
  revenue: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  avatar: string;
}

interface Activity {
  id: number;
  type: string;
  title: string;
  amount: string;
  date: string;
  icon: string;
  color: string;
}

interface Analytics {
  totalEarnings: string;
  monthlyEarnings: string;
  jobsCompleted: number;
  avgRating: number;
  totalReviews: number;
  servicesBooked: ServiceStat[];
  monthlyTrend: MonthlyTrend[];
  reviews: Review[];
  activities: Activity[];
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const SAMPLE_ANALYTICS: Analytics = {
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
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Priya & Raj",
      rating: 4,
      comment:
        "Great experience overall. Would recommend to anyone! The photos turned out beautiful.",
      date: "1 month ago",
      service: "Pre-Wedding Shoot",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "Emily & Michael",
      rating: 5,
      comment:
        "The album design was breathtaking. They captured every moment beautifully.",
      date: "3 weeks ago",
      service: "Album Design",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ],
  activities: [
    {
      id: 1,
      type: "job_completed",
      title: "Wedding Photography — Sarah & James",
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
      icon: "payments",
      color: "#3b82f6",
    },
    {
      id: 3,
      type: "booking",
      title: "Pre-Wedding Shoot — Priya & Raj",
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
      title: "Album Design — David & Lisa",
      amount: "$300",
      date: "1 month ago",
      icon: "check-circle",
      color: "#10b981",
    },
  ],
};

const FILTER_OPTIONS = [
  { id: "all", label: "All Time" },
  { id: "monthly", label: "This Month" },
  { id: "weekly", label: "This Week" },
];

// ─── Components ──────────────────────────────────────────────────────────────

const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const SectionTitle = ({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendUp,
  icon,
  accent = false,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  accent?: boolean;
}) => (
  <View style={[styles.statCard, accent && styles.statCardAccent]}>
    <View style={[styles.statIcon, accent && styles.statIconAccent]}>
      <MaterialIcons name={icon as any} size={18} color={accent ? "#fff" : PRIMARY} />
    </View>
    <Text style={[styles.statValue, accent && styles.statValueWhite]}>{value}</Text>
    <Text style={[styles.statLabel, accent && styles.statLabelWhite]}>{title}</Text>
    {subtitle && (
      <Text style={[styles.statSubtitle, accent && styles.statSubtitleWhite]}>
        {subtitle}
      </Text>
    )}
    {trend && (
      <View style={styles.statTrend}>
        <MaterialIcons
          name={trendUp ? "trending-up" : "trending-down"}
          size={12}
          color={accent ? "#fff" : trendUp ? "#10b981" : "#ef4444"}
        />
        <Text
          style={[
            styles.statTrendText,
            accent && styles.statTrendTextWhite,
            !accent && { color: trendUp ? "#10b981" : "#ef4444" },
          ]}
        >
          {trend}
        </Text>
      </View>
    )}
  </View>
);

const BarChart = ({
  data,
  maxValue,
}: {
  data: MonthlyTrend[];
  maxValue: number;
}) => {
  const anims = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      80,
      anims.map((anim, i) =>
        Animated.spring(anim, {
          toValue: data[i].earnings / maxValue,
          useNativeDriver: false,
          tension: 50,
          friction: 8,
        })
      )
    ).start();
  }, []);

  const CHART_HEIGHT = 120;

  return (
    <View style={styles.chartContainer}>
      {data.map((point, i) => {
        const barHeight = anims[i].interpolate({
          inputRange: [0, 1],
          outputRange: [4, CHART_HEIGHT],
        });

        return (
          <View key={i} style={styles.chartBar}>
            <Text style={styles.chartValue}>${(point.earnings / 1000).toFixed(1)}k</Text>
            <Animated.View
              style={{
                height: barHeight,
                width: "65%",
                backgroundColor: i === data.length - 1 ? PRIMARY : "#fce7f3",
                borderRadius: 8,
              }}
            />
            <Text style={styles.chartLabel}>{point.month}</Text>
          </View>
        );
      })}
    </View>
  );
};

const ServiceRow = ({
  service,
  index,
  maxRevenue,
}: {
  service: ServiceStat;
  index: number;
  maxRevenue: number;
}) => {
  const revenue = parseInt(service.revenue.replace(/[$,]/g, ""), 10);
  const pct = revenue / maxRevenue;

  return (
    <View style={styles.serviceRow}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceRank}>
          <Text style={styles.serviceRankText}>{index + 1}</Text>
        </View>
        <Text style={styles.serviceName} numberOfLines={1}>
          {service.name}
        </Text>
        <View style={styles.serviceRevenue}>
          <Text style={styles.serviceRevenueText}>{service.revenue}</Text>
          <Text style={styles.serviceCount}>{service.count} bookings</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
};

const ReviewCard = ({
  review,
  expanded,
  onToggle,
}: {
  review: Review;
  expanded: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
      <View style={styles.reviewInfo}>
        <View style={styles.reviewNameRow}>
          <Text style={styles.reviewName}>{review.name}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
        <Text style={styles.reviewService}>{review.service}</Text>
        <View style={styles.reviewStars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <MaterialIcons
              key={i}
              name={i < review.rating ? "star" : "star-border"}
              size={13}
              color="#fbbf24"
            />
          ))}
        </View>
        <Text
          style={styles.reviewComment}
          numberOfLines={expanded ? undefined : 2}
        >
          {review.comment}
        </Text>
        {review.comment.length > 80 && (
          <TouchableOpacity onPress={onToggle} style={styles.reviewToggle}>
            <Text style={styles.reviewToggleText}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

const ActivityItem = ({
  activity,
  last = false,
}: {
  activity: Activity;
  last?: boolean;
}) => (
  <View style={[styles.activityItem, !last && styles.activityBorder]}>
    <View style={[styles.activityIcon, { backgroundColor: activity.color + "18" }]}>
      <MaterialIcons name={activity.icon as any} size={18} color={activity.color} />
    </View>
    <View style={styles.activityInfo}>
      <Text style={styles.activityTitle} numberOfLines={1}>
        {activity.title}
      </Text>
      <Text style={styles.activityDate}>{activity.date}</Text>
    </View>
    {activity.amount ? (
      <Text style={styles.activityAmount}>{activity.amount}</Text>
    ) : null}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AnalyticsScreen() {
  const router = useRouter();
  const [analytics] = useState<Analytics>(SAMPLE_ANALYTICS);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedReview, setExpandedReview] = useState<number | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const filteredActivities = useMemo(
    () =>
      analytics.activities.filter((a) => {
        if (selectedFilter === "monthly") return a.date.includes("month");
        if (selectedFilter === "weekly") return a.date.includes("week");
        return true;
      }),
    [selectedFilter, analytics.activities]
  );

  const maxEarnings = useMemo(
    () => Math.max(...analytics.monthlyTrend.map((t) => t.earnings)),
    [analytics.monthlyTrend]
  );

  const maxServiceRevenue = useMemo(
    () =>
      Math.max(
        ...analytics.servicesBooked.map((s) =>
          parseInt(s.revenue.replace(/[$,]/g, ""), 10)
        )
      ),
    [analytics.servicesBooked]
  );

  const visibleReviews = showAllReviews
    ? analytics.reviews
    : analytics.reviews.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Track your performance</Text>
        </View>
        <View style={styles.ratingBadge}>
          <MaterialIcons name="star" size={14} color="#fbbf24" />
          <Text style={styles.ratingText}>{analytics.avgRating}</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTER_OPTIONS.map((opt) => {
            const active = selectedFilter === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.filterTab, active && styles.filterTabActive]}
                onPress={() => setSelectedFilter(opt.id)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page title */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Performance Overview</Text>
          <Text style={styles.pageSubtitle}>
            Bookings, earnings, and reviews at a glance
          </Text>
        </View>

        {/* Stat Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              icon="payments"
              title="Total Earnings"
              value={analytics.totalEarnings}
              subtitle={`${analytics.monthlyEarnings} this month`}
              trend="+12% vs last"
              trendUp
              accent
            />
            <StatCard
              icon="work"
              title="Jobs Done"
              value={analytics.jobsCompleted.toString()}
              subtitle="Total bookings"
              trend="+3 this month"
              trendUp
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              icon="rate-review"
              title="Reviews"
              value={analytics.totalReviews.toString()}
              subtitle="All time"
            />
            <StatCard
              icon="star"
              title="Avg Rating"
              value={analytics.avgRating.toString()}
              subtitle={`${analytics.totalReviews} reviews`}
            />
          </View>
        </View>

        {/* Earnings Trend */}
        <Card style={styles.sectionCard}>
          <SectionTitle title="Earnings Trend" />
          <BarChart data={analytics.monthlyTrend} maxValue={maxEarnings} />
        </Card>

        {/* Top Services */}
        <Card style={styles.sectionCard}>
          <SectionTitle title="Top Services" action="View all" />
          {analytics.servicesBooked.map((service, i) => (
            <ServiceRow
              key={service.name}
              service={service}
              index={i}
              maxRevenue={maxServiceRevenue}
            />
          ))}
        </Card>

        {/* Reviews */}
        <Card style={styles.sectionCard}>
          <SectionTitle title="Recent Reviews" />
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              expanded={expandedReview === review.id}
              onToggle={() =>
                setExpandedReview(
                  expandedReview === review.id ? null : review.id
                )
              }
            />
          ))}
          {analytics.reviews.length > 2 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setShowAllReviews((v) => !v)}
            >
              <Text style={styles.viewAllText}>
                {showAllReviews
                  ? "Show fewer reviews"
                  : `View all ${analytics.reviews.length} reviews`}
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Recent Activity */}
        <Card style={styles.sectionCard}>
          <SectionTitle title="Recent Activity" />
          {filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="inbox" size={36} color="#e5e7eb" />
              <Text style={styles.emptyText}>No activity for this period</Text>
            </View>
          ) : (
            filteredActivities.map((activity, i) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                last={i === filteredActivities.length - 1}
              />
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#b45309",
  },
  filterContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 10,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  filterTabActive: {
    backgroundColor: PRIMARY,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  filterTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  pageHeader: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  statsGrid: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardAccent: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOpacity: 0.2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: PRIMARY + "15",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statIconAccent: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  statValueWhite: {
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 2,
  },
  statLabelWhite: {
    color: "rgba(255,255,255,0.8)",
  },
  statSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
  },
  statSubtitleWhite: {
    color: "rgba(255,255,255,0.7)",
  },
  statTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  statTrendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statTrendTextWhite: {
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY,
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 160,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
  },
  chartValue: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
  serviceRow: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  serviceRankText: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
  },
  serviceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  serviceRevenue: {
    alignItems: "flex-end",
  },
  serviceRevenueText: {
    fontSize: 14,
    fontWeight: "700",
    color: PRIMARY,
  },
  serviceCount: {
    fontSize: 11,
    color: "#9ca3af",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: 3,
  },
  reviewCard: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  reviewAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  reviewName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  reviewDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  reviewService: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
    marginBottom: 6,
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 22,
  },
  reviewToggle: {
    marginTop: 6,
  },
  reviewToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
  },
  viewAllButton: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: PRIMARY,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityBorder: {},
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  activityDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
});
