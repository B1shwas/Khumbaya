import { subEventApi } from "@/src/api/subEventApi";
import {
  SUB_EVENT_TEMPLATES,
  SubEventTemplate,
  TemplateActivity,
} from "@/src/constants/subeventTemplates";
import { Guest, SelectedActivity, Vendor } from "@/src/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

export interface UseSubEventReturn {
  // State
  template: SubEventTemplate | null;
  date: string;
  theme: string;
  budget: string;
  activities: SelectedActivity[];
  guests: Guest[];
  vendors: Vendor[];
  isLoading: boolean;

  // Computed
  selectedVendorsCount: number;
  invitedGuestsCount: number;
  selectedActivityIds: string[];

  // Event Details
  setDate: (date: string) => void;
  setTheme: (theme: string) => void;
  setBudget: (budget: string) => void;

  // Activity handlers
  handleActivityToggle: (activity: TemplateActivity) => void;
  handleActivityTimeChange: (activityId: string, time: string) => void;
  handleActivityBudgetChange: (activityId: string, budget: string) => void;
  isActivitySelected: (activityId: string) => boolean;
  getSelectedActivity: (activityId: string) => SelectedActivity | undefined;

  // Vendor handlers
  handleToggleVendor: (vendorId: string) => void;
  handleCallVendor: (vendor: Vendor) => void;
  handleEmailVendor: (vendor: Vendor) => void;

  // Guest handlers
  handleToggleGuest: (guestId: string) => void;
  handleAddGuest: (guest: Omit<Guest, "id" | "invited">) => void;
  handleDeleteGuest: (guestId: string) => void;
  handleUploadExcel: () => Promise<void>;

  // Save
  saveSubEvent: () => Promise<void>;
}

// Helper to get vendor placeholder image based on category
const getVendorPlaceholderImage = (category: string): string => {
  const images: Record<string, string> = {
    Music:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    Decoration:
      "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=200&h=200&fit=crop",
    Food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop",
    Photography:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
    Lighting:
      "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=200&h=200&fit=crop",
    Video:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=200&fit=crop",
    Catering:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&h=200&fit=crop",
    Florist:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&h=200&fit=crop",
    Makeup:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
    DJ: "https://images.unsplash.com/photo-1571266028243-3716002dbc84?w=200&h=200&fit=crop",
  };
  return (
    images[category] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop"
  );
};

