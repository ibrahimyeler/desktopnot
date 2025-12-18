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
import { Search, BookOpen, CheckCircle, XCircle, Clock } from "lucide-react";

const mockMenus = [
  {
    id: "1",
    cateringName: "Lezzetli Yemek Catering",
    date: new Date("2024-12-20"),
    items: ["Köfte", "Pilav", "Salata"],
    status: "approved",
  },
  {
    id: "2",
    cateringName: "Gurme Mutfak",
    date: new Date("2024-12-20"),
    items: ["Döner", "Ayran"],
    status: "pending",
  },
];

export default function MenusPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMenus = mockMenus.filter((menu) =>
    menu.cateringName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Onaylandı
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]">
            <Clock className="mr-1 h-3 w-3" />
            Bekliyor
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-full bg-red-900/50 text-red-400 border border-red-500/50">
            <XCircle className="mr-1 h-3 w-3" />
            Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Menüler</h1>
        <p className="text-[#00ff88]">Catering menülerini görüntüleyin ve onaylayın</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Menü Listesi</CardTitle>
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
                <TableHead>Tarih</TableHead>
                <TableHead>Catering</TableHead>
                <TableHead>Yemekler</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.date.toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell className="font-medium">{menu.cateringName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {menu.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-white"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(menu.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/menus/${menu.id}`}>
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

