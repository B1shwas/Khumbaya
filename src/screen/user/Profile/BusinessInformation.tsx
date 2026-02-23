import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#ec4899";

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "vendor:business_info";

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPERIENCE_OPTIONS = [
  { id: "1-2", label: "1–2 years", icon: "emoji-events" },
  { id: "3-5", label: "3–5 years", icon: "workspace-premium" },
  { id: "5-10", label: "5–10 years", icon: "military-tech" },
  { id: "10+", label: "10+ years", icon: "stars" },
] as const;

const SERVICE_TAGS = [
  "Photography",
  "Videography",
  "Catering",
  "Decoration",
  "DJ / Music",
  "Makeup & Styling",
  "Florist",
  "Event Planning",
  "Venue",
  "Cake & Desserts",
  "Lighting",
  "Invitation Design",
];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Nepali",
  "Maithili",
  "Newari",
  "Bhojpuri",
  "Urdu",
  "Other",
];

const BIO_MAX = 600;
const BIO_MIN = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

interface BusinessInfo {
  businessName: string;
  tagline: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  serviceRadius: string;
  experience: string;
  services: string[];
  languages: string[];
  instagramHandle: string;
  facebookHandle: string;
  updatedAt: string;
}

type FormErrors = Partial<Record<keyof BusinessInfo | "root", string>>;

const EMPTY_FORM: BusinessInfo = {
  businessName: "",
  tagline: "",
  bio: "",
  phone: "",
  email: "",
  website: "",
  location: "",
  serviceRadius: "",
  experience: "",
  services: [],
  languages: [],
  instagramHandle: "",
  facebookHandle: "",
  updatedAt: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toggleArrayItem = (arr: string[], item: string): string[] =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

// ─── UI Primitives ────────────────────────────────────────────────────────────

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-3xl p-5 border border-gray-100 mb-4 ${className}`}
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    }}
  >
    {children}
  </View>
);

const SectionLabel = ({ title }: { title: string }) => (
  <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-1">
    {title}
  </Text>
);

const FieldLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
  <View className="flex-row items-center mb-2">
    <Text className="text-sm font-semibold text-gray-700 flex-1">{label}</Text>
    {required && <Text className="text-pink-500 font-bold text-sm">*</Text>}
  </View>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <View className="flex-row items-center mt-1.5 gap-1">
      <MaterialIcons name="error-outline" size={13} color="#ef4444" />
      <Text className="text-red-500 text-xs">{message}</Text>
    </View>
  ) : null;

// ─── Input Field ──────────────────────────────────────────────────────────────

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  multiline = false,
  required = false,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences",
  maxLength,
  prefix,
  hint,
  autoCorrect = true,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  multiline?: boolean;
  required?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  prefix?: string;
  hint?: string;
  autoCorrect?: boolean;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-5">
      <FieldLabel label={label} required={required} />
      <View
        className={`flex-row bg-white rounded-2xl border ${
          error
            ? "border-red-400"
            : focused
            ? "border-pink-400"
            : "border-gray-100"
        } ${multiline ? "items-start" : "items-center"}`}
        style={multiline ? { minHeight: 120 } : { height: 52 }}
      >
        {prefix && (
          <View className="pl-4 pr-1">
            <Text className="text-gray-400 text-sm font-medium">{prefix}</Text>
          </View>
        )}
        {icon && !prefix && (
          <View className={`pl-4 ${multiline ? "pt-4" : ""}`}>
            <MaterialIcons
              name={icon}
              size={18}
              color={error ? "#f87171" : focused ? PRIMARY : "#9ca3af"}
            />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#c4c4c4"
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 px-3 text-gray-800 text-sm"
          style={
            multiline ? { textAlignVertical: "top", paddingTop: 14 } : {}
          }
        />
        {multiline && maxLength && (
          <Text className="absolute bottom-3 right-3 text-xs text-gray-300">
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
      {hint && !error && (
        <Text className="text-gray-400 text-xs mt-1.5">{hint}</Text>
      )}
      <FieldError message={error} />
    </View>
  );
};

// ─── Chip Multi-Select ────────────────────────────────────────────────────────

const ChipMultiSelect = ({
  label,
  selected,
  options,
  onToggle,
  required,
  error,
}: {
  label: string;
  selected: string[];
  options: string[];
  onToggle: (item: string) => void;
  required?: boolean;
  error?: string;
}) => (
  <View className="mb-5">
    <FieldLabel label={label} required={required} />
    <View className="flex-row flex-wrap" style={{ gap: 8 }}>
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onToggle(opt)}
            activeOpacity={0.75}
            className={`px-4 py-2.5 rounded-full border ${
              active ? "bg-pink-500 border-pink-500" : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                active ? "text-white" : "text-gray-600"
              }`}
            >
              {active && "✓  "}
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    <FieldError message={error} />
  </View>
);

// ─── Experience Picker ────────────────────────────────────────────────────────

const ExperiencePicker = ({
  value,
  onSelect,
  error,
}: {
  value: string;
  onSelect: (v: string) => void;
  error?: string;
}) => (
  <View className="mb-5">
    <FieldLabel label="Years of Experience" required />
    <View className="flex-row gap-2">
      {EXPERIENCE_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.75}
            className={`flex-1 rounded-2xl border items-center py-4 px-1 ${
              active
                ? "bg-pink-500 border-pink-500"
                : "bg-white border-gray-100"
            }`}
          >
            <MaterialIcons
              name={opt.icon as any}
              size={22}
              color={active ? "#fff" : "#9ca3af"}
            />
            <Text
              className={`text-xs font-bold mt-1.5 text-center ${
                active ? "text-white" : "text-gray-600"
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    <FieldError message={error} />
  </View>
);

// ─── Info Banner ──────────────────────────────────────────────────────────────

const InfoBanner = ({
  icon,
  title,
  body,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  body: string;
}) => (
  <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex-row items-start gap-3 mb-4">
    <MaterialIcons name={icon} size={18} color="#f59e0b" />
    <View className="flex-1">
      <Text className="text-sm font-bold text-amber-800 mb-0.5">{title}</Text>
      <Text className="text-xs text-amber-700 leading-5">{body}</Text>
    </View>
  </View>
);

// ─── Loading Overlay ──────────────────────────────────────────────────────────

const LoadingOverlay = ({ visible }: { visible: boolean }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{ opacity }}
      className="absolute inset-0 bg-white/80 items-center justify-center z-50 rounded-3xl"
    >
      <ActivityIndicator size="large" color={PRIMARY} />
      <Text className="text-gray-600 text-sm font-medium mt-3">Saving…</Text>
    </Animated.View>
  );
};

