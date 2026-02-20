import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  documentType?: string;
};

// Default documents for demo
const DEFAULT_DOCUMENTS: VerificationDocument[] = [
  {
    id: "1",
    name: "Business License",
    status: "verified",
    uploadDate: "2024-01-15",
    documentType: "Business License",
  },
  {
    id: "2",
    name: "Tax Registration (EIN)",
    status: "pending",
    uploadDate: "2024-01-20",
    documentType: "Tax Document",
  },
];

// Required document types
const REQUIRED_DOCUMENTS = [
  { id: "1", label: "Business License", icon: "description" },
  { id: "2", label: "Tax Registration (EIN)", icon: "receipt" },
  { id: "3", label: "Insurance Certificate", icon: "security" },
  { id: "4", label: "ID Verification", icon: "badge" },
];

// Reusable Status Badge Component (DRY)
const StatusBadge = ({
  status,
}: {
  status: "pending" | "verified" | "rejected";
}) => {
  const config = {
    pending: {
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      icon: "pending" as const,
      label: "Pending",
    },
    verified: {
      color: "bg-green-100",
      textColor: "text-green-700",
      icon: "verified" as const,
      label: "Verified",
    },
    rejected: {
      color: "bg-red-100",
      textColor: "text-red-700",
      icon: "cancel" as const,
      label: "Rejected",
    },
  };

  const { color, textColor, icon, label } = config[status];

  return (
    <View
      className={`flex-row items-center gap-1 px-2 py-1 rounded-full ${color}`}
    >
      <MaterialIcons
        name={icon}
        size={12}
        color={
          textColor === "text-yellow-700"
            ? "#b45309"
            : textColor === "text-green-700"
              ? "#15803d"
              : "#b91c1c"
        }
      />
      <Text
        className={`text-[10px] font-bold ${textColor} uppercase tracking-wider`}
      >
        {label}
      </Text>
    </View>
  );
};

// Reusable Card Component (DRY)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <View
    className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </View>
);

// Reusable Section Header (DRY)
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View className="mb-4">
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
    {subtitle && <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>}
  </View>
);

// Document Card (DRY)
const DocumentCard = ({
  document,
  onDelete,
  onView,
}: {
  document: VerificationDocument;
  onDelete: () => void;
  onView?: () => void;
}) => (
  <Card className="mb-4 relative">
    <View className="flex-row justify-between items-start mb-3">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="font-bold text-gray-900 text-lg">
            {document.name}
          </Text>
          <StatusBadge status={document.status} />
        </View>
        <Text className="text-gray-500 text-sm">
          Uploaded: {document.uploadDate}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={onDelete}
          className="p-2 bg-red-50 rounded-full"
        >
          <MaterialIcons name="delete" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>

    {onView && (
      <TouchableOpacity
        onPress={onView}
        className="mt-2 px-4 py-2 bg-gray-50 rounded-lg flex-row items-center gap-2"
      >
        <MaterialIcons name="visibility" size={16} color="#ee2b8c" />
        <Text className="text-sm font-medium text-pink-600">View Document</Text>
      </TouchableOpacity>
    )}
  </Card>
);

// Empty State (DRY)
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <View className="items-center py-12">
    <View className="w-20 h-20 bg-pink-50 rounded-full items-center justify-center mb-4">
      <MaterialIcons name="upload-file" size={40} color="#ee2b8c" />
    </View>
    <Text className="text-lg font-semibold text-gray-900 mb-2">
      No Documents
    </Text>
    <Text className="text-gray-500 text-center mb-6 px-8">
      Upload your business documents to get verified and start accepting
      bookings.
    </Text>
    <TouchableOpacity
      onPress={onAdd}
      className="bg-pink-500 px-6 py-3 rounded-xl flex-row items-center gap-2"
      activeOpacity={0.9}
    >
      <MaterialIcons name="cloud-upload" size={20} color="#ffffff" />
      <Text className="text-white font-semibold">Upload Document</Text>
    </TouchableOpacity>
  </View>
);

