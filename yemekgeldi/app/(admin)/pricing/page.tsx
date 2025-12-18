"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";

const mockInvoices = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    companyName: "Tech Corp A.Ş.",
    amount: 50000,
    currency: "TRY",
    status: "paid",
    issueDate: new Date("2024-12-01"),
    dueDate: new Date("2024-12-31"),
    paidDate: new Date("2024-12-15"),
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    companyName: "Global Bilişim",
    amount: 35000,
    currency: "TRY",
    status: "pending",
    issueDate: new Date("2024-12-01"),
    dueDate: new Date("2024-12-31"),
  },
];

const mockPlans = [
  {
    id: "1",
    name: "Temel",
    type: "catering",
    price: 5000,
    currency: "TRY",
    limits: { users: 100, menus: 10 },
  },
  {
    id: "2",
    name: "Premium",
    type: "catering",
    price: 10000,
    currency: "TRY",
    limits: { users: 500, menus: 50 },
  },
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<"plans" | "invoices">("plans");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50">
            <CheckCircle className="mr-1 h-3 w-3" />
            Ödendi
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center rounded-full bg-[#00ff88]">
            <Clock className="mr-1 h-3 w-3" />
            Bekliyor
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center rounded-full bg-red-900/50 text-red-400 border border-red-500/50">
            <XCircle className="mr-1 h-3 w-3" />
            Gecikmiş
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
          <h1 className="text-3xl font-bold text-white text-white">Fiyatlandırma & Ödemeler</h1>
          <p className="text-[#00ff88]">Abonelik planları ve faturaları yönetin</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Plan Ekle
        </Button>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "plans"
              ? "border-b-2 border-blue-600 text-[#00ff88]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Abonelik Planları
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "invoices"
              ? "border-b-2 border-blue-600 text-[#00ff88]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Faturalar
        </button>
      </div>

      {activeTab === "plans" && (
        <div className="grid gap-4 md:grid-cols-3">
          {mockPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.type === "catering" ? "Catering" : "Şirket"} Planı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{plan.price.toLocaleString()}</span>
                  <span className="text-[#00ff88]"> {plan.currency}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>Kullanıcı limiti: {plan.limits.users}</div>
                  <div>Menü limiti: {plan.limits.menus}</div>
                </div>
                <Button className="mt-4 w-full">Düzenle</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "invoices" && (
        <Card>
          <CardHeader>
            <CardTitle>Fatura Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura No</TableHead>
                  <TableHead>Şirket</TableHead>
                  <TableHead>Tutar</TableHead>
                  <TableHead>İşlem Tarihi</TableHead>
                  <TableHead>Son Ödeme</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.companyName}</TableCell>
                    <TableCell>
                      {invoice.amount.toLocaleString()} {invoice.currency}
                    </TableCell>
                    <TableCell>{invoice.issueDate.toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>{invoice.dueDate.toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        İndir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

