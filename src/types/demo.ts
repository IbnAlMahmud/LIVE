export interface DemoCaseStudy {
  concept?: string;
  challenge?: string;
  experience?: string;
  keyFeatures?: string[];
  designDirection?: string;
  result?: string;
}

export interface DemoItem {
  id: string;
  name: string;
  title: string; // compatibility alias
  slug: string;
  category: string;
  industry: string;
  type?: string;
  languages?: string[];

  shortDescription: string;
  description: string;

  thumbnail: string;
  heroImage?: string;

  desktopPreview: string;
  tabletPreview?: string;
  mobilePreview?: string;

  galleryImages?: string[];
  previewVideo?: string;

  liveUrl: string;
  url?: string; // compatibility alias
  caseStudyUrl?: string;

  technologies: string[];
  features: string[];

  caseStudy?: DemoCaseStudy;

  featured: boolean;
  published: boolean;
  sortOrder: number;

  createdAt: string;
  updatedAt?: string;
}
