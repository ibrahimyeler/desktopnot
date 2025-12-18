# Ürün Detay Sayfası İncelemesi

## Genel Bakış
`app/urunler/[slug]/ProductPageClient.tsx` dosyasındaki `ProductPageClient` bileşeni, ürün detay sayfasının tüm görsel yerleşimini ve veri yönetimini tek bir client bileşende topluyor. İlk render'da (SSR'dan gelen `initial*` prop'ları yoksa) ürün, varyant, kategori ve kullanıcı etkileşimlerine dair veriler client tarafında çekiliyor; bulunan bilgiler ilgili alt bileşenlere props olarak dağıtılıyor.

```879:940:app/urunler/[slug]/ProductPageClient.tsx
  return (
    <>
      <Header showBackButton={true} onBackClick={() => router.back()} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-0 md:pt-0 pb-60 md:pb-8 overflow-x-hidden">
        {/* Mobilde ürün görsellerini header'ın hemen altında, tek satırda ve tam ekran genişliğinde göster */}
        {product && (
          <div
            className="lg:hidden mb-3 overflow-hidden"
            style={{
              position: 'relative',
              left: '50%',
              right: '50%',
              marginLeft: '-50vw',
              marginRight: '-50vw',
              width: '100vw',
              maxWidth: '100vw'
            }}
          >
            <ProductImages 
              images={product.medias || product.images} 
              productName={product.name} 
              isAdultCategory={false}
              isAdultVerified={isAdultVerified}
              showAgeVerification={showAgeVerification}
              stock={product.stock}
              status={product.status}
              badges={product.badges}
            />
          </div>
        )}

        <div className="w-full mt-0 lg:mt-5">
          
          {/* Breadcrumb - sadece desktop görünümünde göster */} 
          <div className="hidden lg:block mb-2 lg:mb-3 px-3 py-1 md:p-3 -ml-1">
            <Breadcrumb 
              items={breadcrumbItems}
              className="text-xs sm:text-sm"
            />
          </div>

          {/* Kampanya Banner */}
          {campaign && isProductInCampaign && (
            <CampaignBanner
              campaign={campaign}
              productSlug={productSlug}
              categoryId={product.categoryId || ''}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Sol Sütun - Ürün Resmi (sadece desktop) */}
            <div className="hidden lg:block lg:col-span-4">
              <ProductImages 
                images={product.medias || product.images} 
                productName={product.name} 
                isAdultCategory={false}
                isAdultVerified={isAdultVerified}
                showAgeVerification={showAgeVerification}
                stock={product.stock}
                status={product.status}
                badges={product.badges}
              />
            </div>
```

