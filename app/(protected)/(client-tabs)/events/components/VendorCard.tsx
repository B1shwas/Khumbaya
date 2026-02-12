import { Ionicons } from "@expo/vector-icons";
import { router, type RelativePathString } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/vendors.styles";
import type { Vendor } from "../types/vendors";

interface VendorCardProps {
  vendor: Vendor;
}

export const VendorCard = ({ vendor }: VendorCardProps) => {
  const handlePress = () => {
    router.push(`/events/vendors/${vendor.id}` as RelativePathString);
  };

  return (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.vendorImageContainer}>
        {vendor.imageUrl ? (
          <Image
            source={{ uri: vendor.imageUrl }}
            style={styles.vendorImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.vendorImagePlaceholder}>
            <Ionicons name="storefront" size={32} color="#9CA3AF" />
          </View>
        )}
        <View
          style={[
            styles.statusBadge,
            vendor.status === "booked" && styles.statusBooked,
            vendor.status === "pending" && styles.statusPending,
            vendor.status === "available" && styles.statusAvailable,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              vendor.status === "booked" && styles.statusTextBooked,
              vendor.status === "pending" && styles.statusTextPending,
              vendor.status === "available" && styles.statusTextAvailable,
            ]}
          >
            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{vendor.name}</Text>
        <Text style={styles.vendorCategory}>{vendor.category}</Text>

        <View style={styles.vendorMeta}>
          {vendor.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{vendor.rating}</Text>
            </View>
          )}
          {vendor.price && <Text style={styles.priceText}>{vendor.price}</Text>}
        </View>
      </View>

      <View style={styles.vendorAction}>
        {vendor.status === "available" ? (
          <TouchableOpacity style={styles.bookButton} onPress={handlePress}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.viewButton} onPress={handlePress}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
