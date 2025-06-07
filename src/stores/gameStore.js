import { create } from 'zustand'

const defaultState = {
  gameMode: '501',
  gameState: 'not_started',
  currentPlayer: null,
  dartCount: 0,
  selectedPlayers: [],
  history: [],
  scores: {},
}

const startingScore = (mode) => {
  const n = parseInt(mode, 10)
  return Number.isNaN(n) ? 0 : n
}

const initScores = (players, mode) =>
  players.reduce((acc, id) => ({ ...acc, [id]: startingScore(mode) }), {})

const useGameStore = create((set, get) => ({
  ...defaultState,
  setGameMode: (mode) => set({ gameMode: mode }),
  resetGame: () =>
    set((state) => ({
      ...defaultState,
      selectedPlayers: state.selectedPlayers,
      scores: initScores(state.selectedPlayers, state.gameMode),
    })),
  setSelectedPlayers: (players) =>
    set((state) => ({
      selectedPlayers: players,
      scores: initScores(players, state.gameMode),
      currentPlayer: players[0] || null,
    })),
  startGame: () =>
    set((state) => ({
      gameState: 'in_progress',
      dartCount: 0,
      history: [],
      scores: initScores(state.selectedPlayers, state.gameMode),
      currentPlayer: state.selectedPlayers[0] || null,
    })),
  handleDartThrow: (playerId, score) => {
    set((state) => {
      const newScore =
        (state.scores[playerId] || startingScore(state.gameMode)) - score
      const scores = { ...state.scores, [playerId]: newScore }
      const history = [...state.history, { playerId, score }]
      const dartCount = state.dartCount + 1
      return {
        scores,
        history,
        dartCount,
        currentPlayer:
          state.selectedPlayers[
            (state.selectedPlayers.indexOf(playerId) + 1) %
              state.selectedPlayers.length
          ] || null,
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
        [last.playerId]: (state.scores[last.playerId] || 0) + last.score,
      }
      const dartCount = Math.max(0, state.dartCount - 1)
      return {
        history,
        scores,
        dartCount,
        currentPlayer: last.playerId,
      }
    })
  },
}))

export default useGameStore
