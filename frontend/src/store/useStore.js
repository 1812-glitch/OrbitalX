import { create } from "zustand";

const useStore = create((set) => ({
  // Currently selected satellite
  selectedSatellite: null,
  setSelectedSatellite: (satellite) => set({ selectedSatellite: satellite }),

  // Simulation state
  simulationStatus: "stopped", // running | paused | stopped
  setSimulationStatus: (status) => set({ simulationStatus: status }),

  // Simulation speed multiplier
  simulationSpeed: 1,
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

  // WebSocket connection status
  socketConnected: false,
  setSocketConnected: (connected) => set({ socketConnected: connected }),
}));

export default useStore;
