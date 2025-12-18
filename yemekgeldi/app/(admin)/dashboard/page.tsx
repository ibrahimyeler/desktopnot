"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UtensilsCrossed,
  Building2,
  Users,
  ShoppingCart,
  Package,
  Clock,
  TrendingUp,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatNumber } from "@/lib/utils/format";

// Mock data - replace with actual API calls
const dashboardMetrics = {
  totalCatering: 45,
  totalCompanies: 128,
  totalEmployees: 5432,
  todayOrders: 2847,
  deliveredOrders: 2651,
  pendingMenuApprovals: 12,
};

const orderTrendData = [
  { date: "Pzt", count: 2400 },
  { date: "Sal", count: 2800 },
  { date: "Çar", count: 3000 },
  { date: "Per", count: 3200 },
  { date: "Cum", count: 2847 },
];

const popularFoodsData = [
  { name: "Köfte", count: 450 },
  { name: "Döner", count: 380 },
  { name: "Lahmacun", count: 320 },
  { name: "Mantı", count: 280 },
  { name: "Pizza", count: 240 },
];

const cateringPerformanceData = [
  { name: "Catering A", orders: 1200, rating: 4.5 },
  { name: "Catering B", orders: 980, rating: 4.2 },
  { name: "Catering C", orders: 850, rating: 4.7 },
  { name: "Catering D", orders: 720, rating: 4.0 },
];

export default function DashboardPage() {
  const deliveryRate = dashboardMetrics.todayOrders > 0
    ? Math.round((dashboardMetrics.deliveredOrders / dashboardMetrics.todayOrders) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Dashboard</h1>
        <p className="text-[#00ff88]">Sistemin genel durumunu görüntüleyin</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Toplam Catering</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-[#00ff88]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardMetrics.totalCatering}</div>
            <p className="text-xs text-[#00ff88]">
              <span className="text-[#00ff88]">+12%</span> bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Toplam Şirket</CardTitle>
            <Building2 className="h-4 w-4 text-[#00ff88]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardMetrics.totalCompanies}</div>
            <p className="text-xs text-[#00ff88]">
              <span className="text-[#00ff88]">+8%</span> bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Toplam Çalışan</CardTitle>
            <Users className="h-4 w-4 text-[#00ff88]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(dashboardMetrics.totalEmployees)}</div>
            <p className="text-xs text-[#00ff88]">
              <span className="text-[#00ff88]">+5%</span> bu ay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Bugünkü Sipariş</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#00ff88]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatNumber(dashboardMetrics.todayOrders)}</div>
            <p className="text-xs text-[#00ff88]">
              Teslim: <span className="text-[#00ff88]">{dashboardMetrics.deliveredOrders}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Teslimat Oranı</CardTitle>
            <CardDescription>Bugün teslim edilen siparişler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white text-white">Tamamlanma</span>
                  <span className="text-sm font-bold text-white">{deliveryRate}%</span>
                </div>
                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00ff88] transition-all duration-300"
                    style={{ width: `${deliveryRate}%` }}
                  />
                </div>
              </div>
              <Package className="h-8 w-8 text-[#00ff88]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bekleyen Onaylar</CardTitle>
            <CardDescription>Menü onayı bekleyen catering</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-[#00ff88]">
                  {dashboardMetrics.pendingMenuApprovals}
                </div>
                <p className="text-sm text-white/70">Onay bekliyor</p>
              </div>
              <Clock className="h-12 w-12 text-[#00ff88]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Günlük Sipariş Trendi</CardTitle>
            <CardDescription>Bu haftanın sipariş dağılımı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Sipariş"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popüler Yemekler</CardTitle>
            <CardDescription>En çok sipariş edilen yemekler</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={popularFoodsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" name="Sipariş Sayısı" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Catering Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Catering Performans Karşılaştırması</CardTitle>
          <CardDescription>En çok sipariş alan catering firmaları</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cateringPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#2563eb" name="Sipariş" />
              <Bar yAxisId="right" dataKey="rating" fill="#10b981" name="Rating" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

