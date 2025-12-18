"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";

export function Header() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">AIAsist</span>
        </div>
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="/industries" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Industries
          </a>
          <a href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#developers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Developers
          </a>
          <a href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
          <Button 
            size="sm"
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-all duration-200"
          >
            Try Free
          </Button>
        </div>
        <div className="ml-auto">
          <LanguageSelector />
        </div>
      </div>
    </nav>
  );
}

