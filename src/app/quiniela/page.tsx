export const dynamic = "force-dynamic"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getAllMatches } from "@/lib/api-football"
import { connectDB } from "@/lib/db"
import Prediction from "@/models/Prediction"
import QuinielaClient from "@/components/quiniela-client"

export default async function QuinielaPage() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const userEmail = session.user!.email!

  const [data, dbPredictions] = await Promise.all([
    getAllMatches(),
    (async () => {
      await connectDB()
      return Prediction.find({ userId: userEmail }).lean()
    })(),
  ])

  const groupMatches = data.matches.filter((m) => m.stage === "GROUP_STAGE")

  const predictions: Record<number, { homeScore: number; awayScore: number }> = {}
  dbPredictions.forEach((p: any) => {
    predictions[p.matchId] = { homeScore: p.homeScore, awayScore: p.awayScore }
  })

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <div className="mb-10">
        <p className="text-[var(--text-secondary)] text-sm mb-1">FIFA World Cup 2026</p>
        <h2 className="text-4xl font-bold">Mi <span className="text-gold">Quiniela</span></h2>
        <p className="text-[var(--text-secondary)] mt-2">
          Predice los resultados · Resultado exacto = 3pts · Ganador correcto = 1pt
        </p>
      </div>
      <QuinielaClient matches={groupMatches} initialPredictions={predictions} />
    </div>
  )
}