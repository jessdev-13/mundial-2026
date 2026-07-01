export const dynamic = "force-dynamic"
import { getAllMatches } from "@/lib/api-football"
import { Match } from "@/types/football"

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

interface TeamStats {
  id: number | null
  name: string | null
  shortName: string | null
  crest: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

function calculateStandings(matches: Match[], group: string): TeamStats[] {
  const groupMatches = matches.filter(
    (m) => m.group === `GROUP_${group}` && m.stage === "GROUP_STAGE"
  )

  const teams = new Map<number, TeamStats>()

  groupMatches.forEach((match) => {
    const { homeTeam, awayTeam, score } = match
    if (!homeTeam.id || !awayTeam.id) return

    if (!teams.has(homeTeam.id)) {
      teams.set(homeTeam.id, {
        id: homeTeam.id, name: homeTeam.name, shortName: homeTeam.shortName,
        crest: homeTeam.crest, played: 0, won: 0, drawn: 0, lost: 0,
        goalsFor: 0, goalsAgainst: 0, points: 0,
      })
    }
    if (!teams.has(awayTeam.id)) {
      teams.set(awayTeam.id, {
        id: awayTeam.id, name: awayTeam.name, shortName: awayTeam.shortName,
        crest: awayTeam.crest, played: 0, won: 0, drawn: 0, lost: 0,
        goalsFor: 0, goalsAgainst: 0, points: 0,
      })
    }

    if (match.status === "FINISHED") {
      const home = teams.get(homeTeam.id)!
      const away = teams.get(awayTeam.id)!
      const hg = score.fullTime.home ?? 0
      const ag = score.fullTime.away ?? 0

      home.played++; away.played++
      home.goalsFor += hg; home.goalsAgainst += ag
      away.goalsFor += ag; away.goalsAgainst += hg

      if (hg > ag) {
        home.won++; home.points += 3; away.lost++
      } else if (hg < ag) {
        away.won++; away.points += 3; home.lost++
      } else {
        home.drawn++; home.points++
        away.drawn++; away.points++
      }
    }
  })

  return Array.from(teams.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    const aDiff = a.goalsFor - a.goalsAgainst
    const bDiff = b.goalsFor - b.goalsAgainst
    return bDiff - aDiff
  })
}

function GroupTable({ group, matches }: { group: string; matches: Match[] }) {
  const standings = calculateStandings(matches, group)

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="font-semibold text-gold">Grupo {group}</h3>
        <span className="text-xs text-[var(--text-secondary)]">Top 2 → siguiente fase</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-[var(--text-secondary)] border-b border-[var(--border)]">
            <th className="text-left px-4 py-2 font-medium w-8">#</th>
            <th className="text-left px-4 py-2 font-medium">Equipo</th>
            <th className="text-center px-2 py-2 font-medium">PJ</th>
            <th className="text-center px-2 py-2 font-medium">G</th>
            <th className="text-center px-2 py-2 font-medium">E</th>
            <th className="text-center px-2 py-2 font-medium">P</th>
            <th className="text-center px-2 py-2 font-medium">DG</th>
            <th className="text-center px-2 py-2 font-medium font-bold text-white">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => {
            const isMexico = team.name === "Mexico"
            const isQualifying = index < 2
            return (
              <tr key={team.id} className={`border-b border-[var(--border)] last:border-0 ${
                isMexico ? "bg-[var(--mexico-green)]/10" : ""
              }`}>
                <td className="px-4 py-3 text-[var(--text-secondary)]">
                  <div className="flex items-center gap-1">
                    {isQualifying && (
                      <span className="w-1 h-4 rounded-full bg-gold inline-block mr-1"></span>
                    )}
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {team.crest && (
                      <img src={team.crest} alt="" className="w-5 h-5 object-contain" />
                    )}
                    <span className={isMexico ? "font-semibold text-white" : ""}>{team.shortName}</span>
                  </div>
                </td>
                <td className="text-center px-2 py-3 text-[var(--text-secondary)]">{team.played}</td>
                <td className="text-center px-2 py-3 text-[var(--text-secondary)]">{team.won}</td>
                <td className="text-center px-2 py-3 text-[var(--text-secondary)]">{team.drawn}</td>
                <td className="text-center px-2 py-3 text-[var(--text-secondary)]">{team.lost}</td>
                <td className="text-center px-2 py-3 text-[var(--text-secondary)]">
                  {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}{team.goalsFor - team.goalsAgainst}
                </td>
                <td className="text-center px-2 py-3 font-bold text-gold">{team.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default async function GruposPage() {
  const data = await getAllMatches()

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <div className="mb-10">
        <p className="text-[var(--text-secondary)] text-sm mb-1">FIFA World Cup 2026</p>
        <h2 className="text-4xl font-bold">Tabla de <span className="text-gold">Grupos</span></h2>
        <p className="text-[var(--text-secondary)] mt-2">12 grupos · 48 selecciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {GROUPS.map((group) => (
          <GroupTable key={group} group={group} matches={data.matches} />
        ))}
      </div>
    </div>
  )
}