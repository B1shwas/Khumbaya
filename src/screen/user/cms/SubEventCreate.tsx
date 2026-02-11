import SubEventTemplateCard from "@/src/components/event/SubEventTemplateCard";
import {
  SUB_EVENT_TEMPLATES,
  SubEventTemplate,
  TemplateActivity,
} from "@/src/constants/subeventTemplates";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================
// Types
// ============================================

interface SelectedActivity {
  activity: TemplateActivity;
  time: string;
}

interface SelectedSubEvent {
  template: SubEventTemplate;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
}

export default function SubEventCreate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  // Selected sub-events state
  const [selectedSubEvents, setSelectedSubEvents] = useState<
    SelectedSubEvent[]
  >([]);

  // ============================================
  // Template Selection Handlers
  // ============================================

  const handleTemplateSelect = (template: SubEventTemplate) => {
    const existingIndex = selectedSubEvents.findIndex(
      (s) => s.template.id === template.id,
    );

    if (existingIndex >= 0) {
      // Navigate to edit page
      router.push({
        pathname: "/events/subevent-detail" as any,
        params: {
          subEventId: template.id,
          eventId: eventId || "1",
        },
      });
    } else {
      const newSubEvent: SelectedSubEvent = {
        template,
        date: "",
        theme: "",
        budget: "",
        activities: [],
      };
      setSelectedSubEvents((prev) => [...prev, newSubEvent]);

      // Navigate to detail page for new sub-event
      router.push({
        pathname: "/events/subevent-detail" as any,
        params: {
          subEventId: template.id,
          eventId: eventId || "1",
          isNew: "true",
        },
      });
    }
  };

  const handleRemoveSubEvent = (templateId: string) => {
    setSelectedSubEvents((prev) =>
      prev.filter((s) => s.template.id !== templateId),
    );
  };

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleNavigateToCardMaking = () => {
    router.push("/events/card-making" as any);
  };

  const handleNavigateToGuests = () => {
    router.push("/events/guests" as any);
  };

  const handleSaveAll = () => {
    console.log("Saving sub-events:", selectedSubEvents);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const isTemplateSelected = (templateId: string): boolean => {
    return selectedSubEvents.some((s) => s.template.id === templateId);
  };

  // ============================================
  // Render
  // ============================================

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Sub Event</Text>
        <TouchableOpacity onPress={handleSaveAll} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Template Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Sub Events</Text>
          <Text style={styles.sectionSubtitle}>
            Tap to select sub-events for your wedding
          </Text>

          {SUB_EVENT_TEMPLATES.map((template) => (
            <SubEventTemplateCard
              key={template.id}
              template={template}
              isSelected={isTemplateSelected(template.id)}
              onSelect={handleTemplateSelect}
            />
          ))}
        </View>

        {/* Card Making Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.cardMakingButton}
            onPress={handleNavigateToCardMaking}
          >
            <View style={styles.cardMakingIcon}>
              <Ionicons name="card-outline" size={28} color="#ee2b8c" />
            </View>
            <View style={styles.cardMakingInfo}>
              <Text style={styles.cardMakingTitle}>Cards & Invitations</Text>
              <Text style={styles.cardMakingSubtitle}>
                Create wedding invitations, thank you cards, and bridal books
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Guest List Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.cardMakingButton}
            onPress={handleNavigateToGuests}
          >
            <View style={styles.cardMakingIcon}>
              <Ionicons name="people-outline" size={28} color="#ee2b8c" />
            </View>
            <View style={styles.cardMakingInfo}>
              <Text style={styles.cardMakingTitle}>Manage Guest List</Text>
              <Text style={styles.cardMakingSubtitle}>
                Add guests manually or upload Excel file
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Selected Sub-Events List */}
        {selectedSubEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Sub Events</Text>

            {selectedSubEvents.map((subEvent) => (
              <TouchableOpacity
                key={subEvent.template.id}
                style={styles.selectedCard}
                onPress={() =>
                  router.push({
                    pathname: "/events/subevent-detail" as any,
                    params: {
                      subEventId: subEvent.template.id,
                      eventId: eventId || "1",
                    },
                  })
                }
              >
                <View style={styles.selectedCardHeader}>
                  <View style={styles.selectedCardIcon}>
                    <Ionicons
                      name={subEvent.template.icon as any}
                      size={24}
                      color="#ee2b8c"
                    />
                  </View>
                  <View style={styles.selectedCardInfo}>
                    <Text style={styles.selectedCardTitle}>
                      {subEvent.template.name}
                    </Text>
                    <Text style={styles.selectedCardSubtitle}>
                      {subEvent.date || "Tap to set details"}
                    </Text>
                  </View>
                  <View style={styles.selectedCardActions}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRemoveSubEvent(subEvent.template.id);
                      }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#9CA3AF"
                    />
                  </View>
                </View>

                {/* Quick Info */}
                <View style={styles.selectedCardDetails}>
                  {subEvent.theme && (
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="color-palette-outline"
                        size={14}
                        color="#6B7280"
                      />
                      <Text style={styles.detailText}>{subEvent.theme}</Text>
                    </View>
                  )}
                  {subEvent.budget && (
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="wallet-outline"
                        size={14}
                        color="#6B7280"
                      />
                      <Text style={styles.detailText}>{subEvent.budget}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color="#6B7280"
                    />
                    <Text style={styles.detailText}>
                      {subEvent.activities.length} activities
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
