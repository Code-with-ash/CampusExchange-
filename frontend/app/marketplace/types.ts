export type ConditionType = "Like New" | "Good" | "Fair";

export type CategoryType =
  | "Engineering Tools"
  | "Books"
  | "Electronics"
  | "Hostel"
  | "Lab Equipment"
  | "Others";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  condition: ConditionType;
  category: CategoryType;
  branch?: string;
  sellerYear?: string;
  postedTime?: string;
  imageUrl: string;
  images?: string[];
  sellerName?: string;
  sellerAvatar?: string;
  description?: string;
  whatsappNumber?: string;
  location?: string;
  pickuplocation?: string;
  verified?: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // "All" or CategoryType
  selectedConditions: ConditionType[];
  priceRange: [number, number];
  sortBy: "featured" | "price-low" | "price-high" | "recent";
}
