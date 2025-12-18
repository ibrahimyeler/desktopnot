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
import { Plus, Search, Upload, Users, CheckCircle, XCircle } from "lucide-react";

const mockEmployees = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@techcorp.com",
    department: "Yazılım",
    companyName: "Tech Corp A.Ş.",
    allergens: ["gluten", "dairy"],
    status: "active",
    hasOrderedToday: true,
  },
  {
    id: "2",
    name: "Ayşe Demir",
    email: "ayse@techcorp.com",
    department: "Tasarım",
    companyName: "Tech Corp A.Ş.",
    allergens: [],
    status: "active",
    hasOrderedToday: false,
  },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = mockEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white text-white">Çalışanlar</h1>
          <p className="text-[#00ff88]">Tüm çalışanları yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Toplu Yükle (CSV)
          </Button>
          <Link href="/employees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Çalışan Ekle
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Çalışan Listesi</CardTitle>
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
                <TableHead>İsim</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Departman</TableHead>
                <TableHead>Şirket</TableHead>
                <TableHead>Alerjenler</TableHead>
                <TableHead>Bugün Sipariş</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.companyName}</TableCell>
                  <TableCell>
                    {employee.allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {employee.allergens.map((allergen, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-[#00ff88]"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#00ff88]">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {employee.hasOrderedToday ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
                      Aktif
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/employees/${employee.id}`}>
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

