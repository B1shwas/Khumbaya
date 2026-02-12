import { Stack, } from "expo-router";
export default function EventStack() {
    return (
        <Stack>
            <Stack.Screen name="events" options={{ headerShown: false }} />
            <Stack.Screen name="createevent" options={{ headerShown: false }} />

        </Stack>
    )
}