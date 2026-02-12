import {
    SUB_EVENT_TEMPLATES,
    SubEventTemplate,
} from "@/src/data/subeventTemplates";
import { useCallback, useEffect, useState } from "react";
import type { Guest, SelectedActivity, Vendor } from "../types/subevent";
import { getVendorPlaceholderImage as getImage } from "../types/subevent";

interface UseSubEventDetailProps {
  subEventId: string;
  eventId: string;
  isNew: boolean;
}

export const useSubEventDetail = ({ subEventId }: UseSubEventDetailProps) => {
  const [template, setTemplate] = useState<SubEventTemplate | null>(null);
  const [date, setDate] = useState("");
  const [theme, setTheme] = useState("");
  const [budget, setBudget] = useState("");
  const [activities, setActivities] = useState<SelectedActivity[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showVendorContactModal, setShowVendorContactModal] = useState(false);
  const [showVendorDetailModal, setShowVendorDetailModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newGuestRelation, setNewGuestRelation] = useState("");
  const [excelFileName, setExcelFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const foundTemplate = SUB_EVENT_TEMPLATES.find((t) => t.id === subEventId);
    if (foundTemplate) {
      setTemplate(foundTemplate);
    }

    setVendors([
      {
        id: "v1",
        name: "DJ Beats Pro",
        category: "Music",
        rating: 4.8,
        price: "$$$",
        phone: "+91 98765 12345",
        email: "djbeats@email.com",
        verified: true,
        reviews: 124,
        yearsExperience: 8,
        description:
          "Professional DJ services for weddings and parties with state-of-the-art equipment.",
        imageUrl: getImage("Music"),
      },
      {
        id: "v2",
        name: "Flower Decor Studio",
        category: "Decoration",
        rating: 4.9,
        price: "$$",
        phone: "+91 98765 12346",
        email: "flowers@email.com",
        verified: true,
        reviews: 89,
        yearsExperience: 12,
        description:
          "Exquisite floral arrangements and venue decoration for all occasions.",
        imageUrl: getImage("Decoration"),
      },
      {
        id: "v3",
        name: "Catering Kings",
        category: "Food",
        rating: 4.7,
        price: "$$$",
        phone: "+91 98765 12347",
        email: "catering@email.com",
        verified: true,
        reviews: 156,
        yearsExperience: 15,
        description:
          "Multi-cuisine catering with live cooking stations and bar service.",
        imageUrl: getImage("Food"),
      },
      {
        id: "v4",
        name: "Photo Moments",
        category: "Photography",
        rating: 4.9,
        price: "$$",
        phone: "+91 98765 12348",
        email: "photo@email.com",
        verified: true,
        reviews: 203,
        yearsExperience: 10,
        description:
          "Capturing timeless memories with professional photography and albums.",
        imageUrl: getImage("Photography"),
      },
      {
        id: "v5",
        name: "Light Up Events",
        category: "Lighting",
        rating: 4.6,
        price: "$$",
        phone: "+91 98765 12349",
        email: "lights@email.com",
        verified: true,
        reviews: 67,
        yearsExperience: 6,
        description:
          "Spectacular lighting designs for weddings and corporate events.",
        imageUrl: getImage("Lighting"),
      },
    ]);

    setActivities([
      {
        activity: {
          id: "a1",
          title: "Haldi Ceremony",
          description: "Traditional haldi ceremony",
          category: "ceremony",
        },
        time: "10:00 AM",
        budget: "₹15,000",
      },
      {
        activity: {
          id: "a2",
          title: "Mehndi Function",
          description: "Mehndi application ceremony",
          category: "preparation",
        },
        time: "2:00 PM",
        budget: "₹25,000",
      },
      {
        activity: {
          id: "a3",
          title: "Sangeet Night",
          description: "Musical evening with performances",
          category: "entertainment",
        },
        time: "7:00 PM",
        budget: "₹50,000",
      },
    ]);

    setGuests([
      {
        id: "g1",
        name: "Amit Sharma",
        phone: "+91 98765 11111",
        email: "amit@email.com",
        relation: "Family",
        invited: true,
      },
      {
        id: "g2",
        name: "Priya Singh",
        phone: "+91 98765 22222",
        email: "priya@email.com",
        relation: "Friend",
        invited: true,
      },
      {
        id: "g3",
        name: "Raj Kumar",
        phone: "+91 98765 33333",
        email: "raj@email.com",
        relation: "Colleague",
        invited: false,
      },
    ]);
  }, [subEventId]);

  const handleToggleVendor = useCallback((vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, selected: !v.selected } : v,
      ),
    );
  }, []);

  const handleShowVendorDetail = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetailModal(true);
  }, []);

  const handleContactVendor = useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorContactModal(true);
    setShowVendorDetailModal(false);
  }, []);

  const handleAssignVendor = useCallback(
    (vendorId: string) => {
      handleToggleVendor(vendorId);
      setShowVendorDetailModal(false);
    },
    [handleToggleVendor],
  );

  const handleDeleteVendor = useCallback((vendorId: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== vendorId));
  }, []);

  const handleToggleGuest = useCallback((guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, invited: !g.invited } : g)),
    );
  }, []);

  const handleDeleteGuest = useCallback((guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
  }, []);

  const handleAddGuest = useCallback(() => {
    if (!newGuestName.trim()) return;
    const newGuest: Guest = {
      id: `g${Date.now()}`,
      name: newGuestName,
      phone: newGuestPhone,
      email: newGuestEmail,
      relation: newGuestRelation,
      invited: true,
    };
    setGuests((prev) => [...prev, newGuest]);
    setNewGuestName("");
    setNewGuestPhone("");
    setNewGuestEmail("");
    setNewGuestRelation("");
    setShowAddGuestModal(false);
  }, [newGuestName, newGuestPhone, newGuestEmail, newGuestRelation]);

  const handleUploadExcel = useCallback(() => {
    if (!excelFileName) {
      setExcelFileName("guest_list.xlsx");
      setIsUploading(true);
      return;
    }
    const excelGuests: Guest[] = [
      {
        id: "excel1",
        name: "Amit Gupta",
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
    return true;
  }, [excelFileName]);

  const invitedGuestsCount = guests.filter((g) => g.invited).length;
  const selectedVendorsCount = vendors.filter((v) => v.selected).length;

  return {
    template,
    date,
    setDate,
    theme,
    setTheme,
    budget,
    setBudget,
    activities,
    setActivities,
    guests,
    setGuests,
    vendors,
    setVendors,
    showGuestModal,
    setShowGuestModal,
    showAddGuestModal,
    setShowAddGuestModal,
    showExcelModal,
    setShowExcelModal,
    showVendorContactModal,
    setShowVendorContactModal,
    showVendorDetailModal,
    setShowVendorDetailModal,
    selectedVendor,
    setSelectedVendor,
    newGuestName,
    setNewGuestName,
    newGuestPhone,
    setNewGuestPhone,
    newGuestEmail,
    setNewGuestEmail,
    newGuestRelation,
    setNewGuestRelation,
    excelFileName,
    setExcelFileName,
    isUploading,
    setIsUploading,
    invitedGuestsCount,
    selectedVendorsCount,
    handleToggleVendor,
    handleShowVendorDetail,
    handleContactVendor,
    handleAssignVendor,
    handleDeleteVendor,
    handleToggleGuest,
    handleDeleteGuest,
    handleAddGuest,
    handleUploadExcel,
  };
};
