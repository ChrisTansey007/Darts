import { create } from 'zustand'

const useTournamentStore = create((set, get) => ({
  tournaments: [],
  currentTournamentId: null,
  createTournament: (tournament) =>
    set((state) => ({
      tournaments: [...state.tournaments, { id: Date.now(), matches: [], ...tournament }],
    })),
  setActiveTournament: (id) => set({ currentTournamentId: id }),
  advanceWinner: (matchId, winner) => {
    const { currentTournamentId, tournaments } = get()
    const idx = tournaments.findIndex((t) => t.id === currentTournamentId)
    if (idx === -1) return
    const tournament = tournaments[idx]
    const matches = tournament.matches.map((m) =>
      m.id === matchId ? { ...m, winner } : m
    )
    const updated = { ...tournament, matches }
    set((state) => ({
      tournaments: state.tournaments.map((t) => (t.id === currentTournamentId ? updated : t)),
    }))
  },
}))

export default useTournamentStore
