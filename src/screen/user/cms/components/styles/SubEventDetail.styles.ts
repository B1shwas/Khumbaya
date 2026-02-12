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
    paddingVertical: 12,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ee2b8c",
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "white",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
