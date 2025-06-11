import React from 'react'

const PlayerManagement = ({
  newPlayerName,
  setNewPlayerName,
  addPlayer,
  players,
  selectedPlayers,
  selectPlayer,
  botOpponent,
  setBotOpponent,
  editingPlayer,
  setEditingPlayer,
  deletePlayer,
  updatePlayerName,
  generateBarChartData,
  generateRadarData,
  generateRadarGridPath,
  generateRadarAxes,
}) => (
        <div className="player-management">
          <div className="cricket-header">
            <h2 className="cricket-title">PLAYER MANAGEMENT</h2>
          </div>

          <div className="add-player-section">
            <input
              type="text"
              className="player-input"
              placeholder="Enter player name..."
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button className="add-btn" onClick={addPlayer}>
              ADD PLAYER
            </button>
          </div>

          <div className="player-selection">
            <div className="selection-title">SELECT PLAYERS FOR GAME</div>
            <div className="selection-grid">
              <div className="player-slot">
                <div className="slot-title">PLAYER 1</div>
                <div className="selected-player">
                  {selectedPlayers.player1
                    ? selectedPlayers.player1.name
                    : 'No player selected'}
                </div>
                <button
                  className="control-btn"
                  onClick={() => selectPlayer('player1', null)}
                >
                  CLEAR
                </button>
              </div>
              <div className="player-slot">
                <div className="slot-title">PLAYER 2</div>
                <div className="selected-player">
                  {selectedPlayers.player2
                    ? selectedPlayers.player2.name
                    : 'No player selected'}
                </div>
                <button
                  className="control-btn"
                  onClick={() => selectPlayer('player2', null)}
                >
                  CLEAR
                </button>
              </div>
            </div>
            <div className="bot-section">
              <h3 className="selection-title">PLAY VS. AI OPPONENT</h3>
              <div className="bot-slider">
                <label htmlFor="bot-difficulty">
                  Bot Difficulty (Avg. Score:{' '}
                  {botOpponent ? botOpponent.difficulty : 'N/A'})
                </label>
                <input
                  type="range"
                  id="bot-difficulty"
                  min="30"
                  max="90"
                  step="5"
                  defaultValue="60"
                  onChange={(e) =>
                    setBotOpponent({ difficulty: parseInt(e.target.value) })
                  }
                />
                <button
                  className="control-btn"
                  onClick={() => {
                    const botPlayer = {
                      id: 'bot',
                      name: `BOT (${botOpponent?.difficulty || 60})`,
                      isBot: true,
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
                    selectPlayer('player2', botPlayer)
                  }}
                >
                  Start Bot Match
                </button>
              </div>
            </div>
          </div>

          {selectedPlayers.player1 && selectedPlayers.player2 ? (
            <div className="player-comparison">
              <div className="comparison-header">
                <div className="comparison-title">PLAYER COMPARISON</div>
                <div className="comparison-subtitle">
                  {selectedPlayers.player1.name} vs{' '}
                  {selectedPlayers.player2.name}
                </div>
              </div>
              <div className="charts-grid">
                <div className="chart-container">
                  <div className="chart-title">Checkout %</div>
                  <div className="bar-chart">
                    {(() => {
                      const data = generateBarChartData(
                        'checkoutPercentage',
                        selectedPlayers.player1,
                        selectedPlayers.player2,
                      )
                      return (
                        <>
                          <div className="bar-group">
                            <div
                              className="bar"
                              style={{
                                '--color': '#22c55e',
                                height: `${data.player1.height}px`,
                              }}
                            >
                              <div className="bar-value">
                                {data.player1.value.toFixed(1)}%
                              </div>
                            </div>
                            <div
                              className="bar-label"
                              style={{ '--color': '#22c55e' }}
                            >
                              {selectedPlayers.player1.name}
                            </div>
                          </div>
                          <div className="bar-group">
                            <div
                              className="bar"
                              style={{
                                '--color': '#06b6d4',
                                height: `${data.player2.height}px`,
                              }}
                            >
                              <div className="bar-value">
                                {data.player2.value.toFixed(1)}%
                              </div>
                            </div>
                            <div
                              className="bar-label"
                              style={{ '--color': '#06b6d4' }}
                            >
                              {selectedPlayers.player2.name}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div className="chart-container">
                  <div className="chart-title">3-DART AVERAGE</div>
                  <div className="bar-chart">
                    {(() => {
                      const data = generateBarChartData(
                        'threeDartAverage',
                        selectedPlayers.player1,
                        selectedPlayers.player2,
                      )
                      return (
                        <>
                          <div className="bar-group">
                            <div
                              className="bar"
                              style={{
                                '--color': '#8b5cf6',
                                height: `${data.player1.height}px`,
                              }}
                            >
                              <div className="bar-value">
                                {data.player1.value.toFixed(1)}
                              </div>
                            </div>
                            <div
                              className="bar-label"
                              style={{ '--color': '#8b5cf6' }}
                            >
                              {selectedPlayers.player1.name}
                            </div>
                          </div>
                          <div className="bar-group">
                            <div
                              className="bar"
                              style={{
                                '--color': '#ef4444',
                                height: `${data.player2.height}px`,
                              }}
                            >
                              <div className="bar-value">
                                {data.player2.value.toFixed(1)}
                              </div>
                            </div>
                            <div
                              className="bar-label"
                              style={{ '--color': '#ef4444' }}
                            >
                              {selectedPlayers.player2.name}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div className="chart-container radar-chart-container">
                  <div className="chart-title">OVERALL PERFORMANCE</div>
                  <div className="radar-chart">
                    <svg className="radar-svg" viewBox="0 0 250 250">
                      <path
                        d={generateRadarGridPath()}
                        className="radar-grid"
                      />
                      <path d={generateRadarAxes()} className="radar-axis" />
                      {generateRadarData(selectedPlayers.player1).map(
                        (point, index) => (
                          <text
                            key={index}
                            x={point.labelX}
                            y={point.labelY}
                            className="radar-label"
                            dy="0.3em"
                          >
                            {point.label}
                          </text>
                        ),
                      )}
                      <polygon
                        points={generateRadarData(selectedPlayers.player1)
                          .map((p) => `${p.x},${p.y}`)
                          .join(' ')}
                        className="radar-area"
                        style={{ '--color': '#22c55e' }}
                      />
                      <polygon
                        points={generateRadarData(selectedPlayers.player2)
                          .map((p) => `${p.x},${p.y}`)
                          .join(' ')}
                        className="radar-area"
                        style={{ '--color': '#06b6d4' }}
                      />
                      {generateRadarData(selectedPlayers.player1).map(
                        (point, index) => (
                          <circle
                            key={`p1-${index}`}
                            cx={point.x}
                            cy={point.y}
                            className="radar-point"
                            style={{ '--color': '#22c55e' }}
                          />
                        ),
                      )}
                      {generateRadarData(selectedPlayers.player2).map(
                        (point, index) => (
                          <circle
                            key={`p2-${index}`}
                            cx={point.x}
                            cy={point.y}
                            className="radar-point"
                            style={{ '--color': '#06b6d4' }}
                          />
                        ),
                      )}
                    </svg>
                  </div>
                  <div className="legend">
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ '--color': '#22c55e' }}
                      ></div>
                      <div className="legend-text">
                        {selectedPlayers.player1.name}
                      </div>
                    </div>
                    <div className="legend-item">
                      <div
                        className="legend-color"
                        style={{ '--color': '#06b6d4' }}
                      ></div>
                      <div className="legend-text">
                        {selectedPlayers.player2.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="player-comparison">
              <div className="no-comparison">
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📊</div>
                <div style={{ fontSize: '18px', marginBottom: '0.5rem' }}>
                  Select two players to see comparison charts
                </div>
                <div style={{ fontSize: '14px' }}>
                  Choose players from the cards below to visualize their
                  performance
                </div>
              </div>
            </div>
          )}

          <div className="players-grid">
            {players.map((player) => (
              <div
                key={player.id}
                className={`player-card ${selectedPlayers.player1?.id === player.id || selectedPlayers.player2?.id === player.id ? 'selected' : ''}`}
              >
                <div className="player-header">
                  {editingPlayer === player.id ? (
                    <input
                      type="text"
                      className="player-input"
                      defaultValue={player.name}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        updatePlayerName(player.id, e.target.value)
                      }
                      onBlur={(e) =>
                        updatePlayerName(player.id, e.target.value)
                      }
                      autoFocus
                    />
                  ) : (
                    <div className="player-name">{player.name}</div>
                  )}
                  <div className="player-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => setEditingPlayer(player.id)}
                    >
                      EDIT
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deletePlayer(player.id)}
                    >
                      DEL
                    </button>
                    <button
                      className="action-btn select-btn"
                      onClick={() => {
                        if (
                          selectedPlayers.player1?.id === player.id ||
                          selectedPlayers.player2?.id === player.id
                        )
                          return
                        if (!selectedPlayers.player1)
                          selectPlayer('player1', player)
                        else if (!selectedPlayers.player2)
                          selectPlayer('player2', player)
                        else selectPlayer('player1', player) // Replace player 1 if both are full
                      }}
                      disabled={
                        selectedPlayers.player1?.id === player.id ||
                        selectedPlayers.player2?.id === player.id
                      }
                    >
                      {selectedPlayers.player1?.id === player.id ||
                      selectedPlayers.player2?.id === player.id
                        ? 'SELECTED'
                        : 'SELECT'}
                    </button>
                  </div>
                </div>
                <div className="player-stats">
                  <div className="stat-item">
                    <span className="stat-label">Win %</span>
                    <span className="stat-value">
                      {player.stats.gamesPlayed > 0
                        ? Math.round(
                            (player.stats.gamesWon / player.stats.gamesPlayed) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">3-Dart Avg</span>
                    <span className="stat-value">
                      {player.stats.threeDartAverage.toFixed(1)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Checkout %</span>
                    <span className="stat-value">
                      {player.stats.checkoutPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Highest Score</span>
                    <span className="stat-value">
                      {player.stats.highestScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
)

export default PlayerManagement
