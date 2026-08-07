import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Feature: "Add to Travel Itinerary". No backend model exists for this yet,
// so the itinerary is kept client-side in localStorage — instant, works for
// guests too, and survives refreshes/tabs on the same browser.
export type ItineraryItem = {
  id: string; // `${type}-${slug}` — unique key
  type: 'place' | 'district';
  slug: string;
  name: string;
  image?: string;
  meta?: string; // district name for places, division name for districts
  addedAt: number;
};

interface ItineraryContextValue {
  items: ItineraryItem[];
  isSaved: (type: ItineraryItem['type'], slug: string) => boolean;
  addItem: (item: Omit<ItineraryItem, 'id' | 'addedAt'>) => void;
  removeItem: (type: ItineraryItem['type'], slug: string) => void;
  toggleItem: (item: Omit<ItineraryItem, 'id' | 'addedAt'>) => void;
  clearAll: () => void;
}

const STORAGE_KEY = 'bdpedia-itinerary';

const ItineraryContext = createContext<ItineraryContextValue | undefined>(undefined);

function load(): ItineraryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItineraryItem[]>(load);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isSaved = (type: ItineraryItem['type'], slug: string) =>
    items.some((i) => i.type === type && i.slug === slug);

  const addItem: ItineraryContextValue['addItem'] = (item) => {
    const id = `${item.type}-${item.slug}`;
    setItems((prev) => (prev.some((i) => i.id === id) ? prev : [...prev, { ...item, id, addedAt: Date.now() }]));
  };

  const removeItem = (type: ItineraryItem['type'], slug: string) => {
    setItems((prev) => prev.filter((i) => !(i.type === type && i.slug === slug)));
  };

  const toggleItem: ItineraryContextValue['toggleItem'] = (item) => {
    if (isSaved(item.type, item.slug)) removeItem(item.type, item.slug);
    else addItem(item);
  };

  const clearAll = () => setItems([]);

  return (
    <ItineraryContext.Provider value={{ items, isSaved, addItem, removeItem, toggleItem, clearAll }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext);
  if (!ctx) throw new Error('useItinerary must be used within ItineraryProvider');
  return ctx;
}
