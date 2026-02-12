import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../styles/CardMaking.styles";
import type {
    CardCategory,
    CardItem as CardItemType,
} from "../types/cardMaking";
import { CARD_CATEGORIES } from "../types/cardMaking";

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  category: CardItemType["category"];
  image: string | null;
  prompt: string;
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: CardItemType["category"]) => void;
  onImageChange: () => void;
  onPromptChange: (prompt: string) => void;
  onSave: () => void;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  title,
  category,
  image,
  prompt,
  onTitleChange,
  onCategoryChange,
  onImageChange,
  onPromptChange,
  onSave,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Card</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#181114" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Category Selection */}
            <Text style={styles.inputLabel}>Card Type</Text>
            <View style={styles.categoryGrid}>
              {CARD_CATEGORIES.map((cat: CardCategory) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryItem,
                    category === cat.id && styles.categoryItemSelected,
                  ]}
                  onPress={() =>
                    onCategoryChange(cat.id as CardItemType["category"])
                  }
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      category === cat.id && styles.categoryIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={20}
                      color={category === cat.id ? "white" : "#6B7280"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryName,
                      category === cat.id && styles.categoryNameSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title Input */}
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Wedding Invitation"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={onTitleChange}
            />

            {/* Image Selection */}
            <Text style={styles.inputLabel}>Cover Image (Optional)</Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={onImageChange}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                  <Text style={styles.imagePickerText}>
                    Tap to select image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Prompt Input */}
            <Text style={styles.inputLabel}>Prompt</Text>
            <TextInput
              style={[styles.textInput, styles.promptMultiline]}
              placeholder="Describe what you want the card to look like..."
              placeholderTextColor="#9CA3AF"
              value={prompt}
              onChangeText={onPromptChange}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <TouchableOpacity style={styles.modalSaveButton} onPress={onSave}>
            <Text style={styles.modalSaveButtonText}>Create Card</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
