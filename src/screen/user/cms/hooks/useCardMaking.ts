import { useCallback, useState } from "react";
import type { CardItem } from "../types/cardMaking";

interface UseCardMakingReturn {
  cards: CardItem[];
  showAddModal: boolean;
  showImageModal: boolean;
  selectedCardId: string | null;
  newCardTitle: string;
  newCardCategory: CardItem["category"];
  newCardImage: string | null;
  newCardPrompt: string;
  setShowAddModal: (show: boolean) => void;
  setShowImageModal: (show: boolean) => void;
  setSelectedCardId: (id: string | null) => void;
  setNewCardTitle: (title: string) => void;
  setNewCardCategory: (category: CardItem["category"]) => void;
  setNewCardImage: (image: string | null) => void;
  setNewCardPrompt: (prompt: string) => void;
  handleAddCard: () => void;
  handleDeleteCard: (cardId: string) => void;
  handleOpenImagePicker: (cardId: string) => void;
  handleSelectImage: (uri: string) => void;
  handleUpdatePrompt: (cardId: string, prompt: string) => void;
  resetForm: () => void;
}

export const useCardMaking = (): UseCardMakingReturn => {
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

  const handleAddCard = useCallback(() => {
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
  }, [newCardTitle, newCardImage, newCardPrompt, newCardCategory]);

  const resetForm = useCallback(() => {
    setNewCardTitle("");
    setNewCardCategory("invitation");
    setNewCardImage(null);
    setNewCardPrompt("");
  }, []);

  const handleDeleteCard = useCallback((cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  const handleOpenImagePicker = useCallback((cardId: string) => {
    setSelectedCardId(cardId);
    setShowImageModal(true);
  }, []);

  const handleSelectImage = useCallback(
    (uri: string) => {
      if (selectedCardId) {
        // Update the specific card
        setCards((prev) =>
          prev.map((card) =>
            card.id === selectedCardId ? { ...card, image: uri } : card,
          ),
        );
      } else {
        // For new card creation
        setNewCardImage(uri);
      }
      setShowImageModal(false);
      setSelectedCardId(null);
    },
    [selectedCardId],
  );

  const handleUpdatePrompt = useCallback((cardId: string, prompt: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === cardId ? { ...card, prompt } : card)),
    );
  }, []);

  return {
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
    setSelectedCardId,
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
  };
};
