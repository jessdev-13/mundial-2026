import { NextResponse } from "next/server"
import { getLiveMatches } from "@/lib/api-football"

export async function GET() {
  try {
    const matches = await getLiveMatches()
    return NextResponse.json({ matches })
  } catch (error) {
    return NextResponse.json({ error: "Error fetching live matches" }, { status: 500 })
  }
}