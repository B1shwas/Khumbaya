import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { Link, useRouter } from "expo-router";
import { useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";

const HERO_IMAGE = require("@/assets/images/home.png");

const CONTENT = {
  title: "Find Top Vendors",
  description:
    "Discover and book the best photographers, caterers, and decorators for your big day.",
  buttons: {
    createEvent: "Create Event",
    exploreVendors: "Explore Vendors",
  },
  loginPrompt: "Already have an account?",
  loginCta: "Login",
} as const;

export default function HomePage() {
  const router = useRouter();

  const handleExploreVendors = useCallback(() => {
    router.push("/explore-vendors");
  }, [router]);

  const handleCreateEvent = useCallback(() => {
    router.push("/login");
  }, [router]);

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className=" pt-8">
        <HeroImage />
        <TitleDescription />
        <Button
          variant="secondary"
          onPress={handleExploreVendors}
          className="mb-6 "
          accessibilityLabel="Explore available vendors"
        >
          {CONTENT.buttons.exploreVendors}
        </Button>

        <Button
          variant="primary"
          onPress={handleCreateEvent}
          className="mb-4"
          accessibilityLabel="Create a new event"
        >
          {CONTENT.buttons.createEvent}
        </Button>

        <LoginPrompt />
      </View>
    </ScrollView>
  );
}

function HeroImage() {
  return (
    <View className="mb-8">
      <Image
        source={HERO_IMAGE}
        className="w-full h-[50vh] rounded-3xl"
        resizeMode="cover"
        accessibilityLabel="Wedding venue hero image"
      />
    </View>
  );
}

function TitleDescription() {
  return (
    <View>
      <Text variant="h1" className="text-center mb-4">
        {CONTENT.title}
      </Text>
      <Text
        variant="body"
        className="text-gray-500 text-center mb-8 px-2 leading-6"
      >
        {CONTENT.description}
      </Text>
    </View>
  );
}

function LoginPrompt() {
  return (
    <View className="flex-row justify-center items-center">
      <Text className="text-muted-light text-base" variant="body">
        {CONTENT.loginPrompt}{" "}
      </Text>
      <Link href="/login" asChild>
        <TouchableOpacity accessibilityRole="link" accessibilityLabel="Login">
          <Text className="text-primary text-base font-semibold underline">
            {CONTENT.loginCta}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
