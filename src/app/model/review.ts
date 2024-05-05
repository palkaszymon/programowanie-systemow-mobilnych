export interface Review {
  reviewId?: string;
  restaurant: string;
  authorId: string;
  authorName: string;
  rating: number;
  review: string;
  reviewPhoto: string | null;
}
