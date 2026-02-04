import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// =============================================================================
// COLOR CONFIGURATION
// =============================================================================
// TODO: These colors are from the HTML design. Update to match your app theme.
// You can use Tailwind classes directly (e.g., "bg-primary") or these constants.
// 
// Current HTML colors:
//   primary: "#ee2b8c" (pink)
//   navy: "#16213e" (dark blue for text)
//   gold: "#c5a059" (accent for trust badges)
//
// Your Tailwind has:
//   primary: "#ee2b8c" ✓ (matches)
//   text-primary: "#111827" (use this instead of navy?)
//
// SETUP NEEDED:
// 1. Add "navy" and "gold" to tailwind.config.js if you want to keep them:
//    navy: "#16213e",
//    gold: "#c5a059",
// 2. Or replace navy usages with text-primary/gray-900
// =============================================================================

const COLORS = {
  primary: "#ee2b8c",      // TODO: Use "primary" from Tailwind
  navy: "#16213e",         // TODO: Add to Tailwind or use text-primary
  gold: "#c5a059",         // TODO: Add to Tailwind or remove
};

// Country codes for picker
const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸", country: "US"   },
  { code: "+44", flag: "🇬🇧", country: "UK"  },
  { code: "+91", flag: "🇮🇳", country: "IN"  },
  { code: "+977", flag: "🇳🇵", country: "NP" },
  { code: "+61", flag: "🇦🇺", country: "AU" },
];

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleSendOTP = () => {
    // TODO: Implement OTP sending logic
    console.log("Sending OTP to:", selectedCountry.code, phoneNumber);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log("Google login pressed");
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log("Apple login pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Image Area */}
          <View className="relative w-full h-64 overflow-hidden rounded-b-3xl">
            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-FEoQhxG6lP-FQVMe1qUei4T3CxXoHkTHsDyNDxSO_IFRDxGIht5dykZ-3DWt2lTQjhV-KLi5ZFosSjyhDNvvSjWAIJ-Rj_-DCV0Lay0B3xe5CiGhhud3kOCrq8ldLXDGfXq9m4ugIBdM8hiHIJkvBfNupxmLg2F9QRVLPclUHCdercJ4mxzdCGPNtzNhEPNcp2BAWODZQu6lJ7We5CmVKBxfHnDhgj8LVVuHJ2dznCSaFIKkzlmhXCI2q2ANN9IH7wGVenBmGA",
              }}
              className="w-full h-full"
              resizeMode="cover"
            >
              {/* Gradient Overlay */}
              {/* TODO: Update gradient colors - using navy from HTML */}
              <LinearGradient
                colors={["transparent", "rgba(22, 33, 62, 0.6)"]}
                className="absolute inset-0"
              />
              
              {/* Logo overlay */}
              <View className="absolute bottom-6 left-0 right-0 items-center">
                <View className="bg-white/90 p-3 rounded-full shadow-lg">
                  {/* TODO: Change icon color - currently using primary */}
                  <MaterialIcons name="favorite" size={32} color={COLORS.primary} />
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Content Body */}
          <View className="flex-1 px-6 pt-6 pb-8">
            {/* Headlines */}
            <View className="items-center mb-8">
              {/* TODO: text color - using navy. Change to text-primary or text-gray-900 */}
              <Text className="text-3xl font-bold tracking-tight mb-2" style={{ color: COLORS.navy }}>
                Plan Your Perfect Day
              </Text>
              <Text className="text-gray-500 text-sm font-medium text-center">
                Enter your mobile number to access your exclusive event dashboard.
              </Text>
            </View>

            {/* Input Form */}
            <View className="gap-5">
              <View className="flex-row gap-3">
                {/* Country Code Picker */}
                <View className="w-1/3">
                  <Text 
                    className="text-xs font-semibold uppercase tracking-wider mb-1 ml-1"
                    style={{ color: COLORS.navy }}
                  >
                    Code
                  </Text>
                  <Pressable
                    onPress={() => setShowCountryPicker(true)}
                    className="h-12 rounded-lg border border-gray-200 bg-gray-50 flex-row items-center justify-between px-3"
                  >
                    <Text className="font-medium text-base" style={{ color: COLORS.navy }}>
                      {selectedCountry.flag} {selectedCountry.code}
                    </Text>
                    <MaterialIcons name="expand-more" size={18} color="#64748b" />
                  </Pressable>
                </View>

                {/* Mobile Number Input */}
                <View className="flex-1">
                  <Text 
                    className="text-xs font-semibold uppercase tracking-wider mb-1 ml-1"
                    style={{ color: COLORS.navy }}
                  >
                    Mobile Number
                  </Text>
                  <TextInput
                    className="h-12 rounded-lg border border-gray-200 bg-gray-50 px-4 font-medium text-base"
                    style={{ color: COLORS.navy }}
                    placeholder="555 123 4567"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              </View>

              {/* Primary Action Button */}
              {/* TODO: Using bg-primary from Tailwind. Change class if needed. */}
              <Pressable
                onPress={handleSendOTP}
                className="h-12 bg-primary rounded-lg shadow-md flex-row items-center justify-center gap-2 active:opacity-80"
              >
                <Text className="text-white font-bold">Send One-Time Password</Text>
                <MaterialIcons name="arrow-forward" size={16} color="white" />
              </Pressable>
            </View>

            {/* Divider */}
            <View className="relative my-8">
              <View className="absolute inset-x-0 top-1/2 h-px bg-gray-200" />
              <View className="items-center">
                <Text className="bg-white px-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Or continue with
                </Text>
              </View>
            </View>

            {/* Social Login Buttons */}
            <View className="flex-row gap-4">
              {/* Google Button */}
              <Pressable
                onPress={handleGoogleLogin}
                className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-lg border border-gray-200 bg-white active:bg-gray-50"
              >
                <AntDesign name="google" size={20} color="#EA4335" />
                <Text className="font-semibold text-sm" style={{ color: COLORS.navy }}>
                  Google
                </Text>
              </Pressable>

              {/* Apple Button */}
              <Pressable
                onPress={handleAppleLogin}
                className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-lg border border-gray-200 bg-white active:bg-gray-50"
              >
                <AntDesign name="apple" size={20} color="#000000" />
                <Text className="font-semibold text-sm" style={{ color: COLORS.navy }}>
                  Apple
                </Text>
              </Pressable>
            </View>

            {/* Spacer */}
            <View className="flex-1 min-h-[40px]" />

            {/* Trust Indicators */}
            {/* TODO: Using gold color for icons. Add to Tailwind or change. */}
            <View className="flex-row justify-center gap-6 mb-6">
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="verified-user" size={18} color={COLORS.gold} />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  SSL Secured
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="lock" size={18} color={COLORS.gold} />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Privacy Protected
                </Text>
              </View>
            </View>

            {/* Footer Legal */}
            <View className="items-center px-4">
              <Text className="text-xs text-gray-400 text-center leading-relaxed">
                By continuing, you agree to our{" "}
                {/* TODO: Add navigation to Terms page */}
                <Text className="font-medium underline" style={{ color: COLORS.navy }}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                {/* TODO: Add navigation to Privacy page */}
                <Text className="font-medium underline" style={{ color: COLORS.navy }}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowCountryPicker(false)}
        >
          <View className="bg-white rounded-t-2xl pb-8">
            <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold" style={{ color: COLORS.navy }}>
                Select Country Code
              </Text>
              <Pressable onPress={() => setShowCountryPicker(false)}>
                <MaterialIcons name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            {COUNTRY_CODES.map((country) => (
              <Pressable
                key={country.code}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
                className="px-6 py-4 border-b border-gray-50 active:bg-gray-50 flex-row items-center gap-3"
              >
                <Text className="text-2xl">{country.flag}</Text>
                <Text className="font-medium text-base" style={{ color: COLORS.navy }}>
                  {country.country} ({country.code})
                </Text>
                {selectedCountry.code === country.code && (
                  <MaterialIcons name="check" size={20} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}