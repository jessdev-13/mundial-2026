import { NextResponse } from "next/server"
import { getTodayMatches } from "@/lib/api-football"

export async function GET() {
  try {
    const matches = await getTodayMatches()
    return NextResponse.json({ matches })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching today matches" }, { status: 500 })
  }
}