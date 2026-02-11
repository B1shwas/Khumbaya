import { router, useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";

export default function EventSuccessRedirect() {
  const params = useGlobalSearchParams();

  useEffect(() => {
    // Redirect to events page with success parameter
    router.replace({
      pathname: "/(protected)/(client-tabs)/event" ,
      params: { success: "true" },
    }) ;
  }, []);

  return null;
}
