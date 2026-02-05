import { Text } from "@/src/components/ui/Text";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

type DocumentType = "government" | "business";

type MakeOfficialProps = {
  onBack: () => void;
  onNext: () => void;
};

export default function MakeOfficial({ onBack, onNext }: MakeOfficialProps) {
  const [docType, setDocType] = useState<DocumentType>("government");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
  } | null>(null);

  const handleFilePick = () => {
    // TODO: Implement with expo-image-picker or expo-document-picker once installed
    // For now, simulating file pick with a mock file
    Alert.alert(
      "File Upload",
      "File picker will be implemented once expo-document-picker is installed.",
      [
        {
          text: "Add Mock File",
          onPress: () => {
            setUploadedFile({
              name: `${docType === "government" ? "government_id" : "business_license"}.pdf`,
              size: 2.5,
            });
          },
        },
        { text: "Cancel" },
      ]
    );
  };

  const handleSubmit = () => {
    if (!uploadedFile) {
      Alert.alert("Missing Document", "Please upload a document first");
      return;
    }
    onNext();
  };

  return (
    <View className="flex-1">
      
        {/* Content Scroll Area */}
        <ScrollView
          className="flex-1 p-6 "
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <View className="pt-4 pb-2">
            <Text className="text-[28px] font-bold leading-tight text-text-light dark:text-white">
              Let's make it official
            </Text>
          </View>

          {/* Body Text */}
          <View className="pb-6">
            <Text className="text-base font-normal leading-relaxed text-muted-light dark:text-muted-dark">
              To ensure the safety of our couples, we require proof of identity
              or business registration. Verified vendors get{" "}
              <Text className="font-bold text-primary">
                3x more bookings
              </Text>
              .
            </Text>
          </View>

          {/* Segmented Control */}
          <View className="pb-6">
            <View className="flex-row rounded-xl p-1 bg-gray-200 dark:bg-white/5">
              {/* Government ID */}
              <TouchableOpacity
                className="flex-1"
                onPress={() => setDocType("government")}
              >
                <View
                  className={`flex items-center justify-center py-2.5 px-3 rounded-lg ${
                    docType === "government"
                      ? "bg-white dark:bg-background-dark rounded-xl"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      docType === "government"
                        ? "text-primary"
                        : "text-muted-light dark:text-muted-dark"
                    }`}
                  >
                    Government ID
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Business License */}
              <TouchableOpacity
                className="flex-1"
                onPress={() => setDocType("business")}
              >
                <View
                  className={`flex items-center justify-center py-2.5 px-3 rounded-lg ${
                    docType === "business"
                      ? "bg-white dark:bg-background-dark rounded-xl"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      docType === "business"
                        ? "text-primary"
                        : "text-muted-light dark:text-muted-dark"
                    }`}
                  >
                    Business License
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Upload Area */}
          <View className="pb-4">
            <TouchableOpacity onPress={handleFilePick}>
              <View className="flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 py-14 bg-gray-100 dark:bg-white/5">
                {/* Cloud Icon */}
                <View className="h-14 w-14 mb-3 rounded-full flex items-center justify-center bg-pink-100 dark:bg-primary/20">
                  <MaterialIcons
                    name="cloud-upload"
                    size={28}
                    color="#ee2b8c"
                  />
                </View>

                <Text className="mb-1 text-sm font-semibold text-center text-text-light dark:text-white">
                  Tap to upload document
                </Text>
                <Text className="text-xs text-center px-6 text-muted-light dark:text-muted-dark">
                  SVG, PNG, JPG or PDF (max. 5MB)
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Uploaded File Display */}
          {uploadedFile && (
            <View className="pb-4 px-2">
              <View className="flex-row items-center justify-between p-3 rounded-xl bg-gray-100 dark:bg-white/5">
                <View className="flex-row items-center flex-1 gap-3">
                  <View className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                    <MaterialIcons
                      name="description"
                      size={20}
                      color="#4caf50"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-text-light dark:text-white">
                      {uploadedFile.name}
                    </Text>
                    <Text className="text-xs text-muted-light dark:text-muted-dark">
                      {uploadedFile.size.toFixed(1)} MB • Ready
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setUploadedFile(null)}>
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color="#896175"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Security Note */}
          <View className="px-2 py-2 flex-row items-center justify-center gap-2">
            <MaterialIcons name="lock" size={16} color="#896175" />
            <Text className="text-xs font-medium text-muted-light dark:text-muted-dark">
              Your data is encrypted and secure.
            </Text>
          </View>
        </ScrollView>

        {/* Fixed Footer Action */}
        <View className="absolute bottom-0 left-0 right-0  px-6">
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-row items-center justify-center gap-2 bg-primary rounded-xl py-4 px-6"
          >
            <Text className="text-white font-bold">Submit for Review</Text>
            <MaterialIcons name="check-circle" size={20} color="white" />
          </TouchableOpacity>
        </View>
    
    </View>
  );
}