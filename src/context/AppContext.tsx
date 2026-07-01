import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type CursorType = 'default' | 'pointer' | 'hover' | 'click' | 'magnetic';

interface AppContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  activeSection: number;
  setActiveSection: (section: number) => void;
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  zoomedPlanet: string | null;
  setZoomedPlanet: (planet: string | null) => void;
  zoomedProject: number | null;
  setZoomedProject: (project: number | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [zoomedPlanet, setZoomedPlanet] = useState<string | null>(null);
  const [zoomedProject, setZoomedProject] = useState<number | null>(null);

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        activeSection,
        setActiveSection,
        cursorType,
        setCursorType,
        zoomedPlanet,
        setZoomedPlanet,
        zoomedProject,
        setZoomedProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
