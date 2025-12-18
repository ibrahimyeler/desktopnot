"use client";

import ProductGrid from '../../../components/flashUrunler/ProductGrid';
import SearchDesktopHeader from './SearchDesktopHeader';
import SearchLoadingSpinner from '@/components/search/SearchLoadingSpinner';
import SearchError from './SearchError';

interface SortOption {
  id: string;
  name: string;
  value: string;
}

interface SearchResultsProps {
  searchQuery: string;
  loading: boolean;
  minimumLoadingPassed: boolean;
  maxLoadingReached: boolean;
  error: string | null;
  onRetry: () => void;
  sortedProducts: any[];
  filteredProducts: any[];
  totalProducts: number;
  currentSortType: string;
  sortOptions: SortOption[];
  onSortChange: (sortType: string) => void;
  onSortedProducts: (products: any[]) => void;
  isAdultVerified: boolean;
  loadMoreTriggerRef: React.RefObject<HTMLDivElement | null>;
  loadingMore: boolean;
  hasMore: boolean;
}

export default function SearchResults({
  searchQuery,
  loading,
  minimumLoadingPassed,
  maxLoadingReached,
  error,
  onRetry,
  sortedProducts,
  filteredProducts,
  totalProducts,
  currentSortType,
  sortOptions,
  onSortChange,
  onSortedProducts,
  isAdultVerified,
  loadMoreTriggerRef,
  loadingMore,
  hasMore
}: SearchResultsProps) {
  if (loading || !minimumLoadingPassed) {
    return <SearchLoadingSpinner />;
  }

  if (error) {
    return <SearchError error={error} onRetry={onRetry} />;
  }

  const shouldShowSpinner =
    sortedProducts.length === 0 && (minimumLoadingPassed || maxLoadingReached);

  return (
    <>
      <SearchDesktopHeader
        searchQuery={searchQuery}
        loading={loading}
        sortedProducts={sortedProducts}
        totalProducts={totalProducts}
        filteredProducts={filteredProducts}
        currentSortType={currentSortType}
        sortOptions={sortOptions}
        onSortedProducts={onSortedProducts}
        onSortChange={onSortChange}
      />

      {shouldShowSpinner ? (
        <SearchLoadingSpinner />
      ) : (
        <>
          <ProductGrid
            products={sortedProducts as any}
            isAdultCategory={false}
            isAdultVerified={isAdultVerified}
            showAgeVerification={false}
            columnsPerRow={4}
            hideAddToBasket
            openInNewTabOnDesktop
            disablePrefetch
          />

          <div ref={loadMoreTriggerRef} className="flex justify-center items-center py-8">
            {(loadingMore || (hasMore && sortedProducts.length > 0)) && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            )}
          </div>
        </>
      )}
    </>
  );
}


