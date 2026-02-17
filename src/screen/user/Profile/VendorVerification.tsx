import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Storage keys for business profile
const STORAGE_KEYS = {
  BUSINESS_INFO: "business_info",
  SERVICES_PRICING: "services_pricing",
  PORTFOLIO: "portfolio",
  VERIFICATION: "vendor_verification",
};

type VerificationDocument = {
  id: string;
  name: string;
  status: "pending" | "verified" | "rejected";
  uploadDate: string;
};

export default function VendorVerificationScreen() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadVerificationData();
  }, []);

  const loadVerificationData = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATION);
      if (storedData) {
        const data = JSON.parse(storedData);
        setDocuments(data.documents || []);
        setIsVerified(data.isVerified || false);
      } else {
        // Default documents if no data exists
        setDocuments([
          {
            id: "1",
            name: "Business License",
            status: "pending",
            uploadDate: "2024-01-15",
          },
          {
            id: "2",
            name: "Tax Registration",
            status: "verified",
            uploadDate: "2024-01-15",
          },
        ]);
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Error loading verification data:", error);
    }
  };

  const saveVerificationData = async () => {
    try {
      const data = {
        documents,
        isVerified,
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.VERIFICATION,
        JSON.stringify(data),
      );

      // TODO: Backend integration
      // await api.post('/api/vendor-verification', data);

      router.back();
    } catch (error) {
      console.error("Error saving verification data:", error);
    }
  };

  const uploadDocument = () => {
    // TODO: Implement document upload functionality
    const newDocument: VerificationDocument = {
      id: Date.now().toString(),
      name: "New Document",
      status: "pending",
      uploadDate: new Date().toISOString().split("T")[0],
    };
    setDocuments([...documents, newDocument]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Top App Bar */}
        <View className="sticky top-0 z-10 flex-row items-center justify-between px-4 py-4 bg-white shadow-sm">
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={24}
              color="#0f172a"
            />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            Vendor Verification
          </Text>
          <TouchableOpacity
            className="size-10 items-center justify-center rounded-full"
            accessibilityRole="button"
            onPress={saveVerificationData}
          >
            <MaterialIcons name="check" size={24} color="#ee2b8c" />
          </TouchableOpacity>
        </View>

        {/* Verification Status */}
        <View className="bg-white px-4 py-6 mb-6 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Verification Status
            </Text>
            {isVerified ? (
              <View className="flex-row items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <MaterialIcons name="verified" size={14} color="#16a34a" />
                <Text className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                  Verified
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                <MaterialIcons name="pending" size={14} color="#d97706" />
                <Text className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">
                  Pending
                </Text>
              </View>
            )}
          </View>

          <Text className="text-gray-600 text-sm leading-relaxed mb-4">
            {isVerified
              ? "Your business is verified. You can start accepting bookings."
              : "Please complete all required verifications to start accepting bookings."}
          </Text>

          <TouchableOpacity
            className="w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2"
            activeOpacity={0.9}
            onPress={() => setIsVerified(!isVerified)}
          >
            <Text className="text-white font-bold text-lg">
              {isVerified ? "Unverify" : "Mark as Verified"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-4 pb-32"
          showsVerticalScrollIndicator={false}
        >
          {/* Add Button */}
          <TouchableOpacity
            className="w-full h-16 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2 mb-6 shadow-sm"
            activeOpacity={0.9}
            onPress={uploadDocument}
          >
            <MaterialIcons name="cloud-upload" size={20} color="#ffffff" />
            <Text className="text-white font-bold text-lg">
              Upload Document
            </Text>
          </TouchableOpacity>

          {/* Documents List */}
          <View className="gap-4">
            {documents.map((doc) => (
              <View
                key={doc.id}
                className="bg-white rounded-2xl p-4 shadow-sm relative"
              >
                <TouchableOpacity
                  className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
                  onPress={() => deleteDocument(doc.id)}
                >
                  <MaterialIcons name="delete" size={16} color="#ffffff" />
                </TouchableOpacity>

                <Text className="font-semibold text-gray-900 text-lg mb-2">
                  {doc.name}
                </Text>

                <View className="flex-row items-center gap-2 mb-2">
                  <Text
                    className={`text-sm font-medium ${getStatusColor(doc.status)}`}
                  >
                    {getStatusText(doc.status)}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    Uploaded: {doc.uploadDate}
                  </Text>
                </View>

                <TouchableOpacity
                  className="mt-3 px-4 py-2 bg-gray-50 rounded-lg"
                  onPress={() => {}}
                >
                  <Text className="text-sm font-medium text-pink-500">
                    View Document
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
