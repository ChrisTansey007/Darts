'use client'

import Link from 'next/link'

export default function TournamentsFeature() {
  return (
    <div className="p-4 space-y-2">
      <div>Tournaments feature placeholder</div>
      <Link href="/tournaments/1" className="text-blue-500 underline">
        View sample tournament
      </Link>
    </div>
  )
}
