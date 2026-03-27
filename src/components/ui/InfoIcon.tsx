import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { Text } from "./Text";

interface InfoIconProps {
  title: string;
  description: string;
  iconStyle?: string;
}

export function InfoIcon({ title, description, iconStyle }: InfoIconProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setShowModal(true)} activeOpacity={0.6}>
        <MaterialIcons
          name="info"
          size={14}
          color="#ffffff"
          className={iconStyle && iconStyle}
        />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowModal(false)}
          className="flex-1 bg-black/40 flex items-center justify-center px-6"
        >
          <View className="bg-white rounded-md p-6 max-w-xs shadow-lg">
            <View className="flex-row justify-between items-start mb-4">
              <Text className="text-lg text-[#181114] flex-1 pr-2" variant="h2">
                {title}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={20} color="#999" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-600 leading-6" variant="h2">
              {description}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
