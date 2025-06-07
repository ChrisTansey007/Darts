import Link from "next/link";

export default function Header() {
  return (
    <nav className="flex gap-4 p-4 border-b">
      <Link href="/game">Game</Link>
      <Link href="/players">Players</Link>
      <Link href="/tournaments">Tournaments</Link>
    </nav>
  );
}
