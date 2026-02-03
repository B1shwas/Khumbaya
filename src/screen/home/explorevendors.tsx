import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
	Image,
	ImageBackground,
	Pressable,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	View,
} from 'react-native';

// Vendor data type
interface Vendor {
  id: number;
  category: string;
  name: string;
  tagline: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  isFavorite: boolean;
}

// Sample vendor data
const vendorsData: Vendor[] = [
  {
    id: 1,
    category: 'Planner',
    name: 'Luxe Event Planning',
    tagline: 'Turning dreams into reality, one detail at a time.',
    rating: 4.9,
    reviews: 120,
    location: 'Hotel Muktinath , Chitwan',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCN1fxAg3zXm-Z_BV-AkWIgvNiPROQ24erQPRgQH9zfvsYJ0IhXUfJc4WlZae5RGHPsfNv9uC-mxSHdofNa-WWoZ5BbdE3ukPK6dKkcSWaWAxnuSSjEatPZIAc3-CQt2jN0VTsa3A0ma5iw2tT3iVfm2DlwIz6hGPGQzHADzUU2CpOJVEHpH4qMYjgAXVDI5AWgYjvs45UfT6Q0qBCeuCvOnHBH0G7LlOCdlmgmhYo5YdKDqGWQTgByotf4QuU01zKEJYriintCQQ',
    isFavorite: true,
  },
  {
    id: 2,
    category: 'Catering',
    name: 'Elegant Eats Catering',
    tagline: 'Gourmet experiences for your special day.',
    rating: 4.8,
    reviews: 85,
    location: 'Malla Hotel, Thamel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTv1T_gKqv5DF2AzbUEJKHXFRvFFwcBHpNrlHm_Yj0UJc77X7SQDCpgLphLBP1badFSYyOVypFwPGdLdwpt_Wpy-H3pjcNoJaZ_A7qkEtasDwXP-TDJbnqbptMSTTPXMeCl1f-hzyLFK-G6X7rkSnU3IUChFz4bKVL6a2JL1qIlv-SKi_nCBSk-5evm1x7edcHlhkEvFJSujVGpwPCuio-qINTJocgfdh0w1GZ4gMWovxqlqhZYrLYkPq0LMyUV7MwyuYfEsaluQ',
    isFavorite: false,
  },
  {
    id: 3,
    category: 'Decorator',
    name: 'Blooming Tales',
    tagline: 'Floral designs that speak the language of love.',
    rating: 5.0,
    reviews: 42,
    location: 'Khumbaya, kathmandu',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTYEG96FXzSdLvRDGXrS38k0sj-vZYUAGvjuE5Llmyh0wZjvVr1tOzKPFGugJJ7RYbWlU6s3qpvHLgGb6MdnTnvHRaqtQndAE33eNAJt42nf8vf_QU-s0BLSmNaev_q4HmYGQphEPCsX8yVv2d5QopTsMvkifx-feSjpdx8w6cTJSH76Fv_rmoyOcBfRik0wvdJS3YmoZ1Bxtvlku0z033_nvFEEjpHS-fwbsL0IPExYuqmfXqlkycSRVGXt928zn6HKGRooMe8Q',
    isFavorite: false,
  },
];

const categories = ['All', 'Planner', 'Decorator', 'Catering', 'Venue', 'Music'];

