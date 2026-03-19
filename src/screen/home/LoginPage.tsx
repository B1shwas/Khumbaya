import { LoginHero } from "@/src/components/onboarding/LoginHero";
import { CountryOption, CountryPickerModal } from "@/src/components/ui/CountryPhone";
import { Text } from "@/src/components/ui/Text";
import { COUNTRY_DATA } from "@/src/constants/countrydata";
import { usefindUserMutation, useLogin, useResetPasswordMutation } from "@/src/features/user/api/use-user";
import type { User } from "@/src/store/AuthStore";
import { useAuthStore } from "@/src/store/AuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AuthStep = "phone" | "login" | "resetPassword";
type FoundUser = Pick<User, "id" | "phone" | "isActivated" > | null;
type LoginFormValues = {
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function LoginPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRY_DATA[0]);
  const [pickerVisible, setPickerVisible] = useState(false);
 const { setAuth } = useAuthStore() ; 
  const { control, handleSubmit, watch, setValue } = useForm<LoginFormValues>({
    defaultValues: {
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });



  const phone = watch("phone");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const findUserMutation =  usefindUserMutation();

  const loginMutation =  useLogin();

  const resetPasswordMutation = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [step, setStep] = useState<AuthStep>("phone");
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // ── Derived ──────────────────────────────────────────────────────────────────

  const digits = phone.replace(/\D/g, "");
  const fullPhone = `+${selectedCountry.dialCode}-${digits}`;
  const isValidPhone = /^\d{7,15}$/.test(digits);
  
  const passwordsMatch = confirmPassword === password && confirmPassword.length > 0;

  const canSubmit = useMemo(() => {
    if (step === "phone") return isValidPhone && !loading;
    if (step === "login") return isValidPhone && !loading;
    return passwordsMatch;
  }, [step, isValidPhone, passwordsMatch, loading]);
  

  const buttonLabel =
    step === "phone" ? "Next" : step === "resetPassword" ? "Set Password" : "Sign In";

  // ── Handlers ─────────────────────────────────────────────────────────────────
const handleNext = useCallback(async (values: LoginFormValues) => {
    if (!canSubmit) return;
    setError(null);
    if (step === "phone") {
      
      findUserMutation.mutate(fullPhone, {
        onSuccess: (data) => {
          if (data) {
           setFoundUser(data);
            setStep(data.isActivated ? "login" : "resetPassword");
          
          }
        },
        onError: (error:any) => {
          console.error("Error finding user:", error);
            setError(error.response?.data?.message || "Error Getting the user with the phone number ");
        },
        onSettled: () => {
         
        }
      });
    }
    if (step === "login") {
      console.log('The phone number that is being passed in te function are ',fullPhone);
      loginMutation.mutate({
        phone:fullPhone, 
        password:values.password
      } , {
        onSuccess:(data)=>{
          setAuth(data.token, data.user);
        },
        onError:(error:any)=>{
            console.error("Error logging in:", error);
            setError(error.response?.data?.message || "Error While logging in ");
        },
        onSettled:()=>{
          setLoading(false);
    }},)

    }

    if (step === "resetPassword") {
      setLoading(true);
      resetPasswordMutation.mutate({userId:foundUser!.id , newPassword:password} , {
        onSuccess:(data)=>{
    
          setAuth(data.token, data.user);
        },
        onError:(error:any)=>{
            console.error("Error Resetting password:", error);
            setError(error.response?.data?.message || "Error While resetting the password ");

        },
        onSettled:()=>{
          setLoading(false);
        },
  
    });
  }},[canSubmit, step, fullPhone, foundUser]);

 
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Full-screen Country Picker Modal */}
      <CountryPickerModal
        visible={pickerVisible}
        selected={selectedCountry}
        onSelect={setSelectedCountry}
        onClose={() => setPickerVisible(false)}
      />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 35 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        enableAutomaticScroll
        extraScrollHeight={40}
      >
        <View className="flex-1 bg-gray-100">
        <LoginHero/>
  
          {/* Form */}
          <View className="px-6 pb-8 pt-6">
            <View className="mb-6 items-center">
              <Text variant="h1" className="text-center text-3xl text-text-light">
                Plan Your Perfect Day
              </Text>
              <Text variant="body" className="mt-2 text-center text-sm text-muted-light px-2">
                {step === "phone"
                  ? "Get Started with Your Account"
                  : step === "resetPassword"
                  ? "Set a new password to reactivate your account"
                  : "Welcome back! Enter your password"}
              </Text>
            </View>

            <View className="gap-5">

              {/* ── Phone field ── */}
              <View>
                <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                  Phone number
                </Text>
                <View className="h-14 flex-row items-center rounded-md border border-gray-200 bg-white overflow-hidden">

                  {/* Country trigger — opens full-screen modal */}
                  <Pressable
                    onPress={() => step === "phone" && setPickerVisible(true)}
                    className="h-full flex-row items-center gap-1.5 px-3 border-r border-gray-200"
                  >
                    <Image
                      source={selectedCountry.image}
                      style={{ width: 26, height: 18, borderRadius: 3 }}
                      resizeMode="cover"
                    />
                    <Text className="text-sm font-medium text-gray-800">
                      +{selectedCountry.dialCode}
                    </Text>
                    {step === "phone" && (
                      <MaterialIcons name="arrow-drop-down" size={18} color="#9ca3af" />
                    )}
                  </Pressable>

                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Enter phone number"
                        placeholderTextColor="#896175"
                        keyboardType="phone-pad"
                        editable={step === "phone"}
                        className="flex-1 px-4 text-base text-text-light"
                      />
                    )}
                  />

                  {step !== "phone" && (
                    <Pressable
                      onPress={() => {
                        setStep("phone");
                        setValue("password", "");
                        setValue("confirmPassword", "");
                        setError(null);
                        setFoundUser(null);
                      }}
                      className="px-3"
                    >
                      <MaterialIcons name="edit" size={18} color="#896175" />
                    </Pressable>
                  )}
                </View>
              </View>

              {/* ── Password field (step: login | resetPassword) ── */}
              {step !== "phone" && (
                <View>
                  <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                    {step === "resetPassword" ? "New Password" : "Password"}
                  </Text>
                  <View className="relative">
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="••••••••"
                          placeholderTextColor="#896175"
                          secureTextEntry={!showPassword}
                          className="h-14 rounded-md border border-gray-200 bg-white px-4 text-base text-text-light"
                        />
                      )}/>
                    <Pressable
                      onPress={() => setShowPassword((p) => !p)}
                      className="absolute right-0 h-full items-center justify-center px-3"
                    >
                      <MaterialIcons
                        name={showPassword ? "visibility-off" : "visibility"}
                        size={20}
                        color="#896175"
                      />
                    </Pressable>
                  </View>
                {password.length === 0 && (
                  <Text className="ml-1 mt-1 text-xs text-red-500">
                    Password must not be empty
                  </Text>
                )}
                </View>
              )}

              {/* ── Confirm password (resetPassword only) ── */}
              {step === "resetPassword" && (
                <View>
                  <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                    Confirm Password
                  </Text>
                  <View className="relative">
                    <Controller
                      control={control}
                      name="confirmPassword"
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="••••••••"
                          placeholderTextColor="#896175"
                          secureTextEntry={!showConfirm}
                          className="h-14 rounded-md border border-gray-200 bg-white px-4 text-base text-text-light"
                        />
                      )}
                    />
                    <Pressable
                      onPress={() => setShowConfirm((p) => !p)}
                      className="absolute right-0 h-full items-center justify-center px-3"
                    >
                      <MaterialIcons
                        name={showConfirm ? "visibility-off" : "visibility"}
                        size={20}
                        color="#896175"
                      />
                    </Pressable>
                  </View>
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <Text className="ml-1 mt-1 text-xs text-red-500">
                      Passwords do not match
                    </Text>
                  )}
                </View>
              )}

              {/* ── Deactivated account notice ── */}
              {step === "resetPassword" && (
                <View className="rounded-lg bg-amber-50 p-3">
                  <Text className="text-center text-sm text-amber-700">
                    Your account is deactivated. Set a new password to reactivate it.
                  </Text>
                </View>
              )}

              {/* ── Error banner ── */}
              {error && (
                <View className="rounded-lg bg-red-50 p-3">
                  <Text className="text-center text-sm text-red-600">{error}</Text>
                </View>
              )}

              {/* ── Primary button ── */}
              <Pressable
                onPress={handleSubmit(handleNext)}
                disabled={!canSubmit}
                className={`h-14 flex-row items-center justify-center gap-2 rounded-md bg-primary shadow-md shadow-primary/20 ${!canSubmit ? "opacity-60" : ""}`}
              >
                {loading ? (
                  <Animated.View className="h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Text className="font-bold text-white">{buttonLabel}</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="white" />
                  </>
                )}
              </Pressable>

              <View className="items-center pt-1">
                <Link href="/(onboarding)/user-signup" asChild>
                  <Pressable>
                    <Text className="text-sm text-muted-light">
                      Don't have an account?{" "}
                      <Text className="underline text-black font-bold">Sign up</Text>
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* ── Trust badges ── */}
            <View className="mt-8 flex-row justify-center gap-6">
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="verified-user" size={16} color="#c5a059" />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  SSL Secured
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <MaterialIcons name="lock" size={16} color="#c5a059" />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Privacy Protected
                </Text>
              </View>
            </View>

            <View className="self-end mt-6 px-4">
              <Text className="text-center text-xs leading-relaxed text-gray-400">
                By continuing, you agree to our{" "}
                <Text className="underline text-text-light text-xs font-medium">
                  Terms of Service
                </Text>
                {"  and  "}
                <Text className="underline text-text-light text-xs font-medium">
                  Privacy Policy
                </Text>.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}
