import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "AI Asistanlar ile Müşteri Deneyimini Dönüştürmek",
      description: "Yapay zeka destekli müşteri hizmetlerinin işletmenize nasıl değer kattığını keşfedin.",
      category: "AI & Teknoloji",
      date: "15 Ocak 2024",
      author: "AIAsist Ekibi",
      readTime: "5 dk okuma"
    },
    {
      id: 2,
      title: "Restoran Sektöründe AI: Masa Rezervasyonundan Sipariş Yönetimine",
      description: "Restoran işletmecileri için AI çözümlerinin operasyonel verimliliği nasıl artırdığını öğrenin.",
      category: "Sektör",
      date: "10 Ocak 2024",
      author: "AIAsist Ekibi",
      readTime: "7 dk okuma"
    },
    {
      id: 3,
      title: "E-ticaret'te AI Chatbot'ların Gücü",
      description: "E-ticaret sitenizde AI chatbot kullanarak satışları nasıl artırabileceğinizi keşfedin.",
      category: "E-ticaret",
      date: "5 Ocak 2024",
      author: "AIAsist Ekibi",
      readTime: "6 dk okuma"
    },
    {
      id: 4,
      title: "KVKK ve GDPR Uyumlu AI Çözümleri",
      description: "Veri güvenliği ve gizlilik standartlarına uyumlu AI asistan çözümleri hakkında bilgi edinin.",
      category: "Güvenlik",
      date: "28 Aralık 2023",
      author: "AIAsist Ekibi",
      readTime: "8 dk okuma"
    },
    {
      id: 5,
      title: "7/24 Müşteri Desteği: AI ile Kesintisiz Hizmet",
      description: "AI asistanlar ile kesintisiz müşteri desteği sağlamanın avantajlarını öğrenin.",
      category: "Müşteri Hizmetleri",
      date: "20 Aralık 2023",
      author: "AIAsist Ekibi",
      readTime: "5 dk okuma"
    },
    {
      id: 6,
      title: "SaaS Şirketleri için AI Destekli Onboarding",
      description: "Kullanıcı onboarding süreçlerini AI ile nasıl optimize edebileceğinizi keşfedin.",
      category: "SaaS",
      date: "15 Aralık 2023",
      author: "AIAsist Ekibi",
      readTime: "6 dk okuma"
    }
  ];

  const categories = ["Tümü", "AI & Teknoloji", "Sektör", "E-ticaret", "Güvenlik", "Müşteri Hizmetleri", "SaaS"];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <section className="w-full px-4 pt-24 pb-12 md:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Blog
          </h1>
          <p className="mb-8 text-base text-muted-foreground sm:text-lg">
            AI teknolojileri, müşteri deneyimi ve iş dünyasındaki trendler hakkında güncel içerikler
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="w-full px-4 py-8 md:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "Tümü" ? "default" : "secondary"}
                className="cursor-pointer px-4 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group flex flex-col border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card">
                <CardHeader>
                  <div className="mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between pt-0">
                  <div className="mb-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <div>{post.readTime}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground">
                    Devamını Oku
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

