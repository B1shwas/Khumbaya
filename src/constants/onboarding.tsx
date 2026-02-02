import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export const roles = [
  {
    icon: <FontAwesome name="user" size={26} color="#8B5CF6" />,
    title: "User",
    subtitle: "Browse & Book Amazing Events",
    bgColor: "#F5F3FF",
    iconBg: "#EDE9FE",
  },
  {
    icon: <FontAwesome5 name="eye" size={24} color="#14B8A6" />,
    title: "Guest",
    subtitle: "Explore Vendors Without Login",
    bgColor: "#F0FDFA",
    iconBg: "#CCFBF1",
  },
  {
    icon: <MaterialIcons name="storefront" size={26} color="#F43F5E" />,
    title: "Vendor",
    subtitle: "Grow Your Business With Us",
    bgColor: "#FFF1F2",
    iconBg: "#FFE4E6",
  },
];

export const features = [
  {
    icon: <FontAwesome name="search" size={18} color="white" />,
    text: "Find Vendors",
    color: "#8B5CF6",
  },
  {
    icon: <FontAwesome5 name="calendar-check" size={16} color="white" />,
    text: "Plan Events",
    color: "#14B8A6",
  },
  {
    icon: <FontAwesome name="star" size={18} color="white" />,
    text: "Read Reviews",
    color: "#F43F5E",
  },
];
