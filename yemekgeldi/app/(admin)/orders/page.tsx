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
import { Search, ShoppingCart, Clock, CheckCircle, Package } from "lucide-react";

const mockOrders = [
  {
    id: "1",
    employeeName: "Ahmet Yılmaz",
    companyName: "Tech Corp A.Ş.",
    menuItemName: "Köfte",
    date: new Date("2024-12-20"),
    status: "delivered",
    deliveryMethod: "qr",
  },
  {
    id: "2",
    employeeName: "Ayşe Demir",
    companyName: "Tech Corp A.Ş.",
    menuItemName: "Döner",
    date: new Date("2024-12-20"),
    status: "pending",
    deliveryMethod: "manual",
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter((order) =>
    order.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.menuItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Teslim Edildi
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]">
            <Clock className="mr-1 h-3 w-3" />
            Bekliyor
          </span>
        );
      case "preparing":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Package className="mr-1 h-3 w-3" />
            Hazırlanıyor
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Siparişler</h1>
        <p className="text-[#00ff88]">Tüm siparişleri görüntüleyin ve yönetin</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sipariş Listesi</CardTitle>
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
                <TableHead>Çalışan</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Yemek</TableHead>
                <TableHead>Teslimat</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.date.toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell className="font-medium">{order.employeeName}</TableCell>
                  <TableCell>{order.companyName}</TableCell>
                  <TableCell>{order.menuItemName}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-white">
                      {order.deliveryMethod.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/orders/${order.id}`}>
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