```942:1055:app/urunler/[slug]/ProductPageClient.tsx
            {/* Orta Sütun - Ürün Bilgileri */}
            <div className="lg:col-span-5 space-y-4 md:space-y-6">
              <ProductHeader 
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  categoryId: product.categoryId,
                  brand: {
                    name: (product.brandV2 || product.brand_v2 || product.brand)?.name || 'Bilinmeyen Marka',
                    slug: (product.brandV2 || product.brand_v2 || product.brand)?.slug || ''
                  },
                  rating: {
                    average: dynamicRating.average > 0 ? dynamicRating.average : (product.rating || 0),
                    count: dynamicRating.count > 0 ? dynamicRating.count : (product.review_count || 0)
                  },
                  reviews: {
                    total: product.review_count || 0,
                    questions: product.question_count || 0,
                    answers: product.review_count || 0
                  },
                }}
                questions={questions}
              />
              
              {availableVariants && availableVariants.length > 0 && (
                <ProductVariants
                  variants={[]}
                  availableVariants={availableVariants}
                  onVariantSelect={handleVariantSelect}
                  onProductChange={handleProductChange}
                  onProductUpdate={handleProductUpdate}
                  currentSlug={params.slug as string}
                />
              )}

              <ProductActions
                product={selectedProduct || product}
                selectedVariantId={selectedVariantId}
                selectedVariants={selectedVariants}
                hasSizeVariants={product.variants?.some(v => 
                  v.name.toLowerCase().includes('beden') || 
                  v.name.toLowerCase().includes('yaş') || 
                  v.name.toLowerCase().includes('yas')
                )}
                onFavoriteClick={handleFavoriteClick}
                isInFavorites={isInFavorites(product.id)}
                campaign={campaign}
                isProductInCampaign={isProductInCampaign}
                getCampaignQuantity={getCampaignQuantity}
                mobileButtonLoading={mobileButtonLoading}
                setMobileButtonLoading={setMobileButtonLoading}
              />

              {/* Teslimat Bilgileri Widget */}
              <div className="mt-6">
                <ProductDeliveryWidget 
                  sellerId={sellerId}
                  cargoCompany={product.seller_v2?.cargo_company || product.seller?.cargo_company}
                  deliveryTime={product.seller?.shipping_policy?.general?.delivery_time}
                  termin={product.termin}
                  className="mb-4"
                />
              </div>

              {/* Öne Çıkan Özellikler - Teslimat bilgilerinin altında */}
              <div className="mt-4">
                <ProductHighlights product={{
                  attributes: product.attributes?.filter(attr => attr.name && (attr.value_name || attr.value)).map(attr => ({
                    name: attr.name,
                    value_name: attr.value_name || attr.value,
                    value: attr.value_name || attr.value,
                    value_slug: (attr.value_name || attr.value)?.toLowerCase().replace(/\/s+/g, '-') || '',
                    slug: attr.name?.toLowerCase().replace(/\/s+/g, '-') || '',
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                  })),
                  brand: product.brandV2 || product.brand_v2 || product.brand,
                  category: product.category_v2,
                  stock: product.stock,
                  status: product.status
                }} />
                {/* ... */}
              </div>

              {/* Kampanya Fiyat Badge */}
              {campaign && isProductInCampaign && (
                <CampaignPriceBadge
                  productId={product.id}
                  categoryId={product.categoryId}
                />
              )}
            </div>
```

```1086:1223:app/urunler/[slug]/ProductPageClient.tsx
          {/* Diğer Satıcılar */}
          {initialOtherSellers && initialOtherSellers.length > 0 && (
            <div className="mt-8">
              <OtherSellers 
                productSlug={productSlug} 
                currentSeller={product.seller_v2 || product.seller} 
                otherSellers={initialOtherSellers} 
              />
            </div>
          )}

          {/* İlgili Ürünler */}
          {initialRelatedProducts && initialRelatedProducts.length > 0 && (
            <div className="mt-8">
              <RelatedPurchases 
                productSlug={productSlug} 
                relatedProducts={initialRelatedProducts} 
              />
            </div>
          )}

          {/* Benzer Ürünler */}
          {(() => {
            const categoryId = (product as any).categoryV2?.slug || product.category_v2?.slug;
       
            return (
              <SimilarProducts 
                products={similarProducts}
                loading={similarProductsLoading}
                currentProductId={product.id}
                currentCategoryId={categoryId}
              />
            );
          })()}

          {/* Müşteri Yorumları */}
          <div id="reviews" className="mt-8">
            <CustomerReviews 
              productId={product?.id}
              productSlug={productSlug} 
              onRatingUpdate={handleRatingUpdate}
              productName={product?.name}
              productImage={product?.medias?.[0]?.url || product?.images?.[0]?.url}
              productPrice={product?.price || product?.campaign_price}
            />
          </div>

          {/* Tamamlayıcı Ürünler */}
          {(() => {
            const categoryId = (product as any).categoryV2?.slug || product.category_v2?.slug;
         
            return (
              <ComplementaryProducts 
                products={complementaryProducts}
                loading={complementaryProductsLoading}
                isAdultCategory={false}
                isAdultVerified={isAdultVerified}
                showAgeVerification={showAgeVerification}
                currentProductId={product.id}
                currentCategoryId={categoryId}
              />
            );
          })()}

          {/* Ürün Bilgileri */}
          <div id="product-details" className="mt-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Ürün Bilgileri</h2>
                {/* Öne Çıkan Özellikler */}
                {/* ... */}
              </div>
            </div>
          </div>

          {/* Ürün Soru ve Cevapları - Footer'ın üstünde */}
          <div id="questions" className="mt-8 mb-8">
            <ProductQuestions
              productId={product.id}
              questions={questions}
              loading={questionsLoading}
              totalQuestions={questions.length}
              sellerName={product.seller_v2?.name || product.seller?.name || 'Satıcı'}
              onAskQuestion={() => setShowAskQuestionModal(true)}
            />
          </div>
        </div>
      </main>
      {/* ... */}
      <Footer />
      <ScrollToTop />
      <AskQuestionModal
        isOpen={showAskQuestionModal}
        onClose={() => setShowAskQuestionModal(false)}
        productId={product.id}
        productName={product.name}
        sellerName={product.seller_v2?.name || product.seller?.name || 'Satıcı'}
        onQuestionSubmitted={async () => {
          // Soru gönderildikten sonra soruları yenile
          setQuestionsLoading(true);
          try {
            const response = await fetch(`${API_V1_URL}/products/${product.id}/questions?page=1&limit=10`);
            const data = await response.json();
            if (data.meta.status === 'success') {
              setQuestions(data.data || []);
            }
          } catch (error) {
      
          } finally {
            setQuestionsLoading(false);
          }
        }}
      />
    </>
  );
```

