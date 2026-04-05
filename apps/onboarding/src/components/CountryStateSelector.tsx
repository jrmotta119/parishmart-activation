import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Import ISO libraries
import countries from "i18n-iso-countries";
import iso3166 from "iso-3166-2";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register English locale for countries
countries.registerLocale(enLocale);

interface CountryStateValue {
  country: string; // ISO 3166-1 alpha-2 (e.g., "US", "CA")
  subdivision: string; // ISO 3166-2 code (e.g., "US-FL") or free text
}

interface CountryStateSelectorProps {
  value: CountryStateValue;
  onChange: (value: CountryStateValue) => void;
  countryError?: boolean;
  stateError?: boolean;
  showErrors?: boolean;
  countryLabel?: string;
  stateLabel?: string;
}

const CountryStateSelector: React.FC<CountryStateSelectorProps> = ({
  value,
  onChange,
  countryError = false,
  stateError = false,
  showErrors = false,
  countryLabel = "Country *",
  stateLabel = "State/Province *",
}) => {
  const [subdivisions, setSubdivisions] = useState<Array<{ code: string; name: string }>>([]);
  const [hasOfficialSubdivisions, setHasOfficialSubdivisions] = useState(false);

  // Get all countries sorted alphabetically
  const countryList = Object.entries(countries.getNames("en"))
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Update subdivisions when country changes
  useEffect(() => {
    if (value.country) {
      try {
        const countrySubdivisions = iso3166.country(value.country);

        if (countrySubdivisions && countrySubdivisions.sub && Object.keys(countrySubdivisions.sub).length > 0) {
          const subdivisionList = Object.entries(countrySubdivisions.sub)
            .map(([code, subData]: [string, any]) => ({
              code: code,
              name: subData.name,
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));

          setSubdivisions(subdivisionList);
          setHasOfficialSubdivisions(true);
        } else {
          setSubdivisions([]);
          setHasOfficialSubdivisions(false);
        }
      } catch (error) {
        // Country not found or no subdivisions
        setSubdivisions([]);
        setHasOfficialSubdivisions(false);
      }
    } else {
      setSubdivisions([]);
      setHasOfficialSubdivisions(false);
    }
  }, [value.country]);

  const handleCountryChange = (countryCode: string) => {
    onChange({
      country: countryCode,
      subdivision: "", // Reset subdivision when country changes
    });
  };

  const handleSubdivisionChange = (subdivisionValue: string) => {
    onChange({
      country: value.country,
      subdivision: subdivisionValue,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Country Select */}
      <div>
        <Label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {countryLabel}
        </Label>
        <Select value={value.country} onValueChange={handleCountryChange}>
          <SelectTrigger
            className={`w-full ${
              countryError && showErrors ? "border-red-500" : ""
            }`}
          >
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countryList.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {countryError && showErrors && (
          <p className="mt-1 text-sm text-red-600">Country is required</p>
        )}
      </div>

      {/* State/Province Select or Input */}
      <div>
        <Label
          htmlFor="subdivision"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {hasOfficialSubdivisions ? stateLabel : "State/Province (optional)"}
        </Label>

        {hasOfficialSubdivisions ? (
          // Show dropdown for countries with official subdivisions
          <Select value={value.subdivision} onValueChange={handleSubdivisionChange}>
            <SelectTrigger
              className={`w-full ${
                stateError && showErrors ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select a state/province" />
            </SelectTrigger>
            <SelectContent>
              {subdivisions.map((subdivision) => (
                <SelectItem key={subdivision.code} value={subdivision.code}>
                  {subdivision.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          // Show text input for countries without official subdivisions
          <Input
            id="subdivision"
            value={value.subdivision}
            onChange={(e) => handleSubdivisionChange(e.target.value)}
            placeholder="State/Province"
            className={`w-full ${
              stateError && showErrors ? "border-red-500" : ""
            }`}
          />
        )}

        {stateError && showErrors && hasOfficialSubdivisions && (
          <p className="mt-1 text-sm text-red-600">State/Province is required</p>
        )}
      </div>
    </div>
  );
};

export default CountryStateSelector;