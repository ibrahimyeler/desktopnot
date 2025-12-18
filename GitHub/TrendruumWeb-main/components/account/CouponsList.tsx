"use client";

import { TagIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount?: number;
  max_discount_amount?: number;
  valid_from: string;
  valid_until: string;
  is_used: boolean;
  used_at?: string;
}

interface CouponsListProps {
  coupons: Coupon[];
  loading?: boolean;
}

export default function CouponsList({ coupons, loading = false }: CouponsListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isCouponValid = (coupon: Coupon) => {
    if (coupon.is_used) return false;
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);
    return now >= validFrom && now <= validUntil;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `%${coupon.discount_value} İndirim`;
    } else {
      return `${coupon.discount_value} TL İndirim`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
        <div className="text-center">
          <TagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz kuponunuz bulunmuyor
          </h3>
          <p className="text-gray-500 text-sm">
            Kampanyalar ve özel indirimlerden haberdar olmak için bildirimlerimizi açabilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  const activeCoupons = coupons.filter(coupon => isCouponValid(coupon));
  const usedCoupons = coupons.filter(coupon => coupon.is_used);
  const expiredCoupons = coupons.filter(coupon => !coupon.is_used && !isCouponValid(coupon));

  return (
    <div className="space-y-6">
      {/* Aktif Kuponlar */}
      {activeCoupons.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Kullanılabilir Kuponlar</h2>
          <div className="grid grid-cols-1 gap-4">
            {activeCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg relative overflow-hidden"
              >
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{coupon.title}</h3>
                      {coupon.description && (
                        <p className="text-orange-50 text-sm mb-2">{coupon.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{getDiscountText(coupon)}</div>
                      {coupon.min_purchase_amount && (
                        <div className="text-xs text-orange-50 mt-1">
                          Min. {coupon.min_purchase_amount} TL
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div>
                      <div className="text-sm text-orange-50 mb-1">Kupon Kodu</div>
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-bold tracking-wider bg-white/20 px-3 py-1 rounded">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
                        >
                          {copiedCode === coupon.code ? 'Kopyalandı!' : 'Kopyala'}
                        </button>
                      </div>
                    </div>
                    <div className="text-right text-sm text-orange-50">
                      <div>Geçerlilik</div>
                      <div className="font-semibold">{formatDate(coupon.valid_until)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kullanılmış Kuponlar */}
      {usedCoupons.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-gray-400" />
            Kullanılmış Kuponlar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {usedCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-lg border border-gray-200 p-4 opacity-60"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{coupon.title}</h3>
                    <div className="text-xs text-gray-500">{getDiscountText(coupon)}</div>
                  </div>
                  <CheckCircleIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <code className="text-xs font-mono text-gray-600">{coupon.code}</code>
                  {coupon.used_at && (
                    <div className="text-xs text-gray-400 mt-2">
                      Kullanıldı: {formatDate(coupon.used_at)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Süresi Dolmuş Kuponlar */}
      {expiredCoupons.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            Süresi Dolmuş Kuponlar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 opacity-60"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{coupon.title}</h3>
                    <div className="text-xs text-gray-500">{getDiscountText(coupon)}</div>
                  </div>
                  <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <code className="text-xs font-mono text-gray-600">{coupon.code}</code>
                  <div className="text-xs text-gray-400 mt-2">
                    Son: {formatDate(coupon.valid_until)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
