import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type RelativePathString } from "expo-router";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

const EventCard = ({ title, date, time, location, imageUrl }: EventCardProps) => (
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
      <Text className="font-bold text-base text-gray-900 mb-2" numberOfLines={1}>
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

const ArticleCard = ({ category, title, description, imageUrl, readTime, categoryColor }: ArticleCardProps) => (
  <TouchableOpacity
    className="flex-row items-center gap-3 p-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 mb-3"
    onPress={() => router.push("/blog" as RelativePathString)}
    activeOpacity={0.8}
  >
    <View className="shrink-0 w-20 h-20 rounded-lg overflow-hidden">
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
    <View className="flex-1 gap-1 pr-2">
      <View className="flex-row items-center gap-2">
        <Text className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColor}`}>
          {category}
        </Text>
        <Text className="text-[10px] text-secondary-content">• {readTime}</Text>
      </View>
      <Text className="font-bold text-sm text-gray-900" numberOfLines={1}>
        {title}
      </Text>
      <Text className="text-xs text-secondary-content" numberOfLines={2}>
        {description}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
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
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlIo5Riz1lkFJ_RuteTIAm2y3rd8oBoiVd--YgiDKI9SWNtoi02gv4vVl6fF4ejDrBnqe5q72BQ6qsui1DP8huSDdLBTOvwigwdmaucm_GrOMrgc4yjcmy8CsD_Az3WzzyNPaGpOZrYyGNSAxa2sH-m8BdLINT7oSjw_l1pkV0bByvZ71qrWJ7qoCgghqUkxlmX0xolbydQwkG0DZ8NqGNtsgIhVT7GnsgccuFXXYoZaXORufx25ptCi9XnUyFfJTKHtk7fddTY8s",
    },
    {
      id: "2",
      title: "Annual Cultural Gala",
      date: "JAN 15",
      time: "6:00 PM",
      location: "New York",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiNZxjryxVvBt_Qvd2BsU8jmuyGXsbWyZqiGyTJOFCn4I4QdwE-xrJUmE938nQ2sYjA0qbPec911z6qe-blSH_epWVfQJy2W2NwU5R-4dwi1k7uUfEgPutKfIV3RpR1EUutrAFt_7SBxXq5yRfR9EkuQCohSjZJpWgX0eNFvBY3F5rZ-xWmmB8Em-xGg1AvxCRQDlpUPXbLlpkcqBsqbQXGIi5tNUNw3p5WrCahAWFPRTkzEE0B8v47AYzYa8b-aEAMvtdko47AM",
    },
  ];

  const articles = [
    {
      id: "1",
      category: "Decor",
      title: "Top 10 Floral Trends for 2024",
      description: "From cascading bouquets to sustainable centerpieces, here is what is trending.",
      readTime: "5 min read",
      categoryColor: "bg-primary/10 text-primary",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjQm7mifn0fMG6WRrjsN8AnfnBwriviaEzlFUizzC6qlOGlX1I_GPyMHQYarIWc3WCWLG2uiNI6hqB_fLbQyarr14QhxettqBmN2Ne5O-Z5XBJfDsSH3tY8eyJOryddaeMlZJ6zS7f_gn2WU2x4U1nCWe9JcYuxtfgPt3zI5zsJ0mrP-PGqnBIflNTTSDDI1wZzZhMgietr5A1DwoKijQfvQng79SZASQw174qkFvvNc18z6jRW4U6ElvURSvLe4p8DcTSuO4yBTo",
    },
    {
      id: "2",
      category: "Finance",
      title: "Budgeting 101: Where to Splurge",
      description: "Expert advice on allocating your wedding funds effectively.",
      readTime: "8 min read",
      categoryColor: "bg-blue-100 text-blue-600",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjQ9pOojs1lIjHSdtFYj_YBxb3II0DBI5ZJdZmUjATLzdN-5Gmc3YYoCtQItdNNo9mYOHG0uCgXOQB2ZSYM8pTyc05kM8Xf0SJlYvOf9ssUC2hHxlWfQsCFaW29BGDK4Tmikg9u2JlrGsOkdQnYsiA8jpqZr4dcI0WlAkZc0yzd9L3Le575S1C7PKMZGn3Iy1bziiTpA6mD_OWpu2VyYHSvODhvkiB7C3KB2Cc4yJaCD_7mmdJXfMEokuoL6piXEZ7sLDjGwq9MkQ",
    },
    {
      id: "3",
      category: "Fashion",
      title: "Styling Modern Traditional Wear",
      description: "Mixing contemporary silhouettes with classic fabrics.",
      readTime: "4 min read",
      categoryColor: "bg-purple-100 text-purple-600",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdB2PGxAQONC2RYcFKi3Fp50J_EpdsPR3uO67c0XBbMecLNL6tmPs4wvZfkjR4HdUMPDELShvGj7eQXEqSDdVDQLDI2oxYXQ3qdeYJXegdybdBbHxvdMi4cQRIUe7ZTiED9iCUAqoApg6uibnjRIYjifeTwnF92qM7wLjrULSnjAFqZSTo5m3n2b5rsMjYxT7XEXlGfDH-KGGLnBLzdkvHPfZyHqJ0PlWteFzPG1GorvwYlrJZIp-po1_i-mZI_xTgnLlWdjoLETE",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-surface-light border-b border-gray-100">
        <View className="flex-row items-center gap-3 flex-1">
          <View className="relative">
            <View className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-primary/20" style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDtl7IUwAI91iyDWykWrOtd9l0BBUbhhMy29F6orSVgFuBdztzvl6KZq4BMRao1fMnQcGC5DPVr9MfFyU-ObuXudfCML10ixySRdQ3xhQs8PwI18-aF53_ZEODz231aqzmJRtiY-ol3-hNzGpyiYIYPYaVQF1Mfl6Hv33vDFwbA4itR7rb7VbcXy_BOO5hh5NndyAtkJRHkjO6PP7CU2VNbKVqio9kVLTagelGQOsG_dNUHUEM2ks9eYdK6asH8ac23CUoDrfocMrs")'
            }} />
            <View className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface-light" />
          </View>
          <View className="flex-col">
            <Text className="text-xs font-medium text-secondary-content">Good Morning,</Text>
            <Text className="text-lg font-bold text-gray-900">Priya 👋</Text>
          </View>
        </View>
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100"
          onPress={() => router.push("/notifications" as RelativePathString)}
        >
          <Ionicons name="notifications" size={24} color="#181114" />
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
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdtvK-ixs8VqOnmkwjEz-w30IdLr_CJXv7u17AV3ZbVB1EsiUWMOciEmaP5f2ILsH4NUo9khfReP92XK9L-FDj2udqkEfjgreIC7L7I8Rxs5viUSKjF9hS4-OpccyKfJzPvZ7qMk3c5MOFL4jEt-PffcaxIrlshDCzyF25uk-8RGYZaygNjJh4pCg9XQaBflhrH5fM7NR1LD0KCdKfK07AWfWQPT_wFz_s-kn-bkkecpSzFKI8fkUMQFrk9_X1O-huqjjjFdeKOz8" }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/60 to-transparent" />
            </View>
            
            {/* Content */}
            <View className="relative z-10 p-6 gap-4">
              <View className="gap-1">
                <Text className="inline-flex items-center px-2 py-1 rounded bg-white/20 text-white text-xs font-semibold w-fit border border-white/10">
                  ✨ New Feature
                </Text>
                <Text className="text-white text-2xl font-bold max-w-[80%]">
                  Plan your dream celebration.
                </Text>
                <Text className="text-white/90 text-sm font-medium max-w-[90%]">
                  Start organizing your wedding or cultural event today with our new AI tools.
                </Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 rounded-xl h-10 px-5 bg-primary active:opacity-90"
                onPress={() => router.push("/create-event" as RelativePathString)}
              >
                <Ionicons name="add-circle" size={20} color="white" />
                <Text className="text-white text-sm font-semibold">Create New Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Horizontal Scroll: Events Attending */}
        <View className="py-4">
          <View className="flex-row items-center justify-between px-4 pb-3">
            <Text className="text-lg font-bold text-gray-900">Events You're Attending</Text>
            <TouchableOpacity onPress={() => router.push("/events")}>
              <Text className="text-primary text-sm font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}
            snapToInterval={296}
            decelerationRate="fast"
          >
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
            {/* Spacer for scroll padding */}
            <View className="w-1 shrink-0" />
          </ScrollView>
        </View>

        {/* Vertical List: Planning Tips */}
        <View className="pb-6">
          <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
            <Text className="text-lg font-bold text-gray-900">Planning Tips & Trends</Text>
            <TouchableOpacity onPress={() => router.push("/blog" as RelativePathString)}>
              <Text className="text-primary text-sm font-semibold">View Blog</Text>
            </TouchableOpacity>
          </View>
          <View className="px-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </View>
        </View>
        
        {/* Bottom padding for safe area */}
        <View className="h-24" />
      </ScrollView>

      {/* Bottom Navigation Bar */}
    
    </SafeAreaView>
  );
}
