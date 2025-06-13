import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 text-center font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Welcome to the Darts Scoreboard</h1>
      <p className="text-lg">Track games, players and tournaments with ease.</p>
      <nav className="flex gap-6">
        <Link className="underline" href="/game">
          Game
        </Link>
        <Link className="underline" href="/players">
          Players
        </Link>
        <Link className="underline" href="/tournaments">
          Tournaments
        </Link>
      </nav>
    </div>
  );
}
