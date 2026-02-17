import { Stack, } from "expo-router";
export default function EventStack() {
    return (
        <Stack>
            <Stack.Screen name="events" options={{ headerShown: false }} />
        </Stack>
    )
}