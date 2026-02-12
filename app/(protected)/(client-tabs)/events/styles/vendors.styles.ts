import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#181114",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  headerButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ee2b8c",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  tabsContainer: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabActive: {
    backgroundColor: "#ee2b8c",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "white",
  },
  content: {
    flex: 1,
  },
  vendorList: {
    padding: 16,
    gap: 12,
  },
  vendorCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  vendorImageContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  vendorImage: {
    width: "100%",
    height: "100%",
  },
  vendorImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBooked: {
    backgroundColor: "#DCFCE7",
  },
  statusPending: {
    backgroundColor: "#FFEDD5",
  },
  statusAvailable: {
    backgroundColor: "#DBEAFE",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  statusTextBooked: {
    color: "#16A34A",
  },
  statusTextPending: {
    color: "#EA580C",
  },
  statusTextAvailable: {
    color: "#2563EB",
  },
  vendorInfo: {
    flex: 1,
    padding: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#181114",
  },
  vendorCategory: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  vendorMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#F59E0B",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  vendorAction: {
    paddingRight: 12,
  },
  bookButton: {
    backgroundColor: "#ee2b8c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ee2b8c",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ee2b8c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
