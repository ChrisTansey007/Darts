// import TournamentDetail from '@/components/tournaments/TournamentDetail'

export default function TournamentPage({ params }) {
  const { id } = params
  return <div className="p-4">Tournament {id}</div>
}
