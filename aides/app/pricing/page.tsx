"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const pricingPlans = {
    starter: {
      monthly: 49,
      yearly: 490,
      name: "Starter",
      description: "For small businesses",
      features: [
        "500 calls/support per month",
        "Web AI Chat",
        "Basic analytics",
        "Email support",
        "GDPR compliant"
      ]
    },
    pro: {
      monthly: 149,
      yearly: 1490,
      name: "Pro",
      description: "For growing businesses",
      features: [
        "5,000 calls/support per month",
        "Web AI Chat + Phone",
        "WhatsApp integration",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Custom AI model training"
      ]
    },
    enterprise: {
      monthly: "Custom",
      yearly: "Custom",
      name: "Enterprise",
      description: "Enterprise solutions",
      features: [
        "Unlimited usage",
        "All features",
        "Custom integrations",
        "Dedicated support team",
        "SLA guarantee",
        "Custom AI models",
        "On-premise option",
        "24/7 technical support"
      ]
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <section className="w-full px-4 pt-24 pb-12 md:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Enterprise Pricing Solutions
          </h1>
          <p className="mb-8 text-base text-muted-foreground sm:text-lg">
            Get started with a plan that fits your business needs. All packages include a 14-day free trial period.
            You can upgrade or change your plan at any time.
          </p>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="w-full px-4 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as "monthly" | "yearly")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">
                Yearly
                <Badge variant="secondary" className="ml-2">20% Off</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="w-full px-4 py-8 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
            {Object.entries(pricingPlans).map(([key, plan]) => (
              <Card key={key} className={`group flex flex-col border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/60 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 ${key === "pro" ? "border-primary/60 relative" : ""}`}>
                {key === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-6 mb-6">
                    {typeof plan[billingPeriod] === "number" ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold group-hover:text-primary transition-colors">
                          ${plan[billingPeriod].toLocaleString("en-US")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{billingPeriod === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold group-hover:text-primary transition-colors">Custom</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col pt-0">
                  <ul className="flex-1 space-y-2.5 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 group-hover:translate-x-1 transition-transform duration-200">
                        <Check className="h-3.5 w-3.5 shrink-0 text-green-500 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-auto group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" 
                    variant={key === "pro" ? "default" : "outline"}
                    size="default"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

