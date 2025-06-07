import { create } from 'zustand'

const defaultState = {
  players: [],
  selectedForGame: [],
}

const usePlayerStore = create((set) => ({
  ...defaultState,
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, { id: Date.now(), ...player }],
    })),
  updatePlayer: (player) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === player.id ? { ...p, ...player } : p,
      ),
    })),
  deletePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
      selectedForGame: state.selectedForGame.filter((pid) => pid !== id),
    })),
  selectPlayerForGame: (id) =>
    set((state) => ({
      selectedForGame: state.selectedForGame.includes(id)
        ? state.selectedForGame.filter((pid) => pid !== id)
        : [...state.selectedForGame, id],
    })),
  clearSelection: () => set({ selectedForGame: [] }),
  reset: () => set(defaultState),
}))

export default usePlayerStore
