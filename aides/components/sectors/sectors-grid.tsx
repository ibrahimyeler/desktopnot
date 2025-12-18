import { 
  Building2,
  ShoppingCart,
  Heart,
  Briefcase,
  Layers
} from "lucide-react";
import { SectorCard } from "./sector-card";

const sectors = [
  {
    icon: Building2,
    title: "Restaurants",
    description: "Take your restaurant to the next level with AI-powered solutions that enhance customer experience and increase operational efficiency.",
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
    useCase: "Customers make table reservations via WhatsApp, the AI assistant answers questions about the menu, and speeds up the ordering process.",
    features: [
      "Automatic table reservation management and confirmation",
      "Live menu information and price inquiry",
      "Order taking and kitchen integration",
      "Customer feedback collection and analysis",
      "24/7 customer support and problem solving",
      "Campaign and promotion notifications"
    ]
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Smart e-commerce solutions that increase sales, enhance customer satisfaction, and reduce operational costs.",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    useCase: "While customers search for products on your website, the AI assistant instantly offers suggestions, tracks order status, and manages return processes.",
    features: [
      "Smart product recommendations and personalization",
      "Real-time order status inquiry",
      "Return, exchange, and cancellation management",
      "Shipping tracking and delivery notification",
      "Product comparison and filtering support",
      "Stock status and price updates"
    ]
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Solutions that improve patient experience, optimize appointment management, and facilitate access to healthcare services.",
    iconColor: "text-red-600",
    bgColor: "bg-red-600/10",
    useCase: "Patients make appointments over the phone, the AI assistant shares doctor information, and sends medication reminders.",
    features: [
      "Automatic appointment booking and management",
      "Doctor and specialist information sharing",
      "Medication reminders and dosage information",
      "Test results notification",
      "Emergency situation referrals",
      "Health insurance information"
    ]
  },
  {
    icon: Briefcase,
    title: "Enterprise",
    description: "AI-powered platforms that optimize internal processes, increase employee productivity, and strengthen corporate communication.",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    useCase: "Employees manage HR processes with the AI assistant, access internal knowledge resources, and automate meeting planning.",
    features: [
      "HR processes and leave management support",
      "Internal communication and information sharing",
      "Meeting planning and attendance management",
      "Company policies and procedures information",
      "IT support and problem solving",
      "Performance and reporting information"
    ]
  },
  {
    icon: Layers,
    title: "SaaS Companies",
    description: "Smart solutions that accelerate user onboarding, automate technical support, and reduce churn rates.",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    useCase: "New users quickly get started with the AI assistant, resolve technical issues, and discover product features.",
    features: [
      "Technical support and troubleshooting",
      "Interactive user onboarding",
      "API documentation and integration assistance",
      "Feature introductions and training content",
      "Usage statistics and recommendations",
      "Billing and subscription management"
    ]
  }
];

export function SectorsGrid() {
  return (
    <section className="w-full px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Industry-Specific Solutions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            AI assistant solutions optimized for each industry's unique needs
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, index) => (
            <SectorCard key={index} {...sector} />
          ))}
        </div>
      </div>
    </section>
  );
}

