import { Text } from "@/src/components/ui/Text";
import { useAuth } from "@/src/store/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Complete from "./Complete";
import Letstart from "./Letstart";
import Personalize from "./Personalize";

type SignupFormData = {
	fullName: string;
	email: string;
	phone: string;
	password: string;
	city: string;
	country: string;
	foodPreference: string;
	bio: string;
};

const TOTAL_STEPS = 3;
const STEP_LABELS = ["Lets", "Com", "Personal"];

export default function UserSignupFlow() {
	const router = useRouter();
	const { login } = useAuth();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<SignupFormData>({
		fullName: "",
		email: "",
		phone: "",
		password: "",
		city: "",
		country: "",
		foodPreference: "",
		bio: "",
	});

	const updateFormData = (updates: Partial<SignupFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const handleBack = () => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
			return;
		}
		router.back();
	};

	const handleNext = () => {
		setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
	};

	const handleFinish = () => {
		login({
			id: `client-${Date.now()}`,
			email: formData.email || "demo@khumbaya.app",
			name: formData.fullName || "Demo Client",
			role: "client",
		});
	};

	const stepContent = {
		1: (
			<Letstart
				data={{
					fullName: formData.fullName,
					email: formData.email,
					phone: formData.phone,
					password: formData.password,
				}}
				onChange={updateFormData}
				onNext={handleNext}
			/>
		),
		2: (
			<Complete
				data={{
					city: formData.city,
					country: formData.country,
					foodPreference: formData.foodPreference,
					bio: formData.bio,
				}}
				onChange={updateFormData}
				onNext={handleNext}
			/>
		),
		3: <Personalize onFinish={handleFinish} />,
	} as const;

	return (
		<SafeAreaView className="flex-1 bg-background-light">
			<View className="px-4 pt-2">
				<View className="flex-row items-center justify-between pb-2">
					<TouchableOpacity
						onPress={handleBack}
						accessibilityRole="button"
						className="h-10 w-10 items-center justify-center"
					>
						<MaterialIcons name="arrow-back-ios-new" size={22} color="#181114" />
					</TouchableOpacity>
					<Text className="text-lg font-jakarta-bold text-text-light flex-1 text-center pr-10">
						Sign Up
					</Text>
				</View>

				<View className="flex-row items-center gap-3 py-4">
					{Array.from({ length: TOTAL_STEPS }).map((_, index) => {
						const stepIndex = index + 1;
						const isActive = stepIndex <= currentStep;
						return (
							<View
								key={`progress-${stepIndex}`}
								className={`h-1.5 flex-1 rounded-full ${
									isActive ? "bg-primary" : "bg-border"
								}`}
							/>
						);
					})}
				</View>

				<View className="flex-row justify-between pb-2">
					{STEP_LABELS.map((label, index) => {
						const stepIndex = index + 1;
						const isCurrent = stepIndex === currentStep;
						return (
							<Text
								key={`label-${label}`}
								className={isCurrent ? "text-primary text-xs font-jakarta-bold" : "text-xs text-muted-light"}
							>
								{stepIndex}: {label}
							</Text>
						);
					})}
				</View>
			</View>

			<View className="flex-1">{stepContent[currentStep as keyof typeof stepContent]}</View>
		</SafeAreaView>
	);
}
