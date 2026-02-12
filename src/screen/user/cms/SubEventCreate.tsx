import SubEventTemplateCard from "@/src/components/event/SubEventTemplateCard";
import { SUB_EVENT_TEMPLATES } from "@/src/data/subeventTemplates";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSubEventCreate } from "./hooks/useSubEventCreate";
import { styles } from "./styles/SubEventCreate.styles";

export default function SubEventCreate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  const {
    selectedSubEvents,
    handleTemplateSelect,
    handleRemoveSubEvent,
    isTemplateSelected,
  } = useSubEventCreate();

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

  const navigateToDetail = (path: any) => {
    router.push(path);
  };

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
              onSelect={(t) =>
                handleTemplateSelect(t, navigateToDetail, eventId)
              }
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
                  navigateToDetail({
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
