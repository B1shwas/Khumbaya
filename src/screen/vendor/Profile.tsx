import { Text } from "@/src/components/ui/Text";
import { useAuth } from "@/src/store/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HEADER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCkAYir1uyaMJpHYxd3cTDm5UEx_lcVJTxtNY2aX-7SjfphxWwmRyzcN_I9jAgIIpqkB_WoA3q32x9izN6Kr_lfZk_2h8e2QgTa8ySCVzEuaPyt5iGLXvBLYh3Zmyzj9cd9ehQAy-8AIflmKb745Ui3-jn0RoRfgnaTlQuf-Ma27foOExZUSdI-ngacDOkkK56JuW_U6PfIPZug2LybUCfyo33uKUW6vcSNo2nbtsj91MFuVaVvo5d1GpzvmPpd9hv1643KT_ec4KM";
const AVATAR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDIWVyUn7mizRXt-pU0k_RKFdAfNF_d21mLZuL6fE-z88oUHVipXSGUhNmA5WfOISIeb5QApM1WV-MqiArQgJejxYGuerwubu6lcVkwkED06qEDLGBM7Xqz0ISW7b9rPn7S5ZW1hwAZxyVJLtwp0mkKKpGBUzYThC2D9AsRi-INlhoD8olL86wNyceuSQjvSCGLvlkuKEaRRpvGNa3ooDKEzBTa-g2eoD-4QuvwrSjC7f8_Nwv5Gm18EKFeYf5rKFnpg1QNMlLOq18";

const TAGS = ["Mehndi", "Sangeet", "Nikah", "Pre-Wedding"];

const GALLERY = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDl1WMOA-FGsUYEo4NC3d-GP8U8IPst7R9ffefFCrImLzEXvVQhpjyl1XVqKmXYO3nWx6tb0bWpmfNuGvZhiUUJmY8csevYr7Pov0XjJskRdf1wnNtHoLTnWvXfbk5fTOTLBxZ9gEcYNOyevxjhFExMz0x_9dnhY-JwCMcd9gLxinxUBoYlhHyf6Y72ASivvCVZZm4O8MhgLe7gmOvumPyOLEHUyyQVQkg7gk6jqw1Gb9wYnah9neKBND8Sp1LIosywjXyTzHhU-XY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYeV71hF5lCTG2Rs3fVfHbHj6xW0lLMJjeKIT5t2oFNQvMQCsyn9LQwEaTDjwe7KKiPSpkxWI_anv_EQNgNuL76Rhc5BRTzg_y6bKvLDVLhYudAbzBBN38BIv74wdSXaHgS-h175YWOIdPF3mVUI0iDu9dSS4A3AdFm8XNt7FnpAIOjEBKI2LLO-tOdnvsj3GaxdBJd0Fv7IXUUqIHS4nJ0Aq_17FmXfQTIKfipCWpCcaiAcxN4UCEn66V3UtdBbiL2qun6mk6UyE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpp51MGdcz2CaS_-F_SFIuK3aVZ7OXvsVVPqCvX7ehi1wfAm0fu52s3HOa5lTBmal9m9zwFDRL7eWZLoAQtcVWnYGLr4BmuBovXDqMNoqp-fmiQaw7P7Qby6ftrwPBK-2bQQDjvHk6viUHa1utnrhN8z88x3-BmmzDvd9_O59ZQtyCjRNNgX1yF6iLvPi9IiGmPwoIRnt48r8eoTfOwqfJkgeHrhNcdWgDX74rELXlJaXEI5CrgqS-VACXj2LzM7xIQ4KP311BeaI",
];

const PACKAGES = [
  {
    title: "Pre-Wedding Shoot",
    price: "$500",
    description:
      "4-hour session, 2 locations, 50 edited photos, and 1 highlight reel.",
  },
  {
    title: "Full Wedding Day",
    price: "$2,500",
    description:
      "12-hour coverage, candid & traditional, 500+ photos, full cinematic film.",
    badge: "POPULAR",
  },
];

