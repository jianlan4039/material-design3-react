import { createContext } from 'react';

export interface SubMenuContextProps {
  startCloseTimer: () => void;
  clearCloseTimer: () => void;
}

export const SubMenuContext = createContext<SubMenuContextProps | null>(null);
