"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, HeadphonesIcon, AlertCircle, Clock, CheckCircle } from "lucide-react";

const mockTickets = [
  {
    id: "1",
    ticketNumber: "TICK-2024-001",
    type: "food_not_hot",
    source: "employee",
    sourceName: "Ahmet Yılmaz",
    subject: "Yemek soğuk geldi",
    status: "open",
    priority: "high",
    createdAt: new Date("2024-12-20T10:00:00"),
  },
  {
    id: "2",
    ticketNumber: "TICK-2024-002",
    type: "missing_delivery",
    source: "company",
    sourceName: "Tech Corp A.Ş.",
    subject: "Eksik teslimat",
    status: "in_progress",
    priority: "urgent",
    createdAt: new Date("2024-12-20T09:30:00"),
  },
];

const ticketTypeLabels: Record<string, string> = {
  food_not_hot: "Yemek Sıcak Değildi",
  bad_taste: "Lezzet Kötü",
  missing_delivery: "Eksik Teslimat",
  allergen_not_marked: "Alerjen Belirtilmemiş",
  invoice_issue: "Fatura Sorunu",
  app_problem: "Uygulama Problemi",
  other: "Diğer",
};

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = mockTickets.filter((ticket) =>
    ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Açık
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]">
            <Clock className="mr-1 h-3 w-3" />
            İşlemde
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Çözüldü
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-800/50 text-white border border-gray-700",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-[#00ff88]",
      urgent: "bg-red-900/50 text-red-400 border border-red-500/50",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[priority]}`}>
        {priority === "urgent" ? "Acil" : priority === "high" ? "Yüksek" : priority === "medium" ? "Orta" : "Düşük"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Destek & Şikayet Yönetimi</h1>
        <p className="text-[#00ff88]">Tüm destek taleplerini görüntüleyin ve yönetin</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ticket Listesi</CardTitle>
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
                <TableHead>Ticket No</TableHead>
                <TableHead>Konu</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Kaynak</TableHead>
                <TableHead>Öncelik</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticketTypeLabels[ticket.type] || ticket.type}</TableCell>
                  <TableCell>{ticket.sourceName}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{ticket.createdAt.toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/support/${ticket.id}`}>
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

