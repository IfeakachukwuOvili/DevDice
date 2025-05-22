import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export const useDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef: dropdownRef as RefObject<HTMLDivElement>,
  };
};