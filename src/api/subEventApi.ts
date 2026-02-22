import { SelectedSubEvent } from "../types";

// Mock database for development
let mockDB: SelectedSubEvent[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const subEventApi = {
  /**
   * Get all sub-events
   */
  getAll: async (): Promise<SelectedSubEvent[]> => {
    await delay(300);
    return [...mockDB];
  },

  /**
   * Get a single sub-event by template ID
   */
  getById: async (
    templateId: string
  ): Promise<SelectedSubEvent | undefined> => {
    await delay(200);
    return mockDB.find((item) => item.template.id === templateId);
  },

  /**
   * Create a new sub-event
   */
  create: async (data: SelectedSubEvent): Promise<SelectedSubEvent> => {
    await delay(200);
    mockDB.push(data);
    return data;
  },

  /**
   * Update an existing sub-event
   */
  update: async (
    templateId: string,
    data: Partial<SelectedSubEvent>
  ): Promise<SelectedSubEvent | null> => {
    await delay(200);
    const index = mockDB.findIndex((item) => item.template.id === templateId);
    if (index === -1) return null;

    mockDB[index] = { ...mockDB[index], ...data };
    return mockDB[index];
  },

  /**
   * Delete a sub-event
   */
  delete: async (templateId: string): Promise<boolean> => {
    await delay(200);
    const initialLength = mockDB.length;
    mockDB = mockDB.filter((item) => item.template.id !== templateId);
    return mockDB.length < initialLength;
  },

  /**
   * Check if a sub-event exists
   */
  exists: async (templateId: string): Promise<boolean> => {
    await delay(100);
    return mockDB.some((item) => item.template.id === templateId);
  },

  /**
   * Clear all sub-events (for testing)
   */
  clear: async (): Promise<void> => {
    mockDB = [];
  },

  /**
   * Initialize with sample data (for testing)
   */
  initSample: async (): Promise<void> => {
    // Sample data would be added here if needed
  },
};

// ============================================
// BACKEND INTEGRATION NOTES:
// ============================================
// API Endpoints (to implement):
//    - GET /api/events/{id}/subevents - Get all sub-events
//    - POST /api/events/{id}/subevents - Create sub-event
//    - GET /api/subevents/{id} - Get single sub-event
//    - PUT /api/subevents/{id} - Update sub-event
//    - DELETE /api/subevents/{id} - Delete sub-event
