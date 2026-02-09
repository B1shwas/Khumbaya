/**
 * Sub Event Templates Data
 * Predefined activity templates for wedding planning sub-events
 * Each template contains typical activities that can be selected and customized with times
 */

// ============================================
// Template Types
// ============================================

export interface TemplateActivity {
  id: string;
  title: string;
  description: string;
  defaultDuration?: string;
  category:
    | "ceremony"
    | "entertainment"
    | "food"
    | "preparation"
    | "decoration"
    | "photo"
    | "other";
}

export interface SubEventTemplate {
  id: string;
  name: string;
  icon:
    | "musical-notes"
    | "color-filter"
    | "water"
    | "restaurant"
    | "car-sport"
    | "flower"
    | "gift"
    | "camera"
    | "people";
  description: string;
  activities: TemplateActivity[];
}

// ============================================
// Sangeet Template Activities
// ============================================
const SANGEET_ACTIVITIES: TemplateActivity[] = [
  {
    id: "sangeet-1",
    title: "Guest Arrival & Welcome Drinks",
    description: "Welcome guests with beverages and light snacks",
    category: "entertainment",
  },
  {
    id: "sangeet-2",
    title: "Mehendi Application",
    description: "Apply mehendi to bride and interested guests",
    category: "preparation",
  },
  {
    id: "sangeet-3",
    title: "DJ/Music Setup",
    description: "Sound system and music arrangement",
    category: "entertainment",
  },
  {
    id: "sangeet-4",
    title: "Sangeet Performance Practice",
    description: "Family members practice their performances",
    category: "entertainment",
  },
  {
    id: "sangeet-5",
    title: "Dinner Service",
    description: "Buffet or seated dinner for guests",
    category: "food",
  },
  {
    id: "sangeet-6",
    title: "Sangeet Performances Begin",
    description: "Dance and song performances by family",
    category: "entertainment",
  },
  {
    id: "sangeet-7",
    title: "Cake Cutting",
    description: "Sangeet cake cutting ceremony",
    category: "ceremony",
  },
  {
    id: "sangeet-8",
    title: "Open Dance Floor",
    description: "Guests join the celebration on dance floor",
    category: "entertainment",
  },
  {
    id: "sangeet-9",
    title: "Photography Session",
    description: "Group photos with family and friends",
    category: "photo",
  },
  {
    id: "sangeet-10",
    title: "Venue Decoration",
    description: "Stage, lights, and venue decoration setup",
    category: "decoration",
  },
];

// ============================================
// Mehendi Template Activities
// ============================================
const MEHENDI_ACTIVITIES: TemplateActivity[] = [
  {
    id: "mehendi-1",
    title: "Mehendi Artist Arrival",
    description: "Professional mehendi artist sets up",
    category: "preparation",
  },
  {
    id: "mehendi-2",
    title: "Bride Mehendi Application",
    description: "Full bridal mehendi application",
    category: "ceremony",
  },
  {
    id: "mehendi-3",
    title: "Guest Mehendi Area",
    description: "Separate area for guest mehendi",
    category: "entertainment",
  },
  {
    id: "mehendi-4",
    title: "Refreshments Setup",
    description: "Drinks and snacks for waiting guests",
    category: "food",
  },
  {
    id: "mehendi-5",
    title: "Mehendi Games",
    description: "Fun games for guests while waiting",
    category: "entertainment",
  },
  {
    id: "mehendi-6",
    title: "Bridal Portrait Session",
    description: "Photos of bride with mehendi",
    category: "photo",
  },
  {
    id: "mehendi-7",
    title: "Family Photos",
    description: "Family group photos with bride",
    category: "photo",
  },
  {
    id: "mehendi-8",
    title: "Mehendi Drying Time",
    description: "Allow time for mehendi to dry",
    category: "other",
  },
  {
    id: "mehendi-9",
    title: "Light Dinner",
    description: "Simple dinner service",
    category: "food",
  },
  {
    id: "mehendi-10",
    title: "Cleanup",
    description: "Mehendi cleanup and venue reset",
    category: "other",
  },
];

