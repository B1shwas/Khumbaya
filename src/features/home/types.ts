// Event Types
export interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
}

// Article Types
export interface ArticleCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  readTime: string;
  categoryColor: string;
}

// Venue Types
export interface VenueCardProps {
  id: string;
  name: string;
  location: string;
  capacity: string;
  price: string;
  rating: number;
  imageUrl: string;
  type: string;
}

// Hotel Types
export interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  imageUrl: string;
  amenities: string[];
}

// Vendor Types
export interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
}

// Couple Types
export interface CoupleCardProps {
  id: string;
  names: string;
  date: string;
  location: string;
  imageUrl: string;
  story: string;
}

// Quick Service Types
export interface QuickServiceButtonProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  route: string;
}
