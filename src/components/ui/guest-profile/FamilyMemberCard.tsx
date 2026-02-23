// FamilyMemberCard Component - Display individual family member

import {
    FamilyMember,
    FOOD_PREFERENCE_LABELS,
    RELATION_LABELS,
} from "@/src/types/guest";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (memberId: string) => void;
  onViewDetails?: (member: FamilyMember) => void;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
      <TouchableOpacity
        onPress={() => onViewDetails?.(member)}
        className="flex-row items-start justify-between"
      >
        <View className="flex-1">
          {/* Name and Relation */}
          <View className="flex-row items-center mb-2">
            <View className="w-10 h-10 rounded-full bg-pink-100 items-center justify-center mr-3">
              <MaterialIcons name="person" size={20} color="#db2777" />
            </View>
            <View>
              <Text className="text-base font-semibold text-gray-800">
                {member.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {RELATION_LABELS[member.relation]}
              </Text>
            </View>
          </View>

          {/* Details */}
          <View className="ml-13 pl-0 space-y-1">
            {member.phone && (
              <View className="flex-row items-center">
                <MaterialIcons name="phone" size={14} color="#9ca3af" />
                <Text className="text-sm text-gray-600 ml-2">
                  {member.phone}
                </Text>
              </View>
            )}
            {member.email && (
              <View className="flex-row items-center">
                <MaterialIcons name="email" size={14} color="#9ca3af" />
                <Text className="text-sm text-gray-600 ml-2">
                  {member.email}
                </Text>
              </View>
            )}
            <View className="flex-row items-center">
              <MaterialIcons name="restaurant" size={14} color="#9ca3af" />
              <Text className="text-sm text-gray-600 ml-2">
                {FOOD_PREFERENCE_LABELS[member.foodPreference]}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons
                name={member.isAdult ? "person" : "child-care"}
                size={14}
                color="#9ca3af"
              />
              <Text className="text-sm text-gray-600 ml-2">
                {member.isAdult ? "Adult" : "Child"}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row items-center">
          {onEdit && (
            <TouchableOpacity
              onPress={() => onEdit(member)}
              className="p-2 mr-1"
            >
              <MaterialIcons name="edit" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(member.id)}
              className="p-2"
            >
              <MaterialIcons name="delete" size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FamilyMemberCard;
