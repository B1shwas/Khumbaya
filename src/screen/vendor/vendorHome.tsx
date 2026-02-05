import { EventItem } from "@/src/components/vendor/EventItem";
import { Header } from "@/src/components/vendor/Header";
import { PendingRequestCard } from "@/src/components/vendor/PendingRequest";
import { Section } from "@/src/components/vendor/Section";
import { StatsCard } from "@/src/components/vendor/StatsCard";
import { EVENTS, REQUESTS, STATS } from "@/src/constants/vendors";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VendorHomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pl-4 mt-2"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {STATS.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </ScrollView>

        <Section title="Pending Requests" actionLabel="See All">
          {REQUESTS.map((req) => (
            <PendingRequestCard
              key={req.id}
              {...req}
              onAccept={() => {}}
              onDecline={() => {}}
            />
          ))}
        </Section>

        <Section title="Upcoming Events">
          {EVENTS.map((event) => (
            <EventItem key={event.id} {...event} />
          ))}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorHomeScreen;