export default function VendorVerificationScreen() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Load data from local storage
  useEffect(() => {
    loadVerificationData();
  }, []);

  const loadVerificationData = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATION);
      if (storedData) {
        const data = JSON.parse(storedData);
        setDocuments(data.documents || []);
        setIsVerified(data.isVerified || false);
      } else {
        setDocuments(DEFAULT_DOCUMENTS);
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Error loading verification data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveVerificationData = async () => {
    try {
      setIsLoading(true);
      const data = {
        documents,
        isVerified,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.VERIFICATION,
        JSON.stringify(data),
      );
      router.back();
    } catch (error) {
      console.error("Error saving verification data:", error);
      Alert.alert(
        "Error",
        "Failed to save verification data. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = () => {
    // TODO: Implement document picker functionality
    // For now, we'll add a placeholder document
    const newDocument: VerificationDocument = {
      id: Date.now().toString(),
      name: "New Document",
      status: "pending",
      uploadDate: new Date().toISOString().split("T")[0],
      documentType: "Other",
    };
    setDocuments([...documents, newDocument]);
  };

  const handleDeleteDocument = (id: string) => {
    Alert.alert(
      "Delete Document",
      "Are you sure you want to remove this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setDocuments(documents.filter((doc) => doc.id !== id)),
        },
      ],
    );
  };

  const handleViewDocument = (document: VerificationDocument) => {
    Alert.alert(
      document.name,
      `Status: ${document.status}\nUploaded: ${document.uploadDate}\n\nDocument viewer would open here.`,
      [{ text: "OK" }],
    );
  };

  const handleToggleVerification = () => {
    Alert.alert(
      isVerified ? "Remove Verification" : "Mark as Verified",
      isVerified
        ? "Are you sure you want to remove your verified status?"
        : "This will mark your business as verified. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: isVerified ? "Remove" : "Verify",
          onPress: () => setIsVerified(!isVerified),
        },
      ],
    );
  };

  // Count verified documents
  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const pendingCount = documents.filter((d) => d.status === "pending").length;

  return (
    <View className="flex-1 bg-gray-50">
      <SafeAreaView className="flex-1">
        {/* Professional Top App Bar */}
        <View className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between px-4 py-4">
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
              accessibilityRole="button"
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back-ios-new"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-gray-900">
                Verification
              </Text>
              <Text className="text-xs text-gray-500">
                {verifiedCount} verified, {pendingCount} pending
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center rounded-full bg-pink-50"
              accessibilityRole="button"
              onPress={saveVerificationData}
              disabled={isLoading}
            >
              <MaterialIcons
                name={isLoading ? "hourglass-empty" : "check"}
                size={20}
                color="#ee2b8c"
              />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-4 pt-6 pb-20"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Vendor Verification
              </Text>
              <Text className="text-base text-gray-600 leading-relaxed">
                Upload your business documents to get verified and build trust
                with potential clients.
              </Text>
            </View>

            {/* Verification Status Card */}
            <Card className="mb-6 border-2 border-pink-100">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-900">
                  Verification Status
                </Text>
                <StatusBadge status={isVerified ? "verified" : "pending"} />
              </View>

              <View className="bg-gray-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 text-sm">Documents</Text>
                  <Text className="font-semibold text-gray-900">
                    {documents.length} uploaded
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-600 text-sm">Verified</Text>
                  <Text className="font-semibold text-green-600">
                    {verifiedCount}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600 text-sm">Pending Review</Text>
                  <Text className="font-semibold text-yellow-600">
                    {pendingCount}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                {isVerified
                  ? "🎉 Your business is verified! Clients can see your verified badge."
                  : "Complete your verification to start accepting bookings and build trust with clients."}
              </Text>

              <TouchableOpacity
                onPress={handleToggleVerification}
                className={`w-full h-12 rounded-xl flex-row items-center justify-center gap-2 ${
                  isVerified
                    ? "bg-gray-100 border border-gray-300"
                    : "bg-pink-500 shadow-lg shadow-pink-200"
                }`}
                activeOpacity={0.9}
              >
                <MaterialIcons
                  name={isVerified ? "remove-circle-outline" : "verified-user"}
                  size={20}
                  color={isVerified ? "#6b7280" : "#ffffff"}
                />
                <Text
                  className={`font-bold ${isVerified ? "text-gray-600" : "text-white"}`}
                >
                  {isVerified ? "Remove Verification" : "Mark as Verified"}
                </Text>
              </TouchableOpacity>
            </Card>

            {/* Required Documents */}
            <Card className="mb-6">
              <SectionHeader
                title="Required Documents"
                subtitle="Upload these documents to get verified"
              />

              <View className="gap-3">
                {REQUIRED_DOCUMENTS.map((doc) => {
                  const uploadedDoc = documents.find(
                    (d) => d.documentType === doc.label,
                  );
                  return (
                    <View
                      key={doc.id}
                      className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
                          <MaterialIcons
                            name={doc.icon as any}
                            size={20}
                            color="#ee2b8c"
                          />
                        </View>
                        <Text className="font-medium text-gray-800">
                          {doc.label}
                        </Text>
                      </View>
                      {uploadedDoc ? (
                        <StatusBadge status={uploadedDoc.status} />
                      ) : (
                        <Text className="text-gray-400 text-sm">Required</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </Card>

            {/* Upload Document Button */}
            <TouchableOpacity
              onPress={handleUploadDocument}
              className="w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center gap-2 mb-6 shadow-lg shadow-pink-200"
              activeOpacity={0.9}
            >
              <MaterialIcons name="cloud-upload" size={20} color="#ffffff" />
              <Text className="text-white font-bold text-lg">
                Upload Document
              </Text>
            </TouchableOpacity>

            {/* Documents List */}
            {documents.length === 0 ? (
              <EmptyState onAdd={handleUploadDocument} />
            ) : (
              <>
                <SectionHeader
                  title={`Uploaded Documents (${documents.length})`}
                  subtitle="Manage your verification documents"
                />

                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={() => handleDeleteDocument(doc.id)}
                    onView={() => handleViewDocument(doc)}
                  />
                ))}
              </>
            )}

            {/* Tips Card */}
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-6">
              <View className="flex-row items-start gap-3">
                <MaterialIcons name="info" size={24} color="#3b82f6" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-blue-800 mb-1">
                    Why Get Verified?
                  </Text>
                  <Text className="text-xs text-blue-700 leading-relaxed">
                    • Build trust with potential clients{"\n"}• Get a verified
                    badge on your profile{"\n"}• Increase your chances of
                    getting booked{"\n"}• Appear higher in search results
                  </Text>
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={saveVerificationData}
              disabled={isLoading}
              className={`w-full h-14 bg-pink-500 rounded-xl flex-row items-center justify-center shadow-lg shadow-pink-200 mt-6 
                ${isLoading ? "opacity-70" : ""}`}
              activeOpacity={0.9}
            >
              <MaterialIcons
                name="save"
                size={20}
                color="#ffffff"
                className="mr-2"
              />
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
