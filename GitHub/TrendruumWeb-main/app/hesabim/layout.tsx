"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname ?? "/";
  const redirectUrl = `/giris?redirect=${encodeURIComponent(currentPath)}`;
  const { isLoggedIn, checkAuth } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    let isActive = true;

    const ensureAuthenticated = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.replace(redirectUrl);
        if (isActive) {
          setHasCheckedAuth(true);
        }
        return;
      }

      try {
        await checkAuth();
      } finally {
        if (isActive) {
          setHasCheckedAuth(true);
        }
      }
    };

    ensureAuthenticated();

    return () => {
      isActive = false;
    };
  }, [checkAuth, redirectUrl, router]);

  useEffect(() => {
    if (!hasCheckedAuth) {
      return;
    }

    if (!isLoggedIn) {
      router.replace(redirectUrl);
    }
  }, [hasCheckedAuth, isLoggedIn, redirectUrl, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}