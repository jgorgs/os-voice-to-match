import { useState, useMemo, useCallback } from 'react';
import { Position } from '../types';

export const useSearch = (positions: Position[]) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const filteredPositions = useMemo(() => {
    if (!query.trim()) return positions;
    
    const searchTerm = query.toLowerCase();
    return positions.filter(position => 
      position.title.toLowerCase().includes(searchTerm) ||
      position.status.toLowerCase().includes(searchTerm)
    );
  }, [positions, query]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  const handleFocus = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleBlur = useCallback(() => {
    // Delay blur to allow for dropdown interactions
    setTimeout(() => setIsActive(false), 150);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setIsActive(false);
  }, []);

  return {
    query,
    isActive,
    filteredPositions,
    handleSearch,
    handleFocus,
    handleBlur,
    clearSearch,
    hasResults: filteredPositions.length > 0,
    isEmpty: query.trim() === ''
  };
};