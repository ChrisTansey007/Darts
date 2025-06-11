'use client'

import { useState } from 'react'
import Link from 'next/link'
import useTournamentStore from '@/stores/tournamentStore'
import usePlayerStore from '@/stores/playerStore'

export default function TournamentsFeature() {
  const { tournaments, createTournament } = useTournamentStore((state) => state)
  const players = usePlayerStore((state) => state.players)
  const [name, setName] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createTournament({
      name: name.trim(),
      participants: players.map((p) => p.id),
    })
    setName('')
  }

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-2">
        <input
          type="text"
          className="border px-2 py-1"
          placeholder="Tournament name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="px-2 py-1 bg-blue-500 text-white"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
      <ul className="space-y-2">
        {tournaments.map((t) => (
          <li key={t.id} className="flex items-center space-x-2">
            <span className="flex-1">{t.name}</span>
            <Link
              href={`/tournaments/${t.id}`}
              className="text-blue-500 underline"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
