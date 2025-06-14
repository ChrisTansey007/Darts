'use client'
import React, { Fragment } from 'react'
import GameSelectionIcon from './GameSelectionIcon'

const ScoreboardUI = ({
  activeGameSection,
  toggleSection,
  standardGames,
  partyGames,
  practiceModes,
  gameMode,
  setGameModeAndReset,
  winner,
  KillerScoreboard,
  gameState,
  currentPlayer,
  dartCount,
  cricketNumbers,
  getMarkDisplay,
  resetGame,
  nextPlayer,
  undoLastDart,
  goBackTurn,
  lastDart,
  gameHistory,
  checkoutSuggestion,
  bogeyWarning,
  selectedPlayers,
  showBoard,
  toggleBoardVisibility,
  handleCricketNumberClick,
  showTotalInput,
  setShowTotalInput,
  turnTotal,
  setTurnTotal,
  handleTurnTotalSubmit,
  dartboardOverlay,
}) => (
  <>
    <div className="cricket-scoreboard game-selection-card">
      <div className="cricket-header">
        <h2 className="game-selection-title">GAME SELECTION</h2>
      </div>
      {(!selectedPlayers.player1 ||
        (partyGames.find((g) => g.id === gameMode) &&
          !selectedPlayers.player2)) && (
        <div
          style={{
            textAlign: 'center',
            padding: '1rem',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '12px',
            marginBottom: '1rem',
            color: '#fcd34d',
            fontFamily: 'Orbitron, monospace',
            fontSize: '14px',
          }}
        >
          ⚠️ Go to PLAYERS tab to select{' '}
          {partyGames.find((g) => g.id === gameMode) ||
          standardGames.find((g) => g.id === gameMode)
            ? 'two players'
            : 'a player'}
          .
        </div>
      )}
      <div>
        <div className="game-section-headers-grid">
          <div
            className="game-section-header"
            onClick={() => toggleSection('standard')}
          >
            <GameSelectionIcon
              type="standard"
              expanded={activeGameSection === 'standard'}
            />
          </div>
          <div
            className="game-section-header"
            onClick={() => toggleSection('party')}
          >
            <GameSelectionIcon
              type="party"
              expanded={activeGameSection === 'party'}
            />
          </div>
          <div
            className="game-section-header"
            onClick={() => toggleSection('practice')}
          >
            <GameSelectionIcon
              type="practice"
              expanded={activeGameSection === 'practice'}
            />
          </div>
        </div>

        <div
          className={`game-mode-selector ${activeGameSection === 'standard' ? 'expanded' : ''}`}
        >
          {standardGames.map((game) => (
            <button
              key={game.id}
              className={`mode-btn ${gameMode === game.id ? 'active' : ''}`}
              onClick={() => setGameModeAndReset(game.id)}
            >
              {game.name}
            </button>
          ))}
        </div>
        <div
          className={`game-mode-selector ${activeGameSection === 'party' ? 'expanded' : ''}`}
        >
          {partyGames.map((game) => (
            <button
              key={game.id}
              className={`mode-btn ${gameMode === game.id ? 'active' : ''}`}
              onClick={() => setGameModeAndReset(game.id)}
            >
              {game.name}
            </button>
          ))}
        </div>
        <div
          className={`game-mode-selector ${activeGameSection === 'practice' ? 'expanded' : ''}`}
        >
          {practiceModes.map((game) => (
            <button
              key={game.id}
              className={`mode-btn ${gameMode === game.id ? 'active' : ''}`}
              onClick={() => setGameModeAndReset(game.id)}
            >
              {game.name}
            </button>
          ))}
          <button
            className={`mode-btn ${gameMode === 'freeplay' ? 'active' : ''}`}
            onClick={() => setGameModeAndReset('freeplay')}
          >
            Free Play
          </button>
        </div>
      </div>
    </div>

    {winner && (
      <div className="winner-display">
        <div className="winner-text">
          🏆{' '}
          {winner === 'Draw'
            ? 'GAME DRAWN!'
            : winner === 'Practice Over'
              ? 'PRACTICE COMPLETE'
              : `${gameState[winner.toLowerCase().replace(' ', '')].name} WINS!`}{' '}
          🏆
        </div>
      </div>
    )}

    {gameMode === 'killer' && <KillerScoreboard />}

    {gameMode === 'cricket' && (
      <>
        {showBoard && <div className="dartboard-card">{dartboardOverlay}</div>}
        <div className="cricket-scoreboard">
          <div className="cricket-header">
            <h2 className="cricket-title">CRICKET SCOREBOARD</h2>
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
            <button
              className="control-btn back-btn"
              onClick={goBackTurn}
              disabled={gameHistory.length === 0}
            >
              BACK TURN
            </button>
            <button className="control-btn" onClick={toggleBoardVisibility}>
              {showBoard ? 'HIDE BOARD' : 'SHOW BOARD'}
            </button>
          </div>
        </div>
        <div className="last-dart-display">
          {lastDart ? (
            <div>
              <span className="last-dart-text">LAST DART:</span>
              <span className="last-dart-value">{lastDart}</span>
            </div>
          ) : (
            <span className="last-dart-text">Waiting for dart throw...</span>
          )}
        </div>
        <div className="cricket-board">
          <div className="cricket-number">NUM</div>
          <div
            className={`player-column ${currentPlayer === 1 ? 'active' : ''}`}
          >
            <div className="player-name">{gameState.player1.name}</div>
            <div
              className={`dart-indicator ${currentPlayer === 1 ? 'active' : ''}`}
            >
              {currentPlayer === 1 ? `DART ${dartCount}/3` : 'WAITING'}
            </div>
            <div className="player-score">{gameState.player1.score}</div>
          </div>
          <div
            className={`player-column ${currentPlayer === 2 ? 'active' : ''}`}
          >
            <div className="player-name">{gameState.player2.name}</div>
            <div
              className={`dart-indicator ${currentPlayer === 2 ? 'active' : ''}`}
            >
              {currentPlayer === 2 ? `DART ${dartCount}/3` : 'WAITING'}
            </div>
            <div className="player-score">{gameState.player2.score}</div>
          </div>
          {cricketNumbers.concat(['bull']).map((num) => (
            <Fragment key={num}>
              <div
                className="cricket-number"
                onClick={() => handleCricketNumberClick(num)}
              >
                {num === 'bull' ? 'BULL' : num}
              </div>
              <div
                className={`marks-display ${gameState.player1.marks[num] === 3 ? 'closed' : ''}`}
              >
                {getMarkDisplay(gameState.player1.marks[num])}
              </div>
              <div
                className={`marks-display ${gameState.player2.marks[num] === 3 ? 'closed' : ''}`}
              >
                {getMarkDisplay(gameState.player2.marks[num])}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </>
    )}
    {['301', '501', '701'].includes(gameMode) && (
      <div className="cricket-scoreboard">
        <div className="cricket-header">
          <h2 className="cricket-title">{gameMode} SCOREBOARD</h2>
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
            <button
              className="control-btn back-btn"
              onClick={goBackTurn}
              disabled={gameHistory.length === 0}
            >
              BACK TURN
            </button>
            <button
              className="control-btn"
              onClick={() => setShowTotalInput((p) => !p)}
            >
              ENTER TURN TOTAL
            </button>
            {showTotalInput && (
              <div className="turn-total-input">
                <input
                  type="number"
                  min="0"
                  max="180"
                  aria-label="turn-total-input"
                  value={turnTotal}
                  onChange={(e) =>
                    setTurnTotal(parseInt(e.target.value, 10) || 0)
                  }
                />
                <button
                  className="control-btn"
                  onClick={() => {
                    handleTurnTotalSubmit(turnTotal)
                    setShowTotalInput(false)
                  }}
                >
                  SUBMIT
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="last-dart-display">
          {lastDart ? (
            <div>
              <span className="last-dart-text">LAST DART:</span>
              <span className="last-dart-value">{lastDart}</span>
            </div>
          ) : (
            <span className="last-dart-text">Waiting for dart throw...</span>
          )}
        </div>
        <div className="countdown-scoreboard">
          <div
            className={`countdown-player ${currentPlayer === 1 ? 'active' : ''}`}
          >
            <div className="player-name">{gameState.player1.name}</div>
            <div
              className={`dart-indicator ${currentPlayer === 1 ? 'active' : ''}`}
            >
              {currentPlayer === 1 ? `DART ${dartCount}/3` : 'WAITING'}
            </div>
            <div className="countdown-score">{gameState.player1.score}</div>
            <div className="checkout-suggestion">
              {currentPlayer === 1 &&
                checkoutSuggestion.length > 0 &&
                checkoutSuggestion.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
          <div
            className={`countdown-player ${currentPlayer === 2 ? 'active' : ''}`}
          >
            <div className="player-name">{gameState.player2.name}</div>
            <div
              className={`dart-indicator ${currentPlayer === 2 ? 'active' : ''}`}
            >
              {currentPlayer === 2 ? `DART ${dartCount}/3` : 'WAITING'}
            </div>
            <div className="countdown-score">{gameState.player2.score}</div>
            <div className="checkout-suggestion">
              {currentPlayer === 2 &&
                checkoutSuggestion.length > 0 &&
                checkoutSuggestion.map((s, i) => <span key={i}>{s}</span>)}
            </div>
          </div>
        </div>
        {bogeyWarning && (
          <div className="bogey-warning-display">💡 {bogeyWarning}</div>
        )}
      </div>
    )}

    {['scoring_practice_t20', 'checkout_challenge'].includes(gameMode) && (
      <div className="generic-scoreboard">
        <div className="cricket-header">
          <h2 className="cricket-title">
            {gameMode.replace(/_/g, ' ').toUpperCase()}
          </h2>
          <div className="game-controls">
            <button className="control-btn" onClick={resetGame}>
              RESET
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
        <div className="practice-scoreboard">
          <div className="practice-player practice-player-solo">
            <div className="player-name">{gameState.player1.name}</div>
            {gameMode === 'scoring_practice_t20' ? (
              <>
                <div className="practice-score">{gameState.player1.score}</div>
                <div className="target-display">
                  Darts Remaining: {gameState.player1.dartsRemaining}
                </div>
                {winner === 'Practice Over' && (
                  <div className="practice-summary">
                    <div className="practice-summary-stat">
                      T20s Hit: {gameState.player1.t20s}
                    </div>
                    <div className="practice-summary-stat">
                      S20s Hit: {gameState.player1.s20s}
                    </div>
                    <div className="practice-summary-stat">
                      Other: {gameState.player1.otherHits}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="practice-score">
                  {gameState.player1.currentTarget}
                </div>
                <div className="target-display">
                  Successful Checkouts: {gameState.player1.successfulCheckouts}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}

    {['bobs_27', 'around_the_clock', 'shanghai'].includes(gameMode) && (
      <div className="generic-scoreboard">
        <div className="cricket-header">
          <h2 className="cricket-title">
            {gameMode.replace(/_/g, ' ').toUpperCase()}
          </h2>
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
          {lastDart ? (
            <div>
              <span className="last-dart-text">LAST DART:</span>
              <span className="last-dart-value">{lastDart}</span>
            </div>
          ) : (
            <span className="last-dart-text">Waiting for dart throw...</span>
          )}
        </div>
        <div className="practice-scoreboard">
          <div
            className={`practice-player ${currentPlayer === 1 ? 'active' : ''}`}
          >
            <div className="player-name">{gameState.player1.name}</div>
            <div
              className={`dart-indicator ${currentPlayer === 1 ? 'active' : ''}`}
            >
              {currentPlayer === 1 ? `DART ${dartCount}/3` : 'WAITING'}
            </div>
            <div className="practice-score">{gameState.player1.score}</div>
            <div className="target-display">
              TARGET:{' '}
              {gameMode === 'bobs_27'
                ? `D${gameState.player1.currentTarget}`
                : gameMode === 'around_the_clock'
                  ? gameState.player1.currentTarget > 20
                    ? 'BULL'
                    : gameState.player1.currentTarget
                  : gameMode === 'shanghai'
                    ? gameState.player1.currentTarget
                    : ''}
            </div>
          </div>
          <div
            className={`practice-player ${currentPlayer === 2 ? 'active' : ''}`}
          >
            <div className="player-name">{gameState.player2.name}</div>
            <div
              className={`dart-indicator ${currentPlayer === 2 ? 'active' : ''}`}
            >
              {currentPlayer === 2 ? `DART ${dartCount}/3` : 'WAITING'}
            </div>
            <div className="practice-score">{gameState.player2.score}</div>
            <div className="target-display">
              TARGET:{' '}
              {gameMode === 'bobs_27'
                ? `D${gameState.player2.currentTarget}`
                : gameMode === 'around_the_clock'
                  ? gameState.player2.currentTarget > 20
                    ? 'BULL'
                    : gameState.player2.currentTarget
                  : gameMode === 'shanghai'
                    ? gameState.player2.currentTarget
                    : ''}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
)

export default ScoreboardUI
