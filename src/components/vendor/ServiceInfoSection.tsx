import { Text } from "@/src/components/ui/Text";
import { BusinessCategory, OtherServiceAttribute } from "@/src/features/business/types";
import { shadowStyle } from "@/src/utils/helper";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

function StatTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl p-3" style={{ backgroundColor: "#f5f5f8" }}>
      <MaterialIcons name={icon as any} size={16} color="#ee2b8c" style={{ marginBottom: 4 }} />
      <Text style={{ color: "#9ca3af", fontSize: 9 }} className="uppercase tracking-widest">{label}</Text>
      <Text className="text-[#181114] font-semibold text-sm mt-0.5">{value}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2.5 border-b border-gray-100">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-[#181114]">{value}</Text>
    </View>
  );
}

function StyleChips({ styles }: { styles: string[] }) {
  if (styles.length === 0) return null;
  return (
    <View className="mt-3">
      <Text className="text-xs text-gray-400 uppercase tracking-wide mb-2">Styles</Text>
      <View className="flex-row flex-wrap gap-2">
        {styles.map((s) => (
          <View key={s} className="bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
            <Text className="text-primary text-xs font-semibold">{s}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function BookingCard({ service }: { service: OtherServiceAttribute }) {
  return (
    <View className="mx-4 mb-4 rounded-2xl overflow-hidden bg-white" style={[{ borderWidth: 1, borderColor: "#f0f0f4" }, shadowStyle]}>
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-3">
        <MaterialIcons name="verified-user" size={20} color="#ee2b8c" />
        <Text className="text-[#181114] font-semibold text-base">Booking & Availability</Text>
      </View>
      <View style={{ height: 1, backgroundColor: "#f0f0f4" }} />
      <View className="px-4 pt-3 pb-4 flex-row gap-2">
        <StatTile icon="payments" label="Advance" value={service.advanceAmount != null ? `₹${service.advanceAmount.toLocaleString()}` : "On Request"} />
        <StatTile icon="flight-takeoff" label="Travel" value={service.travelCharges != null && service.travelCharges > 0 ? `₹${service.travelCharges.toLocaleString()}` : "Included"} />
        <StatTile icon="event-available" label="Max / Day" value={service.maxBookingsPerDay != null ? `${service.maxBookingsPerDay}` : "Flexible"} />
      </View>
      <View className="flex-row gap-2 px-4 pb-4">
        {service.availableForDestination && (
          <View className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1">
            <MaterialIcons name="flight" size={11} color="#ee2b8c" />
            <Text style={{ color: "#ee2b8c", fontSize: 10 }}>Destination Events</Text>
          </View>
        )}
        {service.customizationAvailable && (
          <View className="flex-row items-center gap-1 bg-primary/10 rounded-full px-3 py-1">
            <MaterialIcons name="tune" size={11} color="#ee2b8c" />
            <Text style={{ color: "#ee2b8c", fontSize: 10 }}>Customizable</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function ServiceCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mx-4 mb-3 bg-white rounded-md border border-gray-100 overflow-hidden" style={{ elevation: 1 }}>
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-2">
        <View className="h-8 w-8 rounded-lg bg-primary/10 items-center justify-center">
          <MaterialIcons name={icon as any} size={18} color="#ee2b8c" />
        </View>
        <Text className="font-semibold text-[#181114] text-base">{title}</Text>
      </View>
      <View className="px-4 pb-4">{children}</View>
    </View>
  );
}

export function ServiceInfoSection({
  service,
  category,
}: {
  service: OtherServiceAttribute;
  category: BusinessCategory | null;
}) {
  const styles = service.stylesSpecialized
    ? service.stylesSpecialized.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const renderCard = () => {
    if (
      category === BusinessCategory.PhotographerVideographer ||
      category === BusinessCategory.PreWeddingShoot
    ) {
      return (
        <ServiceCard icon="camera-alt" title="Photography Details">
          {service.artistType ? <InfoRow label="Shoot Style" value={service.artistType} /> : null}
          <InfoRow label="Uses Own Equipment" value={service.usesOwnMaterial ? "Yes — all gear included" : "Client provides equipment"} />
          <StyleChips styles={styles} />
          {!service.artistType && styles.length === 0 && <Text className="text-sm text-gray-400 mt-2">Details not provided</Text>}
        </ServiceCard>
      );
    }

    if (
      category === BusinessCategory.MakeupArtist ||
      category === BusinessCategory.BridalGrooming ||
      category === BusinessCategory.MehendiArtist
    ) {
      const icon = category === BusinessCategory.MehendiArtist ? "brush" : "face-retouching-natural";
      const title = category === BusinessCategory.MehendiArtist ? "Mehendi Specialization" : category === BusinessCategory.BridalGrooming ? "Grooming Expertise" : "Makeup Artistry";
      return (
        <ServiceCard icon={icon} title={title}>
          {service.artistType ? <InfoRow label="Artist Type" value={service.artistType} /> : null}
          <InfoRow label="Uses Own Products" value={service.usesOwnMaterial ? "Yes — products included" : "Client provides products"} />
          <StyleChips styles={styles} />
          {!service.artistType && styles.length === 0 && <Text className="text-sm text-gray-400 mt-2">Details not provided</Text>}
        </ServiceCard>
      );
    }

    if (category === BusinessCategory.WeddingPlannersDecorator) {
      return (
        <ServiceCard icon="celebration" title="Planning & Decor">
          {service.artistType ? <InfoRow label="Specialization" value={service.artistType} /> : null}
          <InfoRow label="Customization" value={service.customizationAvailable ? "Full custom themes available" : "Standard packages"} />
          <InfoRow label="Destination Events" value={service.availableForDestination ? "Available" : "Local only"} />
          <StyleChips styles={styles} />
        </ServiceCard>
      );
    }

    if (category === BusinessCategory.MusicEntertainment || category === BusinessCategory.Baraat) {
      return (
        <ServiceCard icon="music-note" title={category === BusinessCategory.Baraat ? "Baraat Details" : "Entertainment"}>
          {service.artistType ? <InfoRow label="Act Type" value={service.artistType} /> : null}
          <InfoRow label="Own Sound System" value={service.usesOwnMaterial ? "Yes — full setup included" : "Venue sound required"} />
          <InfoRow label="Destination Gigs" value={service.availableForDestination ? "Available" : "Local only"} />
          <StyleChips styles={styles} />
        </ServiceCard>
      );
    }

    if (category === BusinessCategory.FoodCatering) {
      return (
        <ServiceCard icon="restaurant" title="Catering Details">
          {service.artistType ? <InfoRow label="Cuisine Type" value={service.artistType} /> : null}
          <InfoRow label="Veg Menu" value={service.servicesVeg ? "Available" : "Non-veg only"} />
          {service.minOrder != null && <InfoRow label="Min. Order" value={`₹${service.minOrder.toLocaleString()}`} />}
          <StyleChips styles={styles} />
        </ServiceCard>
      );
    }

    if (
      category === BusinessCategory.InvitesGift ||
      category === BusinessCategory.BridalWear ||
      category === BusinessCategory.JewelryAccessories
    ) {
      const icon = category === BusinessCategory.JewelryAccessories ? "diamond" : category === BusinessCategory.BridalWear ? "checkroom" : "card-giftcard";
      const title = category === BusinessCategory.JewelryAccessories ? "Jewelry & Accessories" : category === BusinessCategory.BridalWear ? "Bridal Wear" : "Invites & Gifting";
      return (
        <ServiceCard icon={icon} title={title}>
          {service.artistType ? <InfoRow label="Specialty" value={service.artistType} /> : null}
          <InfoRow label="Customization" value={service.customizationAvailable ? "Custom designs available" : "Ready-made only"} />
          {service.minOrder != null && <InfoRow label="Min. Order" value={`₹${service.minOrder.toLocaleString()}`} />}
          <StyleChips styles={styles} />
        </ServiceCard>
      );
    }

    if (category === BusinessCategory.SecurityGuard) {
      return (
        <ServiceCard icon="security" title="Security Services">
          {service.artistType ? <InfoRow label="Guard Type" value={service.artistType} /> : null}
          <InfoRow label="Destination Deployments" value={service.availableForDestination ? "Available" : "Local only"} />
          <StyleChips styles={styles} />
        </ServiceCard>
      );
    }

    return (
      <ServiceCard icon="palette" title="Service Details">
        {service.artistType ? <InfoRow label="Specialization" value={service.artistType} /> : null}
        <StyleChips styles={styles} />
        {!service.artistType && styles.length === 0 && <Text className="text-sm text-gray-400 mt-2">Details not provided</Text>}
      </ServiceCard>
    );
  };

  return (
    <View className="mt-2">
      {renderCard()}
      <BookingCard service={service} />
    </View>
  );
}
