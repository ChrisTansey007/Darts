import { create } from 'zustand'

const defaultState = {
  gameMode: '501',
  gameState: 'not_started',
  currentPlayer: null,
  history: [],
  scores: {},
}

const useGameStore = create((set, get) => ({
  ...defaultState,
  setGameMode: (mode) => set({ gameMode: mode }),
  resetGame: () => set(defaultState),
  handleDartThrow: (playerId, score) => {
    set((state) => {
      const newScore = (state.scores[playerId] || 0) + score
      const scores = { ...state.scores, [playerId]: newScore }
      const history = [...state.history, { playerId, score }]
      return {
        scores,
        history,
        currentPlayer: playerId,
        gameState: 'in_progress',
      }
    })
  },
  undoLastDart: () => {
    const last = get().history.slice(-1)[0]
    if (!last) return
    set((state) => {
      const history = state.history.slice(0, -1)
      const scores = {
        ...state.scores,
        [last.playerId]: (state.scores[last.playerId] || 0) - last.score,
      }
      return { history, scores, currentPlayer: last.playerId }
    })
  },
}))

export default useGameStore
