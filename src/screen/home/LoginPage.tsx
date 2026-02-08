import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HERO_IMAGE = {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-FEoQhxG6lP-FQVMe1qUei4T3CxXoHkTHsDyNDxSO_IFRDxGIht5dykZ-3DWt2lTQjhV-KLi5ZFosSjyhDNvvSjWAIJ-Rj_-DCV0Lay0B3xe5CiGhhud3kOCrq8ldLXDGfXq9m4ugIBdM8hiHIJkvBfNupxmLg2F9QRVLPclUHCdercJ4mxzdCGPNtzNhEPNcp2BAWODZQu6lJ7We5CmVKBxfHnDhgj8LVVuHJ2dznCSaFIKkzlmhXCI2q2ANN9IH7wGVenBmGA",
};

const COPY = {
    title: "Plan Your Perfect Day",
    subtitle: "Enter your credentials to access your exclusive event dashboard.",
    usernameLabel: "Username or Email",
    usernamePlaceholder: "emma@wedding.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    login: "Login",
    signupPrompt: "Don't have an account?",
    signupCta: "Sign up",
    vendorPrompt: "I am a vendor",
    vendorCta: "Sign up as Vendor",
    socialDivider: "Or continue with",
    google: "Google",
    apple: "Apple",
    trustA: "SSL Secured",
    trustB: "Privacy Protected",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
} as const;

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const pulseScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Quirky touch: a gentle pulse on the heart badge to make the hero feel alive.
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseScale, {
                    toValue: 1.08,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseScale, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();
        return () => animation.stop();
    }, [pulseScale]);

    const isLoginDisabled = useMemo(
        () => username.trim().length === 0 || password.trim().length === 0,
        [username, password],
    );

    const handleLogin = useCallback(() => {
        // TODO: Wire this into your auth flow (API + context) before navigating.
        router.replace("/(protected)/(client-tabs)/home");
    }, [router]);

    return (
        <SafeAreaView className="flex-1 ">
           
                <View className=" w-full max-w-md overflow-hidden rounded-xl  ">
                    <View className="h-[35vh] w-full overflow-hidden rounded-b-xl">
                        <ImageBackground
                            source={HERO_IMAGE}
                            className="h-full w-full"
                            resizeMode="cover"
                            accessibilityLabel="Elegant wedding reception table setting"
                        >
                            <LinearGradient
                                colors={["rgba(22,33,62,0.6)", "transparent"]}
                                className="absolute inset-0"
                            />
                            <View className="absolute bottom-6 left-0 right-0 items-center">
                                <Animated.View
                                    style={{ transform: [{ scale: pulseScale }] }}
                                    className="rounded-full border border-yellow-200/60 bg-white/90 p-3"
                                >
                                    <MaterialIcons name="favorite" size={28} color="#ee2b8c" />
                                </Animated.View>
                            </View>
                        </ImageBackground>
                    </View>

                    <View className="px-6 pb-8 pt-6">
                        <View className="mb-6 items-center">
                            <Text variant="h1" className="text-center text-3xl text-text-light">
                                {COPY.title}
                            </Text>
                            <Text
                                variant="body"
                                className="mt-2 text-center text-sm font-medium text-muted-light px-2"
                            >
                                {COPY.subtitle}
                            </Text>
                        </View>

                        <View className="gap-5">
                            <View>
                                <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                                    {COPY.usernameLabel}
                                </Text>
                                <TextInput
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholder={COPY.usernamePlaceholder}
                                    placeholderTextColor="#94A3B8"
                                    autoCapitalize="none"
                                    className="h-12 rounded-lg border border-gray-200 bg-slate-50 px-4 text-base font-medium text-text-light"
                                />
                            </View>

                            <View>
                                <Text className="mb-1 ml-1 text-xs font-semibold uppercase tracking-wider text-text-light">
                                    {COPY.passwordLabel}
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder={COPY.passwordPlaceholder}
                                        placeholderTextColor="#94A3B8"
                                        secureTextEntry={!isPasswordVisible}
                                        className="h-12 rounded-lg border border-gray-200 bg-slate-50 px-4 pr-12 text-base font-medium text-text-light"
                                    />
                                    <Pressable
                                        onPress={() => setIsPasswordVisible((prev) => !prev)}
                                        className="absolute right-0 h-full items-center justify-center px-3"
                                        accessibilityRole="button"
                                        accessibilityLabel={
                                            isPasswordVisible ? "Hide password" : "Show password"
                                        }
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
                                disabled={isLoginDisabled}
                                className={`h-12 flex-row items-center justify-center gap-2 rounded-lg bg-primary shadow-md shadow-primary/20 ${
                                    isLoginDisabled ? "opacity-60" : ""
                                }`}
                                accessibilityRole="button"
                                accessibilityLabel="Login"
                            >
                                <Text className="font-bold text-white">{COPY.login}</Text>
                                <MaterialIcons name="arrow-forward" size={18} color="white" />
                            </Pressable>

                            <View className="items-center gap-3 pt-1">
                                <Link href="/" asChild>
                                    <Pressable accessibilityRole="link">
                                        <Text className="text-sm text-muted-light">
                                            {COPY.signupPrompt} {" "}
                                            <Text className=" underline text-black font-bold">
                                                {COPY.signupCta}
                                            </Text>
                                        </Text>
                                    </Pressable>
                                </Link>

                                <Link href="/(onboarding)/(vendorsignup)" asChild>
                                    <Pressable accessibilityRole="link">
                                        <Text className="text-sm text-muted-light">
                                            {COPY.vendorPrompt} {" "}
                                            <Text className=" underline text-primary font-bold">
                                                {COPY.vendorCta}
                                            </Text>
                                        </Text>
                                    </Pressable>
                                </Link>
                            </View>
                        </View>

                     
                        <View className="mt-8 flex-row justify-center gap-6">
                            <View className="flex-row items-center gap-1.5">
                                <MaterialIcons name="verified-user" size={16} color="#c5a059" />
                                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {COPY.trustA}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1.5">
                                <MaterialIcons name="lock" size={16} color="#c5a059" />
                                <Text className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                    {COPY.trustB}
                                </Text>
                            </View>
                        </View>

                        <View className=" self-end mt-6 px-4">
                            <Text className="text-center text-xs leading-relaxed text-gray-400">
                                By continuing, you agree to our {" "}
                                <Text className="underline text-text-light text-xs  font-medium">
                                    {COPY.terms}
                                </Text>{"  "}
                                and {"  "}
                                <Text className="underline text-text-light text-xs  font-medium">
                                    {COPY.privacy}
                                </Text>
                                .
                            </Text>
                        </View>
                    </View>
                </View>
           
        </SafeAreaView>
    );
}