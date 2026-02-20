import AsyncStorage from "@react-native-async-storage/async-storage";
import { Guest, STORAGE_KEY, Table } from "./tableHelpers";

interface SavedData {
  tables: Table[];
  guests: Guest[];
  savedAt: string;
}

/**
 * Load saved table assignments from storage
 */
export const loadTableAssignments = async (
  eventId: string
): Promise<{ tables: Table[]; guests: Guest[] } | null> => {
  try {
    const savedData = await AsyncStorage.getItem(`${STORAGE_KEY}_${eventId}`);
    if (savedData) {
      const parsed: SavedData = JSON.parse(savedData);
      return {
        tables: parsed.tables || [],
        guests: parsed.guests || [],
      };
    }
    return null;
  } catch (error) {
    console.log("Failed to load saved data:", error);
    return null;
  }
};

/**
 * Save table assignments to storage
 */
export const saveTableAssignments = async (
  eventId: string,
  tables: Table[],
  guests: Guest[]
): Promise<boolean> => {
  try {
    const dataToSave: SavedData = {
      tables,
      guests,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(
      `${STORAGE_KEY}_${eventId}`,
      JSON.stringify(dataToSave)
    );
    return true;
  } catch (error) {
    console.log("Failed to save data:", error);
    return false;
  }
};

/**
 * Clear saved table assignments
 */
export const clearTableAssignments = async (
  eventId: string
): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_KEY}_${eventId}`);
    return true;
  } catch (error) {
    console.log("Failed to clear data:", error);
    return false;
  }
};
