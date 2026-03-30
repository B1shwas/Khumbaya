import { Text } from "@/src/components/ui/Text";
import { ONBOARDING_VENDORS } from "@/src/constants/vendors";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from "react-native";

export default function VendorDetailed() {
  const router = useRouter();
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();

  const resolvedId = Array.isArray(vendorId) ? vendorId[0] : vendorId;
  const vendor = ONBOARDING_VENDORS.find((v) => v.id === resolvedId);

  if (!vendor) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Vendor not found</Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 px-6 py-3 bg-primary rounded-lg"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <View className="absolute bottom-0 left-0 right-0 z-10 h-24">
        <View className="bg-white/90 border-t border-gray-200  px-4 py-4">
          <View className="w-full max-w-md self-center">
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 rounded-lg bg-primary py-3.5 px-4 items-center justify-center shadow-lg shadow-primary/30 active:scale-[0.98]"
                onPress={() =>
                  router.push({
                    pathname: "/(shared)/explore/[vendorId]/enquiryform",
                    params: { vendorId: resolvedId },
                  })
                }
              >
                <Text className="text-lg font-bold text-white font-display">
                  Send Enquiry
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        stickyHeaderIndices={[4]}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-full rounded-md">
          <ImageBackground
            source={{ uri: vendor.headerImage }}
            className="w-full h-[24vh]  "
            resizeMode="cover"
          >
            <View className="flex-row justify-between items-center px-4 pt-4">
              <Pressable
                onPress={() => router.back()}
                className="h-10 w-10 items-center justify-center rounded-full bg-black/30 shadow-sm"
              >
                <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/30 shadow-sm">
                <MaterialIcons name="favorite" size={20} color="#ffffff" />
              </Pressable>
            </View>
          </ImageBackground>
          <View className=" h-32 w-32 absolute -bottom-16 left-4 z-20 border-1 rounded-full  border-primary bg-primary p-1">
            <View className="h-full w-full rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                source={{ uri: vendor.avatar }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View className="px-4 pt-20 pb-4 bg-white">
          <View className="flex-row justify-between items-start">
            <Text className="text-2xl font-bold leading-tight tracking-tight text-[#181114]">
              {vendor.name}
            </Text>
            <View className="flex  gap-2">
              <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <MaterialIcons name="verified" size={14} color="#16a34a" />
                <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                  Verified
                </Text>
              </View>
              <View className="flex-row gap-2 shadow-sm shadow-black">
                <Pressable
                  className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100"
                  onPress={() =>
                    router.push(
                      `/(shared)/explore/${resolvedId}/vendorcomparision`
                    )
                  }
                >
                  <MaterialIcons
                    name="compare-arrows"
                    size={18}
                    color="#16a34a"
                  />

                  <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                    Compare
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-1 mt-1">
            <MaterialIcons name="location-on" size={18} color="#6B7280" />
            <Text className="text-sm text-gray-500">{vendor.location}</Text>
          </View>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1 bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
              <MaterialIcons name="star" size={16} color="#ee2b8c" />
              <Text className="text-sm font-bold text-[#181114]">
                {vendor.rating}
              </Text>
              <Text className="text-xs text-gray-500">
                ({vendor.reviews} Reviews)
              </Text>
            </View>
            <View className="h-4 w-px bg-gray-200" />
            <Text className="text-sm text-primary font-semibold">
              Top Rated Vendor
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-white"
          contentContainerClassName="px-4 py-2 gap-2"
        >
          {vendor.tags.map((tag) => (
            <View
              key={tag}
              className="px-4 py-1.5 rounded-lg bg-gray-50 border border-gray-100"
            >
              <Text className="text-gray-600 text-xs font-medium">{tag}</Text>
            </View>
          ))}
        </ScrollView>

        <View className="px-4 pb-6 bg-white">
          <Text className="text-gray-600 text-sm leading-relaxed">
            {vendor.description}
          </Text>
        </View>

        <View className="bg-white/95 border-y border-gray-100 flex-row justify-between px-6">
          <Pressable className="py-4 border-b-2 border-primary">
            <Text className="text-primary font-bold text-sm">Portfolio</Text>
          </Pressable>
          <Pressable className="py-4 border-b-2 border-transparent">
            <Text className="text-gray-400 font-bold text-sm">Services</Text>
          </Pressable>
          <Pressable className="py-4 border-b-2 border-transparent">
            <Text className="text-gray-400 font-bold text-sm">Reviews</Text>
          </Pressable>
        </View>

        <View className="px-4 py-6 bg-white">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-[#181114]">
              Featured Gallery
            </Text>
            <Text className="text-primary text-sm font-bold">View All</Text>
          </View>
          <View className="gap-2">
            <View className="w-full aspect-[21/9] rounded-xl overflow-hidden shadow-sm">
              <Image
                source={{ uri: vendor.gallery[0] }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-row gap-3 my-2">
              <Pressable className="h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white">
                <MaterialIcons name="chat-bubble" size={20} color="#6B7280" />
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1 aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: vendor.gallery[1] }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: vendor.gallery[2] }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 items-center justify-center bg-black/40">
                  <Text className="text-white font-bold text-xl">+24</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 py-6 bg-white mt-2">
          <Text className="text-lg font-bold text-[#181114] mb-4">
            Packages & Services
          </Text>
          <View className="gap-4">
            {vendor.packages.map((item) => (
              <View
                key={item.title}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
              >
                {item.badge ? (
                  <View className="absolute top-0 right-4 -translate-y-1/2 bg-primary px-3 py-1 rounded-full shadow-sm">
                    <Text className="text-white text-[9px] font-bold">
                      {item.badge}
                    </Text>
                  </View>
                ) : null}
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-bold text-[#181114]">{item.title}</Text>
                  <Text className="text-primary font-bold text-sm">
                    {item.price}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs mb-4 leading-relaxed">
                  {item.description}
                </Text>
                <Pressable className="flex-row items-center gap-1">
                  <Text className="text-sm font-bold text-primary">
                    View Details
                  </Text>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={14}
                    color="#ee2b8c"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View className="px-4 py-6 bg-white mt-2">
          <View className="flex-row justify-between items-baseline mb-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-[#181114]">
                Recent Reviews
              </Text>
              <Text className="text-xs text-gray-400 font-medium">
                {vendor.reviews} total
              </Text>
            </View>
            <Text className="text-primary text-sm font-bold">View All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 pb-4"
          >
            {vendor.detailReviews.map((review) => (
              <View
                key={review.name}
                className="w-80 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
              >
                <View className="flex-row items-center gap-3 mb-3">
                  <Image
                    source={{ uri: review.avatar }}
                    className="h-10 w-10 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#181114]">
                      {review.name}
                    </Text>
                    <Text className="text-[10px] text-gray-400">
                      {review.time}
                    </Text>       
                  </View>
                  <View className="flex-row gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <MaterialIcons
                        key={`${review.name}-${index}`}
                        name="star"
                        size={14}
                        color={index < review.rating ? "#facc15" : "#e5e7eb"}
                      />
                    ))}
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed italic">
                  "{review.text}"
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}
