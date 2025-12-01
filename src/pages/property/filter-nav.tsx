import BannerAds from '@/components/common/ads/banner-ads';
import ImageAds from '@/components/common/ads/image-ads';
import PropertyMiniCard from '@/components/common/cards/property-mini-card';
import HeroSection from '@/components/common/hero-section';
import {
  type PropertyCategory,
  type PropertyPriceType,
  type PropertyPurpose,
} from '@/interfaces/property/property.interface';
import { layoutService } from '@/services/layout.service';
import { heroImage } from '@/utils/shared';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PropertyMiniCardSkeleton from '@/components/common/cards/property/skeletons/property-mini-card-skeleton';
import ImageAdsSkeleton from '@/components/common/ads/image-ads-skeleton';
import BannerAdsSkeleton from '@/components/common/ads/banner-ads-skeleton';

// Helper component for a single layout block
const FilterLayoutBlock = ({
  properties,
  imageAd,
  bannerAd,
  isLoading,
}: any) => {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <PropertyMiniCardSkeleton key={`sk-top-${i}`} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[...Array(2)].map((_, i) => (
            <PropertyMiniCardSkeleton key={`sk-bottom-${i}`} />
          ))}
          <div className="lg:col-span-2">
            <ImageAdsSkeleton />
          </div>
        </div>
        <div className="mb-4">
          <BannerAdsSkeleton />
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* 4 properties in the first row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {properties.slice(0, 4).map((p: any) => (
          <PropertyMiniCard key={p._id} property={p} />
        ))}
      </div>
      {/* 2 properties and 1 image ad in the second row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {properties.slice(4, 6).map((p: any) => (
          <PropertyMiniCard key={p._id} property={p} />
        ))}
        {imageAd && (
          <div className="lg:col-span-2 h-full">
            <ImageAds ads={imageAd} />
          </div>
        )}
      </div>
      {/* Banner ad below */}
      {bannerAd && (
        <div className="mb-4">
          <BannerAds ads={bannerAd} />
        </div>
      )}
    </div>
  );
};

export default function FilterNav() {
  const [params] = useSearchParams();
  const purpose = params.get('purpose') as PropertyPurpose;
  const category = params.get('category') as PropertyCategory;
  const price_type = params.get('price_type') as PropertyPriceType;
  const { t } = useTranslation();

  const queryKey = useMemo(
    () => ['filter-nav-layout', purpose, category, price_type],
    [purpose, category, price_type],
  );

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      layoutService.getFilterNavLayout({
        purpose,
        category,
        price_type,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="py-12">
      <HeroSection
        title={t('pages.category_page.title')}
        img={heroImage}
        className="text-white"
      />
      <div className="flex flex-col items-center gap-y-4 mt-8">
        <FilterLayoutBlock
          properties={data?.properties?.slice(0, 6)}
          imageAd={data?.imageAds?.[0]}
          bannerAd={data?.bannerAds?.[0]}
          isLoading={isLoading}
        />
        <FilterLayoutBlock
          properties={data?.properties?.slice(6, 12)}
          imageAd={data?.imageAds?.[1]}
          bannerAd={data?.bannerAds?.[1]}
          isLoading={false} // Skeletons only for the first block
        />

        {!isLoading && !data?.properties?.length && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-2">
              {t('pages.main_page.no_results_title')}
            </h2>
            <p className="text-gray-500">
              {t('pages.main_page.no_results_subtitle')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
