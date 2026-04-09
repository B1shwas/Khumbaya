import { BusinessReview } from "@/src/constants/business";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "../../ui/Text";
export function LatestReviewSection({ reviews }: { reviews: BusinessReview[] }) {
  if (reviews.length === 0) return null;
  const review = reviews[0];
  return (
    <View
      className="bg-white rounded-md border border-gray-100 p-4"
      style={shadowStyle}
    >
      <Text variant="h1" className="text-base text-[#181114] mb-3">
        Latest Review
      </Text>
      <View className="flex-row gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name="star"
            size={16}
            color={star <= review.rating ? "#ee2b8c" : "#e5e7eb"}
          />
        ))}
      </View>
      <Text className="text-sm text-[#594048] italic mb-3 leading-5">
        "{review.quote}"
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Image
            source={{ uri: review.reviewerAvatarUrl }}
            className="w-8 h-8 rounded-full bg-gray-100"
            resizeMode="cover"
          />
          <View>
            <Text variant="h1" className="text-xs text-[#181114]">
              {review.reviewerName}
            </Text>
            <Text className="text-[10px] text-gray-400">{review.date}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center gap-1 border border-gray-200 rounded-full px-3 py-1.5"
        >
          <MaterialIcons name="reply" size={13} color="#594048" />
          <Text variant="h2" className="text-xs text-[#594048]">Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}