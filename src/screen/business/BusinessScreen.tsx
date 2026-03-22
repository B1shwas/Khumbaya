import { BusinessCard, CreateBusinessButton } from "@/src/components/business";
import { BUSINESSES } from "@/src/constants/business";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function BusinessScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#f8f6f7]">
     

      {/* Content */}
      <ScrollView
        className="flex-1 p-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="px-5 pt-7 pb-5">
          <Text className="text-[30px] font-extrabold text-[#181114] tracking-tighter leading-9">
            My Businesses
          </Text>
          <Text className="mt-1.5 text-sm font-medium text-[#594048]">
            Manage all your professional services from one place.
          </Text>
        </View>

        {/* Business list */}
        <View className="px-4 gap-5">
          {BUSINESSES.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
          <CreateBusinessButton onPress={() => router.push("/business/create")} />
        </View>
      </ScrollView>
    </View>
  );
}
