import { Stack } from "expo-router";

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="event-location" />
      <Stack.Screen name="event-estimates" />
       <Stack.Screen name="success" />
      <Stack.Screen name="subevent-create" />
      <Stack.Screen name="subevent-detail" />
    
      <Stack.Screen name="card-making" />
     
      {/* CMS Routes */}
    </Stack>
  );
}
