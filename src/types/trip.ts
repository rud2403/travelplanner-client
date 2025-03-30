export interface Trip {
  id: number;
  userId: number;
  destination: string;
  description: string;
  country: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}
