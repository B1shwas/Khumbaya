// RSVPForm.jsx
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const RSVPForm = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [attendance, setAttendance] = useState("yes");
  const [accommodation, setAccommodation] = useState(false);
  const [arrivalPickup, setArrivalPickup] = useState(false);
  const [departureDrop, setDepartureDrop] = useState(false);
  const [notes, setNotes] = useState("");

  const back = () => {
    router.back();
  };
  // Primary color constant
  const PRIMARY = "#ee2b8c";

  const Icon = ({
    name,
    color = PRIMARY,
    size = 20,
  }: {
    name: string;
    color?: string;
    size?: number;
  }) => (
    <MaterialIcons
      name={name.replace(/_/g, "-") as keyof typeof MaterialIcons.glyphMap}
      color={color}
      size={size}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="flex-1 bg-white max-w-md mx-auto w-full">
        {/* Header */}
        <View className="sticky top-0 z-10 bg-white border-b border-pink-100">
          <View className="flex-row items-center p-4">
            <TouchableOpacity
              className="p-2 rounded-full active:bg-pink-50"
              onPress={back}
            >
              <Icon name="arrow_back" color="#64748b" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-lg font-bold text-slate-900 mr-10">
              RSVP for Rahul Sharma
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 p-4 pb-32">
          {/* Attendance Section */}
          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4">
              <Icon name="event_available" />
              <Text className="font-bold text-slate-800">Will you attend?</Text>
            </View>

            <View className="flex-row bg-pink-50 p-1.5 rounded-xl">
              {["yes", "no", "maybe"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setAttendance(option)}
                  className={`flex-1 py-2.5 rounded-lg ${
                    attendance === option ? "bg-[#ee2b8c]" : ""
                  }`}
                  style={
                    attendance === option ? { backgroundColor: PRIMARY } : {}
                  }
                >
                  <Text
                    className={`text-center font-semibold text-sm capitalize ${
                      attendance === option ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Travel Details Section */}
          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-4">
              <Icon name="flight_takeoff" />
              <Text className="font-bold text-slate-800">Travel Itinerary</Text>
            </View>

            <View className="gap-4">
              <View>
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5">
                  Arrival Date & Time
                </Text>
                <TextInput
                  placeholder="Select date and time"
                  className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm text-slate-900"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View>
                <Text className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5">
                  Departure Date & Time
                </Text>
                <TextInput
                  placeholder="Select date and time"
                  className="w-full bg-slate-50 rounded-xl py-3 px-4 text-sm text-slate-900"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Toggle Options */}
          <View className="mb-8 gap-5">
            {/* Accommodation Toggle */}
            <View className="flex-row items-center justify-between p-4 bg-pink-50 rounded-2xl border border-pink-100">
              <View className="flex-row items-center gap-3">
                <Icon name="hotel" />
                <View>
                  <Text className="font-bold text-sm text-slate-900">
                    Accommodation Required?
                  </Text>
                  <Text className="text-xs text-slate-500">
                    Do you need a room booked?
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setAccommodation(!accommodation)}
                className={`w-11 h-6 rounded-full ${accommodation ? "bg-[#ee2b8c]" : "bg-slate-200"}`}
                style={{ backgroundColor: accommodation ? PRIMARY : "#e2e8f0" }}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-0.5 ml-0.5 transition-transform ${
                    accommodation ? "translate-x-5" : ""
                  }`}
                  style={{
                    transform: [{ translateX: accommodation ? 20 : 0 }],
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Transportation Options */}
            <View>
              <View className="flex-row items-center gap-2 mb-3">
                <Icon name="directions_car" />
                <Text className="font-bold text-slate-800">
                  Transportation Needed?
                </Text>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setArrivalPickup(!arrivalPickup)}
                  className={`flex-1 flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 ${
                    arrivalPickup ? "border-pink-200" : "border-transparent"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 items-center justify-center ${
                      arrivalPickup
                        ? "bg-[#ee2b8c] border-[#ee2b8c]"
                        : "border-slate-300"
                    }`}
                    style={{
                      backgroundColor: arrivalPickup ? PRIMARY : "transparent",
                      borderColor: arrivalPickup ? PRIMARY : "#cbd5e1",
                    }}
                  >
                    {arrivalPickup && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                  <Text className="text-sm font-medium text-slate-900">
                    Arrival Pickup
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDepartureDrop(!departureDrop)}
                  className={`flex-1 flex-row items-center gap-3 p-3 bg-slate-50 rounded-xl border-2 ${
                    departureDrop ? "border-pink-200" : "border-transparent"
                  }`}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 items-center justify-center ${
                      departureDrop
                        ? "bg-[#ee2b8c] border-[#ee2b8c]"
                        : "border-slate-300"
                    }`}
                    style={{
                      backgroundColor: departureDrop ? PRIMARY : "transparent",
                      borderColor: departureDrop ? PRIMARY : "#cbd5e1",
                    }}
                  >
                    {departureDrop && (
                      <Text className="text-white text-xs">✓</Text>
                    )}
                  </View>
                  <Text className="text-sm font-medium text-slate-900">
                    Departure Drop
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Dietary Notes */}
          <View className="mb-8">
            <View className="flex-row items-center gap-2 mb-3">
              <Icon name="restaurant_menu" />
              <Text className="font-bold text-slate-800">Special Notes</Text>
            </View>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Dietary restrictions, allergies, or any other requests..."
              value={notes}
              onChangeText={setNotes}
              className="w-full bg-slate-50 rounded-xl p-4 text-sm text-slate-900"
              placeholderTextColor="#94a3b8"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View
          className="absolute   bottom-2 left-0 right-0 p-4 bg-white"
          style={{
            bottom: Math.max(insets.bottom, 8),
            borderTopWidth: 1,
            borderTopColor: "#f1f5f9",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <TouchableOpacity
            className="w-full py-4 rounded-xl items-center justify-center"
            style={{ backgroundColor: PRIMARY }}
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-base">Save RSVP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RSVPForm;
