'use client'
import { useState } from 'react'
import StunningDartboard from '../dartboard/StunningDartboard'
import ScoreOverlay from './ScoreOverlay'

function GameTypePill({ gameType, visible }) {
  return (
    <div className={`game-type-pill ${visible ? 'show' : ''}`}>{gameType}</div>
  )
}

function Panel({ player, collapsed, side }) {
  return (
    <div className={`hud-side ${side} ${collapsed ? 'collapsed' : ''}`}>
      <div className="player-name">{player.name}</div>
      <div className="player-score">{player.score}</div>
      <div className="marks-row">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`cricket-dot ${player.marks > i ? `hit-${player.marks}` : ''}`}
          ></span>
        ))}
      </div>
    </div>
  )
}

export default function GameHUD() {
  const [players] = useState([
    { id: 1, name: 'Player 1', score: 0, marks: 0 },
    { id: 2, name: 'Player 2', score: 0, marks: 0 },
  ])
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [dartCount, setDartCount] = useState(1)
  const [round, setRound] = useState(1)
  const [gameType, setGameType] = useState('501')
  const [showGameType, setShowGameType] = useState(false)
  const [overlay, setOverlay] = useState(null)

  const gameTypes = ['501', 'Cricket']

  const cycleGameType = () => {
    const idx = gameTypes.indexOf(gameType)
    const next = gameTypes[(idx + 1) % gameTypes.length]
    setGameType(next)
    setShowGameType(true)
    setTimeout(() => setShowGameType(false), 1200)
  }

  const handleScore = (points) => {
    const id = Date.now()
    setOverlay({ value: points, id })
    setTimeout(() => setOverlay(null), 1000)
  }

  return (
    <div className="game-hud">
      <div className="hud-top-bar">
        <button aria-label="Game Mode" onClick={cycleGameType}>🎮</button>
        <button aria-label="Players">👥</button>
        <button aria-label="Score">🏆</button>
        <button aria-label="Settings">⚙️</button>
      </div>
      <Panel
        player={players[0]}
        collapsed={currentPlayer !== 1}
        side="left"
      />
      <div className="hud-board">
        <StunningDartboard onScore={handleScore} />
        <GameTypePill gameType={gameType} visible={showGameType} />
        {overlay && <ScoreOverlay score={overlay.value} id={overlay.id} />}
      </div>
      <Panel
        player={players[1]}
        collapsed={currentPlayer !== 2}
        side="right"
      />
      <div className="hud-bottom">
        <button aria-label="Undo">Undo</button>
        <div>Darts: {dartCount}</div>
        <div>Round: {round}</div>
        <button aria-label="Next">Next</button>
      </div>
    </div>
  )
}
