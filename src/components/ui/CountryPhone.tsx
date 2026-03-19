
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { COUNTRY_DATA } from "@/src/constants/countrydata";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export type CountryOption = (typeof COUNTRY_DATA)[number];
export function CountryPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: CountryOption;
  onSelect: (c: CountryOption) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      COUNTRY_DATA.filter(
        (c) =>
          c.label.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search.replace("+", ""))
      ),
    [search]
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white">

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
          <Text className="text-lg font-bold text-gray-900">Select Country</Text>
          <Pressable onPress={onClose} className="p-2 rounded-full bg-gray-100">
            <MaterialIcons name="close" size={20} color="#374151" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="px-5 py-3">
          <View className="flex-row items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 h-12">
            <MaterialIcons name="search" size={18} color="#9ca3af" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search country or dial code..."
              placeholderTextColor="#9ca3af"
              className="flex-1 text-base text-gray-800"
              autoFocus
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <MaterialIcons name="cancel" size={18} color="#9ca3af" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Country List */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
          renderItem={({ item }) => {
            const isSelected = item.value === selected.value;
            return (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                className="flex-row items-center justify-between py-3.5"
              >
                <View className="flex-row items-center gap-4">
                  <Image
                    source={item.image}
                    style={{ width: 32, height: 22, borderRadius: 3 }}
                    resizeMode="cover"
                  />
                  <Text className="text-base text-gray-800">{item.label}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-medium text-gray-500">+{item.dialCode}</Text>
                  {isSelected && (
                    <MaterialIcons name="check-circle" size={20} color="#ee2b8c" />
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}
