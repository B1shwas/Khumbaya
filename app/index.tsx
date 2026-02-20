import { useAuthStore } from "@/src/store/AuthStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { token } = useAuthStore();

  if (token) {
    return <Redirect href="/(protected)/(client-tabs)/home" />;
  }

  return <Redirect href="/(onboarding)" />;
}
