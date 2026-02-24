import { Button } from "@/src/components/ui/Button";
import Card from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constants ─────────────────────────────────────────────────────────────────
const VENDOR_TYPES = [
  {
    id: "photographer",
    name: "Photographer",
    icon: "📷",
    color: "#C9A84C",
    tagline: "Capturing moments that last forever",
  },
  {
    id: "chef",
    name: "Private Chef",
    icon: "👨‍🍳",
    color: "#8B4513",
    tagline: "Culinary artistry for every occasion",
  },
  {
    id: "bartender",
    name: "Bartender",
    icon: "🍸",
    color: "#2C5F7A",
    tagline: "Crafting unforgettable experiences",
  },
  {
    id: "musician",
    name: "Musician / Band",
    icon: "🎵",
    color: "#6B3FA0",
    tagline: "Setting the perfect atmosphere",
  },
  {
    id: "makeup",
    name: "Makeup Artist",
    icon: "💄",
    color: "#C45C7A",
    tagline: "Transforming beauty, one face at a time",
  },
  {
    id: "dancer",
    name: "Dancer / Performer",
    icon: "💃",
    color: "#D4822A",
    tagline: "Movement that moves hearts",
  },
  {
    id: "decorator",
    name: "Decorator / Florist",
    icon: "🌸",
    color: "#5A8A4A",
    tagline: "Designing spaces with intention",
  },
  {
    id: "mc",
    name: "MC / Host",
    icon: "🎤",
    color: "#1A5276",
    tagline: "Keeping the energy alive all night",
  },
  {
    id: "photobooth",
    name: "Photo Booth",
    icon: "🎞️",
    color: "#7D5A8A",
    tagline: "Fun memories, instantly yours",
  },
];

const SPECIALTIES_BY_TYPE: Record<string, string[]> = {
  photographer: [
    "Wedding Photography",
    "Portrait Sessions",
    "Drone Aerial Shots",
    "Photo Editing",
    "Album Design",
    "Black & White",
    "Film Photography",
    "Candid Moments",
  ],
  chef: [
    "Vegan Cuisine",
    "Gluten-Free",
    "International Dishes",
    "Pastry & Desserts",
    "Live Cooking Stations",
    "Multi-Course Dinners",
    "Catering for 100+",
    "Dietary Accommodations",
  ],
  bartender: [
    "Signature Cocktails",
    "Flair Bartending",
    "Mocktail Menu",
    "Wine Pairing",
    "Bar Setup & Teardown",
    "Custom Drink Menus",
    "Mixology Classes",
    "Corporate Events",
  ],
  musician: [
    "Jazz & Blues",
    "Classical",
    "Top 40 Covers",
    "Acoustic Sets",
    "DJ Services",
    "Live Band",
    "Bilingual Repertoire",
    "Custom Setlists",
  ],
  makeup: [
    "Bridal Glam",
    "Airbrush Technique",
    "HD Makeup",
    "Natural Look",
    "Special Effects",
    "Group Bookings",
    "Touch-Up Kits",
    "Skin Prep",
  ],
  dancer: [
    "Salsa & Latin",
    "Hip-Hop",
    "Ballet",
    "Cultural Dance",
    "Choreography Services",
    "Group Performances",
    "Wedding First Dance",
    "Flash Mobs",
  ],
  decorator: [
    "Floral Arrangements",
    "Balloon Installations",
    "Themed Decor",
    "Eco-Friendly Options",
    "Luxury Centerpieces",
    "Corporate Events",
    "Arch & Backdrop",
    "Table Styling",
  ],
  mc: [
    "Wedding Hosting",
    "Corporate Events",
    "Bilingual MC",
    "Game Hosting",
    "Audience Engagement",
    "Script Writing",
    "Humor & Energy",
    "Ceremony Coordination",
  ],
  photobooth: [
    "Custom Backdrops",
    "Instant Prints",
    "GIF Booths",
    "360° Video Booth",
    "Green Screen",
    "Digital Gallery",
    "Custom Props",
    "Unlimited Sessions",
  ],
};

const BADGE_OPTIONS = [
  "POPULAR",
  "BEST VALUE",
  "NEW",
  "PREMIUM",
  "LIMITED",
  "EXCLUSIVE",
];