// ─── Step Indicator ────────────────────────────────────────────────────────────

const StepIndicator = ({ currentStep = 1 }: { currentStep?: number }) => {
  const steps = ["Info", "Services", "Location", "Social"];
  
  return (
    <View className="px-4 py-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <View key={step} className="flex-row items-center flex-1">
              <View className="items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isActive || isCompleted
                      ? "bg-pink-500"
                      : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <MaterialIcons name="check" size={16} color="white" />
                  ) : (
                    <Text
                      className={`text-xs font-bold ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {stepNum}
                    </Text>
                  )}
                </View>
                <Text
                  className={`text-[10px] font-semibold mt-1 ${
                    isActive ? "text-pink-500" : "text-gray-400"
                  }`}
                >
                  {step}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  className={`flex-1 h-0.5 mx-1 ${
                    isCompleted ? "bg-pink-500" : "bg-gray-100"
                  }`}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BusinessInformationScreen() {
  const scrollRef = useRef<ScrollView>(null);

  const [form, setForm] = useState<BusinessInfo>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loadState, setLoadState] = useState<"idle" | "loading" | "error">("loading");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [currentStep, setCurrentStep] = useState(1);

  // ── Load persisted data ──────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        setLoadState("loading");
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: BusinessInfo = JSON.parse(raw);
          setForm(parsed);
        }
        setLoadState("idle");
      } catch (err) {
        console.error("[BusinessInfo] load error:", err);
        setLoadState("error");
      }
    })();
  }, []);

  // ── Field helpers ────────────────────────────────────────────────────────

  const set = useCallback(
    (field: keyof BusinessInfo, value: string | string[]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const toggleService = useCallback(
    (item: string) => {
      setForm((prev) => ({
        ...prev,
        services: toggleArrayItem(prev.services, item),
      }));
      setErrors((prev) => ({ ...prev, services: undefined }));
    },
    []
  );

  const toggleLanguage = useCallback(
    (item: string) => {
      setForm((prev) => ({
        ...prev,
        languages: toggleArrayItem(prev.languages, item),
      }));
    },
    []
  );

  // ── Validation ─────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.businessName.trim())
      e.businessName = "Business name is required";

    if (!form.bio.trim()) {
      e.bio = "Description is required";
    } else if (form.bio.trim().length < BIO_MIN) {
      e.bio = `Please write at least ${BIO_MIN} characters`;
    }

    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone.trim())) {
      e.phone = "Enter a valid phone number";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (!form.location.trim()) e.location = "Location is required";

    if (!form.experience) e.experience = "Please select your experience level";

    if (form.services.length === 0)
      e.services = "Please select at least one service";

    if (
      form.website &&
      !/^https?:\/\/.+\..+/.test(form.website) &&
      !/^www\..+\..+/.test(form.website)
    ) {
      e.website = "Enter a valid website URL";
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }

    return Object.keys(e).length === 0;
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const save = async () => {
    if (!validate()) return;

    try {
      setSaveState("saving");
      const updated = { ...form, updatedAt: new Date().toISOString() };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setForm(updated);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch (err) {
      console.error("[BusinessInfo] save error:", err);
    }
  };

  // ── Render step content ─────────────────────────────────────────────────

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Card>
              <InfoBanner
                icon="info"
                title="Business Details"
                body="Tell us about your business to help clients find you"
              />
              <InputField
                label="Business Name"
                value={form.businessName}
                onChangeText={(v) => set("businessName", v)}
                placeholder="Enter your business name"
                icon="business"
                required
                error={errors.businessName}
              />
              <InputField
                label="Tagline"
                value={form.tagline}
                onChangeText={(v) => set("tagline", v)}
                placeholder="A short description of your services"
                icon="short-text"
              />
              <InputField
                label="Description"
                value={form.bio}
                onChangeText={(v) => set("bio", v)}
                placeholder="Tell clients about your business, experience, and what makes you unique..."
                icon="description"
                multiline
                required
                maxLength={BIO_MAX}
                error={errors.bio}
              />
            </Card>

            <Card>
              <SectionLabel title="Contact Information" />
              <InputField
                label="Phone Number"
                value={form.phone}
                onChangeText={(v) => set("phone", v)}
                placeholder="Enter phone number"
                icon="phone"
                keyboardType="phone-pad"
                required
                error={errors.phone}
              />
              <InputField
                label="Email Address"
                value={form.email}
                onChangeText={(v) => set("email", v)}
                placeholder="Enter email address"
                icon="email"
                keyboardType="email-address"
                required
                error={errors.email}
              />
              <InputField
                label="Website"
                value={form.website}
                onChangeText={(v) => set("website", v)}
                placeholder="www.yourbusiness.com"
                icon="language"
                keyboardType="url"
                error={errors.website}
              />
            </Card>

            <TouchableOpacity
              className="bg-pink-500 py-4 rounded-2xl items-center mt-2"
              onPress={() => setCurrentStep(2)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">Continue</Text>
            </TouchableOpacity>
          </>
        );

      case 2:
        return (
          <>
            <Card>
              <SectionLabel title="Services You Offer" />
              <ChipMultiSelect
                label="Select Services"
                selected={form.services}
                options={SERVICE_TAGS}
                onToggle={toggleService}
                required
                error={errors.services}
              />
            </Card>

            <Card>
              <SectionLabel title="Experience" />
              <ExperiencePicker
                value={form.experience}
                onSelect={(v) => set("experience", v)}
                error={errors.experience}
              />
            </Card>

            <Card>
              <SectionLabel title="Languages" />
              <ChipMultiSelect
                label="Languages Spoken"
                selected={form.languages}
                options={LANGUAGE_OPTIONS}
                onToggle={toggleLanguage}
              />
            </Card>

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="bg-gray-100 py-4 rounded-2xl items-center flex-1"
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-bold text-base">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-500 py-4 rounded-2xl items-center flex-1"
                onPress={() => setCurrentStep(3)}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Card>
              <InfoBanner
                icon="location-on"
                title="Service Location"
                body="Where do you primarily operate from?"
              />
              <InputField
                label="Business Address"
                value={form.location}
                onChangeText={(v) => set("location", v)}
                placeholder="Enter your business location"
                icon="location-on"
                required
                error={errors.location}
              />
              <InputField
                label="Service Radius (km)"
                value={form.serviceRadius}
                onChangeText={(v) => set("serviceRadius", v)}
                placeholder="How far do you travel for events?"
                icon="radar"
                keyboardType="phone-pad"
              />
            </Card>

            <Card>
              <SectionLabel title="Operating Hours" />
              <View className="bg-gray-50 rounded-xl p-4">
                <Text className="text-gray-600 text-sm text-center">
                  Business hours configuration coming soon
                </Text>
              </View>
            </Card>

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="bg-gray-100 py-4 rounded-2xl items-center flex-1"
                onPress={() => setCurrentStep(2)}
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-bold text-base">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-500 py-4 rounded-2xl items-center flex-1"
                onPress={() => setCurrentStep(4)}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">Continue</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      case 4:
        return (
          <>
            <Card>
              <InfoBanner
                icon="share"
                title="Social Media"
                body="Connect your social profiles to build trust with clients"
              />
              <InputField
                label="Instagram Handle"
                value={form.instagramHandle}
                onChangeText={(v) => set("instagramHandle", v)}
                placeholder="@yourbusiness"
                icon="camera-alt"
              />
              <InputField
                label="Facebook Page"
                value={form.facebookHandle}
                onChangeText={(v) => set("facebookHandle", v)}
                placeholder="facebook.com/yourbusiness"
                icon="facebook"
              />
            </Card>

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="bg-gray-100 py-4 rounded-2xl items-center flex-1"
                onPress={() => setCurrentStep(3)}
                activeOpacity={0.8}
              >
                <Text className="text-gray-700 font-bold text-base">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-500 py-4 rounded-2xl items-center flex-1"
                onPress={save}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">Save Profile</Text>
              </TouchableOpacity>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loadState === "loading") {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 flex-row items-center border-b border-gray-100">
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center bg-gray-100"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#374151" />
        </TouchableOpacity>
        <View className="flex-1 ml-3">
          <Text className="text-lg font-bold text-gray-900">Business Profile</Text>
          <Text className="text-xs text-gray-400">Complete your vendor profile</Text>
        </View>
        <View className="w-10" />
      </View>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {renderStepContent()}
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={saveState === "saving"} />
    </SafeAreaView>
  );
}
