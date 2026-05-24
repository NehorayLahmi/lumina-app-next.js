export interface LandingPageData {
  id: string;
  city: string;
  profession: string;
  twilioNumber: string;
  mainTitle: string;
  subTitle: string;
  description: string;
  heroImage: string;
  profileImage?: string | null;
  galleryImages: string;
  proId: string;
  createdAt: string;
  updatedAt: string;
  pro: {
    firstName: string;
    lastName: string;
    name: string;
    phone: string;
    city: string;
    isActive: boolean;
  };
}
