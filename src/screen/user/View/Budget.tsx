import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BudgetItemComponent,
  MainBudgetCard,
  NoAccessView,
  StatsGrid,
} from "./components";
import { useBudget } from "./hooks/useBudget";
import { styles } from "./styles/Budget.styles";

export default function BudgetPage() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  // Check if user is invited guest (not owner) - hide budget for them
  const isInvitedGuest = params.isInvited === "true";
  const isOwner = !isInvitedGuest;

  const { budgetItems, summary } = useBudget();

  if (isInvitedGuest) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget</Text>
          <View style={styles.headerButton} />
        </View>

        <NoAccessView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="filter" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <MainBudgetCard
          totalEstimated={summary.totalEstimated}
          totalActual={summary.totalActual}
          percentUsed={summary.percentUsed}
          isOverBudget={summary.isOverBudget}
        />

        <StatsGrid
          totalPaid={summary.totalPaid}
          totalActual={summary.totalActual}
          remaining={summary.remaining}
          categoriesCount={budgetItems.length}
        />

        {/* Budget Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expenses</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Ionicons name="add" size={20} color="#ee2b8c" />
              <Text style={styles.sectionActionText}>Add</Text>
            </TouchableOpacity>
          </View>

          {budgetItems.map((item) => (
            <BudgetItemComponent key={item.id} item={item} />
          ))}
        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/events/budget" as any)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