export const useSubEvent = (subEventId: string): UseSubEventReturn => {
  const [template, setTemplate] = useState<SubEventTemplate | null>(null);
  const [date, setDate] = useState("");
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState("");
  const [activities, setActivities] = useState<SelectedActivity[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load template and initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Load template data
      const foundTemplate = SUB_EVENT_TEMPLATES.find(
        (t) => t.id === subEventId
      );
      if (foundTemplate) {
        setTemplate(foundTemplate);

        // Try to load existing sub-event from API
        const existingSubEvent = await subEventApi.getById(subEventId);
        if (existingSubEvent) {
          // Load saved data
          setDate(existingSubEvent.date || "");
          setTheme(existingSubEvent.theme || "");
          setBudget(existingSubEvent.budget || "");
          setActivities(existingSubEvent.activities || []);
        }
      }

      // Initialize mock vendors with images
      setVendors([
        {
          id: "v1",
          name: "DJ Beats Pro",
          category: "Music",
          rating: 4.8,
          price: "$$",
          phone: "+91 98765 12345",
          email: "djbeats@email.com",
          verified: true,
          reviews: 124,
          yearsExperience: 8,
          description:
            "Professional DJ services for weddings and parties with state-of-the-art equipment.",
          imageUrl: getVendorPlaceholderImage("Music"),
        },
        {
          id: "v2",
          name: "Flower Decor Studio",
          category: "Decoration",
          rating: 4.9,
          price: "$",
          phone: "+91 98765 12346",
          email: "flowers@email.com",
          verified: true,
          reviews: 89,
          yearsExperience: 12,
          description:
            "Exquisite floral arrangements and venue decoration for all occasions.",
          imageUrl: getVendorPlaceholderImage("Decoration"),
        },
        {
          id: "v3",
          name: "Catering Kings",
          category: "Food",
          rating: 4.7,
          price: "$$",
          phone: "+91 98765 12347",
          email: "catering@email.com",
          verified: true,
          reviews: 156,
          yearsExperience: 15,
          description:
            "Multi-cuisine catering with live cooking stations and bar service.",
          imageUrl: getVendorPlaceholderImage("Food"),
        },
        {
          id: "v4",
          name: "Photo Moments",
          category: "Photography",
          rating: 4.9,
          price: "$",
          phone: "+91 98765 12348",
          email: "photo@email.com",
          verified: true,
          reviews: 203,
          yearsExperience: 10,
          description:
            "Capturing your precious moments with cinematic photography and albums.",
          imageUrl: getVendorPlaceholderImage("Photography"),
        },
        {
          id: "v5",
          name: "Lighting Masters",
          category: "Lighting",
          rating: 4.6,
          price: "$$",
          phone: "+91 98765 12349",
          email: "lighting@email.com",
          verified: false,
          reviews: 45,
          yearsExperience: 5,
          description:
            "Transform your venue with stunning LED lighting, dance floors, and special effects.",
          imageUrl: getVendorPlaceholderImage("Lighting"),
        },
      ]);

      // Initialize mock guests
      setGuests([
        {
          id: "1",
          name: "Priya Sharma",
          phone: "+91 98765 43210",
          email: "priya@email.com",
          relation: "Friend",
          invited: false,
        },
        {
          id: "2",
          name: "Rahul Kapoor",
          phone: "+91 98765 43211",
          email: "rahul@email.com",
          relation: "Family",
          invited: false,
        },
        {
          id: "3",
          name: "Sarah Jenkins",
          phone: "+1 555-123-4567",
          email: "sarah@email.com",
          relation: "Friend",
          invited: false,
        },
        {
          id: "4",
          name: "Mike Ross",
          phone: "+1 555-234-5678",
          email: "mike@email.com",
          relation: "Colleague",
          invited: false,
        },
        {
          id: "5",
          name: "Amara Singh",
          phone: "+91 98765 43212",
          email: "amara@email.com",
          relation: "Family",
          invited: false,
        },
      ]);

      setIsLoading(false);
    };

    loadData();
  }, [subEventId]);

  // Computed values
  const selectedVendorsCount = useMemo(
    () => vendors.filter((v) => v.selected).length,
    [vendors]
  );

  const invitedGuestsCount = useMemo(
    () => guests.filter((g) => g.invited).length,
    [guests]
  );

  const selectedActivityIds = useMemo(
    () => activities.map((a) => a.activity.id),
    [activities]
  );

  // Activity handlers
  const handleActivityToggle = useCallback((activity: TemplateActivity) => {
    setActivities((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.activity.id === activity.id
      );
      if (existingIndex >= 0) {
        return prev.filter((a) => a.activity.id !== activity.id);
      }
      return [...prev, { activity, time: "", budget: "" }];
    });
  }, []);

  const handleActivityTimeChange = useCallback(
    (activityId: string, time: string) => {
      setActivities((prev) =>
        prev.map((a) => (a.activity.id === activityId ? { ...a, time } : a))
      );
    },
    []
  );

  const handleActivityBudgetChange = useCallback(
    (activityId: string, budget: string) => {
      setActivities((prev) =>
        prev.map((a) => (a.activity.id === activityId ? { ...a, budget } : a))
      );
    },
    []
  );

  const isActivitySelected = useCallback(
    (activityId: string): boolean => {
      return activities.some((a) => a.activity.id === activityId);
    },
    [activities]
  );

  const getSelectedActivity = useCallback(
    (activityId: string): SelectedActivity | undefined => {
      return activities.find((a) => a.activity.id === activityId);
    },
    [activities]
  );

  // Vendor handlers
  const handleToggleVendor = useCallback((vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, selected: !v.selected } : v))
    );
  }, []);

  const handleCallVendor = useCallback((vendor: Vendor) => {
    Alert.alert("Call", `Calling ${vendor.name} at ${vendor.phone}`);
  }, []);

  const handleEmailVendor = useCallback((vendor: Vendor) => {
    Alert.alert("Email", `Emailing ${vendor.name} at ${vendor.email}`);
  }, []);

  // Guest handlers
  const handleToggleGuest = useCallback((guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, invited: !g.invited } : g))
    );
  }, []);

  const handleAddGuest = useCallback(
    (guestData: Omit<Guest, "id" | "invited">) => {
      const newGuest: Guest = {
        id: Date.now().toString(),
        ...guestData,
        invited: true,
      };
      setGuests((prev) => [...prev, newGuest]);
    },
    []
  );

  const handleDeleteGuest = useCallback((guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  }, []);

  const handleUploadExcel = useCallback(async () => {
    // Simulate Excel upload
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Add mock guests from Excel
        const excelGuests: Guest[] = [
          {
            id: "excel1",
            name: "Amit Patel",
            phone: "+91 98765 44444",
            email: "amit@email.com",
            relation: "Family",
            invited: true,
          },
          {
            id: "excel2",
            name: "Neha Gupta",
            phone: "+91 98765 55555",
            email: "neha@email.com",
            relation: "Friend",
            invited: true,
          },
          {
            id: "excel3",
            name: "Vikram Singh",
            phone: "+91 98765 66666",
            email: "vikram@email.com",
            relation: "Colleague",
            invited: true,
          },
        ];

        setGuests((prev) => [...prev, ...excelGuests]);
        Alert.alert("Success", "Guests imported successfully!");
        resolve();
      }, 2000);
    });
  }, []);

  // Save sub-event to API
  const saveSubEvent = useCallback(async () => {
    if (!template) return;

    const subEventData = {
      template,
      date,
      theme,
      budget,
      activities,
    };

    // Update in API
    await subEventApi.update(subEventId, subEventData);

    console.log("Sub-event saved:", subEventData);
  }, [template, date, theme, budget, activities, subEventId]);

  return {
    // State
    template,
    date,
    theme,
    budget,
    activities,
    guests,
    vendors,
    isLoading,

    // Computed
    selectedVendorsCount,
    invitedGuestsCount,
    selectedActivityIds,

    // Event Details
    setDate,
    setTheme,
    setBudget,

    // Activity handlers
    handleActivityToggle,
    handleActivityTimeChange,
    handleActivityBudgetChange,
    isActivitySelected,
    getSelectedActivity,

    // Vendor handlers
    handleToggleVendor,
    handleCallVendor,
    handleEmailVendor,

    // Guest handlers
    handleToggleGuest,
    handleAddGuest,
    handleDeleteGuest,
    handleUploadExcel,

    // Save
    saveSubEvent,
  };
};
