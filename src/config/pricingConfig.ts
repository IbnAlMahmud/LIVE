export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  pageCount: string;
  description: string;
  features: string[];
  ctaText: string;
  popular: boolean;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: "one-page",
    name: "ONE PAGE",
    price: "৳4,999",
    pageCount: "1 Page",
    description: "A professional single-page website for individuals, small businesses, campaigns, services, or simple business presence.",
    features: [
      "Custom modern UI/UX",
      "Responsive design",
      "Mobile optimization",
      "Contact / WhatsApp CTA",
      "Basic animations",
      "Basic SEO foundation"
    ],
    ctaText: "Get Started",
    popular: false
  },
  {
    id: "standard",
    name: "STANDARD",
    price: "৳7,999",
    pageCount: "4–5 Pages",
    description: "A complete professional business website with multiple important pages and a polished user experience.",
    features: [
      "4–5 custom pages",
      "Premium responsive UI/UX",
      "Mobile optimization",
      "Contact section",
      "WhatsApp integration",
      "Gallery / portfolio",
      "Google Maps",
      "Basic SEO",
      "Smooth animations",
      "1 revision"
    ],
    ctaText: "Start Your Project",
    popular: true
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "৳14,999",
    pageCount: "7–10 Pages",
    description: "A larger, more advanced business website with richer content, stronger interactions, and a more customized experience.",
    features: [
      "7–10 custom pages",
      "Custom UI/UX",
      "Advanced animations",
      "Gallery",
      "Reviews / testimonials",
      "FAQ",
      "Blog / news section",
      "Multiple CTA sections",
      "Analytics-ready setup",
      "Meta Pixel-ready setup",
      "Advanced SEO foundation",
      "2–3 revisions"
    ],
    ctaText: "Start Your Project",
    popular: false
  },
  {
    id: "max-premium",
    name: "MAX PREMIUM",
    price: "৳30,000 – ৳45,000",
    pageCount: "10–20+ Pages",
    description: "A fully customized premium web experience for brands and businesses that require advanced functionality and a larger digital presence.",
    features: [
      "10–20+ pages",
      "Fully custom UI/UX",
      "Advanced animations/interactions",
      "Advanced forms",
      "Booking / reservation systems where required",
      "E-commerce functionality where required",
      "Custom integrations",
      "API integrations where required",
      "Advanced SEO",
      "Analytics & tracking",
      "Advanced conversion-focused UX",
      "Custom functionality",
      "Extended revision/support scope"
    ],
    ctaText: "Let's Talk",
    popular: false
  }
];
