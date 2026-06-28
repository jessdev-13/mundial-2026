import { getAllMatches } from "@/lib/api-football"
import { Match } from "@/types/football"

function formatDate(utcDate: string) {
  return new Date(utcDate).toLocaleDateString("es-MX", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Mexico_City",
  })
}

function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "IN_PLAY"
  const isFinished = match.status === "FINISHED"
  const isMexico = match.homeTeam.name === "Mexico" || match.awayTeam.name === "Mexico"

  return (
    <div className={`rounded-xl p-4 border transition-colors ${
      isMexico
        ? "bg-[var(--surface-2)] border-[var(--mexico-green)]"
        : "bg-[var(--surface)] border-[var(--border)]"
    }`}>
      {isLive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-live live-dot"></span>
          <span className="text-xs text-live font-semibold uppercase tracking-wide">En vivo</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {match.homeTeam.crest && (
            <img src={match.homeTeam.crest} alt={match.homeTeam.name || ""} className="w-7 h-7 object-contain" />
          )}
          <span className="text-sm font-medium truncate">{match.homeTeam.shortName}</span>
        </div>
        <div className="text-center min-w-[60px]">
          {isLive || isFinished ? (
            <span className="text-lg font-bold text-gold">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </span>
          ) : (
            <span className="text-xs text-[var(--text-secondary)]">VS</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-medium truncate">{match.awayTeam.shortName}</span>
          {match.awayTeam.crest && (
            <img src={match.awayTeam.crest} alt={match.awayTeam.name || ""} className="w-7 h-7 object-contain" />
          )}
        </div>
      </div>
      {!isLive && !isFinished && (
        <p className="text-xs text-[var(--text-secondary)] text-center mt-2">
          {formatDate(match.utcDate)}
        </p>
      )}
    </div>
  )
}

export default async function Home() {
  const data = await getAllMatches()
  const mexicoMatches = data.matches.filter(
    (m) => m.homeTeam.name === "Mexico" || m.awayTeam.name === "Mexico"
  )
  const todayStr = new Date().toISOString().split("T")[0]
  const upcomingMatches = data.matches
    .filter((m) => m.stage === "GROUP_STAGE" && m.utcDate >= todayStr)
    .slice(0, 6)

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[var(--text-secondary)] text-sm mb-1">FIFA World Cup</p>
        <h2 className="text-4xl font-bold">Dashboard <span className="text-gold">2026</span></h2>
        <p className="text-[var(--text-secondary)] mt-2">11 Jun — 19 Jul · USA, México, Canadá</p>
      </div>

      {/* México */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🇲🇽</span>
          <h3 className="text-lg font-semibold">Partidos de México</h3>
        </div>
        <div className="grid gap-3">
          {mexicoMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* Próximos partidos */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Próximos partidos</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>
    </div>
  )
}