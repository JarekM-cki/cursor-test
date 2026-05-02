import { create } from 'zustand';
import { logcomSeed } from '../data/logcomSeed';
import type { LogcomState, ModuleId } from '../types/logcom';

type LogcomActions = {
  setActiveModule: (moduleId: ModuleId) => void;
  togglePoligonMode: () => void;
};

export const useLogcomStore = create<LogcomState & LogcomActions>((set) => ({
  ...logcomSeed,
  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
  togglePoligonMode: () => set((state) => ({ poligonMode: !state.poligonMode })),
}));
