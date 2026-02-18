export interface Business {
  id: string;
  businessName: string;
  bio: string;
  location: string;
  experience: string;
  website: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  twitter: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  jobsCompleted: number;
  totalEarnings: number;
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Stats {
  jobsCompleted: number;
  averageRating: number;
  reviewCount: number;
  totalEarnings: number;
}

export interface Operation {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}