// ============================================
// Haldi Template Activities
// ============================================
const HALDI_ACTIVITIES: TemplateActivity[] = [
  {
    id: "haldi-1",
    title: "Venue Setup",
    description: "Haldi area with protection covers",
    category: "decoration",
  },
  {
    id: "haldi-2",
    title: "Turmeric Paste Preparation",
    description: "Fresh turmeric paste made on site",
    category: "preparation",
  },
  {
    id: "haldi-3",
    title: "Guest Arrival",
    description: "Family and friends arrive",
    category: "entertainment",
  },
  {
    id: "haldi-4",
    title: "Groom Haldi",
    description: "Haldi ceremony for groom",
    category: "ceremony",
  },
  {
    id: "haldi-5",
    title: "Bridal Haldi",
    description: "Haldi ceremony for bride",
    category: "ceremony",
  },
  {
    id: "haldi-6",
    title: "Haldi Games",
    description: "Fun haldi games and celebrations",
    category: "entertainment",
  },
  {
    id: "haldi-7",
    title: "Photo Session",
    description: "Fun photos during haldi",
    category: "photo",
  },
  {
    id: "haldi-8",
    title: "Wash & Cleanup",
    description: "Wash off turmeric, freshen up",
    category: "preparation",
  },
  {
    id: "haldi-9",
    title: "Snacks & Refreshments",
    description: "Light snacks and drinks",
    category: "food",
  },
  {
    id: "haldi-10",
    title: "Change of Clothes",
    description: "Guests change into clean clothes",
    category: "other",
  },
];

// ============================================
// Reception Template Activities
// ============================================
const RECEPTION_ACTIVITIES: TemplateActivity[] = [
  {
    id: "reception-1",
    title: "Guest Arrival & Welcome",
    description: "Guests arrive and are welcomed",
    category: "entertainment",
  },
  {
    id: "reception-2",
    title: "Welcome Drink Station",
    description: "Drinks and refreshments on arrival",
    category: "food",
  },
  {
    id: "reception-3",
    title: "Photography Area Setup",
    description: "Photo booth and backdrop ready",
    category: "photo",
  },
  {
    id: "reception-4",
    title: "Seating Arrangement",
    description: "Guests guided to their seats",
    category: "other",
  },
  {
    id: "reception-5",
    title: "Stage Decoration",
    description: "Main stage and backdrop ready",
    category: "decoration",
  },
  {
    id: "reception-6",
    title: "Bride & Groom Entry",
    description: "Grand entrance of couple",
    category: "ceremony",
  },
  {
    id: "reception-7",
    title: "Welcome Speech",
    description: "Family welcomes guests",
    category: "ceremony",
  },
  {
    id: "reception-8",
    title: "Dinner Service",
    description: "Multi-course dinner begins",
    category: "food",
  },
  {
    id: "reception-9",
    title: "Cake Cutting",
    description: "Reception cake cutting",
    category: "ceremony",
  },
  {
    id: "reception-10",
    title: "First Dance",
    description: "Couple first dance",
    category: "entertainment",
  },
  {
    id: "reception-11",
    title: "Family Dances",
    description: "Parent dances and family performances",
    category: "entertainment",
  },
  {
    id: "reception-12",
    title: "Garment Ceremony",
    description: "Gift exchange with families",
    category: "ceremony",
  },
  {
    id: "reception-13",
    title: "Open Dance Floor",
    description: "All guests welcome to dance",
    category: "entertainment",
  },
  {
    id: "reception-14",
    title: "Grand Finale",
    description: "Final celebration and send-off",
    category: "ceremony",
  },
  {
    id: "reception-15",
    title: "Photography Session",
    description: "Group photos with all guests",
    category: "photo",
  },
];

