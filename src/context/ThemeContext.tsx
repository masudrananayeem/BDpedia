import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Mode = 'night' | 'day';

interface ThemeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialMode(): Mode {
  if (typeof window === 'undefined') return 'night';
  const saved = window.localStorage.getItem('bdpedia-mode');
  if (saved === 'day' || saved === 'night') return saved;
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'day') root.classList.add('light');
    else root.classList.remove('light');
    window.localStorage.setItem('bdpedia-mode', mode);
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === 'night' ? 'day' : 'night'));

  return <ThemeContext.Provider value={{ mode, toggleMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
