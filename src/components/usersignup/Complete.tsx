import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import React from "react";
import { ScrollView, TextInput, View } from "react-native";

type CompleteData = {
  city: string;
  country: string;
  foodPreference: string;
  bio: string;
};

type CompleteProps = {
  data: CompleteData;
  onChange: (updates: Partial<CompleteData>) => void;
  onNext: () => void;
};

export default function Complete({ data, onChange, onNext }: CompleteProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 24,
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="pt-2">
        <Text className="text-3xl font-jakarta-bold text-text-light">
          Complete Your Profile
        </Text>
        <Text className="text-base text-muted-light mt-2">
          Help us tailor your event experience by providing a few more details
          about yourself.
        </Text>
      </View>

      <View className="gap-5 pt-6">
        <View className="flex-row gap-4">
          <View className="flex-1 gap-2">
            <Text className="text-sm font-jakarta-semibold text-text-light">
              City
            </Text>
            <TextInput
              value={data.city}
              onChangeText={(value) => onChange({ city: value })}
              placeholder="e.g. London"
              placeholderTextColor="#9CA3AF"
              className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
            />
          </View>
          <View className="flex-1 gap-2">
            <Text className="text-sm font-jakarta-semibold text-text-light">
              Country
            </Text>
            <TextInput
              value={data.country}
              onChangeText={(value) => onChange({ country: value })}
              placeholder="e.g. UK"
              placeholderTextColor="#9CA3AF"
              className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
            />
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-jakarta-semibold text-text-light">
            Food Preference
          </Text>
          <TextInput
            value={data.foodPreference}
            onChangeText={(value) => onChange({ foodPreference: value })}
            placeholder="Select dietary requirement"
            placeholderTextColor="#9CA3AF"
            className="h-14 rounded-xl border border-border bg-white px-4 text-base text-text-light"
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-jakarta-semibold text-text-light">
            Bio
          </Text>
          <TextInput
            value={data.bio}
            onChangeText={(value) => onChange({ bio: value })}
            placeholder="Tell us about your event style and preferences..."
            placeholderTextColor="#9CA3AF"
            className="min-h-[120px] rounded-xl border border-border bg-white px-4 py-3 text-base text-text-light"
            multiline
            textAlignVertical="top"
          />
          <Text className="text-xs text-gray-400">Max 250 characters</Text>
        </View>
      </View>

      <View className="mt-auto pt-8">
        <Button onPress={onNext} className="rounded-xl">
          Complete Profile
        </Button>
      </View>
    </ScrollView>
  );
}
