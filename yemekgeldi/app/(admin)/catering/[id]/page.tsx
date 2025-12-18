"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";
import { use } from "react";

// Mock data - replace with actual API calls
function getCatering(id: string) {
  return {
    id,
    name: "Lezzetli Yemek Catering",
    logo: "",
    address: "İstanbul, Kadıköy, Bağdat Caddesi No:123",
    phone: "+90 212 555 0101",
    email: "info@lezzetliyemek.com",
    taxNumber: "1234567890",
    taxOffice: "Kadıköy",
    authorizedPerson: "Ahmet Yılmaz",
    authorizedPersonPhone: "+90 532 555 0101",
    contractStartDate: new Date("2024-01-01"),
    contractEndDate: new Date("2024-12-31"),
    subscriptionPlan: "premium",
    status: "active" as const,
    rating: 4.5,
    menuEnabled: true,
    dailyMaxCapacity: 500,
    linkedCompanies: [
      { id: "1", name: "Tech Corp A.Ş." },
      { id: "2", name: "Global Bilişim" },
    ],
    createdAt: new Date("2023-12-01"),
    performance: {
      totalOrders: 45230,
      averageRating: 4.5,
      onTimeDeliveryRate: 98.5,
      satisfactionScore: 4.3,
    },
  };
}

export default function CateringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const catering = getCatering(id);
  const [isSuspending, setIsSuspending] = useState(false);

  const handleSuspend = async () => {
    setIsSuspending(true);
    // TODO: Implement suspend functionality
    setTimeout(() => setIsSuspending(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/catering">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white text-white">{catering.name}</h1>
            <p className="text-[#00ff88]">Catering firma detayları</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
          {catering.status === "active" && (
            <Button variant="danger" onClick={handleSuspend} isLoading={isSuspending}>
              <Ban className="mr-2 h-4 w-4" />
              Askıya Al
            </Button>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-4">
        {catering.status === "active" ? (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
            <CheckCircle className="mr-2 h-4 w-4" />
            Aktif
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-red-900/50 text-red-400 border border-red-500/50">
            <XCircle className="mr-2 h-4 w-4" />
            {catering.status === "suspended" ? "Askıda" : "Pasif"}
          </span>
        )}
        <div className="flex items-center text-yellow-500">
          <Star className="h-5 w-5 fill-current" />
          <span className="ml-1 font-medium">{catering.rating}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Firma Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="mt-0.5 h-5 w-5 text-[#00ff88]" />
              <div>
                <p className="text-sm font-medium text-[#00ff88]">Adres</p>
                <p className="text-white">{catering.address}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="mt-0.5 h-5 w-5 text-[#00ff88]" />
              <div>
                <p className="text-sm font-medium text-[#00ff88]">Telefon</p>
                <p className="text-white">{catering.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="mt-0.5 h-5 w-5 text-[#00ff88]" />
              <div>
                <p className="text-sm font-medium text-[#00ff88]">E-posta</p>
                <p className="text-white">{catering.email}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building2 className="mt-0.5 h-5 w-5 text-[#00ff88]" />
              <div>
                <p className="text-sm font-medium text-[#00ff88]">Vergi Bilgileri</p>
                <p className="text-white">
                  {catering.taxNumber} / {catering.taxOffice}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Info */}
        <Card>
          <CardHeader>
            <CardTitle>Sözleşme Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="mt-0.5 h-5 w-5 text-[#00ff88]" />
              <div>
                <p className="text-sm font-medium text-[#00ff88]">Sözleşme Tarihleri</p>
                <p className="text-white">
                  {catering.contractStartDate.toLocaleDateString("tr-TR")} -{" "}
                  {catering.contractEndDate.toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Abonelik Planı</p>
              <p className="mt-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 inline-block">
                {catering.subscriptionPlan}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Yetkili Kişi</p>
              <p className="text-white">{catering.authorizedPerson}</p>
              <p className="text-sm text-[#00ff88]">{catering.authorizedPersonPhone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Günlük Maksimum Kapasite</p>
              <p className="text-2xl font-bold text-white">{catering.dailyMaxCapacity}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Metrikleri</CardTitle>
          <CardDescription>Catering firmasının genel performans göstergeleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-[#00ff88]">Toplam Sipariş</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {catering.performance.totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-[#00ff88]">Ortalama Rating</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {catering.performance.averageRating}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-[#00ff88]">Zamanında Teslimat</p>
              <p className="mt-1 text-2xl font-bold text-white">
                %{catering.performance.onTimeDeliveryRate}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-[#00ff88]">Memnuniyet Skoru</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {catering.performance.satisfactionScore}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Bağlı Şirketler</CardTitle>
          <CardDescription>Bu catering ile çalışan şirketler</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Şirket Adı</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catering.linkedCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Link
                      href={`/companies/${company.id}`}
                      className="text-[#00ff88] hover:underline"
                    >
                      {company.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/companies/${company.id}`}>
                      <Button variant="ghost" size="sm">
                        Detay
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

