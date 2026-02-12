import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "./hooks/useLogin";
import { loginStyles } from "./styles/LoginPage.styles";

const HERO_IMAGE = {
  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-FEoQhxG6lP-FQVMe1qUei4T3CxXoHkTHsDyNDxSO_IFRDxGIht5dykZ-3DWt2lTQjhV-KLi5ZFosSjyhDNvvSjWAIJ-Rj_-DCV0Lay0B3xe5CiGhhud3kOCrq8ldLXDGfXq9m4ugIBdM8hiHIJkvBfNupxmLg2F9QRVLPclUHCdercJ4mxzdCGPNtzNhEPNcp2BAWODZQu6lJ7We5CmVKBxfHnDhgj8LVVuHJ2dznCSaFIKkzlmhXCI2q2ANN9IH7wGVenBmGA",
};

export default function LoginPage() {
  const router = useRouter();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isPasswordVisible,
    loading,
    isLoginDisabled,
    pulseScale,
    handleLogin,
    togglePasswordVisibility,
  } = useLogin();

  return (
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={loginStyles.innerContainer}
      >
        <ScrollView
          contentContainerStyle={loginStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={loginStyles.logoContainer}>
            <View className="h-[35vh] w-full overflow-hidden rounded-b-xl">
              <ImageBackground
                source={HERO_IMAGE}
                style={loginStyles.container}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["rgba(22,33,62,0.6)", "transparent"]}
                  style={loginStyles.container}
                />
                <View style={loginStyles.logoContainer}>
                  <Animated.View
                    style={[{}, { transform: [{ scale: pulseScale }] }]}
                  >
                    <MaterialIcons name="favorite" size={28} color="#ee2b8c" />
                  </Animated.View>
                </View>
              </ImageBackground>
            </View>
          </View>

          <View style={loginStyles.innerContainer}>
            <Text style={loginStyles.title}>Welcome Back</Text>
            <Text style={loginStyles.subtitle}>
              Login to access your dashboard
            </Text>

            <View style={loginStyles.inputContainer}>
              <Text style={loginStyles.label}>Email</Text>
              <View style={loginStyles.inputWrapper}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  style={loginStyles.input}
                />
              </View>
            </View>

            <View style={loginStyles.inputContainer}>
              <Text style={loginStyles.label}>Password</Text>
              <View style={loginStyles.inputWrapper}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry={!isPasswordVisible}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  style={loginStyles.input}
                />
                <Pressable
                  onPress={togglePasswordVisibility}
                  style={loginStyles.passwordToggle}
                >
                  <MaterialIcons
                    name={isPasswordVisible ? "visibility-off" : "visibility"}
                    size={20}
                    color="#94A3B8"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isLoginDisabled || loading}
              style={[
                loginStyles.loginButton,
                (isLoginDisabled || loading) && loginStyles.loginButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={loginStyles.loginButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(onboarding)/(usersignup)")}
              style={loginStyles.signupContainer}
            >
              <Text style={loginStyles.signupText}>
                Don't have an account?{" "}
                <Text style={loginStyles.signupLink}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