// ============================================
// Baraat Template Activities
// ============================================
const BARAAT_ACTIVITIES: TemplateActivity[] = [
  {
    id: "baraat-1",
    title: "Groom Preparation",
    description: "Groom gets ready with family",
    category: "preparation",
  },
  {
    id: "baraat-2",
    title: "Baraat Procession Begins",
    description: "Band and dance procession starts",
    category: "ceremony",
  },
  {
    id: "baraat-3",
    title: "DJ/Band Performance",
    description: "Music and dance en route",
    category: "entertainment",
  },
  {
    id: "baraat-4",
    title: "Doli/Welcome Ceremony",
    description: "Welcome of groom at venue",
    category: "ceremony",
  },
  {
    id: "baraat-5",
    title: "Milni Ceremony",
    description: "Formal introduction of families",
    category: "ceremony",
  },
  {
    id: "baraat-6",
    title: "Welcome Lunch",
    description: "Lunch served to all guests",
    category: "food",
  },
  {
    id: "baraat-7",
    title: "Rest Period",
    description: "Break before evening functions",
    category: "other",
  },
  {
    id: "baraat-8",
    title: "Photography Session",
    description: "Photos with baraat party",
    category: "photo",
  },
  {
    id: "baraat-9",
    title: "Dance Performances",
    description: "Family dance celebrations",
    category: "entertainment",
  },
  {
    id: "baraat-10",
    title: "Vermilion Ceremony",
    description: "Applying sindoor to bride",
    category: "ceremony",
  },
  {
    id: "baraat-11",
    title: "Mangal Pheras Begin",
    description: "Start of wedding ceremony",
    category: "ceremony",
  },
  {
    id: "baraat-12",
    title: "Sindoor & Mangalsutra",
    description: "Final wedding rituals",
    category: "ceremony",
  },
  {
    id: "baraat-13",
    title: "Ashirwad Blessings",
    description: "Receiving blessings from elders",
    category: "ceremony",
  },
  {
    id: "baraat-14",
    title: "Couple Reception",
    description: "Couple greets guests formally",
    category: "ceremony",
  },
];

// ============================================
// Bridal Party Template Activities
// ============================================
const BRIDAL_PARTY_ACTIVITIES: TemplateActivity[] = [
  {
    id: "bridal-1",
    title: "Bridal Makeup Artist Arrival",
    description: "Makeup team sets up",
    category: "preparation",
  },
  {
    id: "bridal-2",
    title: "Bridal Hair Styling",
    description: "Hair and styling begins",
    category: "preparation",
  },
  {
    id: "bridal-3",
    title: "Bridal Makeup",
    description: "Full bridal makeup application",
    category: "preparation",
  },
  {
    id: "bridal-4",
    title: "Bridesmaids Getting Ready",
    description: "Bridesmaids prepare together",
    category: "preparation",
  },
  {
    id: "bridal-5",
    title: "Groom Preparation",
    description: "Groom gets ready simultaneously",
    category: "preparation",
  },
  {
    id: "bridal-6",
    title: "Groomsmen Getting Ready",
    description: "Groomsmen prepare",
    category: "preparation",
  },
  {
    id: "bridal-7",
    title: "First Look Photography",
    description: "Private moment before ceremony",
    category: "photo",
  },
  {
    id: "bridal-8",
    title: "Bridal Portrait Session",
    description: "Solo bride photos",
    category: "photo",
  },
  {
    id: "bridal-9",
    title: "Groom Portrait Session",
    description: "Solo groom photos",
    category: "photo",
  },
  {
    id: "bridal-10",
    title: "Bridal Party Photos",
    description: "Group photos with bridesmaids",
    category: "photo",
  },
  {
    id: "bridal-11",
    title: "Groomsmen Photos",
    description: "Group photos with groomsmen",
    category: "photo",
  },
  {
    id: "bridal-12",
    title: "Light Lunch/Snacks",
    description: "Pre-ceremony refreshments",
    category: "food",
  },
  {
    id: "bridal-13",
    title: "Final Touches",
    description: "Last minute adjustments",
    category: "preparation",
  },
  {
    id: "bridal-14",
    title: "Depart for Ceremony",
    description: "Bridal party leaves for venue",
    category: "other",
  },
];

