import { Stack, } from "expo-router";
export default function VendorStack() {
    return (
        <Stack>
            <Stack.Screen name="explore" options={{ headerShown: false }} />
            <Stack.Screen name="[vendorId]" options={{ headerShown: false }} />
        </Stack>
    )
}