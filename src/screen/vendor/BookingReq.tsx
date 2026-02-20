import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BookingReqModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSubmit?: (formData: FormData) => void;
  asRoute?: boolean; // When true, skips Modal wrapper (for Expo Router transparentModal)
}

interface FormData {
  eventId: string;
  budget: string;
  guests: string;
  notes: string;
}

const MOCK_EVENTS = [
  { id: "1", label: "Sarah & James Wedding" },
  { id: "2", label: "Winter Charity Gala 2024" },
  { id: "3", label: "30th Birthday Celebration" },
];

const { height: screenHeight } = Dimensions.get("window");
const DISMISS_THRESHOLD = 100;

export default function BookingReqModal({
  visible = true,
  onClose,
  onSubmit,
  asRoute = false,
}: BookingReqModalProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const [formData, setFormData] = useState<FormData>({
    eventId: "",
    budget: "",
    guests: "",
    notes: "",
  });
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create PanResponder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(
            evt,
            gestureState
          );

          // Fade background as user swipes down
          const opacityValue = Math.max(
            0,
            1 - gestureState.dy / (screenHeight * 0.5)
          );
          opacity.setValue(opacityValue);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > DISMISS_THRESHOLD || gestureState.vy > 0.5) {
          // Swipe down enough to dismiss
          if (asRoute) {
            // For Expo Router transparentModal, let router handle the animation
            handleClose();
          } else {
            // For traditional modal, animate then close
            Animated.parallel([
              Animated.timing(pan.y, {
                toValue: screenHeight,
                duration: 250,
                useNativeDriver: false,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
              }),
            ]).start(() => {
              pan.setValue({ x: 0, y: 0 });
              opacity.setValue(1);
              handleClose();
            });
          }
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(pan.y, {
              toValue: 0,
              useNativeDriver: false,
              tension: 65,
              friction: 11,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
    })
  ).current;

  // Reset when modal visibility changes
  useEffect(() => {
    if (!visible) {
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
    }
  }, [visible]);

  const handleEventSelect = (eventId: string) => {
    setFormData((prev) => ({ ...prev, eventId }));
    setShowEventDropdown(false);
  };

  const handleSubmit = async () => {
    if (!formData.eventId || !formData.budget || !formData.guests) {
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit?.(formData);
      setFormData({ eventId: "", budget: "", guests: "", notes: "" });
      handleClose();
    } catch (error) {
      console.error("Error submitting booking request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEvent = MOCK_EVENTS.find((e) => e.id === formData.eventId);

  const modalContent = (
    <Animated.View style={{ opacity }} className="flex-1 bg-black/40">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-1 justify-end">
          {/* Modal Container with Swipe Gesture */}
          <Animated.View
            style={{
              transform: [{ translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
            <View className="bg-white rounded-t-3xl min-h-[85%]">
              {/* Handle Bar - Swipe Indicator */}
              <View className="items-center pt-3 pb-2">
                <View className="h-1 w-12 bg-gray-300 rounded-full" />
              </View>

              {/* Header */}
              <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <Pressable
                  onPress={handleClose}
                  className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
                >
                  <MaterialIcons name="close" size={24} color="#111827" />
                </Pressable>

                <Text variant="h2" className="text-text-primary">
                  Request Quote
                </Text>

                <View className="w-10" />
              </View>

              {/* Scrollable Content */}
              <ScrollView
                className="flex-1 px-6 py-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
                scrollEnabled={true}
              >
                {/* Section Brief */}
                <View className="mb-8">
                  <Text
                    variant="h1"
                    className="text-text-primary mb-2 text-xl font-semibold"
                  >
                    Let the vendor know what you're planning.
                  </Text>
                  <Text
                    variant="caption"
                    className="text-text-secondary text-sm"
                  >
                    Providing specific details helps vendors give you the most
                    accurate pricing.
                  </Text>
                </View>

                {/* Event Selection */}
                <View className="mb-6">
                  <Text className="text-text-primary text-sm font-semibold mb-2">
                    Which event is this for?
                  </Text>

                  <Pressable
                    onPress={() => setShowEventDropdown(!showEventDropdown)}
                    className="h-14 bg-white border border-gray-200 rounded-lg px-4 flex-row items-center justify-between"
                  >
                    <Text
                      className={`text-base ${
                        selectedEvent ? "text-text-primary" : "text-gray-400"
                      }`}
                    >
                      {selectedEvent?.label || "Select an Event"}
                    </Text>
                    <MaterialIcons
                      name={showEventDropdown ? "expand-less" : "expand-more"}
                      size={24}
                      color="#111827"
                    />
                  </Pressable>

                  {/* Dropdown Menu */}
                  {showEventDropdown && (
                    <View className="absolute top-24 left-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {MOCK_EVENTS.map((event) => (
                        <Pressable
                          key={event.id}
                          onPress={() => handleEventSelect(event.id)}
                          className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <Text className="text-text-primary">
                            {event.label}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}

                  <Pressable className="mt-3 flex-row items-center gap-1">
                    <MaterialIcons
                      name="add-circle"
                      size={18}
                      color="#ee2b8c"
                    />
                    <Text className="text-primary text-sm font-medium">
                      I haven't created one yet
                    </Text>
                  </Pressable>
                </View>

                {/* Budget & Guests Row */}
                <View className="flex-row gap-4 mb-6">
                  {/* Budget */}
                  <View className="flex-1">
                    <Text className="text-text-primary text-sm font-semibold mb-2">
                      Estimated Budget
                    </Text>
                    <View className="h-14 bg-white border border-gray-200 rounded-lg px-4 flex-row items-center">
                      <Text className="text-amber-600 font-semibold mr-1">
                        $
                      </Text>
                      <TextInput
                        placeholder="0.00"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="decimal-pad"
                        value={formData.budget}
                        onChangeText={(text) =>
                          setFormData((prev) => ({ ...prev, budget: text }))
                        }
                        className="flex-1 text-text-primary text-base"
                      />
                    </View>
                  </View>

                  {/* Guests */}
                  <View className="flex-1">
                    <Text className="text-text-primary text-sm font-semibold mb-2">
                      Expected Guests
                    </Text>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="number-pad"
                      value={formData.guests}
                      onChangeText={(text) =>
                        setFormData((prev) => ({ ...prev, guests: text }))
                      }
                      className="h-14 bg-white border border-gray-200 rounded-lg px-4 text-text-primary text-base"
                    />
                  </View>
                </View>

                {/* Additional Notes */}
                <View className="mb-6">
                  <View className="flex-row justify-between items-end mb-2">
                    <Text className="text-text-primary text-sm font-semibold">
                      Additional Info / Notes
                    </Text>
                    <Text className="text-xs text-gray-400 uppercase tracking-wider">
                      Optional
                    </Text>
                  </View>
                  <TextInput
                    placeholder="Share specific details, dietary requirements, or special requests..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={4}
                    value={formData.notes}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, notes: text }))
                    }
                    className="bg-white border border-gray-200 rounded-lg p-4 text-text-primary text-base"
                    textAlignVertical="top"
                  />
                </View>

                {/* Terms/Privacy Snippet */}
                <Text className="text-xs text-gray-500 text-center leading-relaxed px-2">
                  By sending this request, you agree to our terms of service.
                  The vendor will be notified immediately and usually responds
                  within 24 hours.
                </Text>
              </ScrollView>

              {/* Sticky Footer */}
              <View
                className="px-4 py-4 border-t border-gray-100 bg-white"
                style={{ paddingBottom: insets.bottom + 16 }}
              >
                <Button
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-row items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Text className="text-white">Sending...</Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-white">Send Request</Text>
                      <MaterialIcons name="send" size={18} color="#ffffff" />
                    </>
                  )}
                </Button>
              </View>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );

  // When used as a route (Expo Router transparentModal), skip Modal wrapper
  if (asRoute) {
    return modalContent;
  }

  // When used as a traditional modal component
  return (
    <Modal visible={visible} animationType="fade" transparent>
      {modalContent}
    </Modal>
  );
}
