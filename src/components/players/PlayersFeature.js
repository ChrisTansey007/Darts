'use client'

import { useState } from 'react'
import usePlayerStore from '@/stores/playerStore'

export default function PlayersFeature() {
  const {
    players,
    addPlayer,
    deletePlayer,
    selectPlayerForGame,
    selectedForGame,
    clearSelection,
  } = usePlayerStore((state) => state)

  const [name, setName] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    addPlayer({ name: name.trim() })
    setName('')
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-2">
        <input
          type="text"
          className="border px-2 py-1"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="px-2 py-1 bg-blue-500 text-white"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {players.map((p) => (
          <li key={p.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedForGame.includes(p.id)}
              onChange={() => selectPlayerForGame(p.id)}
            />
            <span className="flex-1">{p.name}</span>
            <button
              className="px-2 py-1 bg-red-500 text-white"
              onClick={() => deletePlayer(p.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {selectedForGame.length > 0 && (
        <button
          className="px-2 py-1 bg-gray-500 text-white"
          onClick={clearSelection}
        >
          Clear Selection
        </button>
      )}
    </div>
  )
}
