"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Building2, Users, CheckCircle } from "lucide-react";

const mockCompanies = [
  {
    id: "1",
    name: "Tech Corp A.Ş.",
    sector: "Teknoloji",
    employeeCount: 250,
    location: "İstanbul",
    cateringName: "Lezzetli Yemek Catering",
    status: "active",
    subscriptionPlan: "premium",
  },
  {
    id: "2",
    name: "Global Bilişim",
    sector: "Yazılım",
    employeeCount: 180,
    location: "Ankara",
    cateringName: "Lezzetli Yemek Catering",
    status: "active",
    subscriptionPlan: "basic",
  },
];

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white text-white">Şirketler</h1>
          <p className="text-[#00ff88]">Tüm şirketleri yönetin</p>
        </div>
        <Link href="/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Şirket Ekle
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Şirket Listesi</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00ff88]" />
              <Input
                placeholder="Ara..."
                className="w-64 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Şirket Adı</TableHead>
                <TableHead>Sektör</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Çalışan Sayısı</TableHead>
                <TableHead>Catering</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/companies/${company.id}`}
                      className="text-[#00ff88] hover:underline"
                    >
                      {company.name}
                    </Link>
                  </TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-[#00ff88]" />
                      {company.employeeCount}
                    </div>
                  </TableCell>
                  <TableCell>{company.cateringName || "-"}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {company.subscriptionPlan}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Aktif
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
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

