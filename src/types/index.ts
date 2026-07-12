// src/types/index.ts
// Shared TypeScript types — used on both client & server (forms, API responses, React Query hooks)

export type PackageCategory = "Beach" | "Hill" | "Adventure" | "Cultural";

export type BookingStatus = "pending" | "paid" | "failed";

export interface ISpecifications {
  included: string[];
  excluded: string[];
  itinerary: string[]; // day-wise plan, e.g. ["Day 1: Arrival & city tour", "Day 2: Beach day"]
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

export interface IPackage {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // BDT
  location: string;
  departureDate: string;
  duration: string;
  category: PackageCategory;
  images: string[]; // Cloudinary secure URLs
  specifications: ISpecifications;
  ownerId: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBooking {
  _id: string;
  packageId: string;
  userId: string;
  amount: number;
  stripePaymentId: string;
  status: BookingStatus;
  createdAt: string;
}

export interface IReview {
  _id: string;
  packageId: string;
  userId: string;
  userName: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

// Generic API response wrapper used across all routes
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Shape returned by GET /api/packages (paginated list)
export interface PaginatedPackages {
  packages: IPackage[];
  total: number;
  page: number;
  totalPages: number;
}

// Query params accepted by GET /api/packages
export interface PackageQueryParams {
  search?: string;
  category?: PackageCategory;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "rating";
  page?: number;
  limit?: number;
}
