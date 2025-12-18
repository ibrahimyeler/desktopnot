import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function SectorsCTA() {
  return (
    <section className="w-full px-4 py-8 md:px-6 md:py-12 lg:px-8">
      <div className="w-full">
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
          <CardContent className="pt-8 pb-8 text-center md:pt-10 md:pb-10">
            <h2 className="mb-3 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              Need a Custom Solution for Your Industry?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Contact our expert team to design a custom AI assistant solution for your business. 
              We'll analyze your needs and offer the most suitable solution.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button 
                size="default" 
                className="px-6"
                asChild
              >
                <a href="/pricing">
                  View Pricing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button 
                size="default" 
                variant="outline" 
                className="px-6"
                asChild
              >
                <a href="#contact">
                  Contact Us
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

