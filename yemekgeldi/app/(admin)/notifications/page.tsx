"use client";

import { useState } from "react";
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
import { Plus, Bell, CheckCircle, XCircle, Clock } from "lucide-react";

const mockNotifications = [
  {
    id: "1",
    type: "order_reminder",
    channel: "push",
    recipientType: "all",
    title: "Sipariş Hatırlatması",
    message: "Bugünkü menüyü sipariş etmeyi unutmayın!",
    status: "delivered",
    sentAt: new Date("2024-12-20T09:00:00"),
  },
  {
    id: "2",
    type: "announcement",
    channel: "email",
    recipientType: "catering",
    title: "Yeni Özellik Duyurusu",
    message: "Menü yönetimi için yeni özellikler eklendi.",
    status: "sent",
    sentAt: new Date("2024-12-19T14:00:00"),
  },
];

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = mockNotifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase())
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
      case "sent":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Clock className="mr-1 h-3 w-3" />
            Gönderildi
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center rounded-full bg-red-900/50 text-red-400 border border-red-500/50">
            <XCircle className="mr-1 h-3 w-3" />
            Başarısız
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
          <h1 className="text-3xl font-bold text-white text-white">Bildirim Yönetimi</h1>
          <p className="text-[#00ff88]">Sistem genelinde bildirimler gönderin ve yönetin</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Bildirim Gönder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bildirim Listesi</CardTitle>
            <div className="relative">
              <Input
                placeholder="Ara..."
                className="w-64"
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
                <TableHead>Başlık</TableHead>
                <TableHead>Kanal</TableHead>
                <TableHead>Alıcı</TableHead>
                <TableHead>Mesaj</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Gönderim Tarihi</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-white">
                      {notification.channel.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    {notification.recipientType === "all" ? "Tümü" : notification.recipientType}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                  <TableCell>{getStatusBadge(notification.status)}</TableCell>
                  <TableCell>{notification.sentAt.toLocaleString("tr-TR")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Detay
                    </Button>
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

