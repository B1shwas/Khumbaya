import { Stack, useRouter } from "expo-router";
import { HelpCircle, LogOut, Settings, User } from "lucide-react-native";
export default function ClientStackLayout() {
  const router = useRouter();
  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      onPress: () => router.push('/profile'),
    },
    {
      icon: Settings,
      label: 'Settings',
      onPress: () => router.push('/profile'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      onPress: () => router.push('/profile'),
    },
    {
      icon: LogOut,
      label: 'Logout',
      onPress: async () => {
        // await clearAuth();
        router.replace('/(onboarding)');
      },
      danger: true,
    },
  ];
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[eventId]" />
    </Stack>
  );
}

