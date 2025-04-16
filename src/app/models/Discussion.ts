export interface Discussion {
  discussion_id?: number; // Optional, depending on API
  title: string;
  description: string;
  numberOfLikes: number;
  publicationDate: string;
}