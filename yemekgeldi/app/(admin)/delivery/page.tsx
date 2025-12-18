"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QrCode, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const mockDeliveryReport = {
  date: new Date("2024-12-20"),
  totalOrders: 2847,
  deliveredOrders: 2651,
  pendingOrders: 196,
  hourlyDeliveryRate: [
    { hour: 11, count: 120 },
    { hour: 12, count: 450 },
    { hour: 13, count: 680 },
    { hour: 14, count: 920 },
    { hour: 15, count: 481 },
  ],
  completionPercentage: 93.1,
};

const mockQRLogs = [
  {
    id: "1",
    employeeName: "Ahmet Yılmaz",
    orderId: "ORD-001",
    timestamp: new Date("2024-12-20T12:30:00"),
    success: true,
  },
  {
    id: "2",
    employeeName: "Ayşe Demir",
    orderId: "ORD-002",
    timestamp: new Date("2024-12-20T12:45:00"),
    success: false,
    errorMessage: "Geçersiz QR kod",
  },
];

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Teslimat & QR Kontrol</h1>
        <p className="text-[#00ff88]">Teslimat durumunu ve QR kod loglarını görüntüleyin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Toplam Sipariş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockDeliveryReport.totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Teslim Edilen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00ff88]">
              {mockDeliveryReport.deliveredOrders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Tamamlanma Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{mockDeliveryReport.completionPercentage}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saatlik Teslim Hızları</CardTitle>
          <CardDescription>Gün içindeki teslimat dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockDeliveryReport.hourlyDeliveryRate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>QR Kod Logları</CardTitle>
          <CardDescription>Son QR kod tarama işlemleri</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Çalışan</TableHead>
                <TableHead>Sipariş ID</TableHead>
                <TableHead>Tarih/Saat</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockQRLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.employeeName}</TableCell>
                  <TableCell>{log.orderId}</TableCell>
                  <TableCell>
                    {log.timestamp.toLocaleString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Başarılı
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-900/50 text-red-400 border border-red-500/50">
                        <XCircle className="mr-1 h-3 w-3" />
                        Hatalı: {log.errorMessage}
                      </span>
                    )}
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

