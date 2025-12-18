"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Save } from "lucide-react";

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    brandName: "Yemek Geldi",
    brandColor: "#2563eb",
    orderCutoffTime: "09:00",
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Settings saved", generalSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-white">Sistem Ayarları</h1>
        <p className="text-[#00ff88]">Sistem genelinde ayarları yönetin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Genel Ayarlar</CardTitle>
          <CardDescription>Marka ve genel sistem ayarları</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#00ff88] mb-1">
              Marka Adı
            </label>
            <Input
              value={generalSettings.brandName}
              onChange={(e) =>
                setGeneralSettings({ ...generalSettings, brandName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#00ff88] mb-1">
              Marka Rengi
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={generalSettings.brandColor}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, brandColor: e.target.value })
                }
                className="w-20 h-10"
              />
              <Input
                value={generalSettings.brandColor}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, brandColor: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#00ff88] mb-1">
              Sipariş Kesim Saati
            </label>
            <Input
              type="time"
              value={generalSettings.orderCutoffTime}
              onChange={(e) =>
                setGeneralSettings({ ...generalSettings, orderCutoffTime: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Kaydet
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Güvenlik Ayarları</CardTitle>
          <CardDescription>IP kısıtlama ve API ayarları</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#00ff88] mb-1">
              API Key
            </label>
            <div className="flex items-center space-x-2">
              <Input value="sk_live_**************" readOnly />
              <Button variant="outline">Yenile</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#00ff88] mb-1">
              Log Saklama Süresi (Gün)
            </label>
            <Input type="number" defaultValue={30} />
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Kaydet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

