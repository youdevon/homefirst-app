export const contactHero = {
  eyebrow: "Get in Touch",
  title: "Contact",
  highlightedTitle: "HomeFirst",
  description:
    "Reach the Division of Urban Buildings for housing enquiries, application support, and general information about HomeFirst programmes.",
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=85",
};

export const contactDetails = {
  officeName: "Division of Urban Buildings",
  address: "Level 4, Government Campus, Port of Spain, Trinidad and Tobago",
  phone: "+1 (868) 612-3456",
  email: "info@homefirst.gov.tt",
  officeHours: "Mon–Fri: 8:00am – 4:00pm",
  mapEmbedUrl: "",
  mapUrl: "https://maps.google.com",
};

export const contactInstructions = {
  title: "How to",
  highlightedTitle: "Reach Us",
  description:
    "Our team is available to guide applicants, community partners, and members of the public.",
  items: [
    "Bring valid photo identification when visiting the office.",
    "Include your application reference number in written enquiries.",
    "Allow up to two business days for email responses.",
    "Use the callback card below for urgent housing support.",
  ],
};

export const contactFormPlaceholder = {
  title: "Send an Enquiry",
  description:
    "Online submission will be enabled in a future release. For now, please call, email, or visit the office.",
  nameLabel: "Full name",
  emailLabel: "Email address",
  phoneLabel: "Phone number",
  messageLabel: "Your message",
  submitLabel: "Submit Enquiry",
};

export const contactCards = [
  {
    title: "Visit the Office",
    description: "Meet with housing officers for in-person guidance and document review.",
    icon: "🏢",
    linkLabel: "Get directions",
    linkHref: "/contact",
    displayOrder: 0,
    active: true,
  },
  {
    title: "Request a Callback",
    description: "Speak with an advisor about applications, eligibility, or follow-up status.",
    icon: "☎️",
    linkLabel: "Call now",
    linkHref: "tel:+18686123456",
    displayOrder: 1,
    active: true,
  },
  {
    title: "Email Support",
    description: "Send general enquiries, document requests, or programme questions.",
    icon: "✉️",
    linkLabel: "Send email",
    linkHref: "mailto:info@homefirst.gov.tt",
    displayOrder: 2,
    active: true,
  },
  {
    title: "Start Application",
    description: "Begin a housing application or check required documents before you apply.",
    icon: "📝",
    linkLabel: "Apply online",
    linkHref: "/application",
    displayOrder: 3,
    active: true,
  },
];
