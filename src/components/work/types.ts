export interface WorkProject {
  id: string;
  title: string;
  slug?: string;
  description: string;
  thumbnail: string;
  desktopPreview?: string;
  category: string;
  industry?: string;
  featured?: boolean;
  published?: boolean;
  createdAt?: string;
  liveUrl?: string;
  services?: string[];
  year?: string;
}