const defaultServices = [
  {
    id: "1",
    title: "Starter Package",
    price: "$500",
    duration: "4 hrs",
    description:
      "Perfect introduction to our services. Includes consultation, full coverage, and digital delivery.",
    badge: "BEST VALUE",
    included: ["Digital Gallery", "Same-week Delivery", "1 Revision Round"],
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────
function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Atomic Components ──────────────────────────────────────────────────────

// Step Indicator Component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { num: 1, label: "Category" },
    { num: 2, label: "Details" },
    { num: 3, label: "Services" },
  ];

  return (
    <View className="flex-row items-center justify-center py-4 bg-white border-b border-gray-100">
      {steps.map((step, index) => (
        <View key={step.num} className="flex-row items-center">
          <View className="flex-row items-center">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center ${
                currentStep >= step.num ? "bg-pink-600" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  currentStep >= step.num ? "text-white" : "text-gray-500"
                }`}
              >
                {step.num}
              </Text>
            </View>
            <Text
              className={`ml-1 text-xs font-medium ${
                currentStep >= step.num ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              className={`w-8 h-0.5 mx-2 ${
                currentStep > step.num ? "bg-pink-600" : "bg-gray-200"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
};

// Chip Component
const Chip = ({
  label,
  selected,
  onPress,
  color = "#ee2b8c",
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-4 py-2 rounded-full border ${
      selected ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-white"
    }`}
    style={{
      borderColor: selected ? color : "#e5e7eb",
      backgroundColor: selected ? `${color}10` : "#ffffff",
    }}
  >
    <Text
      className={`text-sm font-medium ${
        selected ? "text-pink-600" : "text-gray-600"
      }`}
      style={{ color: selected ? color : "#6b7280" }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Input Field Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
}) => (
  <View className="mb-4">
    <Text variant="caption" className="mb-2 text-gray-600">
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
      } text-gray-900`}
      style={{
        borderColor: error ? "#fca5a5" : "#e5e7eb",
        backgroundColor: error ? "#fef2f2" : "#ffffff",
      }}
    />
    {error && (
      <Text variant="caption" className="mt-1 text-pink-500">
        {error}
      </Text>
    )}
  </View>
);

// Service Card Component
const ServiceCard = ({
  service,
  index,
  accentColor,
  onEdit,
  onDelete,
}: {
  service: any;
  index: number;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <View
    className="flex-row items-start p-4 mb-3 bg-white rounded-xl border border-gray-100"
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }}
  >
    <View
      className="w-9 h-9 rounded-lg items-center justify-center mr-3"
      style={{ backgroundColor: `${accentColor}20` }}
    >
      <Text className="text-lg">✦</Text>
    </View>
    <View className="flex-1">
      <View className="flex-row items-center mb-1">
        <Text className="text-base font-semibold text-gray-900 mr-2">
          {service.title}
        </Text>
        {service.badge && (
          <View
            className="px-2 py-0.5 rounded"
            style={{ backgroundColor: accentColor }}
          >
            <Text className="text-[9px] font-bold text-white tracking-wider">
              {service.badge}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row items-center gap-3 mb-1">
        <Text className="text-lg font-semibold" style={{ color: accentColor }}>
          {service.price}
        </Text>
        {service.duration && (
          <Text className="text-sm text-pink-500">• {service.duration}</Text>
        )}
      </View>
      <Text className="text-sm text-pink-500 leading-relaxed">
        {service.description}
      </Text>
      {service.included?.length > 0 && (
        <View className="flex-row flex-wrap mt-2 gap-2">
          {service.included.map((inc: string, i: number) => (
            <View key={i} className="px-2 py-1 rounded bg-gray-100">
              <Text className="text-xs text-pink-500">✓ {inc}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
    <View className="flex-row gap-2">
      <TouchableOpacity
        onPress={onEdit}
        className="px-3 py-2 rounded-lg bg-blue-50"
      >
        <Text className="text-xs font-semibold text-pink-600">Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        className="px-3 py-2 rounded-lg bg-red-50"
      >
        <MaterialIcons name="close" size={16} color="#dc2626" />
      </TouchableOpacity>
    </View>
  </View>
);

// Service Form Component
const ServiceForm = ({
  form,
  errors,
  accentColor,
  onUpdate,
  onSave,
  onCancel,
  isEditing,
}: {
  form: any;
  errors: any;
  accentColor: string;
  onUpdate: (key: string, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
}) => (
  <View
    className="p-5 mb-4 rounded-xl border"
    style={{
      backgroundColor: "#fafaf8",
      borderColor: `${accentColor}40`,
    }}
  >
    <Text variant="h2" className="mb-4 text-gray-900">
      {isEditing ? "✏ Edit Package" : "✦ New Package"}
    </Text>

    <View className="flex-row gap-3">
      <View className="flex-1">
        <InputField
          label="Package Name *"
          value={form.title}
          onChangeText={(v) => onUpdate("title", v)}
          placeholder="e.g. Full Wedding Day"
          error={errors.title}
        />
      </View>
      <View className="w-28">
        <InputField
          label="Price *"
          value={form.price}
          onChangeText={(v) => onUpdate("price", v)}
          placeholder="$2,500"
          error={errors.price}
        />
      </View>
      <View className="w-28">
        <InputField
          label="Duration"
          value={form.duration}
          onChangeText={(v) => onUpdate("duration", v)}
          placeholder="8 hours"
        />
      </View>
    </View>

    <InputField
      label="Description *"
      value={form.description}
      onChangeText={(v) => onUpdate("description", v)}
      placeholder="Describe what guests get..."
      multiline
      error={errors.description}
    />

    <View className="mb-4">
      <Text variant="caption" className="mb-2 text-gray-600">
        What's Included (up to 3)
      </Text>
      <View className="flex-row gap-2">
        {form.included.map((item: string, i: number) => (
          <TextInput
            key={i}
            value={item}
            onChangeText={(v) => {
              const arr = [...form.included];
              arr[i] = v;
              onUpdate("included", arr);
            }}
            placeholder={`Inclusion ${i + 1}`}
            placeholderTextColor="#9CA3AF"
            className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg"
          />
        ))}
      </View>
    </View>

    <View className="mb-4">
      <Text variant="caption" className="mb-2 text-gray-600">
        Badge (Optional)
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {["", ...BADGE_OPTIONS].map((b) => (
          <TouchableOpacity
            key={b}
            onPress={() => onUpdate("badge", b)}
            className={`px-3 py-1.5 rounded border ${
              form.badge === b
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 bg-white"
            }`}
            style={{
              borderColor: form.badge === b ? accentColor : "#e5e7eb",
              backgroundColor:
                form.badge === b ? `${accentColor}10` : "#ffffff",
            }}
          >
            <Text
              className="text-xs font-bold tracking-wider"
              style={{
                color: form.badge === b ? accentColor : "#6b7280",
              }}
            >
              {b || "None"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

    <View className="flex-row gap-3">
      <Button
        variant="primary"
        onPress={onSave}
        className="flex-1"
        style={{ backgroundColor: accentColor }}
      >
        {isEditing ? "Update Package" : "Add Package"}
      </Button>
      <Button variant="secondary" onPress={onCancel} className="px-4">
        Cancel
      </Button>
    </View>
  </View>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function VendorMenuBuilder() {
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState<"build" | "preview">("build");
  const [vendor, setVendor] = useState({
    name: "",
    tagline: "",
    bio: "",
    type: "",
    contact: "",
    location: "",
  });
  const [services, setServices] = useState(defaultServices);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [addingService, setAddingService] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    duration: "",
    description: "",
    badge: "",
    included: ["", "", ""],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const vendorType = VENDOR_TYPES.find((v) => v.id === vendor.type);
  const accentColor = vendorType?.color || "#C9A84C";
  const specialtyOptions = SPECIALTIES_BY_TYPE[vendor.type] || [];

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const updateVendor = (key: string, val: string) => {
    setVendor((p) => ({ ...p, [key]: val }));
    if (key === "type") {
      setSpecialties([]);
    }
  };

  const updateForm = (key: string, val: any) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.price.trim()) e.price = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveService = () => {
    if (!validate()) return;
    const svc = {
      id: editId || generateId(),
      title: form.title.trim(),
      price: form.price.trim(),
      duration: form.duration.trim(),
      description: form.description.trim(),
      badge: form.badge,
      included: form.included.filter(Boolean),
    };
    if (editId) {
      setServices((s) => s.map((x) => (x.id === editId ? svc : x)));
    } else {
      setServices((s) => [...s, svc]);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      duration: "",
      description: "",
      badge: "",
      included: ["", "", ""],
    });
    setEditId(null);
    setAddingService(false);
    setErrors({});
  };

  const startEdit = (svc: any) => {
    const inc = [...(svc.included || []), "", "", ""].slice(0, 3);
    setForm({
      title: svc.title,
      price: svc.price,
      duration: svc.duration || "",
      description: svc.description,
      badge: svc.badge || "",
      included: inc,
    });
    setEditId(svc.id);
    setAddingService(true);
  };

  const deleteService = (id: string) => {
    setServices((s) => s.filter((x) => x.id !== id));
  };

  const toggleSpecialty = (s: string) => {
    setSpecialties((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s]
    );
  };

  const addCustomSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties((p) => [...p, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
        >
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#374151" />
        </TouchableOpacity>
        <Text variant="h2" className="text-gray-900">
          Services & Pricing
        </Text>
        <View className="w-10" />
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white px-4 pb-2">
        {(["build", "preview"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            className={`flex-1 py-3 rounded-lg mx-1 ${
              tab === t ? "bg-pink-50" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                tab === t ? "text-pink-600" : "text-gray-400"
              }`}
            >
              {t === "build" ? "⚙ Build" : "👁 Preview"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Step Indicator (only in build mode) */}
      {tab === "build" && <StepIndicator currentStep={step} />}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {tab === "build" ? (
          <>
            {/* Step 1: Vendor Category */}
            {step === 1 && (
              <Card className="p-5">
                <Text variant="h2" className="mb-2 text-gray-900">
                  Vendor Category
                </Text>
                <Text variant="caption" className="mb-4 text-gray-500">
                  Select your service category
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {VENDOR_TYPES.map((vt) => (
                    <TouchableOpacity
                      key={vt.id}
                      onPress={() => {
                        updateVendor("type", vt.id);
                      }}
                      className={`px-4 py-3 rounded-full border ${
                        vendor.type === vt.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 bg-white"
                      }`}
                      style={{
                        borderColor:
                          vendor.type === vt.id ? vt.color : "#e5e7eb",
                        backgroundColor:
                          vendor.type === vt.id ? `${vt.color}15` : "#ffffff",
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{
                          color: vendor.type === vt.id ? vt.color : "#6b7280",
                        }}
                      >
                        {vt.icon} {vt.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {vendor.type && (
                  <View
                    className="mt-6 p-4 rounded-lg"
                    style={{ backgroundColor: `${accentColor}10` }}
                  >
                    <Text
                      className="text-sm font-medium"
                      style={{ color: accentColor }}
                    >
                      {vendorType?.tagline}
                    </Text>
                  </View>
                )}

                <Button
                  variant="primary"
                  onPress={nextStep}
                  disabled={!vendor.type}
                  className="mt-6"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  Continue
                </Button>
              </Card>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <Card className="p-5">
                <Text variant="h2" className="mb-2 text-gray-900">
                  Business Details
                </Text>
                <Text variant="caption" className="mb-4 text-gray-500">
                  Tell guests about your business
                </Text>

                <InputField
                  label="Business / Artist Name *"
                  value={vendor.name}
                  onChangeText={(v) => updateVendor("name", v)}
                  placeholder="e.g. Lumière Photography"
                />

                <InputField
                  label="Short Tagline"
                  value={vendor.tagline}
                  onChangeText={(v) => updateVendor("tagline", v)}
                  placeholder="e.g. Where every shot tells a story"
                />

                <InputField
                  label="Why Hire Me — Your Pitch"
                  value={vendor.bio}
                  onChangeText={(v) => updateVendor("bio", v)}
                  placeholder="Tell guests about your experience, style..."
                  multiline
                />

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <InputField
                      label="Contact / Email"
                      value={vendor.contact}
                      onChangeText={(v) => updateVendor("contact", v)}
                      placeholder="hello@yourbusiness.com"
                    />
                  </View>
                  <View className="flex-1">
                    <InputField
                      label="Location / City"
                      value={vendor.location}
                      onChangeText={(v) => updateVendor("location", v)}
                      placeholder="e.g. Miami, FL"
                    />
                  </View>
                </View>

                {/* Specialties Section */}
                {vendor.type && (
                  <View className="mt-4">
                    <Text variant="h2" className="mb-2 text-gray-900">
                      Specialties & Skills
                    </Text>
                    <Text variant="caption" className="mb-3 text-gray-500">
                      Select what you do best
                    </Text>

                    <View className="flex-row flex-wrap gap-2 mb-4">
                      {specialtyOptions.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          selected={specialties.includes(s)}
                          onPress={() => toggleSpecialty(s)}
                          color={accentColor}
                        />
                      ))}
                    </View>

                    <View className="flex-row gap-2">
                      <TextInput
                        value={newSpecialty}
                        onChangeText={setNewSpecialty}
                        onSubmitEditing={addCustomSpecialty}
                        placeholder="Add a custom specialty..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 px-4 py-3 text-gray-900 bg-white border border-gray-200 rounded-lg"
                      />
                      <TouchableOpacity
                        onPress={addCustomSpecialty}
                        className="px-4 py-3 rounded-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Text className="text-lg font-bold text-white">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View className="flex-row gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onPress={prevStep}
                    className="px-4"
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onPress={nextStep}
                    disabled={!vendor.name.trim()}
                    className="flex-1"
                    style={{ backgroundColor: "#ec4899" }}
                  >
                    Continue
                  </Button>
                </View>
              </Card>
            )}

            {/* Step 3: Services */}
            {step === 3 && (
              <Card className="p-5">
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text variant="h2" className="text-gray-900">
                      Packages & Services
                    </Text>
                    <Text variant="caption" className="text-gray-500">
                      Create clear, compelling packages
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full bg-gray-100">
                    <Text className="text-sm font-semibold text-gray-600">
                      {services.length} packages
                    </Text>
                  </View>
                </View>

                {/* Service Form */}
                {addingService && (
                  <ServiceForm
                    form={form}
                    errors={errors}
                    accentColor={accentColor}
                    onUpdate={updateForm}
                    onSave={saveService}
                    onCancel={resetForm}
                    isEditing={!!editId}
                  />
                )}

                {/* Service List */}
                {services.map((svc, i) => (
                  <ServiceCard
                    key={svc.id}
                    service={svc}
                    index={i}
                    accentColor={accentColor}
                    onEdit={() => startEdit(svc)}
                    onDelete={() => deleteService(svc.id)}
                  />
                ))}

                {!addingService && (
                  <TouchableOpacity
                    onPress={() => setAddingService(true)}
                    className="py-4 border-2 border-dashed border-gray-300 rounded-xl"
                  >
                    <Text className="text-center text-gray-500 font-medium">
                      + Add Another Package
                    </Text>
                  </TouchableOpacity>
                )}

                <View className="flex-row gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onPress={prevStep}
                    className="px-4"
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onPress={() => setTab("preview")}
                    className="flex-1"
                    style={{ backgroundColor: "#ec4899" }}
                  >
                    Preview Menu
                  </Button>
                </View>
              </Card>
            )}
          </>
        ) : (
          /* Preview Mode - Guest Facing Menu Card */
          <View className="items-center">
            <View
              className="w-full max-w-md rounded-sm overflow-hidden"
              style={{
                backgroundColor: "#FDFAF5",
                borderWidth: 1,
                borderColor: `${accentColor}30`,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.12,
                shadowRadius: 60,
                elevation: 10,
              }}
            >
              {/* Header Strip */}
              <View
                className="py-2 px-8 text-center"
                style={{ backgroundColor: accentColor }}
              >
                <Text
                  className="text-[10px] tracking-[3px] uppercase text-center"
                  style={{ color: "rgba(255,255,255,0.85)" }}
                >
                  {vendorType?.tagline || "Professional Services"}
                </Text>
              </View>

              {/* Main Header */}
              <View
                className="px-10 py-10 text-center"
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: `${accentColor}25`,
                }}
              >
                <Text
                  className="text-5xl mb-3 text-center"
                  style={{ lineHeight: 52 }}
                >
                  {vendorType?.icon || "⭐"}
                </Text>
                <Text className="text-3xl font-normal text-center text-gray-900 tracking-wide leading-tight">
                  {vendor.name || "Your Business Name"}
                </Text>
                {vendor.tagline && (
                  <Text className="text-base text-center text-gray-600 italic mt-2">
                    "{vendor.tagline}"
                  </Text>
                )}
                <View className="flex-row items-center justify-center mt-4 gap-1.5">
                  <View className="h-px w-10 bg-pink-400" />
                  <View className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  <View className="h-px w-10 bg-pink-400" />
                </View>
              </View>

              {/* Why Hire Me */}
              {vendor.bio && (
                <View
                  className="px-10 py-6"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: `${accentColor}20`,
                    backgroundColor: `${accentColor}06`,
                  }}
                >
                  <Text
                    className="text-[11px] tracking-[2.5px] uppercase mb-2.5 font-bold"
                    style={{ color: accentColor }}
                  >
                    Why Choose Me
                  </Text>
                  <Text className="text-base leading-7 text-pink-500 font-normal">
                    {vendor.bio}
                  </Text>
                </View>
              )}

              {/* Specialties */}
              {specialties.length > 0 && (
                <View
                  className="px-10 py-6"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: `${accentColor}20`,
                  }}
                >
                  <Text
                    className="text-[11px] tracking-[2.5px] uppercase mb-3.5 font-bold"
                    style={{ color: accentColor }}
                  >
                    Specialties & Skills
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {specialties.map((s) => (
                      <View
                        key={s}
                        className="px-3 py-1 rounded-sm border"
                        style={{ borderColor: `${accentColor}60` }}
                      >
                        <Text className="text-xs text-pink-500 font-medium tracking-wide">
                          {s}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Services */}
              <View className="px-10 py-6 pb-8">
                <Text
                  className="text-[11px] tracking-[2.5px] uppercase mb-5 font-bold"
                  style={{ color: accentColor }}
                >
                  Packages & Pricing
                </Text>
                <View className="flex flex-col gap-5">
                  {services.map((service, i) => (
                    <View
                      key={service.id}
                      className="relative pl-4"
                      style={{
                        borderLeftWidth: 3,
                        borderLeftColor: accentColor,
                      }}
                    >
                      <View className="flex-row justify-between items-start mb-1.5">
                        <View className="flex-1 flex-row items-center gap-2.5">
                          <Text className="text-lg font-semibold text-gray-900">
                            {service.title || "Service Name"}
                          </Text>
                          {service.badge && (
                            <View
                              className="px-2 py-0.5 rounded"
                              style={{ backgroundColor: accentColor }}
                            >
                              <Text className="text-[9px] font-bold text-white tracking-[1.5px]">
                                {service.badge}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text
                          className="text-2xl font-normal"
                          style={{ color: accentColor }}
                        >
                          {service.price || "—"}
                        </Text>
                      </View>
                      {service.duration && (
                        <Text className="text-xs text-pink-500 tracking-wide mb-1">
                          ⏱ {service.duration}
                        </Text>
                      )}
                      {service.description && (
                        <Text className="text-sm leading-relaxed text-pink-500 mt-2">
                          {service.description}
                        </Text>
                      )}
                      {service.included?.filter(Boolean).length > 0 && (
                        <View className="mt-2.5">
                          {service.included.filter(Boolean).map((item) => (
                            <View
                              key={item}
                              className="flex-row items-center gap-2 mb-1"
                            >
                              <View
                                className="w-3.5 h-3.5 rounded-full items-center justify-center"
                                style={{ backgroundColor: `${accentColor}20` }}
                              >
                                <Text
                                  className="text-[8px]"
                                  style={{ color: accentColor }}
                                >
                                  ✓
                                </Text>
                              </View>
                              <Text className="text-xs text-pink-500">
                                {item}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {i < services.length - 1 && (
                        <View
                          className="absolute -bottom-2.5 left-0 right-0 h-px"
                          style={{ backgroundColor: `${accentColor}15` }}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Contact Footer */}
              {(vendor.contact || vendor.location) && (
                <View
                  className="flex-row justify-between px-10 py-5"
                  style={{ backgroundColor: "#1A1208" }}
                >
                  {vendor.contact && (
                    <Text className="text-xs text-white/70">
                      📧 {vendor.contact}
                    </Text>
                  )}
                  {vendor.location && (
                    <Text className="text-xs text-white/70">
                      📍 {vendor.location}
                    </Text>
                  )}
                </View>
              )}
            </View>

            <Button
              variant="secondary"
              onPress={() => setTab("build")}
              className="mt-6 w-full max-w-md"
            >
              Back to Editor
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
