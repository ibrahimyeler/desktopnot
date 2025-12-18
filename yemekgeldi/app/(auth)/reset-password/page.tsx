"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#00ff88]">
            <UtensilsCrossed className="h-6 w-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Şifre Sıfırla</CardTitle>
          <CardDescription>
            E-posta adresinize şifre sıfırlama linki gönderelim
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="E-posta"
                type="email"
                placeholder="admin@yemekgeldi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Şifre Sıfırlama Linki Gönder
              </Button>
              <Link
                href="/login"
                className="flex items-center justify-center space-x-2 text-sm text-white/70 hover:text-[#00ff88]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Giriş sayfasına dön</span>
              </Link>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#00ff88]/20 border border-[#00ff88]">
                <svg
                  className="h-6 w-6 text-[#00ff88]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">E-posta gönderildi!</h3>
                <p className="mt-2 text-sm text-[#00ff88]">
                  {email} adresine şifre sıfırlama linki gönderildi. Lütfen e-postanızı kontrol edin.
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Giriş sayfasına dön
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

