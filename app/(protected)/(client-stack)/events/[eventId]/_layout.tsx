import { Stack } from "expo-router";
<<<<<<< HEAD
=======
// Sets the stack fot the eventId or detailed event page stack 
>>>>>>> update/stack
export default function EventLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
<<<<<<< HEAD
            <Stack.Screen name="timeline" />
            <Stack.Screen name="budget" />
            <Stack.Screen name="guests" />
            <Stack.Screen name="gallery" />
        </Stack>
    )
}
=======
            <Stack.Screen name="event-location" />
            <Stack.Screen name="event-estimates" options={{ headerShown: true }} />
            <Stack.Screen name="subevent-detail" />
        </Stack>
    )
}
>>>>>>> update/stack
