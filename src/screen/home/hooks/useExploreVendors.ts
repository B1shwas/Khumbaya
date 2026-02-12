import { useState, useCallback } from "react";
import { router } from "expo-router";
import { useAuth } from "@/src/store/AuthContext";
import type { Category } from "../types/explorevendors";

export const useExploreVendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { user } = useAuth();

  const handleCategoryPress = useCallback((category: Category) => {
    setActiveCategory(category);
  }, []);

  const handleLoginPress = useCallback(() => {
    router.push("/login");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    handleCategoryPress,
    user,
    handleLoginPress,
  };
};
