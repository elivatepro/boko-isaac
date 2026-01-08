export type BlogPost = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  image?: string;
  publishedAt: string;
  tag?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  displayOrder?: number;
};
