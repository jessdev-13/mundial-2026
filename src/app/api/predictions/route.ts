import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { connectDB } from "@/lib/db"
import Prediction from "@/models/Prediction"
import { authOptions } from "@/lib/auth"
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  await connectDB()
  const predictions = await Prediction.find({ userId: session.user.email })
  return NextResponse.json({ predictions })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { matchId, homeScore, awayScore } = await req.json()

  if (matchId === undefined || homeScore === undefined || awayScore === undefined) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
  }

  await connectDB()

  const prediction = await Prediction.findOneAndUpdate(
    { userId: session.user.email, matchId },
    { homeScore, awayScore },
    { upsert: true, new: true }
  )

  return NextResponse.json({ prediction })
}