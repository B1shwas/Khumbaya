import { Stack, } from "expo-router";
export default function VendorStack() {
    return (
        <Stack screenOptions={{headerShown:false , animation:"slide_from_bottom"}} >  
            <Stack.Screen name="index"  />
            <Stack.Screen name="enquiryform" options={{ presentation: "transparentModal" }} />
            <Stack.Screen name="vendorcomparision" />
        </Stack>
    )
}