## Component Kullanımları
Aşağıdaki tablo, `ProductPageClient` içinde gerçekten render edilen bileşenleri, kaynak dosyalarını ve görevlerini özetler:

| Bileşen | Kaynak | Sorumluluk | Öne Çıkan Props / Notlar |
| --- | --- | --- | --- |
| `Header` / `Footer` | `components/layout` | Sayfayı çerçeveleyen layout | `showBackButton`, `onBackClick` ile gezinme kontrolü |
| `ScrollToTop` | `components/ui/ScrollToTop` | Sayfa sonunda hızlı yukarı çıkış | Sürekli render edilerek görünürlük yönetir |
| `Breadcrumb` | `components/common/Breadcrumb` | Dinamik kategori yolunu gösterir | `breadcrumbItems` state'i async kategori aramalarından beslenir |
| `CampaignBanner` & `CampaignPriceBadge` | `components/product/` | Kampanya varlığını öne çıkarır | `useCampaign` hook'undan gelen `campaign` bilgisiyle koşullu |
| `ProductImages` | `components/product/ProductImages` | Görsel galeriyi mobil/desktop uyumlu gösterir | `medias` öncelikli, yoksa `images`; yaş doğrulaması flag'leri |
| `ProductHeader` | `components/product/details/ProductHeader` | Ürün adı, marka, fiyat, rating | Dinamik `dynamicRating` state'iyle güncellenir |
| `ProductVariants` | `components/product/details/ProductVariants` | Varyant kombinasyonlarını listeler | `availableVariants`, `onProductChange/Update` callback'leri |
| `ProductActions` | `components/product/details/ProductActions` | Sepete ekleme/favori işlemleri | Hem içeride hem footer öncesi mobil kopyası var |
| `ProductDeliveryWidget` | `components/product/details/ProductDeliveryWidget` | Teslimat/kargo bilgisini gösterir | `sellerId`, `cargoCompany`, `termin` |
| `ProductHighlights` | `components/product/details/ProductHighlights` | Seçili attribute'ları öne çıkarır | İlk 8 attribute filtrelenip normalize ediliyor |
| `ProductSidebar` | `components/product/details/ProductSidebar` | Satıcı, marka, diğer satıcı CTA'ları | SSR'dan gelen `initialOtherSellers` ve `reviews` ile besleniyor |
| `OtherSellers` | `components/product/OtherSellers` | Alternatif satıcıları listeler | Sadece `initialOtherSellers` doluysa render edilir |
| `RelatedPurchases` | `components/product/RelatedPurchases` | Server-side hazırlanmış ilgili ürünleri gösterir | `initialRelatedProducts` prop'u |
| `SimilarProducts` & `ComplementaryProducts` | `components/product/` | Boş state'lerle başlar; future client fetch için placeholder | `similarProducts` / `complementaryProducts` state'leri |
| `CustomerReviews` | `components/product/CustomerReviews` | Yorumları ve rating güncellemesini yönetir | `onRatingUpdate` callback'i `dynamicRating` state'ini besler |
| `ProductQuestions` | `components/product/ProductQuestions` | Soru-cevap listesini gösterir | `onAskQuestion` ile modal tetiklenir |
| `AskQuestionModal` | `components/product/AskQuestionModal` | Kullanıcıların soru göndermesini sağlar | Gönderim sonrası `GET /products/{id}/questions` ile refresh |

