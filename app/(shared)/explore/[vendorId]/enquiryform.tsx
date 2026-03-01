import BookingReqModal from "@/src/screen/vendor/BookingReq";
import { useLocalSearchParams } from "expo-router";

export default function EnquiryFormScreen() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();

  // When used as a route with transparentModal, set asRoute=true to skip Modal wrapper
  return <BookingReqModal visible={true} asRoute={true} />;
}
