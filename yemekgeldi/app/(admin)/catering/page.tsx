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
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Catering } from "@/lib/types";

// Mock data - replace with actual API calls
const mockCaterings: Catering[] = [
  {
    id: "1",
    name: "Lezzetli Yemek Catering",
    address: "İstanbul, Kadıköy",
    phone: "+90 212 555 0101",
    email: "info@lezzetliyemek.com",
    taxNumber: "1234567890",
    taxOffice: "Kadıköy",
    authorizedPerson: "Ahmet Yılmaz",
    authorizedPersonPhone: "+90 532 555 0101",
    contractStartDate: new Date("2024-01-01"),
    contractEndDate: new Date("2024-12-31"),
    subscriptionPlan: "premium",
    status: "active",
    rating: 4.5,
    menuEnabled: true,
    dailyMaxCapacity: 500,
    linkedCompanies: ["1", "2"],
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "2",
    name: "Gurme Mutfak",
    address: "Ankara, Çankaya",
    phone: "+90 312 555 0202",
    email: "info@gurmemutfak.com",
    taxNumber: "0987654321",
    taxOffice: "Çankaya",
    authorizedPerson: "Ayşe Demir",
    authorizedPersonPhone: "+90 532 555 0202",
    contractStartDate: new Date("2024-02-01"),
    contractEndDate: new Date("2025-01-31"),
    subscriptionPlan: "basic",
    status: "active",
    rating: 4.2,
    menuEnabled: true,
    dailyMaxCapacity: 300,
    linkedCompanies: ["3"],
    createdAt: new Date("2024-01-15"),
  },
];

export default function CateringListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");

  const filteredCaterings = mockCaterings.filter((catering) => {
    const matchesSearch =
      catering.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catering.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || catering.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aktif
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center rounded-full bg-gray-800/50 text-white border border-gray-700">
            <XCircle className="mr-1 h-3 w-3" />
            Pasif
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center rounded-full bg-red-900/50 text-red-400 border border-red-500/50">
            <Ban className="mr-1 h-3 w-3" />
            Askıda
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white text-white">Catering Şirketleri</h1>
          <p className="text-[#00ff88]">Tüm catering firmalarını yönetin</p>
        </div>
        <Link href="/catering/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Catering Ekle
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Catering Listesi</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00ff88]" />
                <Input
                  placeholder="Ara..."
                  className="w-64 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-md border border-gray-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="suspended">Askıda</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Firma Adı</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Abonelik</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Kapasite</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Bağlı Şirket</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCaterings.map((catering) => (
                <TableRow key={catering.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/catering/${catering.id}`}
                      className="text-[#00ff88] hover:underline"
                    >
                      {catering.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{catering.email}</div>
                      <div className="text-[#00ff88]">{catering.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {catering.subscriptionPlan}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="font-medium">{catering.rating}</span>
                      <span className="ml-1 text-yellow-400">★</span>
                    </div>
                  </TableCell>
                  <TableCell>{catering.dailyMaxCapacity}/gün</TableCell>
                  <TableCell>{getStatusBadge(catering.status)}</TableCell>
                  <TableCell>{catering.linkedCompanies.length} şirket</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/catering/${catering.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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

