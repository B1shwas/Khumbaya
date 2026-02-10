import { useAuth } from "@/src/store/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

const EventCard = ({
  title,
  date,
  time,
  location,
  imageUrl,
}: EventCardProps) => (
  <TouchableOpacity
    className="flex-none w-[280px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
    onPress={() => router.push("/events")}
    activeOpacity={0.8}
  >
    <View className="h-36 w-full relative">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded shadow-sm">
        <Text className="text-xs font-bold text-gray-900">{date}</Text>
      </View>
    </View>
    <View className="p-4">
      <Text
        className="font-bold text-base text-gray-900 mb-2"
        numberOfLines={1}
      >
        {title}
      </Text>
      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="time" size={14} color="#896175" />
          <Text className="text-xs text-secondary-content">{time}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="location" size={14} color="#896175" />
          <Text className="text-xs text-secondary-content">{location}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

interface ArticleCardProps {
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  readTime: string;
  categoryColor: string;
}

const ArticleCard = ({
  category,
  title,
  description,
  imageUrl,
  readTime,
  categoryColor,
}: ArticleCardProps) => (
  <TouchableOpacity
    className="flex-row items-center gap-3 p-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 mb-3 h-[14vh]"
    onPress={() => router.push("/blog" as RelativePathString)}
    activeOpacity={0.8}
  >
    <View className="shrink-0 w-[25%] h-[10vh] rounded-lg overflow-hidden  ">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
    <View className="flex-1 gap-1 pr-2 h-[10vh]">
      <View className="flex-row items-center justify-start gap-2">
        <Text
          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColor}`}
        >
          {category}
        </Text>
        <Text className="text-[10px] text-secondary-content">• {readTime}</Text>
      </View>
      <View className="mt-2">
        <Text className="font-bold text-md text-gray-900" numberOfLines={1}>
          {title}
        </Text>
        <Text className=" text-xs text-secondary-content" numberOfLines={2}>
          {description}
        </Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

// ============================================
// Venue Card Component
// ============================================

interface VenueCardProps {
  id: string;
  name: string;
  location: string;
  capacity: string;
  price: string;
  rating: number;
  imageUrl: string;
  type: string;
}

const VenueCard = ({
  name,
  location,
  capacity,
  price,
  rating,
  imageUrl,
  type,
}: VenueCardProps) => (
  <TouchableOpacity
    className="flex-none w-[280px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
    onPress={() =>
      router.push({
        pathname: "/venue-detail",
        params: { id: name },
      } as unknown as RelativePathString)
    }
    activeOpacity={0.8}
  >
    <View className="h-36 w-full relative">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded shadow-sm">
        <Text className="text-xs font-bold text-gray-900">{type}</Text>
      </View>
      <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded shadow-sm flex-row items-center gap-1">
        <Ionicons name="star" size={12} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-xs font-bold text-gray-900">{rating}</Text>
      </View>
    </View>
    <View className="p-4">
      <Text
        className="font-bold text-base text-gray-900 mb-1"
        numberOfLines={1}
      >
        {name}
      </Text>
      <View className="flex-row items-center gap-1 mb-2">
        <Ionicons name="location" size={14} color="#6B7280" />
        <Text className="text-xs text-secondary-content" numberOfLines={1}>
          {location}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Ionicons name="people" size={14} color="#6B7280" />
          <Text className="text-xs text-secondary-content">{capacity}</Text>
        </View>
        <Text className="text-sm font-bold text-primary">{price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ============================================
// Hotel Card Component
// ============================================

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  imageUrl: string;
  amenities: string[];
}

const HotelCard = ({
  name,
  location,
  distance,
  price,
  rating,
  imageUrl,
  amenities,
}: HotelCardProps) => (
  <TouchableOpacity
    className="w-64 bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
    onPress={() =>
      router.push({
        pathname: "/hotel-detail",
        params: { id: name },
      } as unknown as RelativePathString)
    }
    activeOpacity={0.8}
  >
    <View className="h-36 w-full relative">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded shadow-sm flex-row items-center gap-1">
        <Ionicons name="star" size={12} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-xs font-bold text-gray-900">{rating}</Text>
      </View>
    </View>
    <View className="p-4">
      <Text
        className="font-bold text-base text-gray-900 mb-1"
        numberOfLines={1}
      >
        {name}
      </Text>
      <View className="flex-row items-center gap-1 mb-2">
        <Ionicons name="location" size={14} color="#6B7280" />
        <Text className="text-xs text-secondary-content">
          {location} • {distance}
        </Text>
      </View>
      <View className="flex-row items-center gap-2 mb-3">
        {amenities.slice(0, 3).map((amenity, index) => (
          <View key={index} className="bg-gray-100 px-2 py-0.5 rounded">
            <Text className="text-[10px] text-secondary-content">
              {amenity}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-secondary-content">per night</Text>
        <Text className="text-sm font-bold text-primary">{price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ============================================
// Vendor Card Component
// ============================================

interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
}

const VendorCard = ({
  name,
  category,
  rating,
  reviews,
  price,
  imageUrl,
}: VendorCardProps) => (
  <TouchableOpacity
    className="flex-none w-[280px] bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-4"
    onPress={() =>
      router.push({
        pathname: "/vendor-detail",
        params: { id: name },
      } as unknown as RelativePathString)
    }
    activeOpacity={0.8}
  >
    <View className="h-36 w-full relative">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded shadow-sm flex-row items-center gap-1">
        <Ionicons name="star" size={12} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-xs font-bold text-gray-900">{rating}</Text>
      </View>
    </View>
    <View className="p-4">
      <Text className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
        {category}
      </Text>
      <Text
        className="font-bold text-base text-gray-900 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <Ionicons name="people" size={14} color="#6B7280" />
          <Text className="text-xs text-secondary-content">
            {reviews} reviews
          </Text>
        </View>
        <Text className="text-sm font-bold text-primary">{price}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// ============================================
// Couple Card Component
// ============================================

interface CoupleCardProps {
  id: string;
  names: string;
  date: string;
  location: string;
  imageUrl: string;
  story: string;
}

const CoupleCard = ({
  names,
  date,
  location,
  imageUrl,
  story,
}: CoupleCardProps) => (
  <TouchableOpacity
    className="flex-row items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 mb-3"
    onPress={() =>
      router.push({
        pathname: "/wedding-story",
        params: { names },
      } as unknown as RelativePathString)
    }
    activeOpacity={0.8}
  >
    <View className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
    <View className="flex-1 gap-1">
      <Text className="font-bold text-base text-gray-900">{names}</Text>
      <View className="flex-row items-center gap-2">
        <Ionicons name="calendar" size={12} color="#896175" />
        <Text className="text-xs text-secondary-content">{date}</Text>
        <Text className="text-secondary-content">•</Text>
        <Ionicons name="location" size={12} color="#896175" />
        <Text className="text-xs text-secondary-content">{location}</Text>
      </View>
      <Text className="text-xs text-secondary-content" numberOfLines={2}>
        {story}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

// ============================================
// Quick Service Button Component
// ============================================

interface QuickServiceButtonProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  route: string;
}

const QuickServiceButton = ({
  name,
  icon,
  color,
  route,
}: QuickServiceButtonProps) => (
  <TouchableOpacity
    className="flex-row items-center gap-2 px-4 py-3 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
    onPress={() => router.push(route as RelativePathString)}
    activeOpacity={0.8}
    style={{ width: "47%" }}
  >
    <View
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <Ionicons name={icon as any} size={20} color="white" />
    </View>
    <Text className="font-semibold text-sm text-gray-900">{name}</Text>
  </TouchableOpacity>
);

export default function HomePage() {
  const events = [
    {
      id: "1",
      title: "Rahul & Simran's Sangeet",
      date: "DEC 12",
      time: "7:00 PM",
      location: "Mumbai",
      imageUrl:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    },
    {
      id: "2",
      title: "Annual Cultural Gala",
      date: "JAN 15",
      time: "6:00 PM",
      location: "New York",
      imageUrl:
        "https://images.unsplash.com/photo-1522673607200-1645062cd5d1?w=800&q=80",
    },
  ];

  const articles = [
    {
      id: "1",
      category: "Decor",
      title: "Top 10 Floral Trends for 2024",
      description:
        "From cascading bouquets to sustainable centerpieces, here is what is trending.",
      readTime: "5 min read",
      categoryColor: "bg-primary/10 text-primary",
      imageUrl:
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    },
    {
      id: "2",
      category: "Finance",
      title: "Budgeting 101: Where to Splurge",
      description:
        "Expert advice on allocating your wedding funds effectively.",
      readTime: "8 min read",
      categoryColor: "bg-blue-100 text-blue-600",
      imageUrl:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    },
    {
      id: "3",
      category: "Fashion",
      title: "Styling Modern Traditional Wear",
      description: "Mixing contemporary silhouettes with classic fabrics.",
      readTime: "4 min read",
      categoryColor: "bg-purple-100 text-purple-600",
      imageUrl:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    },
  ];

  const venues = [
    {
      id: "1",
      name: "Grand Ballroom Palace",
      location: "Downtown Mumbai",
      capacity: "500-1000 guests",
      price: "₹2L - ₹5L",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      type: "Banquet Hall",
    },
    {
      id: "2",
      name: "Sunset Garden Venue",
      location: "Lonavala",
      capacity: "200-400 guests",
      price: "₹1.5L - ₹3L",
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      type: "Outdoor Garden",
    },
    {
      id: "3",
      name: "Royal Palace Resort",
      location: "Jaipur",
      capacity: "300-600 guests",
      price: "₹3L - ₹6L",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      type: "Palace",
    },
  ];

  const hotels = [
    {
      id: "1",
      name: "Taj Lands End",
      location: "Bandra, Mumbai",
      distance: "2.5 km from venue",
      price: "₹8,500/night",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      amenities: ["Pool", "Spa", "WiFi"],
    },
    {
      id: "2",
      name: "The Leela Palace",
      location: "Andheri, Mumbai",
      distance: "5 km from venue",
      price: "₹12,000/night",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      amenities: ["Pool", "Spa", "Gym"],
    },
    {
      id: "3",
      name: "Marriott Hotel",
      location: "Juhu, Mumbai",
      distance: "3 km from venue",
      price: "₹7,500/night",
      rating: 4.5,
      imageUrl:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      amenities: ["Pool", "WiFi", "Breakfast"],
    },
  ];

  const vendors = [
    {
      id: "1",
      name: "Floral Dreams Studio",
      category: "Florist",
      rating: 4.9,
      reviews: 156,
      price: "₹50K - ₹2L",
      imageUrl:
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    },
    {
      id: "2",
      name: "Crown Catering",
      category: "Catering",
      rating: 4.7,
      reviews: 234,
      price: "₹1.5K/plate",
      imageUrl:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    },
    {
      id: "3",
      name: "Elite Photography",
      category: "Photography",
      rating: 4.8,
      reviews: 189,
      price: "₹75K - ₹3L",
      imageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    },
    {
      id: "4",
      name: "DJ Wave Sounds",
      category: "DJ/Music",
      rating: 4.6,
      reviews: 98,
      price: "₹25K - ₹80K",
      imageUrl:
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
    },
  ];

  const couples = [
    {
      id: "1",
      names: "Priya & Rahul",
      date: "Dec 15, 2024",
      location: "Udaipur",
      imageUrl:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
      story:
        "A magical royal wedding at the City of Lakes with 500 guests celebrating love.",
    },
    {
      id: "2",
      names: "Sarah & Mike",
      date: "Nov 20, 2024",
      location: "Goa",
      imageUrl:
        "https://images.unsplash.com/photo-1522673607200-1645062cd5d1?w=800&q=80",
      story:
        "Beachfront sunset ceremony with an intimate gathering of close family and friends.",
    },
    {
      id: "3",
      names: "Ananya & Arjun",
      date: "Oct 10, 2024",
      location: "Delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
      story:
        "Traditional Hindu wedding with vibrant colors and joyous celebrations.",
    },
  ];

  const quickServices = [
    {
      id: "1",
      name: "Checklist",
      icon: "checkmark-circle",
      color: "#10B981",
      route: "/checklist",
    },
    {
      id: "2",
      name: "Budget",
      icon: "wallet",
      color: "#3B82F6",
      route: "/budget",
    },
    {
      id: "3",
      name: "Guest List",
      icon: "people",
      color: "#8B5CF6",
      route: "/guests",
    },
    {
      id: "4",
      name: "Timeline",
      icon: "time",
      color: "#F59E0B",
      route: "/timeline",
    },
  ];
  const { user } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-surface-light border-b border-gray-100">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="relative">
            <View
              className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-primary/20"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80")',
              }}
            />
            <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface-light" />
          </View>
          <View className="flex-col">
            <Text className="text-xs font-medium text-secondary-content">
              Good Morning,
            </Text>
            <Text className="text-lg font-bold text-gray-900">Client name</Text>
          </View>
        </View>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 border "
          onPress={() => router.push("/notifications" as RelativePathString)}
        >
          <Ionicons name="notifications" size={24} />
          <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Card: Create Event */}
        <View className="px-4 py-2">
          <View className="relative overflow-hidden rounded-2xl shadow-sm bg-surface-light">
            {/* Background Image */}
            <View className="absolute inset-0">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/60 to-transparent" />
            </View>

            {/* Content */}
            <View className="relative z-10 p-6 gap-4">
              <View className="gap-1">
                <Text className="text-white text-2xl font-bold max-w-[80%]">
                  Plan your dream celebration.
                </Text>
                <Text className="text-white/90 text-sm font-medium max-w-[90%]">
                  Start organizing your wedding or cultural event today with our
                  new AI tools.
                </Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 rounded-xl h- py-5 bg-primary active:opacity-90"
                onPress={() =>
                  router.push(
                    "/(protected)/(client-tabs)/events/create" as RelativePathString,
                  )
                }
              >
                <Ionicons name="add-circle" size={20} color="white" />
                <Text className="text-white text-md font-bold">
                  Create New Event
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Services Quick Access */}
        <View className="mt-4 pb-6 px-4">
          <View className="flex-row items-center justify-between  pb-3">
            <Text className="text-lg font-bold text-gray-900">
              Quick Services
            </Text>
          </View>
          <View className="w-full ">
            <View className="flex-row flex-wrap gap-3 justify-center">
              {quickServices.map((service) => (
                <QuickServiceButton key={service.id} {...service} />
              ))}
            </View>
          </View>
        </View>

        {/* Horizontal Scroll: Events Attending */}
        <View className="mb-4 py-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">
              Events You're Attending
            </Text>
            <TouchableOpacity onPress={() => router.push("/events")}>
              {/* <Text className="text-primary text-sm font-semibold">
                See All
              </Text> */}
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            snapToInterval={296}
            decelerationRate="fast"
            className=""
          >
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
            {/* Spacer for scroll padding */}
            <View className="w-1 shrink-0" />
          </ScrollView>
        </View>

        {/* Vertical List: Planning Tips */}

        {/* Venues Section */}
        <View className="pb-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">
              Popular Venues
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/venues" as RelativePathString)}
            >
              {/* <Text className="text-primary text-sm font-semibold">
                See All
              </Text> */}
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            snapToInterval={296}
            decelerationRate="fast"
            className=""
          >
            {venues.map((venue) => (
              <VenueCard key={venue.id} {...venue} />
            ))}
            <View className="w-1 shrink-0" />
          </ScrollView>
        </View>

        {/* Hotels Section */}
        {/* <View className="pb-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">
              Recommended Hotels
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/hotels" as RelativePathString)}
            >
              <Text className="text-primary text-sm font-semibold">
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}
          >
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} {...hotel} />
            ))}
            <View className="w-1 shrink-0" />
          </ScrollView>
        </View> */}

        {/* Vendors Section */}
        <View className="mt-4 pb-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">Top Vendors</Text>
            <TouchableOpacity
              onPress={() => router.push("/explore" as RelativePathString)}
            >
              {/* <Text className="text-primary text-sm font-semibold">
                Explore All
              </Text> */}
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          >
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} {...vendor} />
            ))}
            <View className="w-1 shrink-0" />
          </ScrollView>
        </View>

        {/* Couples Section */}
        <View className="pb-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">
              Real Weddings
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/couples" as RelativePathString)}
            >
              {/* <Text className="text-primary text-sm font-semibold">
                View All
              </Text> */}
            </TouchableOpacity>
          </View>
          <View className="px-4">
            {couples.map((couple) => (
              <CoupleCard key={couple.id} {...couple} />
            ))}
          </View>
        </View>

        {/* Bottom padding for safe area */}
        <View className="h-24" />

        {/* Vendor Quick Actions */}
        <View className="pb-6">
          <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
            <Text className="text-lg font-bold text-gray-900">
              Vendor Dashboard
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/vendor" as RelativePathString)}
            >
              <Text className="text-primary text-sm font-semibold">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-3 justify-center px-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
              onPress={() =>
                router.push("/vendor/earnings" as RelativePathString)
              }
              activeOpacity={0.8}
              style={{ width: "47%" }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "#10B981" }}
              >
                <Ionicons name="wallet" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-900">
                  Track Money
                </Text>
                <Text className="text-xs text-secondary-content">
                  Monitor earnings
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
              onPress={() =>
                router.push("/vendor/events" as RelativePathString)
              }
              activeOpacity={0.8}
              style={{ width: "47%" }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "#3B82F6" }}
              >
                <Ionicons name="calendar" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-900">
                  Manage Events
                </Text>
                <Text className="text-xs text-secondary-content">
                  View schedules
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
              onPress={() =>
                router.push("/vendor/clients" as RelativePathString)
              }
              activeOpacity={0.8}
              style={{ width: "47%" }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "#8B5CF6" }}
              >
                <Ionicons name="people" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-900">
                  Find Clients
                </Text>
                <Text className="text-xs text-secondary-content">
                  Grow business
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 py-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100"
              onPress={() =>
                router.push("/vendor/analytics" as RelativePathString)
              }
              activeOpacity={0.8}
              style={{ width: "47%" }}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "#F59E0B" }}
              >
                <Ionicons name="stats-chart" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-900">
                  Analytics
                </Text>
                <Text className="text-xs text-secondary-content">
                  Track growth
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="pb-6">
          <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
            <Text className="text-lg font-bold text-gray-900">
              Planning Tips & Trends
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/blog" as RelativePathString)}
            >
              <Text className="text-primary text-sm font-semibold">
                View Blog
              </Text>
            </TouchableOpacity>
          </View>
          <View className="px-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Tips wala section */}

      {/* Floating Action Button for Create Event */}
      <TouchableOpacity
        className="absolute bottom-24 right-6 w-14 h-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30"
        onPress={() =>
          router.push(
            "/(protected)/(client-tabs)/events/create" as RelativePathString,
          )
        }
        activeOpacity={0.8}
        style={{
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
    </SafeAreaView>
  );
}
