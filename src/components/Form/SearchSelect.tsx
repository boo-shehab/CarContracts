import { useState, useEffect, useRef } from "react";
import axios from "../../services/axios";

interface SearchSelectProps {
  api: string;
  returnedValue: (value: any) => void;
  dropdownItem: (item: any) => React.ReactNode;
  inputValueKey?: string;
  
}

export default function SearchSelect({
  api,
  returnedValue,
  dropdownItem,
  inputValueKey = "",
}: SearchSelectProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      try {
        if (showDropdown) {
          const response = await axios.get(`/${api}?${inputValueKey}=${query}`);
          const data = response.data.data;
          setResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search error", err);
        setResults([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, api]);

  const handleSelect = (item: any) => {
    setQuery(item[inputValueKey] || "");
    setShowDropdown(false);
    returnedValue(item);
  };

  return (
    <div
      className="relative w-full max-w-sm"
      ref={containerRef}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
          setShowDropdown(false);
        }
      }}
    >
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search..."
        autoComplete='off'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((item, index) => (
            <li
              key={index}
              tabIndex={0}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSelect(item)}
            >
              {dropdownItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
