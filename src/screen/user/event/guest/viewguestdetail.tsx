import { Text } from "@/src/components/ui/Text";
import { useGuestDetailStore } from "@/src/features/guests/store/useGuestDetailStore";
import { formatDate, formatTime } from "@/src/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ViewGuestDetail() {
  const guestDetail = useGuestDetailStore((state) => state.guestDraft);
  console.log("🚀🚀🚀🚀🚀🚀🚀", guestDetail);

  let messageForTransportation;

  if (
    guestDetail?.event_guest.isArrivalPickupRequired &&
    guestDetail?.event_guest?.isDeparturePickupRequired
  ) {
    messageForTransportation = "Pickup and Departure";
  } else if (guestDetail?.event_guest.isArrivalPickupRequired) {
    messageForTransportation = "Arrival Pickup";
  } else if (guestDetail?.event_guest?.isDeparturePickupRequired) {
    messageForTransportation = "Departure Pickup";
  } else {
    messageForTransportation = "Not Required";
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["rgba(238,43,140,0.07)", "transparent"]}
          className="items-center px-6 pt-8 pb-8"
        >
          <View className="relative">
            <View
              className="w-32 h-32 rounded-full bg-primary border-4 border-white items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <Text variant="h1" className="text-white text-4xl">
                {guestDetail?.user_detail.username
                  ? guestDetail.user_detail.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "US"}
              </Text>
            </View>
            <View className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white bg-emerald-500" />
          </View>

          <Text
            variant="h1"
            className="text-slate-900 text-2xl mt-4 text-center"
          >
            {guestDetail?.user_detail.username || "User Name"}
          </Text>
          <Text variant="h2" className="text-primary text-sm mt-1">
            {guestDetail?.event_guest.status == "accepted" || "confirmed"
              ? "Confirmed"
              : "Pending"}{" "}
            Guest • {guestDetail?.event_guest.role || "VVIP"}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View>
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color="#94A3B8"
                  className="mr-2 "
                />
                <Text variant="caption" className=" text-sm text-center">
                  {formatDate(
                    guestDetail?.event_guest.arrival_date_time || "—"
                  )}{" "}
                  –{" "}
                  {formatDate(
                    guestDetail?.event_guest.departure_date_time || "—"
                  )}
                </Text>
              </View>

              <Text variant="caption" className="text-sm text-center">
                {formatTime(
                  guestDetail?.event_guest.arrival_date_time || "TBD"
                )}{" "}
                –{" "}
                {formatTime(
                  guestDetail?.event_guest.departure_date_time || "TBD"
                )}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View className="flex-row gap-3 px-6 pb-6 border-b border-primary/5">
          <TouchableOpacity
            className="flex-1 bg-primary py-2.5 rounded-xl flex-row items-center justify-center gap-2"
            activeOpacity={0.8}
            style={{
              shadowColor: "#EE2B8C",
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#fff" />
            <Text variant="h2" className="text-white text-sm">
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-primary/10 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={16} color="#EE2B8C" />
            <Text variant="h2" className="text-primary text-sm">
              Call
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 pt-6 pb-10 gap-8">
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#EE2B8C"
              />
              <Text
                variant="caption"
                className="text-xs font-bold uppercase tracking-widest"
              >
                Guest Requirements
              </Text>
            </View>
            <View className="bg-slate-50 rounded-2xl px-4">
              {[
                {
                  label: "Arrival Date",
                  value: `${formatDate(guestDetail?.event_guest.arrival_date_time || "TBD")}`,
                  pill: false,
                },

                {
                  label: "Departure Date",
                  value: `${formatDate(guestDetail?.event_guest.departure_date_time || "TBD")}`,
                  pill: false,
                },
                {
                  label: "Accommodation",
                  value: `${guestDetail?.event_guest.isAccomodation ? "Room Needed" : "Room not needed"}`,
                  pill: true,
                },
                {
                  label: "Arrival Pickup",
                  value: `${guestDetail?.event_guest.isArrivalPickupRequired ? "Required" : "Not Required"}`,
                  pill: true,
                },
                {
                  label: "Departure Pickup",
                  value: `${guestDetail?.event_guest.isDeparturePickupRequired ? "Required" : "Not Required"}`,
                  pill: true,
                },
                {
                  label: "Transport Summary",
                  value: messageForTransportation,
                  pill: false,
                },
              ].map((row, i, arr) => (
                <View
                  key={i}
                  className={`flex-row justify-between items-center py-3 ${i < arr.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <Text variant="body" className="text-slate-500 text-sm">
                    {row.label}
                  </Text>
                  {row.pill ? (
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                      <Text variant="h2" className="text-primary text-xs">
                        {row.value}
                      </Text>
                    </View>
                  ) : (
                    <Text variant="h2" className="text-slate-900 text-sm">
                      {row.value}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-row gap-3 flex-1">
                <View className="p-2 bg-primary/5 rounded-xl">
                  <Ionicons name="book-outline" size={24} color="#EE2B8C" />
                </View>
                <View>
                  <Text variant="caption" className="text-xs mb-0.5">
                    Notes
                  </Text>
                  <Text variant="h2" className="text-slate-900 text-sm">
                    {guestDetail?.event_guest.notes || "No additional notes"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="p-1.5 rounded-lg"
                activeOpacity={0.7}
              ></TouchableOpacity>
            </View>
          </View>

          {(guestDetail?.event_guest?.isAccomodation ||
            guestDetail?.event_guest?.isArrivalPickupRequired ||
            guestDetail?.event_guest?.isDeparturePickupRequired) && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#EE2B8C"
                  />
                  <Text
                    variant="caption"
                    className="text-xs font-bold uppercase tracking-widest"
                  >
                    Host Assignments
                  </Text>
                </View>
                <View className="bg-slate-100 px-2 py-0.5 rounded">
                  <Text
                    variant="caption"
                    className="text-[10px] uppercase font-bold"
                  >
                    Internal Use
                  </Text>
                </View>
              </View>

              {guestDetail.event_guest.isAccomodation && (
                <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row gap-3 flex-1">
                      <View className="p-2 bg-primary/5 rounded-xl">
                        <Ionicons
                          name="bed-outline"
                          size={22}
                          color="#EE2B8C"
                        />
                      </View>
                      <View>
                        <Text variant="caption" className="text-xs mb-0.5">
                          Room Assigned
                        </Text>
                        <Text variant="h2" className="text-slate-900 text-sm">
                          Deluxe 402
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="p-1.5 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={16}
                        color="#EE2B8C"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {guestDetail.event_guest.isArrivalPickupRequired && (
                <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row gap-3 flex-1">
                      <View className="p-2 bg-primary/5 rounded-xl">
                        <Ionicons name="car-outline" size={22} color="#EE2B8C" />
                      </View>
                      <View>
                        <Text variant="caption" className="text-xs mb-0.5">
                          Arrival Pickup Assigned
                        </Text>
                        <Text variant="h2" className="text-slate-900 text-sm">
                          Driver pending
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="p-1.5 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={16}
                        color="#EE2B8C"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {guestDetail.event_guest.isDeparturePickupRequired && (
                <View className="bg-white border border-slate-200 p-4 rounded-2xl mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row gap-3 flex-1">
                      <View className="p-2 bg-primary/5 rounded-xl">
                        <Ionicons name="car-sport-outline" size={22} color="#EE2B8C" />
                      </View>
                      <View>
                        <Text variant="caption" className="text-xs mb-0.5">
                          Departure Pickup Assigned
                        </Text>
                        <Text variant="h2" className="text-slate-900 text-sm">
                          Driver pending
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      className="p-1.5 rounded-lg"
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={16}
                        color="#EE2B8C"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
