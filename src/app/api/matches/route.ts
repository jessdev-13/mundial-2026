import { NextResponse } from "next/server"
import { getAllMatches } from "@/lib/api-football"

export async function GET() {
  try {
    const data = await getAllMatches()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching matches" }, { status: 500 })
  }
}