import { LoginFormData, loginSchema } from "@/src/schemas/auth";
import { FontAwesome5 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [signUpType, setSignUpType] = useState<"user" | "vendor" | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // TODO: Implement actual authentication logic
      console.log("Login data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Success", "Logged in successfully");
      router.replace("/" as any);
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const handleSignUp = (type: "user" | "vendor") => {
    if (type === "user") {
      router.push("/(auth)/user-signup" as any);
    } else {
      router.push("/(auth)/vendor-signup" as any);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mt-12 ml-6 active:opacity-70"
        >
          <FontAwesome5 name="arrow-left" size={18} color="#1F2937" />
        </Pressable>

        {/* Header */}
        <View className="items-center px-6 mt-8 mb-10">
          <View className="w-20 h-20 rounded-full items-center justify-center mb-4 bg-purple-100">
            <FontAwesome5 name="sign-in-alt" size={32} color="#8B5CF6" />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Sign in to your account
          </Text>
        </View>

        {/* Form */}
        <View className="px-6">
          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email Address <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View
                    className={`flex-row items-center border rounded-xl px-4 py-3 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <FontAwesome5
                      name="envelope"
                      size={16}
                      color="#9CA3AF"
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      className="flex-1 text-base text-gray-900"
                      placeholder="Enter your email"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                  {errors.email && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <View
                    className={`flex-row items-center border rounded-xl px-4 py-3 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <FontAwesome5
                      name="lock"
                      size={18}
                      color="#9CA3AF"
                      style={{ marginRight: 12 }}
                    />
                    <TextInput
                      className="flex-1 text-base text-gray-900"
                      placeholder="Enter your password"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      autoComplete="password"
                    />
                  </View>
                  {errors.password && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />
          </View>

          {/* Forgot Password */}
          <Pressable className="self-end mb-6">
            <Text className="text-sm font-medium text-purple-600">
              Forgot Password?
            </Text>
          </Pressable>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`rounded-xl py-4 items-center active:opacity-90 bg-purple-600 ${
              isSubmitting ? "opacity-50" : ""
            }`}
          >
            <Text className="text-white text-base font-bold">
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Text>
          </Pressable>

          {/* Sign Up Options */}
          <View className="mt-6">
            <Text className="text-center text-sm text-gray-600 mb-4">
              Don't have an account?
            </Text>

            {/* User Sign Up */}
            <Pressable
              onPress={() => handleSignUp("user")}
              className="mb-3 p-4 bg-purple-50 rounded-xl border border-purple-200 active:opacity-80"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                    <FontAwesome5 name="user" size={16} color="#8B5CF6" />
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-gray-900">
                      Sign Up as User
                    </Text>
                    <Text className="text-xs text-gray-600">
                      Browse and book events
                    </Text>
                  </View>
                </View>
                <FontAwesome5 name="arrow-right" size={14} color="#8B5CF6" />
              </View>
            </Pressable>

            {/* Vendor Sign Up */}
            <Pressable
              onPress={() => handleSignUp("vendor")}
              className="p-4 bg-rose-50 rounded-xl border border-rose-200 active:opacity-80"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center mr-3">
                    <FontAwesome5 name="store" size={16} color="#F43F5E" />
                  </View>
                  <View>
                    <Text className="text-base font-semibold text-gray-900">
                      Sign Up as Vendor
                    </Text>
                    <Text className="text-xs text-gray-600">
                      Grow your business
                    </Text>
                  </View>
                </View>
                <FontAwesome5 name="arrow-right" size={14} color="#F43F5E" />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