// ============================================
// Wedding Ceremony Template Activities
// ============================================
const WEDDING_CEREMONY_ACTIVITIES: TemplateActivity[] = [
  {
    id: "wedding-1",
    title: "Guest Seating",
    description: "Guests are seated",
    category: "other",
  },
  {
    id: "wedding-2",
    title: "Flower Girl Entry",
    description: "Flower girl walks down aisle",
    category: "ceremony",
  },
  {
    id: "wedding-3",
    title: "Ring Bearer Entry",
    description: "Ring bearer walks down aisle",
    category: "ceremony",
  },
  {
    id: "wedding-4",
    title: "Groom Entry",
    description: "Groom arrives at mandap",
    category: "ceremony",
  },
  {
    id: "wedding-5",
    title: "Baraat/Groom Welcome",
    description: "Welcome ceremony at mandap",
    category: "ceremony",
  },
  {
    id: "wedding-6",
    title: "Bride Entry",
    description: "Bride walks down aisle with family",
    category: "ceremony",
  },
  {
    id: "wedding-7",
    title: "Milni Ceremony",
    description: "Formal introduction at mandap",
    category: "ceremony",
  },
  {
    id: "wedding-8",
    title: "Ganesh Puja",
    description: "Prayer for auspicious start",
    category: "ceremony",
  },
  {
    id: "wedding-9",
    title: "Kanyadaan",
    description: "Giving away of bride",
    category: "ceremony",
  },
  {
    id: "wedding-10",
    title: "Mangal Pheras",
    description: "Seven rounds around fire",
    category: "ceremony",
  },
  {
    id: "wedding-11",
    title: "Sindoor & Mangalsutra",
    description: "Applying vermilion and necklace",
    category: "ceremony",
  },
  {
    id: "wedding-12",
    title: "Saptapadi",
    description: "Seven promises",
    category: "ceremony",
  },
  {
    id: "wedding-13",
    title: "Ashirwad Blessings",
    description: "Elders bless the couple",
    category: "ceremony",
  },
  {
    id: "wedding-14",
    title: "Sindoor Daan",
    description: "Groom applies sindoor to bride",
    category: "ceremony",
  },
  {
    id: "wedding-15",
    title: "Wedding Rings Exchange",
    description: "Couple exchanges rings",
    category: "ceremony",
  },
  {
    id: "wedding-16",
    title: "Suhag/Sindoor Celebration",
    description: "Celebration of new marriage",
    category: "ceremony",
  },
  {
    id: "wedding-17",
    title: "Couple Photos",
    description: "Photos after ceremony",
    category: "photo",
  },
  {
    id: "wedding-18",
    title: "Guest Exit",
    description: "Guests exit ceremony area",
    category: "other",
  },
];

// ============================================
// Engagement Template Activities
// ============================================
const ENGAGEMENT_ACTIVITIES: TemplateActivity[] = [
  {
    id: "engagement-1",
    title: "Guest Arrival",
    description: "Guests arrive at venue",
    category: "entertainment",
  },
  {
    id: "engagement-2",
    title: "Welcome Drinks",
    description: "Refreshments on arrival",
    category: "food",
  },
  {
    id: "engagement-3",
    title: "Photography Setup",
    description: "Photo booth ready",
    category: "photo",
  },
  {
    id: "engagement-4",
    title: "Ring Ceremony Setup",
    description: "Stage and mandap ready",
    category: "decoration",
  },
  {
    id: "engagement-5",
    title: "Ring Bearer",
    description: "Ring bearer ready",
    category: "ceremony",
  },
  {
    id: "engagement-6",
    title: "Engagement Ring Exchange",
    description: "Couple exchanges rings",
    category: "ceremony",
  },
  {
    id: "engagement-7",
    title: "Blessings",
    description: "Elders bless the couple",
    category: "ceremony",
  },
  {
    id: "engagement-8",
    title: "Photography Session",
    description: "Engagement photos",
    category: "photo",
  },
  {
    id: "engagement-9",
    title: "Dinner Service",
    description: "Formal dinner begins",
    category: "food",
  },
  {
    id: "engagement-10",
    title: "Speeches",
    description: "Family speeches begin",
    category: "entertainment",
  },
  {
    id: "engagement-11",
    title: "Dance Performances",
    description: "Celebration dances",
    category: "entertainment",
  },
  {
    id: "engagement-12",
    title: "Cake Cutting",
    description: "Engagement cake cutting",
    category: "ceremony",
  },
  {
    id: "engagement-13",
    title: "Open Dance Floor",
    description: "Guests dance and celebrate",
    category: "entertainment",
  },
  {
    id: "engagement-14",
    title: "Farewell",
    description: "Guests depart",
    category: "other",
  },
];

