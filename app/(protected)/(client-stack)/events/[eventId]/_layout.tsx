import { Stack } from "expo-router";
export default function EventLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="timeline" />
            <Stack.Screen name="budget" />
            <Stack.Screen name="guests" />
            <Stack.Screen name="gallery" />
        </Stack>
    )
}