export const PROJECT_TYPES = [
  "fintech",
  "healthtech",
  "edtech",
  "ecommerce",
  "ai",
  "saas",
  "gaming",
  "social",
  "productivity",
  "devtools",
  "cybersecurity",
  "blockchain",
  "other"
];

export const PROJECT_TYPE_LABELS = {
  fintech: "FinTech",
  healthtech: "HealthTech",
  edtech: "EdTech",
  ecommerce: "E-commerce",
  ai: "AI",
  saas: "SaaS",
  gaming: "Gaming",
  social: "Social",
  productivity: "Productivity",
  devtools: "DevTools",
  cybersecurity: "Cybersecurity",
  blockchain: "Blockchain",
  other: "Other"
};

export const getProjectTypeLabel = (type) => PROJECT_TYPE_LABELS[type] || type;