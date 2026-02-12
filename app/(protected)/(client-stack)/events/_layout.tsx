
import { Stack } from "expo-router";
export default function EventStack() {
    // Make the stack for the detailed event and the event settings for the future 
    return (
        <Stack>
            <Stack.Screen name="[eventId]" options={{ headerShown: false }} />
            <Stack.Screen name="create" options={{ headerShown: false }} />
        </Stack>
    )
}