> Not: `ProductInfo` bileşeni import edilmesine rağmen JSX içinde kullanılmıyor; refactoring sırasında kaldırılmamış bir kalıntı gibi duruyor.

## API Endpointleri
`ProductPageClient` sadece `API_V1_URL` tabanlı endpoint'leri kullanıyor ve hepsi `fetch` ile çağrılıyor. Akış şu şekilde:

1. **Ürün Detayı:** `GET /api/v1/products/{slug}` — ürün temel verileri ve varyant olup olmadığını belirlemek için.
2. **Ürün Varyantları:** `GET /api/v1/products/{productId}/variants` — her iki senaryoda (initial veri var/yok) çağrılıyor.
3. **Kategori Ağacı:** `GET /api/v1/categories` ve fallback olarak `GET /api/v1/categories/{categorySlug}` — breadcrumb üretimi için.
4. **Yorumlar:** `GET /api/v1/products/{productId or slug}/reviews?page=1&limit=10` — SSR'da gelmediyse client tarafında yükleniyor.
5. **Sorular:** `GET /api/v1/products/{productId or slug}/questions?page=1&limit=10` — hem initial fetch hem de soru gönderimi sonrası yenileme.

İlgili `fetch` çağrıları aşağıdaki satırlarda görülebilir:

```563:845:app/urunler/[slug]/ProductPageClient.tsx
  useEffect(() => {
    if (!initialProductData && productSlug) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_V1_URL}/products/${productSlug}`);
          const data = await response.json();
          if (data.meta.status === 'success') {
            setProduct(data.data);
            if (data.data.variants && data.data.variants.length > 0) {
              try {
                const variantsResponse = await fetch(`${API_V1_URL}/products/${data.data.id}/variants`);
                const variantsResponseData = await variantsResponse.json();
                if (variantsResponseData?.data && variantsResponseData.data.length > 0) {
                  setAvailableVariants(variantsResponseData.data);
                } else {
                  setAvailableVariants([data.data]);
                }
              } catch (error) {

                setAvailableVariants([data.data]);
              }
            }
            // ... kategori/breadcrumb hesaplaması `findParentCategories` ile `GET /categories` & `/categories/{slug}`
          } else {
            setError('Ürün bulunamadı');
          }
        } catch (error) {
          setError('Ürün yüklenirken bir hata oluştu');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else if (initialProductData && !initialDataProcessed.current) {
      if (initialProductData.variants && initialProductData.variants.length > 0) {
        const fetchInitialVariants = async () => {
          try {
            const variantsResponse = await fetch(`${API_V1_URL}/products/${initialProductData.id}/variants`);
            const variantsResponseData = await variantsResponse.json();
            if (variantsResponseData?.data && variantsResponseData.data.length > 0) {
              setAvailableVariants(variantsResponseData.data);
            } else {
              setAvailableVariants([initialProductData]);
            }
          } catch (error) {
          
            setAvailableVariants([initialProductData]);
          }
        };
        fetchInitialVariants();
      }
      // ... breadcrumb fallback'leri yine kategori endpoint'lerine dayanıyor
    }
  }, [productSlug, addVisitedProduct]);

  useEffect(() => {
    if (!initialReviews.length && (product?.id || productSlug)) {
      const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
          const reviewsEndpoint = product?.id
            ? `${API_V1_URL}/products/${product.id}/reviews?page=1&limit=10`
            : `${API_V1_URL}/products/${productSlug}/reviews?page=1&limit=10`;
          const response = await fetch(reviewsEndpoint);
          const data = await response.json();
          if (data.meta.status === 'success') {
            setReviews(data.data || []);
          }
        } catch (error) {
        } finally {
          setReviewsLoading(false);
        }
      };
      fetchReviews();
    }
  }, [productSlug, initialReviews.length]);

  useEffect(() => {
    if (!initialQuestions.length && (product?.id || productSlug)) {
      const fetchQuestions = async () => {
        setQuestionsLoading(true);
        try {
          const questionsEndpoint = product?.id
            ? `${API_V1_URL}/products/${product.id}/questions?page=1&limit=10`
            : `${API_V1_URL}/products/${productSlug}/questions?page=1&limit=10`;
          const response = await fetch(questionsEndpoint);
          const data = await response.json();
          if (data.meta.status === 'success') {
            setQuestions(data.data || []);
          }
        } catch (error) {
        } finally {
          setQuestionsLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [productSlug, initialQuestions.length]);
```

```1261:1273:app/urunler/[slug]/ProductPageClient.tsx
        onQuestionSubmitted={async () => {
          // Soru gönderildikten sonra soruları yenile
          setQuestionsLoading(true);
          try {
            const response = await fetch(`${API_V1_URL}/products/${product.id}/questions?page=1&limit=10`);
            const data = await response.json();
            if (data.meta.status === 'success') {
              setQuestions(data.data || []);
            }
          } catch (error) {
         
          } finally {
            setQuestionsLoading(false);
          }
        }}
```

## Hook ve Context Entegrasyonları
`ProductPageClient` içerisindeki durum yönetimi, sepet/favori/auth ve ziyaret edilen ürünler gibi global davranışları bağlayan context'lerle güçlendiriliyor.

```445:520:app/urunler/[slug]/ProductPageClient.tsx
  const [product, setProduct] = useState<ProductResponse['data'] | null>(initialProductData);
  // ... çok sayıda local state
  const { addToBasket } = useBasket();
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addVisitedProduct } = useVisitedProducts();
  const initialDataProcessed = useRef(false);
  const { campaign, isProductInCampaign, getCampaignQuantity } = useCampaign(product?.id || '', product?.categoryId);
```

- `useBasket`: Ürün/variant kombinasyonlarını sepete ekler (`handleAddToBasket`).
- `useFavorites` + `useAuth`: Favori işlemleri ve login zorunluluğu kontrolü.
- `useVisitedProducts`: Görüntülenen ürünü global geçmişe işler.
- `useCampaign`: Kampanya badge/banner'ı için ürünün kampanya durumunu doğrular.

## Notlar
- `ProductInfo` bileşeni import edilmiş ancak render edilmiyor; gereksiz import temizlenebilir.

```23:47:app/urunler/[slug]/ProductPageClient.tsx
import ProductActions from '@/components/product/details/ProductActions';
import ProductInfo from '@/components/product/details/ProductInfo';
import ProductHighlights from '@/components/product/details/ProductHighlights';
```

- `SimilarProducts` ve `ComplementaryProducts` için state'ler tanımlanmış olsa da şu an bir fetch tetiklenmediği için boş koleksiyonla render ediliyor; ileride client-side sorgular eklenmeli veya SSR'dan veri geçilmeli.
- Tüm endpoint'ler `API_V1_URL` üzerinden çalışıyor; `PUBLIC_API_V1_URL` import edilse de kullanılmıyor.
