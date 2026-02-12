import type {
    ArticleCardProps,
    CoupleCardProps,
    EventCardProps,
    HotelCardProps,
    QuickServiceButtonProps,
    VendorCardProps,
    VenueCardProps,
} from "../types";

export function useHomeData() {
  const events: EventCardProps[] = [
    {
      id: "1",
      title: "Rahul & Simran's Sangeet",
      date: "DEC 12",
      time: "7:00 PM",
      location: "Mumbai",
      imageUrl:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
    },
    {
      id: "2",
      title: "Annual Cultural Gala",
      date: "JAN 15",
      time: "6:00 PM",
      location: "New York",
      imageUrl:
        "https://images.unsplash.com/photo-1522673607200-1645062cd5d1?w=800&q=80",
    },
  ];

  const articles: ArticleCardProps[] = [
    {
      id: "1",
      category: "Decor",
      title: "Top 10 Floral Trends for 2024",
      description:
        "From cascading bouquets to sustainable centerpieces, here is what is trending.",
      readTime: "5 min read",
      categoryColor: "bg-primary/10 text-primary",
      imageUrl:
        "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    },
    {
      id: "2",
      category: "Finance",
      title: "Budgeting 101: Where to Splurge",
      description:
        "Expert advice on allocating your wedding funds effectively.",
      readTime: "8 min read",
      categoryColor: "bg-blue-100 text-blue-600",
      imageUrl:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    },
    {
      id: "3",
      category: "Fashion",
      title: "Styling Modern Traditional Wear",
      description: "Mixing contemporary silhouettes with classic fabrics.",
      readTime: "4 min read",
      categoryColor: "bg-purple-100 text-purple-600",
      imageUrl:
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    },
  ];

  const venues: VenueCardProps[] = [
    {
      id: "1",
      name: "Grand Ballroom Palace",
      location: "Downtown Mumbai",
      capacity: "500-1000 guests",
      price: "₹2L - ₹5L",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
      type: "Banquet Hall",
    },
    {
      id: "2",
      name: "Sunset Garden Venue",
      location: "Lonavala",
      capacity: "200-400 guests",
      price: "₹1.5L - ₹3L",
      rating: 4.6,
      imageUrl:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
      type: "Outdoor Garden",
    },
    {
      id: "3",
      name: "Royal Palace Resort",
      location: "Jaipur",
      capacity: "300-600 guests",
      price: "₹3L - ₹6L",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      type: "Palace",
    },
  ];

  const hotels: HotelCardProps[] = [
    {
      id: "1",
      name: "Taj Lands End",
      location: "Mumbai",
      distance: "2.5 km",
      price: "₹8,500",
      rating: 4.7,
      imageUrl:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      amenities: ["Pool", "Spa", "WiFi"],
    },
    {
      id: "2",
      name: "The Leela Palace",
      location: "New Delhi",
      distance: "5 km",
      price: "₹12,000",
      rating: 4.9,
      imageUrl:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      amenities: ["Pool", "Gym", "Restaurant"],
    },
    {
      id: "3",
      name: "Four Seasons Hotel",
      location: "Mumbai",
      distance: "3 km",
      price: "₹15,000",
      rating: 4.8,
      imageUrl:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
      amenities: ["Spa", "Pool", "Bar"],
    },
    {
      id: "4",
      name: "Hyatt Regency",
      location: "Bangalore",
      distance: "8 km",
      price: "₹9,500",
      rating: 4.5,
      imageUrl:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      amenities: ["Gym", "WiFi", "Parking"],
    },
  ];

  const vendors: VendorCardProps[] = [
    {
      id: "1",
      name: "Elite Photography",
      category: "Photography",
      rating: 4.9,
      reviews: 234,
      price: "₹50,000",
      imageUrl:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    },
    {
      id: "2",
      name: "Divine Caterers",
      category: "Catering",
      rating: 4.7,
      reviews: 189,
      price: "₹1,200/plate",
      imageUrl:
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
    },
    {
      id: "3",
      name: "Royal Decorations",
      category: "Decoration",
      rating: 4.8,
      reviews: 156,
      price: "₹2L onwards",
      imageUrl:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
    },
    {
      id: "4",
      name: "Melody Bands",
      category: "Music",
      rating: 4.6,
      reviews: 98,
      price: "₹75,000",
      imageUrl:
        "https://images.unsplash.com/photo-1421217336522-861978adda2c?w=800&q=80",
    },
    {
      id: "5",
      name: "Flawless Makeup",
      category: "Makeup",
      rating: 4.9,
      reviews: 312,
      price: "₹25,000",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
    },
    {
      id: "6",
      name: "Grand Wedding Cards",
      category: "Invitations",
      rating: 4.5,
      reviews: 67,
      price: "₹500/piece",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    },
  ];

  const couples: CoupleCardProps[] = [
    {
      id: "1",
      names: "Rahul & Priya",
      date: "Dec 15, 2024",
      location: "Jaipur",
      imageUrl:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      story: "Love blossomed at a coffee shop...",
    },
    {
      id: "2",
      names: "Amit & Neha",
      date: "Jan 20, 2025",
      location: "Udaipur",
      imageUrl:
        "https://images.unsplash.com/photo-1522673607200-1645062cd5d1?w=800&q=80",
      story: "College sweethearts finally tied the knot...",
    },
    {
      id: "3",
      names: "Vikram & Aditi",
      date: "Feb 14, 2025",
      location: "Goa",
      imageUrl:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80",
      story: "Destination wedding at the beach...",
    },
  ];

  const quickServices: QuickServiceButtonProps[] = [
    {
      id: "1",
      name: "Browse Vendors",
      icon: "storefront",
      color: "#ee2b8c",
      route: "/vendors",
    },
    {
      id: "2",
      name: "Event Checklist",
      icon: "checkbox",
      color: "#22c55e",
      route: "/checklist",
    },
    {
      id: "3",
      name: "Guest List",
      icon: "people",
      color: "#3b82f6",
      route: "/guests",
    },
    {
      id: "4",
      name: "Budget Planner",
      icon: "wallet",
      color: "#f59e0b",
      route: "/budget",
    },
    {
      id: "5",
      name: "Seating Chart",
      icon: "grid",
      color: "#8b5cf6",
      route: "/seating",
    },
    {
      id: "6",
      name: "Gift Registry",
      icon: "gift",
      color: "#ef4444",
      route: "/gifts",
    },
  ];

  return {
    events,
    articles,
    venues,
    hotels,
    vendors,
    couples,
    quickServices,
  };
}
