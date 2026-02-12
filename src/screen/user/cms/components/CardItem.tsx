import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/CardMaking.styles";
import type { CardItem as CardItemType } from "../types/cardMaking";
import { getCategoryColor, getCategoryIcon } from "../types/cardMaking";

interface CardItemProps {
  card: CardItemType;
  onDelete: (cardId: string) => void;
  onOpenImagePicker: (cardId: string) => void;
  onUpdatePrompt: (cardId: string, prompt: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  onDelete,
  onOpenImagePicker,
  onUpdatePrompt,
}) => {
  return (
    <View style={styles.cardItem}>
      {/* Image Section */}
      <TouchableOpacity
        style={styles.cardImageContainer}
        onPress={() => onOpenImagePicker(card.id)}
      >
        {card.image ? (
          <Image source={{ uri: card.image }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
            <Text style={styles.cardImagePlaceholderText}>
              Tap to add image
            </Text>
          </View>
        )}
        <View style={styles.cardImageEdit}>
          <Ionicons name="camera-outline" size={16} color="white" />
        </View>
      </TouchableOpacity>

      {/* Card Details */}
      <View style={styles.cardDetails}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(card.category) },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(card.category) as any}
              size={12}
              color="white"
            />
            <Text style={styles.categoryBadgeText}>
              {card.category.replace("-", " ")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(card.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.cardTitle}>{card.title}</Text>

        {/* Prompt Input */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptLabel}>Prompt</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="Enter prompt for image generation..."
            placeholderTextColor="#9CA3AF"
            value={card.prompt}
            onChangeText={(text) => onUpdatePrompt(card.id, text)}
            multiline
          />
        </View>
      </View>
    </View>
  );
};
