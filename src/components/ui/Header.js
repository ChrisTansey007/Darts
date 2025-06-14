'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const links = [
    { href: '/game', label: 'Game', icon: '🎮' },
    { href: '/players', label: 'Players', icon: '👥' },
    { href: '/tournaments', label: 'Tournaments', icon: '🏆' },
  ]

  return (
    <nav className="min-h-16 flex gap-8 px-6 py-3 backdrop-blur-md bg-white/30 border-b border-white/20">
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-sm transition-colors ${
            pathname === href ? 'text-blue-600' : 'text-gray-800'
          }`}
        >
          <span className="text-xl" aria-hidden="true">
            {icon}
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
