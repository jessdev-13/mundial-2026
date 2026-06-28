"use client"
import React, { useRef } from "react"
import { Match } from "@/types/football"

interface Prediction {
  homeScore: number
  awayScore: number
}

interface Props {
  matches: Match[]
  initialPredictions: Record<number, Prediction>
}

function formatDate(utcDate: string) {
  return new Date(utcDate).toLocaleDateString("es-MX", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: "America/Mexico_City",
  })
}

export default function QuinielaClient({ matches, initialPredictions }: Props) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [saving, setSaving] = React.useState<number | null>(null)
  const [saved, setSaved] = React.useState<Record<number, boolean>>({})

  const byGroup = matches.reduce((acc, match) => {
    const g = match.group || "OTHER"
    if (!acc[g]) acc[g] = []
    acc[g].push(match)
    return acc
  }, {} as Record<string, Match[]>)

  async function handleSave(matchId: number) {
    const homeInput = inputRefs.current[`${matchId}-home`]
    const awayInput = inputRefs.current[`${matchId}-away`]
    if (!homeInput || !awayInput) return

    const homeScore = Math.max(0, parseInt(homeInput.value) || 0)
    const awayScore = Math.max(0, parseInt(awayInput.value) || 0)

    setSaving(matchId)
    try {
      await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, homeScore, awayScore }),
      })
      setSaved((prev) => ({ ...prev, [matchId]: true }))
      setTimeout(() => setSaved((prev) => ({ ...prev, [matchId]: false })), 2000)
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {Object.entries(byGroup)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([group, groupMatches]) => (
          <section key={group}>
            <h3 className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">
              {group.replace("GROUP_", "Grupo ")}
            </h3>
            <div className="flex flex-col gap-3">
              {groupMatches.map((match) => {
                const pred = initialPredictions[match.id]
                const isMexico = match.homeTeam.name === "Mexico" || match.awayTeam.name === "Mexico"
                const isFinished = match.status === "FINISHED"

                return (
                  <div key={match.id} className={`rounded-xl border p-4 ${
                    isMexico
                      ? "bg-[var(--surface-2)] border-[var(--mexico-green)]"
                      : "bg-[var(--surface)] border-[var(--border)]"
                  }`}>
                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                      {formatDate(match.utcDate)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="text-sm font-medium text-right">{match.homeTeam.shortName}</span>
                        {match.homeTeam.crest && (
                          <img src={match.homeTeam.crest} alt="" className="w-6 h-6 object-contain" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          ref={(el) => { inputRefs.current[`${match.id}-home`] = el }}
                          type="number"
                          min={0}
                          max={20}
                          disabled={isFinished}
                          defaultValue={pred?.homeScore ?? 0}
                          className="w-10 text-center bg-[var(--surface-2)] border border-[var(--border)] rounded-lg py-1.5 text-sm font-bold text-gold focus:outline-none focus:border-gold disabled:opacity-50"
                        />
                        <span className="text-[var(--text-secondary)] text-xs">-</span>
                        <input
                          ref={(el) => { inputRefs.current[`${match.id}-away`] = el }}
                          type="number"
                          min={0}
                          max={20}
                          disabled={isFinished}
                          defaultValue={pred?.awayScore ?? 0}
                          className="w-10 text-center bg-[var(--surface-2)] border border-[var(--border)] rounded-lg py-1.5 text-sm font-bold text-gold focus:outline-none focus:border-gold disabled:opacity-50"
                        />
                      </div>

                      <div className="flex items-center gap-2 flex-1">
                        {match.awayTeam.crest && (
                          <img src={match.awayTeam.crest} alt="" className="w-6 h-6 object-contain" />
                        )}
                        <span className="text-sm font-medium">{match.awayTeam.shortName}</span>
                      </div>

                      {!isFinished && (
                        <button
                          onClick={() => handleSave(match.id)}
                          disabled={saving === match.id}
                          className={`shrink-0 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            saved[match.id]
                              ? "bg-[var(--mexico-green)] text-white"
                              : "bg-gold/20 text-gold hover:bg-gold/30 disabled:opacity-40"
                          }`}
                        >
                          {saving === match.id ? "..." : saved[match.id] ? "Guardado" : "Guardar"}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
    </div>
  )
}