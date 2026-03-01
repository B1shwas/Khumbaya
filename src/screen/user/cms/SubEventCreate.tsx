import SubEventTemplateCard from "@/src/components/event/SubEventTemplateCard";
import {
  SUB_EVENT_TEMPLATES,
  SubEventTemplate,
} from "@/src/constants/subeventTemplates";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SelectedSubEventCard from "../../../components/subevent/SelectedSubEventCard";
import { useSubEvents } from "../../../hooks/useSubEvents";

export default function SubEventCreate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;

  // Use the hook for state management
  const { subEvents, addSubEvent, deleteSubEvent, exists } = useSubEvents();

  // ============================================
  // Template Selection Handlers
  // ============================================

  const handleTemplateSelect = useCallback(
    async (template: SubEventTemplate) => {
      const existsInState = exists(template.id);

      if (existsInState) {
        // Navigate to edit page
        router.push({
          pathname:
            "/(protected)/(client-stack)/events/[eventId]/subevent-detail",
          params: {
            subEventId: template.id,
            eventId: eventId || "1",
          },
        });
      } else {
        // Create new sub-event and navigate to detail page
        const newSubEvent = {
          template,
          date: "",
          theme: "",
          budget: "",
          activities: [],
        };

        await addSubEvent(newSubEvent);

        router.push({
          pathname:
            "/(protected)/(client-stack)/events/[eventId]/subevent-detail",
          params: {
            subEventId: template.id,
            eventId: eventId || "1",
            isNew: "true",
          },
        });
      }
    },
    [exists, addSubEvent, router, eventId]
  );

  // ============================================
  // Navigation Handlers
  // ============================================

  const handleNavigateToCardMaking = () => {
    router.push("/(protected)/(client-stack)/events/card-making");
  };

  const handleNavigateToGuests = () => {
    router.push("/(protected)/(client-stack)/events/guests");
  };

  const handleSaveAll = () => {
    console.log("Saving sub-events:", subEvents);
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  const isTemplateSelected = (templateId: string): boolean => {
    return exists(templateId);
  };

  // Handle card press
  const handleCardPress = (templateId: string) => {
    router.push({
      pathname: "/(protected)/(client-stack)/events/[eventId]/subevent-detail",
      params: {
        subEventId: templateId,
        eventId: eventId || "1",
      },
    });
  };

  // Handle edit
  const handleEdit = (templateId: string) => {
    router.push({
      pathname: "/(protected)/(client-stack)/events/[eventId]/subevent-detail",
      params: {
        subEventId: templateId,
        eventId: eventId || "1",
      },
    });
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

        {/* Selected Sub-Events List with Swipe Actions */}
        {subEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selected Sub Events</Text>

            {subEvents.map((subEvent) => (
              <SelectedSubEventCard
                key={subEvent.template.id}
                subEvent={subEvent}
                onPress={() => handleCardPress(subEvent.template.id)}
                onDelete={() => deleteSubEvent(subEvent.template.id)}
                onEdit={() => handleEdit(subEvent.template.id)}
              />
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
  bottomSpacing: {
    height: 100,
  },
});
