"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export function LanguageSelector() {
  const [language, setLanguage] = useState<"tr" | "en">("tr");

  const languages = {
    tr: { name: "Türkçe", code: "TR" },
    en: { name: "English", code: "GB" }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <ReactCountryFlag
            countryCode={language === "tr" ? "TR" : "GB"}
            svg
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
            title={languages[language].name}
          />
          <span className="hidden sm:inline">{languages[language].name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("tr")} className="gap-2">
          <ReactCountryFlag
            countryCode="TR"
            svg
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
            title="Türkçe"
          />
          <span>Türkçe</span>
          {language === "tr" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2">
          <ReactCountryFlag
            countryCode="GB"
            svg
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
            title="English"
          />
          <span>English</span>
          {language === "en" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

