import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  AddCardModal,
  CardItem,
  EmptyState,
  ImagePickerModal,
  InfoSection,
} from "./components";
import { useCardMaking } from "./hooks/useCardMaking";
import { styles } from "./styles/CardMaking.styles";

export default function CardMaking() {
  const router = useRouter();
  const {
    cards,
    showAddModal,
    showImageModal,
    selectedCardId,
    newCardTitle,
    newCardCategory,
    newCardImage,
    newCardPrompt,
    setShowAddModal,
    setShowImageModal,
    setNewCardTitle,
    setNewCardCategory,
    setNewCardImage,
    setNewCardPrompt,
    handleAddCard,
    handleDeleteCard,
    handleOpenImagePicker,
    handleSelectImage,
    handleUpdatePrompt,
    resetForm,
  } = useCardMaking();

  const handleBack = () => {
    router.back();
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
        <InfoSection />

        {/* Cards Grid */}
        {cards.length > 0 ? (
          <View style={styles.cardsGrid}>
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onDelete={handleDeleteCard}
                onOpenImagePicker={handleOpenImagePicker}
                onUpdatePrompt={handleUpdatePrompt}
              />
            ))}
          </View>
        ) : (
          <EmptyState onCreateFirst={() => setShowAddModal(true)} />
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Card Modal */}
      <AddCardModal
        visible={showAddModal}
        onClose={() => {
          resetForm();
          setShowAddModal(false);
        }}
        title={newCardTitle}
        category={newCardCategory}
        image={newCardImage}
        prompt={newCardPrompt}
        onTitleChange={setNewCardTitle}
        onCategoryChange={setNewCardCategory}
        onImageChange={() => setShowImageModal(true)}
        onPromptChange={setNewCardPrompt}
        onSave={handleAddCard}
      />

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSelectImage={handleSelectImage}
      />
    </View>
  );
}
