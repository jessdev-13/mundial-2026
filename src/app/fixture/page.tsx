import { getAllMatches } from "@/lib/api-football"
import { Match, MatchStage } from "@/types/football"

const STAGE_LABELS: Record<MatchStage, string> = {
  GROUP_STAGE: "Fase de Grupos",
  LAST_32: "Ronda de 32",
  LAST_16: "Octavos de Final",
  QUARTER_FINALS: "Cuartos de Final",
  SEMI_FINALS: "Semifinales",
  THIRD_PLACE: "Tercer Lugar",
  FINAL: "Gran Final",
}

function formatDate(utcDate: string) {
  return new Date(utcDate).toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long",
    timeZone: "America/Mexico_City",
  })
}

function formatTime(utcDate: string) {
  return new Date(utcDate).toLocaleTimeString("es-MX", {
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Mexico_City",
  })
}

function MatchRow({ match }: { match: Match }) {
  const isLive = match.status === "IN_PLAY"
  const isFinished = match.status === "FINISHED"
  const isMexico = match.homeTeam.name === "Mexico" || match.awayTeam.name === "Mexico"

  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
      isMexico
        ? "bg-[var(--surface-2)] border-[var(--mexico-green)]"
        : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--text-secondary)]"
    }`}>
      {/* Hora */}
      <div className="w-16 text-center shrink-0">
        {isLive ? (
          <div className="flex items-center gap-1 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-live live-dot"></span>
            <span className="text-xs text-live font-bold">LIVE</span>
          </div>
        ) : (
          <span className="text-xs text-[var(--text-secondary)]">{formatTime(match.utcDate)}</span>
        )}
      </div>

      {/* Home */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className="text-sm font-medium text-right">{match.homeTeam.shortName}</span>
        {match.homeTeam.crest && (
          <img src={match.homeTeam.crest} alt="" className="w-6 h-6 object-contain shrink-0" />
        )}
      </div>

      {/* Score */}
      <div className="w-16 text-center shrink-0">
        {isLive || isFinished ? (
          <span className="text-base font-bold text-gold">
            {match.score.fullTime.home} - {match.score.fullTime.away}
          </span>
        ) : (
          <span className="text-sm text-[var(--text-secondary)] font-medium">vs</span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-2 flex-1">
        {match.awayTeam.crest && (
          <img src={match.awayTeam.crest} alt="" className="w-6 h-6 object-contain shrink-0" />
        )}
        <span className="text-sm font-medium">{match.awayTeam.shortName}</span>
      </div>

      {/* Grupo */}
      {match.group && (
        <div className="w-20 text-right shrink-0">
          <span className="text-xs text-[var(--text-secondary)]">
            {match.group.replace("GROUP_", "Grupo ")}
          </span>
        </div>
      )}
    </div>
  )
}

export default async function FixturePage() {
  const data = await getAllMatches()

  // Agrupar por stage y luego por fecha
  const byStage = data.matches.reduce((acc, match) => {
    if (!acc[match.stage]) acc[match.stage] = {}
    const date = match.utcDate.split("T")[0]
    if (!acc[match.stage][date]) acc[match.stage][date] = []
    acc[match.stage][date].push(match)
    return acc
  }, {} as Record<string, Record<string, Match[]>>)

  const stageOrder: MatchStage[] = [
    "GROUP_STAGE", "LAST_32", "LAST_16",
    "QUARTER_FINALS", "SEMI_FINALS", "THIRD_PLACE", "FINAL"
  ]

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-10">
        <p className="text-[var(--text-secondary)] text-sm mb-1">FIFA World Cup 2026</p>
        <h2 className="text-4xl font-bold">Fixture <span className="text-gold">Completo</span></h2>
        <p className="text-[var(--text-secondary)] mt-2">{data.resultSet.count} partidos · 11 Jun — 19 Jul</p>
      </div>

      <div className="flex flex-col gap-10">
        {stageOrder.map((stage) => {
          if (!byStage[stage]) return null
          return (
            <section key={stage}>
              <h3 className="text-lg font-semibold text-gold mb-4">
                {STAGE_LABELS[stage]}
              </h3>
              <div className="flex flex-col gap-6">
                {Object.entries(byStage[stage])
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([date, matches]) => (
                    <div key={date}>
                      <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-2 pl-1">
                        {formatDate(date + "T12:00:00Z")}
                      </p>
                      <div className="flex flex-col gap-2">
                        {matches.map((match) => (
                          <MatchRow key={match.id} match={match} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}