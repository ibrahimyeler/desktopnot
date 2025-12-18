"use client";

import { useState } from "react";
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
import { Search, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const mockLogs = [
  {
    id: "1",
    type: "admin_action",
    userName: "Admin User",
    action: "Catering eklendi: Lezzetli Yemek",
    ipAddress: "192.168.1.1",
    createdAt: new Date("2024-12-20T10:00:00"),
  },
  {
    id: "2",
    type: "error",
    userName: "System",
    action: "API hatası: Connection timeout",
    ipAddress: "192.168.1.2",
    createdAt: new Date("2024-12-20T09:45:00"),
  },
  {
    id: "3",
    type: "login",
    userName: "Admin User",
    action: "Kullanıcı giriş yaptı",
    ipAddress: "192.168.1.1",
    createdAt: new Date("2024-12-20T09:00:00"),
  },
];

export default function LogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "admin_action":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "login":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-[#00ff88]" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      admin_action: "bg-blue-100 text-blue-800",
      error: "bg-red-900/50 text-red-400 border border-red-500/50",
      login: "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50",
      api: "bg-gray-800/50 text-white border border-gray-700",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[type] || "bg-gray-800/50 text-white border border-gray-700"}`}>
        {type.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Log & İzleme</h1>
        <p className="text-[#00ff88]">Sistem loglarını görüntüleyin ve izleyin</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sistem Logları</CardTitle>
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="admin_action">Admin İşlemleri</option>
                <option value="api">API</option>
                <option value="login">Giriş</option>
                <option value="error">Hata</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tür</TableHead>
                <TableHead>Kullanıcı</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>IP Adresi</TableHead>
                <TableHead>Tarih/Saat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(log.type)}
                      {getTypeBadge(log.type)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.userName}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                  <TableCell>{log.createdAt.toLocaleString("tr-TR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

