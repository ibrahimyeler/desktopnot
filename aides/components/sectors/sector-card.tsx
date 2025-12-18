import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface SectorCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
  bgColor: string;
  features: string[];
  useCase?: string;
}

export function SectorCard({
  icon: Icon,
  title,
  description,
  iconColor,
  bgColor,
  features,
  useCase,
}: SectorCardProps) {
  return (
    <Card className="group flex h-full flex-col border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card">
      <CardHeader className="pb-4">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${bgColor} transition-transform duration-300 group-hover:scale-105`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {useCase && (
          <div className="mb-5 rounded-md bg-muted/30 p-3 border border-border/50">
            <p className="text-xs font-medium mb-1 text-muted-foreground">Use Case:</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{useCase}</p>
          </div>
        )}
        <div className="mb-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Features
          </h4>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                </div>
                <span className="text-sm leading-relaxed text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

