"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

interface DiscountCodeInputProps {
  onApplyCode?: (code: string) => void;
  onRemoveCode?: () => void;
  appliedCode?: string | null;
  isApplied?: boolean;
  isLoading?: boolean;
}

export default function DiscountCodeInput({
  onApplyCode,
  onRemoveCode,
  appliedCode,
  isApplied = false,
  isLoading = false
}: DiscountCodeInputProps) {
  const [code, setCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Lütfen bir indirim kodu girin");
      return;
    }
    
    if (!isLoggedIn) {
      toast.error("İndirim kodu uygulamak için giriş yapmanız gerekiyor", {
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }
      });
      // Login sayfasına yönlendir
      setTimeout(() => {
        router.push('/giris');
      }, 1500);
      return;
    }
    
    onApplyCode?.(code.trim());
  };

  const handleRemoveCode = () => {
    onRemoveCode?.();
    setCode("");
    setIsExpanded(false);
  };

  const handleToggleExpanded = () => {
    if (isApplied) {
      handleRemoveCode();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="mt-4">
      {!isApplied ? (
        <div>
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <PlusIcon className="w-4 h-4 text-orange-500" />
              <span>İndirim Kodu Gir</span>
            </button>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="İndirim kodu"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base text-gray-900 placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="w-20 px-2 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-xs whitespace-nowrap"
                >
                  {isLoading ? "Uygulanıyor..." : "Uygula"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              İndirim kodu uygulandı: <span className="font-bold">{appliedCode}</span>
            </span>
          </div>
          <button
            onClick={handleRemoveCode}
            className="px-2 py-1 text-xs text-green-600 hover:text-green-800 transition-colors border border-green-300 rounded"
            disabled={isLoading}
          >
            Kaldır
          </button>
        </div>
      )}
    </div>
  );
}
