"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  MessageSquare, 
  Globe, 
  Zap, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  Check,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Code,
  Webhook,
  FileText,
  Building2,
  ShoppingCart,
  Heart,
  Briefcase,
  Layers,
  Cloud,
  Database,
  Cpu,
  Radio
} from "lucide-react";

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const pricingPlans = {
    starter: {
      monthly: 499,
      yearly: 4990,
      name: "Starter",
      description: "Küçük işletmeler için",
      features: [
        "500 arama/destek ayı",
        "Web AI Chat",
        "Temel analitik",
        "E-posta desteği",
        "KVKK uyumlu"
      ]
    },
    pro: {
      monthly: 1499,
      yearly: 14990,
      name: "Pro",
      description: "Büyüyen işletmeler için",
      features: [
        "5.000 arama/destek ayı",
        "Web AI Chat + Telefon",
        "WhatsApp entegrasyonu",
        "Gelişmiş analitik",
        "Öncelikli destek",
        "API erişimi",
        "Özel AI modeli eğitimi"
      ]
    },
    enterprise: {
      monthly: "Özel",
      yearly: "Özel",
      name: "Enterprise",
      description: "Kurumsal çözümler",
      features: [
        "Sınırsız kullanım",
        "Tüm özellikler",
        "Özel entegrasyonlar",
        "Dedike destek ekibi",
        "SLA garantisi",
        "Özel AI modelleri",
        "On-premise seçeneği",
        "7/24 teknik destek"
      ]
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Hero Section */}
      <section className="container px-4 pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            🤖 Yapay Zeka Destekli Müşteri Hizmetleri
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Telefonu cevaplayan, yazan ve müşterilerinize{" "}
            <span className="text-primary">anında yanıt veren</span> yapay zeka asistanı
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:max-w-2xl md:mx-auto">
            Web siteleri, telefon hatları ve WhatsApp üzerinden müşterilerinizle doğal dilde iletişim kuran, 
            satışları artıran ve destek yükünü azaltan akıllı asistanınız.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-lg px-8">
              Ücretsiz Dene
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Canlı Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Kredi kartı gerekmez • 14 gün ücretsiz deneme
          </p>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              İşletmelerin Yaşadığı Problemler ve AI Çözümleri
            </h2>
            <p className="text-lg text-muted-foreground">
              Modern işletmelerin karşılaştığı zorlukları yapay zeka ile çözüyoruz
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Phone className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Cevapsız Aramalar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Müşterileriniz aradığında kimse cevap vermiyor mu? Kaçan fırsatlar ve memnuniyetsiz müşteriler...
                </p>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">AI Çözümü:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    7/24 aktif telefon asistanımız, tüm aramaları anında cevaplıyor, soruları çözüyor ve müşterilerinizi yönlendiriyor.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>Yoğun Destek Yükü</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Destek ekibiniz sürekli aynı sorularla mı uğraşıyor? Yüksek maliyetler ve yavaş yanıt süreleri...
                </p>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">AI Çözümü:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    AI asistanınız rutin soruları anında çözüyor, ekibinizi yalnızca karmaşık durumlara yönlendiriyor.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Kaçan Satışlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Potansiyel müşterileriniz bilgi alamadığı için satın almıyor mu? Kayıp gelirler ve rekabet kaybı...
                </p>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">AI Çözümü:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Asistanınız anında ürün bilgisi veriyor, sipariş alıyor ve müşterileri satışa yönlendiriyor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="nasıl-çalışır" className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-muted-foreground">
              4 basit adımda müşteri hizmetlerinizi otomatikleştirin
            </p>
          </div>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Kayıt Ol",
                  description: "Birkaç dakika içinde hesabınızı oluşturun, kredi kartı gerektirmez.",
                  icon: CheckCircle2
                },
                {
                  step: "02",
                  title: "Asistanını Oluştur",
                  description: "Sektörünüze özel AI asistanınızı yapılandırın ve eğitin.",
                  icon: Zap
                },
                {
                  step: "03",
                  title: "Bilgilerini Yükle",
                  description: "Ürün bilgileri, SSS ve şirket verilerinizi sisteme yükleyin.",
                  icon: Database
                },
                {
                  step: "04",
                  title: "Canlıya Al",
                  description: "Web sitenize, telefon hattınıza veya WhatsApp'a entegre edin.",
                  icon: Radio
                }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-muted-foreground">{item.step}</span>
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                  {index < 3 && (
                    <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 md:block">
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products/Services Section */}
      <section id="özellikler" className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ürünler ve Hizmetler
            </h2>
            <p className="text-lg text-muted-foreground">
              İhtiyacınıza göre özelleştirilebilir AI çözümleri
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "Web AI Destek",
                description: "Web sitenize entegre edilen akıllı chat botu. Müşterilerinize anında yanıt verir, ürün bilgisi sunar ve satışları artırır.",
                iconColor: "text-blue-500",
                bgColor: "bg-blue-500/10"
              },
              {
                icon: Phone,
                title: "Telefon AI Asistan",
                description: "Telefon aramalarınızı otomatik cevaplayan, doğal sesli AI asistan. Müşterilerinizle insan gibi konuşur.",
                iconColor: "text-green-500",
                bgColor: "bg-green-500/10"
              },
              {
                icon: MessageSquare,
                title: "WhatsApp AI",
                description: "WhatsApp üzerinden mesajlaşma destekli AI asistanı. Müşterilerinizle en çok kullandıkları platformda buluşun.",
                iconColor: "text-emerald-500",
                bgColor: "bg-emerald-500/10"
              },
              {
                icon: Zap,
                title: "Otomasyon & Entegrasyon",
                description: "CRM, ERP ve diğer sistemlerinizle entegre olur. Müşteri verilerini otomatik senkronize eder ve iş akışlarınızı optimize eder.",
                iconColor: "text-purple-500",
                bgColor: "bg-purple-500/10"
              },
              {
                icon: BarChart3,
                title: "Analitik & Raporlama",
                description: "Detaylı analitik ve raporlama ile müşteri etkileşimlerinizi takip edin, performansı ölçün ve sürekli iyileştirin.",
                iconColor: "text-orange-500",
                bgColor: "bg-orange-500/10"
              }
            ].map((product, index) => (
              <Card key={index} className="flex flex-col transition-shadow">
                <CardHeader>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${product.bgColor}`}>
                    <product.icon className={`h-6 w-6 ${product.iconColor}`} />
                  </div>
                  <CardTitle>{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base mb-4">
                    {product.description}
                  </CardDescription>
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    Detayları Gör
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section id="sektörler" className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Sektörel Çözümler
              </h2>
              <p className="text-lg text-muted-foreground">
                Her sektöre özel optimize edilmiş AI asistan çözümleri
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Building2,
                  title: "Restoranlar",
                  description: "Masa rezervasyonu alır, menü bilgisi verir, sipariş yönetir ve müşteri memnuniyetini artırır.",
                  iconColor: "text-red-500",
                  bgColor: "bg-red-500/10"
                },
                {
                  icon: ShoppingCart,
                  title: "E-ticaret",
                  description: "Ürün önerileri sunar, sipariş durumu sorgular, iade süreçlerini yönetir ve satışları artırır.",
                  iconColor: "text-blue-500",
                  bgColor: "bg-blue-500/10"
                },
                {
                  icon: Heart,
                  title: "Sağlık",
                  description: "Randevu alır, doktor bilgisi verir, ilaç hatırlatmaları yapar ve hasta deneyimini iyileştirir.",
                  iconColor: "text-red-600",
                  bgColor: "bg-red-600/10"
                },
                {
                  icon: Briefcase,
                  title: "Kurumsal Firmalar",
                  description: "İK süreçlerini destekler, iç iletişimi kolaylaştırır, bilgi paylaşımını otomatikleştirir.",
                  iconColor: "text-indigo-500",
                  bgColor: "bg-indigo-500/10"
                },
                {
                  icon: Layers,
                  title: "SaaS Şirketleri",
                  description: "Teknik destek sağlar, onboarding süreçlerini yönetir, kullanıcı sorularını çözer ve churn'i azaltır.",
                  iconColor: "text-purple-500",
                  bgColor: "bg-purple-500/10"
                }
              ].map((industry, index) => (
                <Card key={index} className="transition-shadow">
                  <CardHeader>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${industry.bgColor}`}>
                      <industry.icon className={`h-6 w-6 ${industry.iconColor}`} />
                    </div>
                    <CardTitle>{industry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{industry.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Neden AIAsist?
            </h2>
            <p className="text-lg text-muted-foreground">
              Sizi rakiplerinizden ayıran avantajlarımız
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: "Doğal Türkçe Konuşma",
                description: "İnsan gibi doğal Türkçe konuşan, anlayan ve yanıt veren AI teknolojisi."
              },
              {
                icon: Phone,
                title: "İnsan gibi Sesli Yanıt",
                description: "Gerçekçi, samimi ve profesyonel ses tonu ile müşterilerinizle iletişim kurar."
              },
              {
                icon: Shield,
                title: "KVKK & GDPR Uyumlu",
                description: "Veri güvenliği ve gizlilik standartlarına tam uyumlu, güvenli altyapı."
              },
              {
                icon: Zap,
                title: "Kolay Kurulum",
                description: "Teknik bilgi gerektirmeden dakikalar içinde kurulum ve canlıya alma."
              },
              {
                icon: TrendingUp,
                title: "Ölçeklenebilir Altyapı",
                description: "İşletmeniz büyüdükçe birlikte büyüyen, sınırsız ölçeklenebilir sistem."
              },
              {
                icon: Clock,
                title: "7/24 Kesintisiz Hizmet",
                description: "Hiç kapanmayan, her zaman hazır müşteri hizmetleri desteği."
              }
            ].map((advantage, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <advantage.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Technology Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Güven & Teknoloji
              </h2>
              <p className="text-lg text-muted-foreground">
                Kurumsal düzeyde güvenlik ve güvenilir altyapı
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  icon: Cloud,
                  title: "Bulut Altyapı",
                  description: "Dünya standartlarında bulut altyapısı ile %99.9 uptime garantisi ve yüksek performans."
                },
                {
                  icon: Shield,
                  title: "Güvenli Veri Saklama",
                  description: "End-to-end şifreleme, güvenli veri saklama ve düzenli güvenlik denetimleri ile verileriniz korunur."
                },
                {
                  icon: Cpu,
                  title: "Gelişmiş AI Modelleri",
                  description: "En son yapay zeka teknolojileri ile güçlendirilmiş, sürekli öğrenen ve gelişen AI modelleri."
                },
                {
                  icon: Radio,
                  title: "SIP / VoIP Altyapı",
                  description: "Endüstri standardı telefon altyapısı ile sorunsuz entegrasyon ve yüksek kaliteli ses iletimi."
                }
              ].map((tech, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <tech.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{tech.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="fiyatlandırma" className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Basit ve Şeffaf Fiyatlandırma
            </h2>
            <p className="text-lg text-muted-foreground">
              İhtiyacınıza göre seçin, istediğiniz zaman değiştirin
            </p>
          </div>
          <div className="mb-8 flex justify-center">
            <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as "monthly" | "yearly")} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Aylık</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yıllık
                  <Badge variant="secondary" className="ml-2">%20 İndirim</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {Object.entries(pricingPlans).map(([key, plan]) => (
              <Card key={key} className={key === "pro" ? "border-primary border-2 relative" : ""}>
                {key === "pro" && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Popüler</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    {typeof plan[billingPeriod] === "number" ? (
                      <>
                        <span className="text-4xl font-bold">
                          {plan[billingPeriod].toLocaleString("tr-TR")}₺
                        </span>
                        <span className="text-muted-foreground">
                          /{billingPeriod === "monthly" ? "ay" : "yıl"}
                        </span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Özel</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={key === "pro" ? "default" : "outline"}
                  >
                    Başla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section id="geliştiriciler" className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Geliştiriciler İçin
              </h2>
              <p className="text-lg text-muted-foreground">
                Güçlü API'ler ve araçlarla entegrasyon yapın
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Code,
                  title: "REST API",
                  description: "RESTful API ile tüm özellikleri programatik olarak yönetin ve entegre edin.",
                  cta: "API Dokümantasyonu",
                  href: "#"
                },
                {
                  icon: Webhook,
                  title: "Webhook",
                  description: "Gerçek zamanlı olay bildirimleri alın ve sistemlerinizi senkronize tutun.",
                  cta: "Webhook Rehberi",
                  href: "#"
                },
                {
                  icon: FileText,
                  title: "SDK & Dokümantasyon",
                  description: "Popüler programlama dilleri için SDK'lar ve kapsamlı dokümantasyon.",
                  cta: "Dokümantasyon",
                  href: "#"
                }
              ].map((dev, index) => (
                <Card key={index} className="transition-shadow">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <dev.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{dev.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">{dev.description}</p>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      {dev.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Müşteri Hizmetlerinizi Bugün Otomatikleştirin
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                14 gün ücretsiz deneme ile başlayın. Kredi kartı gerektirmez, istediğiniz zaman iptal edin.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="text-lg px-8">
                  Hemen Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Satış Ekibi ile Görüş
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Chat Bot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-110"
          aria-label="Chat bot aç"
          onClick={() => {
            // Chat bot açma fonksiyonu buraya eklenecek
            console.log("Chat bot açıldı");
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path 
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" 
              fill="currentColor"
            />
            <path 
              d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" 
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

    </div>
  );
}
