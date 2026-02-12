import { useMemo, useState } from "react";
import {
    filterVendors,
    getVendorStats,
    TABS,
    VENDORS_DATA,
    VendorTab,
    type Vendor,
    type VendorStats,
} from "../types/vendors";

export const useVendors = () => {
  const [activeTab, setActiveTab] = useState<VendorTab>("all");
  const vendors: Vendor[] = VENDORS_DATA;

  const filteredVendors = useMemo(
    () => filterVendors(vendors, activeTab),
    [vendors, activeTab],
  );

  const stats: VendorStats = useMemo(() => getVendorStats(vendors), [vendors]);

  const tabs = TABS;

  return {
    vendors,
    filteredVendors,
    stats,
    tabs,
    activeTab,
    setActiveTab,
  };
};
