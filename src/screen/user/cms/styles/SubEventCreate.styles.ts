import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  saveButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  sectionSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },
  cardMakingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#FDF2F8",
  },
  cardMakingIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FDF2F8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardMakingInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardMakingTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
  },
  cardMakingSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  selectedCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ee2b8c",
    overflow: "hidden",
  },
  selectedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FDF2F8",
  },
  selectedCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectedCardTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
  },
  selectedCardSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  selectedCardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  selectedCardDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
  },
  bottomSpacing: {
    height: 100,
  },
});
