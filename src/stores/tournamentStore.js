import { create } from 'zustand'

const defaultState = {
  tournaments: [],
  currentTournamentId: null,
}

const useTournamentStore = create((set, get) => ({
  ...defaultState,
  createTournament: (tournament) =>
    set((state) => ({
      tournaments: [
        ...state.tournaments,
        { id: Date.now(), matches: [], ...tournament },
      ],
    })),
  setActiveTournament: (id) => set({ currentTournamentId: id }),
  advanceWinner: (matchId, winner) => {
    const { currentTournamentId, tournaments } = get()
    const idx = tournaments.findIndex((t) => t.id === currentTournamentId)
    if (idx === -1) return
    const tournament = tournaments[idx]
    const matches = tournament.matches.map((m) =>
      m.id === matchId ? { ...m, winner } : m,
    )
    const updated = { ...tournament, matches }
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === currentTournamentId ? updated : t,
      ),
    }))
  },
  addMatchToTournament: (match) => {
    const { currentTournamentId, tournaments } = get()
    const idx = tournaments.findIndex((t) => t.id === currentTournamentId)
    if (idx === -1) return
    const tournament = tournaments[idx]
    const matches = [...tournament.matches, { id: Date.now(), ...match }]
    const updated = { ...tournament, matches }
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === currentTournamentId ? updated : t,
      ),
    }))
  },
  reset: () => set(defaultState),
}))

export default useTournamentStore