export default function ExploreVendors() {
	//TODO: Use the zustand to do the state management in 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState(vendorsData);

  const toggleFavorite = (id: number) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, isFavorite: !v.isFavorite } : v));
  };

  return (
    <View className="flex-1 bg-[#22101f]">
      <StatusBar barStyle="light-content" />
      
      {/* Header Section */}
      <View className="bg-[#22101f] pb-2">
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-4 pt-12 pb-2">
          <View className="flex-row items-center gap-3">
            <Pressable className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE82wNXBs5awsz20ni9eoHCivpeKSKpfenRNxJmFZhNGTeSiJ9iZNWisGZ7eWPvH52mfWLZDItrabtDjEXxemhQoLInjpDVmg9FPM1QOY86lMGwtZPKg9Uxix_O2LnaMErRU-WYDesTe6CUwjHB1Hn1wy4BYl9ufRlGhHERaTVu_ayoQF_yQ30RXbbmj-p1tqqqwflt-o3YiPYXRy1eVb37LLkjt6qH0yB-49SjH5NNOKlgYy7X36SG91IA7THB5aSqGzqb389ig' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Pressable>
            <View>
              <Text className="text-xs text-white/60 font-medium">Welcome back,</Text>
              <Text className="text-white text-lg font-bold tracking-tight">Find Your Vendor</Text>
            </View>
          </View>
          <Pressable className="p-2 rounded-full active:bg-white/5">
            <MaterialIcons name="settings" size={24} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-2">
          <View className="flex-row items-center rounded-full bg-[#33192f]/80 h-12 border border-white/10 px-4">
            <MaterialIcons name="search" size={24} color="#ee2bcd70" />
            <TextInput
              className="flex-1 text-base ml-2"
              style={{ color: '#ffffff' }}
              placeholder="Search for photographers, florists..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              selectionColor="#ee2bcd"
            />
          </View>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-2"
          contentContainerStyle={{ gap: 12 }}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`h-9 px-5 rounded-full items-center justify-center ${
                selectedCategory === category
                  ? 'bg-[#ee2bcd]'
                  : 'bg-[#33192f] border border-white/10'
              }`}
              style={selectedCategory === category ? { 
                shadowColor: '#ee2bcd',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
              } : {}}
            >
              <Text className={`text-sm ${
                selectedCategory === category ? 'font-semibold text-white' : 'font-medium text-white/80'
              }`}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 px-4 pt-2" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Section Title */}
        <View className="flex-row justify-between items-end pt-2 mb-5">
          <Text className="text-white font-bold text-lg">Featured Vendors</Text>
          <Pressable>
            <Text className="text-[#ee2bcd] text-sm font-medium">See All</Text>
          </Pressable>
        </View>

        {/* Vendor Cards */}
        {vendors.map((vendor) => (
          <View key={vendor.id} className="mb-5">
            <View className="rounded-xl bg-[#33192f] overflow-hidden border border-white/5">
              {/* Image Section */}
              <View className="relative h-48">
                <ImageBackground
                  source={{ uri: vendor.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                >
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', '#33192f99']}
                    className="absolute inset-0"
                  />
                  
                  {/* Favorite Button */}
                  <Pressable
                    onPress={() => toggleFavorite(vendor.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/40"
                  >
                    <MaterialIcons
                      name={vendor.isFavorite ? 'favorite' : 'favorite-border'}
                      size={20}
                      color={vendor.isFavorite ? '#ee2bcd' : 'white'}
                    />
                  </Pressable>

                  {/* Rating Badge */}
                  <View className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 rounded-md flex-row items-center gap-1">
                    <MaterialIcons name="star" size={14} color="#ee2bcd" />
                    <Text className="text-white text-xs font-bold">{vendor.rating}</Text>
                    <Text className="text-white/60 text-[10px]">({vendor.reviews})</Text>
                  </View>
                </ImageBackground>
              </View>

              {/* Content Section */}
              <View className="p-4">
                <Text className="text-[#ee2bcd] text-xs font-semibold uppercase tracking-wider mb-1">
                  {vendor.category}
                </Text>
                <Text className="text-white text-lg font-bold">{vendor.name}</Text>
                <Text className="text-white/60 text-sm italic mt-1" numberOfLines={2}>
                  "{vendor.tagline}"
                </Text>

                {/* Footer */}
                <View className="flex-row items-center justify-between border-t border-white/5 pt-3 mt-3">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="location-on" size={14} color="rgba(255,255,255,0.4)" />
                    <Text className="text-white/40 text-xs">{vendor.location}</Text>
                  </View>
                  <Pressable className="bg-white/10 px-3 py-1.5 rounded-md active:bg-[#ee2bcd]">
                    <Text className="text-xs font-bold text-white">View Profile</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      {/* <View className="absolute bottom-0 left-0 right-0 bg-[#22101f]/95 border-t border-white/5 pb-5 pt-3 px-6">
        <View className="flex-row justify-between items-center max-w-md mx-auto">
          <Pressable className="items-center w-16">
            <MaterialIcons name="event" size={24} color="rgba(255,255,255,0.5)" />
            <Text className="text-[10px] font-medium text-white/50 mt-1">Events</Text>
          </Pressable>
          
          <Pressable className="items-center w-16">
            <View className="relative">
              <MaterialIcons name="explore" size={24} color="#ee2bcd" />
              <View className="absolute -top-1 -right-1 w-2 h-2 bg-[#ee2bcd] rounded-full" />
            </View>
            <Text className="text-[10px] font-bold text-[#ee2bcd] mt-1">Explore</Text>
          </Pressable>
          
          <Pressable className="items-center w-16">
            <MaterialIcons name="notifications" size={24} color="rgba(255,255,255,0.5)" />
            <Text className="text-[10px] font-medium text-white/50 mt-1">Alerts</Text>
          </Pressable>
          
          <Pressable className="items-center w-16">
            <MaterialIcons name="person" size={24} color="rgba(255,255,255,0.5)" />
            <Text className="text-[10px] font-medium text-white/50 mt-1">Profile</Text>
          </Pressable>
        </View>
      </View> */}
    </View>
  );
}
