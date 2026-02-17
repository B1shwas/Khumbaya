import EventScheduleSection from "@/src/components/user/EventScheduleSection";
import RSVPSection from "@/src/components/user/RSVPSection";
import VenuesSection from "@/src/components/user/VenuesSection";
import { ScrollView, View } from "react-native";
import EventDetailHero from "./EventDetailHero";

const GuestEventDetails = () => {
  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      <EventDetailHero />

      {/* RSVP Section */}
      <View className="mt-6">
        <RSVPSection
          status="Going"
          deadline="July 15th"
          dietary="Vegetarian Meal"
          onEdit={() => console.log("Edit dietary")}
          onModify={() => console.log("Modify RSVP")}
          onDecline={() => console.log("Decline RSVP")}
        />
      </View>

      {/* Event Schedule */}
      <View className="mt-6">
        <EventScheduleSection
          onViewFull={() => console.log("View full schedule")}
        />
      </View>

      {/* Venues */}
      <View className="mt-6">
        <VenuesSection
          onGetDirections={(venue) =>
            console.log("Get directions to", venue.name)
          }
          onUber={(venue) => console.log("Book Uber to", venue.name)}
        />
      </View>
    </ScrollView>
  );
};

export default GuestEventDetails;
