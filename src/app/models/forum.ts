export interface Forum {
  forum_id: number;
  title: string;
  description: string;
  image: string | null; // Image path (can be null)
  creationDate: Date;
}