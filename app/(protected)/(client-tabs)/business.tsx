import { MaterialIcons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VendorDashboard() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ7XhJq5JOrAN6S4NqoVV83cVtS63_egQzglNgFRxIDOkdpqYnff5GOCJptVykZLiKgpC1jqdfzFw-SEWxNZbllAywQ7XFtB6114JgP4FCW5lq--K-mX_yCXL9k7lrg-fYFxNyB9d6-RKgH9YRF1TB6Zq-GZkzSvahX-kKENLNbqxzLbz231oldlOnh5kHRVoRSzOs7Zd1juUlBqV4rzNY2LWlmgYTJ9MVRkD1jIWSq_pU9wlqlMi__If9iDAo3ejCCFaTu-ogXN4",
              }}
              className="w-10 h-10 rounded-full"
            />

            <View>
              <Text className="text-xs text-gray-400">Welcome </Text>
              <Text className="font-bold text-lg">Event Pro Solutions</Text>
            </View>
          </View>

          <TouchableOpacity>
            <MaterialIcons name="notifications" size={26} color="black" />
          </TouchableOpacity>
        </View>

        {/* SUMMARY CARDS */}
        <View className="flex-row gap-4 px-4 mt-4">
          <Card title="Total Income" value="$12,450" icon="payments" />
          <Card title="Upcoming Events" value="8" icon="calendar-today" />
        </View>

        {/* PERFORMANCE */}
        <View className="mx-4 mt-6 bg-white p-4 rounded-2xl">
          <Text className="font-bold mb-4">Performance</Text>

          <View className="flex-row items-end justify-between h-32">
            {[40, 65, 50, 85, 70, 95].map((h, i) => (
              <View
                key={i}
                style={{ height: `${h}%` }}
                className="bg-pink-400 w-3 rounded-full"
              />
            ))}
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <Text className="font-bold text-lg mt-6 px-4">Quick Actions</Text>

        <View className="flex-row flex-wrap gap-3 px-4 mt-3">
          <Action icon="analytics" label="Analytics" primary />
          <Action icon="trending-up" label="Client Growth" />
          <Action icon="history" label="Business History" />
          <Action icon="feedback" label="feedback" />
        </View>

        {/* REVIEWS */}
        <Text className="font-bold text-lg mt-6 px-4">Recent Reviews</Text>

        <View className="px-4 mt-3 gap-3">
          <Review
            name="Sarah Jenkins"
            text="The wedding planning was seamless. Amazing communication and professional staff!"
          />

          <Review
            name="Michael Chen"
            text="Very reliable vendor. Our corporate gala went off without a single hitch."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ title, value, icon }: any) {
  return (
    <View className="flex-1 bg-white p-4 rounded-2xl">
      <MaterialIcons name={icon} size={22} color="#ee2b8c" />
      <Text className="text-gray-400 text-xs mt-2">{title}</Text>
      <Text className="font-bold text-xl mt-1">{value}</Text>
    </View>
  );
}

function Action({ icon, label, primary }: any) {
  return (
    <TouchableOpacity
      className={`w-[48%] p-4 rounded-2xl items-center ${
        primary ? "bg-pink-500" : "bg-white border border-gray-200"
      }`}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={primary ? "white" : "#ee2b8c"}
      />
      <Text
        className={`mt-1 font-semibold ${
          primary ? "text-white" : "text-black"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Review({ name, text }: any) {
  return (
    <View className="bg-white p-4 rounded-2xl">
      <Text className="font-bold">{name}</Text>
      <Text className="text-gray-500 text-sm mt-1 italic">"{text}"</Text>
    </View>
  );
}

function Nav({ icon, label, active }: any) {
  return (
    <TouchableOpacity className="items-center">
      <MaterialIcons
        name={icon}
        size={24}
        color={active ? "#ee2b8c" : "gray"}
      />
      <Text
        className={`text-xs ${
          active ? "text-pink-500 font-bold" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
