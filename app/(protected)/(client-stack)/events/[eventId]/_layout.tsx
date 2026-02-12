import { Stack } from "expo-router";
// Sets the stack fot the eventId or detailed event page stack 
export default function EventLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="event-location" />
            <Stack.Screen name="event-estimates" options={{ headerShown: true }} />
            <Stack.Screen name="subevent-detail" />
            <Stack.Screen name="vendor" options={{ headerShown: true }} />
        </Stack>
    )
}
