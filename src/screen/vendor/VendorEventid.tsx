import { View, ScrollView, TouchableOpacity, Image, Text as RNText, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

// Sample event data - in real app, fetch based on eventId
const eventData = {
  id: "1",
  title: "Sarah & Amit's Wedding",
  venue: "The Grand Plaza Hotel",
  date: "Oct 24, 2023",
  guests: 150,
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQCoSbaWiI25oetI7_Wj0fr6Y7vJNZG_MmsUkB0p7QbWX5Ps0DekkdZSEnHKB5CA4HCDe2xhVsBWgq9ARPwFKFXJQ_e05aeLnRtZM0batrrIO9D06cBcBDEa_MI9AvM__Drb3lncJYtODyszroT0-UQc3bqcJHwPfW1Y0vQLpYWCou1fPrVKOYZ4VfOKQ9bpefuxUpTFIFZoHj2Ag3rBuaDWuiF65rIfs_PNcXkUhRAg5p-ln62eAnqzgnI-5wn3wnh1P6_O7c_0k",
  status: "Live Event",
};

// Timeline data
const timelineData = [
  {
    id: 1,
    time: "14:00",
    title: "Vendor Arrival",
    description: "Unloading at rear dock B.",
    icon: "local_shipping",
    iconBg: "#ee2b8c",
    iconColor: "#ffffff",
    isPast: true,
  },
  {
    id: 2,
    time: "16:30",
    title: "Cocktail Hour Setup",
    description: "Check glassware count and ice buckets.",
    icon: "wine_bar",
    iconBg: "#ee2b8c",
    iconColor: "#ffffff",
    isActive: true,
    note: "Happening Now",
  },
  {
    id: 3,
    time: "18:00",
    title: "Dinner Service Begins",
    description: "Plated service for head table.",
    icon: "restaurant",
    iconBg: "#f8f6f7",
    iconColor: "#181114",
    isPast: false,
  },
];

// Tasks data
const tasksData = [
  { id: 1, title: "Unload equipment", completed: true, location: "", completedText: true },
  { id: 2, title: "Set up lighting rig", completed: false, location: "Main ballroom stage area", completedText: false },
  { id: 3, title: "Check in with Planner", completed: false, location: "", completedText: false },
];

// Brief data
const briefData = [
  {
    id: 1,
    title: "Load-in Access",
    description: "Use the rear service elevator (Code: 4829). Loading dock B is reserved for your team from 13:00-14:30.",
    icon: "warehouse",
    bgColor: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    id: 2,
    title: "Vendor Meal",
    description: "Hot meal provided at 19:00 in the Staff Room (Level 2). Vegetarian options available.",
    icon: "restaurant_menu",
    bgColor: "#ffedd5",
    iconColor: "#ea580c",
  },
  {
    id: 3,
    title: "Key Contact",
    description: "Planner: Jessica Reynolds",
    icon: "contact_phone",
    bgColor: "#f3e8ff",
    iconColor: "#9333ea",
    hasButton: true,
    phone: "+1 234 567 890",
  },
];

export default function VendorEventDetailScreen() {
  const { eventId } = useLocalSearchParams();
  const tasks = tasksData;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-3 border-b border-[#e6dbe0]">
        <TouchableOpacity 
          className="w-12 h-12 items-center justify-center -ml-2 rounded-full"
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#181114" />
        </TouchableOpacity>
        <RNText className="text-lg font-bold text-[#181114] flex-1 text-center px-2" numberOfLines={1}>
          {eventData.title}
        </RNText>
        <TouchableOpacity className="w-12 h-12 items-center justify-center -mr-2">
          <MaterialIcons name="settings" size={24} color="#181114" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="p-4">
          <View className="flex-row gap-4 items-start">
            <View className="h-24 w-24 rounded-xl overflow-hidden shadow-md shrink-0">
              <Image
                source={{ uri: eventData.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-col justify-center h-24 py-1 flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="px-2 py-0.5 rounded-full bg-green-100">
                  <RNText className="text-xs font-bold text-green-700 uppercase tracking-wider">
                    {eventData.status}
                  </RNText>
                </View>
              </View>
              <RNText className="text-xl font-bold text-[#181114] mb-1">
                {eventData.venue}
              </RNText>
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="calendar-today" size={14} color="#896175" />
                <RNText className="text-sm font-medium text-[#896175]">
                  {eventData.date}
                </RNText>
                <RNText className="text-[#896175] mx-1">•</RNText>
                <MaterialIcons name="group" size={14} color="#896175" />
                <RNText className="text-sm font-medium text-[#896175]">
                  {eventData.guests} Guests
                </RNText>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View className="pt-4 px-4">
          <View className="flex-row items-center justify-between pb-2">
            <RNText className="text-lg font-bold text-[#181114]">Timeline</RNText>
            <View className="px-2 py-1 rounded-full bg-primary/10">
              <RNText className="text-xs font-semibold text-primary">On Schedule</RNText>
            </View>
          </View>

          {timelineData.map((item, index) => (
            <View key={item.id} className="flex-row">
              {/* Timeline Icon */}
              <View className="flex-col items-center pt-2">
                <View 
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ 
                    backgroundColor: item.isActive ? "#ee2b8c" : item.iconBg,
                    shadowColor: "#ee2b8c",
                    shadowOpacity: item.isActive ? 0.3 : 0,
                    shadowRadius: item.isActive ? 8 : 0,
                    elevation: item.isActive ? 4 : 0,
                  }}
                >
                  <MaterialIcons name={item.icon as any} size={20} color={item.iconColor} />
                </View>
                {index < timelineData.length - 1 && (
                  <View className="w-[2px] bg-[#e6dbe0] h-full min-h-[40px] mt-2" />
                )}
              </View>

              {/* Timeline Content */}
              <View className="flex-col py-2 pl-3 pb-6 flex-1">
                <View className="flex-row justify-between items-baseline">
                  <RNText 
                    className={`text-base font-bold ${
                      item.isActive 
                        ? "text-primary" 
                        : item.isPast 
                          ? "text-[#181114]" 
                          : "text-[#181114]/70"
                    }`}
                  >
                    {item.title}
                  </RNText>
                  <RNText 
                    className={`text-sm font-mono font-medium ${
                      item.isActive 
                        ? "text-primary" 
                        : item.isPast 
                          ? "text-[#896175]" 
                          : "text-[#896175]/40"
                    }`}
                  >
                    {item.time}
                  </RNText>
                </View>
                <RNText 
                  className={`text-sm leading-normal mt-1 ${
                    item.isActive 
                      ? "text-[#896175]/50" 
                      : "text-[#896175]"
                  }`}
                >
                  {item.description}
                </RNText>
                
                {item.isActive && (
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <RNText className="text-sm font-medium text-primary">Happening Now</RNText>
                  </View>
                )}

                {item.note && (
                  <View className="mt-3 p-3 rounded-lg bg-background-light border border-transparent">
                    <RNText className="text-sm text-[#181114]/80">{item.note}</RNText>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View className="h-2 bg-background-light w-full my-4" />

        {/* Tasks Section */}
        <View className="pt-2 px-4">
          <View className="flex-row items-center justify-between pb-4">
            <RNText className="text-lg font-bold text-[#181114]">Your Deliverables</RNText>
            <RNText className="text-xs font-medium text-[#896175]">
              {completedCount}/{tasks.length} Completed
            </RNText>
          </View>

          <View className="flex-col gap-3">
            {tasks.map((task) => (
              <View
                key={task.id}
                className={`flex-row items-center gap-3 p-3 rounded-xl border ${
                  task.completed 
                    ? "bg-background-light border-transparent opacity-70" 
                    : "bg-white border-[#e6dbe0] shadow-sm"
                }`}
              >
                <View className="relative items-center justify-center">
                  <View 
                    className={`w-6 h-6 rounded-md border-2 ${
                      task.completed 
                        ? "bg-primary border-primary" 
                        : "border-[#896175]"
                    }`}
                  >
                    {task.completed && (
                      <MaterialIcons name="check" size={16} color="#ffffff" />
                    )}
                  </View>
                </View>
                <View className="flex-col flex-1">
                  <RNText 
                    className={`text-base font-medium ${
                      task.completed 
                        ? "text-[#181114] line-through decoration-slate-400" 
                        : "text-[#181114]"
                    }`}
                  >
                    {task.title}
                  </RNText>
                  {task.location && !task.completed && (
                    <RNText className="text-xs text-[#896175] mt-0.5">
                      {task.location}
                    </RNText>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="h-2 bg-background-light w-full my-4" />

        {/* Brief Section */}
        <View className="pt-2 px-4 pb-8">
          <RNText className="text-lg font-bold text-[#181114] mb-4">Event Brief</RNText>

          <View className="flex-col gap-4">
            {briefData.map((item) => (
              <View 
                key={item.id} 
                className="flex-row gap-4 p-4 rounded-xl bg-background-light border border-transparent"
              >
                <View 
                  className="p-2 rounded-lg h-fit"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <MaterialIcons name={item.icon as any} size={22} color={item.iconColor} />
                </View>
                <View className="flex-col flex-1">
                  <RNText className="text-sm font-bold text-[#181114] uppercase tracking-wide mb-1">
                    {item.title}
                  </RNText>
                  <RNText className="text-sm text-[#181114]/80 leading-relaxed">
                    {item.description}
                  </RNText>
                  {item.hasButton && (
                    <TouchableOpacity 
                      className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 mt-2 self-start"
                      activeOpacity={0.9}
                    >
                      <MaterialIcons name="call" size={16} color="#ee2b8c" />
                      <RNText className="text-xs font-bold text-primary">Call Jessica</RNText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer FAB */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-12">
        <TouchableOpacity 
          className="flex-row items-center justify-center gap-2 h-12 rounded-xl bg-primary shadow-lg"
          style={{ shadowColor: "#ee2b8c", shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }}
          activeOpacity={0.9}
        >
          <MaterialIcons name="chat" size={20} color="#ffffff" />
          <RNText className="text-base font-bold text-white">Message Client</RNText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Additional styles if needed
});
