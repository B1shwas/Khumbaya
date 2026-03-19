import { MaterialIcons } from "@expo/vector-icons";
import { Animated, ImageBackground, View } from "react-native";
const HERO_IMAGE = {
  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCN-FEoQhxG6lP-FQVMe1qUei4T3CxXoHkTHsDyNDxSO_IFRDxGIht5dykZ-3DWt2lTQjhV-KLi5ZFosSjyhDNvvSjWAIJ-Rj_-DCV0Lay0B3xe5CiGhhud3kOCrq8ldLXDGfXq9m4ugIBdM8hiHIJkvBfNupxmLg2F9QRVLPclUHCdercJ4mxzdCGPNtzNhEPNcp2BAWODZQu6lJ7We5CmVKBxfHnDhgj8LVVuHJ2dznCSaFIKkzlmhXCI2q2ANN9IH7wGVenBmGA",
};

import { useEffect, useRef } from "react";


export const LoginHero = () => {
      const pulse = useRef(new Animated.Value(1)).current;
      useEffect(() => {
        const anim = Animated.loop(
          Animated.sequence([
            Animated.timing(pulse, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
          ])
        );
        anim.start();
        return () => anim.stop();
      }, [pulse]);
    
  return (
    <View className="h-[30vh] w-full overflow-hidden rounded-b-xl">
      <ImageBackground
        source={HERO_IMAGE}
        className="w-full h-[30vh]"
        resizeMode="cover"
      />
            <View className="absolute bottom-6 left-0 right-0 items-center">
              <Animated.View
                style={{ transform: [{ scale: pulse }] }}
                className="rounded-full border border-yellow-200/60 bg-white/90 p-3"
              >
                <MaterialIcons name="favorite" size={28} color="#ee2b8c" />
              </Animated.View>
            </View>
          </View>
)}