import Link from "next/link";
import { MEDIA_FILTER_CATEGORIES } from "@/lib/news-data";

type MediaCategoryFilterProps = {
  activeCategory: string;
};

export default function MediaCategoryFilter({
  activeCategory,
}: MediaCategoryFilterProps) {
  return (
    <div className="media-filter-row">
      {MEDIA_FILTER_CATEGORIES.map((filter) => {
        const href = filter.value
          ? `/media?category=${encodeURIComponent(filter.value)}`
          : "/media";
        const isActive = activeCategory === filter.value;

        return (
          <Link
            key={filter.label}
            href={href}
            className={isActive ? "media-filter-btn active" : "media-filter-btn"}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
