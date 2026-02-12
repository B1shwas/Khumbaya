export type VendorStatus = "booked" | "pending" | "available";

export type VendorTab = "all" | VendorStatus;

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  contact?: string;
  price?: string;
  rating?: number;
  imageUrl?: string;
}

export const VENDORS_DATA: Vendor[] = [
  {
    id: "1",
    name: "Floral Dreams Studio",
    category: "Florist",
    status: "booked",
    contact: "+91 98765 43210",
    price: "₹50,000",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
  },
  {
    id: "2",
    name: "Crown Catering",
    category: "Catering",
    status: "booked",
    contact: "+91 98765 43211",
    price: "₹1,500/plate",
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  },
  {
    id: "3",
    name: "Elite Photography",
    category: "Photography",
    status: "booked",
    contact: "+91 98765 43212",
    price: "₹75,000",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
  },
  {
    id: "4",
    name: "DJ Wave Sounds",
    category: "DJ/Music",
    status: "pending",
    contact: "+91 98765 43213",
    price: "₹25,000",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
  },
  {
    id: "5",
    name: "Royal Decorations",
    category: "Decoration",
    status: "pending",
    contact: "+91 98765 43214",
    price: "₹1,00,000",
    rating: 4.5,
    imageUrl:
      "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=800&q=80",
  },
  {
    id: "6",
    name: "Sweet Tooth Cakes",
    category: "Cake",
    status: "available",
    contact: "+91 98765 43215",
    price: "₹5,000",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
  },
];

export const TABS: VendorTab[] = ["all", "booked", "pending", "available"];

export interface VendorStats {
  booked: number;
  pending: number;
  available: number;
}

export const getVendorStats = (vendors: Vendor[]): VendorStats => ({
  booked: vendors.filter((v) => v.status === "booked").length,
  pending: vendors.filter((v) => v.status === "pending").length,
  available: vendors.filter((v) => v.status === "available").length,
});

export const filterVendors = (vendors: Vendor[], tab: VendorTab): Vendor[] => {
  if (tab === "all") return vendors;
  return vendors.filter((vendor) => vendor.status === tab);
};
