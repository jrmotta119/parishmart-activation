import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, MapPin, Phone, Globe, ChevronDown, X, Calendar } from "lucide-react";
import parishes from "@/data/preloadedParishes.json";

export interface PreloadedParish {
  id: string;
  name: string;
  address: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  pastor: string;
  email: string;
  website: string;
  deanery: string;
  founded: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
}

const LOGO_COLORS = [
  "#006699", "#2e7d32", "#673ab7", "#d32f2f", "#ed6c02",
  "#00796b", "#5c6bc0", "#8d6e63", "#546e7a", "#7b1fa2",
];

function getInitials(name: string): string {
  const words = name.replace(/Catholic\s+Parish/i, "").trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function getLogoColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

export function ParishLogo({ name, size = 48 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  const color = getLogoColor(name);
  const fontSize = size * 0.38;

  return (
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      <span
        className="font-bold text-white leading-none"
        style={{ fontSize }}
      >
        {initials}
      </span>
    </div>
  );
}

interface ParishSelectorProps {
  onSelect: (parish: PreloadedParish) => void;
  onManualEntry: () => void;
  selectedParish: PreloadedParish | null;
  onClear: () => void;
}

export default function ParishSelector({
  onSelect,
  onManualEntry,
  selectedParish,
  onClear,
}: ParishSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return (parishes as PreloadedParish[]).filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.deanery.toLowerCase().includes(q) ||
        p.zipCode.includes(q)
    ).slice(0, 50);
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (selectedParish) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <ParishLogo name={selectedParish.name} size={56} />
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">{selectedParish.name}</h4>
              <p className="text-sm text-gray-500">{selectedParish.deanery}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white/60 transition-colors"
            title="Clear selection"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          {selectedParish.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>{selectedParish.address}</span>
            </div>
          )}
          {selectedParish.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>{selectedParish.phone}</span>
            </div>
          )}
          {selectedParish.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <a
                href={selectedParish.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006699] hover:underline truncate"
              >
                {selectedParish.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {selectedParish.founded && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
              <span>Founded {selectedParish.founded}</span>
            </div>
          )}
        </div>
        {selectedParish.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">{selectedParish.description}</p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-[#006699] transition-colors bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Search className="h-5 w-5 text-gray-400" />
        <span className="text-gray-500 flex-1">Search for your parish...</span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type parish name, city, or zip code..."
              className="w-full outline-none text-sm placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {search.trim().length < 2 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                <p>Type at least 2 characters to search</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                <p>No parishes found matching "{search}"</p>
              </div>
            ) : (
              filtered.map((parish) => (
                <button
                  key={parish.id}
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-50 last:border-0"
                  onClick={() => {
                    onSelect(parish);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <ParishLogo name={parish.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{parish.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {parish.city}{parish.city && parish.state ? ", " : ""}{parish.state} {parish.zipCode}
                      {parish.deanery ? ` · ${parish.deanery}` : ""}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          <button
            type="button"
            className="w-full px-4 py-3 text-sm text-[#006699] font-medium hover:bg-gray-50 transition-colors border-t border-gray-200 text-left"
            onClick={() => {
              onManualEntry();
              setIsOpen(false);
              setSearch("");
            }}
          >
            My parish isn't listed — enter information manually
          </button>
        </div>
      )}
    </div>
  );
}
