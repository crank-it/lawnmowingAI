"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddressSuggestion {
  address: string;
  suburb: string;
  city: string;
  lat: number;
  lng: number;
}

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function AddressInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = "Enter your address...",
  className,
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Search for addresses
  const searchAddresses = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search-address?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Address search failed:", error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchAddresses(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, searchAddresses]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      setShowSuggestions(false);
      onSubmit();
    }
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onChange(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    // Focus back on input then submit
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col sm:flex-row gap-2 sm:gap-3 bg-card rounded-2xl p-2 shadow-beefy-md",
          className
        )}
      >
        <div className="flex-1 flex items-center gap-2 sm:gap-3 px-3 sm:px-4">
          <span className="text-xl sm:text-2xl">📍</span>
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="border-0 bg-transparent text-base sm:text-lg placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 sm:h-12"
            disabled={isLoading}
            autoComplete="off"
          />
          {isSearching && (
            <span className="text-muted-foreground text-sm animate-pulse">
              🔍
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "bg-gradient-to-br from-lawn-orange to-lawn-orange-dark text-white",
            "font-heading font-bold rounded-xl px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg",
            "transition-all hover:-translate-y-0.5 hover:shadow-lg",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
            "sm:min-w-[160px]"
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Analyzing...
            </span>
          ) : (
            "Get Quote →"
          )}
        </Button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-beefy-md border border-border overflow-hidden z-50">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li key={`${suggestion.address}-${index}`}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-secondary transition-colors",
                    "flex items-start gap-3",
                    index === selectedIndex && "bg-secondary"
                  )}
                >
                  <span className="text-lg mt-0.5">📍</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {suggestion.address}
                    </p>
                    {suggestion.suburb && (
                      <p className="text-sm text-muted-foreground">
                        {suggestion.suburb}
                        {suggestion.city && suggestion.city !== suggestion.suburb &&
                          `, ${suggestion.city}`}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 bg-muted/50 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              🇳🇿 New Zealand addresses only
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
