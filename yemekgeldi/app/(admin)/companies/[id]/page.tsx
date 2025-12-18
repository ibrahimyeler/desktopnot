"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Building2, Users, Calendar } from "lucide-react";
import { use } from "react";

function getCompany(id: string) {
  return {
    id,
    name: "Tech Corp A.Ş.",
    sector: "Teknoloji",
    employeeCount: 250,
    location: "İstanbul",
    cateringName: "Lezzetli Yemek Catering",
    status: "active",
    subscriptionPlan: "premium",
    contractType: "monthly" as const,
    workDays: [1, 2, 3, 4, 5],
    adminName: "Mehmet Yılmaz",
    adminEmail: "mehmet@techcorp.com",
    createdAt: new Date("2024-01-01"),
  };
}

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const company = getCompany(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/companies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white text-white">{company.name}</h1>
            <p className="text-[#00ff88]">Şirket detayları</p>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Düzenle
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Şirket Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Sektör</p>
              <p className="text-white">{company.sector}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Konum</p>
              <p className="text-white">{company.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Çalışan Sayısı</p>
              <p className="text-white">{company.employeeCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Catering</p>
              <p className="text-white">{company.cateringName}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abonelik Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Plan</p>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {company.subscriptionPlan}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Sözleşme Tipi</p>
              <p className="text-white">{company.contractType === "monthly" ? "Aylık" : "Yıllık"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Çalışma Günleri</p>
              <p className="text-white">Pazartesi - Cuma</p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#00ff88]">Admin</p>
              <p className="text-white">{company.adminName}</p>
              <p className="text-sm text-[#00ff88]">{company.adminEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

