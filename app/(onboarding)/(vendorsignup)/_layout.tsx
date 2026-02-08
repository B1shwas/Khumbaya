import { Stack } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
const steps = ["contacts", "tellus", "category", "buisnessdetail", "makeofficial", "review"];
export default function VendorSignupLayout() {
     const formMethods = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: "US +1",
      phone: "",
      password: "",
      businessType: "",
      selectedCategories: [],
      docType: "government",
      uploadedFile: null,
    },
    mode: "onChange",
  });

  return (
     <FormProvider
     {...formMethods}
     >
     <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="index" />
     </Stack>
     </FormProvider>
   
  );
}


