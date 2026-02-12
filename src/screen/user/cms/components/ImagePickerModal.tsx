import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../styles/CardMaking.styles";
import { MOCK_IMAGES } from "../types/cardMaking";

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (uri: string) => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onSelectImage,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.imageModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Image</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={MOCK_IMAGES}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.imageGridItem}
                onPress={() => onSelectImage(item.uri)}
              >
                <Image source={{ uri: item.uri }} style={styles.gridImage} />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.imageGrid}
          />
        </View>
      </View>
    </Modal>
  );
};