// ============================================
// Card & Invitation Making Template
// ============================================
const CARD_INVITATION_ACTIVITIES: TemplateActivity[] = [
  {
    id: "card-1",
    title: "Design Concept",
    description: "Finalize invitation design theme",
    category: "other",
  },
  {
    id: "card-2",
    title: "Guest List Creation",
    description: "Compile and verify guest list",
    category: "other",
  },
  {
    id: "card-3",
    title: "Content Writing",
    description: "Write invitation text",
    category: "other",
  },
  {
    id: "card-4",
    title: "Photo Selection",
    description: "Choose photos for invitations",
    category: "photo",
  },
  {
    id: "card-5",
    title: "Print Proof Review",
    description: "Review printed proofs",
    category: "other",
  },
  {
    id: "card-6",
    title: "Printing",
    description: "Final printing of invitations",
    category: "other",
  },
  {
    id: "card-7",
    title: "Assembly",
    description: "Assemble and stuff envelopes",
    category: "other",
  },
  {
    id: "card-8",
    title: "Mailing",
    description: "Send out invitations",
    category: "other",
  },
  {
    id: "card-9",
    title: "Thank You Cards",
    description: "Design thank you cards",
    category: "other",
  },
  {
    id: "card-10",
    title: "Social Media Invites",
    description: "Create digital invitations",
    category: "other",
  },
];

// ============================================
// Export All Templates
// ============================================

export const SUB_EVENT_TEMPLATES: SubEventTemplate[] = [
  {
    id: "sangeet",
    name: "Sangeet",
    icon: "musical-notes",
    description: "Music and dance celebration",
    activities: SANGEET_ACTIVITIES,
  },
  {
    id: "mehendi",
    name: "Mehendi",
    icon: "color-filter",
    description: "Henna ceremony",
    activities: MEHENDI_ACTIVITIES,
  },
  {
    id: "haldi",
    name: "Haldi",
    icon: "water",
    description: "Turmeric ceremony",
    activities: HALDI_ACTIVITIES,
  },
  {
    id: "reception",
    name: "Reception",
    icon: "restaurant",
    description: "Wedding reception",
    activities: RECEPTION_ACTIVITIES,
  },
  {
    id: "baraat",
    name: "Baraat",
    icon: "car-sport",
    description: "Groom wedding procession",
    activities: BARAAT_ACTIVITIES,
  },
  {
    id: "bridal-party",
    name: "Bridal Party",
    icon: "people",
    description: "Bridal party preparation",
    activities: BRIDAL_PARTY_ACTIVITIES,
  },
  {
    id: "wedding-ceremony",
    name: "Wedding Ceremony",
    icon: "flower",
    description: "Main wedding ceremony",
    activities: WEDDING_CEREMONY_ACTIVITIES,
  },
  {
    id: "engagement",
    name: "Engagement",
    icon: "gift",
    description: "Ring ceremony",
    activities: ENGAGEMENT_ACTIVITIES,
  },
  {
    id: "card-invitation",
    name: "Cards & Invitations",
    icon: "camera",
    description: "Invitation and card making",
    activities: CARD_INVITATION_ACTIVITIES,
  },
];

// ============================================
// Helper Functions
// ============================================

export const getTemplateById = (id: string): SubEventTemplate | undefined => {
  return SUB_EVENT_TEMPLATES.find((template) => template.id === id);
};

export const getTemplateActivities = (
  templateId: string,
): TemplateActivity[] => {
  const template = getTemplateById(templateId);
  return template?.activities || [];
};

export const getTemplatesByCategory = (
  category: string,
): SubEventTemplate[] => {
  // Return templates that contain activities in the specified category
  return SUB_EVENT_TEMPLATES.filter((template) =>
    template.activities.some((activity) => activity.category === category),
  );
};

// Icon name type for Ionicons
export type IconName =
  | "musical-notes"
  | "color-filter"
  | "water"
  | "restaurant"
  | "car-sport"
  | "flower"
  | "gift"
  | "camera"
  | "people";
