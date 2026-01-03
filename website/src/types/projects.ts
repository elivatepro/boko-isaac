export type TeamMember = {
  name: string;
  role?: string;
  avatar?: string;
  linkedIn?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  images: string[];
  publishedAt: string;
  link?: string;
  team: TeamMember[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProjectPayload = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  images: string[];
  publishedAt: string;
  link?: string;
  team?: TeamMember[];
  image?: string;
};
