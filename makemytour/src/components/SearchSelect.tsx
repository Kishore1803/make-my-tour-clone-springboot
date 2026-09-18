import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

interface SearchSelectProps {
  option: {
    label: string;
    value: string;
    subtitle?: string;
  }[];
  placeholder: string;
  value: string;
  onchange: (value: string) => void;
  icon: React.ReactNode;
  subtitle?: string;
}

const SearchSelect = ({
  option,
  placeholder,
  value,
  onchange,
  icon,
  subtitle,
}: SearchSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = option.filter((item) =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-xl border border-gray-300 bg-white p-4 transition-all duration-300 hover:border-blue-500 hover:shadow-lg"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 text-blue-600">{icon}</div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {placeholder}
            </p>

            <input
              type="text"
              value={searchTerm}
              placeholder={`Search ${placeholder}`}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              className="mt-1 w-full bg-transparent text-lg font-semibold text-gray-900 outline-none placeholder:text-gray-400"
            />

            {subtitle && (
              <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          <ScrollArea className="h-64">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  className="flex w-full justify-start rounded-none border-b border-gray-100 px-4 py-4 text-left hover:bg-blue-50"
                  onClick={() => {
                    onchange(item.value);
                    setSearchTerm(item.label);
                    setIsOpen(false);
                  }}
                >
                  <div className="text-left">
                    <p className="text-base font-semibold text-gray-800">
                      {item.label}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500">{item.subtitle}</p>
                    )}
                  </div>
                </Button>
              ))
            ) : (
              <div className="p-5 text-center text-gray-500">
                No Results Found
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
