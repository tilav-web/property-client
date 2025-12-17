import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, Search, X, ChevronDown } from "lucide-react";
import {
  categories,
  type CategoryType,
} from "@/interfaces/types/category.type";
import {
  categoryFilterTypes,
  type CategoryFilterType,
} from "@/interfaces/types/category-filter.type";

interface CompactFilterProps {
  onFilterChange?: (params: Record<string, any>) => void;
}

const CompactFilter: React.FC<CompactFilterProps> = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Get current values from URL
  const currentFilters = {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") as CategoryType | null,
    filterCategory: searchParams.get(
      "filterCategory"
    ) as CategoryFilterType | null,
    is_premium: searchParams.get("is_premium") === "true",
    is_new: searchParams.get("is_new") === "true",
    bedrooms: searchParams
      .getAll("bdr")
      .map(Number)
      .filter((n) => !isNaN(n)),
    bathrooms: searchParams
      .getAll("bthr")
      .map(Number)
      .filter((n) => !isNaN(n)),
  };

  const activeFilterCount = Object.entries(currentFilters).reduce(
    (count, [key, value]) => {
      if (value === "" || value === null || value === false) return count;
      if (Array.isArray(value) && value.length === 0) return count;
      return count + 1;
    },
    0
  );

  const handleFilterChange = (key: string, value: any) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (
      value === null ||
      value === "" ||
      value === false ||
      (Array.isArray(value) && value.length === 0)
    ) {
      newSearchParams.delete(key);
    } else if (Array.isArray(value)) {
      // Remove all existing values
      const allKeys = Array.from(newSearchParams.keys());
      allKeys.forEach((paramKey) => {
        if (
          paramKey === key ||
          (key === "bedrooms" && paramKey === "bdr") ||
          (key === "bathrooms" && paramKey === "bthr")
        ) {
          newSearchParams.delete(paramKey);
        }
      });
      // Add new values
      value.forEach((v) => {
        if (key === "bedrooms") {
          newSearchParams.append("bdr", v.toString());
        } else if (key === "bathrooms") {
          newSearchParams.append("bthr", v.toString());
        }
      });
    } else {
      newSearchParams.set(key, value.toString());
    }

    setSearchParams(newSearchParams);
    onFilterChange?.(Object.fromEntries(newSearchParams));
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      handleFilterChange("search", searchValue.trim());
      setShowSearch(false);
    }
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setSearchValue("");
    onFilterChange?.({});
  };

  const handleClearFilter = (key: string) => {
    handleFilterChange(key, key === "search" ? "" : null);
  };

  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4];

  return (
    <div className="w-full">
      {/* Main Filter Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        {/* Left side - Search and Main Filters */}
        <div className="flex items-center gap-2 flex-1">
          {/* Search Button (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Search Input (Desktop) */}
          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <Input
              placeholder="Search properties..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="rounded-r-none"
            />
            <Button onClick={handleSearch} className="rounded-l-none" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Type
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <Checkbox
                    id={`cat-${category}`}
                    checked={currentFilters.category === category}
                    onCheckedChange={(checked) =>
                      handleFilterChange("category", checked ? category : null)
                    }
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category.replace("_", " ")}
                  </label>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          {/* Bedrooms Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Beds
                <ChevronDown className="h-3 w-3" />
                {currentFilters.bedrooms.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                    {currentFilters.bedrooms.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="grid grid-cols-3 gap-2">
                {bedroomOptions.map((bedroom) => (
                  <Button
                    key={bedroom}
                    variant={
                      currentFilters.bedrooms.includes(bedroom)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      const newBedrooms = currentFilters.bedrooms.includes(
                        bedroom
                      )
                        ? currentFilters.bedrooms.filter((b) => b !== bedroom)
                        : [...currentFilters.bedrooms, bedroom];
                      handleFilterChange("bedrooms", newBedrooms);
                    }}
                    className="h-8"
                  >
                    {bedroom}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Bathrooms Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                Baths
                <ChevronDown className="h-3 w-3" />
                {currentFilters.bathrooms.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                    {currentFilters.bathrooms.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-2">
              <div className="grid grid-cols-2 gap-2">
                {bathroomOptions.map((bathroom) => (
                  <Button
                    key={bathroom}
                    variant={
                      currentFilters.bathrooms.includes(bathroom)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      const newBathrooms = currentFilters.bathrooms.includes(
                        bathroom
                      )
                        ? currentFilters.bathrooms.filter((b) => b !== bathroom)
                        : [...currentFilters.bathrooms, bathroom];
                      handleFilterChange("bathrooms", newBathrooms);
                    }}
                    className="h-8"
                  >
                    {bathroom}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Right side - More Filters and Actions */}
        <div className="flex items-center gap-2">
          {/* Active Filter Badge */}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="hidden sm:flex">
              {activeFilterCount} filters
            </Badge>
          )}

          {/* More Filters Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                More
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>More Filters</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Premium/New Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="more-premium"
                      checked={currentFilters.is_premium}
                      onCheckedChange={(checked) =>
                        handleFilterChange("is_premium", checked)
                      }
                    />
                    <label
                      htmlFor="more-premium"
                      className="text-sm font-medium leading-none"
                    >
                      Premium Only
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="more-new"
                      checked={currentFilters.is_new}
                      onCheckedChange={(checked) =>
                        handleFilterChange("is_new", checked)
                      }
                    />
                    <label
                      htmlFor="more-new"
                      className="text-sm font-medium leading-none"
                    >
                      New Only
                    </label>
                  </div>
                </div>

                {/* Filter Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category Filter</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryFilterTypes.map((filterCat) => (
                      <Button
                        key={filterCat}
                        variant={
                          currentFilters.filterCategory === filterCat
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleFilterChange(
                            "filterCategory",
                            currentFilters.filterCategory === filterCat
                              ? null
                              : filterCat
                          )
                        }
                      >
                        {filterCat}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
                <DialogTrigger asChild>
                  <Button size="sm">Apply Filters</Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Input */}
      {showSearch && (
        <div className="lg:hidden p-4 border-b bg-white">
          <div className="flex gap-2">
            <Input
              placeholder="Search properties..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Bar */}
      {activeFilterCount > 0 && (
        <div className="p-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Active:
            </span>

            {currentFilters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {currentFilters.search}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleClearFilter("search")}
                />
              </Badge>
            )}

            {currentFilters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {currentFilters.category.replace("_", " ")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleClearFilter("category")}
                />
              </Badge>
            )}

            {currentFilters.bedrooms.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Beds: {currentFilters.bedrooms.sort((a, b) => a - b).join(",")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleClearFilter("bedrooms")}
                />
              </Badge>
            )}

            {currentFilters.bathrooms.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Baths:{" "}
                {currentFilters.bathrooms.sort((a, b) => a - b).join(",")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleClearFilter("bathrooms")}
                />
              </Badge>
            )}

            {currentFilters.is_premium && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Premium
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleClearFilter("is_premium")}
                />
              </Badge>
            )}

            {currentFilters.is_new && (
              <Badge variant="secondary" className="flex items-center gap-1">
                New
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleClearFilter("is_new")}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Mobile Quick Filters */}
      <div className="lg:hidden">
        <div className="p-2 border-b bg-gray-50">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categoryFilterTypes.map((filterCat) => (
              <Button
                key={filterCat}
                variant={
                  currentFilters.filterCategory === filterCat
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  handleFilterChange(
                    "filterCategory",
                    currentFilters.filterCategory === filterCat
                      ? null
                      : filterCat
                  )
                }
                className="whitespace-nowrap"
              >
                {filterCat}
              </Button>
            ))}

            <Button
              variant={currentFilters.is_premium ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleFilterChange("is_premium", !currentFilters.is_premium)
              }
              className="whitespace-nowrap"
            >
              Premium
            </Button>

            <Button
              variant={currentFilters.is_new ? "default" : "outline"}
              size="sm"
              onClick={() =>
                handleFilterChange("is_new", !currentFilters.is_new)
              }
              className="whitespace-nowrap"
            >
              New
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactFilter;
