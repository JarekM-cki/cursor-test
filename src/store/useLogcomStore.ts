import { create } from 'zustand';
import { logcomSeed } from '../data/logcomSeed';
import type { ConvoyUpdate, EquipmentUpdate, LogcomState, ModuleId, Soldier, StructureNode } from '../types/logcom';

type LogcomActions = {
  setActiveModule: (moduleId: ModuleId) => void;
  togglePoligonMode: () => void;
  upsertSoldier: (nodeId: string, soldier: Soldier) => void;
  updateEquipment: (equipmentId: string, patch: EquipmentUpdate) => void;
  updateConvoy: (convoyId: string, patch: ConvoyUpdate) => void;
};

const upsertSoldierInNodes = (nodes: StructureNode[], nodeId: string, soldier: Soldier): StructureNode[] =>
  nodes.map((node) => {
    if (node.id === nodeId) {
      const existingIndex = node.soldiers.findIndex((item) => item.id === soldier.id);
      const soldiers =
        existingIndex >= 0
          ? node.soldiers.map((item) => (item.id === soldier.id ? soldier : item))
          : [...node.soldiers, soldier];

      return { ...node, soldiers };
    }

    if (node.children?.length) {
      return { ...node, children: upsertSoldierInNodes(node.children, nodeId, soldier) };
    }

    return node;
  });

export const useLogcomStore = create<LogcomState & LogcomActions>((set) => ({
  ...logcomSeed,
  setActiveModule: (moduleId) => set({ activeModule: moduleId }),
  togglePoligonMode: () => set((state) => ({ poligonMode: !state.poligonMode })),
  upsertSoldier: (nodeId, soldier) =>
    set((state) => ({
      structure: upsertSoldierInNodes(state.structure, nodeId, soldier),
    })),
  updateEquipment: (equipmentId, patch) =>
    set((state) => ({
      equipment: state.equipment.map((item) => (item.id === equipmentId ? { ...item, ...patch } : item)),
    })),
  updateConvoy: (convoyId, patch) =>
    set((state) => ({
      convoys: state.convoys.map((item) => (item.id === convoyId ? { ...item, ...patch } : item)),
    })),
}));
