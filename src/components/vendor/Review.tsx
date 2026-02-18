import { Text, View } from "react-native";

type ReviewProps = {
  name: string;
  text: string;
};

export default function Review({ name, text }: ReviewProps) {
  return (
    <View className="bg-white p-4 rounded-2xl">
      <Text className="font-bold">{name}</Text>
      <Text className="text-gray-500 text-sm mt-1 italic">
        "{text}"
      </Text>
    </View>
  );
}
