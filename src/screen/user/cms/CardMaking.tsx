import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================
// Types
// ============================================

interface CardItem {
  id: string;
  title: string;
  image: string | null;
  prompt: string;
  category:
    | "invitation"
    | "thankyou"
    | "save-the-date"
    | "bride-book"
    | "other";
}

interface ImageOption {
  id: string;
  uri: string;
  category: string;
}

// Mock image gallery for selection
const MOCK_IMAGES: ImageOption[] = [
  {
    id: "img1",
    uri: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400",
    category: "wedding",
  },
  {
    id: "img2",
    uri: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400",
    category: "wedding",
  },
  {
    id: "img3",
    uri: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=400",
    category: "decoration",
  },
  {
    id: "img4",
    uri: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400",
    category: "flowers",
  },
  {
    id: "img5",
    uri: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?w=400",
    category: "wedding",
  },
  {
    id: "img6",
    uri: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400",
    category: "rings",
  },
  {
    id: "img7",
    uri: "https://images.unsplash.com/photo-1591604466107-ec6de0cf4239?w=400",
    category: "couple",
  },
  {
    id: "img8",
    uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    category: "bride",
  },
];

const CARD_CATEGORIES = [
  { id: "invitation", name: "Wedding Invitation", icon: "mail" },
  { id: "thankyou", name: "Thank You Card", icon: "heart" },
  { id: "save-the-date", name: "Save the Date", icon: "calendar" },
  { id: "bride-book", name: "Bridal Book", icon: "book" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

export default function CardMaking() {
  const router = useRouter();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // New card form state
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardCategory, setNewCardCategory] =
    useState<CardItem["category"]>("invitation");
  const [newCardImage, setNewCardImage] = useState<string | null>(null);
  const [newCardPrompt, setNewCardPrompt] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      const newCard: CardItem = {
        id: Date.now().toString(),
        title: newCardTitle.trim(),
        image: newCardImage,
        prompt: newCardPrompt.trim(),
        category: newCardCategory,
      };
      setCards((prev) => [...prev, newCard]);
      resetForm();
      setShowAddModal(false);
    }
  };

  const resetForm = () => {
    setNewCardTitle("");
    setNewCardCategory("invitation");
    setNewCardImage(null);
    setNewCardPrompt("");
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  };

  const handleOpenImagePicker = (cardId: string) => {
    setSelectedCardId(cardId);
    setShowImageModal(true);
  };

  const handleSelectImage = (uri: string) => {
    if (selectedCardId) {
      // Update the specific card
      setCards((prev) =>
        prev.map((card) =>
          card.id === selectedCardId ? { ...card, image: uri } : card
        )
      );
    } else {
      // For new card creation
      setNewCardImage(uri);
    }
    setShowImageModal(false);
    setSelectedCardId(null);
  };

  const handleUpdatePrompt = (cardId: string, prompt: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, prompt } : card))
    );
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      invitation: "#ee2b8c",
      thankyou: "#10B981",
      "save-the-date": "#F59E0B",
      "bride-book": "#8B5CF6",
      other: "#6B7280",
    };
    return colors[category] || "#6B7280";
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      invitation: "mail",
      thankyou: "heart",
      "save-the-date": "calendar",
      "bride-book": "book",
      other: "ellipsis-horizontal",
    };
    return icons[category] || "ellipsis-horizontal";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#181114" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cards & Invitations</Text>
        <TouchableOpacity
          style={styles.addHeaderButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#ee2b8c" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="image-outline" size={24} color="#ee2b8c" />
            <Text style={styles.infoTitle}>Create Cards & Books</Text>
            <Text style={styles.infoSubtitle}>
              Select images and enter prompts to create beautiful invitations,
              thank you cards, and bridal books
            </Text>
          </View>
        </View>

        {/* Cards Grid */}
        {cards.length > 0 ? (
          <View style={styles.cardsGrid}>
            {cards.map((card) => (
              <View key={card.id} style={styles.cardItem}>
                {/* Image Section */}
                <TouchableOpacity
                  style={styles.cardImageContainer}
                  onPress={() => handleOpenImagePicker(card.id)}
                >
                  {card.image ? (
                    <Image
                      source={{ uri: card.image }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <View style={styles.cardImagePlaceholder}>
                      <Ionicons
                        name="image-outline"
                        size={32}
                        color="#9CA3AF"
                      />
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
                      onPress={() => handleDeleteCard(card.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
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
                      onChangeText={(text) => handleUpdatePrompt(card.id, text)}
                      multiline
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="card-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No cards yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to create your first card
            </Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.createFirstButtonText}>Create Card</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          resetForm();
          setShowAddModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Card</Text>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
              >
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
                {CARD_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      newCardCategory === cat.id && styles.categoryItemSelected,
                    ]}
                    onPress={() =>
                      setNewCardCategory(cat.id as CardItem["category"])
                    }
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        newCardCategory === cat.id &&
                          styles.categoryIconSelected,
                      ]}
                    >
                      <Ionicons
                        name={cat.icon as any}
                        size={20}
                        color={newCardCategory === cat.id ? "white" : "#6B7280"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.categoryName,
                        newCardCategory === cat.id &&
                          styles.categoryNameSelected,
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
                value={newCardTitle}
                onChangeText={setNewCardTitle}
              />

              {/* Image Selection */}
              <Text style={styles.inputLabel}>Cover Image (Optional)</Text>
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={() => setShowImageModal(true)}
              >
                {newCardImage ? (
                  <Image
                    source={{ uri: newCardImage }}
                    style={styles.selectedImage}
                  />
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
                value={newCardPrompt}
                onChangeText={setNewCardPrompt}
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleAddCard}
            >
              <Text style={styles.modalSaveButtonText}>Create Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <Modal
        visible={showImageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imageModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Image</Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
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
                  onPress={() => handleSelectImage(item.uri)}
                >
                  <Image source={{ uri: item.uri }} style={styles.gridImage} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.imageGrid}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f6f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  addHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FDF2F8",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FDF2F8",
  },
  infoTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginTop: 8,
  },
  infoSubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  cardsGrid: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardItem: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardImageContainer: {
    position: "relative",
    height: 160,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImagePlaceholderText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 8,
  },
  cardImageEdit: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  cardDetails: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryBadgeText: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 11,
    color: "white",
    textTransform: "capitalize",
  },
  deleteButton: {
    padding: 4,
  },
  cardTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "#181114",
    marginBottom: 12,
  },
  promptContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
  },
  promptLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  promptInput: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    minHeight: 60,
    textAlignVertical: "top",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
    marginTop: 16,
  },
  emptySubtitle: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  createFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 24,
    gap: 8,
  },
  createFirstButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 14,
    color: "white",
  },
  bottomSpacing: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  imageModalContent: {
    backgroundColor: "white",
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 18,
    color: "#181114",
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    maxHeight: "65%",
  },
  inputLabel: {
    fontFamily: "PlusJakartaSans-SemiBold",
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  categoryItem: {
    width: "47%",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  categoryItemSelected: {
    borderColor: "#ee2b8c",
    backgroundColor: "#FDF2F8",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryIconSelected: {
    backgroundColor: "#ee2b8c",
  },
  categoryName: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  categoryNameSelected: {
    color: "#ee2b8c",
    fontFamily: "PlusJakartaSans-SemiBold",
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#181114",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  promptMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    marginBottom: 16,
  },
  imagePickerPlaceholder: {
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  imageGrid: {
    padding: 16,
    gap: 12,
  },
  imageGridItem: {
    width: "48%",
    marginBottom: 12,
  },
  gridImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  modalSaveButton: {
    backgroundColor: "#ee2b8c",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  modalSaveButtonText: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 16,
    color: "white",
  },
});
