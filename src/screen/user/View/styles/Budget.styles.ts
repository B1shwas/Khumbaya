import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  // No Access Styles
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  noAccessIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  noAccessSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  noAccessButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  noAccessButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  // Main Budget Card
  mainBudgetCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  mainBudgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mainBudgetLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  mainBudgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  mainBudgetBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  mainBudgetAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
  },
  mainBudgetProgress: {
    gap: 8,
  },
  mainProgressBar: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  mainProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  mainProgressText: {
    fontSize: 12,
    color: "#6b7280",
  },
  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statCardGreen: {
    backgroundColor: "#ecfdf5",
  },
  statCardBlue: {
    backgroundColor: "#eff6ff",
  },
  statCardOrange: {
    backgroundColor: "#fffbeb",
  },
  statCardPurple: {
    backgroundColor: "#f5f3ff",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  sectionAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sectionActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ee2b8c",
  },
  // Budget Item Card
  budgetItemCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  budgetItemIconText: {
    fontSize: 24,
  },
  budgetItemInfo: {
    flex: 1,
  },
  budgetItemCategory: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 6,
  },
  budgetItemProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  budgetProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    overflow: "hidden",
  },
  budgetProgressFill: {
    height: "100%",
    borderRadius: 3,
  },
  budgetItemPercent: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
  },
  budgetItemAmounts: {
    alignItems: "flex-end",
  },
  budgetItemActual: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  budgetItemEstimated: {
    fontSize: 12,
    color: "#9ca3af",
  },
  budgetItemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  budgetItemStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#6b7280",
  },
  budgetItemRemaining: {
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 100,
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
    elevation: 6,
  },
});