const REVIEWS = [
  {
    name: "Priya K.",
    time: "2 weeks ago",
    rating: 5,
    text:
      "Absolutely stunning photos! The team was so patient during the chaos of the Sangeet. Highly recommend!",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHurQM4fc1EwxTv_cbG4E2w8x7NOgDCMO2HvVFF5pdMaz05kqyfKwEVM8nLp5CCF3X7UeQJrwn8bORBppaNLkiwc-q0wKQl9ytS6sqJsBEWAIj5eLOmRiYoq6K8Yu6CkIXV36hx7r_fwwY90EkqEk99zqtA2BSdEycfa9TDvfbQj4SCx5T9A20UzJrkLgAoSvka3LwZ92hXKwt1bfJo5y6JU6VKLT1IJi3wIKqzZmcJExAPx0Oni-_rOVZP1zFT4y_FJRh-pP_a0E",
  },
  {
    name: "Rahul M.",
    time: "1 month ago",
    rating: 4,
    text:
      "Great experience overall. The traditional shots were perfect, though candid shots could be better.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUGNbh5r0Hd8HhuMwBb-ncGQvlFlt3gDZRlh8w-_7AakSrG5l1xJ8rPNGqf9EUQ9XAfy1pK2-xZTi8E7w_2jvjUQoTcC5GVc5ccnHy-srjuVtWfV2S7RzNZ21WulXyl7_Y4vPusRzhSraU2Xr90vFK-qK9QuAPqKsckn4jf9R-qtI3JdAqCpBFp00zs7LZBuYGOPa_DoQRtUK1L7liutL-P8jcy-6R52TLMPtmvCvCIWhQ7M7P-OghB8ajCSpyjcQR9Kv3g5cL0qw",
  },
];

export default function Profile() {
  const { logout } = useAuth();
  const [logginOut, setLoggingOut] = useState(false);
  if (logginOut) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600">Logging out...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-[#fafafa]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        stickyHeaderIndices={[4]}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative w-full">
          <ImageBackground
            source={{ uri: HEADER_IMAGE }}
            className="w-full h-[280px]"
            resizeMode="cover"
          >
            <View className="flex-row justify-between items-center px-4 pt-4">
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/30 shadow-sm">
                <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-black/30 shadow-sm">
                <MaterialIcons name="favorite" size={20} color="#ffffff" />
              </Pressable>
            </View>
          </ImageBackground>
          <View className="absolute -bottom-16 left-4">
            <View className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <Image
                source={{ uri: AVATAR_IMAGE }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View className="px-4 pt-20 pb-4 bg-white">
          <View className="flex-row justify-between items-start">
            <Text className="text-2xl font-bold leading-tight tracking-tight text-[#181114]">
              Radiant Moments Photography
            </Text>
            <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
              <MaterialIcons name="verified" size={14} color="#16a34a" />
              <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                Verified
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 mt-1">
            <MaterialIcons name="location-on" size={18} color="#6B7280" />
            <Text className="text-sm text-gray-500">Delhi, India</Text>
          </View>
          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1 bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
              <MaterialIcons name="star" size={16} color="#ee2b8c" />
              <Text className="text-sm font-bold text-[#181114]">4.9</Text>
              <Text className="text-xs text-gray-500">(120 Reviews)</Text>
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
          {TAGS.map((tag) => (
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
            Capturing the soul of Indian weddings for over 10 years. We
            specialize in candid moments and traditional rituals, ensuring your
            memories last forever. Our team...
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
                source={{ uri: GALLERY[0] }}
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
                  source={{ uri: GALLERY[1] }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 aspect-square rounded-xl overflow-hidden shadow-sm">
                <Image
                  source={{ uri: GALLERY[2] }}
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
            {PACKAGES.map((item) => (
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
                  <Text className="font-bold text-[#181114]">
                    {item.title}
                  </Text>
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
        <View className="p-6">
        <Pressable className="flex-1 h-12 items-center justify-center rounded-xl bg-primary"
            onPress={async () => {
              try {
                setLoggingOut(true);
                await AsyncStorage.removeItem("auth_user");
                logout();
              } catch (e) {
                setLoggingOut(false);
                // TODO: show error feedback
              }
            }}>
            <Text className="text-white text-base font-bold">
              Log Out
            </Text>
          </Pressable>

        </View>


        <View className="px-4 py-6 bg-white mt-2">
          <View className="flex-row justify-between items-baseline mb-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-bold text-[#181114]">
                Recent Reviews
              </Text>
              <Text className="text-xs text-gray-400 font-medium">
                120 total
              </Text>
            </View>
            <Text className="text-primary text-sm font-bold">View All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 pb-4"
          >
            {REVIEWS.map((review) => (
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
                        color={
                          index < review.rating ? "#facc15" : "#e5e7eb"
                        }
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
    </SafeAreaView>
  );
}