'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PlayerManagement from './PlayerManagement'
import ScoreboardUI from './ScoreboardUI'
import DartboardSVG from './DartboardSVG'

// Main component for the Stunning Dartboard application
const StunningDartboard = () => {
  // State for hover effects on the dartboard
  const [hoverScore, setHoverScore] = useState('')
  const [isScoreActive, setIsScoreActive] = useState(false)

  // Game state management
  const [gameMode, setGameMode] = useState('501') // 'cricket', '501', 'shanghai', 'bobs_27', etc.
  const [gamePhase, setGamePhase] = useState('playing') // 'setup', 'playing' for Killer mode
  const [currentTab, setCurrentTab] = useState('game') // 'game', 'players', 'tournaments', 'rules'
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [dartCount, setDartCount] = useState(1) // Tracks darts 1, 2, 3
  const [turnScores, setTurnScores] = useState([]) // Tracks scores within a single turn
  const [turnStartScore, setTurnStartScore] = useState({
    player1: 0,
    player2: 0,
  }) // For bust detection
  const [gameHistory, setGameHistory] = useState([]) // Tracks last few moves for undo functionality
  const [lastDart, setLastDart] = useState('') // Tracks the last dart thrown for display
  const [selectedPlayers, setSelectedPlayers] = useState({
    player1: null,
    player2: null,
  })
  const [botOpponent, setBotOpponent] = useState(null) // To store AI opponent settings
  const [checkoutSuggestion, setCheckoutSuggestion] = useState([])
  const [activeGameSection, setActiveGameSection] = useState('standard')
  const [highlightedSegments, setHighlightedSegments] = useState([])
  const [bogeyWarning, setBogeyWarning] = useState('')
  const [showBoard, setShowBoard] = useState(true)
  const toggleBoardVisibility = () => setShowBoard((prev) => !prev)
  const [showTotalInput, setShowTotalInput] = useState(false)
  const [turnTotal, setTurnTotal] = useState(0)

  // Player management state
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: 'Player 1',
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        cricketGames: 0,
        cricketWins: 0,
        countdownGames: 0,
        countdownWins: 0,
        totalDarts: 0,
        totalScore: 0,
        bullsHit: 0,
        doublesHit: 0,
        triplesHit: 0,
        highestFinish: 0,
        currentStreak: 0,
        longestStreak: 0,
        threeDartAverage: 0,
        first9Avg: 0,
        highestScore: 0,
        total180s: 0,
        marksPerRound: 0,
        checkoutAttempts: 0,
        checkoutHits: 0,
        checkoutPercentage: 0,
      },
    },
    {
      id: 2,
      name: 'Player 2',
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        cricketGames: 0,
        cricketWins: 0,
        countdownGames: 0,
        countdownWins: 0,
        totalDarts: 0,
        totalScore: 0,
        bullsHit: 0,
        doublesHit: 0,
        triplesHit: 0,
        highestFinish: 0,
        currentStreak: 0,
        longestStreak: 0,
        threeDartAverage: 0,
        first9Avg: 0,
        highestScore: 0,
        total180s: 0,
        marksPerRound: 0,
        checkoutAttempts: 0,
        checkoutHits: 0,
        checkoutPercentage: 0,
      },
    },
  ])
  const [newPlayerName, setNewPlayerName] = useState('')
  const [editingPlayer, setEditingPlayer] = useState(null)

  // Tournament Management State
  const [tournaments, setTournaments] = useState([])
  const [activeTournament, setActiveTournament] = useState(null)
  const [newTournamentName, setNewTournamentName] = useState('')
  const [tournamentPlayerSelection, setTournamentPlayerSelection] = useState([])

  // Game state for players
  const [gameState, setGameState] = useState({
    player1: {
      name: 'Player 1',
      score: 0,
      marks: { 20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, bull: 0 },
      currentTarget: 1,
      shanghaiHits: { single: false, double: false, triple: false },
      lives: 3,
      assignedNumber: null,
      isKiller: false,
      successfulCheckouts: 0,
      dartsRemaining: 100,
      t20s: 0,
      s20s: 0,
      otherHits: 0,
    },
    player2: {
      name: 'Player 2',
      score: 0,
      marks: { 20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, bull: 0 },
      currentTarget: 1,
      shanghaiHits: { single: false, double: false, triple: false },
      lives: 3,
      assignedNumber: null,
      isKiller: false,
      successfulCheckouts: 0,
      dartsRemaining: 100,
      t20s: 0,
      s20s: 0,
      otherHits: 0,
    },
  })

  // Constants for game logic and dartboard rendering
  const cricketNumbers = [20, 19, 18, 17, 16, 15]
  const numbers = [
    20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
  ]
  const angleIncrement = 18 // 360 / 20
  const center = 200
  const radii = {
    doubleOuter: 200,
    doubleInner: 188,
    singleOuter: 188,
    tripleOuter: 138,
    tripleInner: 126,
    singleInner: 126,
    bullOuter: 30,
    bullInner: 15,
  }

  // New Game Modes Definitions
  const standardGames = [
    { id: 'cricket', name: 'Cricket' },
    { id: '301', name: '301' },
    { id: '501', name: '501' },
    { id: '701', name: '701' },
  ]
  const partyGames = [
    { id: 'shanghai', name: 'Shanghai' },
    { id: 'around_the_clock', name: 'Around The Clock' },
    { id: 'killer', name: 'Killer' },
  ]
  const practiceModes = [
    { id: 'bobs_27', name: "Bob's 27" },
    { id: 'checkout_challenge', name: 'Checkout Challenge' },
    { id: 'scoring_practice_t20', name: 'Score T20s' },
  ]

  // Checkout suggestions logic
  const checkoutRoutes = {
    170: ['T20', 'T20', 'DB'],
    167: ['T20', 'T19', 'DB'],
    164: ['T20', 'T18', 'DB'],
    161: ['T20', 'T17', 'DB'],
    160: ['T20', 'T20', 'D20'],
    158: ['T20', 'T20', 'D19'],
    157: ['T20', 'T19', 'D20'],
    156: ['T20', 'T20', 'D18'],
    155: ['T20', 'T19', 'D19'],
    154: ['T20', 'T18', 'D20'],
    153: ['T20', 'T19', 'D18'],
    152: ['T20', 'T20', 'D16'],
    151: ['T20', 'T17', 'D20'],
    150: ['T20', 'T18', 'D18'],
    149: ['T20', 'T19', 'D16'],
    148: ['T20', 'T16', 'D20'],
    147: ['T20', 'T17', 'D18'],
    146: ['T20', 'T18', 'D16'],
    145: ['T20', 'T15', 'D20'],
    144: ['T20', 'T20', 'D12'],
    143: ['T20', 'T17', 'D16'],
    142: ['T20', 'T14', 'D20'],
    141: ['T20', 'T19', 'D12'],
    140: ['T20', 'T20', 'D10'],
    139: ['T19', 'T14', 'D20'],
    138: ['T20', 'T18', 'D12'],
    137: ['T18', 'T17', 'D16'],
    136: ['T20', 'T20', 'D8'],
    135: ['T20', 'T17', 'D12'],
    134: ['T20', 'T14', 'D16'],
    133: ['T20', 'T19', 'D8'],
    132: ['T20', 'T16', 'D12'],
    131: ['T20', 'T13', 'D16'],
    130: ['T20', 'T20', 'D5'],
    129: ['T19', 'T16', 'D12'],
    128: ['T18', 'T14', 'D16'],
    127: ['T20', 'T17', 'D8'],
    126: ['T19', 'T19', 'D6'],
    125: ['SB', 'T20', 'D20'],
    124: ['T20', 'S16', 'D24'],
    123: ['T19', 'S16', 'D24'],
    122: ['T18', 'S20', 'D24'],
    121: ['T20', 'S11', 'DB'],
    120: ['T20', 'S20', 'D20'],
    119: ['T19', 'S12', 'DB'],
    118: ['T20', 'S18', 'D20'],
    117: ['T20', 'S17', 'D20'],
    116: ['T20', 'S16', 'D20'],
    115: ['T20', 'S15', 'D20'],
    114: ['T20', 'S14', 'D20'],
    113: ['T19', 'S16', 'D20'],
    112: ['T20', 'S12', 'D20'],
    111: ['T19', 'S14', 'D20'],
    110: ['T20', 'S10', 'D20'],
    109: ['T19', 'S12', 'D20'],
    108: ['T19', 'S11', 'D20'],
    107: ['T19', 'S10', 'D20'],
    106: ['T20', 'S6', 'D20'],
    105: ['T19', 'S8', 'D20'],
    104: ['T18', 'S10', 'D20'],
    103: ['T19', 'S6', 'D20'],
    102: ['T20', 'S2', 'D20'],
    101: ['T17', 'S10', 'D20'],
    100: ['T20', 'D20'],
    99: ['T19', 'D20'],
    98: ['T20', 'D19'],
    97: ['T19', 'D20'],
    96: ['T20', 'D18'],
    95: ['T19', 'D19'],
    94: ['T18', 'D20'],
    93: ['T19', 'D18'],
    92: ['T20', 'D16'],
    91: ['T17', 'D20'],
    90: ['T20', 'D15'],
    89: ['T19', 'D16'],
    88: ['T20', 'D14'],
    87: ['T17', 'D18'],
    86: ['T18', 'D16'],
    85: ['T15', 'D20'],
    84: ['T20', 'D12'],
    83: ['T17', 'D16'],
    82: ['T14', 'D20'],
    81: ['T19', 'D12'],
    80: ['T20', 'D10'],
    79: ['T13', 'D20'],
    78: ['T18', 'D12'],
    77: ['T19', 'D10'],
    76: ['T20', 'D8'],
    75: ['T17', 'D12'],
    74: ['T14', 'D16'],
    73: ['T19', 'D8'],
    72: ['T16', 'D12'],
    71: ['T13', 'D16'],
    70: ['T20', 'D5'],
    69: ['T19', 'D6'],
    68: ['T20', 'D4'],
    67: ['T17', 'D8'],
    66: ['T10', 'D18'],
    65: ['T19', 'D4'],
    64: ['T16', 'D8'],
    63: ['T13', 'D12'],
    62: ['T10', 'D16'],
    61: ['T15', 'D8'],
    60: ['S20', 'D20'],
    59: ['S19', 'D20'],
    58: ['S18', 'D20'],
    57: ['S17', 'D20'],
    56: ['S16', 'D20'],
    55: ['S15', 'D20'],
    54: ['S14', 'D20'],
    53: ['S13', 'D20'],
    52: ['S12', 'D20'],
    51: ['S11', 'D20'],
    50: ['DB'],
    40: ['D20'],
    38: ['D19'],
    36: ['D18'],
    34: ['D17'],
    32: ['D16'],
    30: ['D15'],
    28: ['D14'],
    26: ['D13'],
    24: ['D12'],
    22: ['D11'],
    20: ['D10'],
    18: ['D9'],
    16: ['D8'],
    14: ['D7'],
    12: ['D6'],
    10: ['D5'],
    8: ['D4'],
    6: ['D3'],
    4: ['D2'],
    2: ['D1'],
  }
  const bogeyNumbers = {
    169: 'S19',
    168: 'S18',
    166: 'S16',
    165: 'S15',
    163: 'S13',
    162: 'S12',
    159: 'S19',
  }
  const twoDartCheckouts = Object.keys(checkoutRoutes)
    .filter((score) => parseInt(score) >= 61 && parseInt(score) <= 100)
    .map(Number)

  const formatSuggestionToId = (suggestion) => {
    if (!suggestion) return null
    const s = suggestion.toLowerCase()
    if (s === 'db') return 'double-bull'
    if (s === 'sb') return 'single-bull'
    const typeMap = { t: 'triple', d: 'double', s: 'single' }
    const type = typeMap[s.charAt(0)]
    const number = s.substring(1)
    return `${type}-${number}`
  }

  const updateCheckoutVisuals = (score) => {
    const route = getCheckoutSuggestions(score)
    setCheckoutSuggestion(route)

    if (bogeyNumbers[score]) {
      const target = bogeyNumbers[score]
      setBogeyWarning(`Bogey! Aim ${target} to leave a finish.`)
      setHighlightedSegments([formatSuggestionToId(target)])
    } else {
      setBogeyWarning('')
      setHighlightedSegments(route.map(formatSuggestionToId))
    }
  }

  const getCheckoutSuggestions = (score) => {
    if (score > 170 || score < 2) return []
    if (checkoutRoutes[score]) return checkoutRoutes[score]
    return []
  }

  const getNewCheckoutTarget = () => {
    return twoDartCheckouts[Math.floor(Math.random() * twoDartCheckouts.length)]
  }

  // Player management functions
  const addPlayer = () => {
    if (!newPlayerName.trim()) return
    const newPlayer = {
      id: Date.now(),
      name: newPlayerName.trim(),
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        cricketGames: 0,
        cricketWins: 0,
        countdownGames: 0,
        countdownWins: 0,
        totalDarts: 0,
        totalScore: 0,
        bullsHit: 0,
        doublesHit: 0,
        triplesHit: 0,
        highestFinish: 0,
        currentStreak: 0,
        longestStreak: 0,
        threeDartAverage: 0,
        first9Avg: 0,
        highestScore: 0,
        total180s: 0,
        marksPerRound: 0,
        checkoutAttempts: 0,
        checkoutHits: 0,
        checkoutPercentage: 0,
      },
    }
    setPlayers((prev) => [...prev, newPlayer])
    setNewPlayerName('')
  }

  const updatePlayerName = (playerId, newName) => {
    if (!newName.trim()) return
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, name: newName.trim() } : p)),
    )
    setEditingPlayer(null)
  }

  const deletePlayer = (playerId) => {
    setPlayers((prev) => prev.filter((p) => p.id !== playerId))
    if (selectedPlayers.player1?.id === playerId)
      setSelectedPlayers((prev) => ({ ...prev, player1: null }))
    if (selectedPlayers.player2?.id === playerId)
      setSelectedPlayers((prev) => ({ ...prev, player2: null }))
  }

  const selectPlayer = (playerSlot, player) => {
    const currentPlayer = player
      ? players.find((p) => p.id === player.id) || player
      : null
    setSelectedPlayers((prev) => ({ ...prev, [playerSlot]: currentPlayer }))
    setGameState((prev) => ({
      ...prev,
      [playerSlot]: {
        ...prev[playerSlot],
        name: currentPlayer
          ? currentPlayer.name
          : playerSlot === 'player1'
            ? 'Player 1'
            : 'Player 2',
      },
    }))
  }

  // Chart data generation functions
  const generateBarChartData = (stat, player1, player2) => {
    const getValue = (player, stat) => {
      if (!player) return 0
      switch (stat) {
        case 'winRate':
          return player.stats.gamesPlayed > 0
            ? (player.stats.gamesWon / player.stats.gamesPlayed) * 100
            : 0
        case 'checkoutPercentage':
          return player.stats.checkoutAttempts > 0
            ? (player.stats.checkoutHits / player.stats.checkoutAttempts) * 100
            : 0
        case 'threeDartAverage':
          return player.stats.threeDartAverage || 0
        default:
          return player.stats[stat] || 0
      }
    }
    const value1 = getValue(player1, stat)
    const value2 = getValue(player2, stat)
    const maxValue = Math.max(value1, value2, 1)
    return {
      player1: { value: value1, height: (value1 / maxValue) * 180 },
      player2: { value: value2, height: (value2 / maxValue) * 180 },
    }
  }

  const generateRadarData = (player) => {
    if (!player) return []
    const stats = [
      {
        label: 'Win Rate',
        value:
          player.stats.gamesPlayed > 0
            ? (player.stats.gamesWon / player.stats.gamesPlayed) * 100
            : 0,
        max: 100,
      },
      {
        label: '3-Dart Avg',
        value: Math.min(player.stats.threeDartAverage, 180),
        max: 180,
      },
      {
        label: 'Streak',
        value: Math.min(player.stats.longestStreak * 10, 100),
        max: 100,
      },
      {
        label: 'Scoring',
        value:
          player.stats.totalDarts > 0
            ? Math.min(
                (player.stats.totalScore / player.stats.totalDarts) * 3.5,
                100,
              )
            : 0,
        max: 100,
      },
      {
        label: 'Precision',
        value:
          player.stats.totalDarts > 0
            ? Math.min(
                ((player.stats.bullsHit + player.stats.triplesHit) /
                  player.stats.totalDarts) *
                  200,
                100,
              )
            : 0,
        max: 100,
      },
      {
        label: 'Checkout %',
        value: Math.min(player.stats.checkoutPercentage, 100),
        max: 100,
      },
    ]
    const chartCenter = 125
    const radius = 80
    const angleStep = (Math.PI * 2) / stats.length
    return stats.map((stat, index) => {
      const numericValue = isNaN(stat.value) ? 0 : stat.value
      const normalizedValue = numericValue / stat.max
      const angle = index * angleStep - Math.PI / 2
      const x = chartCenter + Math.cos(angle) * radius * normalizedValue
      const y = chartCenter + Math.sin(angle) * radius * normalizedValue
      const labelX = chartCenter + Math.cos(angle) * (radius + 20)
      const labelY = chartCenter + Math.sin(angle) * (radius + 20)
      return { ...stat, x, y, labelX, labelY, angle }
    })
  }

  const generateRadarGridPath = () => {
    const chartCenter = 125
    const radius = 80
    const levels = 5
    const sides = 6
    let path = ''
    for (let level = 1; level <= levels; level++) {
      const levelRadius = (radius * level) / levels
      const points = []
      for (let i = 0; i < sides; i++) {
        const angle = (i * Math.PI * 2) / sides - Math.PI / 2
        const x = chartCenter + Math.cos(angle) * levelRadius
        const y = chartCenter + Math.sin(angle) * levelRadius
        points.push(`${x},${y}`)
      }
      path += `M${points.join('L')}Z `
    }
    return path
  }

  const generateRadarAxes = () => {
    const chartCenter = 125
    const radius = 80
    const sides = 6
    return Array.from({ length: sides }, (_, i) => {
      const angle = (i * Math.PI * 2) / sides - Math.PI / 2
      const x = chartCenter + Math.cos(angle) * radius
      const y = chartCenter + Math.sin(angle) * radius
      return `M${chartCenter},${chartCenter}L${x},${y}`
    }).join(' ')
  }

  // Game and stats logic
  const updatePlayerStats = (playerId, statUpdates) => {
    setPlayers((prev) => {
      const updatedPlayers = prev.map((p) => {
        if (p.id === playerId) {
          const newStats = { ...p.stats, ...statUpdates }
          if (newStats.checkoutAttempts > 0) {
            newStats.checkoutPercentage =
              (newStats.checkoutHits / newStats.checkoutAttempts) * 100
          }
          return { ...p, stats: newStats }
        }
        return p
      })
      setSelectedPlayers((current) => ({
        player1:
          current.player1?.id === playerId
            ? updatedPlayers.find((p) => p.id === playerId)
            : current.player1,
        player2:
          current.player2?.id === playerId
            ? updatedPlayers.find((p) => p.id === playerId)
            : current.player2,
      }))
      return updatedPlayers
    })
  }

  const recordMatchWinner = (
    tournamentId,
    roundIndex,
    matchIndex,
    winnerId,
  ) => {
    setTournaments((prevTournaments) => {
      const newTournaments = [...prevTournaments]
      const tourneyIndex = newTournaments.findIndex(
        (t) => t.id === tournamentId,
      )
      if (tourneyIndex === -1) return prevTournaments

      const tournament = JSON.parse(
        JSON.stringify(newTournaments[tourneyIndex]),
      )

      tournament.rounds[roundIndex][matchIndex].winner = winnerId

      const nextRoundIndex = roundIndex + 1
      if (nextRoundIndex < tournament.rounds.length) {
        const nextMatchIndex = Math.floor(matchIndex / 2)
        if (matchIndex % 2 === 0) {
          tournament.rounds[nextRoundIndex][nextMatchIndex].player1 = winnerId
        } else {
          tournament.rounds[nextRoundIndex][nextMatchIndex].player2 = winnerId
        }
      } else {
        tournament.winner = winnerId
      }

      newTournaments[tourneyIndex] = tournament
      setActiveTournament(tournament)
      return newTournaments
    })
  }

  const handleDartThrow = (score) => {
    if (gameMode === 'freeplay' || isGameWon()) return
    const currentState = {
      gameState: JSON.parse(JSON.stringify(gameState)),
      currentPlayer,
      dartCount,
      turnStartScore,
      turnScores: [...turnScores],
      timestamp: Date.now(),
    }
    let number = null,
      multiplier = 1,
      points = 0
    if (score.includes('bull')) {
      number = 'bull'
      multiplier = score.includes('double') ? 2 : 1
      points = multiplier === 2 ? 50 : 25
    } else {
      const parts = score.split('-')
      multiplier = parts[0] === 'double' ? 2 : parts[0] === 'triple' ? 3 : 1
      number = parseInt(parts[1])
      points = number * multiplier
    }

    const updatedTurnScores = [...turnScores, points]
    setTurnScores(updatedTurnScores)
    const activePlayer =
      currentPlayer === 1 ? selectedPlayers.player1 : selectedPlayers.player2
    if (activePlayer && activePlayer.id !== 'bot') {
      const statUpdates = {
        totalDarts: activePlayer.stats.totalDarts + 1,
        totalScore: activePlayer.stats.totalScore + points,
      }
      if (number === 'bull')
        statUpdates.bullsHit = activePlayer.stats.bullsHit + 1
      if (multiplier === 2)
        statUpdates.doublesHit = activePlayer.stats.doublesHit + 1
      if (multiplier === 3)
        statUpdates.triplesHit = activePlayer.stats.triplesHit + 1
      statUpdates.threeDartAverage =
        (statUpdates.totalScore / statUpdates.totalDarts) * 3
      updatePlayerStats(activePlayer.id, statUpdates)
    }

    const newGameState = JSON.parse(JSON.stringify(gameState))
    const player = currentPlayer === 1 ? 'player1' : 'player2'
    const opponent = currentPlayer === 1 ? 'player2' : 'player1'

    // Game Mode Logic Switch
    switch (gameMode) {
      case 'scoring_practice_t20':
        const pStateScoring = newGameState[player]
        pStateScoring.dartsRemaining -= 1
        pStateScoring.score += points
        if (score === 'triple-20') pStateScoring.t20s += 1
        else if (score === 'single-20') pStateScoring.s20s += 1
        else pStateScoring.otherHits += 1
        break
      case 'checkout_challenge':
        const pStateCheckout = newGameState[player]
        const newTargetScore = pStateCheckout.currentTarget - points
        if (
          newTargetScore < 0 ||
          newTargetScore === 1 ||
          (newTargetScore === 0 && multiplier !== 2 && score !== 'double-bull')
        ) {
          // Bust
          setLastDart(`${formatScore(score)} - BUST!`)
          setTimeout(() => {
            setGameState((prev) => ({
              ...prev,
              [player]: {
                ...prev[player],
                currentTarget: getNewCheckoutTarget(),
              },
            }))
            nextPlayer(true)
          }, 1000)
        } else {
          pStateCheckout.currentTarget = newTargetScore
          if (newTargetScore === 0) {
            // Successful checkout
            pStateCheckout.successfulCheckouts += 1
            setLastDart(`${formatScore(score)} - CHECKOUT!`)
            setTimeout(() => {
              setGameState((prev) => ({
                ...prev,
                [player]: {
                  ...prev[player],
                  currentTarget: getNewCheckoutTarget(),
                },
              }))
              nextPlayer(true)
            }, 1000)
          }
        }
        break
      case 'killer':
        if (gamePhase === 'setup') {
          const assignedNumber = number === 'bull' ? 25 : number
          if (newGameState[opponent].assignedNumber !== assignedNumber) {
            newGameState[player].assignedNumber = assignedNumber
            setLastDart(`Player ${currentPlayer} assigned ${assignedNumber}`)
            if (
              newGameState.player1.assignedNumber &&
              newGameState.player2.assignedNumber
            ) {
              setGamePhase('playing')
            }
            nextPlayer(true)
          } else {
            setLastDart(`Number ${assignedNumber} is taken! Try again.`)
          }
        } else {
          // 'playing' phase
          const pState = newGameState[player]
          if (!pState.isKiller) {
            if (number === pState.assignedNumber && multiplier === 2) {
              pState.isKiller = true
              setLastDart(`${pState.name} is now a KILLER!`)
            }
          } else {
            // Player is a killer
            const oState = newGameState[opponent]
            if (
              oState.lives > 0 &&
              number === oState.assignedNumber &&
              multiplier === 2
            ) {
              oState.lives -= 1
              setLastDart(`${pState.name} took a life from ${oState.name}!`)
            } else if (number === pState.assignedNumber && multiplier === 2) {
              // Suicide rule
              pState.lives -= 1
              setLastDart(`${pState.name} hit their own double! SUICIDE!`)
            }
          }
        }
        break
      case 'cricket':
        if (number === 'bull' || cricketNumbers.includes(number)) {
          const currentMarks = newGameState[player].marks[number]
          const newMarks = Math.min(currentMarks + multiplier, 3)
          const extraMarks = Math.max(currentMarks + multiplier - 3, 0)
          newGameState[player].marks[number] = newMarks
          if (newMarks === 3 && newGameState[opponent].marks[number] < 3) {
            const pointValue = number === 'bull' ? 25 : number
            newGameState[player].score += extraMarks * pointValue
          }
        }
        break
      case '301':
      case '501':
      case '701':
        const newScore = newGameState[player].score - points
        const isCheckoutAttempt =
          turnStartScore[player] <= 170 &&
          turnStartScore[player] !== 169 &&
          turnStartScore[player] !== 168 &&
          turnStartScore[player] !== 166 &&
          turnStartScore[player] !== 165 &&
          turnStartScore[player] !== 163 &&
          turnStartScore[player] !== 162 &&
          turnStartScore[player] !== 159
        if (
          newScore < 0 ||
          newScore === 1 ||
          (newScore === 0 && multiplier !== 2 && score !== 'double-bull')
        ) {
          if (isCheckoutAttempt && dartCount === 3 && activePlayer)
            updatePlayerStats(activePlayer.id, {
              checkoutAttempts: activePlayer.stats.checkoutAttempts + 1,
            })
          newGameState[player].score = turnStartScore[player]
          updateCheckoutVisuals(turnStartScore[player])
          setLastDart(`${formatScore(score)} - BUST!`)
          nextPlayer(true) // Force next player on bust
          setGameState(newGameState)
          return
        } else {
          newGameState[player].score = newScore
          updateCheckoutVisuals(newScore)
          if (newScore === 0) {
            if (activePlayer) {
              const statUpdates = { highestFinish: turnStartScore[player] }
              if (isCheckoutAttempt) {
                statUpdates.checkoutHits = activePlayer.stats.checkoutHits + 1
                statUpdates.checkoutAttempts =
                  activePlayer.stats.checkoutAttempts + 1
              }
              updatePlayerStats(activePlayer.id, statUpdates)
            }
            setLastDart(`${formatScore(score)} - WINNER!`)
          }
        }
        break
      case 'bobs_27':
        const targetDouble = newGameState[player].currentTarget
        if (number === targetDouble && multiplier === 2) {
          newGameState[player].score += targetDouble * 2
        }
        break
      case 'around_the_clock':
        const target = newGameState[player].currentTarget
        if (
          number === target ||
          (target === 21 && (number === 'bull' || number === 25))
        ) {
          newGameState[player].currentTarget += 1
        }
        break
      case 'shanghai':
        const shanghaiTarget = newGameState.player1.currentTarget // Both players on same target
        if (number === shanghaiTarget) {
          newGameState[player].score += points
          if (multiplier === 1) newGameState[player].shanghaiHits.single = true
          if (multiplier === 2) newGameState[player].shanghaiHits.double = true
          if (multiplier === 3) newGameState[player].shanghaiHits.triple = true
        }
        break
    }

    setGameState(newGameState)
    setGameHistory((prev) => [...prev.slice(-4), currentState])
    if (
      !lastDart.includes('WINNER') &&
      !lastDart.includes('BUST') &&
      gameMode !== 'killer'
    ) {
      setLastDart(formatScore(score))
    }

    if (
      dartCount === 3 ||
      gameMode === 'checkout_challenge' ||
      gameMode === 'scoring_practice_t20'
    ) {
      if (activePlayer && activePlayer.id !== 'bot') {
        const turnTotal = updatedTurnScores.reduce((a, b) => a + b, 0)
        if (turnTotal > activePlayer.stats.highestScore)
          updatePlayerStats(activePlayer.id, { highestScore: turnTotal })
        if (turnTotal === 180)
          updatePlayerStats(activePlayer.id, {
            total180s: activePlayer.stats.total180s + 1,
          })
      }
      if (gameMode === 'bobs_27') {
        const pState = newGameState[player]
        const hitsInTurn = updatedTurnScores.some((s) => s > 0)
        if (!hitsInTurn && dartCount === 3) {
          pState.score -= pState.currentTarget * 2
        }
      }

      if (
        gameMode !== 'checkout_challenge' &&
        gameMode !== 'scoring_practice_t20'
      ) {
        nextPlayer()
      } else if (dartCount === 3) {
        nextPlayer()
      }
    }

    if (gameMode !== 'scoring_practice_t20') {
      setDartCount((prev) => (prev === 3 ? 1 : prev + 1))
    }
  }

  const handleTurnTotalSubmit = (total) => {
    if (!['301', '501', '701'].includes(gameMode)) return
    const playerKey = currentPlayer === 1 ? 'player1' : 'player2'
    const activePlayer =
      currentPlayer === 1 ? selectedPlayers.player1 : selectedPlayers.player2

    setGameHistory((prev) => [
      ...prev.slice(-4),
      {
        gameState: JSON.parse(JSON.stringify(gameState)),
        currentPlayer,
        dartCount,
        turnStartScore,
        turnScores: [...turnScores],
        timestamp: Date.now(),
      },
    ])

    const startingScore = gameState[playerKey].score
    let newScore = startingScore - total
    const isCheckoutAttempt =
      turnStartScore[playerKey] <= 170 &&
      ![169, 168, 166, 165, 163, 162, 159].includes(turnStartScore[playerKey])

    const updatedGameState = JSON.parse(JSON.stringify(gameState))

    if (newScore < 0 || newScore === 1) {
      updatedGameState[playerKey].score = turnStartScore[playerKey]
      if (activePlayer && activePlayer.id !== 'bot' && isCheckoutAttempt) {
        updatePlayerStats(activePlayer.id, {
          checkoutAttempts: activePlayer.stats.checkoutAttempts + 1,
        })
      }
      setLastDart('BUST!')
      newScore = turnStartScore[playerKey]
    } else {
      updatedGameState[playerKey].score = newScore
      if (activePlayer && activePlayer.id !== 'bot') {
        const newTotalScore = activePlayer.stats.totalScore + total
        const newTotalDarts = activePlayer.stats.totalDarts + 3
        const statUpdates = {
          totalScore: newTotalScore,
          totalDarts: newTotalDarts,
          threeDartAverage: (newTotalScore / newTotalDarts) * 3,
        }
        if (total > activePlayer.stats.highestScore)
          statUpdates.highestScore = total
        if (total === 180)
          statUpdates.total180s = activePlayer.stats.total180s + 1
        if (newScore === 0) {
          statUpdates.highestFinish = startingScore
          if (isCheckoutAttempt) {
            statUpdates.checkoutHits = activePlayer.stats.checkoutHits + 1
            statUpdates.checkoutAttempts =
              activePlayer.stats.checkoutAttempts + 1
          }
        } else if (isCheckoutAttempt) {
          statUpdates.checkoutAttempts = activePlayer.stats.checkoutAttempts + 1
        }
        updatePlayerStats(activePlayer.id, statUpdates)
      }
    }

    setGameState(updatedGameState)
    updateCheckoutVisuals(newScore)

    const nextP = currentPlayer === 1 ? 2 : 1
    const nextKey = nextP === 1 ? 'player1' : 'player2'

    setCurrentPlayer(nextP)
    setDartCount(1)
    setTurnScores([])
    setLastDart('')

    setTurnStartScore((s) => ({
      ...s,
      [nextKey]: updatedGameState[nextKey].score,
    }))
    updateCheckoutVisuals(updatedGameState[nextKey].score)
  }

  const resetGame = useCallback(() => {
    let initialScore = 0
    if (['301', '501', '701'].includes(gameMode))
      initialScore = parseInt(gameMode)
    else if (gameMode === 'bobs_27') initialScore = 27

    const initialPlayerState = {
      score: initialScore,
      marks: { 20: 0, 19: 0, 18: 0, 17: 0, 16: 0, 15: 0, bull: 0 },
      currentTarget: 1,
      shanghaiHits: { single: false, double: false, triple: false },
      lives: 3,
      assignedNumber: null,
      isKiller: false,
      successfulCheckouts: 0,
      dartsRemaining: 100,
      t20s: 0,
      s20s: 0,
      otherHits: 0,
    }

    if (gameMode === 'checkout_challenge') {
      initialPlayerState.currentTarget = getNewCheckoutTarget()
    }

    setGameState({
      player1: {
        ...initialPlayerState,
        name: selectedPlayers.player1
          ? selectedPlayers.player1.name
          : 'Player 1',
      },
      player2: {
        ...initialPlayerState,
        name: selectedPlayers.player2
          ? selectedPlayers.player2.name
          : 'Player 2',
      },
    })

    if (gameMode === 'killer') setGamePhase('setup')
    else setGamePhase('playing')

    setCurrentPlayer(1)
    setDartCount(1)
    setTurnScores([])
    setTurnStartScore({ player1: initialScore, player2: initialScore })
    setGameHistory([])
    setLastDart('')
    if (['301', '501', '701'].includes(gameMode)) {
      updateCheckoutVisuals(initialScore)
    } else {
      setCheckoutSuggestion([])
      setHighlightedSegments([])
      setBogeyWarning('')
    }
  }, [gameMode, selectedPlayers])

  const undoLastDart = () => {
    if (gameHistory.length === 0) return
    const lastState = gameHistory[gameHistory.length - 1]
    setGameState(lastState.gameState)
    setCurrentPlayer(lastState.currentPlayer)
    setDartCount(lastState.dartCount)
    setTurnStartScore(lastState.turnStartScore)
    setTurnScores(lastState.turnScores)
    if (['301', '501', '701'].includes(gameMode)) {
      const playerKey = lastState.currentPlayer === 1 ? 'player1' : 'player2'
      updateCheckoutVisuals(lastState.gameState[playerKey].score)
    }
    const activePlayer =
      lastState.currentPlayer === 1
        ? selectedPlayers.player1
        : selectedPlayers.player2
    if (activePlayer && activePlayer.id !== 'bot') {
      const lastDartScore =
        lastState.turnScores[lastState.turnScores.length - 1] || 0
      const newTotalScore = activePlayer.stats.totalScore - lastDartScore
      const newTotalDarts = activePlayer.stats.totalDarts - 1
      updatePlayerStats(activePlayer.id, {
        totalScore: newTotalScore,
        totalDarts: newTotalDarts,
        threeDartAverage:
          newTotalDarts > 0 ? (newTotalScore / newTotalDarts) * 3 : 0,
      })
    }
    setGameHistory((prev) => prev.slice(0, -1))
    setLastDart('')
  }

  const goBackTurn = () => {
    let targetPlayer = currentPlayer === 1 ? 2 : 1
    for (let i = gameHistory.length - 1; i >= 0; i--) {
      const state = gameHistory[i]
      if (state.currentPlayer === targetPlayer && state.dartCount === 1) {
        setGameState(state.gameState)
        setCurrentPlayer(state.currentPlayer)
        setDartCount(state.dartCount)
        setTurnStartScore(state.turnStartScore)
        setTurnScores(state.turnScores)
        setGameHistory((prev) => prev.slice(0, i))
        setLastDart('')
        if (['301', '501', '701'].includes(gameMode)) {
          const playerKey = state.currentPlayer === 1 ? 'player1' : 'player2'
          updateCheckoutVisuals(state.gameState[playerKey].score)
        }
        return
      }
    }
    setCurrentPlayer(targetPlayer)
    setDartCount(1)
    setTurnScores([])
    setLastDart('')
    if (['301', '501', '701'].includes(gameMode)) {
      const playerKey = targetPlayer === 1 ? 'player1' : 'player2'
      updateCheckoutVisuals(gameState[playerKey].score)
    }
  }

  const setGameModeAndReset = (mode) => setGameMode(mode)
  useEffect(() => {
    resetGame()
  }, [gameMode, selectedPlayers, resetGame])

  const nextPlayer = (force = false) => {
    if (isGameWon() && !force) return
    const nextP = currentPlayer === 1 ? 2 : 1
    setCurrentPlayer(nextP)
    setDartCount(1)
    setTurnScores([])

    if (!force) setLastDart('')

    const nextPlayerKey = nextP === 1 ? 'player1' : 'player2'
    const newGameState = JSON.parse(JSON.stringify(gameState))

    if (gameMode === 'bobs_27' && currentPlayer === 2) {
      newGameState.player1.currentTarget += 1
      newGameState.player2.currentTarget += 1
    }
    if (gameMode === 'shanghai' && currentPlayer === 2) {
      newGameState.player1.currentTarget += 1
      newGameState.player2.currentTarget += 1
    }
    if (gameMode === 'checkout_challenge') {
      newGameState.player1.currentTarget = getNewCheckoutTarget()
    }
    newGameState.player1.shanghaiHits = {
      single: false,
      double: false,
      triple: false,
    }
    newGameState.player2.shanghaiHits = {
      single: false,
      double: false,
      triple: false,
    }

    setGameState(newGameState)

    setTurnStartScore((s) => ({
      ...s,
      [nextPlayerKey]: newGameState[nextPlayerKey].score,
    }))
    if (['301', '501', '701'].includes(gameMode)) {
      updateCheckoutVisuals(newGameState[nextPlayerKey].score)
    }
  }

  const getMarkDisplay = (marks) => {
    if (marks === 0) return ''
    if (marks === 1) return '/'
    if (marks === 2) return 'X'
    if (marks === 3) return '⚡'
    return ''
  }

  const isGameWon = () => {
    let winner = null
    if (gameHistory.some((h) => h.gameEnded))
      return gameHistory.find((h) => h.gameEnded).winner

    switch (gameMode) {
      case 'scoring_practice_t20':
        if (gameState.player1.dartsRemaining <= 0) winner = 'Practice Over'
        break
      case 'cricket':
        const p1Closed = cricketNumbers
          .concat(['bull'])
          .every((n) => gameState.player1.marks[n] === 3)
        const p2Closed = cricketNumbers
          .concat(['bull'])
          .every((n) => gameState.player2.marks[n] === 3)
        if (p1Closed && gameState.player1.score >= gameState.player2.score)
          winner = 'Player 1'
        else if (p2Closed && gameState.player2.score >= gameState.player1.score)
          winner = 'Player 2'
        break
      case '301':
      case '501':
      case '701':
        if (gameState.player1.score === 0) winner = 'Player 1'
        else if (gameState.player2.score === 0) winner = 'Player 2'
        break
      case 'around_the_clock':
        if (gameState.player1.currentTarget > 21) winner = 'Player 1'
        else if (gameState.player2.currentTarget > 21) winner = 'Player 2'
        break
      case 'shanghai':
        const p1shanghai =
          gameState.player1.shanghaiHits.single &&
          gameState.player1.shanghaiHits.double &&
          gameState.player1.shanghaiHits.triple
        const p2shanghai =
          gameState.player2.shanghaiHits.single &&
          gameState.player2.shanghaiHits.double &&
          gameState.player2.shanghaiHits.triple
        if (p1shanghai) winner = 'Player 1'
        else if (p2shanghai) winner = 'Player 2'
        else if (gameState.player1.currentTarget > 7) {
          if (gameState.player1.score > gameState.player2.score)
            winner = 'Player 1'
          else if (gameState.player2.score > gameState.player1.score)
            winner = 'Player 2'
          else winner = 'Draw'
        }
        break
      case 'bobs_27':
        if (gameState.player1.score <= 0) winner = 'Player 2'
        if (gameState.player2.score <= 0) winner = 'Player 1'
        if (gameState.player1.currentTarget > 21) winner = 'Player 1'
        if (gameState.player2.currentTarget > 21) winner = 'Player 2'
        break
      case 'killer':
        const playersWithLives = [gameState.player1, gameState.player2].filter(
          (p) => p.lives > 0,
        )
        if (
          selectedPlayers.player1 &&
          selectedPlayers.player2 &&
          playersWithLives.length === 1
        ) {
          winner =
            playersWithLives[0].name === gameState.player1.name
              ? 'Player 1'
              : 'Player 2'
        }
        break
    }

    if (winner && !gameHistory.some((h) => h.gameEnded)) {
      if (winner !== 'Draw' && winner !== 'Practice Over') {
        const winnerPlayer =
          winner === 'Player 1'
            ? selectedPlayers.player1
            : selectedPlayers.player2
        const loserPlayer =
          winner === 'Player 1'
            ? selectedPlayers.player2
            : selectedPlayers.player1
        if (winnerPlayer && winnerPlayer.id !== 'bot') {
          updatePlayerStats(winnerPlayer.id, {
            gamesPlayed: winnerPlayer.stats.gamesPlayed + 1,
            gamesWon: winnerPlayer.stats.gamesWon + 1,
            currentStreak: winnerPlayer.stats.currentStreak + 1,
            longestStreak: Math.max(
              winnerPlayer.stats.longestStreak,
              winnerPlayer.stats.currentStreak + 1,
            ),
          })
        }
        if (loserPlayer && loserPlayer.id !== 'bot') {
          updatePlayerStats(loserPlayer.id, {
            gamesPlayed: loserPlayer.stats.gamesPlayed + 1,
            currentStreak: 0,
          })
        }
        const tournamentMatchData = sessionStorage.getItem('tournament_match')
        if (tournamentMatchData) {
          const { tournamentId, roundIndex, matchIndex } =
            JSON.parse(tournamentMatchData)
          if (winnerPlayer)
            recordMatchWinner(
              tournamentId,
              roundIndex,
              matchIndex,
              winnerPlayer.id,
            )
          sessionStorage.removeItem('tournament_match')
        }
      }
      setGameHistory((prev) => [
        ...prev,
        { gameEnded: true, winner, timestamp: Date.now() },
      ])
      setHighlightedSegments([])
      setBogeyWarning('')
    }
    return winner
  }

  const handleCricketNumberClick = (number) => {
    handleDartThrow(`single-${number}`)
  }

  const winner = useMemo(
    () => isGameWon(),
    [isGameWon, gameState, gameHistory, gameMode, selectedPlayers],
  )

  const handleTournamentPlayerSelect = (playerId) => {
    setTournamentPlayerSelection((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    )
  }

  const createTournament = () => {
    if (!newTournamentName.trim() || tournamentPlayerSelection.length < 2)
      return
    const selectedTournamentPlayers = players.filter((p) =>
      tournamentPlayerSelection.includes(p.id),
    )
    const shuffledPlayers = [...selectedTournamentPlayers].sort(
      () => 0.5 - Math.random(),
    )
    const rounds = [[]]
    let i = 0
    while (i < shuffledPlayers.length) {
      if (shuffledPlayers[i + 1]) {
        rounds[0].push({
          player1: shuffledPlayers[i].id,
          player2: shuffledPlayers[i + 1].id,
          winner: null,
        })
        i += 2
      } else {
        rounds[0].push({
          player1: shuffledPlayers[i].id,
          player2: 'BYE',
          winner: shuffledPlayers[i].id,
        })
        i += 1
      }
    }
    let numMatchesInCurrentRound = rounds[0].length
    while (numMatchesInCurrentRound > 1) {
      const nextRound = []
      const numMatchesInNextRound = Math.ceil(numMatchesInCurrentRound / 2)
      for (let j = 0; j < numMatchesInNextRound; j++) {
        nextRound.push({ player1: null, player2: null, winner: null })
      }
      rounds.push(nextRound)
      numMatchesInCurrentRound = numMatchesInNextRound
    }

    const newTournament = {
      id: Date.now(),
      name: newTournamentName,
      players: tournamentPlayerSelection,
      type: 'single-elimination',
      rounds,
      winner: null,
    }
    setTournaments((prev) => [...prev, newTournament])
    setActiveTournament(newTournament)
    setNewTournamentName('')
    setTournamentPlayerSelection([])
  }

  const startTournamentMatch = (
    player1Id,
    player2Id,
    tournamentId,
    roundIndex,
    matchIndex,
  ) => {
    if (player1Id === null || player2Id === null || player2Id === 'BYE') return
    const player1 = players.find((p) => p.id === player1Id)
    const player2 = players.find((p) => p.id === player2Id)
    setSelectedPlayers({ player1, player2 })
    sessionStorage.setItem(
      'tournament_match',
      JSON.stringify({ tournamentId, roundIndex, matchIndex }),
    )
    setCurrentTab('game')
    setGameModeAndReset('501')
  }

  const getPlayerNameById = (id) =>
    players.find((p) => p.id === id)?.name || 'TBD'

  const formatScore = (score) => {
    if (score.includes('double-bull')) return 'BULLSEYE • 50'
    if (score.includes('single-bull')) return 'OUTER BULL • 25'
    if (score.includes('double-'))
      return `DOUBLE ${score.split('-')[1]} • ${parseInt(score.split('-')[1]) * 2}`
    if (score.includes('triple-'))
      return `TRIPLE ${score.split('-')[1]} • ${parseInt(score.split('-')[1]) * 3}`
    if (score.includes('single-'))
      return `SINGLE ${score.split('-')[1]} • ${score.split('-')[1]}`
    return score.replace(/-/g, ' ').toUpperCase()
  }

  const handleMouseOver = (e, score) => {
    if (score) {
      const formattedScore = formatScore(score)
      setHoverScore(formattedScore)
      setIsScoreActive(true)
      setTimeout(() => setIsScoreActive(false), 400)

      if (['301', '501', '701'].includes(gameMode)) {
        const playerKey = currentPlayer === 1 ? 'player1' : 'player2'
        const currentScore = gameState[playerKey].score
        let points = 0
        if (score.includes('bull')) {
          points = score.includes('double') ? 50 : 25
        } else {
          const parts = score.split('-')
          points =
            parseInt(parts[1]) *
            (parts[0] === 'double' ? 2 : parts[0] === 'triple' ? 3 : 1)
        }
        const newScore = currentScore - points
        if (newScore < 0 || newScore === 1) {
          e.target.classList.add('glow-bust-warning')
        }
      }
    }
  }

  const handleMouseOut = (e) => {
    setHoverScore('')
    e.target.classList.remove('glow-bust-warning')
  }
  const createSegmentPath = (
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
  ) => {
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180
    const x1 = center + innerRadius * Math.cos(startAngleRad)
    const y1 = center + innerRadius * Math.sin(startAngleRad)
    const x2 = center + outerRadius * Math.cos(startAngleRad)
    const y2 = center + outerRadius * Math.sin(startAngleRad)
    const x3 = center + outerRadius * Math.cos(endAngleRad)
    const y3 = center + outerRadius * Math.sin(endAngleRad)
    const x4 = center + innerRadius * Math.cos(endAngleRad)
    const y4 = center + innerRadius * Math.sin(endAngleRad)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`
  }

  const generateSegments = () => {
    const segments = []
    const isX01Game = ['301', '501', '701'].includes(gameMode)

    numbers.forEach((num, i) => {
      const wedgeStartAngle = -99
      const currentAngle = wedgeStartAngle + i * angleIncrement
      const nextAngle = currentAngle + angleIncrement
      // Start color alternating with black/red on the first wedge (20)
      const isBlackWedge = i % 2 === 0
      const primaryColorClass = isBlackWedge ? 'color-b' : 'color-a'
      const ringColorClass = isBlackWedge ? 'color-r' : 'color-g'

      const segmentData = [
        {
          name: `double-${num}`,
          rIn: radii.doubleInner,
          rOut: radii.doubleOuter,
          color: ringColorClass,
        },
        {
          name: `single-${num}-outer`,
          rIn: radii.tripleOuter,
          rOut: radii.singleOuter,
          color: primaryColorClass,
        },
        {
          name: `triple-${num}`,
          rIn: radii.tripleInner,
          rOut: radii.tripleOuter,
          color: ringColorClass,
        },
        {
          name: `single-${num}-inner`,
          rIn: radii.bullOuter,
          rOut: radii.singleInner,
          color: primaryColorClass,
        },
      ]

      segmentData.forEach((seg, segIndex) => {
        const segmentId = seg.name.replace('-outer', '').replace('-inner', '')
        let combinedClasses = `segment ${seg.color}`

        const highlightIndex = highlightedSegments.indexOf(segmentId)
        if (highlightIndex !== -1) {
          if (isX01Game) {
            combinedClasses += ` x01-checkout-target glow-suggested-${highlightIndex + 1}`
          } else if (gameMode === 'cricket') {
            // Future use for cricket specific highlights if needed
          }
        }

        if (
          gameMode === 'cricket' &&
          (cricketNumbers.includes(num) || num === 'bull')
        ) {
          const playerKey = currentPlayer === 1 ? 'player1' : 'player2'
          const opponentKey = currentPlayer === 1 ? 'player2' : 'player1'
          const playerMarks = gameState[playerKey].marks[num]
          const opponentMarks = gameState[opponentKey].marks[num]

          if (playerMarks === 3 && opponentMarks === 3)
            combinedClasses += ' glow-red'
          else if (playerMarks === 3 && opponentMarks < 3)
            combinedClasses += ' glow-green'
          else if (playerMarks < 3) combinedClasses += ' glow-blue'
        }

        segments.push(
          <path
            key={`${i}-${segIndex}`}
            d={createSegmentPath(currentAngle, nextAngle, seg.rIn, seg.rOut)}
            className={combinedClasses}
            data-score={segmentId}
            onMouseEnter={(e) => handleMouseOver(e, segmentId)}
            onMouseLeave={handleMouseOut}
            onClick={(e) => {
              e.target.style.transform = 'scale(0.95)'
              setTimeout(() => {
                e.target.style.transform = ''
              }, 150)
              handleDartThrow(segmentId)
            }}
          />,
        )
      })
    })
    return segments
  }

  const generateNumbers = () => {
    return numbers.map((num, i) => {
      const angleDeg = -90 + i * angleIncrement
      const angleRad = angleDeg * (Math.PI / 180)
      const radius = 225
      const x = center + radius * Math.cos(angleRad)
      const y = center + radius * Math.sin(angleRad)
      return (
        <text
          key={i}
          x={x}
          y={y}
          className="number"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {num}
        </text>
      )
    })
  }

  const GameRules = () => {
    const [activeRule, setActiveRule] = useState('x01')

    const rulesData = {
      x01: {
        title: 'X01 (301, 501, 701)',
        objective:
          'Be the first player to reduce your score from the starting total (e.g., 501) to exactly zero.',
        rules:
          "Players take turns throwing three darts. The total score from the three darts is subtracted from their remaining score. The final dart must land in a double segment (or the double bull) to win. If a player scores more than their remaining score, scores 1, or scores zero but not with a double, their turn is a 'bust,' and their score reverts to what it was at the start of their turn.",
      },
      cricket: {
        title: 'Cricket',
        objective:
          "Be the first player to 'close' all the target numbers (15, 16, 17, 18, 19, 20, and Bull) and have a score equal to or greater than your opponent.",
        rules:
          "To 'close' a number, a player must hit it three times. A single counts as one hit, a double as two, and a triple as three. Once a player has closed a number, any further hits on that number score points, but only if the opponent has not yet closed that number. The game ends when a player has closed all numbers and has the highest score.",
      },
      shanghai: {
        title: 'Shanghai',
        objective:
          "Score the most points by hitting the numbers 1 through 7 in sequence, or win instantly by hitting a 'Shanghai.'",
        rules:
          "In each round, all players throw three darts at the current target number (Round 1 is 1, Round 2 is 2, etc.). Only hits on the current target score points. A 'Shanghai' is when a player hits the single, double, and triple of the target number in one turn, which wins the game immediately. If no one hits a Shanghai after 7 rounds, the player with the highest score wins.",
      },
      around_the_clock: {
        title: 'Around The Clock',
        objective:
          'Be the first player to hit every number from 1 to 20, and finally the bullseye, in sequence.',
        rules:
          'Players must hit the number 1, then 2, then 3, and so on. Any hit (single, double, or triple) on the current target number allows the player to advance to the next target. The first player to hit all numbers from 1-20 and then the bull wins.',
      },
      bobs_27: {
        title: "Bob's 27",
        objective:
          'A practice routine to improve double-hitting. Finish with the highest score possible after throwing at all the doubles.',
        rules:
          "This is a solo game. You start with 27 points. You throw three darts at each double, starting from 1 and going to 20, then the bullseye. For each dart that hits the correct double, you add the value of that double to your score (e.g., hitting a double 2 adds 4 points). If you miss the target double with all three darts in a turn, you subtract the value of that double from your score (e.g., missing double 2 subtracts 4 points). The game ends if your score drops to zero or below, or after you've thrown at the double bull.",
      },
      killer: {
        title: 'Killer',
        objective: "Be the last player with 'lives' remaining.",
        rules:
          "Each player is assigned a number. Players must first hit the double of their own number to become a 'Killer.' Once a player is a killer, they can aim for their opponents' doubles. Each time a killer hits an opponent's double, that opponent loses a life. Players typically start with 3 lives. The last player with lives wins.",
      },
    }

    return (
      <div className="player-management">
        <h2 className="cricket-title">Game Rules</h2>
        <div className="rules-tab-nav">
          {Object.keys(rulesData).map((key) => (
            <button
              key={key}
              className={`rules-tab-btn ${activeRule === key ? 'active' : ''}`}
              onClick={() => setActiveRule(key)}
            >
              {rulesData[key].title}
            </button>
          ))}
        </div>
        <div className="rules-content-area">
          <div className="rule-section">
            <h3>{rulesData[activeRule].title}</h3>
            <p>
              <strong>Objective:</strong> {rulesData[activeRule].objective}
            </p>
            <p>
              <strong>Rules:</strong> {rulesData[activeRule].rules}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const KillerScoreboard = () => {
    let statusMessage = ''
    const p1State = gameState.player1
    const p2State = gameState.player2
    const currentPlayerState = currentPlayer === 1 ? p1State : p2State

    if (gamePhase === 'setup') {
      statusMessage = `${currentPlayerState.name}, throw for your number!`
    } else {
      if (!currentPlayerState.isKiller) {
        statusMessage = `${currentPlayerState.name}, hit D${currentPlayerState.assignedNumber} to become a Killer!`
      } else {
        statusMessage = `KILLER ${currentPlayerState.name}, eliminate your opponent!`
      }
    }

    return (
      <div className="generic-scoreboard">
        <div className="cricket-header">
          <h2 className="cricket-title">KILLER</h2>
          <div className="game-controls">
            <button className="control-btn" onClick={resetGame}>
              RESET
            </button>
            <button className="control-btn" onClick={() => nextPlayer()}>
              NEXT PLAYER
            </button>
            <button
              className="control-btn undo-btn"
              onClick={undoLastDart}
              disabled={gameHistory.length === 0}
            >
              UNDO
            </button>
          </div>
        </div>
        <div className="last-dart-display">
          <span className="last-dart-text">{lastDart || statusMessage}</span>
        </div>
        <div className="practice-scoreboard">
          <div
            className={`practice-player ${currentPlayer === 1 ? 'active' : ''}`}
          >
            <div className="player-name">
              {p1State.isKiller && '🔪'} {p1State.name}
            </div>
            <div className="killer-number">
              Number: <span>{p1State.assignedNumber || '?'}</span>
            </div>
            <div className="killer-lives">
              {Array.from({ length: p1State.lives }).map((_, i) => (
                <span key={i}>❤️</span>
              ))}
            </div>
          </div>
          <div
            className={`practice-player ${currentPlayer === 2 ? 'active' : ''}`}
          >
            <div className="player-name">
              {p2State.isKiller && '🔪'} {p2State.name}
            </div>
            <div className="killer-number">
              Number: <span>{p2State.assignedNumber || '?'}</span>
            </div>
            <div className="killer-lives">
              {Array.from({ length: p2State.lives }).map((_, i) => (
                <span key={i}>❤️</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const BullseyeGlowWrapper = ({ children }) => {
    const segmentId = children.props['data-score']
    let combinedClasses = children.props.className || ''
    const isX01Game = ['301', '501', '701'].includes(gameMode)

    if (gameMode === 'cricket') {
      const playerKey = currentPlayer === 1 ? 'player1' : 'player2'
      const opponentKey = currentPlayer === 1 ? 'player2' : 'player1'
      const playerMarks = gameState[playerKey].marks.bull
      const opponentMarks = gameState[opponentKey].marks.bull

      if (playerMarks === 3 && opponentMarks === 3)
        combinedClasses += ' glow-red'
      else if (playerMarks === 3 && opponentMarks < 3)
        combinedClasses += ' glow-green'
      else if (playerMarks < 3) combinedClasses += ' glow-blue'
    }

    const highlightIndex = highlightedSegments.indexOf(segmentId)
    if (highlightIndex !== -1 && isX01Game) {
      combinedClasses += ` x01-checkout-target glow-suggested-${highlightIndex + 1}`
    }

    return React.cloneElement(children, {
      className: combinedClasses,
      onMouseEnter: (e) => handleMouseOver(e, segmentId),
      onMouseLeave: handleMouseOut,
    })
  }

  const toggleSection = (section) => {
    setActiveGameSection((prev) => (prev === section ? null : section))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-gray-900">
      <style>{`
        :root { --primary-glow: #6366f1; --secondary-glow: #8b5cf6; --accent-glow: #06b6d4; --dart-gold: #fbbf24; --dart-silver: #e5e7eb; }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; touch-action: manipulation; background: radial-gradient(ellipse at center, #0f0f23 0%, #050505 100%); min-height: 100vh; overflow-x: hidden; color: #E5E7EB; }
        .tournament-management, .player-management, .player-comparison { background: rgba(15,15,35,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(99,102,241,0.3); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.1); padding: 1.5rem; margin-bottom: 2rem; max-width: 800px; width: 100%; }
        .tournament-list { list-style: none; padding: 0; }
        .tournament-item { background: rgba(0,0,0,0.3); border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .tournament-bracket { display: flex; gap: 1rem; overflow-x: auto; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 12px; }
        .bracket-round { display: flex; flex-direction: column; gap: 2rem; min-width: 250px; }
        .bracket-match { background: rgba(0,0,0,0.4); border: 1px solid rgba(139,92,246,0.3); border-radius: 8px; padding: 0.75rem; color: #D1D5DB; }
        .match-players { display: flex; flex-direction: column; gap: 0.5rem; }
        .match-player { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-radius: 4px; }
        .match-player.winner { background-color: rgba(34,197,94,0.2); font-weight: bold; color: #22C55E; }
        .play-match-btn { margin-top: 0.5rem; width: 100%; }
        body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.1), transparent), radial-gradient(2px 2px at 40px 70px, rgba(139,92,246,0.2), transparent), radial-gradient(1px 1px at 90px 40px, rgba(99,102,241,0.3), transparent), radial-gradient(1px 1px at 130px 80px, rgba(6,182,212,0.2), transparent); background-repeat: repeat; background-size: 200px 150px; animation: sparkle 8s ease-in-out infinite alternate; pointer-events: none; z-index: -1; }
        @keyframes sparkle { 0% { opacity: 0.3; transform: scale(1) rotate(0deg); } 100% { opacity: 0.8; transform: scale(1.1) rotate(360deg); } }
        .dartboard-component { width: 95vw; max-width: 650px; aspect-ratio: 1 / 1; position: relative; margin: 2rem auto; filter: drop-shadow(0 25px 50px rgba(99,102,241,0.3)); }
        .dartboard-svg-container { width: 100%; height: 100%; position: relative; }
        .dartboard-svg { width: 100%; height: 100%; }
        .dartboard-overlay { width: 100%; height: 100%; pointer-events: auto; }
        .segment { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); transform-origin: center; cursor: pointer; stroke-linejoin: round; }
        .segment:hover:not(.x01-checkout-target) { filter: brightness(1.6) saturate(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5)); transform: scale(1.02); }
        .color-a { fill: url(#gradient-a); stroke: #d4bc3c; } .color-b { fill: url(#gradient-b); stroke: #2a2a2a; } .color-g { fill: url(#gradient-g); stroke: #15803d; } .color-r { fill: url(#gradient-r); stroke: #b91c1c; }
        .number { font-family: 'Orbitron', monospace; font-size: 24px; font-weight: 900; fill: #ffffff; pointer-events: none; text-shadow: 0 0 10px rgba(99,102,241,0.8), 0 0 20px rgba(139,92,246,0.6); animation: glow 3s ease-in-out infinite alternate; }
        .glow-blue { filter: drop-shadow(0 0 8px #3b82f6) drop-shadow(0 0 18px #3b82f6aa); }
        .glow-green { filter: drop-shadow(0 0 8px #22c55e) drop-shadow(0 0 18px #22c55eaa); }
        .glow-red { filter: drop-shadow(0 0 8px #ef4444) drop-shadow(0 0 18px #ef4444aa); }
        .x01-checkout-target { filter: url(#bevel-hover) !important; animation: pulseSuggested 1.5s infinite; transform: scale(1.02); }
        .glow-suggested-1 { drop-shadow(0 0 15px #06b6d4) drop-shadow(0 0 30px #06b6d4); stroke: #06b6d4 !important; stroke-width: 4px !important; }
        .glow-suggested-2 { drop-shadow(0 0 12px #fbbf24) drop-shadow(0 0 25px #fbbf24); stroke: #fbbf24 !important; stroke-width: 4px !important; animation-delay: 0.2s; }
        .glow-suggested-3 { drop-shadow(0 0 10px #f59e0b) drop-shadow(0 0 20px #f59e0b); stroke: #f59e0b !important; stroke-width: 4px !important; animation-delay: 0.4s; }
        .glow-bust-warning { animation: pulseBust 0.5s infinite; stroke: #ef4444 !important; stroke-width: 4px !important; }
        @keyframes glow { 0% { text-shadow: 0 0 10px rgba(99,102,241,0.8), 0 0 20px rgba(139,92,246,0.6); } 100% { text-shadow: 0 0 15px rgba(99,102,241,1), 0 0 30px rgba(139,92,246,0.8); } }
        @keyframes pulseSuggested { 0%, 100% { opacity: 1; transform: scale(1.02); } 50% { opacity: 0.8; transform: scale(1.05); } }
        @keyframes pulseBust { 0%, 100% { filter: drop-shadow(0 0 10px #ef4444) drop-shadow(0 0 25px #ef4444); } 50% { filter: drop-shadow(0 0 5px #ef4444) drop-shadow(0 0 12px #ef4444); } }
        .score-display { background: rgba(15,15,35,0.9); backdrop-filter: blur(20px); border: 1px solid rgba(99,102,241,0.2); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.1); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .score-display::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.1), transparent); transition: left 0.6s; }
        .score-display:hover::before { left: 100%; }
        .score-display:hover { transform: translateY(-2px); box-shadow: 0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.2); }
        .title { font-family: 'Orbitron', monospace; font-weight: 900; font-size: clamp(24px, 6vw, 48px); background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradientShift 4s ease-in-out infinite; text-align: center; margin-bottom: 1rem; }
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .subtitle { color: rgba(255,255,255,0.7); font-size: clamp(14px, 3vw, 20px); font-weight: 300; text-align: center; margin-bottom: 1.5rem; }
        .hover-score { font-family: 'Orbitron', monospace; font-weight: 700; font-size: clamp(20px, 5vw, 40px); background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center; min-height: 3rem; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; transform-origin: center; }
        .score-active { animation: scorePopIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        @keyframes scorePopIn { 0% { transform: scale(0.8) rotateY(-90deg); opacity: 0; } 100% { transform: scale(1) rotateY(0deg); opacity: 1; } }
        .dartboard-glow { position: absolute; top: 50%; left: 50%; width: 120%; height: 120%; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%); transform: translate(-50%, -50%); animation: pulse 4s ease-in-out infinite; pointer-events: none; z-index: -1; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); } }
        .cricket-scoreboard, .generic-scoreboard { background: rgba(15,15,35,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(99,102,241,0.3); border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.1); padding: 1.5rem; margin-bottom: 2rem; max-width: 800px; width: 100%; }

        .game-selection-card { min-height: 36rem; }

        .cricket-scoreboard { /* removed scale transform to keep default size */ min-height: 36rem; }

        .dartboard-card {
          background: rgba(15,15,35,0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
          padding: 1.5rem;
          margin-bottom: 2rem;
          max-width: 800px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .cricket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
        .cricket-title, .comparison-title, .game-selection-title { font-family: 'Orbitron', monospace; font-weight: 700; font-size: clamp(18px, 4vw, 24px); background: linear-gradient(135deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .game-controls { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .control-btn { padding: 0.5rem 1rem; border: 1px solid rgba(99,102,241,0.3); border-radius: 12px; background: rgba(99,102,241,0.1); color: white; font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .control-btn:hover:not(:disabled) { background: rgba(99,102,241,0.3); border-color: rgba(99,102,241,0.5); transform: translateY(-1px); }
        .control-btn:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(99,102,241,0.05); border-color: rgba(99,102,241,0.1); }
        .undo-btn { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #fca5a5; }
        .undo-btn:hover:not(:disabled) { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.5); }
        .back-btn { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #fcd34d; }
        .back-btn:hover:not(:disabled) { background: rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.5); }
        .game-section-headers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem; }
        .game-section-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 0.75rem 1rem; border-radius: 12px; transition: background-color 0.3s ease; border: 1px solid rgba(139, 92, 246, 0.2); }
        .game-section-header:hover { background-color: rgba(139, 92, 246, 0.1); }
        .game-mode-selector { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.75rem; overflow: hidden; max-height: 0; transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out, margin 0.5s ease-in-out; }
        .game-mode-selector.expanded { max-height: 500px; padding: 1rem 0; }
        .mode-btn { padding: 0.75rem 1rem; border: 2px solid rgba(99,102,241,0.3); border-radius: 16px; background: rgba(99,102,241,0.1); color: white; font-family: 'Orbitron', monospace; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; text-align: center; }
        .mode-btn:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); transform: translateY(-1px); }
        .mode-btn.active { background: rgba(99,102,241,0.4); border-color: rgba(99,102,241,0.8); box-shadow: 0 0 20px rgba(99,102,241,0.4); }
        .countdown-scoreboard, .practice-scoreboard { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .countdown-player, .practice-player { display: flex; flex-direction: column; align-items: center; padding: 1.5rem; border-radius: 16px; background: rgba(0,0,0,0.3); border: 2px solid transparent; transition: all 0.3s ease; position: relative; }
        .countdown-player.active, .practice-player.active { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.1); box-shadow: 0 0 20px rgba(99,102,241,0.3); }
        .countdown-score, .practice-score { font-family: 'Orbitron', monospace; font-weight: 900; font-size: clamp(36px, 8vw, 64px); background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .target-display { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 18px; color: #06b6d4; text-shadow: 0 0 10px rgba(6,182,212,0.5); }
        .checkout-suggestion { font-family: 'Orbitron', monospace; font-size: 14px; font-weight: 600; color: #06b6d4; text-shadow: 0 0 10px rgba(6,182,212,0.5); min-height: 20px; }
        .checkout-suggestion span { margin: 0 0.25rem; }
        .cricket-board { display: grid; grid-template-columns: auto 1fr 1fr; gap: 0.5rem; align-items: center; }
        .cricket-number { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 18px; color: #ffffff; text-align: center; padding: 0.5rem; background: rgba(99,102,241,0.1); border-radius: 8px; border: 1px solid rgba(99,102,241,0.2); }
        .player-column { display: flex; flex-direction: column; align-items: center; padding: 0.5rem; border-radius: 12px; background: rgba(0,0,0,0.3); border: 2px solid transparent; transition: all 0.3s ease; }
        .player-column.active { border-color: rgba(99,102,241,0.5); background: rgba(99,102,241,0.1); box-shadow: 0 0 20px rgba(99,102,241,0.3); }
        .player-name { font-family: 'Orbitron', monospace; font-weight: 600; font-size: 14px; color: #ffffff; margin-bottom: 0.25rem; }
        .killer-number { font-family: 'Orbitron', monospace; font-weight: 600; font-size: 16px; color: #e5e7eb; margin: 0.5rem 0; }
        .killer-number span { color: #fbbf24; font-weight: 700; }
        .killer-lives { font-size: 24px; letter-spacing: 0.2em; }
        .dart-indicator { font-family: 'Orbitron', monospace; font-weight: 400; font-size: 12px; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem; }
        .dart-indicator.active { color: #22c55e; text-shadow: 0 0 10px rgba(34,197,94,0.5); }
        .player-score { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 20px; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .marks-display { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 24px; color: #22c55e; text-shadow: 0 0 10px rgba(34,197,94,0.5); min-height: 30px; display: flex; align-items: center; justify-content: center; }
        .marks-display.closed { color: #fbbf24; text-shadow: 0 0 15px rgba(251,191,36,0.8); animation: closedPulse 2s ease-in-out infinite; }
        @keyframes closedPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .winner-display { text-align: center; padding: 1rem; background: rgba(34,197,94,0.2); border: 1px solid rgba(34,197,94,0.5); border-radius: 12px; margin-top: 1rem; }
        .winner-text { font-family: 'Orbitron', monospace; font-weight: 900; font-size: 24px; background: linear-gradient(135deg, #22c55e, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: winnerGlow 1s ease-in-out infinite alternate; }
        @keyframes winnerGlow { 0% { filter: brightness(1); } 100% { filter: brightness(1.3); } }
        .last-dart-display { text-align: center; padding: 0.75rem; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); border-radius: 12px; margin-bottom: 1rem; min-height: 3rem; display: flex; align-items: center; justify-content: center; }
        .last-dart-text { font-family: 'Orbitron', monospace; font-weight: 600; font-size: 14px; color: rgba(255,255,255,0.9); }
        .last-dart-value { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 16px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-left: 0.5rem; }
        .tab-navigation { display: flex; justify-content: center; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;}
        .tab-btn { padding: 1rem 2rem; border: 2px solid rgba(99,102,241,0.3); border-radius: 16px; background: rgba(99,102,241,0.1); color: white; font-family: 'Orbitron', monospace; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; min-width: 120px; }
        .tab-btn:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); transform: translateY(-2px); }
        .tab-btn.active { background: rgba(99,102,241,0.4); border-color: rgba(99,102,241,0.8); box-shadow: 0 0 25px rgba(99,102,241,0.4); }
        .add-player-section { display: flex; gap: 1rem; margin-bottom: 2rem; align-items: center; flex-wrap: wrap; }
        .player-input { flex: 1; min-width: 200px; padding: 0.75rem 1rem; border: 2px solid rgba(99,102,241,0.3); border-radius: 12px; background: rgba(0,0,0,0.3); color: white; font-family: 'Orbitron', monospace; font-size: 16px; outline: none; transition: all 0.3s ease; }
        .player-input:focus { border-color: rgba(99,102,241,0.6); box-shadow: 0 0 15px rgba(99,102,241,0.3); }
        .player-input::placeholder { color: rgba(255,255,255,0.5); }
        .add-btn { padding: 0.75rem 1.5rem; border: 2px solid rgba(34,197,94,0.5); border-radius: 12px; background: rgba(34,197,94,0.2); color: #22c55e; font-family: 'Orbitron', monospace; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
        .add-btn:hover { background: rgba(34,197,94,0.3); transform: translateY(-1px); }
        .players-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .player-card { background: rgba(0,0,0,0.4); border: 2px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 1.5rem; transition: all 0.3s ease; }
        .player-card:hover { border-color: rgba(99,102,241,0.4); transform: translateY(-2px); }
        .player-card.selected { border-color: rgba(34,197,94,0.6); background: rgba(34,197,94,0.1); box-shadow: 0 0 20px rgba(34,197,94,0.3); }
        .player-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .player-actions { display: flex; gap: 0.5rem; }
        .action-btn { padding: 0.25rem 0.5rem; border: 1px solid; border-radius: 8px; background: transparent; font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .edit-btn { color: #fbbf24; border-color: rgba(251,191,36,0.5); }
        .edit-btn:hover { background: rgba(251,191,36,0.2); }
        .delete-btn { color: #ef4444; border-color: rgba(239,68,68,0.5); }
        .delete-btn:hover { background: rgba(239,68,68,0.2); }
        .select-btn { color: #22c55e; border-color: rgba(34,197,94,0.5); }
        .select-btn:hover { background: rgba(34,197,94,0.2); }
        .action-btn:disabled { opacity: 0.5; cursor: not-allowed; background: rgba(0,0,0,0.2); }
        .player-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        .stat-item { display: flex; justify-content: space-between; padding: 0.5rem; background: rgba(99,102,241,0.1); border-radius: 8px; border: 1px solid rgba(99,102,241,0.2); }
        .stat-label { font-family: 'Orbitron', monospace; font-size: 12px; color: rgba(255,255,255,0.7); }
        .stat-value { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 14px; color: #fbbf24; }
        .player-selection { background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.3); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
        .selection-title { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 18px; color: #8b5cf6; margin-bottom: 1rem; text-align: center; }
        .selection-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .player-slot { text-align: center; padding: 1rem; background: rgba(0,0,0,0.3); border-radius: 12px; border: 2px solid rgba(99,102,241,0.2); }
        .slot-title { font-family: 'Orbitron', monospace; font-weight: 600; font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; }
        .selected-player { font-family: 'Orbitron', monospace; font-weight: 700; font-size: 16px; color: #22c55e; margin-bottom: 0.5rem; }
        .comparison-header { text-align: center; margin-bottom: 2rem; }
        .comparison-subtitle { font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,0.7); }
        .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .chart-container { background: rgba(0,0,0,0.3); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; padding: 1.5rem; text-align: center; }
        .radar-chart-container { grid-column: 1 / -1; }
        .chart-title { font-family: 'Orbitron', monospace; font-weight: 600; font-size: 16px; color: #ffffff; margin-bottom: 1rem; }
        .bar-chart { display: flex; align-items: end; justify-content: center; gap: 2rem; height: 200px; margin: 1rem 0; }
        .bar-group { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .bar { width: 40px; background: linear-gradient(180deg, var(--color), transparent); border-radius: 4px 4px 0 0; border: 1px solid var(--color); transition: all 0.3s ease; position: relative; }
        .bar:hover { filter: brightness(1.3); transform: scaleY(1.05); }
        .bar-label { font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 600; color: var(--color); text-align: center; max-width: 60px; }
        .bar-value { font-family: 'Orbitron', monospace; font-size: 10px; color: rgba(255,255,255,0.8); position: absolute; top: -20px; left: 50%; transform: translateX(-50%); white-space: nowrap; }
        .radar-chart { position: relative; width: 250px; height: 250px; margin: 0 auto; }
        .radar-svg { width: 100%; height: 100%; }
        .radar-grid { fill: none; stroke: rgba(99,102,241,0.2); stroke-width: 1; }
        .radar-axis { stroke: rgba(99,102,241,0.3); stroke-width: 1; }
        .radar-label { font-family: 'Orbitron', monospace; font-size: 12px; font-weight: 600; fill: #ffffff; text-anchor: middle; }
        .radar-area { fill: var(--color); fill-opacity: 0.2; stroke: var(--color); stroke-width: 2; }
        .radar-point { fill: var(--color); r: 4; }
        .legend { display: flex; justify-content: center; gap: 2rem; margin-top: 1rem; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; }
        .legend-color { width: 16px; height: 16px; border-radius: 4px; background: var(--color); }
        .legend-text { font-family: 'Orbitron', monospace; font-size: 14px; font-weight: 600; color: #ffffff; }
        .no-comparison { text-align: center; padding: 3rem; color: rgba(255,255,255,0.5); font-family: 'Orbitron', monospace; }
        .player-checkbox-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .player-checkbox { display: flex; align-items: center; background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 8px; cursor: pointer; border: 1px solid transparent; color: #E5E7EB; }
        .player-checkbox input { display: none; }
        .player-checkbox .custom-checkbox { width: 20px; height: 20px; background: #333; border: 1px solid #555; border-radius: 4px; margin-right: 10px; display: flex; align-items: center; justify-content: center; }
        .player-checkbox input:checked + .custom-checkbox { background: #6366f1; border-color: #8b5cf6; }
        .player-checkbox input:checked + .custom-checkbox::after { content: '✔'; color: white; font-size: 14px; }
        .bot-section { margin-top: 2rem; border-top: 1px solid rgba(99,102,241,0.2); padding-top: 2rem; }
        .bot-slider { display: flex; flex-direction: column; gap: 1rem; align-items: center; }
        .bot-slider label { font-family: 'Orbitron', monospace; }
        .bot-slider input[type=range] { width: 80%; }
        .rules-tab-nav { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(99,102,241,0.2); }
        .rules-tab-btn { padding: 0.5rem 1rem; border: 1px solid rgba(99,102,241,0.2); border-radius: 12px; background: rgba(99,102,241,0.05); color: #a7a7ff; font-family: 'Orbitron', monospace; font-size: 12px; cursor: pointer; transition: all 0.3s ease; }
        .rules-tab-btn:hover { background: rgba(99,102,241,0.2); }
        .rules-tab-btn.active { background: rgba(99,102,241,0.4); color: white; border-color: rgba(99,102,241,0.5); }
        .rules-content-area { max-height: 60vh; overflow-y: auto; padding-right: 1rem; }
        .rule-section h3 { font-family: 'Orbitron', monospace; font-size: 1.25rem; color: #8b5cf6; margin-bottom: 0.5rem; }
        .rule-section p { color: rgba(255,255,255,0.8); line-height: 1.6; }
        .rule-section p > strong { color: #ffffff; }
        .practice-player-solo { grid-column: 1 / -1; }
        .practice-summary { text-align: center; padding: 2rem; }
        .practice-summary-title { font-size: 1.5rem; color: #fbbf24; margin-bottom: 1rem; }
        .practice-summary-stat { font-size: 1.1rem; margin-bottom: 0.5rem; }
        .bogey-warning-display { text-align: center; padding: 0.75rem; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); border-radius: 12px; margin-top: 1rem; color: #fcd34d; font-family: 'Orbitron', monospace; font-weight: 600; }
        @media (max-width: 768px) { .dartboard-component { width: 90vw; margin: 1rem auto; } .score-display { margin: 0 1rem 2rem 1rem; padding: 1.5rem; } .charts-grid { grid-template-columns: 1fr; gap: 1rem; } .player-comparison { padding: 1rem; margin-bottom: 1rem; } .chart-title { font-size: 14px; } .bar-chart { height: 150px; gap: 1rem; } .bar { width: 30px; } .radar-chart { width: 200px; height: 200px; } .game-section-headers-grid { grid-template-columns: 1fr; } }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;600&display=swap"
        rel="stylesheet"
      />

      <div className="score-display mb-8 p-6 w-full max-w-md relative">
        <h1 className="title">PRECISION DARTBOARD</h1>
        <p className="subtitle">Professional dart game system</p>
        <div className={`hover-score ${isScoreActive ? 'score-active' : ''}`}>
          {hoverScore || '\u00A0'}
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${currentTab === 'game' ? 'active' : ''}`}
          onClick={() => setCurrentTab('game')}
        >
          🎯 GAME
        </button>
        <button
          className={`tab-btn ${currentTab === 'players' ? 'active' : ''}`}
          onClick={() => setCurrentTab('players')}
        >
          👥 PLAYERS
        </button>
        <button
          className={`tab-btn ${currentTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => setCurrentTab('tournaments')}
        >
          🏆 TOURNAMENTS
        </button>
        <button
          className={`tab-btn ${currentTab === 'rules' ? 'active' : ''}`}
          onClick={() => setCurrentTab('rules')}
        >
          ? RULES
        </button>
      </div>

      {currentTab === 'rules' && <GameRules />}

      {currentTab === 'tournaments' && (
        <div className="tournament-management">
          {activeTournament ? (
            <div>
              <div className="cricket-header">
                <h2 className="cricket-title">{activeTournament.name}</h2>
                <button
                  className="control-btn"
                  onClick={() => setActiveTournament(null)}
                >
                  ← Back to List
                </button>
              </div>
              {activeTournament.winner ? (
                <div className="winner-display">
                  <div className="winner-text">
                    🏆 TOURNAMENT WINNER:{' '}
                    {getPlayerNameById(activeTournament.winner)} 🏆
                  </div>
                </div>
              ) : (
                <div className="tournament-bracket">
                  {activeTournament.rounds.map((round, roundIndex) => (
                    <div key={roundIndex} className="bracket-round">
                      <h3 className="chart-title">Round {roundIndex + 1}</h3>
                      {round.map((match, matchIndex) => (
                        <div key={matchIndex} className="bracket-match">
                          <div className="match-players">
                            <div
                              className={`match-player ${match.winner === match.player1 ? 'winner' : ''}`}
                            >
                              <span>{getPlayerNameById(match.player1)}</span>
                            </div>
                            <div
                              style={{
                                textAlign: 'center',
                                margin: '0.25rem 0',
                                color: '#8b5cf6',
                              }}
                            >
                              vs
                            </div>
                            <div
                              className={`match-player ${match.winner === match.player2 ? 'winner' : ''}`}
                            >
                              <span>
                                {match.player2 === 'BYE'
                                  ? 'BYE'
                                  : getPlayerNameById(match.player2)}
                              </span>
                            </div>
                          </div>
                          {match.player1 &&
                            match.player2 &&
                            match.player2 !== 'BYE' &&
                            !match.winner && (
                              <button
                                className="control-btn play-match-btn"
                                onClick={() =>
                                  startTournamentMatch(
                                    match.player1,
                                    match.player2,
                                    activeTournament.id,
                                    roundIndex,
                                    matchIndex,
                                  )
                                }
                              >
                                PLAY
                              </button>
                            )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="cricket-header">
                <h2 className="cricket-title">CREATE NEW TOURNAMENT</h2>
              </div>
              <div className="add-player-section">
                <input
                  type="text"
                  className="player-input"
                  placeholder="Tournament Name..."
                  value={newTournamentName}
                  onChange={(e) => setNewTournamentName(e.target.value)}
                />
              </div>
              <h3
                className="selection-title"
                style={{ textAlign: 'left', marginBottom: '1rem' }}
              >
                Select Players ({tournamentPlayerSelection.length})
              </h3>
              <div className="player-checkbox-list">
                {players.map((player) => (
                  <label key={player.id} className="player-checkbox">
                    <input
                      type="checkbox"
                      checked={tournamentPlayerSelection.includes(player.id)}
                      onChange={() => handleTournamentPlayerSelect(player.id)}
                    />
                    <span className="custom-checkbox"></span>
                    {player.name}
                  </label>
                ))}
              </div>
              <button
                className="add-btn"
                style={{ width: '100%' }}
                onClick={createTournament}
                disabled={tournamentPlayerSelection.length < 2}
              >
                CREATE TOURNAMENT
              </button>

              <hr
                style={{
                  margin: '2rem 0',
                  borderColor: 'rgba(99,102,241,0.2)',
                }}
              />

              <div className="cricket-header">
                <h2 className="cricket-title">EXISTING TOURNAMENTS</h2>
              </div>
              <ul className="tournament-list">
                {tournaments.length > 0 ? (
                  tournaments.map((t) => (
                    <li key={t.id} className="tournament-item">
                      <span>{t.name}</span>
                      <button
                        className="control-btn"
                        onClick={() => setActiveTournament(t)}
                      >
                        View Bracket
                      </button>
                    </li>
                  ))
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                    No tournaments created yet.
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
      {currentTab === 'players' && (
        <PlayerManagement
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          addPlayer={addPlayer}
          players={players}
          selectedPlayers={selectedPlayers}
          selectPlayer={selectPlayer}
          botOpponent={botOpponent}
          setBotOpponent={setBotOpponent}
          editingPlayer={editingPlayer}
          setEditingPlayer={setEditingPlayer}
          deletePlayer={deletePlayer}
          updatePlayerName={updatePlayerName}
          generateBarChartData={generateBarChartData}
          generateRadarData={generateRadarData}
          generateRadarGridPath={generateRadarGridPath}
          generateRadarAxes={generateRadarAxes}
        />
      )}
      {currentTab === 'game' && (
        <ScoreboardUI
          activeGameSection={activeGameSection}
          toggleSection={toggleSection}
          standardGames={standardGames}
          partyGames={partyGames}
          practiceModes={practiceModes}
          gameMode={gameMode}
          setGameModeAndReset={setGameModeAndReset}
          winner={winner}
          KillerScoreboard={KillerScoreboard}
          gameState={gameState}
          currentPlayer={currentPlayer}
          dartCount={dartCount}
          cricketNumbers={cricketNumbers}
          getMarkDisplay={getMarkDisplay}
          resetGame={resetGame}
          nextPlayer={nextPlayer}
          undoLastDart={undoLastDart}
          goBackTurn={goBackTurn}
          lastDart={lastDart}
          gameHistory={gameHistory}
          checkoutSuggestion={checkoutSuggestion}
          bogeyWarning={bogeyWarning}
          selectedPlayers={selectedPlayers}
          showBoard={showBoard}
          toggleBoardVisibility={toggleBoardVisibility}
          handleCricketNumberClick={handleCricketNumberClick}
          showTotalInput={showTotalInput}
          setShowTotalInput={setShowTotalInput}
          turnTotal={turnTotal}
          setTurnTotal={setTurnTotal}
          handleTurnTotalSubmit={handleTurnTotalSubmit}
          dartboardOverlay={
            <DartboardSVG
              center={center}
              radii={radii}
              generateSegments={generateSegments}
              generateNumbers={generateNumbers}
              handleDartThrow={handleDartThrow}
              BullseyeGlowWrapper={BullseyeGlowWrapper}
            />
          }
        />
      )}
    </div>
  )
}

export default StunningDartboard
