import TournamentDetail from '@/components/tournaments/TournamentDetail'

export default function TournamentPage({ params }) {
  const { id } = params
  return <TournamentDetail id={id} />
}
