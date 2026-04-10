import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { apiUrl } from "@/lib/api";

interface ExternalCountry { id: number; name: string; code: string; is_default: boolean; }
interface ExternalState   { id: number; name: string; abbreviation: string; country_id: number; }
interface ExternalCity    { id: number; name: string; state_id: number; }

export interface LocationValue {
  // Text names (kept for backward compat / display)
  countryName: string;
  stateName: string;
  cityName: string;
  // External IDs
  countryId: number | undefined;
  stateId: number | undefined;
  cityId: number | undefined;
}

interface Props {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  countryError?: boolean;
  stateError?: boolean;
  cityError?: boolean;
  showErrors?: boolean;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path));
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const json = await res.json() as { success: boolean; data: T };
  return json.data;
}

const ExternalLocationSelector: React.FC<Props> = ({
  value,
  onChange,
  countryError = false,
  stateError = false,
  cityError = false,
  showErrors = false,
}) => {
  const [countries, setCountries]   = useState<ExternalCountry[]>([]);
  const [states, setStates]         = useState<ExternalState[]>([]);
  const [cities, setCities]         = useState<ExternalCity[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates]       = useState(false);
  const [loadingCities, setLoadingCities]       = useState(false);

  // Load countries once on mount
  useEffect(() => {
    fetchJson<ExternalCountry[]>('/api/external-data/countries')
      .then(data => {
        // Put default country (US) first
        const sorted = [...data].sort((a, b) =>
          a.is_default === b.is_default ? a.name.localeCompare(b.name) : a.is_default ? -1 : 1
        );
        setCountries(sorted);
      })
      .catch(err => console.error('Failed to load countries:', err))
      .finally(() => setLoadingCountries(false));
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (!value.countryId) { setStates([]); return; }
    setLoadingStates(true);
    fetchJson<ExternalState[]>(`/api/external-data/states?country_id=${value.countryId}`)
      .then(data => setStates(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(err => console.error('Failed to load states:', err))
      .finally(() => setLoadingStates(false));
  }, [value.countryId]);

  // Load cities when state changes
  useEffect(() => {
    if (!value.stateId) { setCities([]); return; }
    setLoadingCities(true);
    fetchJson<ExternalCity[]>(`/api/external-data/cities?state_id=${value.stateId}`)
      .then(data => setCities(data.sort((a, b) => a.name.localeCompare(b.name))))
      .catch(err => console.error('Failed to load cities:', err))
      .finally(() => setLoadingCities(false));
  }, [value.stateId]);

  const handleCountryChange = (idStr: string) => {
    const country = countries.find(c => String(c.id) === idStr);
    if (!country) return;
    onChange({ countryName: country.name, stateName: '', cityName: '', countryId: country.id, stateId: undefined, cityId: undefined });
  };

  const handleStateChange = (idStr: string) => {
    const state = states.find(s => String(s.id) === idStr);
    if (!state) return;
    onChange({ ...value, stateName: state.name, cityName: '', stateId: state.id, cityId: undefined });
  };

  const handleCityChange = (idStr: string) => {
    const city = cities.find(c => String(c.id) === idStr);
    if (!city) return;
    onChange({ ...value, cityName: city.name, cityId: city.id });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Country */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">Country *</Label>
        <Select
          value={value.countryId !== undefined ? String(value.countryId) : ''}
          onValueChange={handleCountryChange}
          disabled={loadingCountries}
        >
          <SelectTrigger className={`w-full ${countryError && showErrors ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={loadingCountries ? 'Loading…' : 'Select a country'} />
          </SelectTrigger>
          <SelectContent>
            {countries.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {countryError && showErrors && (
          <p className="mt-1 text-sm text-red-600">Country is required</p>
        )}
      </div>

      {/* State */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</Label>
        <Select
          value={value.stateId !== undefined ? String(value.stateId) : ''}
          onValueChange={handleStateChange}
          disabled={!value.countryId || loadingStates}
        >
          <SelectTrigger className={`w-full ${stateError && showErrors ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={loadingStates ? 'Loading…' : !value.countryId ? 'Select country first' : 'Select a state'} />
          </SelectTrigger>
          <SelectContent>
            {states.map(s => (
              <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {stateError && showErrors && (
          <p className="mt-1 text-sm text-red-600">State/Province is required</p>
        )}
      </div>

      {/* City */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-1">City *</Label>
        <Select
          value={value.cityId !== undefined ? String(value.cityId) : ''}
          onValueChange={handleCityChange}
          disabled={!value.stateId || loadingCities}
        >
          <SelectTrigger className={`w-full ${cityError && showErrors ? 'border-red-500' : ''}`}>
            <SelectValue placeholder={loadingCities ? 'Loading…' : !value.stateId ? 'Select state first' : 'Select a city'} />
          </SelectTrigger>
          <SelectContent>
            {cities.map(c => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cityError && showErrors && (
          <p className="mt-1 text-sm text-red-600">City is required</p>
        )}
      </div>
    </div>
  );
};

export default ExternalLocationSelector;
